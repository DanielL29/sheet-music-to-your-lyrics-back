import { Request, Response } from 'express';
import musicService from '../services/musicService';
import { MusicSchema } from '../types/musicType';

async function insert(req: Request, res: Response) {
  const music: MusicSchema = req.body;
  const sheetMusicFile: Express.Multer.File | undefined = req.file;

  await musicService.insert(music, sheetMusicFile);

  res.sendStatus(201);
}

const musicController = {
  insert,
};

export default musicController;
