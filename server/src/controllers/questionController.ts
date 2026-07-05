import { Request, Response, NextFunction } from 'express';
import { Question } from '../models/Question.js';
import { Interest } from '../models/Interest.js';

export const getQuestions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const questions = await Question.find({}).sort({ questionNumber: 1 });
    res.status(200).json({ success: true, count: questions.length, questions });
  } catch (err: any) {
    next(err);
  }
};

export const getInterests = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const interests = await Interest.find({}).sort({ name: 1 });
    res.status(200).json({ success: true, count: interests.length, interests });
  } catch (err: any) {
    next(err);
  }
};
