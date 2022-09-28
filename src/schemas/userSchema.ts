import { User } from '@prisma/client';
import Joi, { ObjectSchema } from 'joi';

const userSchema: ObjectSchema<User> = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  confirmPassword: Joi.string().valid(Joi.ref('password')),
});

export default userSchema;
