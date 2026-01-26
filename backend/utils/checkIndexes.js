/**
 * Check MongoDB Indexes
 * 
 * This script checks all indexes on the Link and Analytics collections
 * to identify any TTL (Time To Live) indexes that might be causing
 * documents to expire automatically.
 * 
 * Run: node backend/utils/checkIndexes.js
 */

require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mongoose = require('mongoose');

async function checkIndexes() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    const db = mongoose.connection.db;

    // Check Link collection indexes
    console.log('📋 Link Collection Indexes:');
    console.log('=' .repeat(50));
    const linkIndexes = await db.collection('links').indexes();
    linkIndexes.forEach((index, i) => {
      console.log(`\n${i + 1}. Index Name: ${index.name}`);
      console.log(`   Keys:`, JSON.stringify(index.key, null, 2));
      if (index.expireAfterSeconds !== undefined) {
        console.log(`   ⚠️  TTL Index: Documents expire after ${index.expireAfterSeconds} seconds (${index.expireAfterSeconds / 86400} days)`);
      }
    });

    // Check Analytics collection indexes
    console.log('\n\n📊 Analytics Collection Indexes:');
    console.log('='.repeat(50));
    const analyticsIndexes = await db.collection('analytics').indexes();
    analyticsIndexes.forEach((index, i) => {
      console.log(`\n${i + 1}. Index Name: ${index.name}`);
      console.log(`   Keys:`, JSON.stringify(index.key, null, 2));
      if (index.expireAfterSeconds !== undefined) {
        console.log(`   ⚠️  TTL Index: Documents expire after ${index.expireAfterSeconds} seconds (${index.expireAfterSeconds / 86400} days)`);
      }
    });

    console.log('\n' + '='.repeat(50));
    console.log('✅ Index check complete\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Disconnected from MongoDB');
  }
}

checkIndexes();
