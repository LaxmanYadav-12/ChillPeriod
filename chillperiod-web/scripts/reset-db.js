const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('Please define the MONGODB_URI environment variable inside .env.local');
  process.exit(1);
}

async function resetUsers() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB.');

    const result = await mongoose.connection.collection('users').deleteMany({});
    console.log(`Deleted ${result.deletedCount} users.`);

    // Also clear sessions if they exist (though using JWT)
    // const sessions = await mongoose.connection.collection('sessions').deleteMany({});
    
    console.log('Database reset complete. All users will need to login and onboard again.');
  } catch (error) {
    console.error('Error resetting database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected.');
    process.exit(0);
  }
}

resetUsers();
