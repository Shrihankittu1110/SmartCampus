import mongoose from 'mongoose';

const jobDriveSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Job description is required'],
    },
    institutionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Institution',
      required: true,
    },
    jobType: {
      type: String,
      enum: ['FULL_TIME', 'INTERNSHIP', 'CONTRACT'],
      default: 'FULL_TIME',
    },
    locations: [
      {
        type: String,
      },
    ],
    package: {
      ctc: {
        type: Number, // In LPA or annual number
        required: true,
        default: 0,
      },
      currency: {
        type: String,
        default: 'INR',
      },
      breakdown: {
        type: String,
        default: '',
      },
    },
    openings: {
      type: Number,
      default: 1,
    },
    applicationDeadline: {
      type: Date,
      required: [true, 'Application deadline is required'],
    },
    driveDate: {
      type: Date,
      required: [true, 'Drive date is required'],
    },
    eligibilityRules: {
      minCGPA: {
        type: Number,
        default: 0,
      },
      maxBacklogs: {
        type: Number,
        default: 0,
      },
      minPercentage: {
        type: Number,
        default: 0,
      },
      allowedDepartments: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Department',
        },
      ],
      allowedCourses: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Course',
        },
      ],
      graduationYear: {
        type: Number,
      },
      requiredSkills: [
        {
          type: String,
        },
      ],
    },
    requiredSkills: [
      {
        type: String,
      },
    ],
    status: {
      type: String,
      enum: ['DRAFT', 'PUBLISHED', 'ONGOING', 'COMPLETED', 'CANCELLED'],
      default: 'PUBLISHED',
    },
  },
  {
    timestamps: true,
  }
);

jobDriveSchema.index({ institutionId: 1, status: 1, applicationDeadline: 1 });
jobDriveSchema.index({ companyId: 1 });

const JobDrive = mongoose.model('JobDrive', jobDriveSchema);
export default JobDrive;
