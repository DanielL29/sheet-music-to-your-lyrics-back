import { Request, Response } from 'express';
import authorService from '../services/authorService';

async function getByCategory(req: Request, res: Response) {
  const { category } = req.params;

  const authorsByCategory = await authorService.findByCategory(category);

  res.status(200).send(authorsByCategory);
}

const authorController = {
  getByCategory,
};

export default authorController;
