import mongoose, { Document, Schema } from 'mongoose';

export interface ILike extends Document {
  sender: mongoose.Types.ObjectId;
  receiver: mongoose.Types.ObjectId;
  isSaved: boolean;
  createdAt: Date;
}

const LikeSchema: Schema<ILike> = new Schema(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    receiver: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    isSaved: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

LikeSchema.index({ sender: 1, receiver: 1 }, { unique: true });

export const Like = mongoose.model<ILike>('Like', LikeSchema);
