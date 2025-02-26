import Koa from "koa";

export const roleMiddleware = (allowedRoles: string[]) => {
  return async (ctx: Koa.Context, next: Koa.Next) => {

    if (!ctx.state.user || !ctx.state.user["cognito:groups"]) {
      ctx.status = 403;
      ctx.body = { message: "Forbidden - Sem grupos" };
      return;
    }

    const userRoles = ctx.state.user["cognito:groups"];

    if (!allowedRoles.some(role => userRoles.includes(role))) {
      ctx.status = 403;
      ctx.body = { message: "Forbidden - Sem permissão" };
      return;
    }

    await next();
  };
};
