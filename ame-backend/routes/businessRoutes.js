const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { createBusiness, getBusiness, updateBusiness } = require('../controllers/businessController');

router.route('/').post(protect, createBusiness).get(protect, getBusiness).put(protect, updateBusiness);

module.exports = router;
