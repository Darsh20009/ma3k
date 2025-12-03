import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.log('MONGODB_URI not found, MongoDB will not be available');
}

let isConnected = false;

export async function connectMongoDB(): Promise<boolean> {
  if (!MONGODB_URI) {
    console.log('No MONGODB_URI provided');
    return false;
  }

  if (isConnected) {
    return true;
  }

  try {
    await mongoose.connect(MONGODB_URI);
    isConnected = true;
    console.log('Connected to MongoDB database');
    return true;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    return false;
  }
}

export { mongoose, isConnected };
