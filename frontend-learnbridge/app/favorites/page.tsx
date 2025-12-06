// app/favorites/page.tsx
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { isAuthenticated } from '@/lib/server/auth'
import { FavoritesPageClient } from './FavoritesPageClient'

export const metadata: Metadata = {
  title: "LearnBridge",
  description: "View your favorite tutors and resources on LearnBridge",
  robots: {
    index: false, // Favorites are private
    follow: false,
  },
}

export default async function FavoritesPage() {
  // Server-side authentication check
  const authenticated = await isAuthenticated()
  
  if (!authenticated) {
    redirect('/login?redirect=/favorites')
  }

  return <FavoritesPageClient />
}
