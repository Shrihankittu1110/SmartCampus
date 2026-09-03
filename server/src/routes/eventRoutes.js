import express from 'express';
import {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  registerForEvent,
  cancelEventRegistration,
} from '../controllers/eventController.js';
import { requireAuth } from '../middleware/auth.js';
import { requireRole } from '../middleware/role.js';
import { requireInstitutionAccess } from '../middleware/tenant.js';
import { ROLES } from '../config/constants.js';

const router = express.Router();

router.use(requireAuth);
router.use(requireInstitutionAccess);

router.post('/', requireRole(ROLES.COLLEGE_ADMIN, ROLES.SUPER_ADMIN, ROLES.FACULTY), createEvent);
router.get('/', getEvents);
router.get('/:id', getEventById);
router.put('/:id', requireRole(ROLES.COLLEGE_ADMIN, ROLES.SUPER_ADMIN, ROLES.FACULTY), updateEvent);
router.delete('/:id', requireRole(ROLES.COLLEGE_ADMIN, ROLES.SUPER_ADMIN), deleteEvent);
router.post('/:id/register', requireRole(ROLES.STUDENT), registerForEvent);
router.post('/:id/cancel-registration', requireRole(ROLES.STUDENT), cancelEventRegistration);

export default router;
