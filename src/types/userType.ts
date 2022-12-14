import { User } from '@prisma/client';

export type UserInsertData = Omit<User, 'id' | 'createdAt'> & { confirmPassword?: string }
export type UserLogin = Omit<User, 'id' | 'name' | 'createdAt' | 'teacher'>

export interface UserLocal {
  token: string
  teacher: boolean
}
