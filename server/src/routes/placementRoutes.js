import express from 'express';
import {
  createCompany,
  getCompanies,
  updateCompany,
  createJobDrive,
  getJobDrives,
  getJobDriveById,
  applyForJobDrive,
  getMyApplications,
  getJobDriveApplications,
  updateApplicationStatus,
  createInterviewStage,
  getInterviewStages,
  updateInterviewStage,
  recordPlacementOutcome,
  getPlacementAnalytics,
  exportPlacementCSV,
} from '../controllers/placementController.js';
import { requireAuth } from '../middleware/auth.js';
import { requireRole } from '../middleware/role.js';
import { requireInstitutionAccess } from '../middleware/tenant.js';
import { upload } from '../middleware/upload.js';
import { ROLES } from '../config/constants.js';

const router = express.Router();

router.use(requireAuth);
router.use(requireInstitutionAccess);

// Analytics & Export
router.get('/analytics', requireRole(ROLES.PLACEMENT_OFFICER, ROLES.COLLEGE_ADMIN, ROLES.SUPER_ADMIN), getPlacementAnalytics);
router.get('/export', requireRole(ROLES.PLACEMENT_OFFICER, ROLES.COLLEGE_ADMIN, ROLES.SUPER_ADMIN), exportPlacementCSV);

// Companies
router.post('/companies', requireRole(ROLES.PLACEMENT_OFFICER, ROLES.COLLEGE_ADMIN, ROLES.SUPER_ADMIN), createCompany);
router.get('/companies', getCompanies);
router.put('/companies/:id', requireRole(ROLES.PLACEMENT_OFFICER, ROLES.COLLEGE_ADMIN, ROLES.SUPER_ADMIN), updateCompany);

// Drives
router.post('/drives', requireRole(ROLES.PLACEMENT_OFFICER, ROLES.COLLEGE_ADMIN, ROLES.SUPER_ADMIN), createJobDrive);
router.get('/drives', getJobDrives);
router.get('/drives/:id', getJobDriveById);
router.post('/drives/:id/apply', requireRole(ROLES.STUDENT), upload.single('resume'), applyForJobDrive);
router.get('/drives/:id/applications', requireRole(ROLES.PLACEMENT_OFFICER, ROLES.COLLEGE_ADMIN, ROLES.SUPER_ADMIN), getJobDriveApplications);

// Applications
router.get('/my-applications', requireRole(ROLES.STUDENT), getMyApplications);
router.put('/applications/:applicationId/status', requireRole(ROLES.PLACEMENT_OFFICER, ROLES.COLLEGE_ADMIN, ROLES.SUPER_ADMIN), updateApplicationStatus);

// Interviews
router.post('/interviews', requireRole(ROLES.PLACEMENT_OFFICER, ROLES.COLLEGE_ADMIN, ROLES.SUPER_ADMIN), createInterviewStage);
router.get('/interviews/:applicationId', getInterviewStages);
router.put('/interviews/:stageId', requireRole(ROLES.PLACEMENT_OFFICER, ROLES.COLLEGE_ADMIN, ROLES.SUPER_ADMIN), updateInterviewStage);

// Outcomes
router.post('/outcomes', requireRole(ROLES.PLACEMENT_OFFICER, ROLES.COLLEGE_ADMIN, ROLES.SUPER_ADMIN), recordPlacementOutcome);

export default router;
