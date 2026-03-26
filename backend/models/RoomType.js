import mongoose from 'mongoose';

const roomTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  basePrice: {
    type: Number,
    required: true,
    default: 100
  },
  capacity: {
    type: Number,
    required: true,
    default: 2
  },
  amenities: [{
    type: String
  }],
  images: [{
    type: String
  }]
}, { timestamps: true });

const RoomType = mongoose.model('RoomType', roomTypeSchema);
export default RoomType;
