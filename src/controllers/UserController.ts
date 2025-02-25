import { Context } from "koa";
import { signIn } from "../services/cognitoService";
import { userRepository } from "../services/UserService";
import { User } from "../entities/User";

// Interface para os dados de entrada no login
interface LoginRequest {
  email: string;
  password: string;
  name?: string;
  role?: "admin" | "user";
}

// Interface para os dados de atualização do usuário
interface UpdateUserRequest {
  name?: string;
  role?: "admin" | "user";
}

/**
 * @desc Login ou Registro de Usuário (SignInOrRegister)
 * @route POST /auth
 */
export const login = async (ctx: Context) => {
  try {
    const { email, password, name, role } = ctx.request.body as LoginRequest;

    let user = await userRepository.findOneBy({ email });

    if (!user) {
      // Se não existir, cria um novo usuário no banco
      user = userRepository.create({ name, email, role: role || "user" });
      await userRepository.save(user);
    }

    // Autentica no Cognito e retorna um token JWT
    const token = await signIn(email, password);

    ctx.status = 200;
    ctx.body = { message: "Login realizado com sucesso", token };
  } catch (error: any) {
    ctx.status = 400;
    ctx.body = { message: "Erro ao autenticar usuário", error: error.message };
  }
};

/**
 * @desc Retorna os dados do usuário autenticado
 * @route GET /me
 */
export const getUser = async (ctx: Context) => {
  try {
    const email: string = ctx.state.user.email;
    const user = await userRepository.findOneBy({ email });

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
    const email: string = ctx.state.user.email;
    const userRole: "admin" | "user" = ctx.state.user.role;

    let user = await userRepository.findOneBy({ email });

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

    await userRepository.save(user);

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
    const users: User[] = await userRepository.find();
    ctx.status = 200;
    ctx.body = users;
  } catch (error: any) {
    ctx.status = 500;
    ctx.body = { message: "Erro ao buscar usuários", error: error.message };
  }
};
