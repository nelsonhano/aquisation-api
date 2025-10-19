import jwt from 'jsonwebtoken';
import logger from '#configs/logger.js';

const JWT_SECRET = process.env.JWT_SECRET || 'replace-secret-in-production';
const JWT_EXPIRE = '1d';

export const jwtToken = {
  sign: (payload) => {
    try {
      return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRE });
    } catch(error) {
      logger('Fail to authenticate user', error);
      throw new Error('Fail to authenticate user', error);
    }
  },

  verify: (token) => {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      logger('Fail to verify token',error);
      throw new Error('Fail to verify token',error);
    }
  }
};