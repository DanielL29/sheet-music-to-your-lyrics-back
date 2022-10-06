import { MusicSnippet } from '@prisma/client';
import { number } from 'joi';
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

const musicSnippetRepository = {
  insert,
  findMusicSnippets,
};

export default musicSnippetRepository;
