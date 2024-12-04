// src/routers/auth.js
import express from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  registerController,
  loginController,
  refreshController,
  logoutController,
  sendResetEmailController,
  resetPasswordController,
} from '../controllers/auth.js';
import { validateBody } from '../middlewares/validateBody.js';
import {
  registerUserSchema,
  loginUserSchema,
  sendResetEmailSchema,
  resetPasswordSchema,
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

router.post(
  '/send-reset-email',
  validateBody(sendResetEmailSchema),
  ctrlWrapper(sendResetEmailController),
);

router.post(
  '/reset-pwd',
  validateBody(resetPasswordSchema),
  ctrlWrapper(resetPasswordController),
);

export default router;
