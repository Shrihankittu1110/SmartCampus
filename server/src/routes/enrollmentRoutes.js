import express from 'express';
import {
  enrollStudent,
  getEnrollments,
  getMyEnrollments,
} from '../controllers/enrollmentController.js';
import { requireAuth } from '../middleware/auth.js';
import { requireRole } from '../middleware/role.js';
import { requireInstitutionAccess } from '../middleware/tenant.js';
import { ROLES } from '../config/constants.js';

const router = express.Router();

router.use(requireAuth);
router.use(requireInstitutionAccess);

router.post('/', requireRole(ROLES.SUPER_ADMIN, ROLES.COLLEGE_ADMIN), enrollStudent);
router.get('/', requireRole(ROLES.SUPER_ADMIN, ROLES.COLLEGE_ADMIN, ROLES.FACULTY), getEnrollments);
router.get('/my-enrollments', requireRole(ROLES.STUDENT), getMyEnrollments);

export default router;
