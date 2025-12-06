// lib/server/auth.ts
import { cookies, headers } from 'next/headers'

export interface ServerUser {
  _id: string
  username: string
  studentId: string
  email: string
  program: string
  specialization?: string
  isTutor: boolean
  profilePicture?: {
    url: string
    publicId: string
  }
}

/**
 * Get authentication token from server-side
 */
export async function getServerToken(): Promise<string | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value
    
    if (token) return token
    
    // Fallback to headers
    const headersList = await headers()
    const authHeader = headersList.get('authorization')
    if (authHeader?.startsWith('Bearer ')) {
      return authHeader.replace('Bearer ', '')
    }
    
    return null
  } catch (error) {
    console.error('Error getting server token:', error)
    return null
  }
}

/**
 * Fetch user data from server-side
 */
export async function getServerUser(): Promise<ServerUser | null> {
  try {
    const token = await getServerToken()
    
    if (!token) return null

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
    
    // Try /auth/me endpoint
    let response = await fetch(`${baseUrl}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store' // Always fetch fresh data
    })

    // If /auth/me doesn't work, try profile endpoint
    if (!response.ok && response.status !== 404) {
      response = await fetch(`${baseUrl}/profile/getprofile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        cache: 'no-store'
      })
    }

    if (response.ok) {
      const data = await response.json()
      const userData = data.user || data.data || data.body
      
      if (userData) {
        return {
          _id: userData.userId || userData._id || '',
          username: userData.username || userData.name || '',
          studentId: userData.studentId || '',
          email: userData.email || '',
          program: userData.program || '',
          specialization: userData.specialization,
          isTutor: userData.isTutor || false,
          profilePicture: userData.profilePicture
        }
      }
    }
    
    return null
  } catch (error) {
    console.error('Error fetching server user:', error)
    return null
  }
}

/**
 * Check if user is authenticated on server-side
 */
export async function isAuthenticated(): Promise<boolean> {
  const token = await getServerToken()
  return !!token
}

