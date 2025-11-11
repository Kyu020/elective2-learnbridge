export interface Resource {
  _id: string;
  title: string;
  program: string;
  googleDriveLink: string;
  uploader?: string;
  uploaderName?: string;
  createdAt: string;
  favoriteCount?: number;
}

export interface UploadResourceData {
    title: string;
    program: string;
    file: File;
}

export interface FavoriteAction {
    resourceId: string;
    action: 'add' | 'remove';
}