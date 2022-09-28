import { User } from '@prisma/client';
import errors from '../errors/errorsThrow';
import userRepository from '../repositories/userRepository';
import { UserInsertData } from '../types/userType';
import hash from '../utils/hashUtil';

async function insert(user: UserInsertData) {
  const isUser: User | null = await userRepository.findByEmail(user.email);

  if (isUser) {
    throw errors.conflict('user', 'registered');
  }

  const encryptedPassword = hash.encrypt(user.password);
  delete user.confirmPassword;

  await userRepository.insert({ ...user, password: encryptedPassword });
}

const userService = {
  insert,
};

export default userService;
