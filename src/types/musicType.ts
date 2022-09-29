import { Music } from '@prisma/client';

export type MusicInsertData = Omit<Music, 'id' | 'createdAt'>
export type MusicSchema = Omit<MusicInsertData, 'lyric' | 'translatedLyric'>
export type MusicUpdateData = Omit<MusicSchema, 'name' | 'author' | 'categoryId'>
export interface MusicVagalumeData {
  name: string
  lyric: string
  translatedLyric: string
  author: string
}
