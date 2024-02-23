import dotenv from 'dotenv';
import { ValidationError } from 'sequelize';

dotenv.config();

import { CustomError } from '../errors/CustomError.js';

const errorHandler = (error, req, res, _next) => {
  if (error instanceof CustomError) {
    return res.status(error.content.statusCode).send({ message: error.content.message });
  }
  if (error instanceof ValidationError) {
    return res.status(400).send({
      message: 'A field is invalid',
      fields: error.errors.map((e) => ([{
        field: e.path,
        message: e.message,
      }])),
    });
  }
  console.error(error);
  if (process.env.NODE_ENV === 'production') {
    return res.status(500).send({ message: 'Something went wrong' });
  }
  return res.status(500).send({ message: error.message });
};

export default errorHandler;
