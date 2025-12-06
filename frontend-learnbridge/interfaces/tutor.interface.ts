import { BaseEntity } from './common.interface'
import { Review } from './review.interface'

export interface Tutor extends BaseEntity {
  studentId: string
  name: string
  bio: string
  course: string[]
  hourlyRate: number
  availability: string[]
  credentials?: string
  rating?: number
  ratingAverage?: number
  ratingCount?: number
  reviews?: number
  isAvailable?: boolean
  favoriteCount: number
  teachingLevel?: string
  teachingStyle?: string
  modeOfTeaching?: 'online' | 'in-person' | 'either'
  profilePicture?: any
  credibilityScore?: number
  sessionsCompleted?: number
  sessionsCancelled?: number
  availabilitySlots?: any[]
}

// For tutor registration/update form
export interface TutorFormData {
  bio: string
  course: string[]
  hourlyRate: string
  availability: string
  credentials?: string
  teachingLevel?: string
  teachingStyle?: string
  modeOfTeaching?: 'online' | 'in-person' | 'either'
}

// For tutor profile page
export interface TutorProfileData {
  tutor: Tutor | null
  reviews: Review[]
  userReview: Review | null
  favorites: Set<string>
  averageRating: number
  ratingCounts: Array<{ rating: number; count: number }>
}

export interface UserTutorStatus {
  isTutor: boolean
  hasTutorProfile: boolean
  userTutorProfile: Tutor | null
}