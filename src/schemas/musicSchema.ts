import Joi, { ObjectSchema } from 'joi';
import { MusicSchema, MusicUpdateData } from '../types/musicType';

const youtubeVideoRegex = /^(?:https?:)?(?:\/\/)?(?:youtu\.be\/|(?:www\.|m\.)?youtube\.com\/(?:watch|v|embed)(?:\.php)?(?:\?.*v=|\/))([a-zA-Z0-9-]{7,15})(?:[&][a-zA-Z0-9-]+=[a-zA-Z0-9-]+)*(?:[&].*)?$/;
const pdfAndImagesRegex = /^.+\.(([pP][dD][fF])|([jJ][pP][gG])|([pP][nN][gG]))$/;

const insert: ObjectSchema<MusicSchema> = Joi.object({
  name: Joi.string().required(),
  author: Joi.string().required(),
  sheetMusicFile: Joi.string().pattern(pdfAndImagesRegex),
  musicVideoUrl: Joi.string().uri().pattern(youtubeVideoRegex),
  musicHelpVideoUrl: Joi.string().uri().pattern(youtubeVideoRegex),
  categoryId: Joi.number().required(),
});

const update: ObjectSchema<MusicUpdateData> = Joi.object({
  lyric: Joi.string(),
  sheetMusicFile: Joi.string().pattern(pdfAndImagesRegex),
  musicVideoUrl: Joi.string().uri().pattern(youtubeVideoRegex),
  musicHelpVideoUrl: Joi.string().uri().pattern(youtubeVideoRegex),
});

const musicSchemas = {
  insert,
  update,
};

export default musicSchemas;
