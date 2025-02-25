import Router from "koa-router";
import { authController } from "../controllers/authController";

const router = new Router();

router.post("/auth", authController.auth);

export default router;
