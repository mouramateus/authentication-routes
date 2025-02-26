import { AppDataSource } from "../config/ormconfig";
import { User } from "../entities/User";

export const userRepository = AppDataSource.getRepository(User);

// Criar novo usuário no banco de dados
export const createUser = async (name: string, email: string, role: string) => {
  const user = userRepository.create({ name, email, role });
  return await userRepository.save(user);
};

// Buscar usuário pelo email
export const findUserByEmail = async (email: string) => {
  return await userRepository.findOneBy({ email });
};

// Atualizar usuário no banco de dados
export const updateUser = async (user: User) => {
  return await userRepository.save(user);
};

// Buscar todos os usuários (apenas admins)
export const getAllUsers = async () => {
  return await userRepository.find();
};
