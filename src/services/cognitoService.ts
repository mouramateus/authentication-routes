import { CognitoUser, AuthenticationDetails } from "amazon-cognito-identity-js";
import { userPool } from "../config/awsCognito";

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