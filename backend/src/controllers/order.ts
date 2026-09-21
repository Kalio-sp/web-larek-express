import { Request, Response, NextFunction } from "express";
import { faker } from "@faker-js/faker";

import Product from "../models/product";

export const createOrder = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { payment, email, phone, address, total, items } = req.body;

    const products = await Product.find({
      _id: {
        $in: items,
      },
    });

    if (products.length !== items.length) {
      res.status(400).send({
        message: "Товар не найден",
      });
      return;
    }

    const productsTotal = products.reduce(
      (sum, product) => sum + (product.price || 0),
      0,
    );

    if (productsTotal !== total) {
      res.status(400).send({
        message: "Неверная сумма заказа",
      });
      return;
    }

    if (!["card", "online"].includes(payment)) {
      res.status(400).send({
        message: "Неверный способ оплаты",
      });
      return;
    }

    if (!email || !phone || !address) {
      res.status(400).send({
        message: "Заполните обязательные поля",
      });
      return;
    }

    res.status(200).send({
      id: faker.string.uuid(),
      total,
    });
  } catch (err) {
    next(err);
  }
};
