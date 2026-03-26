import express from 'express';
import { getRooms, getRoomById, updateRoomStatus, createRoom, deleteRoom, updateRoom } from '../controllers/roomController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getRooms)
  .post(protect, admin, createRoom);
  
router.route('/:id')
  .get(getRoomById)
  .put(protect, admin, updateRoom)
  .delete(protect, admin, deleteRoom);
  
router.put('/:id/status', protect, updateRoomStatus);

export default router;
