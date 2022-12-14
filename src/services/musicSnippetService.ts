import {
  Music, MusicContributor, MusicSnippet, User,
} from '@prisma/client';
import dotenv from 'dotenv';
import errors from '../errors/errorsThrow';
import musicContributorsRepository from '../repositories/musicContributorRepository';
import musicRepository from '../repositories/musicRepository';
import musicSnippetRepository from '../repositories/musicSnippetRepository';
import userRepository from '../repositories/userRepository';
import { MusicSnippetInsertData } from '../types/musicSnippetType';
import musicSnippetUtil from '../utils/musicSnippetUtil';
import s3Util from '../utils/s3Util';

dotenv.config();

const { AWS_S3_BUCKET_URL } = process.env;

async function verifyDatas(
  userId: number,
  musicName: string,
  musicSnippet: string,
): Promise<Music> {
  const isUser: User | null = await userRepository.findById(userId);

  if (!isUser) {
    throw errors.notFound('user', 'users');
  }

  const isMusic: Music | null = await musicRepository.findByName(musicName);

  if (!isMusic) {
    throw errors.notFound('music', 'musics');
  }

  const isMusicSnippet: MusicSnippet | null = await musicSnippetRepository.findSnippet(
    isMusic.id,
    musicSnippet,
  );

  if (isMusicSnippet) {
    throw errors.conflict('snippet is', 'registered');
  }

  return isMusic;
}

async function insertContributor(musicId: number, userId: number) {
  const isMusicContributor: MusicContributor | null = await musicContributorsRepository
    .findByMusicAndUser(musicId, userId);

  if (!isMusicContributor) {
    await musicContributorsRepository.insert(musicId, userId);
  }
}

async function insert(
  userId: number,
  musicName: string,
  musicSnippet: MusicSnippetInsertData,
  snippetAidFile: Express.Multer.File | undefined,
): Promise<void> {
  const isMusic = await verifyDatas(userId, musicName, musicSnippet.musicSnippet);

  const formattedMusicSnippet: string = musicSnippetUtil.formatMusicSnippet(isMusic, musicSnippet);

  if (snippetAidFile) {
    const fileSize = Number(((snippetAidFile.size / 1024) / 1024).toFixed(4));

    if (fileSize > 20) {
      throw errors.badRequest('File limit size is 20MB');
    }

    await s3Util.insertFileInAWS(snippetAidFile);
  }

  let lyricUpdateWithSnippet = isMusic.lyric;

  lyricUpdateWithSnippet = lyricUpdateWithSnippet.replace(formattedMusicSnippet, `\f${formattedMusicSnippet}\f`);

  await musicSnippetRepository.insert(
    userId,
    isMusic.id,
    snippetAidFile ? ({
      musicSnippet: formattedMusicSnippet,
      snippetAid: snippetAidFile.filename,
    }) : ({ ...musicSnippet, musicSnippet: formattedMusicSnippet }),
  );
  await musicRepository.update(musicName, { lyric: lyricUpdateWithSnippet });
  await insertContributor(isMusic.id, userId);
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

async function update(
  userId: number,
  musicSnippetId: number,
  snippetAid: string,
  snippetAidFile: Express.Multer.File | undefined,
): Promise<void> {
  const isMusicSnippet: MusicSnippet | null = await musicSnippetRepository.findById(musicSnippetId);

  if (!isMusicSnippet) {
    throw errors.notFound('music snippet', 'music snippets');
  }

  if (snippetAidFile) {
    s3Util.updateFileInAWS(isMusicSnippet.snippetAid, snippetAidFile);
  }

  await musicSnippetRepository.update(
    musicSnippetId,
    snippetAidFile ? snippetAidFile.filename : snippetAid,
  );
  await insertContributor(isMusicSnippet.musicId, userId);
}

async function remove(musicSnippetId: number): Promise<void> {
  const isMusicSnippet: MusicSnippet | null = await musicSnippetRepository.findById(musicSnippetId);

  if (!isMusicSnippet) {
    throw errors.notFound('musicSnippet', 'musicSnippets');
  }

  if (isMusicSnippet.snippetAid.endsWith('.mp4')) {
    await s3Util.deleteFileInAWS(isMusicSnippet.snippetAid);
  }

  const music: Music | null = await musicRepository.findById(isMusicSnippet.musicId);

  const lyricUpdated = music!.lyric.replace(`\f${isMusicSnippet.musicSnippet}\f`, isMusicSnippet.musicSnippet);

  await musicRepository.update(music!.name, { lyric: lyricUpdated });
  await musicSnippetRepository.remove(musicSnippetId);
}

const musicSnippetService = {
  insert,
  findMusicSnippets,
  update,
  remove,
};

export default musicSnippetService;
