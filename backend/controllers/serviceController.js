import ServiceRequest from '../models/ServiceRequest.js';
import Booking from '../models/Booking.js';

// @desc    Create a service request
// @route   POST /api/services
// @access  Private (Guest)
export const createServiceRequest = async (req, res) => {
  try {
    const activeBooking = await Booking.findOne({
      guest: req.user._id,
      status: { $in: ['Checked-in', 'Confirmed', 'Pending'] }
    });
    
    if (!activeBooking) {
      return res.status(400).json({ message: 'No active booking found for this guest. Concierge cannot dispatch.' });
    }

    const service = await ServiceRequest.create({
      booking: activeBooking._id,
      serviceType: req.body.serviceType,
      details: req.body.details,
      status: 'Pending'
    });
    
    res.status(201).json(service);
  } catch (error) {
    res.status(500).json({ message: 'Server Fault sending Service Request', error: error.message });
  }
};

// @desc    Get all service requests
// @route   GET /api/services
// @access  Private (Admin/Housekeeping/Reception)
export const getServiceRequests = async (req, res) => {
  try {
    const requests = await ServiceRequest.find({}).populate({
      path: 'booking',
      select: 'room guest',
      populate: [
        { path: 'room', select: 'roomNumber' }, 
        { path: 'guest', select: 'name' }
      ]
    });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: 'Server Fault fetching Service Requests', error: err.message });
  }
};

// @desc    Update Service Request Status
// @route   PUT /api/services/:id/status
// @access  Private
export const updateServiceStatus = async (req, res) => {
  try {
    const service = await ServiceRequest.findById(req.params.id);
    if(!service) {
      return res.status(404).json({ message: 'Service request not mapped.' });
    }
    
    service.status = req.body.status;
    await service.save();
    
    // Optionally trigger socket emission here if needed
    // io.emit('serviceStatusUpdated', service)
    
    res.json(service);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
