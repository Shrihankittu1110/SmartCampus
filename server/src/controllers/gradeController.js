import Grade from '../models/Grade.js';
import Subject from '../models/Subject.js';
import User from '../models/User.js';
import { ROLES } from '../config/constants.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { logActivity } from '../utils/auditLogger.js';

export const recordGrade = async (req, res, next) => {
  try {
    const { studentId, subjectId, courseId, semester, academicYear, marks, grade, gradePoint, remarks } = req.body;
    const institutionId = req.user.institutionId;

    const existingGrade = await Grade.findOne({
      studentId,
      subjectId,
      semester,
      academicYear: academicYear || '2025-2026',
    });

    if (existingGrade) {
      existingGrade.marks = Number(marks);
      existingGrade.grade = grade.toUpperCase();
      existingGrade.gradePoint = Number(gradePoint) || 0;
      existingGrade.remarks = remarks || '';
      existingGrade.facultyId = req.user._id;
      await existingGrade.save();

      await logActivity({
        userId: req.user._id,
        institutionId,
        action: 'GRADE_UPDATED',
        entity: 'Grade',
        entityId: existingGrade._id.toString(),
        metadata: { studentId, subjectId, marks, grade },
        req,
      });

      return successResponse(res, 200, 'Grade updated successfully', existingGrade);
    }

    const newGrade = await Grade.create({
      studentId,
      subjectId,
      courseId,
      facultyId: req.user._id,
      institutionId,
      semester: Number(semester) || 1,
      academicYear: academicYear || '2025-2026',
      marks: Number(marks),
      grade: grade.toUpperCase(),
      gradePoint: Number(gradePoint) || 0,
      remarks: remarks || '',
    });

    await logActivity({
      userId: req.user._id,
      institutionId,
      action: 'GRADE_ENTERED',
      entity: 'Grade',
      entityId: newGrade._id.toString(),
      metadata: { studentId, subjectId, marks, grade },
      req,
    });

    return successResponse(res, 201, 'Grade recorded successfully', newGrade);
  } catch (err) {
    next(err);
  }
};

export const getStudentGrades = async (req, res, next) => {
  try {
    const studentId = req.params.studentId || req.user._id;

    if (req.user.role === ROLES.STUDENT && studentId.toString() !== req.user._id.toString()) {
      return errorResponse(res, 403, 'Forbidden: You can only view your own academic grades.');
    }

    const grades = await Grade.find({ studentId })
      .populate('subjectId', 'name code credits')
      .populate('courseId', 'name code')
      .populate('facultyId', 'name')
      .sort({ semester: 1 });

    // Calculate GPA / CGPA
    const totalCredits = grades.reduce((sum, g) => sum + (g.subjectId?.credits || 3), 0);
    const weightedPoints = grades.reduce(
      (sum, g) => sum + (g.gradePoint || 0) * (g.subjectId?.credits || 3),
      0
    );
    const cgpa = totalCredits > 0 ? (weightedPoints / totalCredits).toFixed(2) : '0.00';

    return successResponse(res, 200, 'Student grades fetched', {
      grades,
      summary: {
        totalSubjects: grades.length,
        totalCredits,
        cgpa: Number(cgpa),
      },
    });
  } catch (err) {
    next(err);
  }
};

export const getSubjectGrades = async (req, res, next) => {
  try {
    const { subjectId } = req.params;
    const grades = await Grade.find({ subjectId })
      .populate('studentId', 'name rollNumber email profileImage')
      .sort({ marks: -1 });

    return successResponse(res, 200, 'Subject grades fetched', grades);
  } catch (err) {
    next(err);
  }
};
