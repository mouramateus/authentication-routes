import { Context } from "koa";
import AWS from "aws-sdk";
import { generateSecretHash } from "../utils/generateSecretHash.js";
import dotenv from "dotenv";
import { addUserToGroup, signIn } from "../services/cognitoService.mjs";
import { createUser, findUserByEmail } from "../services/UserService.mjs";
import { compareCognitoToDB } from "../utils/compareCognitoToDB.mjs";

interface AuthRequest {
  email: string;
  password: string;
  name: string;
}

dotenv.config();

const cognito = new AWS.CognitoIdentityServiceProvider();;
const clientId = process.env.COGNITO_CLIENT_ID!;
const clientSecret = process.env.COGNITO_CLIENT_SECRET!;
const userPoolId = process.env.COGNITO_USER_POOL_ID!;

export const authController = {
  async auth(ctx: Context) {
    const { email, password, name } = ctx.request.body as AuthRequest;

    if (!email || !password) {
      ctx.status = 400;
      ctx.body = { message: "Email e senha são obrigatórios." };
      return;
    }

    const secretHash = generateSecretHash(email, clientId, clientSecret);

    try {
      // Verifica se o usuário já existe no Cognito
      await cognito.adminGetUser({ UserPoolId: userPoolId, Username: email }).promise();

      // Busca o usuário no banco de dados e sincroniza com o Cognito
      let user = await findUserByEmail(email);
      user = await compareCognitoToDB(user, email, name || "Usuário");

      // Autenticação do usuário no Cognito
      const token = await signIn(email, password);

      ctx.status = 200;
      ctx.body = { message: "Autenticado com sucesso!", token };
      return;
    } catch (error: any) {
      if (error.code === "UserNotFoundException") {
        try {
          // Criar usuário no Cognito
          await cognito.signUp({
            ClientId: clientId,
            Username: email,
            Password: password,
            SecretHash: secretHash,
            UserAttributes: [{ Name: "email", Value: email }, { Name: "name", Value: name || "Usuário" }],
          }).promise();

          // Adiciona ao grupo padrão
          await addUserToGroup(email, "users");

          // Criação no banco de dados
          const newUser = await createUser(name || "Usuário", email, "user");

          ctx.status = 201;
          ctx.body = { message: "Usuário registrado com sucesso. Confirme o email manualmente no Cognito.", user: newUser };
          return;
        } catch (signupError) {
          ctx.status = 500;
          ctx.body = { message: "Erro ao registrar usuário", error: (signupError as Error).message };
          return;
        }
      }

      ctx.status = 401;
      ctx.body = { message: "Erro ao autenticar usuário", error: error.message };
    }
  },
};
