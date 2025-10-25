import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();  

const connectDB = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      console.log('✅ Database already connected');
      return;
    }

    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 30000,
      connectTimeoutMS: 30000,
      socketTimeoutMS: 30000,
      maxPoolSize: 10,
      retryWrites: true,
      w: 'majority',
      authSource: 'admin',
      ssl: true
    });

    console.log(`✅ Database Connected: ${mongoose.connection.name}`);
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    if (process.env.NODE_ENV !== 'production') {
      console.log('Retrying connection in 5 seconds...');
      setTimeout(() => connectDB(), 5000);
    } else {
      throw error;
    }
  }
};

export default connectDB;
