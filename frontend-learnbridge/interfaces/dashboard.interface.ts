import { User } from './user.interface'
import { Resource } from './resource.interface'
import { Tutor } from './tutor.interface'

export interface DashboardData {
  user: User | null
  resources: Resource[]
  tutors: Tutor[]
}