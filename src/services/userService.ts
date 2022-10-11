import { User } from '@prisma/client';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import sgMail from '@sendgrid/mail';
import errors from '../errors/errorsThrow';
import userRepository from '../repositories/userRepository';
import { UserInsertData, UserLocal, UserLogin } from '../types/userType';
import hash from '../utils/hashUtil';

dotenv.config();

const { SECRET_KEY, SENDGRID_API_KEY, APP_URL } = process.env;

async function sendEmailToContributor(email: string): Promise<void> {
  sgMail.setApiKey(SENDGRID_API_KEY!);

  const msg = {
    to: email,
    from: 'daniell.ederli@hotmail.com',
    subject: 'Torne se um contribuidor!',
    text: 'Para validar e se tornar contribuidor, clique no link abaixo: ',
    html: `${APP_URL}/become/contributor?email=${email}`,
  };

  await sgMail.send(msg);
}

function generateValidToken(user: User): string {
  return jwt.sign({
    id: user.id, email: user.email, teacher: user.teacher,
  }, SECRET_KEY!, { expiresIn: '1h' });
}

async function makeUserContributor(email: string): Promise<UserLocal> {
  const isUser = await userRepository.findByEmail(email);

  if (!isUser) {
    throw errors.notFound('user', 'users');
  }

  await userRepository.updateMakeTeacher(email);

  const token = generateValidToken(isUser);

  return {
    token,
    teacher: true,
  };
}

async function insert(user: UserInsertData) {
  const isUser: User | null = await userRepository.findByEmail(user.email);

  if (isUser) {
    throw errors.conflict('user', 'registered');
  }

  const encryptedPassword = hash.encrypt(user.password);
  delete user.confirmPassword;

  await userRepository.insert({ ...user, password: encryptedPassword });

  if (user.teacher) {
    await makeUserContributor(user.email);
  }
}

async function login(user: UserLogin): Promise<UserLocal> {
  const isUser: User | null = await userRepository.findByEmail(user.email);

  if (!isUser) {
    throw errors.notFound('user', 'users');
  }

  if (!hash.compare(user.password, isUser.password)) {
    throw errors.badRequest('Wrong password');
  }

  const token = generateValidToken(isUser);

  return {
    token,
    teacher: isUser.teacher,
  };
}

const userService = {
  insert,
  login,
  generateValidToken,
  makeUserContributor,
  sendEmailToContributor,
};

export default userService;
