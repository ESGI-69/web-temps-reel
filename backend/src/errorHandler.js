import dotenv from 'dotenv';

dotenv.config();

import { CustomError } from '../errors/CustomError.js';

const errorHandler = (error, req, res, _next) => {
  if (error instanceof CustomError) {
    return res.status(error.content.statusCode).send({ message: error.content.message });
  }
  console.error(error);
  if (process.env.NODE_ENV === 'production') {
    return res.status(500).send({ message: 'Something went wrong' });
  }
  return res.status(500).send({ message: error.message });
};

export default errorHandler;
