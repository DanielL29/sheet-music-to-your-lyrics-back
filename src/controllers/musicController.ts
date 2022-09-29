import { Music } from '@prisma/client';
import { Request, Response } from 'express';
import musicService from '../services/musicService';
import { MusicSchema, MusicUpdateData } from '../types/musicType';

async function insert(req: Request, res: Response) {
  const music: MusicSchema = req.body;
  const sheetMusicFile: Express.Multer.File | undefined = req.file;

  await musicService.insert(music, sheetMusicFile);

  res.sendStatus(201);
}

async function update(req: Request, res: Response) {
  const musicId: number = Number(req.params.musicId);
  const music: MusicUpdateData = req.body;
  const sheetMusicFile: Express.Multer.File | undefined = req.file;

  await musicService.update(musicId, music, sheetMusicFile);

  res.sendStatus(200);
}

async function getById(req: Request, res: Response) {
  const musicId: number = Number(req.params.musicId);

  const music: Music = await musicService.findMusic(musicId);

  res.status(200).send(music);
}

const musicController = {
  insert,
  update,
  getById,
};

export default musicController;
