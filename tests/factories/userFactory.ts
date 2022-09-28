import { faker } from '@faker-js/faker';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

const secretKey = process.env.SECRET_KEY;

function __createUser() {
  return {
    name: faker.name.fullName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  };
}

function __genereateToken(id: number, name: string): string {
  return jwt.sign({ id, name }, secretKey!, { expiresIn: '1h' });
}

const userFactory = {
  __createUser,
  __genereateToken,
};

export default userFactory;
