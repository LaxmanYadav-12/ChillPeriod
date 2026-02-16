const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('Please define the MONGODB_URI environment variable inside .env.local');
  process.exit(1);
}

async function promote() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const email = 'guptaparitosh2005@gmail.com';
    const User = mongoose.models.User || mongoose.model('User', new mongoose.Schema({}, { strict: false }));

    const res = await User.updateOne(
      { email: email },
      { $set: { role: 'admin' } }
    );

    if (res.matchedCount === 0) {
      console.log(`User with email ${email} not found.`);
    } else {
      console.log(`Successfully promoted ${email} to admin!`);
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

promote();
