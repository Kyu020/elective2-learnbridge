// app/dashboard/DashboardClient.tsx
"use client"

import { useEffect } from "react"
import dynamic from "next/dynamic"
import { LayoutWrapper } from "@/components/templates/LayoutWrapper"
import { WelcomeBanner } from "@/components/molecules/WelcomeBanner"
import { StatsSection } from "@/components/molecules/StatsSection"
import { PageLoader } from "@/components/ui/loading-spinner"
import { useDashboardData } from "@/hooks/data/useDashboard"
import { useToastNotifications } from "@/hooks/ui/useToastNotifications"

// Lazy load heavy components
const QuickActions = dynamic(() => import("@/components/organisms/QuickActions").then(mod => ({ default: mod.QuickActions })), {
  loading: () => <div className="animate-pulse bg-gray-200 h-32 rounded-lg" />
})

const ResourcesSection = dynamic(() => import("@/components/organisms/ResourcesSection").then(mod => ({ default: mod.ResourcesSection })), {
  loading: () => <div className="animate-pulse bg-gray-200 h-64 rounded-lg" />
})

const TutorsSection = dynamic(() => import("@/components/organisms/TutorsSection").then(mod => ({ default: mod.TutorsSection })), {
  loading: () => <div className="animate-pulse bg-gray-200 h-64 rounded-lg" />
})

interface DashboardClientProps {
  initialData?: {
    user: any
    resources: any[]
    tutors: any[]
  } | null
  serverUser?: any
}

export function DashboardClient({ initialData, serverUser }: DashboardClientProps) {
  const { user, resources, tutors, loading } = useDashboardData(initialData)
  
  // Handle toast notifications for empty states
  useToastNotifications({ loading, resources, tutors })

  // Use server user if available
  const displayUser = user || serverUser

  if (loading && !initialData) {
    return (
      <LayoutWrapper>
        <PageLoader />
      </LayoutWrapper>
    )
  }

  return (
    <LayoutWrapper>
      <WelcomeBanner username={displayUser?.username} />
      
      <div className="mb-6 lg:mb-8">
        <h2 className="mb-3 sm:mb-4 text-lg sm:text-xl font-semibold text-foreground">
          Quick Actions
        </h2>
        <QuickActions />
      </div>

      <StatsSection resources={resources || []} tutors={tutors || []} />

      <div className="grid gap-6 lg:gap-8 lg:grid-cols-2">
        <ResourcesSection resources={resources || []} />
        <TutorsSection tutors={tutors || []} />
      </div>
    </LayoutWrapper>
  )
}

