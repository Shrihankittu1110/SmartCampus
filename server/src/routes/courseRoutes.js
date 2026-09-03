import express from 'express';
import {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
} from '../controllers/courseController.js';
import { requireAuth } from '../middleware/auth.js';
import { requireRole } from '../middleware/role.js';
import { requireInstitutionAccess } from '../middleware/tenant.js';
import { ROLES } from '../config/constants.js';
import { courseValidator } from '../validators/academicValidator.js';
import { validateRequest } from '../middleware/validate.js';

const router = express.Router();

router.use(requireAuth);
router.use(requireInstitutionAccess);

router.post('/', requireRole(ROLES.SUPER_ADMIN, ROLES.COLLEGE_ADMIN), courseValidator, validateRequest, createCourse);
router.get('/', getCourses);
router.get('/:id', getCourseById);
router.put('/:id', requireRole(ROLES.SUPER_ADMIN, ROLES.COLLEGE_ADMIN), updateCourse);
router.delete('/:id', requireRole(ROLES.SUPER_ADMIN, ROLES.COLLEGE_ADMIN), deleteCourse);

export default router;
