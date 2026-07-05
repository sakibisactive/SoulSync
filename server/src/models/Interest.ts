import mongoose, { Document, Schema } from 'mongoose';

export interface IInterest extends Document {
  name: string;
  category: string;
}

const InterestSchema: Schema<IInterest> = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      default: 'General',
    },
  },
  { timestamps: true }
);

export const Interest = mongoose.model<IInterest>('Interest', InterestSchema);
