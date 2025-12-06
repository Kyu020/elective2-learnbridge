// app/signup/page.tsx
import type { Metadata } from 'next'
import { SignupPageClient } from './SignupPageClient'

export const metadata: Metadata = {
  title: "LearnBridge",
  description: "Create your LearnBridge account to start learning with expert tutors",
  robots: {
    index: false, // Signup page shouldn't be indexed
    follow: false,
  },
}

export default function SignupPage() {
  return <SignupPageClient />
}
