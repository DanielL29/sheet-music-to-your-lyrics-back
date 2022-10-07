import { Author } from '@prisma/client';
import authorRepository from '../repositories/authorRepository';

async function findByCategory(category: string): Promise<Author[]> {
  return authorRepository.findByCategory(category);
}

const authorService = {
  findByCategory,
};

export default authorService;
