import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

interface Connection {
  isConnected?: number;
}

const connection: Connection = {};

async function dbConnect() {
  if (connection.isConnected) {
    return;
  }

  try {
    const db = await mongoose.connect(MONGODB_URI ?? '');
    connection.isConnected = db.connections[0].readyState;
  } catch (error) {
    console.error('Error connecting to database:', error);
    throw error;
  }
}

export default dbConnect; 