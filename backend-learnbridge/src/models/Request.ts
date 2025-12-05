// models/Request.ts
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
  updatedAt?: Date;
  
  course?: string;
  modality?: "online" | "in-person";
  meetingId?: string;
  roomId?: string;
  meetingUrl?: string;
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
    
    course: { type: String },
    modality: {
      type: String,
      enum: ["online", "in-person"]
    },
    meetingId: { type: String },
    roomId: { type: String },
    meetingUrl: { type: String }
  },
  { timestamps: true, versionKey: false }
);

RequestSchema.pre('save', function(next) {
  if (this.course && !this.subject) {
    this.subject = this.course;
  }
  
  if (this.subject && !this.course) {
    this.course = this.subject;
  }
  
  if (!this.modality) {
    this.modality = "online";
  }
  
  next();
});

RequestSchema.index({ studentId: 1, status: 1 });
RequestSchema.index({ tutorId: 1, status: 1 });
RequestSchema.index({ sessionDate: 1 });
RequestSchema.index({ status: 1 });

RequestSchema.virtual('statusDescription').get(function() {
  const descriptions: Record<string, string> = {
    pending: 'Waiting for tutor response',
    accepted: 'Tutor accepted the request',
    scheduled: 'Session is scheduled',
    completed: 'Session completed',
    cancelled: 'Session cancelled',
    rejected: 'Tutor rejected the request'
  };
  return descriptions[this.status] || this.status;
});

export default mongoose.model<IRequest>("Request", RequestSchema);