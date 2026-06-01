const mongoose = require('mongoose');
const User = require('../models/User');
const Post = require('../models/Post');

async function seedDatabase() {
  try {
    // 1. Check if posts already exist
    const postCount = await Post.countDocuments();
    if (postCount > 0) {
      console.log('Database already has posts. Skipping auto-seeding.');
      return;
    }

    console.log('No posts found. Starting database auto-seeding with TaskPlanet mock data...');

    // 2. Create or find mock Admin/Creators
    let adminUser = await User.findOne({ username: 'Nitin Pandey' });
    if (!adminUser) {
      adminUser = new User({
        username: 'Nitin Pandey',
        email: 'nitin@taskplanet.org',
        password: 'seederpassword123' // Will be hashed by user model hooks
      });
      await adminUser.save();
    }

    let user1 = await User.findOne({ username: 'Md Mustaquiem' });
    if (!user1) {
      user1 = new User({
        username: 'Md Mustaquiem',
        email: 'mustaquiem@taskplanet.org',
        password: 'seederpassword123'
      });
      await user1.save();
    }

    let user2 = await User.findOne({ username: 'Sudhan Kumar' });
    if (!user2) {
      user2 = new User({
        username: 'Sudhan Kumar',
        email: 'sudhan@taskplanet.org',
        password: 'seederpassword123'
      });
      await user2.save();
    }

    // 3. Create pre-seeded posts from screenshots
    const seededPosts = [
      {
        userId: adminUser._id,
        username: adminUser.username,
        text: `Create Post and Earn Points\n💰 Reward: 100 Points for each valid link.\n🚀 Daily Earning Potential: Up to 1000 Points.\n🚀 Weekly Earning Potential: Up to 10,000.\n🚀 Monthly Earning Potential: Up to 50,000 Points.`,
        imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=600&auto=format&fit=crop', // Beautiful high-res business growth image
        likes: Array.from({ length: 104 }, (_, i) => `User_${i + 1}`),
        comments: [
          { username: 'Md Mustaquiem', text: 'This reward program is amazing!', createdAt: new Date(Date.now() - 3600000 * 2) },
          { username: 'Sudhan Kumar', text: 'Just claimed my first 100 points today!', createdAt: new Date(Date.now() - 3600000) }
        ],
        createdAt: new Date(Date.now() - 86400000 * 10) // 10 days ago
      },
      {
        userId: user1._id,
        username: user1.username,
        text: 'Good afternoon 🌅 Have a great day doing tasks everyone!',
        imageUrl: '',
        likes: Array.from({ length: 9 }, (_, i) => `Liker_${i + 1}`),
        comments: [
          { username: 'Sudhan Kumar', text: 'Good afternoon! Let\'s crush today\'s tasks.', createdAt: new Date(Date.now() - 1800000) }
        ],
        createdAt: new Date(Date.now() - 3600000 * 11) // 11 hours ago
      },
      {
        userId: user2._id,
        username: user2.username,
        text: `🏆 LEADERBOARD ACHIEVEMENT 🏆\n🎯 I secured rank in TaskPlanet Leaderboard!\n\n💪 Play now and join the competition!\n#TaskPlanet #Leaderboard #Winning`,
        imageUrl: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=600&auto=format&fit=crop', // Beautiful leaderboard/dashboard visual mockup
        likes: Array.from({ length: 24 }, (_, i) => `Champion_${i + 1}`),
        comments: [
          { username: 'Nitin Pandey', text: 'Congratulations Sudhan! Keep up the brilliant work! 🚀', createdAt: new Date(Date.now() - 3600000 * 5) },
          { username: 'Md Mustaquiem', text: 'Insane score! Hoping to get on the podium next week.', createdAt: new Date(Date.now() - 3600000 * 3) }
        ],
        createdAt: new Date(Date.now() - 3600000 * 11) // 11 hours ago
      }
    ];

    await Post.insertMany(seededPosts);
    console.log('TaskPlanet mock data auto-seeded successfully!');
  } catch (err) {
    console.error('Error during auto-seeding:', err);
  }
}

module.exports = seedDatabase;
