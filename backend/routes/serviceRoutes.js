import express from 'express';
import { createServiceRequest, getServiceRequests, updateServiceStatus } from '../controllers/serviceController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createServiceRequest);
router.get('/', protect, getServiceRequests);
router.put('/:id/status', protect, updateServiceStatus);

export default router;
