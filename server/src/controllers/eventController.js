import Event from '../models/Event.js';
import { ROLES } from '../config/constants.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { logActivity } from '../utils/auditLogger.js';

export const createEvent = async (req, res, next) => {
  try {
    const institutionId = req.user.role === ROLES.SUPER_ADMIN ? req.body.institutionId : req.user.institutionId;
    const { title, description, eventType, departmentId, startDate, endDate, location, organizer, registrationRequired, maxParticipants } = req.body;

    const event = await Event.create({
      title,
      description,
      eventType: eventType || 'ACADEMIC',
      institutionId,
      departmentId: departmentId || null,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      location,
      organizer: organizer || req.user.name,
      registrationRequired: registrationRequired === true || registrationRequired === 'true',
      maxParticipants: Number(maxParticipants) || 0,
    });

    await logActivity({
      userId: req.user._id,
      institutionId,
      action: 'EVENT_CREATED',
      entity: 'Event',
      entityId: event._id.toString(),
      metadata: { title: event.title },
      req,
    });

    return successResponse(res, 201, 'Event created successfully', event);
  } catch (err) {
    next(err);
  }
};

export const getEvents = async (req, res, next) => {
  try {
    const institutionId = req.user.role === ROLES.SUPER_ADMIN ? (req.query.institutionId || req.user.institutionId) : req.user.institutionId;
    const query = { isActive: true };
    if (institutionId) query.institutionId = institutionId;

    if (req.query.departmentId) {
      query.$or = [{ departmentId: req.query.departmentId }, { departmentId: null }];
    }

    if (req.query.eventType) {
      query.eventType = req.query.eventType;
    }

    if (req.query.search) {
      query.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { location: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    const events = await Event.find(query)
      .populate('departmentId', 'name code')
      .sort({ startDate: 1 });

    return successResponse(res, 200, 'Events fetched successfully', events);
  } catch (err) {
    next(err);
  }
};

export const getEventById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const event = await Event.findById(id)
      .populate('departmentId', 'name code')
      .populate('attendees.studentId', 'name rollNumber email');

    if (!event) {
      return errorResponse(res, 404, 'Event not found');
    }

    return successResponse(res, 200, 'Event details fetched', event);
  } catch (err) {
    next(err);
  }
};

export const registerForEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const studentId = req.user._id;

    const event = await Event.findById(id);
    if (!event) {
      return errorResponse(res, 404, 'Event not found');
    }

    if (!event.registrationRequired) {
      return errorResponse(res, 400, 'Registration is not required for this event.');
    }

    const alreadyRegistered = event.attendees.some(
      (a) => a.studentId.toString() === studentId.toString()
    );
    if (alreadyRegistered) {
      return errorResponse(res, 400, 'You are already registered for this event.');
    }

    if (event.maxParticipants > 0 && event.attendees.length >= event.maxParticipants) {
      return errorResponse(res, 400, 'Event capacity has been reached.');
    }

    event.attendees.push({ studentId, registeredAt: new Date() });
    await event.save();

    await logActivity({
      userId: studentId,
      institutionId: event.institutionId,
      action: 'EVENT_REGISTRATION',
      entity: 'Event',
      entityId: event._id.toString(),
      req,
    });

    return successResponse(res, 200, 'Successfully registered for event', event);
  } catch (err) {
    next(err);
  }
};

export const cancelEventRegistration = async (req, res, next) => {
  try {
    const { id } = req.params;
    const studentId = req.user._id;

    const event = await Event.findById(id);
    if (!event) {
      return errorResponse(res, 404, 'Event not found');
    }

    event.attendees = event.attendees.filter(
      (a) => a.studentId.toString() !== studentId.toString()
    );
    await event.save();

    return successResponse(res, 200, 'Registration cancelled successfully', event);
  } catch (err) {
    next(err);
  }
};

export const updateEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await Event.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!updated) return errorResponse(res, 404, 'Event not found');
    return successResponse(res, 200, 'Event updated', updated);
  } catch (err) {
    next(err);
  }
};

export const deleteEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const event = await Event.findByIdAndUpdate(id, { isActive: false }, { new: true });
    if (!event) return errorResponse(res, 404, 'Event not found');
    return successResponse(res, 200, 'Event removed', event);
  } catch (err) {
    next(err);
  }
};
