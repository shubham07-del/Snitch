import mongoose from 'mongoose';
import dns from "dns"
dns.setServers(["8.8.8.8"])
import { config } from './config.js';


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
