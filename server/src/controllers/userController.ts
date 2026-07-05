import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware.js';
import { Profile } from '../models/Profile.js';
import { User } from '../models/User.js';
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

    // Filter out banned users
    const validProfiles = rawProfiles.filter(
      (p) => p.userId && (p.userId as any).status !== 'banned'
    );

    // Compute compatibility scores
    let results = validProfiles.map((candidate) => {
      const breakdown = myProfile
        ? computeCompatibility(myProfile, candidate)
        : { finalScore: 50, personality: 50, interest: 50, lifestyle: 50, age: 50, location: 50 };

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
      results.sort((a, b) => new Date(b.user.createdAt).getTime() - new Date(a.user.createdAt).getTime());
    } else if (sortBy === 'distance') {
      results.sort((a, b) => b.breakdown.location - a.breakdown.location);
    } else {
      // Default: Compatibility
      results.sort((a, b) => b.compatibilityScore - a.compatibilityScore);
    }

    // Pagination
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const startIndex = (pageNum - 1) * limitNum;
    const paginatedResults = results.slice(startIndex, startIndex + limitNum);

    res.status(200).json({
      success: true,
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
