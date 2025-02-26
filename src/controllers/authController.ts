import { Context } from "koa";
import { CognitoIdentityServiceProvider } from "aws-sdk";
import { generateSecretHash } from "../utils/generateSecretHash";
import dotenv from "dotenv";
import { addUserToGroup } from "../services/cognitoService";
import { createUser, findUserByEmail } from "../services/UserService";
import { compareCognitoToDB } from "../utils/compareCognitoToDB";

interface AuthRequest {
  email: string;
  password: string;
  name: string;
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
      // Verifica se o usuário existe no Cognito
      await cognito
        .adminGetUser({
          UserPoolId: userPoolId,
          Username: email,
        })
        .promise();

        let user = await findUserByEmail(email);
        user = await compareCognitoToDB(user, email, (name || "Usuário"));

      // Tenta autenticar o usuário no cognito
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
        user: user,
      };
    } catch (error: any) {
      // Se o usuário não for encontrado, cria um novo usuário no Cognito
      if (error.code === "UserNotFoundException") {
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

          // Adiciona o usuário ao grupo "users" do Cognito
          await addUserToGroup(email, "users");

          // Agora cria o usuário no banco de dados
          const newUser = await createUser((name! || "Usuário"), email, "user");

          ctx.status = 201;
          ctx.body = {
            message:
              "Usuário registrado com sucesso. Confirme o email manualmente no Cognito.",
              user: newUser,
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

      //Se o erro for de senha incorreta ou outro problema, retorna erro de autenticação
      ctx.status = 401;
      ctx.body = {
        message: "Erro ao autenticar usuário",
        error: error.message,
      };
    }
  },
};
