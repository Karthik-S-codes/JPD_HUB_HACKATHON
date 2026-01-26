/**
 * Check Users and Slugs
 * 
 * This script lists all users and their hub slugs
 * 
 * Run: node backend/utils/checkUsers.js
 */

require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const User = require('../models/User');

async function checkUsers() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    // Get all users
    const users = await User.find({}).select('name email hubSlug hubTitle hubDescription createdAt');
    
    console.log(`📊 Total Users in Database: ${users.length}\n`);
    console.log('='.repeat(80));

    if (users.length === 0) {
      console.log('\n⚠️  No users found in database!');
    } else {
      users.forEach((user, index) => {
        console.log(`\n${index + 1}. User: ${user.name}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Hub Slug: ${user.hubSlug || '❌ NOT SET'}`);
        console.log(`   Hub Title: ${user.hubTitle || 'Not set'}`);
        console.log(`   Hub Description: ${user.hubDescription || 'Not set'}`);
        console.log(`   Created: ${user.createdAt.toISOString()}`);
        console.log(`   Public URL: ${user.hubSlug ? `https://smart-links-hubs.vercel.app/hub/${user.hubSlug}` : '⚠️  No slug - cannot access via URL'}`);
      });
    }

    console.log('\n' + '='.repeat(80));

    // Check for users without slugs
    const usersWithoutSlugs = users.filter(u => !u.hubSlug);
    if (usersWithoutSlugs.length > 0) {
      console.log(`\n⚠️  WARNING: ${usersWithoutSlugs.length} user(s) don't have hub slugs!`);
      console.log(`   These users cannot be accessed via /hub/:slug URLs.`);
      console.log(`   Run the migration script to fix this: node backend/utils/migrateUserSlugs.js`);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

checkUsers();
