import dotenv from 'dotenv';

dotenv.config();

export const {
  PORT = 3000,

  DB_ADDRESS = 'mongodb://127.0.0.1:27017/weblarek',

  JWT_SECRET = 'secret-key',

  AUTH_REFRESH_TOKEN_EXPIRY = '7d',
} = process.env;
