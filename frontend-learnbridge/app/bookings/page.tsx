import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { isAuthenticated } from '@/lib/server/auth'
import { BookingsPageClient } from './BookingsPageClient'

export const metadata: Metadata = {
  title: "LearnBridge",
  description: "View and manage your tutoring session bookings on LearnBridge",
  robots: {
    index: false,
    follow: false,
  },
}

export default async function BookingsPage() {
  const authenticated = await isAuthenticated()
  
  if (!authenticated) {
    redirect('/login?redirect=/bookings')
  }

  return <BookingsPageClient />
}

