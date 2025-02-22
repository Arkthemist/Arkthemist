import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false,
  },
  userType: {
    type: String, // Assuming UserType is a string, adjust if it's an enum or another type
    required: false,
  },
  email: {
    type: String,
    required: false,
  },
  walletAddress: {
    type: String,
    required: false,
  },
  specialty: {
    type: String,
    required: false,
  },
});

// If you have a UserType enum, you might want to import and use it here

export default mongoose.models.User || mongoose.model('User', UserSchema); 