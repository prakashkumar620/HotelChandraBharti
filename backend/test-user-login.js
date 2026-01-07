// Test script to verify normal user login
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = mongoose.model('User', new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  resetOtp: Number,
  resetOtpExpires: Date,
  isBlocked: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true }));

async function testUserLogin() {
  try {
    console.log('🔍 Testing Normal User Login...\n');
    
    // Connect to MongoDB
    console.log('📡 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000
    });
    console.log('✓ Connected to MongoDB\n');

    // Find existing users
    console.log('🔎 Checking existing users...');
    const users = await User.find();
    console.log(`Found ${users.length} users:`);
    users.forEach(u => {
      console.log(`  - ${u.email} (${u.name}, blocked: ${u.isBlocked})`);
    });
    console.log('');

    // Try to find testuser@gmail.com
    console.log('🔎 Looking for testuser@gmail.com...');
    const testUser = await User.findOne({ email: 'testuser@gmail.com' });
    
    if (!testUser) {
      console.log('✗ Test user NOT found in database\n');
      console.log('⚠️  PROBLEM: No test users exist!');
      console.log('💡 Solution: Visit http://localhost:5000/create-test-user\n');
    } else {
      console.log('✓ Test user found!\n');
      console.log('User Details:');
      console.log(`  ID: ${testUser._id}`);
      console.log(`  Name: ${testUser.name}`);
      console.log(`  Email: ${testUser.email}`);
      console.log(`  Phone: ${testUser.phone}`);
      console.log(`  Blocked: ${testUser.isBlocked}\n`);

      // Test password verification
      console.log('🔐 Testing password verification...');
      const isPasswordValid = await bcrypt.compare('testuser123', testUser.password);
      console.log(`Password match: ${isPasswordValid}\n`);

      if (isPasswordValid) {
        console.log('✓✓✓ USER SHOULD BE ABLE TO LOGIN ✓✓✓');
      } else {
        console.log('✗✗✗ PROBLEM: Password doesn\'t match ✗✗✗');
        console.log('Password in DB:', testUser.password.substring(0, 20) + '...');
      }
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

testUserLogin();
