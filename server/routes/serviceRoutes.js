const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const { authenticate } = require('../middleware/authMiddleware');

// Public: Get all services, get by id
router.get('/', serviceController.getServices);
router.get('/:id', serviceController.getServiceById);

// Provider only: Create, update, delete
router.post('/', authenticate, serviceController.createService);
router.put('/:id', authenticate, serviceController.updateService);
router.delete('/:id', authenticate, serviceController.deleteService);

module.exports = router; 