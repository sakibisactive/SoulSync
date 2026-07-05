import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware.js';
import { Profile } from '../models/Profile.js';
import { Match } from '../models/Match.js';
import { User } from '../models/User.js';
import { computeCompatibility } from '../algorithms/matchingEngine.js';

export const computeMatches = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const currentUserId = req.user!._id;

    // Fetch user's profile
    const myProfile = await Profile.findOne({ userId: currentUserId }).populate('interests');
    if (!myProfile) {
      res.status(404).json({ success: false, message: 'Profile not completed' });
      return;
    }

    // Filter candidate profiles
    const query: any = { userId: { $ne: currentUserId } };

    // Preferred gender filter if specified
    if (myProfile.preferences?.gender && myProfile.preferences.gender.length > 0) {
      query.gender = { $in: myProfile.preferences.gender };
    }

    const candidateProfiles = await Profile.find(query)
      .populate('userId', 'name email role status isVerified')
      .populate('interests');

    const matchResults: any[] = [];

    for (const candidate of candidateProfiles) {
      if (!candidate.userId || (candidate.userId as any).status === 'banned') continue;

      const breakdown = computeCompatibility(myProfile, candidate);

      // Save/Update top match in MongoDB Match collection
      await Match.findOneAndUpdate(
        {
          $or: [
            { userA: currentUserId, userB: candidate.userId },
            { userA: candidate.userId, userB: currentUserId },
          ],
        },
        {
          userA: currentUserId,
          userB: candidate.userId,
          compatibilityScore: breakdown.finalScore,
          breakdown: {
            personality: breakdown.personality,
            interest: breakdown.interest,
            lifestyle: breakdown.lifestyle,
            age: breakdown.age,
            location: breakdown.location,
          },
          matchedAt: new Date(),
        },
        { upsert: true, new: true }
      );

      matchResults.push({
        candidateId: candidate.userId._id,
        user: candidate.userId,
        profile: candidate,
        compatibilityScore: breakdown.finalScore,
        breakdown,
      });
    }

    // Sort by compatibility score descending and limit to top 20
    matchResults.sort((a, b) => b.compatibilityScore - a.compatibilityScore);
    const top20Matches = matchResults.slice(0, 20);

    res.status(200).json({
      success: true,
      count: top20Matches.length,
      matches: top20Matches,
    });
  } catch (err: any) {
    next(err);
  }
};

export const getMatchById = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const currentUserId = req.user!._id;
    const { targetUserId } = req.params;

    const myProfile = await Profile.findOne({ userId: currentUserId }).populate('interests');
    const targetProfile = await Profile.findOne({ userId: targetUserId })
      .populate('userId', 'name email isVerified status')
      .populate('interests');

    if (!myProfile || !targetProfile) {
      res.status(404).json({ success: false, message: 'Profile not found' });
      return;
    }

    const breakdown = computeCompatibility(myProfile, targetProfile);

    res.status(200).json({
      success: true,
      user: targetProfile.userId,
      profile: targetProfile,
      compatibilityScore: breakdown.finalScore,
      breakdown,
    });
  } catch (err: any) {
    next(err);
  }
};
