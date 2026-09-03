import mongoose from 'mongoose';
import { APPLICATION_STATUS } from '../config/constants.js';

const placementApplicationSchema = new mongoose.Schema(
  {
    jobDriveId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'JobDrive',
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
    resume: {
      name: String,
      url: String,
    },
    status: {
      type: String,
      enum: Object.values(APPLICATION_STATUS),
      default: APPLICATION_STATUS.APPLIED,
    },
    appliedAt: {
      type: Date,
      default: Date.now,
    },
    shortlistedAt: Date,
    currentStage: {
      type: String,
      default: 'Application Submitted',
    },
    finalResult: {
      type: String,
      enum: ['PENDING', 'SELECTED', 'NOT_SELECTED'],
      default: 'PENDING',
    },
  },
  {
    timestamps: true,
  }
);

placementApplicationSchema.index({ jobDriveId: 1, studentId: 1 }, { unique: true });
placementApplicationSchema.index({ institutionId: 1, status: 1 });
placementApplicationSchema.index({ studentId: 1, status: 1 });

const PlacementApplication = mongoose.model('PlacementApplication', placementApplicationSchema);
export default PlacementApplication;
