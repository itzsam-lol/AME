const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { createInvoice, getInvoices, getInvoice, updateInvoice, deleteInvoice } = require('../controllers/invoiceController');

router.route('/').post(protect, createInvoice).get(protect, getInvoices);
router.route('/:id').get(protect, getInvoice).put(protect, updateInvoice).delete(protect, deleteInvoice);

module.exports = router;
