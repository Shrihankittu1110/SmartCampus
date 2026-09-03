import express from 'express';
import { getDashboardStats } from '../controllers/analyticsController.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.use(requireAuth);

router.get('/dashboard', getDashboardStats);

export default router;
