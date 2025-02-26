import * as crypto from "node:crypto";

export const generateSecretHash = (email: string, clientId: string, clientSecret: string) => {
  return crypto
    .createHmac("sha256", clientSecret)
    .update(email + clientId)
    .digest("base64");
};
