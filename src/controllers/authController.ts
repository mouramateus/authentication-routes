import { Context } from "koa";
import { CognitoIdentityServiceProvider } from "aws-sdk";
import { generateSecretHash } from "../utils/generateSecretHash";
import dotenv from "dotenv";

interface AuthRequest {
  email: string;
  password: string;
  name?: string;
}

dotenv.config();

const cognito = new CognitoIdentityServiceProvider();

export const authController = {
  async auth(ctx: Context) {
    const { email, password, name } = ctx.request.body as AuthRequest;

    if (!email || !password) {
      ctx.status = 400;
      ctx.body = { message: "Email e senha são obrigatórios." };
      return;
    }

    const clientId = process.env.COGNITO_CLIENT_ID!;
    const clientSecret = process.env.COGNITO_CLIENT_SECRET!;
    const userPoolId = process.env.COGNITO_USER_POOL_ID!;

    const secretHash = generateSecretHash(email, clientId, clientSecret);

    try {
      // Tenta autenticar o usuário
      const authResponse = await cognito
        .initiateAuth({
          AuthFlow: "USER_PASSWORD_AUTH",
          ClientId: clientId,
          AuthParameters: {
            USERNAME: email,
            PASSWORD: password,
            SECRET_HASH: secretHash,
          },
        })
        .promise();

      ctx.status = 200;
      ctx.body = {
        message: "Autenticado com sucesso!",
        token: authResponse.AuthenticationResult?.IdToken,
      };
    } catch (error: any) {
      if (error.code === "UserNotFoundException") {
        // Se o usuário não for encontrado, cria um novo usuário no Cognito
        try {
          await cognito
            .signUp({
              ClientId: clientId,
              Username: email,
              Password: password,
              SecretHash: secretHash,
              UserAttributes: [
                { Name: "email", Value: email },
                { Name: "name", Value: name || "Usuário" },
              ],
            })
            .promise();

          ctx.status = 201;
          ctx.body = {
            message:
              "Usuário registrado com sucesso. Confirme o email no Cognito.",
          };
          return;
        } catch (signupError) {
          ctx.status = 500;
          ctx.body = {
            message: "Erro ao registrar usuário",
            error: (signupError as Error).message,
          };
          return;
        }
      }

      ctx.status = 401;
      ctx.body = {
        message: "Erro ao autenticar usuário",
        error: error.message,
      };
    }
  },
};
