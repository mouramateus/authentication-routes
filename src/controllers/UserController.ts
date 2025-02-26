import { Context } from "koa";
import { findUserByEmail, updateUser as updateUserService, getAllUsers as getUsersService } from "../services/UserService";

// Interface para os dados de atualização do usuário
interface UpdateUserRequest {
  name?: string;
  role?: "admin" | "user";
}

/**
 * @desc Retorna os dados do usuário autenticado
 * @route GET /me
 */
export const getUser = async (ctx: Context) => {
  try {
    const email = ctx.state.user.email;
    const user = await findUserByEmail(email);

    if (!user) {
      ctx.status = 404;
      ctx.body = { message: "Usuário não encontrado" };
      return;
    }

    ctx.status = 200;
    ctx.body = user;
  } catch (error: any) {
    ctx.status = 500;
    ctx.body = { message: "Erro ao buscar usuário", error: error.message };
  }
};

/**
 * @desc Atualiza informações do usuário autenticado
 * @route PATCH /edit-account
 */
export const updateUser = async (ctx: Context) => {
  try {
    const { name, role } = ctx.request.body as UpdateUserRequest;
    const email = ctx.state.user.email;
    const userRole = ctx.state.user.role;

    let user = await findUserByEmail(email);

    if (!user) {
      ctx.status = 404;
      ctx.body = { message: "Usuário não encontrado" };
      return;
    }

    if (userRole === "admin") {
      user.name = name || user.name;
      user.role = role || user.role;
    } else {
      user.name = name || user.name;
    }

    user.isOnboarded = true;
    await updateUserService(user);

    ctx.status = 200;
    ctx.body = { message: "Usuário atualizado com sucesso", user };
  } catch (error: any) {
    ctx.status = 500;
    ctx.body = { message: "Erro ao atualizar usuário", error: error.message };
  }
};

/**
 * @desc Retorna todos os usuários (somente admin)
 * @route GET /users
 */
export const getAllUsers = async (ctx: Context) => {
  try {
    const users = await getUsersService();
    ctx.status = 200;
    ctx.body = users;
  } catch (error: any) {
    ctx.status = 500;
    ctx.body = { message: "Erro ao buscar usuários", error: error.message };
  }
};
