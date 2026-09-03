import express from 'express';
import {
  createDepartment,
  getDepartments,
  getDepartmentById,
  updateDepartment,
  deleteDepartment,
} from '../controllers/departmentController.js';
import { requireAuth } from '../middleware/auth.js';
import { requireRole } from '../middleware/role.js';
import { requireInstitutionAccess } from '../middleware/tenant.js';
import { ROLES } from '../config/constants.js';
import { departmentValidator } from '../validators/academicValidator.js';
import { validateRequest } from '../middleware/validate.js';

const router = express.Router();

router.use(requireAuth);
router.use(requireInstitutionAccess);

router.post('/', requireRole(ROLES.SUPER_ADMIN, ROLES.COLLEGE_ADMIN), departmentValidator, validateRequest, createDepartment);
router.get('/', getDepartments);
router.get('/:id', getDepartmentById);
router.put('/:id', requireRole(ROLES.SUPER_ADMIN, ROLES.COLLEGE_ADMIN), updateDepartment);
router.delete('/:id', requireRole(ROLES.SUPER_ADMIN, ROLES.COLLEGE_ADMIN), deleteDepartment);

export default router;
