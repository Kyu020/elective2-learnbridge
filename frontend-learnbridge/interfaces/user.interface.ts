import { BaseEntity } from './common.interface'

export interface User extends BaseEntity {
  username: string
  email: string
  role: string
}

export interface StudentInfo extends ProfileUser {
  // Inherits all from User interface
}

export interface TutorInfo extends ProfileUser {
  // Inherits all from User interface
}

export interface ProfileUser {
  _id?: string
  username: string
  name?: string // For frontend compatibility (mapped from username)
  email: string
  program: string
  specialization?: string
  isTutor?: boolean
  profilePicture: {
    url: string
    publicId?: string
    format?: string
    bytes?: number
  } | null
  earnedBadges?: any[]
  budgetRange?: {
    min: number
    max: number
  }
  learningInterests?: string[]
  learningLevel?: string
  preferredMode?: string
  availability?: string[]
}