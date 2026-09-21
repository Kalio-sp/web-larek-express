import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import cookieParser from 'cookie-parser';

import { errors } from 'celebrate';

import { PORT, DB_ADDRESS } from './config';

import productRouter from './routes/product';
import orderRouter from './routes/order';
import authRouter from './routes/auth';
import uploadRouter from './routes/upload';

import errorHandler from './middlewares/errors';
import notFoundHandler from './middlewares/not-found';

import { requestLogger, errorLogger } from './middlewares/logger';

const app = express();

app.use(cors());

app.use(express.json());

app.use(cookieParser());

// логирование запросов
app.use(requestLogger);

// статические файлы
app.use(express.static(path.join(__dirname, 'public')));

// роуты
app.use('/product', productRouter);

app.use('/order', orderRouter);

app.use('/auth', authRouter);

app.use('/upload', uploadRouter);

// 404 для несуществующих путей
app.use(notFoundHandler);

// ошибки celebrate
app.use(errors());

// логирование ошибок
app.use(errorLogger);

// общий обработчик ошибок
app.use(errorHandler);

mongoose
  .connect(DB_ADDRESS)

  .then(() => {
    console.log('MongoDB подключена');

    app.listen(PORT, () => {
      console.log(`Сервер запущен на порту ${PORT}`);
    });
  })

  .catch((err) => {
    console.error('Ошибка подключения MongoDB:', err);
  });
