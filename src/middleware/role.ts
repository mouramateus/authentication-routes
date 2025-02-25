import Koa from "koa";

export const roleMiddleware = (allowedRoles: string[]) => {
  return async (ctx: Koa.Context, next: Koa.Next) => {
    if (!ctx.state.user || !allowedRoles.includes(ctx.state.user.role)) {
      ctx.status = 403;
      ctx.body = { message: "Forbidden" };
      return;
    }
    await next();
  };
};
