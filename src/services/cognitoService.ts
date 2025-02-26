import { CognitoUser, AuthenticationDetails } from "amazon-cognito-identity-js";
import { userPool } from "../config/awsCognito";
import AWS from "aws-sdk";
import dotenv from "dotenv";
import { generateSecretHash } from "../utils/generateSecretHash";

dotenv.config();

const cognito = new AWS.CognitoIdentityServiceProvider({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

// Função para autenticação no Cognito via SDK
export async function signIn(username: string, password: string): Promise<string> {
  const clientId = process.env.COGNITO_CLIENT_ID!;
  const clientSecret = process.env.COGNITO_CLIENT_SECRET!;

  const secretHash = generateSecretHash(username, clientId, clientSecret);

  try {
    const authResponse = await cognito
      .initiateAuth({
        AuthFlow: "USER_PASSWORD_AUTH",
        ClientId: clientId,
        AuthParameters: {
          USERNAME: username,
          PASSWORD: password,
          SECRET_HASH: secretHash,
        },
      })
      .promise();

    return authResponse.AuthenticationResult?.IdToken || "";
  } catch (error) {
    throw new Error("Erro ao autenticar no Cognito: " + (error as Error).message);
  }
}

// Adicionar usuário a um grupo do Cognito
export async function addUserToGroup(username: string, groupName = "user") {
  try {
    await cognito.adminAddUserToGroup({
      GroupName: groupName,
      UserPoolId: process.env.COGNITO_USER_POOL_ID!,
      Username: username,
    }).promise();

    console.log(`Usuário ${username} adicionado ao grupo ${groupName}`);
  } catch (error) {
    console.error("Erro ao adicionar usuário ao grupo:", error);
  }
}
