const Invoice = require('../models/Invoice');
const Customer = require('../models/Customer');
const Business = require('../models/Business');

const generateInvoiceNumber = async (businessId) => {
  const count = await Invoice.countDocuments({ businessId });
  const year = new Date().getFullYear().toString().slice(-2);
  return `INV-${year}-${String(count + 1).padStart(5, '0')}`;
};

const getBusinessId = async (userId) => {
  const business = await Business.findOne({ owner: userId });
  return business ? business._id : null;
};

exports.createInvoice = async (req, res) => {
  try {
    const businessId = await getBusinessId(req.user._id);
    if (!businessId) {
      return res.status(404).json({ 
        success: false, 
        message: 'Business not found. Please create a business profile first.' 
      });
    }
    
    const { customerId, items, subtotal, gstAmount, totalAmount, dueDate, status, notes } = req.body;

    const customer = await Customer.findOne({ _id: customerId, businessId });
    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    const invoiceNumber = await generateInvoiceNumber(businessId);
    
    const invoice = await Invoice.create({
      businessId,
      invoiceNumber,
      customerId,
      items,
      subtotal,
      gstAmount,
      totalAmount,
      dueDate,
      status: status || 'draft',
      notes
    });

    if (status === 'sent' || status === 'overdue') {
      await Customer.findByIdAndUpdate(customerId, {
        $inc: { outstandingBalance: totalAmount }
      });
    }

    res.status(201).json({ success: true, invoice });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getInvoices = async (req, res) => {
  try {
    const businessId = await getBusinessId(req.user._id);
    
    // Return empty array if no business
    if (!businessId) {
      return res.status(200).json({ 
        success: true, 
        count: 0, 
        invoices: [] 
      });
    }
    
    const { status, customerId, fromDate, toDate } = req.query;
    const filter = { businessId };
    
    if (status) filter.status = status;
    if (customerId) filter.customerId = customerId;
    if (fromDate || toDate) {
      filter.createdAt = {};
      if (fromDate) filter.createdAt.$gte = new Date(fromDate);
      if (toDate) filter.createdAt.$lte = new Date(toDate);
    }

    const invoices = await Invoice.find(filter)
      .populate('customerId', 'customerName phoneNumber email')
      .sort({ createdAt: -1 });
    
    res.status(200).json({ success: true, count: invoices.length, invoices });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getInvoice = async (req, res) => {
  try {
    const businessId = await getBusinessId(req.user._id);
    if (!businessId) {
      return res.status(404).json({ success: false, message: 'Business not found' });
    }
    
    const invoice = await Invoice.findOne({ _id: req.params.id, businessId })
      .populate('customerId', 'customerName email phoneNumber address gstin');
    
    if (!invoice) {
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }
    
    res.status(200).json({ success: true, invoice });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateInvoice = async (req, res) => {
  try {
    const businessId = await getBusinessId(req.user._id);
    if (!businessId) {
      return res.status(404).json({ success: false, message: 'Business not found' });
    }
    
    const oldInvoice = await Invoice.findOne({ _id: req.params.id, businessId });
    if (!oldInvoice) {
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }

    const invoice = await Invoice.findOneAndUpdate(
      { _id: req.params.id, businessId },
      req.body,
      { new: true, runValidators: true }
    );

    if (req.body.status && req.body.status !== oldInvoice.status) {
      if (req.body.status === 'paid' && (oldInvoice.status === 'sent' || oldInvoice.status === 'overdue')) {
        await Customer.findByIdAndUpdate(oldInvoice.customerId, {
          $inc: { outstandingBalance: -oldInvoice.totalAmount }
        });
      }
    }
    
    res.status(200).json({ success: true, invoice });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteInvoice = async (req, res) => {
  try {
    const businessId = await getBusinessId(req.user._id);
    if (!businessId) {
      return res.status(404).json({ success: false, message: 'Business not found' });
    }
    
    const invoice = await Invoice.findOneAndDelete({ _id: req.params.id, businessId });
    
    if (!invoice) {
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }

    if (invoice.status === 'sent' || invoice.status === 'overdue') {
      await Customer.findByIdAndUpdate(invoice.customerId, {
        $inc: { outstandingBalance: -invoice.totalAmount }
      });
    }
    
    res.status(200).json({ success: true, message: 'Invoice deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
