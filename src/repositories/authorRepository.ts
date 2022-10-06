import { Author } from '@prisma/client';
import prisma from '../database';
import { AuthorInsertData } from '../types/authorType';

async function findByName(name: string): Promise<Author | null> {
  return prisma.author.findUnique({ where: { name } });
}

async function insert(author: AuthorInsertData): Promise<Author> {
  return prisma.author.create({ data: author });
}

async function findByCategory(category: string): Promise<Author[]> {
  return prisma.author.findMany({ where: { categories: { name: category } } });
}

const authorRepository = {
  findByName,
  insert,
  findByCategory,
};

export default authorRepository;
