import { BaseEntity } from './common.interface'

export interface Resource extends BaseEntity {
  title: string
  course: string
  googleDriveLink: string
  uploader?: string
  uploaderName?: string
  program?: string
  difficulty?: string
  favoriteCount?: number
  description?: string // Added for dashboard interface
}

// For upload form
export interface UploadResourceData {
  title: string
  course: string
  file: File
}

// For favorite actions
export interface FavoriteAction {
  resourceId: string
  action: 'add' | 'remove'
}