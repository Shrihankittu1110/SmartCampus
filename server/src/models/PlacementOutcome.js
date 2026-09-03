import mongoose from 'mongoose';

const placementOutcomeSchema = new mongoose.Schema(
  {
    applicationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PlacementApplication',
      required: true,
      unique: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },
    jobDriveId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'JobDrive',
      required: true,
    },
    institutionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Institution',
      required: true,
    },
    package: {
      type: Number, // In LPA
      required: true,
    },
    joiningDate: Date,
    offerLetterUrl: {
      type: String,
      default: '',
    },
    outcome: {
      type: String,
      enum: ['ACCEPTED', 'REJECTED', 'PENDING'],
      default: 'ACCEPTED',
    },
    recordedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

placementOutcomeSchema.index({ institutionId: 1, studentId: 1 });
placementOutcomeSchema.index({ companyId: 1 });

const PlacementOutcome = mongoose.model('PlacementOutcome', placementOutcomeSchema);
export default PlacementOutcome;
