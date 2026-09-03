import express from 'express';
import {
  markAttendance,
  getSubjectAttendanceForDate,
  getStudentAttendanceSummary,
  getCollegeAttendanceReport,
  exportAttendanceReportCSV,
} from '../controllers/attendanceController.js';
import { requireAuth } from '../middleware/auth.js';
import { requireRole } from '../middleware/role.js';
import { requireInstitutionAccess } from '../middleware/tenant.js';
import { ROLES } from '../config/constants.js';
import { attendanceValidator } from '../validators/academicValidator.js';
import { validateRequest } from '../middleware/validate.js';

const router = express.Router();

router.use(requireAuth);
router.use(requireInstitutionAccess);

router.post('/', requireRole(ROLES.FACULTY, ROLES.COLLEGE_ADMIN, ROLES.SUPER_ADMIN), attendanceValidator, validateRequest, markAttendance);
router.get('/export', requireRole(ROLES.FACULTY, ROLES.COLLEGE_ADMIN, ROLES.SUPER_ADMIN), exportAttendanceReportCSV);
router.get('/report', requireRole(ROLES.COLLEGE_ADMIN, ROLES.SUPER_ADMIN), getCollegeAttendanceReport);
router.get('/subject/:subjectId', requireRole(ROLES.FACULTY, ROLES.COLLEGE_ADMIN, ROLES.SUPER_ADMIN), getSubjectAttendanceForDate);
router.get('/student/:studentId?', getStudentAttendanceSummary);

export default router;
