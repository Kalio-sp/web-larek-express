import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import { JWT_SECRET } from '../config';

export interface AuthRequest extends Request {
  user?: {
    _id: string;
  };
}

export const auth = (req: AuthRequest, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    res.status(401).send({
      message: 'Необходима авторизация',
    });

    return;
  }

  const token = authorization.replace('Bearer ', '');

  try {
    const payload = jwt.verify(token, JWT_SECRET) as {
      _id: string;
    };

    req.user = payload;

    next();
  } catch (err) {
    res.status(401).send({
      message: 'Неверный токен',
    });
  }
};
