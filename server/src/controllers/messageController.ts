import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware.js';
import { Chat } from '../models/Chat.js';
import { Message } from '../models/Message.js';
import { getIO } from '../services/socketService.js';

export const getChats = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user!._id;
    const chats = await Chat.find({ participants: userId })
      .populate('participants', 'name email status role')
      .sort({ updatedAt: -1 });

    res.status(200).json({ success: true, count: chats.length, chats });
  } catch (err: any) {
    next(err);
  }
};

export const getMessages = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { chatId } = req.params;
    const messages = await Message.find({ chatId }).sort({ createdAt: 1 });
    res.status(200).json({ success: true, count: messages.length, messages });
  } catch (err: any) {
    next(err);
  }
};

export const sendMessage = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const senderId = req.user!._id;
    const { receiverId, messageText, chatId: reqChatId } = req.body;

    let chat;
    if (reqChatId) {
      chat = await Chat.findById(reqChatId);
    } else if (receiverId) {
      chat = await Chat.findOne({
        participants: { $all: [senderId, receiverId] },
      });
      if (!chat) {
        chat = await Chat.create({
          participants: [senderId, receiverId],
        });
      }
    }

    if (!chat) {
      res.status(400).json({ success: false, message: 'Chat context could not be resolved' });
      return;
    }

    const newMessage = await Message.create({
      chatId: chat._id,
      sender: senderId,
      message: messageText,
      seen: false,
    });

    chat.lastMessage = {
      sender: senderId,
      text: messageText,
      createdAt: new Date(),
    };
    await chat.save();

    // Emit Socket event to room if active
    try {
      const io = getIO();
      if (io) {
        io.to(chat._id.toString()).emit('receive_message', newMessage);
      }
    } catch (e) {
      // socket failover non-blocking
    }

    res.status(201).json({
      success: true,
      chatId: chat._id,
      message: newMessage,
    });
  } catch (err: any) {
    next(err);
  }
};
