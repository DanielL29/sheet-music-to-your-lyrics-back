import { ObjectSchema } from 'joi';
import musicSchemas from './musicSchema';
import userSchemas from './userSchema';

export interface Schemas {
  [key: string]: ObjectSchema
}

const schemas: Schemas = {
  signUp: userSchemas.signUpSchema,
  signIn: userSchemas.signInSchema,
  music: musicSchemas.insertSchema,
  musicUpdate: musicSchemas.updateSchema,
};

export default schemas;
