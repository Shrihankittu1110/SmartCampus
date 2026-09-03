import { ROLES } from '../config/constants.js';
import { errorResponse } from '../utils/apiResponse.js';

export const requireInstitutionAccess = (req, res, next) => {
  if (!req.user) {
    return errorResponse(res, 401, 'Unauthorized. Please log in.');
  }

  // Super Admin can access all institutions or specify one in params/query/body
  if (req.user.role === ROLES.SUPER_ADMIN) {
    req.institutionId =
      req.params.institutionId ||
      req.query.institutionId ||
      req.body?.institutionId ||
      null;
    return next();
  }

  // For all other roles, user must have an assigned institution
  if (!req.user.institutionId) {
    return errorResponse(res, 403, 'User is not associated with any institution.');
  }

  const requestedInstitutionId =
    req.params.institutionId ||
    req.query.institutionId ||
    req.body?.institutionId;

  if (
    requestedInstitutionId &&
    requestedInstitutionId.toString() !== req.user.institutionId.toString()
  ) {
    return errorResponse(
      res,
      403,
      'Access denied. You cannot access or modify records from another institution.'
    );
  }

  req.institutionId = req.user.institutionId;
  next();
};

export const requireDepartmentAccess = (req, res, next) => {
  if (!req.user) {
    return errorResponse(res, 401, 'Unauthorized. Please log in.');
  }

  // Super Admin & College Admin can manage all departments in their college
  if (
    req.user.role === ROLES.SUPER_ADMIN ||
    req.user.role === ROLES.COLLEGE_ADMIN ||
    req.user.role === ROLES.PLACEMENT_OFFICER
  ) {
    return next();
  }

  const requestedDepartmentId =
    req.params.departmentId ||
    req.query.departmentId ||
    req.body?.departmentId;

  if (
    requestedDepartmentId &&
    req.user.departmentId &&
    requestedDepartmentId.toString() !== req.user.departmentId.toString()
  ) {
    return errorResponse(
      res,
      403,
      'Access denied. You can only access resources within your assigned department.'
    );
  }

  next();
};
