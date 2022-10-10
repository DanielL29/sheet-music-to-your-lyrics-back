import { MusicContributor } from '@prisma/client';
import prisma from '../database';

async function insert(musicId: number, userId: number): Promise<void> {
  await prisma.musicContributor.create({ data: { musicId, userId } });
}

async function findByMusicAndUser(
  musicId: number,
  userId: number,
): Promise<MusicContributor | null> {
  return prisma.musicContributor.findUnique({ where: { musicId_userId: { musicId, userId } } });
}

async function contributorsByMusic(musicName: string) {
  return prisma.musicContributor.count({ where: { musics: { name: musicName } } });
}

const musicContributorRepository = {
  insert,
  findByMusicAndUser,
  contributorsByMusic,
};

export default musicContributorRepository;
