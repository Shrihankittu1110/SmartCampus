import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Course name is required'],
      trim: true,
    },
    code: {
      type: String,
      required: [true, 'Course code is required'],
      uppercase: true,
      trim: true,
    },
    institutionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Institution',
      required: true,
    },
    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      required: true,
    },
    duration: {
      type: Number,
      required: true,
      default: 4, // In years
    },
    totalSemesters: {
      type: Number,
      required: true,
      default: 8,
    },
    academicYear: {
      type: String,
      default: '2025-2026',
    },
    description: {
      type: String,
      default: '',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

courseSchema.index({ institutionId: 1, code: 1 }, { unique: true });
courseSchema.index({ institutionId: 1, departmentId: 1 });

const Course = mongoose.model('Course', courseSchema);
export default Course;
