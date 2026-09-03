import Company from '../models/Company.js';
import JobDrive from '../models/JobDrive.js';
import PlacementApplication from '../models/PlacementApplication.js';
import InterviewStage from '../models/InterviewStage.js';
import PlacementOutcome from '../models/PlacementOutcome.js';
import User from '../models/User.js';
import { ROLES, APPLICATION_STATUS } from '../config/constants.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { logActivity } from '../utils/auditLogger.js';
import { sendNotification } from '../utils/notify.js';
import { checkStudentEligibility } from '../services/eligibilityService.js';
import { generatePlacementCSV } from '../services/exportService.js';

// --- COMPANY MANAGEMENT ---
export const createCompany = async (req, res, next) => {
  try {
    const institutionId = req.user.role === ROLES.SUPER_ADMIN ? req.body.institutionId : req.user.institutionId;
    const company = await Company.create({
      ...req.body,
      institutionId,
      createdBy: req.user._id,
    });

    await logActivity({
      userId: req.user._id,
      institutionId,
      action: 'COMPANY_CREATED',
      entity: 'Company',
      entityId: company._id.toString(),
      metadata: { name: company.name },
      req,
    });

    return successResponse(res, 201, 'Company created successfully', company);
  } catch (err) {
    next(err);
  }
};

export const getCompanies = async (req, res, next) => {
  try {
    const institutionId = req.user.role === ROLES.SUPER_ADMIN ? (req.query.institutionId || req.user.institutionId) : req.user.institutionId;
    const query = { isActive: true };
    if (institutionId) query.institutionId = institutionId;

    if (req.query.search) {
      query.name = { $regex: req.query.search, $options: 'i' };
    }

    const companies = await Company.find(query).sort({ name: 1 });
    return successResponse(res, 200, 'Companies fetched successfully', companies);
  } catch (err) {
    next(err);
  }
};

export const updateCompany = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await Company.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!updated) return errorResponse(res, 404, 'Company not found');
    return successResponse(res, 200, 'Company updated', updated);
  } catch (err) {
    next(err);
  }
};

// --- JOB DRIVE MANAGEMENT ---
export const createJobDrive = async (req, res, next) => {
  try {
    const institutionId = req.user.role === ROLES.SUPER_ADMIN ? req.body.institutionId : req.user.institutionId;
    const {
      companyId,
      title,
      description,
      jobType,
      locations,
      package: pkg,
      openings,
      applicationDeadline,
      driveDate,
      eligibilityRules,
      requiredSkills,
    } = req.body;

    const drive = await JobDrive.create({
      companyId,
      title,
      description,
      institutionId,
      jobType,
      locations: Array.isArray(locations) ? locations : [locations].filter(Boolean),
      package: pkg,
      openings: Number(openings) || 1,
      applicationDeadline: new Date(applicationDeadline),
      driveDate: new Date(driveDate),
      eligibilityRules: eligibilityRules || {},
      requiredSkills: Array.isArray(requiredSkills) ? requiredSkills : [],
      status: 'PUBLISHED',
    });

    await logActivity({
      userId: req.user._id,
      institutionId,
      action: 'JOB_DRIVE_CREATED',
      entity: 'JobDrive',
      entityId: drive._id.toString(),
      metadata: { title: drive.title },
      req,
    });

    // Notify all eligible students in the college
    const students = await User.find({
      institutionId,
      role: ROLES.STUDENT,
      isActive: true,
    }).select('_id name cgpa backlogs departmentId');

    for (const st of students) {
      const eligibility = checkStudentEligibility(st, drive);
      if (eligibility.isEligible) {
        await sendNotification({
          userId: st._id,
          institutionId,
          title: `New Placement Drive: ${drive.title}`,
          message: `You are eligible to apply for ${drive.title}. Deadline is ${new Date(applicationDeadline).toLocaleDateString()}.`,
          type: 'JOB_DRIVE',
          relatedEntity: { entityType: 'JobDrive', entityId: drive._id.toString() },
        });
      }
    }

    return successResponse(res, 201, 'Job drive created successfully', drive);
  } catch (err) {
    next(err);
  }
};

