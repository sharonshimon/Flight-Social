/* Seed only groups into the database.
   Usage:
     node server/scripts/seed-groups.js       # inserts sample groups
     node server/scripts/seed-groups.js --clear  # clears existing groups then inserts

   Reads MONGO_URI from .env (same as other seed scripts).
*/

const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '..', '.env') });

const Group = require('../models/Group');
const User = require('../models/User');

const MONGO = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/flightsocial';

async function connect() {
  await mongoose.connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true });
}

async function clear() {
  await Group.deleteMany({});
}

async function seed() {
  console.log('Seeding groups...');

  // Example groups with optional member usernames to link
  const samples = [
    { name: 'Backpackers', description: 'Share tips for on-the-road travel', memberUsernames: ['user1', 'user2', 'user3'] },
    { name: 'City Photographers', description: 'Capture the urban spirit', memberUsernames: ['user4', 'user5'] },
    { name: 'Foodie Travelers', description: 'Best foods around the globe', memberUsernames: ['user6', 'user7'] },
  ];

  for (const s of samples) {
    const members = [];
    if (Array.isArray(s.memberUsernames) && s.memberUsernames.length) {
      const found = await User.find({ username: { $in: s.memberUsernames } }).select('_id').lean();
      found.forEach(u => members.push(u._id));
    }
    const g = new Group({ name: s.name, description: s.description, members });
    await g.save();
    console.log('Inserted group', g.name, 'members:', members.length);
  }

  console.log('Groups seed complete.');
}

async function main() {
  try {
    await connect();
    if (process.argv.includes('--clear')) {
      console.log('Clearing existing groups...');
      await clear();
    }
    await seed();
    mongoose.disconnect();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

main();
