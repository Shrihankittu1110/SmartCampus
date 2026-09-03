import Assignment from '../models/Assignment.js';
import AssignmentSubmission from '../models/AssignmentSubmission.js';
import Subject from '../models/Subject.js';
import User from '../models/User.js';
import { ROLES, SUBMISSION_STATUS } from '../config/constants.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { logActivity } from '../utils/auditLogger.js';
import { sendNotification } from '../utils/notify.js';

export const createAssignment = async (req, res, next) => {
  try {
    const { title, description, subjectId, dueDate, maxMarks, allowResubmission } = req.body;
    const institutionId = req.user.institutionId;

    const subject = await Subject.findById(subjectId);
    if (!subject) {
      return errorResponse(res, 404, 'Subject not found');
    }

    const attachments = req.files
      ? req.files.map((file) => ({
          name: file.originalname,
          url: `/uploads/${file.filename}`,
          mimeType: file.mimetype,
          size: file.size,
        }))
      : [];

    const assignment = await Assignment.create({
      title,
      description,
      subjectId,
      facultyId: req.user._id,
      institutionId,
      departmentId: subject.departmentId,
      dueDate: new Date(dueDate),
      maxMarks: Number(maxMarks) || 100,
      allowResubmission: allowResubmission === 'true' || allowResubmission === true,
      attachments,
    });

    await logActivity({
      userId: req.user._id,
      institutionId,
      action: 'ASSIGNMENT_CREATED',
      entity: 'Assignment',
      entityId: assignment._id.toString(),
      metadata: { title: assignment.title, subject: subject.name },
      req,
    });

    // Notify enrolled students in this department and semester
    const enrolledStudents = await User.find({
      institutionId,
      departmentId: subject.departmentId,
      currentSemester: subject.semester,
      role: ROLES.STUDENT,
      isActive: true,
    }).select('_id');

    for (const student of enrolledStudents) {
      await sendNotification({
        userId: student._id,
        institutionId,
        title: `New Assignment: ${assignment.title}`,
        message: `A new assignment has been posted for ${subject.name}. Due on ${new Date(dueDate).toLocaleDateString()}.`,
        type: 'ASSIGNMENT',
        relatedEntity: { entityType: 'Assignment', entityId: assignment._id.toString() },
      });
    }

    return successResponse(res, 201, 'Assignment created successfully', assignment);
  } catch (err) {
    next(err);
  }
};

export const getAssignments = async (req, res, next) => {
  try {
    const institutionId = req.user.institutionId;
    const query = { institutionId };

    if (req.query.subjectId) {
      query.subjectId = req.query.subjectId;
    }

    if (req.user.role === ROLES.FACULTY) {
      query.facultyId = req.user._id;
    } else if (req.user.role === ROLES.STUDENT) {
      if (req.user.departmentId) query.departmentId = req.user.departmentId;
    }

    const assignments = await Assignment.find(query)
      .populate('subjectId', 'name code semester')
      .populate('facultyId', 'name email')
      .sort({ dueDate: 1 });

    // If student, attach their submission status
    if (req.user.role === ROLES.STUDENT) {
      const studentSubmissions = await AssignmentSubmission.find({
        studentId: req.user._id,
        assignmentId: { $in: assignments.map((a) => a._id) },
      });

      const submissionMap = {};
      studentSubmissions.forEach((s) => {
        submissionMap[s.assignmentId.toString()] = s;
      });

      const assignmentsWithStatus = assignments.map((a) => {
        const doc = a.toObject();
        doc.submission = submissionMap[a._id.toString()] || null;
        return doc;
      });

      return successResponse(res, 200, 'Assignments fetched successfully', assignmentsWithStatus);
    }

    return successResponse(res, 200, 'Assignments fetched successfully', assignments);
  } catch (err) {
    next(err);
  }
};

export const getAssignmentById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const assignment = await Assignment.findById(id)
      .populate('subjectId', 'name code credits semester')
      .populate('facultyId', 'name email');

    if (!assignment) {
      return errorResponse(res, 404, 'Assignment not found');
    }

    let submission = null;
    if (req.user.role === ROLES.STUDENT) {
      submission = await AssignmentSubmission.findOne({
        assignmentId: id,
        studentId: req.user._id,
      });
    }

    return successResponse(res, 200, 'Assignment details fetched', {
      assignment,
      submission,
    });
  } catch (err) {
    next(err);
  }
};

