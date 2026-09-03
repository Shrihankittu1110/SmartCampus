import { ROLES } from '../config/constants.js';
import { errorResponse } from '../utils/apiResponse.js';

export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return errorResponse(res, 401, 'Unauthorized. Please log in.');
    }

    // SUPER_ADMIN has platform-wide authority unless restricted
    if (req.user.role === ROLES.SUPER_ADMIN || allowedRoles.includes(req.user.role)) {
      return next();
    }

    return errorResponse(
      res,
      403,
      `Forbidden. Role '${req.user.role}' is not authorized to access this resource.`
    );
  };
};
