import { BaseEntity } from './common.interface'
import { StudentInfo, TutorInfo } from './user.interface'

export type BookingStatus = 'pending' | 'accepted' | 'completed' | 'rejected' | 'cancelled'

export interface Booking extends BaseEntity {
  studentId: string
  tutorId: string
  sessionDate: string
  duration: number
  price: number
  course: string
  subject?: string // Keep for backward compatibility
  comment: string
  tutorComment?: string
  status: BookingStatus
  studentInfo?: StudentInfo
  tutorInfo?: TutorInfo
}

export interface BookingsData {
  sentBookings: Booking[]
  receivedBookings: Booking[]
  isTutor: boolean
}

export interface ScheduleFormData {
  sessionDate: string
  time: string
  duration: string
  price: string
  course: string
  subject?: string // Keep for backward compatibility
  comment: string
}