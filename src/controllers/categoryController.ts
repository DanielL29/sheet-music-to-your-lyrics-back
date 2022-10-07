import { Category } from '@prisma/client';
import { Request, Response } from 'express';
import categoryService from '../services/categoryService';

async function getAll(_: Request, res: Response) {
  const categories: Category[] = await categoryService.findCategories();

  res.status(200).send(categories);
}

const categoryController = {
  getAll,
};

export default categoryController;
