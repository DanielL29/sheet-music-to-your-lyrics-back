import { Request, Response } from 'express';
import musicService from '../services/musicService';
import { MusicSchema } from '../types/musicType';

async function insert(req: Request, res: Response) {
  const music: MusicSchema = req.body;

  await musicService.insert(music);

  res.sendStatus(201);
}

const musicController = {
  insert,
};

export default musicController;
