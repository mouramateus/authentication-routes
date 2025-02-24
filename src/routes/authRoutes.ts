import Router from "koa-router";
import { login } from "../controllers/UserController";

const router = new Router();
router.post("/auth", login);
export default router;
