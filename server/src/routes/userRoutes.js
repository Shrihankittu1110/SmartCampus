import express from 'express';
import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  toggleUserStatus,
  exportUsers,
} from '../controllers/userController.js';
import { requireAuth } from '../middleware/auth.js';
import { requireRole } from '../middleware/role.js';
import { requireInstitutionAccess } from '../middleware/tenant.js';
import { ROLES } from '../config/constants.js';

const router = express.Router();

router.use(requireAuth);
router.use(requireInstitutionAccess);

router.get('/export', requireRole(ROLES.SUPER_ADMIN, ROLES.COLLEGE_ADMIN, ROLES.FACULTY), exportUsers);
router.post('/', requireRole(ROLES.SUPER_ADMIN, ROLES.COLLEGE_ADMIN), createUser);
router.get('/', requireRole(ROLES.SUPER_ADMIN, ROLES.COLLEGE_ADMIN, ROLES.FACULTY, ROLES.PLACEMENT_OFFICER), getUsers);
router.get('/:id', requireRole(ROLES.SUPER_ADMIN, ROLES.COLLEGE_ADMIN, ROLES.FACULTY, ROLES.PLACEMENT_OFFICER), getUserById);
router.put('/:id', requireRole(ROLES.SUPER_ADMIN, ROLES.COLLEGE_ADMIN), updateUser);
router.patch('/:id/toggle-status', requireRole(ROLES.SUPER_ADMIN, ROLES.COLLEGE_ADMIN), toggleUserStatus);

export default router;
