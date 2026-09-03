import express from 'express';
import {
  register,
  login,
  refreshToken,
  logout,
  getMe,
  updateProfile,
  forgotPassword,
  resetPassword,
  verifyEmail,
} from '../controllers/authController.js';
import { requireAuth } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimiter.js';
import { validateRequest } from '../middleware/validate.js';
import {
  registerValidator,
  loginValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
  updateProfileValidator,
} from '../validators/authValidator.js';

const router = express.Router();

router.post('/register', authLimiter, registerValidator, validateRequest, register);
router.post('/login', authLimiter, loginValidator, validateRequest, login);
router.post('/refresh-token', refreshToken);
router.post('/logout', requireAuth, logout);
router.get('/me', requireAuth, getMe);
router.put('/profile', requireAuth, updateProfileValidator, validateRequest, updateProfile);
router.post('/forgot-password', authLimiter, forgotPasswordValidator, validateRequest, forgotPassword);
router.post('/reset-password', authLimiter, resetPasswordValidator, validateRequest, resetPassword);
router.get('/verify-email', verifyEmail);

export default router;
