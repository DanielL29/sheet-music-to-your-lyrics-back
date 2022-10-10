import { Author, Music } from '@prisma/client';
import { Request, Response } from 'express';
import musicService from '../services/musicService';
import {
  MusicFind, MusicSchema, MusicUpdateData,
} from '../types/musicType';

async function insert(req: Request, res: Response) {
  const music: MusicSchema = req.body;
  const sheetMusicFile: Express.Multer.File | undefined = req.file;

  const insertedMusic: Music | null = await musicService.insert(music, sheetMusicFile);

  res.status(201).send(insertedMusic);
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

async function getByCategory(req: Request, res: Response) {
  const { categoryName } = req.params;

  const musicByCategory: Music[] = await musicService.findMusicByCategory(categoryName);

  res.status(200).send(musicByCategory);
}

async function getByAuthor(req: Request, res: Response) {
  const { authorName } = req.params;

  const musicByAuthor: {
    author: Author, musics: Music[]
  } = await musicService.findMusicByAuthor(authorName);

  res.status(200).send(musicByAuthor);
}

async function getAll(_: Request, res: Response) {
  const musics: Music[] = await musicService.findMusics();

  res.status(200).send(musics);
}

async function getSearch(req: Request, res: Response) {
  const textQuery: any = req.query.text;

  const musicSearch: Music[] = await musicService.findSearch(textQuery);

  res.status(200).send(musicSearch);
}

const musicController = {
  insert,
  update,
  getByName,
  getByCategory,
  getByAuthor,
  getAll,
  getSearch,
};

export default musicController;
