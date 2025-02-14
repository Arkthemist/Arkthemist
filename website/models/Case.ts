import mongoose from 'mongoose';

const CaseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  roomId: {
    type: String,
    required: true,
  },
  partyA: {
    type: String,
    required: true,
  },
  partyB: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['active', 'resolved'],
    default: 'active',
  }, 
});

export default mongoose.models.Case || mongoose.model('Case', CaseSchema); 