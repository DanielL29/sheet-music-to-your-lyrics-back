import { faker } from '@faker-js/faker';
import prisma from '../../src/database';

function __createUser() {
  return {
    name: faker.name.fullName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  };
}

async function __insertUser() {
  const user = __createUser();

  return prisma.user.create({ data: user });
}

const userFactory = {
  __createUser,
  __insertUser,
};

export default userFactory;
