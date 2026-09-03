import mongoose from 'mongoose';
import { SUBMISSION_STATUS } from '../config/constants.js';

const assignmentSubmissionSchema = new mongoose.Schema(
  {
    assignmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Assignment',
      required: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    institutionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Institution',
      required: true,
    },
    file: {
      name: String,
      url: String,
      mimeType: String,
      size: Number,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: Object.values(SUBMISSION_STATUS),
      default: SUBMISSION_STATUS.SUBMITTED,
    },
    marks: {
      type: Number,
      min: 0,
    },
    feedback: {
      type: String,
      default: '',
    },
    gradedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    gradedAt: Date,
    version: {
      type: Number,
      default: 1,
    },
    isLate: {
      type: Boolean,
      default: false,
    },
    history: [
      {
        version: Number,
        file: {
          name: String,
          url: String,
          mimeType: String,
          size: Number,
        },
        submittedAt: Date,
        marks: Number,
        feedback: String,
        status: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

assignmentSubmissionSchema.index({ assignmentId: 1, studentId: 1 }, { unique: true });
assignmentSubmissionSchema.index({ studentId: 1, status: 1 });

const AssignmentSubmission = mongoose.model('AssignmentSubmission', assignmentSubmissionSchema);
export default AssignmentSubmission;
