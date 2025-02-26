import { CognitoUser, AuthenticationDetails } from "amazon-cognito-identity-js";
import { userPool } from "../config/awsCognito";
import AWS from "aws-sdk";
import dotenv from "dotenv";

export function signIn(username: string, password: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const user = new CognitoUser({ Username: username, Pool: userPool });
    const authDetails = new AuthenticationDetails({ Username: username, Password: password });

    user.authenticateUser(authDetails, {
      onSuccess: (result) => resolve(result.getAccessToken().getJwtToken()),
      onFailure: (err) => reject(err),
    });
  });
}

dotenv.config();

const cognito = new AWS.CognitoIdentityServiceProvider({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});


export async function addUserToGroup(username: string, groupName = "user") {
  try {
    await cognito
      .adminAddUserToGroup({
        GroupName: groupName,
        UserPoolId: process.env.COGNITO_USER_POOL_ID!,
        Username: username,
      })
      .promise();

    console.log(`Usuário ${username} adicionado ao grupo ${groupName}`);
  } catch (error) {
    console.error("Erro ao adicionar usuário ao grupo:", error);
  }
}
