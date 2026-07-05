import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User.js';
import { Profile } from '../models/Profile.js';
import { Report } from '../models/Report.js';
import { Interest } from '../models/Interest.js';
import { Match } from '../models/Match.js';

export const getAllUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const users = await User.find({}).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: users.length, users });
  } catch (err: any) {
    next(err);
  }
};

export const banUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    user.status = user.status === 'banned' ? 'active' : 'banned';
    await user.save();

    res.status(200).json({
      success: true,
      message: `User status updated to ${user.status}`,
      status: user.status,
    });
  } catch (err: any) {
    next(err);
  }
};

export const verifyUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    user.isVerified = true;
    await user.save();

    res.status(200).json({ success: true, message: 'User badge verified by Admin' });
  } catch (err: any) {
    next(err);
  }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    await Profile.findOneAndDelete({ userId: id });
    res.status(200).json({ success: true, message: 'User and profile permanently deleted' });
  } catch (err: any) {
    next(err);
  }
};

export const getReports = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const reports = await Report.find({})
      .populate('reporter', 'name email')
      .populate('reportedUser', 'name email status')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: reports.length, reports });
  } catch (err: any) {
    next(err);
  }
};

export const resolveReport = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { reportId } = req.params;
    const { status } = req.body; // 'reviewed' | 'resolved'

    const report = await Report.findByIdAndUpdate(reportId, { status }, { new: true });
    res.status(200).json({ success: true, message: 'Report status updated', report });
  } catch (err: any) {
    next(err);
  }
};

export const createInterest = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, category } = req.body;
    const newInterest = await Interest.create({ name, category: category || 'General' });
    res.status(201).json({ success: true, interest: newInterest });
  } catch (err: any) {
    next(err);
  }
};

export const deleteInterest = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    await Interest.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: 'Interest tag deleted' });
  } catch (err: any) {
    next(err);
  }
};

export const getAdminAnalytics = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ status: 'active' });
    const bannedUsers = await User.countDocuments({ status: 'banned' });
    const totalMatches = await Match.countDocuments();
    const pendingReports = await Report.countDocuments({ status: 'pending' });

    res.status(200).json({
      success: true,
      analytics: {
        totalUsers,
        activeUsers,
        bannedUsers,
        totalMatches,
        pendingReports,
      },
    });
  } catch (err: any) {
    next(err);
  }
};
