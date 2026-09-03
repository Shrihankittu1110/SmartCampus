import express from 'express';
import { getActivityLogs } from '../controllers/activityLogController.js';
import { requireAuth } from '../middleware/auth.js';
import { requireRole } from '../middleware/role.js';
import { ROLES } from '../config/constants.js';

const router = express.Router();

router.use(requireAuth);
router.use(requireRole(ROLES.SUPER_ADMIN, ROLES.COLLEGE_ADMIN));

router.get('/', getActivityLogs);

export default router;
