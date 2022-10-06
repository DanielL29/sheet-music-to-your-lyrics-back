import { Category } from '@prisma/client';
import categoryRepository from '../repositories/categoryRepository';

async function findAll(): Promise<Category[]> {
  return categoryRepository.findAll();
}

const categoryService = {
  findAll,
};

export default categoryService;
