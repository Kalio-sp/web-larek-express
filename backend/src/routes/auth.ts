import { Router } from "express";

import {
  register,
  login,
  refreshAccessToken,
  logout,
  getCurrentUser,
} from "../controllers/auth";

import { auth } from "../middlewares/auth";

const router = Router();

router.post("/register", register);

router.post("/login", login);

router.get("/token", refreshAccessToken);

router.get("/logout", logout);

router.get("/user", auth, getCurrentUser);

export default router;
