const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('Please define the MONGODB_URI environment variable inside .env.local');
  process.exit(1);
}

const targetEmail = process.argv[2];

if (!targetEmail) {
  console.error('Please provide an email address as an argument.');
  console.error('Usage: node scripts/make-admin.js <email-address>');
  process.exit(1);
}

async function makeAdmin() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB.');

    const result = await mongoose.connection.collection('users').updateOne(
      { email: targetEmail },
      { $set: { role: 'admin' } }
    );

    if (result.matchedCount === 0) {
      console.log(`No user found with email: ${targetEmail}`);
    } else if (result.modifiedCount === 0) {
      console.log(`User ${targetEmail} is already an admin.`);
    } else {
      console.log(`Successfully promoted ${targetEmail} to admin.`);
    }

  } catch (error) {
    console.error('Error updating user role:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected.');
    process.exit(0);
  }
}

makeAdmin();
