import { Router } from "express";

import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/product";

import { auth } from "../middlewares/auth";

import { validateProduct } from "../middlewares/validation";

const router = Router();

router.get("/", getProducts);

router.post("/", auth, validateProduct, createProduct);

router.patch("/:productId", auth, updateProduct);

router.delete("/:productId", auth, deleteProduct);

export default router;
