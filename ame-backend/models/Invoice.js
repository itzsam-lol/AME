const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true, index: true },
  invoiceNumber: { type: String, required: true, unique: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true, index: true },
  items: [{
    productName: String,
    quantity: Number,
    unitPrice: Number,
    gst: Number,
    total: Number
  }],
  subtotal: { type: Number, required: true },
  gstAmount: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ['draft', 'sent', 'paid', 'overdue'], default: 'draft' },
  dueDate: Date,
  notes: String
}, { timestamps: true });

module.exports = mongoose.model('Invoice', invoiceSchema);
