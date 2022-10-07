import { Category } from '@prisma/client';
import { Request, Response } from 'express';
import categoryService from '../services/categoryService';

async function getAll(req: Request, res: Response) {
  const categories: Category[] = await categoryService.findAll();

  res.status(200).send(categories);
}

const categoryController = {
  getAll,
};

export default categoryController;
