import express from 'express';
import {
  createInstitution,
  getInstitutions,
  getInstitutionById,
  updateInstitution,
  deleteInstitution,
} from '../controllers/institutionController.js';
import { requireAuth } from '../middleware/auth.js';
import { requireRole } from '../middleware/role.js';
import { ROLES } from '../config/constants.js';

const router = express.Router();

router.use(requireAuth);

router.post('/', requireRole(ROLES.SUPER_ADMIN), createInstitution);
router.get('/', requireRole(ROLES.SUPER_ADMIN), getInstitutions);
router.get('/:id', requireRole(ROLES.SUPER_ADMIN, ROLES.COLLEGE_ADMIN), getInstitutionById);
router.put('/:id', requireRole(ROLES.SUPER_ADMIN, ROLES.COLLEGE_ADMIN), updateInstitution);
router.delete('/:id', requireRole(ROLES.SUPER_ADMIN), deleteInstitution);

export default router;
