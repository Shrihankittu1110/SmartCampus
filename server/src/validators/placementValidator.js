import { body } from 'express-validator';

export const companyValidator = [
  body('name').trim().notEmpty().withMessage('Company name is required'),
  body('industry').optional().trim(),
];

export const jobDriveValidator = [
  body('companyId').isMongoId().withMessage('Valid company ID is required'),
  body('title').trim().notEmpty().withMessage('Job title is required'),
  body('description').trim().notEmpty().withMessage('Job description is required'),
  body('applicationDeadline').isISO8601().withMessage('Valid application deadline is required'),
  body('driveDate').isISO8601().withMessage('Valid drive date is required'),
  body('package.ctc').isNumeric().withMessage('Package CTC must be a number'),
];

export const interviewStageValidator = [
  body('stageName').trim().notEmpty().withMessage('Stage name is required'),
  body('scheduledAt').isISO8601().withMessage('Valid scheduled date/time is required'),
  body('mode').isIn(['ONLINE', 'OFFLINE']).withMessage('Mode must be ONLINE or OFFLINE'),
];

export const placementOutcomeValidator = [
  body('applicationId').isMongoId().withMessage('Valid application ID is required'),
  body('package').isNumeric().withMessage('Final package must be a number in LPA'),
];
