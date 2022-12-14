import { Author } from '@prisma/client';
import prisma from '../database';
import { AuthorInsertData } from '../types/authorType';

async function findByName(name: string, insensitive: boolean = false): Promise<Author | null> {
  if (insensitive) {
    return prisma.author.findFirst({ where: { name: { equals: name, mode: 'insensitive' } } });
  }

  return prisma.author.findUnique({ where: { name } });
}

async function insert(author: AuthorInsertData): Promise<Author> {
  return prisma.author.create({ data: author });
}

async function findByCategory(category: string): Promise<Author[]> {
  return prisma.author.findMany({ where: { categories: { name: category } } });
}

async function findAll(): Promise<Author[]> {
  return prisma.author.findMany({ include: { categories: { select: { name: true } } } });
}

const authorRepository = {
  findByName,
  insert,
  findByCategory,
  findAll,
};

export default authorRepository;