export const submitAssignment = async (req, res, next) => {
  try {
    const { id: assignmentId } = req.params;
    const studentId = req.user._id;
    const institutionId = req.user.institutionId;

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return errorResponse(res, 404, 'Assignment not found');
    }

    if (!req.file) {
      return errorResponse(res, 400, 'Submission file is required.');
    }

    const isLate = new Date() > new Date(assignment.dueDate);

    const fileData = {
      name: req.file.originalname,
      url: `/uploads/${req.file.filename}`,
      mimeType: req.file.mimetype,
      size: req.file.size,
    };

    let existingSubmission = await AssignmentSubmission.findOne({
      assignmentId,
      studentId,
    });

    if (existingSubmission) {
      if (!assignment.allowResubmission && existingSubmission.status !== SUBMISSION_STATUS.RESUBMISSION_REQUESTED) {
        return errorResponse(res, 403, 'Resubmission is not permitted for this assignment.');
      }

      // Record old submission in audit history
      existingSubmission.history.push({
        version: existingSubmission.version,
        file: existingSubmission.file,
        submittedAt: existingSubmission.submittedAt,
        marks: existingSubmission.marks,
        feedback: existingSubmission.feedback,
        status: existingSubmission.status,
      });

      existingSubmission.file = fileData;
      existingSubmission.submittedAt = new Date();
      existingSubmission.status = SUBMISSION_STATUS.RESUBMITTED;
      existingSubmission.version += 1;
      existingSubmission.isLate = isLate;

      await existingSubmission.save();

      await logActivity({
        userId: studentId,
        institutionId,
        action: 'ASSIGNMENT_RESUBMITTED',
        entity: 'AssignmentSubmission',
        entityId: existingSubmission._id.toString(),
        metadata: { version: existingSubmission.version, isLate },
        req,
      });

      return successResponse(res, 200, 'Assignment resubmitted successfully', existingSubmission);
    }

    const newSubmission = await AssignmentSubmission.create({
      assignmentId,
      studentId,
      institutionId,
      file: fileData,
      submittedAt: new Date(),
      status: SUBMISSION_STATUS.SUBMITTED,
      isLate,
      version: 1,
    });

    await logActivity({
      userId: studentId,
      institutionId,
      action: 'ASSIGNMENT_SUBMITTED',
      entity: 'AssignmentSubmission',
      entityId: newSubmission._id.toString(),
      metadata: { isLate },
      req,
    });

    return successResponse(res, 201, 'Assignment submitted successfully', newSubmission);
  } catch (err) {
    next(err);
  }
};

export const getAssignmentSubmissions = async (req, res, next) => {
  try {
    const { id: assignmentId } = req.params;

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return errorResponse(res, 404, 'Assignment not found');
    }

    // Only faculty or admin can view all submissions
    if (
      req.user.role === ROLES.FACULTY &&
      assignment.facultyId.toString() !== req.user._id.toString()
    ) {
      return errorResponse(res, 403, 'You are not authorized to view submissions for this assignment.');
    }

    const submissions = await AssignmentSubmission.find({ assignmentId })
      .populate('studentId', 'name rollNumber email profileImage')
      .sort({ submittedAt: -1 });

    return successResponse(res, 200, 'Submissions fetched successfully', submissions);
  } catch (err) {
    next(err);
  }
};

export const gradeSubmission = async (req, res, next) => {
  try {
    const { submissionId } = req.params;
    const { marks, feedback, requestResubmission } = req.body;

    const submission = await AssignmentSubmission.findById(submissionId).populate('assignmentId');
    if (!submission) {
      return errorResponse(res, 404, 'Submission not found');
    }

    if (
      req.user.role === ROLES.FACULTY &&
      submission.assignmentId.facultyId.toString() !== req.user._id.toString()
    ) {
      return errorResponse(res, 403, 'Forbidden: Only the assigned faculty can grade this submission.');
    }

    if (marks !== undefined) {
      submission.marks = Number(marks);
    }
    if (feedback !== undefined) {
      submission.feedback = feedback;
    }

    submission.gradedBy = req.user._id;
    submission.gradedAt = new Date();

    if (requestResubmission) {
      submission.status = SUBMISSION_STATUS.RESUBMISSION_REQUESTED;
    } else {
      submission.status = SUBMISSION_STATUS.GRADED;
    }

    await submission.save();

    await logActivity({
      userId: req.user._id,
      institutionId: submission.institutionId,
      action: requestResubmission ? 'RESUBMISSION_REQUESTED' : 'ASSIGNMENT_GRADED',
      entity: 'AssignmentSubmission',
      entityId: submission._id.toString(),
      metadata: { marks: submission.marks, status: submission.status },
      req,
    });

    await sendNotification({
      userId: submission.studentId,
      institutionId: submission.institutionId,
      title: requestResubmission
        ? `Resubmission Requested: ${submission.assignmentId.title}`
        : `Assignment Graded: ${submission.assignmentId.title}`,
      message: requestResubmission
        ? `Faculty has requested a revision. Feedback: "${feedback || 'Please update your work'}"`
        : `You received ${marks}/${submission.assignmentId.maxMarks} marks. Feedback: "${feedback || 'Reviewed'}"`,
      type: 'ASSIGNMENT',
      relatedEntity: { entityType: 'Assignment', entityId: submission.assignmentId._id.toString() },
    });

    return successResponse(res, 200, 'Submission reviewed successfully', submission);
  } catch (err) {
    next(err);
  }
};
