require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Business = require('../models/Business');

async function migrateOnboarding() {
  try {
    console.log('🚀 Starting onboarding migration...');

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ame');

    console.log('✅ Connected to MongoDB');

    // Update all existing users
    const usersUpdated = await User.updateMany(
      { onboardingCompleted: { $exists: false } },
      { 
        $set: {
          onboardingCompleted: true,  // Assume existing users completed onboarding
          onboardingStep: 'completed'
        }
      }
    );
    console.log(`✅ Updated ${usersUpdated.modifiedCount} users with onboarding status`);

    // Update all existing businesses
    const businessesUpdated = await Business.updateMany(
      { locationVerified: { $exists: false } },
      { 
        $set: {
          locationVerified: false
        }
      }
    );
    console.log(`✅ Updated ${businessesUpdated.modifiedCount} businesses with location verification status`);

    console.log('✅ Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration error:', error);
    process.exit(1);
  }
}

// Run migration
migrateOnboarding();