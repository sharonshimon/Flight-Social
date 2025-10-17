/* Minimal seeder for Flight-Social
   Usage (after configuring .env and installing deps):
   node server/scripts/seed.js
   This script is a starting point — adjust counts and sample data as needed.
*/

const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '..', '.env') });

const User = require('../models/User');
const Group = require('../models/Group');
const Post = require('../models/Post');

const MONGO = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/flightsocial';

async function connect() {
  await mongoose.connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true });
}

async function clear() {
  await Promise.all([
    User.deleteMany({}),
    Group.deleteMany({}),
    Post.deleteMany({}),
  ]);
}

async function seed() {
  console.log('Seeding database...');

  // Create users
  const users = [];
  for (let i = 1; i <= 8; i++) {
    users.push(new User({
      username: `user${i}`,
      email: `user${i}@example.com`,
      password: 'password', // hashed by pre-save hook if present
      profilePicture: '',
      isAdmin: i === 1, // first user admin
    }));
  }
  await User.insertMany(users);

  // Create groups
  const groups = [];
  for (let g = 1; g <= 4; g++) {
    groups.push(new Group({
      name: `Group ${g}`,
      description: `This is group ${g}`,
      members: users.slice((g - 1) * 2, (g - 1) * 2 + 3).map(u => u._id),
    }));
  }
  await Group.insertMany(groups);

  // Create posts
  const posts = [];
  for (let p = 1; p <= 20; p++) {
    const author = users[(p - 1) % users.length];
    const group = groups[(p - 1) % groups.length];
    posts.push(new Post({
      author: author._id,
      text: `Sample post ${p} by ${author.username}`,
      group: group._id,
      likes: [],
      isAnonymous: p % 7 === 0,
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 30)),
    }));
  }
  await Post.insertMany(posts);

  console.log('Seed complete.');
}

async function main() {
  try {
    await connect();
    await clear();
    await seed();
    mongoose.disconnect();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

main();
