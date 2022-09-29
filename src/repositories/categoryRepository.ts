import { Category } from '@prisma/client';
import prisma from '../database';

async function findById(id: number): Promise<Category | null> {
  return prisma.category.findUnique({ where: { id } });
}

const categoryRepository = {
  findById,
};

export default categoryRepository;
