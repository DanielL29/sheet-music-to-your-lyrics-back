import supertest from 'supertest';
import prisma from '../../src/database';
import app from '../../src/app';
import userFactory from '../factories/userFactory';

beforeEach(async () => {
  await prisma.$executeRaw`TRUNCATE TABLE "users", "musicContributors", "sheetMusics" RESTART IDENTITY`;
});

describe('POST /users/sign-up', () => {
  it('given a correct user object with no email registered, create a user, return 201', async () => {
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

describe('POST /users/sign-in', () => {
  it('given a correct user object to login, return 200 and receive a token', async () => {
    const user = await userFactory.__insertUser();

    const result = await supertest(app).post('/users/sign-in').send({
      email: user.email,
      password: user.password,
    });

    expect(result.status).toBe(200);
    expect(result.body).toBeInstanceOf(Object);
  });

  it('given a not found email return 404', async () => {
    const user = userFactory.__createUser();

    const result = await supertest(app).post('/users/sign-in').send({
      email: user.email,
      password: user.password,
    });

    expect(result.status).toBe(404);
  });

  it('given a empty object throw a unprocessable entity, return 422', async () => {
    const result = await supertest(app).post('/users/sign-in').send();

    expect(result.status).toBe(422);
  });
});

afterAll(async () => {
  await prisma.$disconnect();
});
