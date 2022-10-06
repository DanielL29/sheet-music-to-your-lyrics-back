import { NextFunction, Request, Response } from 'express';
import errors from '../errors/errorsThrow';

export default function validateEmptyMusicUpdate(req: Request, res: Response, next: NextFunction) {
  const { musicVideoUrl, musicHelpVideoUrl, lyric } = req.body;
  const sheetMusicFile = req.file;

  if (sheetMusicFile || musicHelpVideoUrl || musicVideoUrl || lyric) {
    next();
  } else {
    throw errors.unprocessableEntity(
      'at least one of elements("musicVideoUrl", "musicHelpVideoUrl", "sheetMusicFile", "lyric") cannot be empty',
    );
  }
}
