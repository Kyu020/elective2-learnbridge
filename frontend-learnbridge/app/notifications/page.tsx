import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { isAuthenticated } from '@/lib/server/auth'
import { NotificationsPageClient } from './NotificationsPageClient'

export const metadata: Metadata = {
  title: "LearnBridge",
  description: "View your notifications and updates on LearnBridge",
  robots: {
    index: false,
    follow: false,
  },
}

export default async function NotificationsPage() {
  const authenticated = await isAuthenticated()
  
  if (!authenticated) {
    redirect('/login?redirect=/notifications')
  }

  return <NotificationsPageClient />
}
