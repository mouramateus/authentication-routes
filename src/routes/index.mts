import Router from "koa-router";
import authRoutes from "./authRoutes.mjs";
import userRoutes from "./userRoutes.mjs";

const router = new Router();
router.use(authRoutes.routes());
router.use(userRoutes.routes());
export default router;
export function allowedMethods(): import("koa").Middleware<import("koa").DefaultState, import("koa").DefaultContext, any> {
  throw new Error("Function not implemented.");
}

export function routes(): import("koa").Middleware<import("koa").DefaultState, import("koa").DefaultContext, any> {
  throw new Error("Function not implemented.");
}

