// src/routers/auth.js
import express from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  registerController,
  loginController,
  refreshController,
  logoutController,
} from '../controllers/auth.js';
import { validateBody } from '../middlewares/validateBody.js';
import {
  registerUserSchema,
  loginUserSchema,
} from '../validators/authValidators.js';

const router = express.Router();

router.post(
  '/register',
  validateBody(registerUserSchema),
  ctrlWrapper(registerController),
);
router.post(
  '/login',
  validateBody(loginUserSchema),
  ctrlWrapper(loginController),
);
router.post('/refresh', ctrlWrapper(refreshController));
router.post('/logout', ctrlWrapper(logoutController));

export default router;
