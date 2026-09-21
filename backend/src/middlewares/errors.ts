import { Request, Response, NextFunction } from 'express';

import AppError from '../errors/error';

const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (err instanceof AppError) {
    res.status(err.statusCode).send({
      message: err.message,
    });

    return;
  }

  res.status(500).send({
    message: 'Внутренняя ошибка сервера',
  });
};

export default errorHandler;
