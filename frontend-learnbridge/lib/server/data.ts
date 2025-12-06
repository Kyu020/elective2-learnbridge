// lib/server/data.ts
import { getServerToken } from './auth'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

/**
 * Server-side fetch with authentication
 */
async function fetchWithAuth<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = await getServerToken()
  
  if (!token) {
    throw new Error('No authentication token found')
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
    cache: options.cache || 'no-store', // Default to no-store for authenticated requests
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return response.json()
}

/**
 * Fetch dashboard data (resources, tutors, user)
 */
export async function fetchDashboardData() {
  try {
    const token = await getServerToken()
    if (!token) return null

    const [userRes, resourcesRes, tutorsRes] = await Promise.all([
      fetch(`${BASE_URL}/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` },
        cache: 'no-store'
      }).catch(() => null),
      fetch(`${BASE_URL}/upload/getallfile`, {
        headers: { 'Authorization': `Bearer ${token}` },
        next: { revalidate: 60 } // Revalidate every 60 seconds (ISR)
      }).catch(() => null),
      fetch(`${BASE_URL}/tutor/getalltutor`, {
        headers: { 'Authorization': `Bearer ${token}` },
        next: { revalidate: 60 } // Revalidate every 60 seconds (ISR)
      }).catch(() => null)
    ])

    const user = userRes?.ok ? (await userRes.json()).user : null
    const resources = resourcesRes?.ok ? (await resourcesRes.json()).resources || [] : []
    const rawTutors = tutorsRes?.ok ? (await tutorsRes.json()).tutors || [] : []
    
    // Map tutors to ensure course field is properly set
    const tutors = rawTutors.map((tutor: any) => {
      const courses = Array.isArray(tutor.course) ? tutor.course : [];
      return {
        ...tutor,
        course: courses,
        studentId: tutor.studentId || tutor._id || "",
        name: tutor.name || tutor.username || "Unknown Tutor",
      };
    });

    return { user, resources, tutors }
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    return null
  }
}

/**
 * Fetch tutors list
 */
export async function fetchTutors() {
  try {
    const token = await getServerToken()
    if (!token) return []

    const response = await fetch(`${BASE_URL}/tutor/getalltutor`, {
      headers: { 'Authorization': `Bearer ${token}` },
      next: { revalidate: 60 } // ISR: Revalidate every 60 seconds
    })

    if (!response.ok) return []
    
    const data = await response.json()
    const rawTutors = data.tutors || []
    
    // Map tutors to ensure course field is properly set
    return rawTutors.map((tutor: any) => {
      const courses = Array.isArray(tutor.course) ? tutor.course : [];
      return {
        ...tutor,
        course: courses,
        studentId: tutor.studentId || tutor._id || "",
        name: tutor.name || tutor.username || "Unknown Tutor",
      };
    })
  } catch (error) {
    console.error('Error fetching tutors:', error)
    return []
  }
}

/**
 * Fetch resources list
 */
export async function fetchResources() {
  try {
    const token = await getServerToken()
    if (!token) return []

    const response = await fetch(`${BASE_URL}/upload/getallfile`, {
      headers: { 'Authorization': `Bearer ${token}` },
      next: { revalidate: 60 } // ISR: Revalidate every 60 seconds
    })

    if (!response.ok) return []
    
    const data = await response.json()
    return data.resources || []
  } catch (error) {
    console.error('Error fetching resources:', error)
    return []
  }
}

/**
 * Fetch single tutor profile
 */
export async function fetchTutorProfile(studentId: string) {
  try {
    const token = await getServerToken()
    if (!token) return null

    const response = await fetch(`${BASE_URL}/tutor/gettutor/${studentId}`, {
      headers: { 'Authorization': `Bearer ${token}` },
      next: { revalidate: 300 } // ISR: Revalidate every 5 minutes
    })

    if (!response.ok) return null
    
    const data = await response.json()
    const tutor = data.data || null
    
    if (tutor) {
      // Map tutor to ensure course field is properly set
      const courses = Array.isArray(tutor.course) ? tutor.course : [];
      return {
        ...tutor,
        course: courses,
        studentId: tutor.studentId || tutor._id || "",
        name: tutor.name || tutor.username || "Unknown Tutor",
      };
    }
    
    return null
  } catch (error) {
    console.error('Error fetching tutor profile:', error)
    return null
  }
}

