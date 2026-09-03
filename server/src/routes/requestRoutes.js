import express from 'express';
import {
  createRequest,
  getMyRequests,
  getAllRequests,
  updateRequestStatus,
} from '../controllers/requestController.js';
import { requireAuth } from '../middleware/auth.js';
import { requireRole } from '../middleware/role.js';
import { requireInstitutionAccess } from '../middleware/tenant.js';
import { upload } from '../middleware/upload.js';
import { ROLES } from '../config/constants.js';

const router = express.Router();

router.use(requireAuth);
router.use(requireInstitutionAccess);

router.post('/', requireRole(ROLES.STUDENT), upload.array('attachments', 3), createRequest);
router.get('/my-requests', requireRole(ROLES.STUDENT), getMyRequests);
router.get('/', requireRole(ROLES.COLLEGE_ADMIN, ROLES.SUPER_ADMIN, ROLES.FACULTY), getAllRequests);
router.put('/:id/status', requireRole(ROLES.COLLEGE_ADMIN, ROLES.SUPER_ADMIN, ROLES.FACULTY), updateRequestStatus);

export default router;
