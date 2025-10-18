import logger from '#configs/logger.js';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'pls-replace-in-production';
const JWT_EXPIRE = '1d';

export const jwttoken = {
  sign: (payload) => {
    try {
      return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRE });    
    } catch (error) {
      logger('Failed to authenticate user', error);
      throw new Error('Failed to authenticate user', error);
    }
  },
  verify: (token) => {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      logger('Failed while verifying user', error);
      throw new Error('Failed while verifying user', error);
    }
  }
};