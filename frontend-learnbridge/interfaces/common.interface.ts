export interface BaseEntity {
  _id: string
  createdAt: string
  updatedAt?: string
}

export interface UserBase extends BaseEntity {
  username: string
  email: string
  program: string
  specialization?: string
}

export interface Timestamps {
  createdAt: string
  updatedAt: string
}