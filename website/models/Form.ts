import mongoose from 'mongoose';

const FormSchema = new mongoose.Schema({
  formId: {
    type: mongoose.Schema.Types.ObjectId,
    auto: true,
  },
  type: {
    type: String,
    enum: ['Contract-for-services', 'POA', 'NDA'],
    required: true,
  },
  lawyer: {
    type: String,
    required: true,
  },
  user_id: {
    type: String,
    required: true,
  },
  case_status: {
    type: String,
    enum: ['pending-lawyer', 'pending-signature', 'completed'],
    required: true,
  },
  input: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  documentUrl: {
    type: String,
    default: '',
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    required: true,
  },
  createdBy: {
    userType: {
      type: String,
      enum: ['lawyer', 'user'],
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Form || mongoose.model('Form', FormSchema);
