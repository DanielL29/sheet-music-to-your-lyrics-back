import { Category } from '@prisma/client';
import { Request, Response } from 'express';
import categoryService from '../services/categoryService';

async function findAll(req: Request, res: Response) {
  const categories: Category[] = await categoryService.findAll();

  res.status(200).send(categories);
}

const categoryController = {
  findAll,
};

export default categoryController;
