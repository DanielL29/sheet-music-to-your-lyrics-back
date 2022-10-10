import { Request, Response, NextFunction } from 'express';
import errors from '../errors/errorsThrow';

export default function validateTeacher(_: Request, res: Response, next: NextFunction) {
  const userTeacher: boolean = res.locals.user.teacher;

  if (!userTeacher) {
    throw errors.unhautorized('You are not a contributor, you cannot execute this.');
  }

  next();
}
