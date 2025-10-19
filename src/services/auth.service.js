import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';

import { users } from '#models/user.model.js';
import { db } from '#configs/database.js';
import logger from '#configs/logger.js';
import { jwtToken } from '#utils/jwt.js';

export const hashPassword = async(password) => {
  try {
    return await bcrypt.hash(password, 10);
  } catch (error) {
    logger.error(`Hashing password failed: ${error}`);
    throw new Error(`Hashing password failed: ${error}`);
  }
};

export const createUser = async ({ name, email, password, role = 'user'}) => {
  try {
    const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (existingUser.length > 0) {
      logger.error(`User with this email:${email} already exists`);
      throw new Error(`User with this email:${email} already exists`);
    }

    const hashedPassword = await hashPassword(password);

    const [createdUser] = await db.insert(users)
      .values({ name, email, password: hashedPassword, role})
      .returning({ id: users.id, name: users.name, email: users.email, role: users.role, created_at: users.created_at });

    logger.info(`User ${createdUser.email} successfully created`);
    return createdUser;
  } catch (error) {
    logger.error(`Failed to create user: ${error}`);
    throw new Error(`Failed to create user: ${error}`);
  }
};

export const comparePassword = async (password, hashPassword) => {
  try {
    return bcrypt.compare(password, hashPassword);
  } catch (error) {
    logger.error(`Failed to decrypt password: ${error}`);
    throw new Error(`Failed to decrypt password: ${error}`);
  }
};

export const verifyToken = async (req) => {
  try {
    const authUser = req.headers.authorization;
    if (!authUser) {
      logger.error('No authorization token provided');
      throw new Error('No authorization token provided');
    }

    const token = authUser.split(' ')[1];
    const decoded = jwtToken.verify(token);
    logger.info(`Token verified for user ID: ${decoded.id}`);
    return decoded;
  } catch (error) {
    logger.error(`Token verification failed: ${error}`);
    throw new Error(`Token verification failed: ${error}`);
  }
};

export const allUsers = async () => {
  try {
    const allUsers = await db.select().from(users);
    logger.info(`Fetched all users, count: ${allUsers.length}`);
    
    return allUsers.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      created_at: user.created_at
    }));
  } catch (error) {
    logger.error(`Failed to fetch users: ${error}`);
    throw new Error(`Failed to fetch users: ${error}`);
  }
};

export const authenticateUser = async (email, password) => {
  try {
    const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (!existingUser) {
      logger.error(`User with this email ${email} is not registered`);
      throw new Error(`User with this email ${email} is not registered`);
    }

    const isPassWord = comparePassword(password, existingUser.password);
    if(!isPassWord) throw new Error('Invalid password');
    
    return {
      id: existingUser.id,
      name: existingUser.name,
      email: existingUser.email,
      role: existingUser.role,
      created_at: existingUser.created_at
    };
  } catch (error) {
    logger.error(`Failed to authenticate user: ${error}`);
    throw new Error(`Failed to authenticate user: ${error}`);
  }
};