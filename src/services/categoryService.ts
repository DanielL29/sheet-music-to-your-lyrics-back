import { Category } from '@prisma/client';
import categoryRepository from '../repositories/categoryRepository';

async function findCategories(): Promise<Category[]> {
  return categoryRepository.findAll();
}

const categoryService = {
  findCategories,
};

export default categoryService;
