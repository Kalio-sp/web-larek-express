import jwt, { SignOptions } from "jsonwebtoken";

import { JWT_SECRET } from "../config";

export const createToken = (payload: object, expiresIn: string) => {
  const options: SignOptions = {
    expiresIn: expiresIn as SignOptions["expiresIn"],
  };

  return jwt.sign(payload, JWT_SECRET, options);
};
