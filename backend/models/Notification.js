import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['Booking', 'Maintenance', 'Review', 'System', 'Housekeeping'],
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  isNewAlert: {
    type: Boolean,
    default: true,
  }
}, { timestamps: true });

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
