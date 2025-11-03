const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { createCustomer, getCustomers, getCustomer, updateCustomer, deleteCustomer } = require('../controllers/customerController');

router.route('/').post(protect, createCustomer).get(protect, getCustomers);
router.route('/:id').get(protect, getCustomer).put(protect, updateCustomer).delete(protect, deleteCustomer);

module.exports = router;