export const getJobDrives = async (req, res, next) => {
  try {
    const institutionId = req.user.role === ROLES.SUPER_ADMIN ? (req.query.institutionId || req.user.institutionId) : req.user.institutionId;
    const query = {};
    if (institutionId) query.institutionId = institutionId;

    if (req.query.status) query.status = req.query.status;

    const drives = await JobDrive.find(query)
      .populate('companyId', 'name logo website industry location')
      .populate('eligibilityRules.allowedDepartments', 'name code')
      .sort({ driveDate: 1 });

    // If caller is a student, attach their personalized eligibility check and application status
    if (req.user.role === ROLES.STUDENT) {
      const student = await User.findById(req.user._id);
      const studentApplications = await PlacementApplication.find({ studentId: req.user._id });

      const appMap = {};
      studentApplications.forEach((app) => {
        appMap[app.jobDriveId.toString()] = app;
      });

      const enrichedDrives = drives.map((d) => {
        const doc = d.toObject();
        const check = checkStudentEligibility(student, doc);
        doc.isEligible = check.isEligible;
        doc.ineligibilityReasons = check.reasons;
        doc.myApplication = appMap[d._id.toString()] || null;
        return doc;
      });

      return successResponse(res, 200, 'Job drives fetched', enrichedDrives);
    }

    return successResponse(res, 200, 'Job drives fetched successfully', drives);
  } catch (err) {
    next(err);
  }
};

export const getJobDriveById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const drive = await JobDrive.findById(id)
      .populate('companyId', 'name description website industry location packageRange logo')
      .populate('eligibilityRules.allowedDepartments', 'name code');

    if (!drive) return errorResponse(res, 404, 'Job drive not found');

    let isEligible = true;
    let reasons = [];
    let myApplication = null;

    if (req.user.role === ROLES.STUDENT) {
      const student = await User.findById(req.user._id);
      const evalResult = checkStudentEligibility(student, drive);
      isEligible = evalResult.isEligible;
      reasons = evalResult.reasons;
      myApplication = await PlacementApplication.findOne({
        jobDriveId: id,
        studentId: req.user._id,
      });
    }

    return successResponse(res, 200, 'Job drive details fetched', {
      drive,
      isEligible,
      ineligibilityReasons: reasons,
      myApplication,
    });
  } catch (err) {
    next(err);
  }
};

// --- APPLICATIONS ---
export const applyForJobDrive = async (req, res, next) => {
  try {
    const { id: jobDriveId } = req.params;
    const student = await User.findById(req.user._id);

    const drive = await JobDrive.findById(jobDriveId);
    if (!drive) {
      return errorResponse(res, 404, 'Job drive not found');
    }

    if (new Date() > new Date(drive.applicationDeadline)) {
      return errorResponse(res, 400, 'Application deadline has passed.');
    }

    // Server-side strict eligibility enforcement
    const check = checkStudentEligibility(student, drive);
    if (!check.isEligible) {
      return errorResponse(
        res,
        403,
        'Application rejected: You do not meet the eligibility criteria for this job drive.',
        check.reasons
      );
    }

    const existing = await PlacementApplication.findOne({
      jobDriveId,
      studentId: student._id,
    });
    if (existing) {
      return errorResponse(res, 409, 'You have already submitted an application for this drive.');
    }

    const resumeData = req.file
      ? { name: req.file.originalname, url: `/uploads/${req.file.filename}` }
      : { name: 'Profile Resume', url: student.resumeUrl || '' };

    const application = await PlacementApplication.create({
      jobDriveId,
      studentId: student._id,
      institutionId: drive.institutionId,
      resume: resumeData,
      status: APPLICATION_STATUS.APPLIED,
    });

    await logActivity({
      userId: student._id,
      institutionId: drive.institutionId,
      action: 'PLACEMENT_APPLICATION_SUBMITTED',
      entity: 'PlacementApplication',
      entityId: application._id.toString(),
      metadata: { jobDriveTitle: drive.title },
      req,
    });

    return successResponse(res, 201, 'Application submitted successfully', application);
  } catch (err) {
    next(err);
  }
};

export const getMyApplications = async (req, res, next) => {
  try {
    const applications = await PlacementApplication.find({ studentId: req.user._id })
      .populate({
        path: 'jobDriveId',
        populate: { path: 'companyId', select: 'name logo industry' },
      })
      .sort({ appliedAt: -1 });

    return successResponse(res, 200, 'My applications fetched', applications);
  } catch (err) {
    next(err);
  }
};

