import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import errors from '../errors/errorsThrow';

export default async function validateToken(req: Request, res: Response, next: NextFunction) {
  if (!req.headers.authorization) {
    throw errors.unhautorized('Missing headers authorization');
  }

  const token: string = req.headers.authorization!.replace('Bearer ', '');
  const secretKey: string | undefined = process.env.SECRET_KEY;

  const decryptedToken: string | JwtPayload = jwt.verify(token, secretKey!);

  res.locals.user = decryptedToken;

  next();
}
