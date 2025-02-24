import { AppDataSource } from "../config/ormconfig";
import { User } from "../entities/User";

export const userRepository = AppDataSource.getRepository(User);

export const createUser = async (name: string, email: string, role: string) => {
  const user = userRepository.create({ name, email, role });
  return await userRepository.save(user);
};

export const findUserByEmail = async (email: string) => {
  return await userRepository.findOneBy({ email });
};
