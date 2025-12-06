// app/profile/page.tsx
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { isAuthenticated, getServerUser } from '@/lib/server/auth'
import { ProfilePageClient } from './ProfilePageClient'

export const metadata: Metadata = {
  title: "LearnBridge",
  description: "View and edit your LearnBridge profile",
  robots: {
    index: false, // Profile is private
    follow: false,
  },
}

export default async function ProfilePage() {
  // Server-side authentication check
  const authenticated = await isAuthenticated()
  
  if (!authenticated) {
    redirect('/login?redirect=/profile')
  }

  // Pre-fetch user data on server
  const serverUser = await getServerUser()

  return <ProfilePageClient initialUser={serverUser} />
}
