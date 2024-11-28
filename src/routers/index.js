import express from 'express';
import authRouter from './auth.js';
import contactsRouter from './contacts.js';
import { authenticate } from '../middlewares/authenticate.js';

const router = express.Router();

router.use('/auth', authRouter);
router.use('/contacts', authenticate, contactsRouter);

export default router;
