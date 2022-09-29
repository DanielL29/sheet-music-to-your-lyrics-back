import { Music } from '@prisma/client';
import dotenv from 'dotenv';
import axios from 'axios';
import errors from '../errors/errorsThrow';
import musicRepository from '../repositories/musicRepository';
import { MusicSchema } from '../types/musicType';

dotenv.config();

const { VAGALUME_API_URL, VAGALUME_API_KEY } = process.env;

async function insert(music: MusicSchema) {
  const isMusic: Music | null = await musicRepository.findByName(music.name);

  if (isMusic) {
    throw errors.conflict('music', 'registered');
  }

  const musicFromVagalume = await axios.get(VAGALUME_API_URL!, {
    params: {
      art: music.author,
      mus: music.name,
      apiKey: VAGALUME_API_KEY!,
    },
  });

  console.log(musicFromVagalume);
}

const musicService = {
  insert,
};

export default musicService;
