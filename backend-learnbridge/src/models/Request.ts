import mongoose, { Document, Schema } from "mongoose";

export interface IRequest extends Document {
  studentId: string;
  tutorId: string;
  subject: string;
  sessionDate: Date;
  duration: number;
  price?: number;
  comment: string;
  tutorComment?: string;
  status: "pending" | "accepted" | "completed" | "cancelled" | "rejected";
  rating?: number;
  review?: string;
  tutorSeen: boolean;
  studentSeen: boolean;
  createdAt?: Date;
}

const RequestSchema: Schema<IRequest> = new Schema(
  {
    studentId: { type: String, ref: "User", required: true },
    tutorId: { type: String, ref: "Tutor", required: true },
    subject: { type: String, required: true },
    sessionDate: { type: Date, required: true },
    duration: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true },
    comment: { type: String, required: true },
    tutorComment: { type: String },
    status: {
      type: String,
      enum: ["pending", "accepted", "scheduled", "completed", "cancelled", "rejected"],
      default: "pending",
    },
    rating: { type: Number, min: 1, max: 5 },
    review: { type: String },
    tutorSeen: { type: Boolean, default: false },
    studentSeen: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false }
);

export default mongoose.model<IRequest>("Request", RequestSchema);
