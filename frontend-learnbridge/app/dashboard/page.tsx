import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getServerUser, isAuthenticated } from '@/lib/server/auth'
import { fetchDashboardData } from '@/lib/server/data'
import { DashboardClient } from './DashboardClient'

export const metadata: Metadata = {
  title: "LearnBridge",
  description: "Your LearnBridge dashboard - view your resources, tutors, and quick actions",
  robots: {
    index: false,
    follow: false,
  },
}

export default async function DashboardPage() {
  const authenticated = await isAuthenticated()
  
  if (!authenticated) {
    redirect('/login?redirect=/dashboard')
  }

  const initialData = await fetchDashboardData()
  const serverUser = await getServerUser()

  return <DashboardClient initialData={initialData} serverUser={serverUser} />
}

