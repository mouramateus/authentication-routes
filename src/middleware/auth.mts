import Koa from "koa";
import dotenv from "dotenv";
import { createRemoteJWKSet, jwtVerify } from "jose";
import crypto from "node:crypto"; // Importa o módulo nativo

dotenv.config();

if (!globalThis.crypto) {
  globalThis.crypto = crypto as any;
}

const COGNITO_JWKS_URL = `https://cognito-idp.${process.env.AWS_REGION}.amazonaws.com/${process.env.COGNITO_USER_POOL_ID}/.well-known/jwks.json`;

export const authMiddleware = async (ctx: Koa.Context, next: Koa.Next) => {
  const token = ctx.headers.authorization?.split(" ")[1];

  if (!token) {
    ctx.status = 401;
    ctx.body = { message: "Unauthorized" };
    return;
  }

  try {
    const JWKS = createRemoteJWKSet(new URL(COGNITO_JWKS_URL));
    const { payload } = await jwtVerify(token, JWKS);
    ctx.state.user = payload;
    await next();
  } catch (error: any) {
    ctx.status = 403;
    ctx.body = { message: "Forbidden", error: error.message };
  }
};
