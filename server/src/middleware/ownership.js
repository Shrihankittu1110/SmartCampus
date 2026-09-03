import { ROLES } from '../config/constants.js';
import { errorResponse } from '../utils/apiResponse.js';

export const requireOwnership = (Model, idParam = 'id', ownerField = 'studentId') => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return errorResponse(res, 401, 'Unauthorized');
      }

      // Admins and faculty can bypass strict individual ownership checks
      if (
        req.user.role === ROLES.SUPER_ADMIN ||
        req.user.role === ROLES.COLLEGE_ADMIN ||
        req.user.role === ROLES.FACULTY ||
        req.user.role === ROLES.PLACEMENT_OFFICER
      ) {
        return next();
      }

      const resourceId = req.params[idParam];
      if (!resourceId) {
        return next();
      }

      const resource = await Model.findById(resourceId);
      if (!resource) {
        return errorResponse(res, 404, 'Resource not found');
      }

      const ownerId = resource[ownerField]?.toString() || resource.userId?.toString();

      if (ownerId !== req.user._id.toString()) {
        return errorResponse(
          res,
          403,
          'Access forbidden. You do not have ownership permission for this resource.'
        );
      }

      req.resource = resource;
      next();
    } catch (err) {
      next(err);
    }
  };
};
