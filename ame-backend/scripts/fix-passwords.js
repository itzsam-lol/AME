require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

async function fixPasswords() {
  try {
    console.log('🚀 Starting password fix...');
    
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ame');
    console.log('✅ Connected to MongoDB');

    const allUsers = await User.find({});
    console.log(`📊 Found ${allUsers.length} total users`);

    const defaultPassword = 'password123';
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    let fixedCount = 0;

    for (const user of allUsers) {
      console.log(`\n👤 Checking: ${user.email}`);
      
      if (!user.password || user.password === '' || user.password === null) {
        console.log('   🔧 Fixing password...');
        user.password = hashedPassword;
        await user.save();
        console.log('   ✅ Fixed!');
        fixedCount++;
      } else {
        console.log('   ⏭️  Already has password');
      }
    }

    console.log(`\n✅ Fixed ${fixedCount} users`);
    if (fixedCount > 0) {
      console.log(`⚠️  Default password: ${defaultPassword}`);
    }
    
    await mongoose.connection.close();
    process.exit(0);

  } catch (error) {
    console.error('❌ ERROR:', error);
    process.exit(1);
  }
}

fixPasswords();
