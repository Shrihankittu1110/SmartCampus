import { logger } from '../utils/logger.js';
import { errorResponse } from '../utils/apiResponse.js';

export const errorHandler = (err, req, res, next) => {
  logger.error(`Error processing ${req.method} ${req.originalUrl}:`, err.stack || err.message);

  // Mongoose Validation Error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
    return errorResponse(res, 400, 'Database validation failed', errors);
  }

  // Duplicate Key Error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    return errorResponse(res, 409, `Duplicate entry. Record with that ${field} already exists.`);
  }

  // Cast Error (Invalid Mongo ObjectId)
  if (err.name === 'CastError') {
    return errorResponse(res, 400, `Invalid format for identifier: ${err.value}`);
  }

  // Multer Errors
  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return errorResponse(res, 400, 'File size limit exceeded (maximum allowed is 10MB).');
    }
    return errorResponse(res, 400, `File upload error: ${err.message}`);
  }

  // JWT Errors
  if (err.name === 'JsonWebTokenError') {
    return errorResponse(res, 401, 'Invalid authentication credentials.');
  }
  if (err.name === 'TokenExpiredError') {
    return errorResponse(res, 401, 'Authentication token expired. Please refresh or re-login.');
  }

  const statusCode = err.statusCode || 500;
  const message = process.env.NODE_ENV === 'production' && statusCode === 500
    ? 'An unexpected error occurred on the server'
    : err.message || 'Internal Server Error';

  return errorResponse(res, statusCode, message);
};
