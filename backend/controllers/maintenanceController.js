import MaintenanceRequest from '../models/MaintenanceRequest.js';
import Room from '../models/Room.js';

// @desc    Create a maintenance request
// @route   POST /api/maintenance
// @access  Private
export const createMaintenanceRequest = async (req, res) => {
  try {
    const { roomNumber, issueDescription } = req.body;
    const room = await Room.findOne({ roomNumber });
    
    if (!room) return res.status(404).json({ message: 'Cannot find room metrics' });

    const maintenance = await MaintenanceRequest.create({
      room: room._id,
      reportedBy: req.user._id,
      issueDescription: issueDescription,
      status: 'Reported'
    });
    
    res.status(201).json(maintenance);
  } catch (error) {
    res.status(500).json({ message: 'Error mapping structural repair', error: error.message });
  }
};

// @desc    Get all maintenance requests
// @route   GET /api/maintenance
// @access  Private (Admin/Maintenance/Reception)
export const getMaintenanceRequests = async (req, res) => {
  try {
    const requests = await MaintenanceRequest.find({}).populate('room', 'roomNumber').populate('reportedBy', 'name role');
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: 'Server Fault pulling operations', error: err.message });
  }
};

// @desc    Update Maintenance Request Status
// @route   PUT /api/maintenance/:id/status
// @access  Private (Maintenance/Admin)
export const updateMaintenanceStatus = async (req, res) => {
  try {
    const request = await MaintenanceRequest.findById(req.params.id);
    if(!request) {
      return res.status(404).json({ message: 'Maintenance record detached.' });
    }
    
    request.status = req.body.status;
    await request.save();
    
    res.json(request);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
