import { faker } from '@faker-js/faker';

function __createMusic() {
  return {
    name: 'I See Fire',
    categoryId: 1,
    authorId: 1,
    musicVideoUrl: `https://www.youtube.com/watch?v=${faker.random.alphaNumeric(11)}`,
    musicHelpVideoUrl: `https://www.youtube.com/watch?v=${faker.random.alphaNumeric(11)}`,
    sheetMusicFile: '852646317cf77a073bd7-garota-de-ipanema.jpg',
  };
}

function __musicReturn() {
  const music = __createMusic();

  return {
    id: 1,
    ...music,
    lyric: 'music...',
    translatedLyric: 'musica...',
    createdAt: new Date(),
  };
}

const musicFactory = {
  __createMusic,
  __musicReturn,
};

export default musicFactory;
