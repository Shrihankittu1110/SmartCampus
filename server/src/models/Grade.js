import mongoose from 'mongoose';

const gradeSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      required: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
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
    semester: {
      type: Number,
      required: true,
      min: 1,
    },
    academicYear: {
      type: String,
      required: true,
      default: '2025-2026',
    },
    marks: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    grade: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
    gradePoint: {
      type: Number,
      required: true,
      min: 0,
      max: 10,
    },
    remarks: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

gradeSchema.index({ studentId: 1, subjectId: 1, semester: 1, academicYear: 1 }, { unique: true });
gradeSchema.index({ studentId: 1, semester: 1 });
gradeSchema.index({ institutionId: 1, subjectId: 1 });

const Grade = mongoose.model('Grade', gradeSchema);
export default Grade;
