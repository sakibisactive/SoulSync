import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';

let io: Server | null = null;

export const initSocket = (server: HttpServer): Server => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      credentials: true,
    },
  });

  const onlineUsers = new Map<string, string>(); // userId -> socketId

  io.on('connection', (socket: Socket) => {
    console.log(`[Socket] User connected: ${socket.id}`);

    // User joins online tracking
    socket.on('setup', (userId: string) => {
      if (userId) {
        onlineUsers.set(userId, socket.id);
        socket.join(userId);
        io?.emit('online_users', Array.from(onlineUsers.keys()));
      }
    });

    // Join room for a specific chat
    socket.on('join_chat', (chatId: string) => {
      socket.join(chatId);
      console.log(`[Socket] Socket ${socket.id} joined chat room: ${chatId}`);
    });

    // Typing Indicators
    socket.on('typing', ({ chatId, userId }) => {
      socket.to(chatId).emit('typing', { chatId, userId });
    });

    socket.on('stop_typing', ({ chatId, userId }) => {
      socket.to(chatId).emit('stop_typing', { chatId, userId });
    });

    // Send Message Event
    socket.on('send_message', (newMessage) => {
      if (newMessage && newMessage.chatId) {
        socket.to(newMessage.chatId).emit('receive_message', newMessage);
      }
    });

    // Disconnect
    socket.on('disconnect', () => {
      let disconnectedUserId: string | null = null;
      for (const [uId, sId] of onlineUsers.entries()) {
        if (sId === socket.id) {
          disconnectedUserId = uId;
          onlineUsers.delete(uId);
          break;
        }
      }
      if (disconnectedUserId) {
        io?.emit('online_users', Array.from(onlineUsers.keys()));
      }
      console.log(`[Socket] Disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getIO = (): Server => {
  if (!io) {
    throw new Error('Socket.IO not initialized');
  }
  return io;
};
