"use client"

import { LayoutWrapper } from "@/components/templates/LayoutWrapper"
import { QuickActions } from "@/components/organisms/QuickActions"
import { StatsSection } from "@/components/molecules/StatsSection"
import { ResourcesSection } from "@/components/organisms/ResourcesSection"
import { TutorsSection } from "@/components/organisms/TutorsSection"
import { WelcomeBanner } from "@/components/molecules/WelcomeBanner"
import { PageLoader } from "@/components/ui/loading-spinner"
import { useDashboardData } from "@/hooks/data/useDashboard"
import { useToastNotifications } from "@/hooks/ui/useToastNotifications"

export default function DashboardPage() {
  const { user, resources, tutors, loading } = useDashboardData();
  
  // Handle toast notifications for empty states
  useToastNotifications({ loading, resources, tutors });

  if (loading) {
    return (
      <LayoutWrapper>
        <PageLoader />
      </LayoutWrapper>
    );
  }

  return (
    <LayoutWrapper>
      <WelcomeBanner username={user?.username} />
      
      <div className="mb-6 lg:mb-8">
        <h2 className="mb-3 sm:mb-4 text-lg sm:text-xl font-semibold text-foreground">
          Quick Actions
        </h2>
        <QuickActions />
      </div>

      <StatsSection resources={resources} tutors={tutors} />

      <div className="grid gap-6 lg:gap-8 lg:grid-cols-2">
        <ResourcesSection resources={resources} />
        <TutorsSection tutors={tutors} />
      </div>
    </LayoutWrapper>
  )
}