export const getJobDriveApplications = async (req, res, next) => {
  try {
    const { id: jobDriveId } = req.params;
    const applications = await PlacementApplication.find({ jobDriveId })
      .populate('studentId', 'name rollNumber email cgpa backlogs departmentId profileImage')
      .sort({ appliedAt: -1 });

    return successResponse(res, 200, 'Drive applications fetched', applications);
  } catch (err) {
    next(err);
  }
};

export const updateApplicationStatus = async (req, res, next) => {
  try {
    const { applicationId } = req.params;
    const { status, currentStage, finalResult } = req.body;

    const application = await PlacementApplication.findById(applicationId)
      .populate('jobDriveId', 'title')
      .populate('studentId', 'name email');

    if (!application) return errorResponse(res, 404, 'Application not found');

    if (status) application.status = status;
    if (currentStage) application.currentStage = currentStage;
    if (finalResult) application.finalResult = finalResult;

    if (status === APPLICATION_STATUS.SHORTLISTED) {
      application.shortlistedAt = new Date();
    }

    await application.save();

    await logActivity({
      userId: req.user._id,
      institutionId: application.institutionId,
      action: 'PLACEMENT_APPLICATION_STATUS_UPDATED',
      entity: 'PlacementApplication',
      entityId: application._id.toString(),
      metadata: { status: application.status, currentStage },
      req,
    });

    await sendNotification({
      userId: application.studentId._id,
      institutionId: application.institutionId,
      title: `Placement Update: ${application.jobDriveId.title}`,
      message: `Your application status has been updated to ${application.status}. Current stage: ${application.currentStage}.`,
      type: 'PLACEMENT',
      relatedEntity: { entityType: 'PlacementApplication', entityId: application._id.toString() },
    });

    return successResponse(res, 200, 'Application status updated', application);
  } catch (err) {
    next(err);
  }
};

// --- INTERVIEW STAGES ---
export const createInterviewStage = async (req, res, next) => {
  try {
    const { applicationId, stageName, stageOrder, scheduledAt, interviewer, mode, locationOrLink } = req.body;

    const application = await PlacementApplication.findById(applicationId).populate('jobDriveId', 'title');
    if (!application) return errorResponse(res, 404, 'Application not found');

    const stage = await InterviewStage.create({
      applicationId,
      stageName,
      stageOrder: Number(stageOrder) || 1,
      scheduledAt: new Date(scheduledAt),
      interviewer,
      mode: mode || 'ONLINE',
      locationOrLink,
      result: 'PENDING',
    });

    application.status = APPLICATION_STATUS.INTERVIEW;
    application.currentStage = stageName;
    await application.save();

    await sendNotification({
      userId: application.studentId,
      institutionId: application.institutionId,
      title: `Interview Scheduled: ${stageName}`,
      message: `Your ${stageName} for ${application.jobDriveId.title} is scheduled on ${new Date(scheduledAt).toLocaleString()}. Mode: ${mode}.`,
      type: 'INTERVIEW',
      relatedEntity: { entityType: 'InterviewStage', entityId: stage._id.toString() },
    });

    return successResponse(res, 201, 'Interview stage scheduled', stage);
  } catch (err) {
    next(err);
  }
};

export const getInterviewStages = async (req, res, next) => {
  try {
    const { applicationId } = req.params;
    const stages = await InterviewStage.find({ applicationId }).sort({ stageOrder: 1 });
    return successResponse(res, 200, 'Interview stages fetched', stages);
  } catch (err) {
    next(err);
  }
};

export const updateInterviewStage = async (req, res, next) => {
  try {
    const { stageId } = req.params;
    const { result, feedback } = req.body;

    const stage = await InterviewStage.findById(stageId);
    if (!stage) return errorResponse(res, 404, 'Interview stage not found');

    if (result) stage.result = result;
    if (feedback !== undefined) stage.feedback = feedback;
    await stage.save();

    return successResponse(res, 200, 'Interview stage updated', stage);
  } catch (err) {
    next(err);
  }
};

