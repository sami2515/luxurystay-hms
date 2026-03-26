import Notification from '../models/Notification.js';

// @desc    Get all notifications (latest first)
// @route   GET /api/notifications
// @access  Private (Admin/Receptionist/Housekeeping)
export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({}).sort({ createdAt: -1 }).limit(50);
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Server fault fetching alerts', error: error.message });
  }
};

// @desc    Mark all as read
// @route   PUT /api/notifications/read-all
// @access  Private
export const markAllRead = async (req, res) => {
  try {
    await Notification.updateMany({ isNewAlert: true }, { isNewAlert: false });
    res.json({ message: 'All matrices flagged as read.' });
  } catch (error) {
    res.status(500).json({ message: 'Server fault updating alerts', error: error.message });
  }
};

// Internal function to create and broadcast notification (called by other controllers)
export const createSystemNotification = async (type, message) => {
  try {
    await Notification.create({ type, message, isNewAlert: true });
  } catch (err) {
    console.error('Failed to mount internal Notification node:', err);
  }
};
