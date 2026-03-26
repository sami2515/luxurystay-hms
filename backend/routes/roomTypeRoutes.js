import express from 'express';
import { getRoomTypes, createRoomType, updateRoomType, deleteRoomType } from '../controllers/roomTypeController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(getRoomTypes).post(protect, admin, createRoomType);
router.route('/:id').put(protect, admin, updateRoomType).delete(protect, admin, deleteRoomType);

export default router;
