import { User } from '@prisma/client';
import Joi, { ObjectSchema } from 'joi';
import { UserInsertData } from '../types/userType';

const signUpSchema: ObjectSchema<User> = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
});

const signInSchema: ObjectSchema<UserInsertData> = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const userSchema = {
  signUpSchema,
  signInSchema,
};

export default userSchema;
