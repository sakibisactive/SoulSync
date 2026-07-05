import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware.js';
import { Like } from '../models/Like.js';
import { Notification } from '../models/Notification.js';

export const likeUser = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const senderId = req.user!._id;
    const { receiverId } = req.body;

    if (!receiverId) {
      res.status(400).json({ success: false, message: 'Receiver ID is required' });
      return;
    }

    const existingLike = await Like.findOne({ sender: senderId, receiver: receiverId });
    if (existingLike) {
      res.status(200).json({ success: true, message: 'Already liked this user' });
      return;
    }

    await Like.create({ sender: senderId, receiver: receiverId });

    // Check for mutual like
    const isMutual = await Like.findOne({ sender: receiverId, receiver: senderId });

    // Send Notification
    await Notification.create({
      user: receiverId,
      type: isMutual ? 'match' : 'like',
      message: isMutual
        ? `🎉 It's a Mutual Match! You and ${req.user!.name} liked each other.`
        : `💖 ${req.user!.name} liked your profile!`,
    });

    res.status(200).json({
      success: true,
      message: isMutual ? 'It is a Mutual Match! 🎉' : 'Profile liked successfully',
      isMutualMatch: !!isMutual,
    });
  } catch (err: any) {
    next(err);
  }
};

export const saveUser = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const senderId = req.user!._id;
    const { targetUserId } = req.body;

    let like = await Like.findOne({ sender: senderId, receiver: targetUserId });
    if (like) {
      like.isSaved = true;
      await like.save();
    } else {
      like = await Like.create({ sender: senderId, receiver: targetUserId, isSaved: true });
    }

    res.status(200).json({ success: true, message: 'Profile saved to bookmarks' });
  } catch (err: any) {
    next(err);
  }
};

export const getMyLikes = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user!._id;
    const likesGiven = await Like.find({ sender: userId }).populate('receiver', 'name email role status');
    const likesReceived = await Like.find({ receiver: userId }).populate('sender', 'name email role status');

    res.status(200).json({
      success: true,
      likesGiven,
      likesReceived,
    });
  } catch (err: any) {
    next(err);
  }
};

export const deleteLike = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const senderId = req.user!._id;
    const { id: targetUserId } = req.params;

    await Like.findOneAndDelete({ sender: senderId, receiver: targetUserId });
    res.status(200).json({ success: true, message: 'Like removed' });
  } catch (err: any) {
    next(err);
  }
};
