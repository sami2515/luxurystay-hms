import mongoose from 'mongoose';

const guestProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true // One user has one profile
  },
  nicOrPassport: {
    type: String,
    required: true,
    trim: true,
  },
  address: {
    type: String,
    trim: true,
  },
  preferences: {
    type: String,
    trim: true, // E.g., "smoking, top floor, quiet room"
  }
}, { timestamps: true });

const GuestProfile = mongoose.model('GuestProfile', guestProfileSchema);
export default GuestProfile;
