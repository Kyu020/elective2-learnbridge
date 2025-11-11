import mongoose, { Document, Schema } from 'mongoose';

export interface IUpload extends Document{
    title: string;
    program: string;
    uploader: string;
    favoriteCount: number;
    googleDriveFileId: string;
    googleDriveLink: string;
    createdAt: Date;
}

export const UploadSchema: Schema = new Schema({
    title: { type: String, required: true },
    program: { type: String, required: true },
    uploader: { type: String, required: true },
    favoriteCount: { type: Number, default: 0 },
    googleDriveFileId: { type: String, required: true },
    googleDriveLink: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IUpload>('Upload', UploadSchema);