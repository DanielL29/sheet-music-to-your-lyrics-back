import { ObjectSchema } from 'joi';
import musicSchemas from './musicSchema';
import musicSnippetSchemas from './musicSnippetSchema';
import userSchemas from './userSchema';

export interface Schemas {
  [key: string]: ObjectSchema
}

const schemas: Schemas = {
  signUp: userSchemas.signUp,
  signIn: userSchemas.signIn,
  music: musicSchemas.insert,
  musicUpdate: musicSchemas.update,
  musicSnippet: musicSnippetSchemas.insert,
  musicSnippetUpdate: musicSnippetSchemas.update,
};

export default schemas;
