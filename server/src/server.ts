import express, { Request, Response } from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDB } from './config/db.js';
import { errorHandler } from './middlewares/errorHandlerMiddleware.js';
import { initSocket } from './services/socketService.js';
import { seedQuestions } from './seeders/questionSeeder.js';
import { seedInterests } from './seeders/interestSeeder.js';
import { seedAdminUser } from './seeders/adminSeeder.js';

dotenv.config();

const app = express();
const server = http.createServer(app);

// Initialize WebSockets Engine
initSocket(server);

// Security & Utility Middlewares
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || '*',
    credentials: true,
  })
);
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Endpoints Mounting
import authRoutes from './routes/authRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import questionRoutes from './routes/questionRoutes.js';
import matchRoutes from './routes/matchRoutes.js';
import likeRoutes from './routes/likeRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import userRoutes from './routes/userRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/meta', questionRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/likes', likeRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);

// Root Welcome Route
app.get('/', (req: Request, res: Response) => {
  res.status(200).send(`
    <div style="font-family: Arial, sans-serif; text-align: center; padding: 50px; background-color: #0f172a; color: #ffffff; min-height: 100vh;">
      <h1 style="color: #f43f5e; font-size: 3rem; margin-bottom: 10px;">❤️ SoulSync Backend API</h1>
      <p style="color: #94a3b8; font-size: 1.2rem;">MERN Partner Matching & 5D Compatibility Algorithm Server is Live!</p>
      <div style="margin-top: 30px;">
        <a href="/api/health" style="background-color: #4f46e5; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">Check API Health Status (/api/health)</a>
      </div>
    </div>
  `);
});

// Health Check API
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'online',
    app: 'SoulSync Platform API',
    dbState: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
  });
});

// Central Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Start Server HTTP Listener Immediately for Render Health Checks
server.listen(PORT, () => {
  console.log(`[Server] SoulSync Backend running on port ${PORT}`);

  // Asynchronously connect database and run seeders only if DB connected
  connectDB().then(async () => {
    if (mongoose.connection.readyState === 1) {
      try {
        await seedAdminUser();
        await seedQuestions();
        await seedInterests();
      } catch (e: any) {
        console.error(`[Seeder Error]: ${e.message}`);
      }
    }
  });
});

export { app, server };
