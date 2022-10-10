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

async function update(req: Request, res: Response) {
  const musicSnippetId = Number(req.params.musicSnippetId);
  const userId: number = res.locals.user.id;
  const { snippetAid } = req.body;
  const snippetAidFile: Express.Multer.File | undefined = req.file;

  await musicSnippetService.update(userId, musicSnippetId, snippetAid, snippetAidFile);

  res.sendStatus(200);
}

const musicSnippetController = {
  insert,
  getMusicSnippets,
  update,
};

export default musicSnippetController;
