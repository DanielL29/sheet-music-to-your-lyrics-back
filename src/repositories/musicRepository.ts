import { Music } from '@prisma/client';
import prisma from '../database';
import { MusicByCategory, MusicInsertData, MusicUpdateData } from '../types/musicType';

async function findByName(name: string): Promise<Music | null> {
  return prisma.music.findUnique({
    where: { name },
    include: { authors: { select: { name: true, imageUrl: true } } },
  });
}

async function insert(music: MusicInsertData): Promise<void> {
  await prisma.music.create({ data: music });
}

async function findById(id: number): Promise<Music | null> {
  return prisma.music.findUnique({ where: { id } });
}

async function update(name: string, music: MusicUpdateData): Promise<void> {
  await prisma.music.update({ where: { name }, data: music });
}

async function findByCategory(categoryName: string): Promise<MusicByCategory[]> {
  return prisma.music.findMany({
    where: { categories: { name: categoryName } },
    select: { id: true, name: true, authors: { select: { name: true } } },
  });
}

async function findByAuthor(authorName: string): Promise<Music[]> {
  return prisma.music.findMany({
    where: { authors: { name: authorName } },
  });
}

async function findAll(): Promise<Music[]> {
  return prisma.music.findMany({
    include: {
      authors: { select: { name: true } },
      categories: { select: { name: true } },
    },
  });
}

const musicRepository = {
  insert,
  findByName,
  findById,
  update,
  findByCategory,
  findByAuthor,
  findAll,
};

export default musicRepository;
