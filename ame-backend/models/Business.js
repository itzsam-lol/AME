const mongoose = require('mongoose');

const businessSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true  // One business per user
  },
  businessName: {
    type: String,
    required: [true, 'Business name is required'],
    trim: true
  },
  businessType: {
    type: String,
    required: [true, 'Business type is required'],
    enum: [
      'Retail Store',
      'Wholesale',
      'Manufacturing',
      'Services',
      'Restaurant/Cafe',
      'Food & Beverage',
      'Medical/Pharmacy',
      'Clinic/Hospital',
      'Electronics',
      'Clothing/Fashion',
      'Grocery Store',
      'Supermarket',
      'Hardware Store',
      'Automobile/Garage',
      'Beauty/Salon',
      'Gym/Fitness',
      'Education/Tuition',
      'Real Estate',
      'Construction',
      'Consultancy',
      'IT Services',
      'Photography',
      'Event Management',
      'Travel Agency',
      'Printing/Stationery',
      'Jewelry',
      'Furniture',
      'Home Decor',
      'Books/Stationery',
      'Pet Shop',
      'Florist',
      'Bakery',
      'Other'
    ]
  },
  gstin: {
    type: String,
    default: null,
    uppercase: true,
    trim: true,
    validate: {
      validator: function(v) {
        if (!v) return true;  // Optional field
        return /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(v);
      },
      message: 'Please enter a valid GST number'
    }
  },
  city: {
    type: String,
    required: [true, 'City is required'],
    trim: true
  },
  state: {
    type: String,
    required: [true, 'State is required'],
    enum: [
      'Andhra Pradesh',
      'Arunachal Pradesh',
      'Assam',
      'Bihar',
      'Chhattisgarh',
      'Goa',
      'Gujarat',
      'Haryana',
      'Himachal Pradesh',
      'Jharkhand',
      'Karnataka',
      'Kerala',
      'Madhya Pradesh',
      'Maharashtra',
      'Manipur',
      'Meghalaya',
      'Mizoram',
      'Nagaland',
      'Odisha',
      'Punjab',
      'Rajasthan',
      'Sikkim',
      'Tamil Nadu',
      'Telangana',
      'Tripura',
      'Uttar Pradesh',
      'Uttarakhand',
      'West Bengal',
      'Delhi',
      'Puducherry',
      'Jammu and Kashmir',
      'Ladakh'
    ]
  },
  // NEW FIELDS
  locationVerified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true  // Automatically adds createdAt and updatedAt
});

// Index for faster queries
businessSchema.index({ userId: 1 });

module.exports = mongoose.model('Business', businessSchema);