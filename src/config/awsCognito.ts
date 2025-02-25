import { CognitoUserPool } from "amazon-cognito-identity-js";
import dotenv from "dotenv";

dotenv.config();

const poolData = {
  UserPoolId: process.env.COGNITO_USER_POOL_ID!,
  ClientId: process.env.COGNITO_CLIENT_ID!,
};

export const userPool = new CognitoUserPool(poolData);