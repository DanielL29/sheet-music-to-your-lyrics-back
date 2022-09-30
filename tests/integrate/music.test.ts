import supertest from 'supertest';
import prisma from '../../src/database';
import app from '../../src/app';
import musicFactory from '../factories/musicFactory';
import userFactory from '../factories/userFactory';

beforeEach(async () => {
  await prisma.$executeRaw`TRUNCATE TABLE "users", "musics", "musicContributors", "sheetMusics" RESTART IDENTITY`;
});

describe('POST /musics/create', () => {
  it('given a correct music object, return 201', async () => {
    const music = musicFactory.__createMusic();
    const user = await userFactory.__insertUser();
    const token = userFactory.__genereateToken(user.id, user.name);

    const result = await supertest(app)
      .post('/musics/create')
      .set({ Authorization: `Bearer ${token}` })
      .send(music);

    expect(result.status).toBe(201);
  });

  it('given a music name already registered, return 409', async () => {
    const music = musicFactory.__createMusic();
    const user = await userFactory.__insertUser();
    const token = userFactory.__genereateToken(user.id, user.name);

    await supertest(app)
      .post('/musics/create')
      .set({ Authorization: `Bearer ${token}` })
      .send(music);

    const result = await supertest(app)
      .post('/musics/create')
      .set({ Authorization: `Bearer ${token}` })
      .send(music);

    expect(result.status).toBe(409);
  });

  it('given a not found category, return 404', async () => {
    const music = musicFactory.__createMusic();
    const user = await userFactory.__insertUser();
    const token = userFactory.__genereateToken(user.id, user.name);

    const result = await supertest(app)
      .post('/musics/create')
      .set({ Authorization: `Bearer ${token}` })
      .send({ ...music, categoryId: -1 });

    expect(result.status).toBe(404);
  });

  it('given a unkown music name to vagalume api, return 404', async () => {
    const music = musicFactory.__createMusic();
    const user = await userFactory.__insertUser();
    const token = userFactory.__genereateToken(user.id, user.name);

    const result = await supertest(app)
      .post('/musics/create')
      .set({ Authorization: `Bearer ${token}` })
      .send({ ...music, name: 'wrong music to test in sheet music to your lyrics app' });

    expect(result.status).toBe(404);
  });

  it('given a empty object throw a unprocessable entity, return 422', async () => {
    const user = await userFactory.__insertUser();
    const token = userFactory.__genereateToken(user.id, user.name);

    const result = await supertest(app)
      .post('/musics/create')
      .set({ Authorization: `Bearer ${token}` })
      .send();

    expect(result.status).toBe(422);
  });

  it('given a body without header, return 401', async () => {
    const result = await supertest(app)
      .post('/musics/create')
      .send();

    expect(result.status).toBe(401);
  });
});

describe('PATCH /musics/update/:musicId', () => {
  it('given at least one element to update, return 200', async () => {
    const music = musicFactory.__createMusic();
    const user = await userFactory.__insertUser();
    const token = userFactory.__genereateToken(user.id, user.name);

    await supertest(app)
      .post('/musics/create')
      .set({ Authorization: `Bearer ${token}` })
      .send(music);
    const result = await supertest(app)
      .patch('/musics/update/1')
      .set({ Authorization: `Bearer ${token}` })
      .send({ musicVideoUrl: music.musicVideoUrl });

    expect(result.status).toBe(200);
  });

  it('given a not found music id, return 404', async () => {
    const music = musicFactory.__createMusic();
    const user = await userFactory.__insertUser();
    const token = userFactory.__genereateToken(user.id, user.name);

    const result = await supertest(app)
      .patch('/musics/update/-1')
      .set({ Authorization: `Bearer ${token}` })
      .send({ musicVideoUrl: music.musicVideoUrl });

    expect(result.status).toBe(404);
  });

  it('given a empty object throw a unprocessable entity, return 422', async () => {
    const user = await userFactory.__insertUser();
    const token = userFactory.__genereateToken(user.id, user.name);

    const result = await supertest(app)
      .patch('/musics/update/1')
      .set({ Authorization: `Bearer ${token}` })
      .send();

    expect(result.status).toBe(422);
  });

  it('given a body without header, return 401', async () => {
    const result = await supertest(app)
      .patch('/musics/update/1')
      .send();

    expect(result.status).toBe(401);
  });
});

describe('GET /musics/find/:musicId', () => {
  it('given a found id, return 200', async () => {
    const music = musicFactory.__createMusic();
    const user = await userFactory.__insertUser();
    const token = userFactory.__genereateToken(user.id, user.name);

    await supertest(app)
      .post('/musics/create')
      .set({ Authorization: `Bearer ${token}` })
      .send(music);
    const result = await supertest(app)
      .get('/musics/find/1')
      .set({ Authorization: `Bearer ${token}` });

    expect(result.status).toBe(200);
    expect(result.body).toBeInstanceOf(Object);
  });

  it('given a not found music id, return 404', async () => {
    const user = await userFactory.__insertUser();
    const token = userFactory.__genereateToken(user.id, user.name);

    const result = await supertest(app)
      .get('/musics/find/-1')
      .set({ Authorization: `Bearer ${token}` });

    expect(result.status).toBe(404);
  });

  it('given a body without header, return 401', async () => {
    const result = await supertest(app)
      .get('/musics/find/1');

    expect(result.status).toBe(401);
  });
});

afterAll(async () => {
  await prisma.$disconnect();
});
