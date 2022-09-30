import musicFactory from '../factories/musicFactory';
import musicRepository from '../../src/repositories/musicRepository';
import musicService from '../../src/services/musicService';
import errors from '../../src/errors/errorsThrow';
import categoryRepository from '../../src/repositories/categoryRepository';

beforeEach(() => {
  jest.clearAllMocks();
  jest.resetAllMocks();
});

describe('POST /musics/create', () => {
  it('expect a correct music object and create a music', async () => {
    const music = musicFactory.__createMusic();

    jest.spyOn(musicRepository, 'findByName').mockResolvedValueOnce(null);
    jest.spyOn(musicRepository, 'insert').mockResolvedValueOnce();
    jest.spyOn(categoryRepository, 'findById').mockResolvedValueOnce({ id: 1, name: 'Pop', createdAt: new Date() });

    await expect(musicService.insert(music, undefined)).resolves.not.toThrow();

    expect(musicRepository.findByName).toBeCalledWith(music.name);
    expect(categoryRepository.findById).toBeCalledWith(music.categoryId);
    expect(musicRepository.insert).toBeCalled();
  });

  it('expect to found a name registered and throw a conflict', async () => {
    const music = musicFactory.__createMusic();

    jest.spyOn(musicRepository, 'findByName').mockResolvedValueOnce({
      id: 1,
      ...music,
      lyric: 'music...',
      translatedLyric: 'musica...',
      createdAt: new Date(),
    });

    await expect(musicService.insert(music, undefined)).rejects.toEqual(errors.conflict('music is', 'registered'));

    expect(musicRepository.findByName).toBeCalledWith(music.name);
    expect(categoryRepository.findById).not.toBeCalled();
    expect(musicRepository.insert).not.toBeCalled();
  });

  it('expect to not found a category and throw not found', async () => {
    const music = musicFactory.__createMusic();

    jest.spyOn(musicRepository, 'findByName').mockResolvedValueOnce(null);
    jest.spyOn(categoryRepository, 'findById').mockResolvedValueOnce(null);

    await expect(musicService.insert(music, undefined)).rejects.toEqual(errors.notFound('category', 'categories'));

    expect(musicRepository.findByName).toBeCalledWith(music.name);
    expect(categoryRepository.findById).toBeCalledWith(music.categoryId);
    expect(musicRepository.insert).not.toBeCalled();
  });

  it('expect to not found a name in vagalume and throw not found', async () => {
    const music = musicFactory.__createMusic();

    jest.spyOn(musicRepository, 'findByName').mockResolvedValueOnce(null);
    jest.spyOn(categoryRepository, 'findById').mockResolvedValueOnce({ id: 1, name: 'Pop', createdAt: new Date() });

    await expect(
      musicService.insert({
        ...music,
        name: 'unknown music to crash in sheet music to your lyrcs app',
      }, undefined),
    ).rejects.toEqual(
      errors.notFound(
        undefined,
        undefined,
        'This music was not found in vagalume music datas, try a known music or verify if you wrote this right',
      ),
    );

    expect(musicRepository.findByName).not.toBeCalled();
    expect(categoryRepository.findById).not.toBeCalled();
    expect(musicRepository.insert).not.toBeCalled();
  });
});

describe('PATCH /musics/update/:musicId', () => {
  it('expect at least an element and update a music', async () => {
    const music = musicFactory.__musicReturn();

    jest.spyOn(musicRepository, 'findById').mockResolvedValueOnce(music);
    jest.spyOn(musicRepository, 'update').mockResolvedValueOnce();

    await expect(musicService.update(1, {
      sheetMusicFile: music.sheetMusicFile,
      musicVideoUrl: music.musicVideoUrl,
      musicHelpVideoUrl: music.musicHelpVideoUrl,
    }, undefined)).resolves.not.toThrow();

    expect(musicRepository.findById).toBeCalledWith(music.categoryId);
    expect(musicRepository.update).toBeCalled();
  });

  it('expect to not found music id and throw not found', async () => {
    const music = musicFactory.__createMusic();

    jest.spyOn(musicRepository, 'findById').mockResolvedValueOnce(null);
    jest.spyOn(musicRepository, 'update').mockResolvedValueOnce();

    await expect(musicService.update(1, {
      sheetMusicFile: music.sheetMusicFile,
      musicVideoUrl: music.musicVideoUrl,
      musicHelpVideoUrl: music.musicHelpVideoUrl,
    }, undefined)).rejects.toEqual(errors.notFound('music', 'musics'));

    expect(musicRepository.findById).toBeCalledWith(music.categoryId);
    expect(musicRepository.update).not.toBeCalled();
  });
});

describe('GET /musics/find/:musicId', () => {
  it('expect to found music id and return a correct music object', async () => {
    const music = musicFactory.__musicReturn();
    const AWS_S3_BUCKET_URL = process.env.AWS_S3_BUCKET_URL!;
    const sheetMusicFileUrl = `${AWS_S3_BUCKET_URL}/${music.sheetMusicFile}`;

    jest.spyOn(musicRepository, 'findById').mockResolvedValueOnce(music);

    const musicFound = await musicService.findMusic(music.id);

    expect(musicFound).toEqual(
      expect.objectContaining({ ...music, sheetMusicFile: sheetMusicFileUrl }),
    );
    expect(musicRepository.findById).toBeCalledWith(music.id);
  });

  it('expect to not found music id and throw not found', async () => {
    jest.spyOn(musicRepository, 'findById').mockResolvedValueOnce(null);

    await expect(musicService.findMusic(-1)).rejects.toEqual(errors.notFound('music', 'musics'));

    expect(musicRepository.findById).toBeCalledWith(-1);
  });
});
