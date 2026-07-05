import mongoose, { Document, Schema } from 'mongoose';

export interface IMatchBreakdown {
  personality: number;
  interest: number;
  lifestyle: number;
  age: number;
  location: number;
}

export interface IMatch extends Document {
  userA: mongoose.Types.ObjectId;
  userB: mongoose.Types.ObjectId;
  compatibilityScore: number;
  breakdown: IMatchBreakdown;
  matchedAt: Date;
}

const MatchSchema: Schema<IMatch> = new Schema(
  {
    userA: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    userB: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    compatibilityScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    breakdown: {
      personality: { type: Number, default: 0 },
      interest: { type: Number, default: 0 },
      lifestyle: { type: Number, default: 0 },
      age: { type: Number, default: 0 },
      location: { type: Number, default: 0 },
    },
    matchedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

MatchSchema.index({ userA: 1, userB: 1 }, { unique: true });

export const Match = mongoose.model<IMatch>('Match', MatchSchema);
