import { MusicSnippet } from '@prisma/client';
import prisma from '../database';
import { MusicSnippetInsertData } from '../types/musicSnippetType';

async function insert(
  userId: number,
  musicId: number,
  musicSnippet: MusicSnippetInsertData,
): Promise<void> {
  await prisma.musicSnippet.create({ data: { ...musicSnippet, userId, musicId } });
}

async function findMusicSnippets(
  musicId: number,
): Promise<(MusicSnippet & { users: { id: number, name: string } })[]> {
  return prisma.musicSnippet.findMany({
    where: { musicId },
    include: { users: { select: { id: true, name: true } } },
  });
}

async function findSnippet(musicId: number, musicSnippet: string): Promise<MusicSnippet | null> {
  return prisma.musicSnippet.findUnique({
    where: { musicSnippet_musicId: { musicId, musicSnippet } },
  });
}

async function update(id: number, snippetAid: string) {
  await prisma.musicSnippet.update({ where: { id }, data: { snippetAid } });
}

async function findById(id: number): Promise<MusicSnippet | null> {
  return prisma.musicSnippet.findUnique({ where: { id } });
}

const musicSnippetRepository = {
  insert,
  findMusicSnippets,
  findSnippet,
  update,
  findById,
};

export default musicSnippetRepository;
