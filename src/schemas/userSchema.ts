import { User } from '@prisma/client';
import Joi, { ObjectSchema } from 'joi';
import { UserInsertData } from '../types/userType';

const signUp: ObjectSchema<User> = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
  teacher: Joi.boolean().required(),
});

const signIn: ObjectSchema<UserInsertData> = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const userSchemas = {
  signUp,
  signIn,
};

export default userSchemas;
