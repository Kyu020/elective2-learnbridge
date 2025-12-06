import { BaseEntity } from './common.interface'

export interface Review extends BaseEntity {
  studentId: string
  tutorId: string
  rating: number
  comment: string
  studentName: string
}

export interface ReviewFormData {
  rating: number
  comment: string
}