import express from 'express';

const router = express.Router();

router.get('/sign-in', (req, res) => {
  res.status(200).json({ message: 'Sign-in successful' });
});

router.get('/sign-out', (req, res) => {
  res.status(200).json({ message: 'Sign-out successful' });
});

router.get('/sign-up', (req, res) => {
  res.status(200).json({ message: 'Sign-up successful' });
});

export default router;