import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Suspense } from "react"
import { ScrollToTop } from "@/components/atoms/ScrollToTop"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"
import { AuthProvider } from "@/contexts/authContext"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
  title: "LearnBridge",
  description: "Connect with expert tutors and access quality learning resources. LearnBridge bridges learners with tutors for efficient and effective learning experiences.",
  keywords: ["tutoring", "learning", "education", "online tutoring", "academic resources", "student tutors"],
  authors: [{ name: "LearnBridge Team" }],
  creator: "LearnBridge",
  publisher: "LearnBridge",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "LearnBridge",
    title: "LearnBridge - Your Learning Platform",
    description: "Connect with expert tutors and access quality learning resources",
    images: [
      {
        url: "/logo.jpg",
        width: 1200,
        height: 630,
        alt: "LearnBridge Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LearnBridge - Your Learning Platform",
    description: "Connect with expert tutors and access quality learning resources",
    images: ["/logo.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Add your verification codes here when available
    // google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">
        <ScrollToTop />
        <Suspense fallback={<div>Loading...</div>}>
          <AuthProvider>{children}</AuthProvider>
        </Suspense>
        <Toaster />
      </body>
    </html>
  )
}