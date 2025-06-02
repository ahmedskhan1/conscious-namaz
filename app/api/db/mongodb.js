import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    console.log('Connecting to MongoDB...');
    
    try {
      cached.promise = mongoose.connect(MONGODB_URI, {
        bufferCommands: false,
      });
      
      console.log('MongoDB connection initiated');
    } catch (error) {
      console.error('Error initiating MongoDB connection:', error);
      throw error;
    }
  }
  
  try {
    cached.conn = await cached.promise;
    console.log('MongoDB connected successfully');
    return cached.conn;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    // Reset the promise so we can try again
    cached.promise = null;
    throw error;
  }
}

export default connectToDatabase;
