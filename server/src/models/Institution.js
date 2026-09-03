import mongoose from 'mongoose';

const institutionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Institution name is required'],
      trim: true,
    },
    code: {
      type: String,
      required: [true, 'Institution code is required'],
      unique: true,
      uppercase: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Contact email is required'],
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    logo: {
      type: String,
      default: '',
    },
    website: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    settings: {
      attendanceSafeThreshold: {
        type: Number,
        default: 75,
      },
      attendanceWarningThreshold: {
        type: Number,
        default: 65,
      },
      allowStudentSelfRegistration: {
        type: Boolean,
        default: false,
      },
      academicYear: {
        type: String,
        default: '2025-2026',
      },
      currentSemester: {
        type: Number,
        default: 1,
      },
    },
  },
  {
    timestamps: true,
  }
);

institutionSchema.index({ code: 1, isActive: 1 });

const Institution = mongoose.model('Institution', institutionSchema);
export default Institution;
