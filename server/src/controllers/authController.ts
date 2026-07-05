import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { User } from '../models/User.js';
import { Profile } from '../models/Profile.js';
import { sendEmail } from '../services/emailService.js';
import { AuthRequest } from '../middlewares/authMiddleware.js';

const generateTokens = (id: string) => {
  const accessToken = jwt.sign(
    { id },
    process.env.JWT_SECRET || 'super_secret_jwt_key_partner_match_2026',
    { expiresIn: '7d' }
  );

  const refreshToken = jwt.sign(
    { id },
    process.env.JWT_REFRESH_SECRET || 'super_secret_refresh_key_partner_match_2026',
    { expiresIn: '30d' }
  );

  return { accessToken, refreshToken };
};

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, email, password, gender, age } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ success: false, message: 'Email is already registered' });
      return;
    }

    const verificationToken = crypto.randomBytes(20).toString('hex');

    const user = await User.create({
      name,
      email,
      password,
      role: 'User',
      isVerified: false,
      verificationToken,
    });

    // Create Initial Profile
    await Profile.create({
      userId: user._id,
      age: age || 24,
      gender: gender || 'Male',
      bio: `Hello! I am ${name}, excited to connect and find a compatible partner!`,
      photos: [
        {
          url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600',
          isMain: true,
        },
      ],
      lifestyle: {
        smoking: 'Never',
        drinking: 'Socially',
        exercise: 'Sometimes',
        diet: 'Anything',
        pets: 'Lover',
      },
      preferences: {
        minAge: 18,
        maxAge: 50,
        gender: [gender === 'Male' ? 'Female' : 'Male'],
        maxDistanceKm: 100,
        relationshipType: ['Long-term'],
        interests: [],
      },
    });

    const { accessToken, refreshToken } = generateTokens(user._id.toString());

    await sendEmail({
      to: user.email,
      subject: 'Welcome to SoulSync - Verify Your Account',
      text: `Hello ${user.name},\n\nYour account verification code/token is: ${verificationToken}\n\nWelcome to SoulSync!`,
    });

    res.status(201).json({
      success: true,
      message: 'Registration successful! Verification token sent to email.',
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      },
    });
  } catch (err: any) {
    next(err);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, message: 'Please provide email and password' });
      return;
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
      return;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
      return;
    }

    if (user.status === 'banned') {
      res.status(403).json({ success: false, message: 'Your account has been banned by an administrator' });
      return;
    }

    const { accessToken, refreshToken } = generateTokens(user._id.toString());

    res.status(200).json({
      success: true,
      message: 'Login successful',
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      },
    });
  } catch (err: any) {
    next(err);
  }
};

export const verifyEmail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { token } = req.body;
    const user = await User.findOne({ verificationToken: token }).select('+verificationToken');

    if (!user) {
      res.status(400).json({ success: false, message: 'Invalid or expired verification token' });
      return;
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res.status(200).json({ success: true, message: 'Account successfully verified!' });
  } catch (err: any) {
    next(err);
  }
};

export const forgotPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      res.status(404).json({ success: false, message: 'No account found with that email' });
      return;
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await user.save();

    await sendEmail({
      to: user.email,
      subject: 'SoulSync - Reset Password Request',
      text: `Hello ${user.name},\n\nUse this reset token to change your password: ${resetToken}\nValid for 1 hour.`,
    });

    res.status(200).json({ success: true, message: 'Password reset token sent to your email.' });
  } catch (err: any) {
    next(err);
  }
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { token, newPassword } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    }).select('+resetPasswordToken +resetPasswordExpires');

    if (!user) {
      res.status(400).json({ success: false, message: 'Token is invalid or has expired' });
      return;
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ success: true, message: 'Password reset successful. You may now login.' });
  } catch (err: any) {
    next(err);
  }
};

export const getMe = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }
    const profile = await Profile.findOne({ userId: req.user._id }).populate('interests preferences.interests');
    res.status(200).json({
      success: true,
      user: req.user,
      profile,
    });
  } catch (err: any) {
    next(err);
  }
};
