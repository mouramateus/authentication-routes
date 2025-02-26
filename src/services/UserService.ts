import { AppDataSource } from "../config/ormconfig";
import { User } from "../entities/User";

export const userRepository = AppDataSource.getRepository(User);

// Função para criar um novo usuário
export const createUser = async (name: string, email: string, role: string) => {
  const user = userRepository.create({ name, email, role });
  return await userRepository.save(user);
};

// Função para buscar um usuário pelo email
export const findUserByEmail = async (email: string) => {
  return await userRepository.findOneBy({ email });
};

// Função para atualizar os dados do usuário no banco
export const updateUser = async (user: User): Promise<User | null> => {
  try {
    // Aqui você pode atualizar os dados do usuário
    await userRepository.save(user); // Atualiza o usuário no banco de dados
    return user; // Retorna o usuário atualizado
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    return null; // Retorna null se houver erro
  }
};
