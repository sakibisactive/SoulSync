import mongoose, { Document, Schema } from 'mongoose';

export interface IQuestion extends Document {
  questionNumber: number;
  question: string;
  category: 'Extraversion' | 'Agreeableness' | 'Conscientiousness' | 'Neuroticism' | 'Openness' | 'General';
  weight: number;
}

const QuestionSchema: Schema<IQuestion> = new Schema(
  {
    questionNumber: {
      type: Number,
      required: true,
      unique: true,
    },
    question: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ['Extraversion', 'Agreeableness', 'Conscientiousness', 'Neuroticism', 'Openness', 'General'],
      default: 'General',
    },
    weight: {
      type: Number,
      default: 1.0,
    },
  },
  { timestamps: true }
);

export const Question = mongoose.model<IQuestion>('Question', QuestionSchema);
