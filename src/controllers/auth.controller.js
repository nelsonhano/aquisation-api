import { signinSchema, signupSchema } from '#validations/auth.validation.js';
import { formatValidationErrors } from '#utils/format.js';
import { authenticateUser, createUser, verifyToken } from '../services/auth.service.js';
import logger from '#configs/logger.js';
import { jwtToken } from '#utils/jwt.js';
import { cookie } from '#utils/cookie.js';
import { db } from '#configs/database.js';

export const signUp = async (req, res, next) => {
  console.log({req});
  
  try {
    const validateFormSchema = signupSchema.safeParse(req.body);
    if (!validateFormSchema.success) return res.status(400).json({
      error: 'validation failed',
      details: formatValidationErrors(validateFormSchema.error)
    });

    const { name, email, password, role } = validateFormSchema.data;
    const user = await createUser({ name, email, password, role });
    const token = jwtToken.sign({ id: user.id, email: user.email, role: user.role});
    cookie.set(res, 'token', token);

    logger.info(`Registration successful: ${user.email}`);
    res.status(201).json({
      message: 'User created',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    logger.error('Sign up error', error);
    if (error.message === 'User with this email already exists') {
      return res.status(409).json({ error: 'Email already exists'});
    }
    next(error);
  }
};

export const signIn = async (req, res, next) => {
  try {
    const validateSignInSchema = signinSchema.safeParse(req.body);
    if (!validateSignInSchema.success) {
      res.status(400).json({
        error: 'Validation error',
        details: formatValidationErrors(validateSignInSchema.error)
      });
    }

    const { email, password } = validateSignInSchema.data;
    const user = await authenticateUser(email, password);
    const token = jwtToken.sign({ id: user.id, email: user.email, role: user.role});
    cookie.set(res, 'token', token);

    logger.info(`User signed in: ${user.email}`);
    res.status(200).json({
      message: 'Sign-in successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    logger.error(`Failed to sign user in: ${error}`);
    
    if (error.message === 'User not found' || error.message === 'Invalid password') {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    next(error);
  }
};

export const signOut = (req, res) => {
  try {
    cookie.clear(res, 'token');
    logger.info('User signed out successfully');
    res.status(200).json({ message: 'Sign-out successful' });
  } catch (error) {
    logger.error(`Failed to sign out user: ${error}`);
    res.status(500).json({ error: 'Failed to sign out user' });
  }
};

export const allUsers = async (req, res, next) => {
  try {
    const isUser = await verifyToken(req);
    if (!isUser) {
      logger.error('Unauthorized access attempt to fetch all users');
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const users = await db.select().from('users');
    res.status(200).json({ users });
  } catch (error) {
    logger.error(`Failed to fetch all users: ${error}`);
    next(error);
  }
};