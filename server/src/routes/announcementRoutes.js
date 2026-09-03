import express from 'express';
import {
  createAnnouncement,
  getAnnouncements,
  deleteAnnouncement,
} from '../controllers/announcementController.js';
import { requireAuth } from '../middleware/auth.js';
import { requireRole } from '../middleware/role.js';
import { requireInstitutionAccess } from '../middleware/tenant.js';
import { ROLES } from '../config/constants.js';

const router = express.Router();

router.use(requireAuth);
router.use(requireInstitutionAccess);

router.post('/', requireRole(ROLES.COLLEGE_ADMIN, ROLES.SUPER_ADMIN, ROLES.FACULTY), createAnnouncement);
router.get('/', getAnnouncements);
router.delete('/:id', requireRole(ROLES.COLLEGE_ADMIN, ROLES.SUPER_ADMIN), deleteAnnouncement);

export default router;
