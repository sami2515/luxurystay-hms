import express from 'express';
import { createMaintenanceRequest, getMaintenanceRequests, updateMaintenanceStatus } from '../controllers/maintenanceController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createMaintenanceRequest);
router.get('/', protect, getMaintenanceRequests);
router.put('/:id/status', protect, updateMaintenanceStatus);

export default router;
