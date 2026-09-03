import express from 'express';
import {
  getPerformanceSummary,
  getWeakSubjects,
  createStudyPlan,
  getRecommendations,
} from '../controllers/aiController.js';
import { requireAuth } from '../middleware/auth.js';
import { aiLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.use(requireAuth);
router.use(aiLimiter);

router.post('/performance-summary', getPerformanceSummary);
router.get('/weak-subjects/:studentId?', getWeakSubjects);
router.post('/study-plan', createStudyPlan);
router.get('/recommendations', getRecommendations);

export default router;
