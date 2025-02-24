import Router from "koa-router";
import authRoutes from "./authRoutes";
import userRoutes from "./userRoutes";

const router = new Router();
router.use(authRoutes.routes());
router.use(userRoutes.routes());
export default router;
