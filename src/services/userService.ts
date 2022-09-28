import { User } from '@prisma/client';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import errors from '../errors/errorsThrow';
import userRepository from '../repositories/userRepository';
import { UserInsertData, UserLogin } from '../types/userType';
import hash from '../utils/hashUtil';

dotenv.config();

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

function generateValidToken(id: number, name: string): string {
  return jwt.sign({ id, name }, secretKey!, { expiresIn: '1h' });
}

async function login(user: UserLogin): Promise<string> {
  const isUser: User | null = await userRepository.findByEmail(user.email);

  if (!isUser) {
    throw errors.notFound('user', 'users');
  }

  if (!hash.compare(user.password, isUser.password)) {
    throw errors.badRequest('Wrong password');
  }

  const token = generateValidToken(isUser.id, isUser.name);

  return token;
}

const userService = {
  insert,
  login,
  generateValidToken,
};

export default userService;
