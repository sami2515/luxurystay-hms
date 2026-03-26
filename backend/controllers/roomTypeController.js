import RoomType from '../models/RoomType.js';

// @desc    Get all room types
// @route   GET /api/room-types
// @access  Public
export const getRoomTypes = async (req, res) => {
  try {
    const types = await RoomType.find({});
    res.json(types);
  } catch (error) {
    res.status(500).json({ message: 'Server error parsing Room Types', error: error.message });
  }
};

// @desc    Create a room type
// @route   POST /api/room-types
// @access  Private/Admin
export const createRoomType = async (req, res) => {
  try {
    const { name, description, basePrice, capacity, amenities, images } = req.body;
    
    const roomTypeExists = await RoomType.findOne({ name });
    if (roomTypeExists) {
      return res.status(400).json({ message: 'Room Category already exists' });
    }

    const roomType = await RoomType.create({
      name,
      description,
      basePrice,
      capacity,
      amenities: amenities || [],
      images: images || []
    });

    if (roomType) {
      res.status(201).json(roomType);
    } else {
      res.status(400).json({ message: 'Invalid category data payload' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server fault mapping Category', error: error.message });
  }
};

// @desc    Update a room type
// @route   PUT /api/room-types/:id
// @access  Private/Admin
export const updateRoomType = async (req, res) => {
  try {
    const { name, description, basePrice, capacity, amenities, images } = req.body;
    
    const roomType = await RoomType.findById(req.params.id);

    if (roomType) {
      roomType.name = name || roomType.name;
      roomType.description = description || roomType.description;
      roomType.basePrice = basePrice || roomType.basePrice;
      roomType.capacity = capacity || roomType.capacity;
      roomType.amenities = amenities || roomType.amenities;
      roomType.images = images || roomType.images;

      const updatedRoomType = await roomType.save();
      res.json(updatedRoomType);
    } else {
      res.status(404).json({ message: 'Room Category not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server fault updating Category', error: error.message });
  }
};

// @desc    Delete a room type
// @route   DELETE /api/room-types/:id
// @access  Private/Admin
export const deleteRoomType = async (req, res) => {
  try {
    const roomType = await RoomType.findByIdAndDelete(req.params.id);
    if (roomType) {
      res.json({ message: 'Room Category removed completely' });
    } else {
      res.status(404).json({ message: 'Room Category not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server fault deleting Category', error: error.message });
  }
};
