import { Request, NextFunction } from 'express';
import schemas from '../schemas/schemas';
import errors from '../errors/errorsThrow';

export default function validateSchemas(schema: string) {
  if (!Object.prototype.hasOwnProperty.call(schemas, schema)) {
    throw errors.unprocessableEntity('Missing schema/invalid schema');
  }

  return (req: Request, _: any, next: NextFunction) => {
    const { error } = schemas[schema].validate(req.body, { abortEarly: false });

    if (error) {
      const messages: string = error.details.map((detail: any) => detail.message).join('\n');

      throw errors.unprocessableEntity(messages);
    }

    next();
  };
}
