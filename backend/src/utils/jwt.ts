import jwt from 'jsonwebtoken';

import { JWT_SECRET } from '../config';

const createToken = (payload: object, expiresIn: string) => jwt.sign(payload, JWT_SECRET, {
  expiresIn: expiresIn as jwt.SignOptions['expiresIn'],
});

export default createToken;
