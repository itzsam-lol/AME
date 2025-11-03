const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  businessId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Business',
    required: true,
    index: true
  },
  invoiceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Invoice',
    index: true // A payment might not be tied to an invoice (e.g., advance)
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true,
    index: true
  },
  amount: {
    type: Number,
    required: [true, 'Please provide payment amount'],
    min: 0
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'upi', 'card', 'bank_transfer', 'cheque'],
    required: true
  },
  paymentDate: {
    type: Date,
    default: Date.now
  },
  transactionId: String,
  notes: String,
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'completed'
  }
}, { timestamps: true });

paymentSchema.index({ businessId: 1, customerId: 1 });

module.exports = mongoose.model('Payment', paymentSchema);
