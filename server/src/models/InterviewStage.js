import mongoose from 'mongoose';
import { INTERVIEW_RESULT } from '../config/constants.js';

const interviewStageSchema = new mongoose.Schema(
  {
    applicationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PlacementApplication',
      required: true,
    },
    stageName: {
      type: String,
      required: [true, 'Stage name is required'],
      trim: true,
    },
    stageOrder: {
      type: Number,
      default: 1,
    },
    scheduledAt: {
      type: Date,
      required: [true, 'Scheduled date/time is required'],
    },
    interviewer: {
      type: String,
      default: '',
    },
    mode: {
      type: String,
      enum: ['ONLINE', 'OFFLINE'],
      default: 'ONLINE',
    },
    locationOrLink: {
      type: String,
      default: '',
    },
    result: {
      type: String,
      enum: Object.values(INTERVIEW_RESULT),
      default: INTERVIEW_RESULT.PENDING,
    },
    feedback: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

interviewStageSchema.index({ applicationId: 1, stageOrder: 1 });

const InterviewStage = mongoose.model('InterviewStage', interviewStageSchema);
export default InterviewStage;
