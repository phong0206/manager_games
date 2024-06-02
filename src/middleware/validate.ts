import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import httpStatus from 'http-status';
import _ from 'lodash';
import ApiError from '../utils/ApiError';

const validate = (schema: any) => (req: Request, res: Response, next: NextFunction) => {
  const validSchema = _.pick(schema, ['params', 'query', 'body']);
  const object = _.pick(req, Object.keys(validSchema));
  const { value, error } = Joi.object(validSchema)
    .prefs({ errors: { label: 'key' }, abortEarly: false })
    .validate(object);

  if (error) {
    const errorMessage = error.details.map((details: any) => details.message).join(', ');
    return next(new ApiError(httpStatus.BAD_REQUEST, errorMessage));
  }
  Object.assign(req, value);
  return next();
};

export default validate;
