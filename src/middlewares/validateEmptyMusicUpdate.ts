import { NextFunction, Request, Response } from 'express';
import errors from '../errors/errorsThrow';

export default function validateEmptyMusicUpdate(req: Request, res: Response, next: NextFunction) {
  const { musicVideoUrl, musicHelpVideoUrl } = req.body;
  const sheetMusicFile = req.file;

  if (sheetMusicFile || musicHelpVideoUrl || musicVideoUrl) {
    next();
  } else {
    throw errors.unprocessableEntity('at least one of elements("musicVideoUrl", "musicHelpVideoUrl", "sheetMusicFile") cannot be empty');
  }
}
