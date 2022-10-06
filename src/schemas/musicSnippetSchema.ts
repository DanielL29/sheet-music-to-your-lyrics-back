import Joi, { ObjectSchema } from 'joi';
import { MusicSnippetInsertData } from '../types/musicSnippetType';

const insert: ObjectSchema<MusicSnippetInsertData> = Joi.object({
  musicSnippet: Joi.string().required(),
  snippetAid: Joi.string().required(),
});

const musicSnippetSchemas = {
  insert,
};

export default musicSnippetSchemas;
