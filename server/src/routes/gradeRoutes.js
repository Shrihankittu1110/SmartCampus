import express from 'express';
import {
  recordGrade,
  getStudentGrades,
  getSubjectGrades,
} from '../controllers/gradeController.js';
import { requireAuth } from '../middleware/auth.js';
import { requireRole } from '../middleware/role.js';
import { requireInstitutionAccess } from '../middleware/tenant.js';
import { ROLES } from '../config/constants.js';
import { gradeValidator } from '../validators/academicValidator.js';
import { validateRequest } from '../middleware/validate.js';

const router = express.Router();

router.use(requireAuth);
router.use(requireInstitutionAccess);

router.post('/', requireRole(ROLES.FACULTY, ROLES.COLLEGE_ADMIN, ROLES.SUPER_ADMIN), gradeValidator, validateRequest, recordGrade);
router.get('/student/:studentId?', getStudentGrades);
router.get('/subject/:subjectId', requireRole(ROLES.FACULTY, ROLES.COLLEGE_ADMIN, ROLES.SUPER_ADMIN), getSubjectGrades);

export default router;
