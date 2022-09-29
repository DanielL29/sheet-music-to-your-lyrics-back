import { ObjectSchema } from 'joi';
import musicSchema from './musicSchema';
import userSchema from './userSchema';

export interface Schemas {
  [key: string]: ObjectSchema
}

const schemas: Schemas = {
  signUp: userSchema.signUpSchema,
  signIn: userSchema.signInSchema,
  music: musicSchema,
};

export default schemas;
