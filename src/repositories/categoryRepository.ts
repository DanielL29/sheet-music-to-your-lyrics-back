import { Category } from '@prisma/client';
import prisma from '../database';

async function findById(id: number): Promise<Category | null> {
  return prisma.category.findUnique({ where: { id } });
}

async function findByName(name: string, insensitive: boolean = false): Promise<Category | null> {
  if (insensitive) {
    return prisma.category.findFirst({ where: { name: { equals: name, mode: 'insensitive' } } });
  }

  return prisma.category.findUnique({ where: { name } });
}

async function findAll(): Promise<Category[]> {
  return prisma.category.findMany();
}

const categoryRepository = {
  findById,
  findAll,
  findByName,
};

export default categoryRepository;
