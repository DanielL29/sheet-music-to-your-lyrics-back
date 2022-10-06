import { Music } from '@prisma/client';
import errors from '../errors/errorsThrow';
import { MusicSnippetInsertData } from '../types/musicSnippetType';

interface MusicSnippetLiterals {
  formatMusicSnippet: (isMusic: Music, musicSnippet: MusicSnippetInsertData) => string
}

const musicSnippetUtil: MusicSnippetLiterals = {
  formatMusicSnippet: (isMusic, musicSnippet) => {
    const formattedMusicSnippet = musicSnippet.musicSnippet.split('\r').join('');

    if (!isMusic.lyric.includes(formattedMusicSnippet)) {
      throw errors.badRequest('This music snippet is not include in this music lyrics');
    }

    return formattedMusicSnippet;
  },
};

export default musicSnippetUtil;
