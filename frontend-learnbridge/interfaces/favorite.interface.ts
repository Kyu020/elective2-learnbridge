import { BaseEntity } from './common.interface'
import { Resource } from './resource.interface'
import { Tutor } from './tutor.interface'

export interface FavoriteResource {
  _id: string
  title: string
  program: string
  googleDriveLink: string
  uploader?: string
  createdAt: string
}

export interface FavoriteTutor {
  _id: string
  name: string
  bio: string
  subjects: string[]
  hourlyRate: number
  studentId: string
  credentials?: string
}

export interface FavoriteItem extends BaseEntity {
  tutorId?: string
  resourceId?: string
  tutor?: FavoriteTutor | Tutor
  resource?: FavoriteResource | Resource
}

export interface FavoritesResponse {
  favorites: FavoriteItem[]
}

export interface RemoveFavoriteRequest {
  tutorId?: string
  resourceId?: string
}