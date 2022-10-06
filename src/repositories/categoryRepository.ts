import { Category } from '@prisma/client';
import prisma from '../database';

async function findById(id: number): Promise<Category | null> {
  return prisma.category.findUnique({ where: { id } });
}

async function findAll(): Promise<Category[]> {
  return prisma.category.findMany();
}

const categoryRepository = {
  findById,
  findAll,
};

export default categoryRepository;
