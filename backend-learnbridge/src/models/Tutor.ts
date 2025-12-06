// models/Tutor.ts
import mongoose, { Schema, Document } from "mongoose";

export interface ITutor extends Document {
  studentId: string;
  username: string;
  bio: string;
  course: string[];
  hourlyRate: number;
  availability: string[];
  favoriteCount: number;
  credentials?: string;
  ratingAverage: number;
  ratingCount: number;
  createdAt?: Date;
  
  profilePicture?: any;
  teachingLevel?: string;
  teachingStyle?: string;
  modeOfTeaching?: string;
  credibilityScore?: number;
  sessionsCompleted?: number;
  sessionsCancelled?: number;
  lastActiveAt?: Date;
  responseTime?: number;
  availabilitySlots?: any[];
}

const TutorSchema: Schema = new Schema(
  {
    studentId: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    bio: { type: String, required: true },
    course: { type: [String], required: true },
    hourlyRate: { type: Number, required: true },
    availability: { type: [String], required: true },
    favoriteCount: { type: Number, default: 0 },
    credentials: { type: String },
    ratingAverage: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
  },
  { 
    timestamps: true, 
    versionKey: false,
    strict: false
  }
);

export default mongoose.model<ITutor>("Tutor", TutorSchema);