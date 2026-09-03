import mongoose from 'mongoose';

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    website: {
      type: String,
      trim: true,
      default: '',
    },
    industry: {
      type: String,
      default: 'Technology',
    },
    location: {
      type: String,
      default: '',
    },
    contactPerson: {
      type: String,
      default: '',
    },
    contactEmail: {
      type: String,
      lowercase: true,
      trim: true,
    },
    contactPhone: {
      type: String,
      default: '',
    },
    packageRange: {
      type: String,
      default: '',
    },
    logo: {
      type: String,
      default: '',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    institutionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Institution',
      required: true,
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

companySchema.index({ institutionId: 1, name: 1 });

const Company = mongoose.model('Company', companySchema);
export default Company;
