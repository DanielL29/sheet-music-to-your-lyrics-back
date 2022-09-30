import { Category, Music } from '@prisma/client';
import dotenv from 'dotenv';
import axios from 'axios';
import errors from '../errors/errorsThrow';
import musicRepository from '../repositories/musicRepository';
import { MusicSchema, MusicUpdateData, MusicVagalumeData } from '../types/musicType';
import categoryRepository from '../repositories/categoryRepository';
import S3Storage from '../classes/S3Storage';

dotenv.config();

const {
  VAGALUME_API_URL, VAGALUME_API_KEY, AWS_S3_BUCKET_URL, NODE_ENV,
} = process.env;
const s3Storage = new S3Storage();

async function verifyMusicAndCategory(name: string, categoryId: number): Promise<void> {
  const isMusic: Music | null = await musicRepository.findByName(name);

  if (isMusic) {
    throw errors.conflict('music is', 'registered');
  }

  const isCategory: Category | null = await categoryRepository.findById(Number(categoryId));

  if (!isCategory) {
    throw errors.notFound('category', 'categories');
  }
}

async function getMusicFromVagalume(music: MusicSchema): Promise<MusicVagalumeData> {
  let translatedLyric = null;

  const { data: musicFromVagalume } = await axios.get(VAGALUME_API_URL!, {
    params: {
      art: music.author,
      mus: music.name,
      apiKey: VAGALUME_API_KEY!,
    },
  });

  if (musicFromVagalume?.type === 'notfound' || musicFromVagalume?.type === 'song_notfound') {
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
  if (!sheetMusicFile) {
    return null;
  }

  await s3Storage.saveFile(sheetMusicFile.filename);

  return sheetMusicFile.filename;
}

async function insert(
  music: MusicSchema,
  sheetMusicFile: Express.Multer.File | undefined,
): Promise<void> {
  let filename = music.sheetMusicFile;
  const {
    lyric, translatedLyric, name, author,
  } = await getMusicFromVagalume(music);

  await verifyMusicAndCategory(name, music.categoryId);

  if (NODE_ENV !== 'test') {
    filename = await insertFileInAWS(sheetMusicFile);
  }

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

function buildUpdateObject(
  musicUpdate: MusicUpdateData,
  sheetMusicFile: Express.Multer.File | undefined,
): MusicUpdateData {
  const musicUpdateObj: any = {};

  if (musicUpdate.musicHelpVideoUrl !== '') {
    musicUpdateObj.musicHelpVideoUrl = musicUpdate.musicHelpVideoUrl;
  }

  if (musicUpdate.musicVideoUrl !== '') {
    musicUpdateObj.musicVideoUrl = musicUpdate.musicVideoUrl;
  }

  if (sheetMusicFile) {
    musicUpdateObj.sheetMusicFile = sheetMusicFile.filename;
  }

  return musicUpdateObj;
}

async function updateFileiInAWS(
  dbSheetMusicFile: string,
  sheetMusicFile: Express.Multer.File | undefined,
): Promise<void> {
  if (dbSheetMusicFile && sheetMusicFile) {
    await s3Storage.deleteFile(dbSheetMusicFile);

    await s3Storage.saveFile(sheetMusicFile.filename);
  } else if (sheetMusicFile) {
    await s3Storage.saveFile(sheetMusicFile.filename);
  }
}

async function update(
  musicId: number,
  music: MusicUpdateData,
  sheetMusicFile: Express.Multer.File | undefined,
): Promise<void> {
  const isMusic = await musicRepository.findById(musicId);

  if (!isMusic) {
    throw errors.notFound('music', 'musics');
  }

  if (NODE_ENV !== 'test') {
    await updateFileiInAWS(isMusic.sheetMusicFile!, sheetMusicFile);
  }

  const musicUpdateObj = buildUpdateObject(music, sheetMusicFile);

  await musicRepository.update(musicId, musicUpdateObj);
}

async function findMusic(musicId: number): Promise<Music> {
  const isMusic: Music | null = await musicRepository.findById(musicId);

  if (!isMusic) {
    throw errors.notFound('music', 'musics');
  }

  return {
    ...isMusic,
    sheetMusicFile: isMusic.sheetMusicFile ? `${AWS_S3_BUCKET_URL}/${isMusic.sheetMusicFile}` : isMusic.sheetMusicFile,
  };
}

const musicService = {
  insert,
  update,
  findMusic,
};

export default musicService;
