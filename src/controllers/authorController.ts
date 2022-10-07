import { Author } from '@prisma/client';
import { Request, Response } from 'express';
import authorService from '../services/authorService';

async function getByCategory(req: Request, res: Response) {
  const { category } = req.params;

  const authorsByCategory = await authorService.findAuthorByCategory(category);

  res.status(200).send(authorsByCategory);
}

async function getAll(req: Request, res: Response) {
  const authors: Author[] = await authorService.findAuthors();

  res.status(200).send(authors);
}

const authorController = {
  getByCategory,
  getAll,
};

export default authorController;
