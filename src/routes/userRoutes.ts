import Router from "koa-router";
import {
  getUser,
  updateUser,
  getAllUsers,
} from "../controllers/UserController";
import { authMiddleware } from "../middleware/auth";

const router = new Router();
router.get("/me", authMiddleware, getUser);
router.patch("/edit-account", authMiddleware, updateUser);
router.get("/users", authMiddleware, getAllUsers);
export default router;
