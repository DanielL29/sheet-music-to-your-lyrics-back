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

async function verifyMusicAndCategory(name: string, categoryId: number) {
  const isMusic: Music | null = await musicRepository.findByName(name);

  if (isMusic) {
    throw errors.conflict('music is', 'registered');
  }

  const isCategory: Category | null = await categoryRepository.findById(Number(categoryId));

  if (!isCategory) {
    throw errors.notFound('category', 'categories');
  }
}

async function getMusicFromVagalume(music: MusicSchema) {
  let translatedLyric = null;

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

  if (musicFromVagalume.mus[0].translate) {
    const findTranslated = musicFromVagalume.mus[0].translate.find(
      (translated: any) => translated.lang === 1,
    );

    translatedLyric = findTranslated.text;
  }

  return {
    lyric: musicFromVagalume.mus[0].text,
    translatedLyric,
    name: musicFromVagalume.mus[0].name,
    author: musicFromVagalume.art.name,
  };
}

async function insertFileInAWS(
  sheetMusicFile: Express.Multer.File | undefined,
): Promise<string | null> {
  const s3Storage = new S3Storage();

  if (!sheetMusicFile) {
    return null;
  }

  await s3Storage.saveFile(sheetMusicFile.filename);

  return sheetMusicFile.filename;
}

async function insert(music: MusicSchema, sheetMusicFile: Express.Multer.File | undefined) {
  const {
    lyric, translatedLyric, name, author,
  } = await getMusicFromVagalume(music);

  await verifyMusicAndCategory(name, music.categoryId);

  const filename = await insertFileInAWS(sheetMusicFile);

  await musicRepository.insert({
    ...music,
    author,
    name,
    categoryId: Number(music.categoryId),
    sheetMusicFile: filename,
    lyric,
    translatedLyric,
  });
}

const musicService = {
  insert,
};

export default musicService;
