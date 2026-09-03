import mongoose from 'mongoose';

const subjectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Subject name is required'],
      trim: true,
    },
    code: {
      type: String,
      required: [true, 'Subject code is required'],
      uppercase: true,
      trim: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      required: true,
    },
    institutionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Institution',
      required: true,
    },
    facultyIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    credits: {
      type: Number,
      default: 3,
      min: 1,
    },
    semester: {
      type: Number,
      required: true,
      min: 1,
    },
    academicYear: {
      type: String,
      default: '2025-2026',
    },
    description: {
      type: String,
      default: '',
    },
    syllabus: [
      {
        type: String,
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

subjectSchema.index({ institutionId: 1, code: 1 }, { unique: true });
subjectSchema.index({ courseId: 1, semester: 1 });
subjectSchema.index({ facultyIds: 1 });

const Subject = mongoose.model('Subject', subjectSchema);
export default Subject;
