import { Music } from '@prisma/client';
import prisma from '../database';
import { MusicInsertData } from '../types/musicType';

async function findByName(name: string): Promise<Music | null> {
  return prisma.music.findUnique({ where: { name } });
}

async function insert(music: MusicInsertData) {
  await prisma.music.create({ data: music });
}

const musicRepository = {
  insert,
  findByName,
};

export default musicRepository;
