import { Music } from '@prisma/client';
import { Request, Response } from 'express';
import musicService from '../services/musicService';
import { MusicFind, MusicSchema, MusicUpdateData } from '../types/musicType';

async function insert(req: Request, res: Response) {
  const music: MusicSchema = req.body;
  const sheetMusicFile: Express.Multer.File | undefined = req.file;

  await musicService.insert(music, sheetMusicFile);

  res.sendStatus(201);
}

async function update(req: Request, res: Response) {
  const { musicName } = req.params;
  const music: MusicUpdateData = req.body;
  const sheetMusicFile: Express.Multer.File | undefined = req.file;

  await musicService.update(musicName, music, sheetMusicFile);

  res.sendStatus(200);
}

async function getByName(req: Request, res: Response) {
  const { musicName } = req.params;

  const music: MusicFind = await musicService.findMusic(musicName);

  res.status(200).send(music);
}

const musicController = {
  insert,
  update,
  getByName,
};

export default musicController;
