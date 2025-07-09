// src/lib/mongodb.ts
import mongoose from 'mongoose';

const connectMongoDB = async () => {
  if (mongoose.connection.readyState >= 1) return;
  try {
    await mongoose.connect(process.env.CONNECTION_STRING as string);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

export default connectMongoDB;