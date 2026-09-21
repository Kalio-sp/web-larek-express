import { celebrate, Joi } from "celebrate";

export const validateProduct = celebrate({
  body: Joi.object({
    title: Joi.string().min(2).max(30).required(),

    image: Joi.object({
      fileName: Joi.string().required(),

      originalName: Joi.string().required(),
    }).required(),

    category: Joi.string().required(),

    description: Joi.string(),

    price: Joi.number().allow(null),
  }),
});

export const validateOrder = celebrate({
  body: Joi.object({
    payment: Joi.string().valid("card", "online").required(),

    email: Joi.string().email().required(),

    phone: Joi.string().required(),

    address: Joi.string().required(),

    total: Joi.number().required(),

    items: Joi.array().items(Joi.string()).required(),
  }),
});
