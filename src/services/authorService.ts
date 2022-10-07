import { Author, Category } from '@prisma/client';
import errors from '../errors/errorsThrow';
import authorRepository from '../repositories/authorRepository';
import categoryRepository from '../repositories/categoryRepository';

async function findAuthorByCategory(category: string): Promise<Author[]> {
  const isCategory: Category | null = await categoryRepository.findByName(category);

  if (!isCategory) {
    throw errors.notFound('category', 'categories');
  }

  return authorRepository.findByCategory(category);
}

async function findAuthors(): Promise<Author[]> {
  return authorRepository.findAll();
}

const authorService = {
  findAuthorByCategory,
  findAuthors,
};

export default authorService;
