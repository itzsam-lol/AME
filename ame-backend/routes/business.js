const express = require('express');
const router = express.Router();
const Business = require('../models/Business');
const User = require('../models/User');
const auth = require('../middleware/auth');

// POST /api/business - Create business profile
router.post('/', auth, async (req, res) => {
  try {
    const { businessName, businessType, gstin, city, state, locationVerified } = req.body;

    // Validation
    if (!businessName || !businessType || !city || !state) {
      return res.status(400).json({
        success: false,
        message: 'Business name, type, city, and state are required'
      });
    }

    // Check if business already exists for this user
    const existingBusiness = await Business.findOne({ userId: req.user.userId });
    if (existingBusiness) {
      return res.status(400).json({
        success: false,
        message: 'Business profile already exists. Contact support to make changes.'
      });
    }

    // Create business
    const business = new Business({
      userId: req.user.userId,
      businessName,
      businessType,
      gstin: gstin || null,
      city,
      state,
      locationVerified: locationVerified || false
    });

    await business.save();

    // Update user's onboarding status
    await User.findByIdAndUpdate(req.user.userId, {
      onboardingCompleted: true,
      onboardingStep: 'completed'
    });

    res.status(201).json({
      success: true,
      message: 'Business profile created successfully',
      business: {
        id: business._id,
        businessName: business.businessName,
        businessType: business.businessType,
        gstin: business.gstin,
        city: business.city,
        state: business.state,
        locationVerified: business.locationVerified,
        createdAt: business.createdAt
      }
    });
  } catch (error) {
    console.error('Business creation error:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages[0] || 'Validation error'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while creating business profile'
    });
  }
});

// GET /api/stats - Dashboard statistics
router.get('/stats', auth, async (req, res) => {
  try {
    const userId = req.user.userId;

    // Get counts from database
    const Invoice = require('../models/Invoice');
    const Customer = require('../models/Customer');
    const Business = require('../models/Business');

    const [
      totalInvoices,
      paidInvoices,
      pendingInvoices,
      totalCustomers,
      business
    ] = await Promise.all([
      Invoice.countDocuments({ userId }),
      Invoice.countDocuments({ userId, status: 'paid' }),
      Invoice.countDocuments({ userId, status: 'pending' }),
      Customer.countDocuments({ userId }),
      Business.findOne({ userId })
    ]);

    // Calculate total revenue
    const revenueData = await Invoice.aggregate([
      { $match: { userId: mongoose.Types.ObjectId(userId), status: 'paid' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    const totalRevenue = revenueData?.total || 0;

    res.json({
      success: true,
      stats: {
        totalInvoices,
        paidInvoices,
        pendingInvoices,
        totalCustomers,
        totalRevenue,
        businessName: business?.businessName || 'Your Business'
      }
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics',
      stats: {
        totalInvoices: 0,
        paidInvoices: 0,
        pendingInvoices: 0,
        totalCustomers: 0,
        totalRevenue: 0,
        businessName: 'Your Business'
      }
    });
  }
});

// GET /api/business - Get business profile
router.get('/', auth, async (req, res) => {
  try {
    const business = await Business.findOne({ userId: req.user.userId });

    if (!business) {
      return res.status(404).json({
        success: false,
        message: 'Business profile not found'
      });
    }

    res.json({
      success: true,
      business: {
        id: business._id,
        businessName: business.businessName,
        businessType: business.businessType,
        gstin: business.gstin,
        city: business.city,
        state: business.state,
        locationVerified: business.locationVerified,
        createdAt: business.createdAt,
        updatedAt: business.updatedAt
      }
    });
  } catch (error) {
    console.error('Business fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching business profile'
    });
  }
});

// PUT /api/business - Prevent updates (read-only after creation)
router.put('/', auth, async (req, res) => {
  res.status(403).json({
    success: false,
    message: 'Business profile cannot be edited after creation. Please contact support for changes.'
  });
});

// PATCH /api/business - Prevent updates (read-only after creation)
router.patch('/', auth, async (req, res) => {
  res.status(403).json({
    success: false,
    message: 'Business profile cannot be edited after creation. Please contact support for changes.'
  });
});

// DELETE /api/business - Prevent deletion
router.delete('/', auth, async (req, res) => {
  res.status(403).json({
    success: false,
    message: 'Business profile cannot be deleted. Please contact support.'
  });
});

module.exports = router;
