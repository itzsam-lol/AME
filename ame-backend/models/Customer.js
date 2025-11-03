const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true, index: true },
  customerName: { type: String, required: true },
  email: String,
  phoneNumber: { type: String, required: true },
  address: String,
  gstin: String,
  outstandingBalance: { type: Number, default: 0 }
}, { timestamps: true });

customerSchema.index({ businessId: 1, customerName: 1 });

module.exports = mongoose.model('Customer', customerSchema);
