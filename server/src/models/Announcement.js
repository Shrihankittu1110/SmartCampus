import mongoose from 'mongoose';

const announcementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    institutionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Institution',
      required: true,
    },
    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
    },
    targetRoles: [
      {
        type: String,
      },
    ],
    targetCourse: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
    },
    priority: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'],
      default: 'MEDIUM',
    },
    publishDate: {
      type: Date,
      default: Date.now,
    },
    expiryDate: Date,
  },
  {
    timestamps: true,
  }
);

announcementSchema.index({ institutionId: 1, publishDate: -1 });
announcementSchema.index({ institutionId: 1, departmentId: 1 });

const Announcement = mongoose.model('Announcement', announcementSchema);
export default Announcement;
