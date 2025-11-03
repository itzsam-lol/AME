const Customer = require('../models/Customer');
const Business = require('../models/Business');

const getBusinessId = async (userId) => {
  const business = await Business.findOne({ owner: userId });
  return business ? business._id : null;
};

exports.createCustomer = async (req, res) => {
  try {
    const businessId = await getBusinessId(req.user._id);
    if (!businessId) {
      return res.status(404).json({ 
        success: false, 
        message: 'Business not found. Please create a business profile first.' 
      });
    }

    const customer = await Customer.create({
      businessId,
      ...req.body
    });

    res.status(201).json({ success: true, customer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getCustomers = async (req, res) => {
  try {
    const businessId = await getBusinessId(req.user._id);
    
    // Return empty array if no business
    if (!businessId) {
      return res.status(200).json({ 
        success: true, 
        count: 0, 
        customers: [] 
      });
    }

    const customers = await Customer.find({ businessId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: customers.length, customers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getCustomer = async (req, res) => {
  try {
    const businessId = await getBusinessId(req.user._id);
    if (!businessId) {
      return res.status(404).json({ success: false, message: 'Business not found' });
    }

    const customer = await Customer.findOne({ _id: req.params.id, businessId });
    
    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }
    
    res.status(200).json({ success: true, customer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateCustomer = async (req, res) => {
  try {
    const businessId = await getBusinessId(req.user._id);
    if (!businessId) {
      return res.status(404).json({ success: false, message: 'Business not found' });
    }

    const customer = await Customer.findOneAndUpdate(
      { _id: req.params.id, businessId },
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }
    
    res.status(200).json({ success: true, customer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteCustomer = async (req, res) => {
  try {
    const businessId = await getBusinessId(req.user._id);
    if (!businessId) {
      return res.status(404).json({ success: false, message: 'Business not found' });
    }

    const customer = await Customer.findOneAndDelete({ _id: req.params.id, businessId });
    
    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }
    
    res.status(200).json({ success: true, message: 'Customer deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
