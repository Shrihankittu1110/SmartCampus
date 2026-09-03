import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { ROLES } from '../config/constants.js';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: Object.values(ROLES),
      required: [true, 'User role is required'],
    },
    institutionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Institution',
      required: function () {
        return this.role !== ROLES.SUPER_ADMIN;
      },
    },
    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    profileImage: {
      type: String,
      default: '',
    },
    rollNumber: {
      type: String,
      uppercase: true,
      trim: true,
      default: '',
    },
    employeeId: {
      type: String,
      uppercase: true,
      trim: true,
      default: '',
    },
    currentSemester: {
      type: Number,
      default: 1,
    },
    academicYear: {
      type: String,
      default: '2025-2026',
    },
    cgpa: {
      type: Number,
      default: 0,
      min: 0,
      max: 10,
    },
    backlogs: {
      type: Number,
      default: 0,
      min: 0,
    },
    skills: [
      {
        type: String,
        trim: true,
      },
    ],
    resumeUrl: {
      type: String,
      default: '',
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: String,
    emailVerificationExpires: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    tokenVersion: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: Date,
  },
  {
    timestamps: true,
  }
);

userSchema.index({ institutionId: 1, role: 1 });
userSchema.index({ departmentId: 1 });
userSchema.index({ institutionId: 1, rollNumber: 1 });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
