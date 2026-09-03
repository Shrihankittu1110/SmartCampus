import express from 'express';
import {
  createAssignment,
  getAssignments,
  getAssignmentById,
  submitAssignment,
  getAssignmentSubmissions,
  gradeSubmission,
} from '../controllers/assignmentController.js';
import { requireAuth } from '../middleware/auth.js';
import { requireRole } from '../middleware/role.js';
import { requireInstitutionAccess } from '../middleware/tenant.js';
import { upload } from '../middleware/upload.js';
import { ROLES } from '../config/constants.js';

const router = express.Router();

router.use(requireAuth);
router.use(requireInstitutionAccess);

router.post('/', requireRole(ROLES.FACULTY, ROLES.COLLEGE_ADMIN, ROLES.SUPER_ADMIN), upload.array('attachments', 5), createAssignment);
router.get('/', getAssignments);
router.get('/:id', getAssignmentById);
router.post('/:id/submit', requireRole(ROLES.STUDENT), upload.single('submissionFile'), submitAssignment);
router.get('/:id/submissions', requireRole(ROLES.FACULTY, ROLES.COLLEGE_ADMIN, ROLES.SUPER_ADMIN), getAssignmentSubmissions);
router.put('/submissions/:submissionId/grade', requireRole(ROLES.FACULTY, ROLES.COLLEGE_ADMIN, ROLES.SUPER_ADMIN), gradeSubmission);

export default router;
