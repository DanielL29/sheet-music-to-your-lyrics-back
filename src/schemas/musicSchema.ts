import Joi, { ObjectSchema } from 'joi';
import { MusicSchema, MusicUpdateData } from '../types/musicType';

const youtubeVideoRegex = /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube(-nocookie)?\.com|youtu.be))(\/(?:[\w]+\?v=|embed\/|v\/)?)([\w]+)(\S+)?$/;
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
