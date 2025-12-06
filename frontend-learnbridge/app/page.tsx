// app/page.tsx - Home/Landing Page
import type { Metadata } from 'next'
import { HomePageClient } from './HomePageClient'

export const metadata: Metadata = {
  title: "LearnBridge",
  description: "LearnBridge - Connect with expert tutors and access quality learning resources. Peer-to-peer tutoring platform for students.",
  keywords: ["tutoring", "learning platform", "online education", "student tutors", "academic resources"],
  openGraph: {
    title: "LearnBridge",
    description: "Connect with expert tutors and access quality learning resources",
    type: "website",
  },
}

export default function Home() {
  return <HomePageClient />
}
