const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  businessId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Business',
    required: true,
    index: true
  },
  productName: {
    type: String,
    required: [true, 'Please provide product name']
  },
  productCode: {
    type: String,
    unique: true,
    sparse: true // Allows multiple null values but unique otherwise
  },
  category: {
    type: String,
    default: 'General'
  },
  quantity: {
    type: Number,
    default: 0,
    min: 0
  },
  unit: {
    type: String,
    default: 'pcs',
    enum: ['pcs', 'kg', 'ltr', 'box', 'meter', 'other']
  },
  costPrice: {
    type: Number,
    default: 0
  },
  sellingPrice: {
    type: Number,
    required: [true, 'Please provide selling price']
  },
  gstRate: {
    type: Number,
    default: 18,
    min: 0,
    max: 100
  },
  lowStockAlert: {
    type: Number,
    default: 10
  },
  description: String
}, { timestamps: true });

inventorySchema.index({ businessId: 1, productName: 1 });

module.exports = mongoose.model('Inventory', inventorySchema);
