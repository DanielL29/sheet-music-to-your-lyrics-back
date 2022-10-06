import { Music } from '@prisma/client';
import { MusicUpdateData } from '../types/musicType';

interface MusicLiterals {
  verifyChord: (phrase: string) => boolean
  buildUpdateObject(
    musicUpdate: any, sheetMusicFile: Express.Multer.File | undefined
  ): MusicUpdateData
  formatLyricToUpdate: (lyric: string) => string
  embedYoutubeUrls: (isMusic: Music) => {
    musicVideoUrl: string | null, musicHelpVideoUrl: string | null
  }
  getAuthorImg: (author: string) => string
}

const CHORDS_REGEX = /(\(*[CDEFGAB](?:b|bb)*(?:#|##|sus|maj|min|aug|m|M|°|[0-9])*[(]?[\d/]*[)]?(?:[CDEFGAB](?:b|bb)*(?:#|##|sus|maj|min|aug|m|M|°|[0-9])*[\d/]*)*\)*)(?=[\s|$])(?! [a-z])/;

function formatReceivedLyric(lyric: string) {
  const lyricArray = lyric.split('\r\n');
  let buildLyric = '';

  for (let i = 0; i < lyricArray.length; i++) {
    if (lyricArray[i] !== '' && lyricArray[i] !== 'INSIRA OS ACORDES NOS ESPAÇOS EM CIMA DE CADA FRASE') {
      buildLyric += `${lyricArray[i]}\n`;
    }
  }

  return buildLyric;
}

const musicUtil: MusicLiterals = {
  verifyChord: (phrase) => CHORDS_REGEX.test(phrase),
  buildUpdateObject: (musicUpdate, sheetMusicFile) => {
    const musicUpdateObj: any = {};
    const musicUpdateKeys: any[] = Object.keys(musicUpdate);

    for (let i = 0; i < musicUpdateKeys.length; i++) {
      const element: string = musicUpdateKeys[i];

      if (musicUpdate[element] !== '') {
        let fieldToUpdate = musicUpdate[element];

        if (element === 'lyric') {
          fieldToUpdate = formatReceivedLyric(fieldToUpdate);
        }

        musicUpdateObj[element] = fieldToUpdate;
      }
    }

    if (sheetMusicFile) {
      musicUpdateObj.sheetMusicFile = sheetMusicFile.filename;
    }

    return musicUpdateObj;
  },
  formatLyricToUpdate: (lyric) => {
    const lyricsArray = lyric.split('\n');
    let buildUpdateLyric = '';

    for (let i = 0; i < lyricsArray!.length; i++) {
      if (i === 0) {
        buildUpdateLyric += 'INSIRA OS ACORDES NOS ESPAÇOS EM CIMA DE CADA FRASE\n';
      }

      if (
        musicUtil.verifyChord(lyricsArray[i])
        && !musicUtil.verifyChord(lyricsArray[i + 1])
      ) {
        buildUpdateLyric += `${lyricsArray[i]}\n`;
      } else if (
        !musicUtil.verifyChord(lyricsArray[i])
        && musicUtil.verifyChord(lyricsArray[i - 1])
      ) {
        buildUpdateLyric += `${lyricsArray[i]}\n`;
      } else {
        buildUpdateLyric += '\n';
        buildUpdateLyric += `${lyricsArray[i]}\n`;
      }
    }

    return buildUpdateLyric;
  },
  embedYoutubeUrls: (isMusic) => {
    let embedVideoUrl = isMusic.musicVideoUrl;
    let embedHelpVideoUrl = isMusic.musicHelpVideoUrl;

    if (isMusic.musicVideoUrl && isMusic.musicVideoUrl.includes('watch?v=')) {
      embedVideoUrl = embedVideoUrl!.replace('watch?v=', 'embed/');
    }

    if (isMusic.musicHelpVideoUrl && isMusic.musicHelpVideoUrl.includes('watch?v=')) {
      embedHelpVideoUrl = embedHelpVideoUrl!.replace('watch?v=', 'embed/');
    }

    return { musicVideoUrl: embedVideoUrl, musicHelpVideoUrl: embedHelpVideoUrl };
  },
  getAuthorImg: (author) => {
    let formattedAuthorName = '';

    if (author) {
      const authorLower = author.toLowerCase();

      for (let i = 0; i < authorLower.length; i++) {
        if (authorLower[i] === ' ') {
          formattedAuthorName += '-';
        } else {
          formattedAuthorName += authorLower[i];
        }
      }
    }

    return `https://www.vagalume.com.br/${formattedAuthorName}/images/${formattedAuthorName}.jpg`;
  },
};

export default musicUtil;
