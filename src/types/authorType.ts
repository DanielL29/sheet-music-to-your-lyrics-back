import { Author } from '@prisma/client';

export type AuthorInsertData = Omit<Author, 'id' | 'createdAt'>
