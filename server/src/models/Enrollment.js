import mongoose from 'mongoose';

const enrollmentSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    institutionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Institution',
      required: true,
    },
    academicYear: {
      type: String,
      required: true,
      default: '2025-2026',
    },
    semester: {
      type: Number,
      required: true,
      min: 1,
    },
    status: {
      type: String,
      enum: ['ENROLLED', 'COMPLETED', 'DROPPED'],
      default: 'ENROLLED',
    },
  },
  {
    timestamps: true,
  }
);

enrollmentSchema.index({ studentId: 1, courseId: 1, semester: 1, academicYear: 1 }, { unique: true });
enrollmentSchema.index({ institutionId: 1, courseId: 1, semester: 1 });

const Enrollment = mongoose.model('Enrollment', enrollmentSchema);
export default Enrollment;
