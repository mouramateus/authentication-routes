import { configDotenv } from "dotenv";
import jwt from "jsonwebtoken";

configDotenv();

export const generateToken = (payload: object) => {
  return jwt.sign(payload, process.env.COGNITO_PUBLIC_KEY!, {
    expiresIn: "1h",
  });
};
