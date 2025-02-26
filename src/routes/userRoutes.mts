import Router from "koa-router";
import { getUser, updateUser, getAllUsers } from "../controllers/UserController.mjs";
import { authMiddleware } from "../middleware/auth.mjs";
import { roleMiddleware } from "../middleware/role.js";

const router = new Router();

router.get("/me", authMiddleware, getUser);
router.patch("/edit-account", authMiddleware, updateUser);
router.get("/users", authMiddleware, roleMiddleware(["admin"]), getAllUsers);

export default router;
