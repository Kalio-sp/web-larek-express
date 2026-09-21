import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import User from '../models/user';

import createToken from '../utils/jwt';

import { JWT_SECRET } from '../config';

const generateTokens = (id: string) => {
  const accessToken = createToken({ _id: id }, '10m');

  const refreshToken = createToken({ _id: id }, '7d');

  return {
    accessToken,
    refreshToken,
  };
};

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name, email, password } = req.body;

    const hashPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashPassword,
    });

    const tokens = generateTokens(user._id.toString());

    user.tokens.push({
      token: tokens.refreshToken,
    });

    await user.save();

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    });

    res.status(201).send({
      user: {
        email: user.email,
        name: user.name,
      },

      success: true,

      accessToken: tokens.accessToken,
    });
  } catch (err) {
    if (err instanceof Error && err.message.includes('E11000')) {
      res.status(409).send({
        message: 'Пользователь с таким email уже существует',
      });

      return;
    }

    next(err);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password +tokens');

    if (!user) {
      res.status(401).send({
        message: 'Неверный email или пароль',
      });

      return;
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      res.status(401).send({
        message: 'Неверный email или пароль',
      });

      return;
    }

    const tokens = generateTokens(user._id.toString());

    user.tokens.push({
      token: tokens.refreshToken,
    });

    await user.save();

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    });

    res.send({
      user: {
        email: user.email,
        name: user.name,
      },

      success: true,

      accessToken: tokens.accessToken,
    });
  } catch (err) {
    next(err);
  }
};

// обновление accessToken через refreshToken
export const refreshAccessToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      res.status(401).send({
        message: 'Нет refresh токена',
      });

      return;
    }

    let payload;

    try {
      payload = jwt.verify(refreshToken, JWT_SECRET) as {
        _id: string;
      };
    } catch (err) {
      res.status(401).send({
        message: 'Неверный или просроченный refresh токен',
      });

      return;
    }

    const user = await User.findOne({
      _id: payload._id,
      'tokens.token': refreshToken,
    }).select('+tokens');

    if (!user) {
      res.status(401).send({
        message: 'Refresh токен не найден',
      });

      return;
    }

    const tokens = generateTokens(user._id.toString());

    user.tokens = user.tokens.filter((item) => item.token !== refreshToken);

    user.tokens.push({
      token: tokens.refreshToken,
    });

    await user.save();

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    });

    res.send({
      user: {
        email: user.email,
        name: user.name,
      },

      success: true,

      accessToken: tokens.accessToken,
    });
  } catch (err) {
    next(err);
  }
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { refreshToken } = req.cookies;

    const user = await User.findOne({
      'tokens.token': refreshToken,
    }).select('+tokens');

    if (!user) {
      res.status(404).send({
        message: 'Пользователь не найден',
      });

      return;
    }

    user.tokens = user.tokens.filter((item) => item.token !== refreshToken);

    await user.save();

    res.clearCookie('refreshToken', {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      path: '/',
    });

    res.send({
      success: true,
    });
  } catch (err) {
    next(err);
  }
};

export const getCurrentUser = async (
  req: Request & {
    user?: {
      _id: string;
    };
  },
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await User.findById(req.user?._id);

    if (!user) {
      res.status(404).send({
        message: 'Пользователь не найден',
      });

      return;
    }

    res.send({
      user: {
        email: user.email,
        name: user.name,
      },

      success: true,
    });
  } catch (err) {
    next(err);
  }
};
