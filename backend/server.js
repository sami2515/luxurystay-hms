import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';

import authRoutes from './routes/authRoutes.js';
import roomRoutes from './routes/roomRoutes.js';
import roomTypeRoutes from './routes/roomTypeRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import maintenanceRoutes from './routes/maintenanceRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import { createSystemNotification } from './controllers/notificationController.js';

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
// Note: no need for useNewUrlParser and useUnifiedTopology in Mongoose 6+
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/room-types', roomTypeRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/notifications', notificationRoutes);

// Root Endpoint
app.get('/', (req, res) => {
  res.send('Welcome to LuxuryStay API v1');
});

// Web Sockets Routing
io.on('connection', (socket) => {
  console.log('Active Client Hooked:', socket.id);
  
  socket.on('updateRoomStatus', async (data) => {
    socket.broadcast.emit('roomStatusUpdated', data);
    await createSystemNotification('Housekeeping', `Room ${data.roomNumber} operational status changed to ${data.status}`);
    io.emit('newNotification'); // Trigger generic fetch across all clients
  });
  
  socket.on('disconnect', () => {
    console.log('Active Client Dropped:', socket.id);
  });
});

// Start the Server Wrapper
server.listen(PORT, () => {
  console.log(`Secured WebSocket Server running on port ${PORT}`);
});
