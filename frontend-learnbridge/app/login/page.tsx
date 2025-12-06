// app/login/page.tsx
import type { Metadata } from 'next'
import { LoginPageClient } from './LoginPageClient'

export const metadata: Metadata = {
  title: "LearnBridge",
  description: "Sign in to your LearnBridge account to access tutors, resources, and more",
  robots: {
    index: false, // Login page shouldn't be indexed
    follow: false,
  },
}

export default function LoginPage() {
  return <LoginPageClient />
}
