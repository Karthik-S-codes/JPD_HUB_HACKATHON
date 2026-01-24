/**
 * Database Migration Script - Add Hub Slugs to Existing Users
 * 
 * This script generates unique slugs for all existing users who don't have one.
 * Run this ONCE after deploying the slug feature to production.
 * 
 * Usage:
 * 1. Make sure MongoDB is connected
 * 2. Run: node backend/utils/migrateUserSlugs.js
 * 3. Verify all users have slugs
 * 
 * IMPORTANT: Backup your database before running migrations!
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const { generateUniqueSlug } = require('./slugGenerator');

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI || 'your_mongodb_uri_here';

/**
 * Main migration function
 */
async function migrateUserSlugs() {
  try {
    console.log('🚀 Starting user slug migration...\n');

    // Connect to MongoDB
    console.log('📡 Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    // Find users without hubSlug
    const usersWithoutSlug = await User.find({ 
      $or: [
        { hubSlug: { $exists: false } },
        { hubSlug: null },
        { hubSlug: '' }
      ]
    });

    console.log(`📊 Found ${usersWithoutSlug.length} users without slugs\n`);

    if (usersWithoutSlug.length === 0) {
      console.log('✨ All users already have slugs! No migration needed.\n');
      await mongoose.disconnect();
      return;
    }

    // Migrate each user
    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < usersWithoutSlug.length; i++) {
      const user = usersWithoutSlug[i];
      
      try {
        // Generate unique slug from user's name
        const slug = await generateUniqueSlug(user.name, user._id);
        
        // Update user with new slug
        user.hubSlug = slug;
        await user.save();
        
        successCount++;
        console.log(`✅ [${i + 1}/${usersWithoutSlug.length}] ${user.name} → ${slug}`);
      } catch (err) {
        errorCount++;
        console.error(`❌ [${i + 1}/${usersWithoutSlug.length}] Failed for ${user.name}:`, err.message);
      }
    }

    // Summary
    console.log('\n' + '='.repeat(50));
    console.log('📊 Migration Summary');
    console.log('='.repeat(50));
    console.log(`✅ Successfully migrated: ${successCount} users`);
    console.log(`❌ Failed: ${errorCount} users`);
    console.log(`📝 Total processed: ${usersWithoutSlug.length} users`);
    console.log('='.repeat(50) + '\n');

    // Verify all users have slugs
    const remainingUsers = await User.find({
      $or: [
        { hubSlug: { $exists: false } },
        { hubSlug: null },
        { hubSlug: '' }
      ]
    });

    if (remainingUsers.length === 0) {
      console.log('✨ Migration complete! All users now have slugs.\n');
    } else {
      console.log(`⚠️  Warning: ${remainingUsers.length} users still without slugs.\n`);
    }

    // Disconnect
    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB\n');

  } catch (err) {
    console.error('💥 Migration failed:', err);
    process.exit(1);
  }
}

/**
 * Verify migration results
 */
async function verifyMigration() {
  try {
    console.log('🔍 Verifying migration...\n');

    await mongoose.connect(MONGO_URI);

    // Count users with slugs
    const totalUsers = await User.countDocuments();
    const usersWithSlug = await User.countDocuments({ 
      hubSlug: { $exists: true, $ne: null, $ne: '' } 
    });

    console.log(`Total users: ${totalUsers}`);
    console.log(`Users with slugs: ${usersWithSlug}`);
    console.log(`Users without slugs: ${totalUsers - usersWithSlug}\n`);

    if (totalUsers === usersWithSlug) {
      console.log('✅ All users have slugs!\n');
    } else {
      console.log('⚠️  Some users still missing slugs.\n');
    }

    // Show sample of generated slugs
    const sampleUsers = await User.find({ hubSlug: { $exists: true } })
      .select('name email hubSlug')
      .limit(10);

    console.log('📝 Sample slugs:');
    sampleUsers.forEach(user => {
      console.log(`   ${user.name} → ${user.hubSlug}`);
    });
    console.log('');

    await mongoose.disconnect();

  } catch (err) {
    console.error('💥 Verification failed:', err);
    process.exit(1);
  }
}

/**
 * Run migration based on command line argument
 */
const args = process.argv.slice(2);
const command = args[0];

if (command === 'verify') {
  verifyMigration();
} else if (command === 'migrate' || !command) {
  migrateUserSlugs();
} else {
  console.log('Usage:');
  console.log('  node migrateUserSlugs.js migrate  - Run migration');
  console.log('  node migrateUserSlugs.js verify   - Verify results');
  process.exit(1);
}
