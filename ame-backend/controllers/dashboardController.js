const Invoice = require('../models/Invoice');
const Customer = require('../models/Customer');
const Inventory = require('../models/Inventory');
const Business = require('../models/Business');

const getBusinessId = async (userId) => {
  const business = await Business.findOne({ owner: userId });
  if (!business) return null;
  return business._id;
};

exports.getDashboardStats = async (req, res) => {
  try {
    const businessId = await getBusinessId(req.user._id);

    // If no business exists, return zero stats
    if (!businessId) {
      return res.status(200).json({
        success: true,
        stats: {
          totalRevenue: 0,
          outstandingDues: 0,
          totalCustomers: 0,
          lowStockItems: 0
        }
      });
    }

    const revenueData = await Invoice.aggregate([
      { $match: { businessId, status: 'paid' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    const duesData = await Invoice.aggregate([
      { $match: { businessId, status: { $in: ['sent', 'overdue'] } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    
    const [totalCustomers, lowStockItems] = await Promise.all([
      Customer.countDocuments({ businessId }),
      Inventory.countDocuments({ 
        businessId, 
        $expr: { $lte: ['$quantity', '$lowStockAlert'] } 
      })
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalRevenue: revenueData[0]?.total || 0,
        outstandingDues: duesData[0]?.total || 0,
        totalCustomers,
        lowStockItems,
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

exports.getRecentActivity = async (req, res) => {
  try {
    const businessId = await getBusinessId(req.user._id);
    
    if (!businessId) {
      return res.status(200).json({
        success: true,
        recentInvoices: [],
        recentPayments: []
      });
    }

    const recentInvoices = await Invoice.find({ businessId })
      .populate('customerId', 'customerName')
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      recentInvoices
    });
  } catch (error) {
    console.error('Recent activity error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};
