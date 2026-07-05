import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware.js';
import { Profile, computeProfileCompletion } from '../models/Profile.js';
import { User } from '../models/User.js';
import { Match } from '../models/Match.js';
import { Like } from '../models/Like.js';
import { Message } from '../models/Message.js';
import { computeCompatibility } from '../algorithms/matchingEngine.js';

export const discoverUsers = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const currentUserId = req.user!._id;
    const {
      page = 1,
      limit = 10,
      minAge,
      maxAge,
      gender,
      country,
      city,
      education,
      occupation,
      religion,
      interest,
      sortBy = 'compatibility',
    } = req.query;

    const myProfile = await Profile.findOne({ userId: currentUserId }).populate('interests');
    if (!myProfile) {
      res.status(400).json({
        success: false,
        isProfileComplete: false,
        completionPercentage: 0,
        missingSections: ['Create your profile first'],
        users: [],
      });
      return;
    }

    // MANDATORY 100% PROFILE COMPLETION GUARD
    const completion = computeProfileCompletion(myProfile);
    if (!completion.isComplete) {
      res.status(200).json({
        success: true,
        isProfileComplete: false,
        completionPercentage: completion.percentage,
        missingSections: completion.missingSections,
        total: 0,
        users: [],
      });
      return;
    }

    const query: any = { userId: { $ne: currentUserId } };

    if (minAge || maxAge) {
      query.age = {};
      if (minAge) query.age.$gte = parseInt(minAge as string, 10);
      if (maxAge) query.age.$lte = parseInt(maxAge as string, 10);
    }

    if (gender) query.gender = gender;
    if (country) query.country = { $regex: country as string, $options: 'i' };
    if (city) query.city = { $regex: city as string, $options: 'i' };
    if (education) query.education = { $regex: education as string, $options: 'i' };
    if (occupation) query.occupation = { $regex: occupation as string, $options: 'i' };
    if (religion) query.religion = religion;
    if (interest) query.interests = interest;

    const rawProfiles = await Profile.find(query)
      .populate('userId', 'name email role isVerified status createdAt')
      .populate('interests');

    // Filter out banned users and incomplete candidate profiles
    const validProfiles = rawProfiles.filter((p) => {
      if (!p.userId || (p.userId as any).status === 'banned') return false;
      const candidateCompletion = computeProfileCompletion(p);
      return candidateCompletion.isComplete;
    });

    // Compute compatibility scores
    let results = validProfiles.map((candidate) => {
      const breakdown = computeCompatibility(myProfile, candidate);
      return {
        candidateId: candidate.userId._id,
        user: candidate.userId,
        profile: candidate,
        compatibilityScore: breakdown.finalScore,
        breakdown,
      };
    });

    // Sorting
    if (sortBy === 'newest') {
      results.sort(
        (a, b) =>
          new Date((b.user as any).createdAt).getTime() - new Date((a.user as any).createdAt).getTime()
      );
    } else if (sortBy === 'distance') {
      results.sort((a, b) => b.breakdown.location - a.breakdown.location);
    } else {
      results.sort((a, b) => b.compatibilityScore - a.compatibilityScore);
    }

    // Pagination
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const startIndex = (pageNum - 1) * limitNum;
    const paginatedResults = results.slice(startIndex, startIndex + limitNum);

    res.status(200).json({
      success: true,
      isProfileComplete: true,
      completionPercentage: 100,
      missingSections: [],
      total: results.length,
      page: pageNum,
      totalPages: Math.ceil(results.length / limitNum),
      count: paginatedResults.length,
      users: paginatedResults,
    });
  } catch (err: any) {
    next(err);
  }
};

/**
 * Self Account Deletion for Standard Users
 * (Admin accounts CANNOT self-delete)
 */
export const deleteMyAccount = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = req.user!;

    // ADMIN SELF-DELETION PROTECTION
    if (user.role === 'Admin') {
      res.status(403).json({
        success: false,
        message: 'Master Admin accounts cannot be self-deleted to maintain platform administration.',
      });
      return;
    }

    const userId = user._id;

    // Delete User & Profile documents
    await User.findByIdAndDelete(userId);
    await Profile.findOneAndDelete({ userId });

    // Clean up related matches, likes, and messages
    await Match.deleteMany({ $or: [{ userA: userId }, { userB: userId }] });
    await Like.deleteMany({ $or: [{ senderId: userId }, { receiverId: userId }] });
    await Message.deleteMany({ $or: [{ senderId: userId }, { receiverId: userId }] });

    res.status(200).json({
      success: true,
      message: 'Your account and all associated data have been permanently deleted.',
    });
  } catch (err: any) {
    next(err);
  }
};
