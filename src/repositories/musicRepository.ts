import { Music } from '@prisma/client';
import prisma from '../database';
import { MusicInsertData, MusicUpdateData } from '../types/musicType';

async function findByName(name: string): Promise<Music | null> {
  return prisma.music.findUnique({ where: { name } });
}

async function insert(music: MusicInsertData): Promise<void> {
  await prisma.music.create({ data: music });
}

async function findById(id: number): Promise<Music | null> {
  return prisma.music.findUnique({ where: { id } });
}

async function update(id: number, music: MusicUpdateData): Promise<void> {
  await prisma.music.update({ where: { id }, data: music });
}

const musicRepository = {
  insert,
  findByName,
  findById,
  update,
};

export default musicRepository;
