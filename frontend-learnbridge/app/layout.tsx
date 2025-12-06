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
  title: "LearnBridge - Your Learning Platform",
  description: "Connect with expert tutors and access quality learning resources",
  generator: "Satoshii",
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