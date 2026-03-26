import mongoose from 'mongoose';

const serviceRequestSchema = new mongoose.Schema({
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true,
  },
  serviceType: {
    type: String,
    enum: ['Dining / Food', 'Laundry Operations', 'Generic Room Upgrades'],
    required: true,
  },
  details: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Completed'],
    default: 'Pending',
    required: true,
  }
}, { timestamps: true });

const ServiceRequest = mongoose.model('ServiceRequest', serviceRequestSchema);
export default ServiceRequest;
