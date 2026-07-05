import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
  try {
    const connStr = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/partner_match';
    const conn = await mongoose.connect(connStr);
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
  } catch (error: any) {
    console.error(`[Database Error] Connection failed: ${error.message}`);
    // Non-blocking exit in dev mode to allow local testing even if DB is spinning up
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};
