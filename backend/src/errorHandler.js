import { CustomError } from '../errors/CustomError.js';

const errorHandler = (error, req, res, _next) => {
  if (error instanceof CustomError) {
    return res.status(error.content.statusCode).send({ message: error.content.message });
  }
  console.error(error);
  return res.status(500).send({ message: error.message });
};

export default errorHandler;
