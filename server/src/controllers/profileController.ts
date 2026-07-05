import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware.js';
import { Profile } from '../models/Profile.js';
import { User } from '../models/User.js';

export const updateProfile = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user!._id;
    const { bio, age, gender, height, education, occupation, city, country, religion, relationshipGoal, lifestyle, coordinates } = req.body;

    const updateFields: any = {};
    if (bio !== undefined) updateFields.bio = bio;
    if (age !== undefined) updateFields.age = age;
    if (gender !== undefined) updateFields.gender = gender;
    if (height !== undefined) updateFields.height = height;
    if (education !== undefined) updateFields.education = education;
    if (occupation !== undefined) updateFields.occupation = occupation;
    if (city !== undefined) updateFields.city = city;
    if (country !== undefined) updateFields.country = country;
    if (religion !== undefined) updateFields.religion = religion;
    if (relationshipGoal !== undefined) updateFields.relationshipGoal = relationshipGoal;
    if (lifestyle !== undefined) updateFields.lifestyle = lifestyle;

    if (coordinates && Array.isArray(coordinates) && coordinates.length === 2) {
      updateFields.location = {
        type: 'Point',
        coordinates: [coordinates[0], coordinates[1]],
      };
    }

    const updatedProfile = await Profile.findOneAndUpdate(
      { userId },
      { $set: updateFields },
      { new: true, runValidators: true }
    ).populate('interests preferences.interests');

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      profile: updatedProfile,
    });
  } catch (err: any) {
    next(err);
  }
};

export const submitPersonalityAnswers = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user!._id;
    const { answers } = req.body; // Array of { questionNumber, answer }

    if (!Array.isArray(answers)) {
      res.status(400).json({ success: false, message: 'Answers must be an array of question answers' });
      return;
    }

    const profile = await Profile.findOne({ userId });
    if (!profile) {
      res.status(404).json({ success: false, message: 'Profile not found' });
      return;
    }

    profile.personalityAnswers = answers;
    await profile.save();

    res.status(200).json({
      success: true,
      message: 'Personality questionnaire answers saved successfully!',
      personalityAnswersCount: profile.personalityAnswers.length,
    });
  } catch (err: any) {
    next(err);
  }
};

export const updateInterests = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user!._id;
    const { interestIds } = req.body; // Array of Interest ObjectId strings

    const profile = await Profile.findOneAndUpdate(
      { userId },
      { $set: { interests: interestIds } },
      { new: true }
    ).populate('interests');

    res.status(200).json({
      success: true,
      message: 'Interests updated successfully',
      interests: profile?.interests,
    });
  } catch (err: any) {
    next(err);
  }
};

export const updatePreferences = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user!._id;
    const { minAge, maxAge, gender, maxDistanceKm, relationshipType } = req.body;

    const profile = await Profile.findOne({ userId });
    if (!profile) {
      res.status(404).json({ success: false, message: 'Profile not found' });
      return;
    }

    profile.preferences = {
      ...profile.preferences,
      minAge: minAge !== undefined ? minAge : profile.preferences.minAge,
      maxAge: maxAge !== undefined ? maxAge : profile.preferences.maxAge,
      gender: gender !== undefined ? gender : profile.preferences.gender,
      maxDistanceKm: maxDistanceKm !== undefined ? maxDistanceKm : profile.preferences.maxDistanceKm,
      relationshipType: relationshipType !== undefined ? relationshipType : profile.preferences.relationshipType,
    };

    await profile.save();

    res.status(200).json({
      success: true,
      message: 'Preferences updated successfully',
      preferences: profile.preferences,
    });
  } catch (err: any) {
    next(err);
  }
};

export const addPhoto = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user!._id;
    const { photoUrl } = req.body;

    if (!photoUrl) {
      res.status(400).json({ success: false, message: 'Photo URL is required' });
      return;
    }

    const profile = await Profile.findOne({ userId });
    if (!profile) {
      res.status(404).json({ success: false, message: 'Profile not found' });
      return;
    }

    const isMain = profile.photos.length === 0;
    profile.photos.push({ url: photoUrl, isMain });
    await profile.save();

    res.status(200).json({
      success: true,
      message: 'Photo added successfully',
      photos: profile.photos,
    });
  } catch (err: any) {
    next(err);
  }
};

export const getProfileByUserId = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select('name email role isVerified status');
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    const profile = await Profile.findOne({ userId }).populate('interests');
    res.status(200).json({
      success: true,
      user,
      profile,
    });
  } catch (err: any) {
    next(err);
  }
};
