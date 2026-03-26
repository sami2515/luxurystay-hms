import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import RoomType from './models/RoomType.js';
import Room from './models/Room.js';

dotenv.config();

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Hooked correctly natively ready for Core Seeding...');

    // 1. Staff Members
    const adminExists = await User.findOne({ email: 'admin@luxurystay.com' });
    if (!adminExists) {
      await User.create({ name: 'Master Admin', email: 'admin@luxurystay.com', password: 'password123', role: 'admin' });
      console.log('Seed: Admin user firmly deployed securely [admin@luxurystay.com]');
    }

    const recExists = await User.findOne({ email: 'reception@luxurystay.com' });
    if (!recExists) {
      await User.create({ name: 'Front Desk Reception', email: 'reception@luxurystay.com', password: 'password123', role: 'receptionist' });
      console.log('Seed: Receptionist operator deployed securely.');
    }

    // 2. Clear Existing Room Data safely
    await Room.deleteMany();
    await RoomType.deleteMany();
    console.log('Seed: Legacy operational matrices wiped out.');

    // 3. Create Room Types
    const standardType = await RoomType.create({ name: 'Standard', description: 'Cozy room with essential luxuries suited for quick business transitions.', amenities: ['Free Wi-Fi', 'TV', 'Coffee Maker'] });
    const deluxeType = await RoomType.create({ name: 'Deluxe', description: 'Upgraded spacious suite providing majestic architectural views and dual bedding elements.', amenities: ['Free Wi-Fi', 'Smart TV', 'Balcony', 'Minibar'] });
    const suiteType = await RoomType.create({ name: 'Suite', description: 'Ultimate opulence covering full personal kitchens, living spaces, and 24/7 dedicated concierge handlers.', amenities: ['Free Wi-Fi', 'OLED TV', 'Private Kitchen', 'Jacuzzi', 'Dedicated Butler'] });

    console.log('Seed: RoomType objects generated securely.');

    // 4. Create Actual Rooms mapped to Types
    const roomsToSeed = [
      { roomNumber: '101', floor: 1, type: standardType._id, status: 'Available', price: 150 },
      { roomNumber: '102', floor: 1, type: standardType._id, status: 'Available', price: 150 },
      { roomNumber: '201', floor: 2, type: deluxeType._id, status: 'Available', price: 300 },
      { roomNumber: '202', floor: 2, type: deluxeType._id, status: 'Occupied', price: 300 },
      { roomNumber: '301', floor: 3, type: suiteType._id, status: 'Available', price: 600 },
      { roomNumber: '302', floor: 3, type: suiteType._id, status: 'Cleaning', price: 600 }
    ];

    await Room.insertMany(roomsToSeed);
    console.log('Seed: Hotel layout successfully loaded with 6 operational nodes.');

    console.log('Data Infrastructure Seeding finished safely. Terminating process...');
    process.exit();
  } catch (error) {
    console.error('Error during seed:', error);
    process.exit(1);
  }
};

seedDB();
