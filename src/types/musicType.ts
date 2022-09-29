import { Music } from '@prisma/client';

export type MusicInsertData = Omit<Music, 'id' | 'createdAt'>
export type MusicSchema = Omit<MusicInsertData, 'lyric' | 'translatedLyric'>
