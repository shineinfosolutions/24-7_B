import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();  

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 30000,
      connectTimeoutMS: 30000,
      socketTimeoutMS: 30000,
      maxPoolSize: 10,
      retryWrites: true,
      w: 'majority'
    });

    console.log(`✅ Database Connected: ${mongoose.connection.name}`);
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    console.log('Retrying connection in 5 seconds...');
    setTimeout(() => connectDB(), 5000);
  }
};

export default connectDB;
