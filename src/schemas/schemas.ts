import { ObjectSchema } from 'joi';
import userSchema from './userSchema';

export interface Schemas {
  [key: string]: ObjectSchema
}

const schemas: Schemas = {
  signUp: userSchema.signUpSchema,
  signIn: userSchema.signInSchema,
};

export default schemas;
