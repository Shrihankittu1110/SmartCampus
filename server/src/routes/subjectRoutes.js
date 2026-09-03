import express from 'express';
import {
  createSubject,
  getSubjects,
  getMySubjects,
  getSubjectById,
  updateSubject,
  deleteSubject,
  getSubjectStudents,
} from '../controllers/subjectController.js';
import { requireAuth } from '../middleware/auth.js';
import { requireRole } from '../middleware/role.js';
import { requireInstitutionAccess } from '../middleware/tenant.js';
import { ROLES } from '../config/constants.js';
import { subjectValidator } from '../validators/academicValidator.js';
import { validateRequest } from '../middleware/validate.js';

const router = express.Router();

router.use(requireAuth);
router.use(requireInstitutionAccess);

router.post('/', requireRole(ROLES.SUPER_ADMIN, ROLES.COLLEGE_ADMIN), subjectValidator, validateRequest, createSubject);
router.get('/', getSubjects);
router.get('/my-subjects', getMySubjects);
router.get('/:id', getSubjectById);
router.get('/:id/students', getSubjectStudents);
router.put('/:id', requireRole(ROLES.SUPER_ADMIN, ROLES.COLLEGE_ADMIN), updateSubject);
router.delete('/:id', requireRole(ROLES.SUPER_ADMIN, ROLES.COLLEGE_ADMIN), deleteSubject);

export default router;
