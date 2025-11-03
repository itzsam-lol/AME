const Business = require('../models/Business');

// Create a business profile for the logged-in user
exports.createBusiness = async (req, res) => {
  try {
    const existingBusiness = await Business.findOne({ owner: req.user._id });
    if (existingBusiness) {
      return res.status(400).json({ success: false, message: 'Business already exists for this user' });
    }
    const business = await Business.create({ owner: req.user._id, ...req.body });
    res.status(201).json({ success: true, business });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get the business profile for the logged-in user
exports.getBusiness = async (req, res) => {
  try {
    const business = await Business.findOne({ owner: req.user._id });
    if (!business) {
      return res.status(404).json({ success: false, message: 'Business not found' });
    }
    res.status(200).json({ success: true, business });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update the business profile
exports.updateBusiness = async (req, res) => {
  try {
    const business = await Business.findOneAndUpdate({ owner: req.user._id }, req.body, { new: true, runValidators: true });
    if (!business) {
      return res.status(404).json({ success: false, message: 'Business not found' });
    }
    res.status(200).json({ success: true, business });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
