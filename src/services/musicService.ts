import { Category, Music } from '@prisma/client';
import dotenv from 'dotenv';
import axios from 'axios';
import errors from '../errors/errorsThrow';
import musicRepository from '../repositories/musicRepository';
import {
  MusicFind, MusicSchema, MusicUpdateData, MusicVagalumeData,
} from '../types/musicType';
import categoryRepository from '../repositories/categoryRepository';
import musicUtil from '../utils/musicUtil';
import s3Util from '../utils/s3Util';

dotenv.config();

const {
  VAGALUME_API_URL, VAGALUME_API_KEY, AWS_S3_BUCKET_URL, NODE_ENV,
} = process.env;

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
    if (sheetMusicFile) {
      const fileSize = Number(((sheetMusicFile.size / 1024) / 1024).toFixed(4));

      if (fileSize > 2) {
        throw errors.badRequest('File limit size is 2MB');
      }
    }

    filename = await s3Util.insertFileInAWS(sheetMusicFile);
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

async function update(
  musicName: string,
  music: MusicUpdateData,
  sheetMusicFile: Express.Multer.File | undefined,
): Promise<void> {
  const isMusic = await musicRepository.findByName(musicName);

  if (!isMusic) {
    throw errors.notFound('music', 'musics');
  }

  if (NODE_ENV !== 'test') {
    if (sheetMusicFile) {
      const fileSize = Number(((sheetMusicFile.size / 1024) / 1024).toFixed(4));

      if (fileSize > 2) {
        throw errors.badRequest('File limit size is 2MB');
      }
    }

    await s3Util.updateFileInAWS(isMusic.sheetMusicFile!, sheetMusicFile);
  }

  const musicUpdateObj = musicUtil.buildUpdateObject(music, sheetMusicFile);

  await musicRepository.update(musicName, musicUpdateObj);
}

async function findMusic(musicName: string): Promise<MusicFind> {
  const isMusic: Music | null = await musicRepository.findByName(musicName);

  if (!isMusic) {
    throw errors.notFound('music', 'musics');
  }

  const { musicVideoUrl, musicHelpVideoUrl } = musicUtil.embedYoutubeUrls(isMusic);
  const lyricToUpdate = musicUtil.formatLyricToUpdate(isMusic.lyric);
  const authorImg = musicUtil.getAuthorImg(isMusic.author);

  return {
    ...isMusic,
    translatedLyric: isMusic.translatedLyric ? isMusic.translatedLyric.split('[')[1].split(']') : null,
    lyric: isMusic.lyric.split('\f'),
    lyricToUpdate,
    musicVideoUrl,
    musicHelpVideoUrl,
    sheetMusicFile: isMusic.sheetMusicFile ? `${AWS_S3_BUCKET_URL}/${isMusic.sheetMusicFile}` : isMusic.sheetMusicFile,
    authorImg,
  };
}

const musicService = {
  insert,
  update,
  findMusic,
};

export default musicService;
