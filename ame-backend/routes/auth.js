const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  try {
    const { fullName, email, phoneNumber, password } = req.body;

    // Validation
    if (!fullName || !email || !phoneNumber || !password) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { phoneNumber }]
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: existingUser.email === email 
          ? 'Email already registered' 
          : 'Phone number already registered'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with onboarding flags
    const user = new User({
      fullName,
      email,
      phoneNumber,
      password: hashedPassword,
      onboardingCompleted: false,
      onboardingStep: 'welcome'
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id }, 
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '30d' }
    );

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        onboardingCompleted: user.onboardingCompleted,
        onboardingStep: user.onboardingStep
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during signup'
    });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '30d' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        onboardingCompleted: user.onboardingCompleted,
        onboardingStep: user.onboardingStep
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
});

// GET /api/auth/onboarding-status
router.get('/onboarding-status', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      onboardingCompleted: user.onboardingCompleted,
      onboardingStep: user.onboardingStep
    });
  } catch (error) {
    console.error('Onboarding status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching onboarding status'
    });
  }
});

// PUT /api/auth/onboarding-step
router.put('/onboarding-step', auth, async (req, res) => {
  try {
    const { step } = req.body;
    
    if (!['welcome', 'auth', 'business', 'completed'].includes(step)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid onboarding step'
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { onboardingStep: step },
      { new: true }
    );

    res.json({
      success: true,
      message: 'Onboarding step updated',
      onboardingStep: user.onboardingStep
    });
  } catch (error) {
    console.error('Update onboarding step error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating onboarding step'
    });
  }
});

// GET /api/auth/me
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        onboardingCompleted: user.onboardingCompleted,
        onboardingStep: user.onboardingStep
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user data'
    });
  }
});

module.exports = router;