import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Event description is required'],
    },
    eventType: {
      type: String,
      enum: ['WORKSHOP', 'SEMINAR', 'CULTURAL', 'SPORTS', 'ACADEMIC', 'HACKATHON', 'EXAM', 'OTHER'],
      default: 'ACADEMIC',
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
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required'],
    },
    location: {
      type: String,
      required: [true, 'Location/Venue is required'],
      trim: true,
    },
    organizer: {
      type: String,
      default: '',
      trim: true,
    },
    registrationRequired: {
      type: Boolean,
      default: false,
    },
    maxParticipants: {
      type: Number,
      default: 0,
    },
    attendees: [
      {
        studentId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        registeredAt: {
          type: Date,
          default: Date.now,
        },
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

eventSchema.index({ institutionId: 1, startDate: 1 });
eventSchema.index({ institutionId: 1, departmentId: 1 });

const Event = mongoose.model('Event', eventSchema);
export default Event;
