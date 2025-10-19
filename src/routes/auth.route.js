import { signIn, signOut, signUp } from '#controllers/auth.controller.js';
import { allUsers } from '#services/auth.service.js';
import express from 'express';

const router = express.Router();

router.get('/sign-in', signIn);
router.get('/sign-out', signOut);
router.post('/sign-up', signUp);
router.get('/users', allUsers);

export default router;