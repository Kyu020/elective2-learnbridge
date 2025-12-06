import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { isAuthenticated } from '@/lib/server/auth'
import { ProgressPageClient } from './ProgressPageClient'

export const metadata: Metadata = {
  title: "LearnBridge",
  description: "Track your learning progress and achievements on LearnBridge",
  robots: {
    index: false,
    follow: false,
  },
}

export default async function ProgressPage() {
  const authenticated = await isAuthenticated()
  
  if (!authenticated) {
    redirect('/login?redirect=/progress')
  }

  return <ProgressPageClient />
}
