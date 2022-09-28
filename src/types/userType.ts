import { User } from '@prisma/client';

export type UserInsertData = Omit<User, 'id' | 'createdAt'>
