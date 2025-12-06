// app/tutors/[studentId]/page.tsx
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { notFound } from 'next/navigation'
import { isAuthenticated } from '@/lib/server/auth'
import { fetchTutorProfile } from '@/lib/server/data'
import { TutorProfilePageClient } from './TutorProfilePageClient'

interface TutorProfilePageProps {
  params: Promise<{ studentId: string }>
}

export async function generateMetadata({ params }: TutorProfilePageProps): Promise<Metadata> {
  const { studentId } = await params
  const tutor = await fetchTutorProfile(studentId)
        
  if (!tutor) {
    return {
            title: "LearnBridge", 
            description: "The requested tutor profile could not be found", 
    }
  }

  return {
    title: "LearnBridge",
    description: tutor.bio || `View ${tutor.name}'s tutor profile on LearnBridge`,
    keywords: [
      tutor.name || '',
      "tutor",
      "tutoring",
      ...(Array.isArray(tutor.course) ? tutor.course : [])
    ].filter(Boolean),
    openGraph: {
      title: "LearnBridge",
      description: tutor.bio || `Learn from ${tutor.name}`,
      type: "profile",
    },
  }
}

export default async function TutorProfilePage({ params }: TutorProfilePageProps) {
  const { studentId } = await params
  
  // Server-side authentication check
  const authenticated = await isAuthenticated()
  
  if (!authenticated) {
    redirect(`/login?redirect=/tutors/${studentId}`)
  }

  // Pre-fetch tutor profile on server (ISR)
  const tutor = await fetchTutorProfile(studentId)

  if (!tutor) {
    notFound()
  }

  return <TutorProfilePageClient initialTutor={tutor} studentId={studentId} />
}
