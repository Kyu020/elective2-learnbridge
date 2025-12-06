// contexts/AuthContext.tsx
"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

interface EarnedBadge {
  _id: string
  badgeId: {
    _id: string
    name: string
    description: string
    icon: string
    rarity: 'common' | 'rare' | 'epic' | 'legendary'
    criteria: {
      type: string
      threshold: number
      consecutive?: boolean
    }
    rewards: {
      points: number
      perks: string[]
    }
    role: 'student' | 'tutor' | 'both'
    createdAt: string
    updatedAt: string
    __v: number
  }
  earnedAt: string
}

interface UserProfile {
  _id: string
  username: string
  studentId: string
  email: string
  program: string
  specialization?: string
  isTutor: boolean
  learningInterests: string[]
  learningLevel: string
  preferredMode: string
  availability: string[]
  createdAt: string
  profilePicture?: {
    url: string
    publicId: string
  }
  earnedBadges?: EarnedBadge[]
  budgetRange?: {
    min: number
    max: number
  }
}

interface AuthContextType {
  user: UserProfile | null
  isLoading: boolean
  login: (token: string, userData: UserProfile) => void
  refreshUser: () => Promise<UserProfile | null>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const login = (token: string, userData: UserProfile) => {
    localStorage.setItem('token', token)
    setUser(userData)
    setIsLoading(false)
    window.dispatchEvent(new Event('authChange'))
  }

  const fetchUserProfile = async (): Promise<UserProfile | null> => {
    try {
      // Check if we're in the browser
      if (typeof window === 'undefined') {
        setIsLoading(false)
        return null
      }

      const token = localStorage.getItem('token')
      
      if (!token) {
        setUser(null)
        setIsLoading(false)
        return null
      }

      // Try /auth/me endpoint first (from authController)
      let response = await fetch("http://localhost:5000/api/auth/me", {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      })
      
      // If /auth/me doesn't work, try profile endpoint
      if (!response.ok && response.status !== 404) {
        response = await fetch("http://localhost:5000/api/profile/getprofile", {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          credentials: 'include'
        })
      }
      
      if (response.ok) {
        const data = await response.json()
        const userData = data.user || data.data || data.body
        
        if (userData) {
          // Transform user data to match UserProfile interface
          const userProfile: UserProfile = {
            _id: userData.userId || userData._id || "",
            username: userData.username || userData.name || "",
            studentId: userData.studentId || "",
            email: userData.email || "",
            program: userData.program || "",
            specialization: userData.specialization || "",
            isTutor: userData.isTutor || false,
            learningInterests: userData.learningInterests || [],
            learningLevel: userData.learningLevel || "",
            preferredMode: userData.preferredMode || "",
            availability: userData.availability || [],
            createdAt: userData.createdAt || new Date().toISOString(),
            profilePicture: userData.profilePicture,
            earnedBadges: userData.earnedBadges || [],
            budgetRange: userData.budgetRange
          }
          
          setUser(userProfile)
          return userProfile
        }
      }
      
      // If response is not ok or no user data, check if token is invalid
      if (response.status === 401 || response.status === 403) {
        // Token is invalid, remove it
        localStorage.removeItem('token')
        setUser(null)
        return null
      }
      
      // For other errors, keep the token but clear user
      setUser(null)
      return null
    } catch (error) {
      console.error('Error fetching user profile:', error)
      // Don't remove token on network errors, just clear user
      setUser(null)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const refreshUser = async (): Promise<UserProfile | null> => {
    return await fetchUserProfile()
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
    window.dispatchEvent(new Event('authChange'))
  }

  // Listen for storage changes (when login/logout happens in other tabs/windows)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'token') {
        fetchUserProfile()
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  // Listen for custom auth change events
  useEffect(() => {
    const handleAuthChange = () => {
      fetchUserProfile()
    }

    window.addEventListener('authChange', handleAuthChange)
    return () => window.removeEventListener('authChange', handleAuthChange)
  }, [])

  // Initial fetch on component mount
  useEffect(() => {
    fetchUserProfile()
  }, [])

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      login,
      refreshUser, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}