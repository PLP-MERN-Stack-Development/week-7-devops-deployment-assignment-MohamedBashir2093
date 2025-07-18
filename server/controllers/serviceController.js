const Service = require('../models/Service');
const User = require('../models/User');

// Create a new service (provider only)
exports.createService = async (req, res) => {
  try {
    if (req.user.role !== 'provider') {
      return res.status(403).json({ message: 'Only providers can create services.' });
    }
    const { category, description, contactInfo } = req.body;
    const service = new Service({
      provider: req.user.userId,
      category,
      description,
      contactInfo,
    });
    await service.save();
    res.status(201).json(service);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all services (with optional category filter)
exports.getServices = async (req, res) => {
  try {
    const { category, search } = req.query;
    let filter = {};
    if (category) filter.category = category;
    if (search) filter.description = { $regex: search, $options: 'i' };
    const services = await Service.find(filter).populate('provider', 'name email');
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get a single service by ID
exports.getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id).populate('provider', 'name email');
    if (!service) return res.status(404).json({ message: 'Service not found.' });
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update a service (provider only, own service)
exports.updateService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: 'Service not found.' });
    if (service.provider.toString() !== req.user.userId.toString()) {
      return res.status(403).json({ message: 'Not authorized.' });
    }
    const { category, description, contactInfo } = req.body;
    if (category) service.category = category;
    if (description) service.description = description;
    if (contactInfo) service.contactInfo = contactInfo;
    await service.save();
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete a service (provider only, own service)
exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: 'Service not found.' });
    if (service.provider.toString() !== req.user.userId.toString()) {
      return res.status(403).json({ message: 'Not authorized.' });
    }
    await service.remove();
    res.json({ message: 'Service deleted.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}; 