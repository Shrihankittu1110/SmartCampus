import { body, param } from 'express-validator';

export const departmentValidator = [
  body('name').trim().notEmpty().withMessage('Department name is required'),
  body('code').trim().notEmpty().withMessage('Department code is required'),
];

export const courseValidator = [
  body('name').trim().notEmpty().withMessage('Course name is required'),
  body('code').trim().notEmpty().withMessage('Course code is required'),
  body('departmentId').isMongoId().withMessage('Valid department ID is required'),
  body('duration').isNumeric().withMessage('Duration in years must be a number'),
  body('totalSemesters').isNumeric().withMessage('Total semesters must be a number'),
];

export const subjectValidator = [
  body('name').trim().notEmpty().withMessage('Subject name is required'),
  body('code').trim().notEmpty().withMessage('Subject code is required'),
  body('courseId').isMongoId().withMessage('Valid course ID is required'),
  body('departmentId').isMongoId().withMessage('Valid department ID is required'),
  body('semester').isNumeric().withMessage('Semester must be a number'),
  body('credits').isNumeric().withMessage('Credits must be a number'),
];

export const attendanceValidator = [
  body('subjectId').isMongoId().withMessage('Valid subject ID is required'),
  body('date').isISO8601().withMessage('Valid attendance date is required'),
  body('records').isArray({ min: 1 }).withMessage('Attendance records array is required'),
  body('records.*.studentId').isMongoId().withMessage('Valid student ID is required for each record'),
  body('records.*.status')
    .isIn(['PRESENT', 'ABSENT', 'LATE', 'EXCUSED'])
    .withMessage('Valid status (PRESENT, ABSENT, LATE, EXCUSED) is required'),
];

export const assignmentValidator = [
  body('title').trim().notEmpty().withMessage('Assignment title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('subjectId').isMongoId().withMessage('Valid subject ID is required'),
  body('dueDate').isISO8601().withMessage('Valid due date is required'),
  body('maxMarks').isNumeric().withMessage('Max marks must be a number'),
];

export const gradeValidator = [
  body('studentId').isMongoId().withMessage('Valid student ID is required'),
  body('subjectId').isMongoId().withMessage('Valid subject ID is required'),
  body('courseId').isMongoId().withMessage('Valid course ID is required'),
  body('semester').isNumeric().withMessage('Semester must be a number'),
  body('marks').isFloat({ min: 0, max: 100 }).withMessage('Marks must be between 0 and 100'),
  body('grade').notEmpty().withMessage('Letter grade is required'),
];
