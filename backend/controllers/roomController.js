import Room from '../models/Room.js';

// @desc    Fetch all rooms
// @route   GET /api/rooms
// @access  Public
export const getRooms = async (req, res) => {
  try {
    // Populate the room type so we can show 'Standard', 'Suite', amenities etc.
    const rooms = await Room.find({}).populate('type');
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: 'Server Errror fetching rooms', error: error.message });
  }
};

// @desc    Fetch single room
// @route   GET /api/rooms/:id
// @access  Public
export const getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id).populate('type');
    if (room) {
      res.json(room);
    } else {
      res.status(404).json({ message: 'Room not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error fetching room detail', error: error.message });
  }
};
// @desc    Update Room Status
// @route   PUT /api/rooms/:id/status
// @access  Private (Admin/Housekeeping/Receptionist)
export const updateRoomStatus = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    room.status = req.body.status;
    await room.save();
    res.json(room);
  } catch (error) {
    res.status(500).json({ message: 'Server Fault updating room status', error: error.message });
  }
};

// @desc    Create a new Room physically
// @route   POST /api/rooms
// @access  Private/Admin
export const createRoom = async (req, res) => {
  try {
    const { roomNumber, type, status } = req.body;
    
    const roomExists = await Room.findOne({ roomNumber });
    if (roomExists) {
      return res.status(400).json({ message: `Room Number ${roomNumber} is already mapped in topology.` });
    }

    const room = await Room.create({
      roomNumber,
      type,
      status: status || 'Available'
    });

    res.status(201).json(room);
  } catch (error) {
    res.status(500).json({ message: 'Failed writing Room geometry', error: error.message });
  }
};

// @desc    Scrap / Delete Room entirely
// @route   DELETE /api/rooms/:id
// @access  Private/Admin
export const deleteRoom = async (req, res) => {
  try {
    const room = await Room.findByIdAndDelete(req.params.id);
    if (room) {
      res.json({ message: 'Room entity wiped successfully' });
    } else {
      res.status(404).json({ message: 'Target room object not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed stripping Room layout node', error: error.message });
  }
};

// @desc    Update a specific Room
// @route   PUT /api/rooms/:id
// @access  Private/Admin
export const updateRoom = async (req, res) => {
  try {
    const { roomNumber, type, status } = req.body;
    
    const room = await Room.findById(req.params.id);

    if (room) {
      room.roomNumber = roomNumber || room.roomNumber;
      room.type = type || room.type;
      room.status = status || room.status;

      const updatedRoom = await room.save();
      res.json(updatedRoom);
    } else {
      res.status(404).json({ message: 'Room not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed updating Room layout', error: error.message });
  }
};
