import express from 'express';
import authenticate from '../middlewares/authenticate.js';

const router = express.Router();

router.get('/quiz', authenticate, (req, res) => {
    res.json({ message: 'Welcome to the Quiz Page' });
});

export default router;