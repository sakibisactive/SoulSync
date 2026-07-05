import mongoose, { Document, Schema } from 'mongoose';

export interface IPersonalityAnswer {
  questionNumber: number;
  answer: number; // 1 to 5 scale
}

export interface IPhoto {
  url: string;
  publicId?: string;
  isMain: boolean;
}

export interface ILifestyle {
  smoking: 'Never' | 'Occasionally' | 'Regularly';
  drinking: 'Never' | 'Socially' | 'Regularly';
  exercise: 'Never' | 'Sometimes' | 'Often' | 'Daily';
  diet: 'Anything' | 'Vegetarian' | 'Vegan' | 'Keto' | 'Halal';
  pets: 'None' | 'Cat' | 'Dog' | 'Both' | 'Lover';
}

export interface IPreferences {
  minAge: number;
  maxAge: number;
  gender: string[];
  maxDistanceKm: number;
  relationshipType: string[];
  interests: mongoose.Types.ObjectId[];
}

export interface IProfile extends Document {
  userId: mongoose.Types.ObjectId;
  bio?: string;
  dob?: Date;
  age: number;
  gender: 'Male' | 'Female' | 'Non-binary' | 'Other';
  height?: number; // in cm
  education?: string;
  occupation?: string;
  city?: string;
  country?: string;
  location?: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
  religion?: string;
  relationshipGoal?: 'Long-term' | 'Casual' | 'Friendship' | 'Marriage';
  lifestyle: ILifestyle;
  personalityAnswers: IPersonalityAnswer[];
  interests: mongoose.Types.ObjectId[];
  preferences: IPreferences;
  photos: IPhoto[];
  createdAt: Date;
  updatedAt: Date;
}

const ProfileSchema: Schema<IProfile> = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    bio: {
      type: String,
      maxlength: 500,
      default: '',
    },
    dob: {
      type: Date,
    },
    age: {
      type: Number,
      required: true,
      min: 18,
      max: 100,
      default: 24,
      index: true,
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Non-binary', 'Other'],
      required: true,
      default: 'Male',
      index: true,
    },
    height: {
      type: Number,
      default: 170,
    },
    education: {
      type: String,
      default: '',
    },
    occupation: {
      type: String,
      default: '',
    },
    city: {
      type: String,
      default: 'New York',
      index: true,
    },
    country: {
      type: String,
      default: 'USA',
      index: true,
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number], // [lng, lat]
        default: [-74.006, 40.7128], // Default coordinates
      },
    },
    religion: {
      type: String,
      default: 'None',
    },
    relationshipGoal: {
      type: String,
      enum: ['Long-term', 'Casual', 'Friendship', 'Marriage'],
      default: 'Long-term',
    },
    lifestyle: {
      smoking: { type: String, enum: ['Never', 'Occasionally', 'Regularly'], default: 'Never' },
      drinking: { type: String, enum: ['Never', 'Socially', 'Regularly'], default: 'Socially' },
      exercise: { type: String, enum: ['Never', 'Sometimes', 'Often', 'Daily'], default: 'Sometimes' },
      diet: { type: String, enum: ['Anything', 'Vegetarian', 'Vegan', 'Keto', 'Halal'], default: 'Anything' },
      pets: { type: String, enum: ['None', 'Cat', 'Dog', 'Both', 'Lover'], default: 'Lover' },
    },
    personalityAnswers: [
      {
        questionNumber: { type: Number, required: true },
        answer: { type: Number, required: true, min: 1, max: 5 },
      },
    ],
    interests: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Interest',
        index: true,
      },
    ],
    preferences: {
      minAge: { type: Number, default: 18 },
      maxAge: { type: Number, default: 50 },
      gender: [{ type: String, default: ['Female'] }],
      maxDistanceKm: { type: Number, default: 100 },
      relationshipType: [{ type: String, default: ['Long-term'] }],
      interests: [{ type: Schema.Types.ObjectId, ref: 'Interest' }],
    },
    photos: [
      {
        url: { type: String, required: true },
        publicId: { type: String },
        isMain: { type: Boolean, default: false },
      },
    ],
  },
  { timestamps: true }
);

ProfileSchema.index({ location: '2dsphere' });

export const Profile = mongoose.model<IProfile>('Profile', ProfileSchema);
