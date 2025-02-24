import { configDotenv } from "dotenv";
import jwt from "jsonwebtoken";
import Koa from "koa";

configDotenv();

export const authMiddleware = async (ctx: Koa.Context, next: Koa.Next) => {
  const token = ctx.headers.authorization?.split(" ")[1];

  if (!token) {
    ctx.status = 401;
    ctx.body = { message: "Não autorizado" };
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.COGNITO_PUBLIC_KEY!);
    ctx.state.user = decoded;
    await next();
  } catch (error) {
    console.error('Erro ao verificar token:', error);
    ctx.status = 403;
    ctx.body = { message: "Forbidden", error: error };
  }
};
