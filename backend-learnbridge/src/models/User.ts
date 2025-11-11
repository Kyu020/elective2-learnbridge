import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
    username: string;
    studentId: string;
    email: string;
    program: string;
    specialization: string;
    isTutor: boolean;
    password: string;
    createdAt: Date;
}

const UserSchema: Schema = new Schema<IUser>({
    username: { type: String, required: true },
    studentId: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    program: { type: String, required: true },
    specialization: { type: String, required: true },
    isTutor: { type: Boolean, default: false },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
}, { versionKey: false } );

const User = mongoose.model<IUser>("User", UserSchema);
export default User;