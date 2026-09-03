import mongoose from 'mongoose';
import { REQUEST_TYPES, REQUEST_STATUS } from '../config/constants.js';

const studentRequestSchema = new mongoose.Schema(
  {
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
    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
    },
    requestType: {
      type: String,
      enum: Object.values(REQUEST_TYPES),
      required: true,
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    attachments: [
      {
        name: String,
        url: String,
        mimeType: String,
        size: Number,
      },
    ],
    status: {
      type: String,
      enum: Object.values(REQUEST_STATUS),
      default: REQUEST_STATUS.PENDING,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    response: {
      type: String,
      default: '',
    },
    responseAttachments: [
      {
        name: String,
        url: String,
      },
    ],
    resolvedAt: Date,
  },
  {
    timestamps: true,
  }
);

studentRequestSchema.index({ institutionId: 1, status: 1 });
studentRequestSchema.index({ studentId: 1, status: 1 });

const StudentRequest = mongoose.model('StudentRequest', studentRequestSchema);
export default StudentRequest;
