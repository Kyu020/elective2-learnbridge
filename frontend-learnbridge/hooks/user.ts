// hooks/user.ts
import api from "@/lib/axios"

export interface UserData {
  _id: string
  username: string
  studentId: string
  email: string
  program: string
  specialization?: string
  isTutor: boolean
  learningInterests?: string[]
  learningLevel?: string
  preferredMode?: string
  availability?: any[]
  earnedBadges?: Array<{
    badgeId: any
    earnedAt: string
    _id: string
  }>
  profilePicture?: {
    url: string
    format: string
    bytes: number
  }
  budgetRange?: {
    min: number
    max: number
  }
  createdAt?: string
}

export async function fetchCurrentUser(): Promise<UserData | null> {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
  if (!token) return null

  const res = await api.get("/auth/me", {
    headers: { Authorization: `Bearer ${token}` },
  })
  return res?.data?.user ?? null
}

export async function logoutUser(): Promise<void> {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
  if (!token) {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token")
      localStorage.removeItem("studentId")
    }
    return
  }

  await api.post("/auth/logout", {}, { headers: { Authorization: `Bearer ${token}` } })
  if (typeof window !== "undefined") {
    localStorage.removeItem("token")
    localStorage.removeItem("studentId")
  }
}