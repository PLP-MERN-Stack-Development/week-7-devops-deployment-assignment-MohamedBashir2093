const Request = require('../models/Request');
const Service = require('../models/Service');

// Resident: Create a new service request
exports.createRequest = async (req, res) => {
  try {
    if (req.user.role !== 'resident') {
      return res.status(403).json({ message: 'Only residents can request services.' });
    }
    const { serviceId } = req.body;
    const service = await Service.findById(serviceId);
    if (!service) return res.status(404).json({ message: 'Service not found.' });
    const request = new Request({
      resident: req.user.userId,
      provider: service.provider,
      service: service._id,
      status: 'pending',
    });
    await request.save();
    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Resident: View own requests
exports.getResidentRequests = async (req, res) => {
  try {
    const requests = await Request.find({ resident: req.user.userId })
      .populate('service')
      .populate('provider', 'name email');
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Provider: View incoming requests
exports.getProviderRequests = async (req, res) => {
  try {
    const requests = await Request.find({ provider: req.user.userId })
      .populate('service')
      .populate('resident', 'name email');
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Provider: Accept or reject a request
exports.updateRequestStatus = async (req, res) => {
  try {
    const { status } = req.body; // accepted, rejected, in_progress, completed
    const request = await Request.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found.' });
    if (request.provider.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized.' });
    }
    if (!['accepted', 'rejected', 'in_progress', 'completed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status.' });
    }
    request.status = status;
    await request.save();
    res.json(request);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}; 