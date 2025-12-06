// app/tutors/page.tsx
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { isAuthenticated } from '@/lib/server/auth'
import { fetchTutors } from '@/lib/server/data'
import { TutorsPageClient } from './TutorsPageClient'

export const metadata: Metadata = {
  title: "LearnBridge",
  description: "Browse and connect with expert tutors on LearnBridge. Find tutors for your subjects and schedule sessions.",
  keywords: ["tutors", "tutoring", "find tutor", "online tutoring", "academic help"],
  openGraph: {
    title: "LearnBridge",
    description: "Browse and connect with expert tutors",
    type: "website",
  },
}

export default async function TutorsPage() {
  // Server-side authentication check
  const authenticated = await isAuthenticated()
  
  if (!authenticated) {
    redirect('/login?redirect=/tutors')
  }

  // Pre-fetch tutors data on server (ISR)
  const initialTutors = await fetchTutors()

  return <TutorsPageClient initialTutors={initialTutors} />
}
