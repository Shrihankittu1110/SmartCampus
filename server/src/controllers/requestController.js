import StudentRequest from '../models/StudentRequest.js';
import { ROLES, REQUEST_STATUS } from '../config/constants.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { logActivity } from '../utils/auditLogger.js';
import { sendNotification } from '../utils/notify.js';

export const createRequest = async (req, res, next) => {
  try {
    const { requestType, subject, description } = req.body;
    const studentId = req.user._id;
    const institutionId = req.user.institutionId;
    const departmentId = req.user.departmentId;

    const attachments = req.files
      ? req.files.map((f) => ({
          name: f.originalname,
          url: `/uploads/${f.filename}`,
          mimeType: f.mimetype,
          size: f.size,
        }))
      : [];

    const request = await StudentRequest.create({
      studentId,
      institutionId,
      departmentId,
      requestType,
      subject,
      description,
      attachments,
      status: REQUEST_STATUS.PENDING,
    });

    await logActivity({
      userId: studentId,
      institutionId,
      action: 'STUDENT_REQUEST_CREATED',
      entity: 'StudentRequest',
      entityId: request._id.toString(),
      metadata: { requestType, subject },
      req,
    });

    return successResponse(res, 201, 'Request submitted successfully', request);
  } catch (err) {
    next(err);
  }
};

export const getMyRequests = async (req, res, next) => {
  try {
    const requests = await StudentRequest.find({ studentId: req.user._id })
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });

    return successResponse(res, 200, 'My requests fetched', requests);
  } catch (err) {
    next(err);
  }
};

export const getAllRequests = async (req, res, next) => {
  try {
    const institutionId = req.user.role === ROLES.SUPER_ADMIN ? (req.query.institutionId || req.user.institutionId) : req.user.institutionId;
    const query = { institutionId };

    if (req.query.status) query.status = req.query.status;
    if (req.query.requestType) query.requestType = req.query.requestType;
    if (req.query.departmentId) query.departmentId = req.query.departmentId;

    const requests = await StudentRequest.find(query)
      .populate('studentId', 'name rollNumber email profileImage')
      .populate('departmentId', 'name code')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });

    return successResponse(res, 200, 'Student requests fetched', requests);
  } catch (err) {
    next(err);
  }
};

export const updateRequestStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, response, assignedTo } = req.body;

    const request = await StudentRequest.findById(id);
    if (!request) {
      return errorResponse(res, 404, 'Request not found');
    }

    if (status) request.status = status;
    if (response !== undefined) request.response = response;
    if (assignedTo) request.assignedTo = assignedTo;

    if (status === REQUEST_STATUS.COMPLETED || status === REQUEST_STATUS.APPROVED || status === REQUEST_STATUS.REJECTED) {
      request.resolvedAt = new Date();
    }

    await request.save();

    await logActivity({
      userId: req.user._id,
      institutionId: request.institutionId,
      action: 'STUDENT_REQUEST_STATUS_UPDATED',
      entity: 'StudentRequest',
      entityId: request._id.toString(),
      metadata: { status: request.status, response: request.response },
      req,
    });

    await sendNotification({
      userId: request.studentId,
      institutionId: request.institutionId,
      title: `Request Status Update: ${request.subject}`,
      message: `Your ${request.requestType} request is now marked as ${request.status}. Response: "${request.response || 'Updated by administration'}"`,
      type: 'REQUEST_UPDATE',
      relatedEntity: { entityType: 'StudentRequest', entityId: request._id.toString() },
    });

    return successResponse(res, 200, 'Request status updated successfully', request);
  } catch (err) {
    next(err);
  }
};
