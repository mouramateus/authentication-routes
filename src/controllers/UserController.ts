import { createUser, findUserByEmail, userRepository } from "../services/UserService";
import { generateToken } from "../utils/jwt";
import Koa from "koa";

// Definição de tipos para melhor controle
interface LoginRequest {
  email: string;
  name: string;
  role: string;
}

interface UserPayload {
  id: string;
  email: string;
  name: string;
  role: string;
  isOnboarded?: boolean;
}

export const login = async (ctx: Koa.Context) => {
  const { email, name, role } = ctx.request.body as LoginRequest;

  let user = await findUserByEmail(email);
  if (!user) {
    user = await createUser(name, email, role);
  }

  const token = generateToken({ id: user.id, role: user.role });
  ctx.body = { token, user };
};

export const getUser = async (ctx: Koa.Context) => {
  ctx.body = ctx.state.user as UserPayload;
};

export const updateUser = async (ctx: Koa.Context) => {
  const { name, role } = ctx.request.body as Partial<UserPayload>;
  const user = await findUserByEmail((ctx.state.user as UserPayload).email);

  if (!user) {
    ctx.status = 404;
    ctx.body = { message: "User not found" };
    return;
  }

  if ((ctx.state.user as UserPayload).role === "admin") {
    user.role = role!;
  }

  user.name = name!;
  user.isOnboarded = true;
  await userRepository.save(user);

  ctx.body = { message: "User updated successfully" };
};

export const getAllUsers = async (ctx: Koa.Context) => {
  if ((ctx.state.user as UserPayload).role !== "admin") {
    ctx.status = 403;
    ctx.body = { message: "Forbidden" };
    return;
  }

  const users = await userRepository.find();
  ctx.body = users;
};
