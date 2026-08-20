import mongoose from 'mongoose';
import dns from 'dns';
import { config } from './config.js';

if (config.NODE_ENV !== "production") {
  dns.setServers(["8.8.8.8"]);
}
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
