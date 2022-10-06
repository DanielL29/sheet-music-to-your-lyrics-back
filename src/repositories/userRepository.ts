import { User } from '@prisma/client';
import prisma from '../database';
import { UserInsertData } from '../types/userType';

async function findByEmail(email: string): Promise<User | null> {
  return prisma.user.findUnique({ where: { email } });
}

async function insert(user: UserInsertData): Promise<void> {
  await prisma.user.create({ data: user });
}

async function findById(id: number): Promise<User | null> {
  return prisma.user.findUnique({ where: { id } });
}

const userRepository = {
  findByEmail,
  insert,
  findById,
};

export default userRepository;
