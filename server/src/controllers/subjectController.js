import Subject from '../models/Subject.js';
import User from '../models/User.js';
import Enrollment from '../models/Enrollment.js';
import { ROLES } from '../config/constants.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { logActivity } from '../utils/auditLogger.js';

export const createSubject = async (req, res, next) => {
  try {
    const institutionId = req.user.role === ROLES.SUPER_ADMIN ? req.body.institutionId : req.user.institutionId;
    const { name, code, courseId, departmentId, facultyIds, credits, semester, academicYear, description, syllabus } = req.body;

    const existing = await Subject.findOne({ institutionId, code: code.toUpperCase() });
    if (existing) {
      return errorResponse(res, 409, 'Subject with this code already exists in this institution.');
    }

    const subject = await Subject.create({
      name,
      code: code.toUpperCase(),
      courseId,
      departmentId,
      institutionId,
      facultyIds: facultyIds || [],
      credits: Number(credits) || 3,
      semester: Number(semester) || 1,
      academicYear,
      description,
      syllabus: Array.isArray(syllabus) ? syllabus : [],
    });

    await logActivity({
      userId: req.user._id,
      institutionId,
      action: 'SUBJECT_CREATED',
      entity: 'Subject',
      entityId: subject._id.toString(),
      metadata: { code: subject.code },
      req,
    });

    return successResponse(res, 201, 'Subject created successfully', subject);
  } catch (err) {
    next(err);
  }
};

export const getSubjects = async (req, res, next) => {
  try {
    const institutionId = req.user.role === ROLES.SUPER_ADMIN ? (req.query.institutionId || req.user.institutionId) : req.user.institutionId;
    const query = { isActive: true };
    if (institutionId) query.institutionId = institutionId;
    if (req.query.courseId) query.courseId = req.query.courseId;
    if (req.query.departmentId) query.departmentId = req.query.departmentId;
    if (req.query.semester) query.semester = Number(req.query.semester);

    if (req.query.search) {
      query.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { code: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    const subjects = await Subject.find(query)
      .populate('courseId', 'name code')
      .populate('departmentId', 'name code')
      .populate('facultyIds', 'name email employeeId')
      .sort({ semester: 1, name: 1 });

    return successResponse(res, 200, 'Subjects fetched successfully', subjects);
  } catch (err) {
    next(err);
  }
};

export const getMySubjects = async (req, res, next) => {
  try {
    const institutionId = req.user.institutionId;
    let query = { institutionId, isActive: true };

    if (req.user.role === ROLES.FACULTY) {
      query.facultyIds = req.user._id;
    } else if (req.user.role === ROLES.STUDENT) {
      // Find subjects for the student's department & semester
      if (req.user.departmentId) {
        query.departmentId = req.user.departmentId;
      }
      if (req.user.currentSemester) {
        query.semester = req.user.currentSemester;
      }
    }

    const subjects = await Subject.find(query)
      .populate('courseId', 'name code')
      .populate('departmentId', 'name code')
      .populate('facultyIds', 'name email')
      .sort({ semester: 1, name: 1 });

    return successResponse(res, 200, 'Assigned subjects fetched', subjects);
  } catch (err) {
    next(err);
  }
};

export const getSubjectById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const subject = await Subject.findById(id)
      .populate('courseId', 'name code')
      .populate('departmentId', 'name code')
      .populate('facultyIds', 'name email employeeId');

    if (!subject) {
      return errorResponse(res, 404, 'Subject not found');
    }

    if (
      req.user.role !== ROLES.SUPER_ADMIN &&
      subject.institutionId.toString() !== req.user.institutionId?.toString()
    ) {
      return errorResponse(res, 403, 'Forbidden');
    }

    // Fetch enrolled students count for this subject's semester & department
    const studentCount = await User.countDocuments({
      institutionId: subject.institutionId,
      departmentId: subject.departmentId,
      currentSemester: subject.semester,
      role: ROLES.STUDENT,
      isActive: true,
    });

    return successResponse(res, 200, 'Subject details fetched', {
      subject,
      studentCount,
    });
  } catch (err) {
    next(err);
  }
};

export const updateSubject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const subject = await Subject.findById(id);
    if (!subject) {
      return errorResponse(res, 404, 'Subject not found');
    }

    if (
      req.user.role !== ROLES.SUPER_ADMIN &&
      subject.institutionId.toString() !== req.user.institutionId?.toString()
    ) {
      return errorResponse(res, 403, 'Forbidden');
    }

    const updated = await Subject.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate('courseId', 'name code')
      .populate('departmentId', 'name code')
      .populate('facultyIds', 'name email');

    await logActivity({
      userId: req.user._id,
      institutionId: subject.institutionId,
      action: 'SUBJECT_UPDATED',
      entity: 'Subject',
      entityId: subject._id.toString(),
      req,
    });

    return successResponse(res, 200, 'Subject updated successfully', updated);
  } catch (err) {
    next(err);
  }
};

export const deleteSubject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const subject = await Subject.findById(id);
    if (!subject) {
      return errorResponse(res, 404, 'Subject not found');
    }

    if (
      req.user.role !== ROLES.SUPER_ADMIN &&
      subject.institutionId.toString() !== req.user.institutionId?.toString()
    ) {
      return errorResponse(res, 403, 'Forbidden');
    }

    subject.isActive = false;
    await subject.save();

    await logActivity({
      userId: req.user._id,
      institutionId: subject.institutionId,
      action: 'SUBJECT_DEACTIVATED',
      entity: 'Subject',
      entityId: subject._id.toString(),
      req,
    });

    return successResponse(res, 200, 'Subject deactivated successfully', subject);
  } catch (err) {
    next(err);
  }
};

export const getSubjectStudents = async (req, res, next) => {
  try {
    const { id } = req.params;
    const subject = await Subject.findById(id);
    if (!subject) {
      return errorResponse(res, 404, 'Subject not found');
    }

    // 1. Find all students enrolled in the subject's course & semester
    const enrollments = await Enrollment.find({
      courseId: subject.courseId,
      semester: subject.semester,
      status: 'ACTIVE',
    }).populate({
      path: 'studentId',
      select: 'name email rollNumber cgpa backlogs currentSemester phone departmentId',
      populate: { path: 'departmentId', select: 'name code' },
    });

    let students = enrollments.map((e) => e.studentId).filter(Boolean);

    // 2. If enrollments were empty, fall back to students in the subject's department & semester
    if (students.length === 0) {
      students = await User.find({
        role: ROLES.STUDENT,
        institutionId: subject.institutionId,
        departmentId: subject.departmentId,
        currentSemester: subject.semester,
        isActive: true,
      })
        .populate('departmentId', 'name code')
        .select('name email rollNumber cgpa backlogs currentSemester phone departmentId');
    }

    // 3. If still empty, fall back to all active students in the subject's department
    if (students.length === 0) {
      students = await User.find({
        role: ROLES.STUDENT,
        institutionId: subject.institutionId,
        departmentId: subject.departmentId,
        isActive: true,
      })
        .populate('departmentId', 'name code')
        .select('name email rollNumber cgpa backlogs currentSemester phone departmentId');
    }

    // Sort cleanly by rollNumber
    students.sort((a, b) => (a.rollNumber || '').localeCompare(b.rollNumber || ''));

    return successResponse(res, 200, 'Enrolled students fetched successfully', students);
  } catch (err) {
    next(err);
  }
};

