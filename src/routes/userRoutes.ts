import Router from "koa-router";
import { getUser, updateUser, getAllUsers } from "../controllers/UserController";
import { authMiddleware } from "../middleware/auth";
import { roleMiddleware } from "../middleware/role";

const router = new Router();

router.get("/me", authMiddleware, getUser);
router.patch("/edit-account", authMiddleware, updateUser);
router.get("/users", authMiddleware, roleMiddleware(["admin"]), getAllUsers);

export default router;
