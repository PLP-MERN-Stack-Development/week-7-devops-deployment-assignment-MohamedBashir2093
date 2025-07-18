const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');
const { authenticate } = require('../middleware/authMiddleware');

// Resident: Create a request
router.post('/', authenticate, requestController.createRequest);
// Resident: View own requests
router.get('/resident', authenticate, requestController.getResidentRequests);
// Provider: View incoming requests
router.get('/provider', authenticate, requestController.getProviderRequests);
// Provider: Update request status (accept/reject/complete)
router.put('/:id/status', authenticate, requestController.updateRequestStatus);

module.exports = router; 