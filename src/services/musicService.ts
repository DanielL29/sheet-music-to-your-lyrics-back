import { Category, Music } from '@prisma/client';
import dotenv from 'dotenv';
import axios from 'axios';
import errors from '../errors/errorsThrow';
import musicRepository from '../repositories/musicRepository';
import { MusicSchema } from '../types/musicType';
import categoryRepository from '../repositories/categoryRepository';
import S3Storage from '../classes/S3Storage';

dotenv.config();

const { VAGALUME_API_URL, VAGALUME_API_KEY } = process.env;

async function verifyMusicAndCategory(music: MusicSchema) {
  const isMusic: Music | null = await musicRepository.findByName(music.name);

  if (isMusic) {
    throw errors.conflict('music', 'registered');
  }

  const isCategory: Category | null = await categoryRepository.findById(Number(music.categoryId));

  if (!isCategory) {
    throw errors.notFound('category', 'categories');
  }
}

async function getMusicFromVagalume(music: MusicSchema) {
  const { data: musicFromVagalume } = await axios.get(VAGALUME_API_URL!, {
    params: {
      art: music.author,
      mus: music.name,
      apiKey: VAGALUME_API_KEY!,
    },
  });

  if (musicFromVagalume?.type === 'notfound') {
    throw errors.notFound(undefined, undefined, 'This music was not found in vagalume music datas, try a known music or verify if you wrote this right');
  }

  const translatedLyric = musicFromVagalume.mus[0].translate.find(
    (translated: any) => translated.lang === 1,
  );

  return { lyric: musicFromVagalume.mus[0].text, translatedLyric: translatedLyric.text };
}

async function insertFileInAWS(sheetMusicFile: Express.Multer.File | undefined) {
  const s3Storage = new S3Storage();

  if (!sheetMusicFile?.filename) {
    throw errors.badRequest('Your "sheetMusicFile" needs to have a file');
  }

  await s3Storage.saveFile(sheetMusicFile!.filename);
}

async function insert(music: MusicSchema, sheetMusicFile: Express.Multer.File | undefined) {
  await verifyMusicAndCategory(music);

  const { lyric, translatedLyric } = await getMusicFromVagalume(music);

  await insertFileInAWS(sheetMusicFile);

  await musicRepository.insert({
    ...music,
    name: music.name.toLowerCase(),
    categoryId: Number(music.categoryId),
    lyric,
    translatedLyric,
    sheetMusicFile: sheetMusicFile!.filename,
  });
}

const musicService = {
  insert,
};

export default musicService;