// --- PLACEMENT OUTCOMES ---
export const recordPlacementOutcome = async (req, res, next) => {
  try {
    const { applicationId, package: pkg, joiningDate, offerLetterUrl, outcome } = req.body;

    const application = await PlacementApplication.findById(applicationId).populate('jobDriveId');
    if (!application) return errorResponse(res, 404, 'Application not found');

    const placementOutcome = await PlacementOutcome.create({
      applicationId,
      studentId: application.studentId,
      companyId: application.jobDriveId.companyId,
      jobDriveId: application.jobDriveId._id,
      institutionId: application.institutionId,
      package: Number(pkg),
      joiningDate: joiningDate ? new Date(joiningDate) : null,
      offerLetterUrl: offerLetterUrl || '',
      outcome: outcome || 'ACCEPTED',
      recordedBy: req.user._id,
    });

    application.status = APPLICATION_STATUS.SELECTED;
    application.finalResult = 'SELECTED';
    application.currentStage = 'Offer Released';
    await application.save();

    await sendNotification({
      userId: application.studentId,
      institutionId: application.institutionId,
      title: 'Congratulations on Your Placement Offer!',
      message: `You have been selected for ${application.jobDriveId.title} with a package of ${pkg} LPA!`,
      type: 'PLACEMENT',
      relatedEntity: { entityType: 'PlacementOutcome', entityId: placementOutcome._id.toString() },
    });

    return successResponse(res, 201, 'Placement outcome recorded successfully', placementOutcome);
  } catch (err) {
    next(err);
  }
};

// --- PLACEMENT ANALYTICS & CSV EXPORT ---
export const getPlacementAnalytics = async (req, res, next) => {
  try {
    const institutionId = req.user.role === ROLES.SUPER_ADMIN ? (req.query.institutionId || req.user.institutionId) : req.user.institutionId;

    const [totalCompanies, totalDrives, totalApplications, outcomes] = await Promise.all([
      Company.countDocuments({ institutionId, isActive: true }),
      JobDrive.countDocuments({ institutionId }),
      PlacementApplication.countDocuments({ institutionId }),
      PlacementOutcome.find({ institutionId, outcome: 'ACCEPTED' }),
    ]);

    const totalSelected = outcomes.length;
    const totalPackages = outcomes.map((o) => o.package);
    const avgPackage =
      totalPackages.length > 0
        ? (totalPackages.reduce((a, b) => a + b, 0) / totalPackages.length).toFixed(2)
        : 0;
    const highestPackage = totalPackages.length > 0 ? Math.max(...totalPackages) : 0;

    // Department breakdown
    const departmentStats = await PlacementApplication.aggregate([
      { $match: { institutionId, status: 'SELECTED' } },
      {
        $lookup: {
          from: 'users',
          localField: 'studentId',
          foreignField: '_id',
          as: 'student',
        },
      },
      { $unwind: '$student' },
      {
        $lookup: {
          from: 'departments',
          localField: 'student.departmentId',
          foreignField: '_id',
          as: 'dept',
        },
      },
      { $unwind: { path: '$dept', preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: '$dept.name',
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          department: { $ifNull: ['$_id', 'General'] },
          count: 1,
          _id: 0,
        },
      },
    ]);

    return successResponse(res, 200, 'Placement analytics fetched', {
      totalCompanies,
      totalDrives,
      totalApplications,
      totalSelected,
      averagePackage: Number(avgPackage),
      highestPackage: Number(highestPackage),
      departmentStats,
    });
  } catch (err) {
    next(err);
  }
};

export const exportPlacementCSV = async (req, res, next) => {
  try {
    const institutionId = req.user.role === ROLES.SUPER_ADMIN ? (req.query.institutionId || req.user.institutionId) : req.user.institutionId;

    const applications = await PlacementApplication.find({ institutionId })
      .populate({
        path: 'studentId',
        populate: { path: 'departmentId', select: 'name' },
      })
      .populate({
        path: 'jobDriveId',
        populate: { path: 'companyId', select: 'name' },
      })
      .sort({ appliedAt: -1 });

    const csv = generatePlacementCSV(applications);
    res.header('Content-Type', 'text/csv');
    res.attachment(`placement-report-${Date.now()}.csv`);
    return res.send(csv);
  } catch (err) {
    next(err);
  }
};
