import Joi, { ObjectSchema } from 'joi';
import { MusicSchema } from '../types/musicType';

const youtubeVideoRegex = /^(http(s)??\/\/)?(www\.)?((youtube\.com\/watch\?v=)|(youtu.be\/))([a-zA-Z0-9\-_])+$/;

const musicSchema: ObjectSchema<MusicSchema> = Joi.object({
  name: Joi.string().required(),
  author: Joi.string().required(),
  sheetMusicFile: Joi.string(),
  musicVideoUrl: Joi.string().uri().pattern(youtubeVideoRegex),
  musicHelpVideoUrl: Joi.string().uri().pattern(youtubeVideoRegex),
  categoryId: Joi.number().required(),
});

export default musicSchema;
