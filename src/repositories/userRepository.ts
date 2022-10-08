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

async function updateMakeTeacher(email: string): Promise<User> {
  return prisma.user.update({ where: { email }, data: { teacher: true } });
}

const userRepository = {
  findByEmail,
  insert,
  findById,
  updateMakeTeacher,
};

export default userRepository;
