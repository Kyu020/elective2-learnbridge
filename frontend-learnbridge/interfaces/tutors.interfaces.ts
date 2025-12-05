// interfaces/tutors.interfaces.ts
export interface Tutor {
  studentId: string
  name: string
  bio: string
  course: string[]  // Only use course, not subjects
  hourlyRate: number
  availability: string[]
  credentials?: string
  favoriteCount: number
  createdAt?: string
  updatedAt?: string
  teachingLevel?: string
  teachingStyle?: string
  modeOfTeaching?: "online" | "in-person" | "either"
  profilePicture?: any
  ratingAverage?: number
  ratingCount?: number
  credibilityScore?: number
  sessionsCompleted?: number
  sessionsCancelled?: number
  availabilitySlots?: any[]
}

export interface TutorFormData {
    bio: string
    course: string[]
    hourlyRate: string
    availability: string
    credentials?: string
    teachingLevel?: string
    teachingStyle?: string
    modeOfTeaching?: "online" | "in-person" | "either"
}

export interface ScheduleFormData {
    sessionDate: string
    time: string
    duration: string
    price: string
    subject: string
    comment: string
}

export interface UserTutorStatus {
    isTutor: boolean
    hasTutorProfile: boolean
    userTutorProfile: Tutor | null
}