import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';

import Product from '../models/product';

import BadRequestError from '../errors/bad-request';
import NotFoundError from '../errors/not-found';

import moveFile from '../utils/file';

export const getProducts = (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  Product.find({})

    .then((products) => {
      res.send({
        items: products,
        total: products.length,
      });
    })

    .catch(next);
};

export const createProduct = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const {
    title, image, category, description, price,
  } = req.body;

  const newImage = image
    ? {
      fileName: image.fileName.startsWith('/temp/')
        ? moveFile(image.fileName.replace('/temp/', ''))
        : image.fileName,

      originalName: image.originalName,
    }
    : image;

  Product.create({
    title,

    image: newImage,

    category,

    description,

    price,
  })

    .then((product) => {
      res.status(201).send(product);
    })

    .catch(next);
};

export const updateProduct = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { productId } = req.params;

  if (!mongoose.isValidObjectId(productId)) {
    next(new BadRequestError('Некорректный id товара'));

    return;
  }

  if (req.body.image) {
    req.body.image.fileName = req.body.image.fileName.startsWith('/temp/')
      ? moveFile(req.body.image.fileName.replace('/temp/', ''))
      : req.body.image.fileName;
  }

  Product.findByIdAndUpdate(
    productId,

    req.body,

    {
      new: true,
      runValidators: true,
    },
  )

    .then((product) => {
      if (!product) {
        next(new NotFoundError('Товар не найден'));

        return;
      }

      res.send(product);
    })

    .catch(next);
};

export const deleteProduct = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { productId } = req.params;

  if (!mongoose.isValidObjectId(productId)) {
    next(new BadRequestError('Некорректный id товара'));

    return;
  }

  Product.findByIdAndDelete(productId)

    .then((product) => {
      if (!product) {
        next(new NotFoundError('Товар не найден'));

        return;
      }

      res.send(product);
    })

    .catch(next);
};
