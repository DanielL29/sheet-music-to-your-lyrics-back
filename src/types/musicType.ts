import { Music } from '@prisma/client';

export type MusicInsertData = Omit<Music, 'id' | 'createdAt'>
export type MusicSchema = Omit<MusicInsertData, 'lyric' | 'translatedLyric' | 'authorId'> & { author: string }
export type MusicUpdateData = Partial<Omit<MusicInsertData, 'name' | 'author' | 'categoryId' | 'translatedLyric'>>
export interface MusicVagalumeData {
  name: string
  lyric: string
  translatedLyric: string
  authorId: number
}

export type MusicFind = Omit<Music, 'lyric' | 'translatedLyric'> & {
  lyricToUpdate: string
  lyric: string[]
  translatedLyric: string[] | null
};
