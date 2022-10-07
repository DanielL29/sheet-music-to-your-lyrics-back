import { MusicSnippet } from '@prisma/client';
import { Request, Response } from 'express';
import musicSnippetService from '../services/musicSnippetService';
import { MusicSnippetInsertData } from '../types/musicSnippetType';

async function insert(req: Request, res: Response) {
  const userId: number = res.locals.user.id;
  const { musicName } = req.params;
  const musicSnippet: MusicSnippetInsertData = req.body;
  const snippetAidFile: Express.Multer.File | undefined = req.file;

  await musicSnippetService.insert(userId, musicName, musicSnippet, snippetAidFile);

  res.sendStatus(201);
}

async function getMusicSnippets(req: Request, res: Response) {
  const { musicName } = req.params;

  const musicSnippets: MusicSnippet[] = await musicSnippetService.findMusicSnippets(musicName);

  res.status(200).send(musicSnippets);
}

const musicSnippetController = {
  insert,
  getMusicSnippets,
};

export default musicSnippetController;
