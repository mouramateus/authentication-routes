import Router from "koa-router";
import { authController } from "../controllers/authController.mjs";

const router = new Router();

router.post("/auth", authController.auth);

export default router;

export function routes(): Router.IMiddleware<any, {}> {
  throw new Error("Function not implemented.");
}
