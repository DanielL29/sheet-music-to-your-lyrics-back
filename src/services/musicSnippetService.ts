import { Music, MusicSnippet, User } from '@prisma/client';
import dotenv from 'dotenv';
import errors from '../errors/errorsThrow';
import musicRepository from '../repositories/musicRepository';
import musicSnippetRepository from '../repositories/musicSnippetRepository';
import userRepository from '../repositories/userRepository';
import { MusicSnippetInsertData } from '../types/musicSnippetType';
import musicSnippetUtil from '../utils/musicSnippetUtil';
import s3Util from '../utils/s3Util';

dotenv.config();

const { AWS_S3_BUCKET_URL } = process.env;

async function verifyUserAndMusic(userId: number, musicName: string): Promise<Music> {
  const isUser: User | null = await userRepository.findById(userId);

  if (!isUser) {
    throw errors.notFound('user', 'users');
  }

  const isMusic: Music | null = await musicRepository.findByName(musicName);

  if (!isMusic) {
    throw errors.notFound('music', 'musics');
  }

  return isMusic;
}

async function insert(
  userId: number,
  musicName: string,
  musicSnippet: MusicSnippetInsertData,
  snippetAidFile: Express.Multer.File | undefined,
): Promise<void> {
  const isMusic = await verifyUserAndMusic(userId, musicName);

  const formattedMusicSnippet: string = musicSnippetUtil.formatMusicSnippet(isMusic, musicSnippet);

  if (snippetAidFile) {
    const fileSize = Number(((snippetAidFile.size / 1024) / 1024).toFixed(4));

    if (fileSize > 2) {
      throw errors.badRequest('File limit size is 2MB');
    }

    await s3Util.insertFileInAWS(snippetAidFile);
  }

  let lyricUpdateWithSnippet = isMusic.lyric;

  lyricUpdateWithSnippet = lyricUpdateWithSnippet.replace(formattedMusicSnippet, `\f${formattedMusicSnippet}\f`);

  await musicSnippetRepository.insert(
    userId,
    isMusic.id,
    snippetAidFile ? {
      musicSnippet: formattedMusicSnippet,
      snippetAid: snippetAidFile.filename,
    } : { ...musicSnippet, musicSnippet: formattedMusicSnippet },
  );
  await musicRepository.update(musicName, { lyric: lyricUpdateWithSnippet });
}

async function findMusicSnippets(musicName: string): Promise<MusicSnippet[]> {
  const isMusic: Music | null = await musicRepository.findByName(musicName);

  if (!isMusic) {
    throw errors.notFound('music', 'musics');
  }

  const musicSnippets: MusicSnippet[] = await musicSnippetRepository.findMusicSnippets(isMusic.id);

  return musicSnippets.map((snippet) => {
    if (snippet.snippetAid.endsWith('.mp4')) {
      return {
        ...snippet,
        snippetAid: `${AWS_S3_BUCKET_URL}/${snippet.snippetAid}`,
      };
    }

    return snippet;
  });
}

const musicSnippetService = {
  insert,
  findMusicSnippets,
};

export default musicSnippetService;
