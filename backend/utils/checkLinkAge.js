/**
 * Check Link Age and Status
 * 
 * This script checks all links in the database to see:
 * 1. How old they are
 * 2. If any are being filtered or hidden
 * 3. If there are any old links that might be "expiring"
 * 
 * Run: node backend/utils/checkLinkAge.js
 */

require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const Link = require('../models/Link');
const User = require('../models/User');

async function checkLinks() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    // Get all links
    const links = await Link.find({}).sort({ createdAt: -1 });
    
    console.log(`📊 Total Links in Database: ${links.length}\n`);
    console.log('='.repeat(80));

    const now = new Date();
    const twoDaysInMs = 2 * 24 * 60 * 60 * 1000; // 2 days in milliseconds

    let linksOlderThan2Days = 0;
    let linksNewerThan2Days = 0;

    for (const link of links) {
      const age = now - link.createdAt;
      const ageInDays = (age / (24 * 60 * 60 * 1000)).toFixed(2);
      const ageInHours = (age / (60 * 60 * 1000)).toFixed(2);
      
      // Get user info
      const user = await User.findById(link.userId).select('name hubSlug');
      
      console.log(`\n🔗 Link: ${link.title}`);
      console.log(`   ID: ${link._id}`);
      console.log(`   User: ${user ? user.name : 'Unknown'} (${user ? user.hubSlug : 'N/A'})`);
      console.log(`   URL: ${link.url}`);
      console.log(`   Created: ${link.createdAt.toISOString()}`);
      console.log(`   Age: ${ageInDays} days (${ageInHours} hours)`);
      console.log(`   Clicks: ${link.clicks}, Visits: ${link.visits}`);
      console.log(`   Rules: ${link.rules.length > 0 ? JSON.stringify(link.rules) : 'None'}`);
      console.log(`   Countries: ${link.allowedCountries.join(', ')}`);
      console.log(`   Devices: ${link.allowedDevices.join(', ')}`);
      
      if (age > twoDaysInMs) {
        console.log(`   ⚠️  OLDER THAN 2 DAYS`);
        linksOlderThan2Days++;
      } else {
        console.log(`   ✅ NEWER THAN 2 DAYS`);
        linksNewerThan2Days++;
      }
    }

    console.log('\n' + '='.repeat(80));
    console.log(`\n📈 Summary:`);
    console.log(`   Total Links: ${links.length}`);
    console.log(`   Links older than 2 days: ${linksOlderThan2Days}`);
    console.log(`   Links newer than 2 days: ${linksNewerThan2Days}`);
    
    if (linksOlderThan2Days > 0 && links.length === linksNewerThan2Days) {
      console.log(`\n   ⚠️  WARNING: All links older than 2 days seem to be missing!`);
      console.log(`   This suggests automatic deletion might be happening.`);
    } else if (linksOlderThan2Days > 0) {
      console.log(`\n   ✅ Links older than 2 days are still present in database.`);
      console.log(`   The issue might be with frontend display or filtering logic.`);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

checkLinks();
