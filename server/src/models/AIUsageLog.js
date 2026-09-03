import mongoose from 'mongoose';

const aiUsageLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    institutionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Institution',
    },
    feature: {
      type: String,
      required: true,
      enum: [
        'PERFORMANCE_SUMMARY',
        'WEAK_SUBJECT_ANALYSIS',
        'STUDY_PLAN',
        'RESOURCE_RECOMMENDATION',
      ],
    },
    inputSummary: {
      type: String,
      default: '',
    },
    outputSummary: {
      type: String,
      default: '',
    },
    tokensUsed: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

aiUsageLogSchema.index({ userId: 1, createdAt: -1 });

const AIUsageLog = mongoose.model('AIUsageLog', aiUsageLogSchema);
export default AIUsageLog;
