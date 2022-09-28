import { User } from '@prisma/client';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import errors from '../errors/errorsThrow';
import userRepository from '../repositories/userRepository';
import { UserInsertData } from '../types/userType';
import hash from '../utils/hashUtil';

const secretKey = process.env.SECRET_KEY;

async function insert(user: UserInsertData) {
  const isUser: User | null = await userRepository.findByEmail(user.email);

  if (isUser) {
    throw errors.conflict('user', 'registered');
  }

  const encryptedPassword = hash.encrypt(user.password);
  delete user.confirmPassword;

  await userRepository.insert({ ...user, password: encryptedPassword });
}

async function login(user: UserInsertData): Promise<string> {
  const isUser: User | null = await userRepository.findByEmail(user.email);

  if (!isUser) {
    throw errors.notFound('user', 'users');
  }

  const token = jwt.sign({ id: isUser.id, name: isUser.name }, secretKey!, { expiresIn: '1h' });

  return token;
}

const userService = {
  insert,
  login,
};

export default userService;
