import {
  Author, Category, Music, MusicSnippet,
} from '@prisma/client';
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
import authorRepository from '../repositories/authorRepository';
import musicSnippetRepository from '../repositories/musicSnippetRepository';

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

async function insertOrFindAuthor(music: MusicSchema, musicFromVagalume: any): Promise<number> {
  const isAuthor: Author | null = await authorRepository.findByName(
    musicUtil.formatReverseBarAndDot(musicFromVagalume.art.name),
  );
  let authorId;

  if (isAuthor) {
    authorId = isAuthor.id;
  } else {
    const insertedAuthor: Author = await authorRepository.insert({
      name: musicUtil.formatReverseBarAndDot(musicFromVagalume.art.name),
      imageUrl: musicFromVagalume.art.pic_medium,
      categoryId: Number(music.categoryId),
    });

    authorId = insertedAuthor.id;
  }

  return authorId;
}

async function getMusicFromVagalume(music: MusicSchema): Promise<MusicVagalumeData> {
  let translatedLyric = null;

  const { data: musicFromVagalume } = await axios.get(VAGALUME_API_URL!, {
    params: {
      art: music.author,
      mus: music.name,
      apiKey: VAGALUME_API_KEY!,
      extra: 'artpic',
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

  const authorId: number = await insertOrFindAuthor(music, musicFromVagalume);

  return {
    lyric: musicFromVagalume.mus[0].text,
    translatedLyric,
    name: musicUtil.formatReverseBarAndDot(musicFromVagalume.mus[0].name),
    authorId,
  };
}

async function insert(
  music: MusicSchema,
  sheetMusicFile: Express.Multer.File | undefined,
): Promise<Music | null> {
  let filename = music.sheetMusicFile;
  const {
    lyric, translatedLyric, name, authorId,
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
    musicVideoUrl: music.musicVideoUrl,
    musicHelpVideoUrl: music.musicHelpVideoUrl,
    authorId,
    name,
    categoryId: Number(music.categoryId),
    sheetMusicFile: filename,
    lyric,
    translatedLyric,
  });

  return musicRepository.findByName(name);
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

  const isMusicSnippet: MusicSnippet[] = await musicSnippetRepository.findMusicSnippets(
    isMusic.id,
  );

  if (music.lyric !== '' && isMusicSnippet.length > 0) {
    throw errors.badRequest('This music has snippets, remove all snippets before update the lyric.');
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

  return {
    ...isMusic,
    translatedLyric: isMusic.translatedLyric ? isMusic.translatedLyric.split('[')[1].split(']') : null,
    lyric: isMusic.lyric.split('\f'),
    lyricToUpdate,
    musicVideoUrl,
    musicHelpVideoUrl,
    sheetMusicFile: isMusic.sheetMusicFile ? `${AWS_S3_BUCKET_URL}/${isMusic.sheetMusicFile}` : isMusic.sheetMusicFile,
  };
}

async function findMusicByCategory(categoryName: string): Promise<Music[]> {
  const isCategory: Category | null = await categoryRepository.findByName(categoryName);

  if (!isCategory) {
    throw errors.notFound('category', 'categories');
  }

  return musicRepository.findByCategory(categoryName);
}

async function findMusicByAuthor(authorName: string): Promise<{ author: Author, musics: Music[] }> {
  const isAuthor: Author | null = await authorRepository.findByName(authorName);

  if (!isAuthor) {
    throw errors.notFound('author', 'authors');
  }

  const musicsByAuthor: Music[] = await musicRepository.findByAuthor(authorName);

  return {
    author: isAuthor,
    musics: musicsByAuthor,
  };
}

async function findMusics(): Promise<Music[]> {
  return musicRepository.findAll();
}

async function findSearch(text: string): Promise<Music[]> {
  if (!text) {
    return [];
  }

  const isCategory: Category | null = await categoryRepository.findByName(text, true);

  if (isCategory) {
    return musicRepository.findByCategory(isCategory.name);
  }

  const isAuthor: Author | null = await authorRepository.findByName(text, true);

  if (isAuthor) {
    return musicRepository.findByAuthor(isAuthor.name);
  }

  return musicRepository.findSearch(text);
}

const musicService = {
  insert,
  update,
  findMusic,
  findMusicByCategory,
  findMusicByAuthor,
  findMusics,
  findSearch,
};

export default musicService;
