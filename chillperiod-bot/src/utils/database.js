import mongoose from 'mongoose';

/**
 * Connect to MongoDB database
 */
export async function connectDatabase() {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/chillperiod';
    
    try {
        await mongoose.connect(uri);
        console.log('🍃 Connected to MongoDB');
        
        // Handle connection events
        mongoose.connection.on('error', (error) => {
            console.error('❌ MongoDB connection error:', error);
        });
        
        mongoose.connection.on('disconnected', () => {
            console.log('⚠️ MongoDB disconnected');
        });
        
    } catch (error) {
        console.error('❌ Failed to connect to MongoDB:', error.message);
        throw error;
    }
}

/**
 * Disconnect from MongoDB (for graceful shutdown)
 */
export async function disconnectDatabase() {
    await mongoose.disconnect();
    console.log('🍃 Disconnected from MongoDB');
}
