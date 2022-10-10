import { faker } from '@faker-js/faker';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import prisma from '../../src/database';

dotenv.config();

const secretKey = process.env.SECRET_KEY;

function __createUser() {
  return {
    name: faker.name.fullName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    teacher: false,
  };
}

function __genereateToken(id: number, name: string): string {
  return jwt.sign({ id, name }, secretKey!, { expiresIn: '1h' });
}

async function __insertUser() {
  const user = __createUser();

  const insertedUser = await prisma.user.create({ data: user });

  return { id: insertedUser.id, ...user };
}

const userFactory = {
  __createUser,
  __genereateToken,
  __insertUser,
};

export default userFactory;
