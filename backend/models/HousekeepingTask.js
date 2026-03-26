import mongoose from 'mongoose';

const housekeepingTaskSchema = new mongoose.Schema({
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true,
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  taskType: {
    type: String,
    trim: true,
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Completed'],
    default: 'Pending',
    required: true,
  }
}, { timestamps: true });

const HousekeepingTask = mongoose.model('HousekeepingTask', housekeepingTaskSchema);
export default HousekeepingTask;
