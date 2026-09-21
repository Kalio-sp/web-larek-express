import { Request, Response, NextFunction } from "express";

import { AppError } from "../errors/error";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof AppError) {
    res.status(err.statusCode).send({
      message: err.message,
    });

    return;
  }

  res.status(500).send({
    message: "Внутренняя ошибка сервера",
  });
};
