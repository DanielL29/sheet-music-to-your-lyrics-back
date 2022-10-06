import { MusicSnippet } from '@prisma/client';

export type MusicSnippetInsertData = Omit<MusicSnippet, 'id' | 'createdAt' | 'userId' | 'musicId'>
