import mongoose, { Document, Schema } from 'mongoose';

export interface IChat extends Document {
  participants: mongoose.Types.ObjectId[];
  lastMessage?: {
    sender: mongoose.Types.ObjectId;
    text: string;
    createdAt: Date;
  };
  updatedAt: Date;
}

const ChatSchema: Schema<IChat> = new Schema(
  {
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    ],
    lastMessage: {
      sender: { type: Schema.Types.ObjectId, ref: 'User' },
      text: { type: String },
      createdAt: { type: Date },
    },
  },
  { timestamps: true }
);

export const Chat = mongoose.model<IChat>('Chat', ChatSchema);
