import mongoose from 'mongoose';
import { ASSIGNMENT_STATUS } from '../config/constants.js';

const assignmentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Assignment title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Assignment description is required'],
    },
    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      required: true,
    },
    facultyId: {
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
    dueDate: {
      type: Date,
      required: [true, 'Due date is required'],
    },
    maxMarks: {
      type: Number,
      required: true,
      default: 100,
      min: 1,
    },
    attachments: [
      {
        name: String,
        url: String,
        mimeType: String,
        size: Number,
      },
    ],
    allowResubmission: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      enum: Object.values(ASSIGNMENT_STATUS),
      default: ASSIGNMENT_STATUS.PUBLISHED,
    },
  },
  {
    timestamps: true,
  }
);

assignmentSchema.index({ institutionId: 1, subjectId: 1, dueDate: 1 });
assignmentSchema.index({ facultyId: 1 });

const Assignment = mongoose.model('Assignment', assignmentSchema);
export default Assignment;
