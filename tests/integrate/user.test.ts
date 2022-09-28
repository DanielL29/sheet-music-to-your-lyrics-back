import supertest from 'supertest';
import prisma from '../../src/database';
import app from '../../src/app';
import userFactory from '../factories/userFactory';

beforeEach(async () => {
  await prisma.$executeRaw`TRUNCATE TABLE "users", "musicContributors", "sheetMusics" RESTART IDENTITY`;
});

describe('POST /users/sign-up', () => {
  it('given a correct user object with no email registered, create a user, return 200', async () => {
    const user = userFactory.__createUser();

    const result = await supertest(app).post('/users/sign-up').send({ ...user, confirmPassword: user.password });

    expect(result.status).toBe(201);
  });

  it('given a email registered throw a conflict, return 409', async () => {
    const user = await userFactory.__insertUser();

    const result = await supertest(app).post('/users/sign-up').send({
      name: user.name,
      email: user.email,
      password: user.password,
      confirmPassword: user.password,
    });

    expect(result.status).toBe(409);
  });

  it('given a empty object throw a unprocessable entity, return 422', async () => {
    const result = await supertest(app).post('/users/sign-up').send();

    expect(result.status).toBe(422);
  });
});

afterAll(async () => {
  await prisma.$disconnect();
});
