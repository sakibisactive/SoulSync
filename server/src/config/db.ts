import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
  try {
    const connStr = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/partner_match';
    const conn = await mongoose.connect(connStr, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
  } catch (error: any) {
    console.error(`[Database Error] Connection failed: ${error.message}`);
    console.error(`[Database Note] Make sure 0.0.0.0/0 (Allow Access from Anywhere) is added to your MongoDB Atlas Network Access IP Whitelist.`);
  }
};
