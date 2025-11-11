import mongoose, { Schema, Document } from "mongoose";

export interface ITutor extends Document {
  studentId: string;
  name: string;
  bio: string;
  subjects: string[];
  hourlyRate: number;
  availability: string[];
  favoriteCount: number;
  credentials?: string;
  ratingAverage: number;
  ratingCount: number;
  createdAt?: Date;
}

const TutorSchema: Schema = new Schema(
  {
    studentId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    bio: { type: String, required: true },
    subjects: { type: [String], required: true },
    hourlyRate: { type: Number, required: true },
    availability: { type: [String], required: true },
    favoriteCount: { type: Number, default: 0 },
    credentials: { type: String },
    ratingAverage: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
  },
  { timestamps: true, versionKey: false }
);

export default mongoose.model<ITutor>("Tutor", TutorSchema);
