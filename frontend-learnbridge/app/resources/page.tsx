// app/resources/page.tsx
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { isAuthenticated } from '@/lib/server/auth'
import { fetchResources } from '@/lib/server/data'
import { ResourcesPageClient } from './ResourcesPageClient'

export const metadata: Metadata = {
  title: "LearnBridge",
  description: "Browse and access quality learning resources on LearnBridge. Share and discover study materials, notes, and textbooks.",
  keywords: ["learning resources", "study materials", "academic resources", "notes", "textbooks", "educational content"],
  openGraph: {
    title: "LearnBridge",
    description: "Browse and access quality learning resources",
    type: "website",
  },
}

export default async function ResourcesPage() {
  // Server-side authentication check
  const authenticated = await isAuthenticated()
  
  if (!authenticated) {
    redirect('/login?redirect=/resources')
  }

  // Pre-fetch resources data on server (ISR)
  const initialResources = await fetchResources()

  return <ResourcesPageClient initialResources={initialResources} />
}
