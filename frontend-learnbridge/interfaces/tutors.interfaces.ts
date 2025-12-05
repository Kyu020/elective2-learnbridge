export interface Tutor {
  studentId: string
  name: string
  bio: string
  course: string[]
  hourlyRate: number
  availability: string[]
  credentials?: string
  favoriteCount: number
  createdAt?: string
  updatedAt?: string
}

export interface TutorFormData {
    bio: string
    course: string
    hourlyRate: string
    availability: string
    credentials?: string
}

export interface ScheduleFormData {
    sessionDate: string // possible change to Date
    time: string // possible change to Date
    duration: string //possible change to number
    price: string //possible change to number
    subject: string
    comment: string
}

export interface UserTutorStatus {
    isTutor: boolean
    hasTutorProfile: boolean
    userTutorProfile: Tutor | null
}