// app/bookings/BookingsPageClient.tsx
"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import { LayoutWrapper } from "@/components/templates/LayoutWrapper"
import { BookingsHeader } from "@/components/molecules/BookingsHeader"
import { PanelSelector } from "@/components/molecules/PanelSelector"
import { TutorRegistrationMessage } from "@/components/molecules/TutorRegistrationMessage"
import { useBookings } from "@/hooks/data/useBookings"
import { useToast } from "@/hooks/ui/use-toast"
import { RefreshCw } from "lucide-react"

// Lazy load heavy components
const BookingsTabs = dynamic(() => import("@/components/organisms/BookingsTab").then(mod => ({ default: mod.BookingsTabs })), {
  loading: () => <div className="animate-pulse bg-gray-200 h-64 rounded-lg" />
})

const BookingCard = dynamic(() => import("@/components/organisms/BookingCard").then(mod => ({ default: mod.BookingCard })), {
  loading: () => <div className="animate-pulse bg-gray-200 h-48 rounded-lg" />
})

export function BookingsPageClient() {
  const { toast } = useToast()
  
  // State for UI controls
  const [activePanel, setActivePanel] = useState<"sent" | "received">("sent")
  const [activeTab, setActiveTab] = useState("pending")

  // Custom hook for all data management
  const {
    sentBookings,
    receivedBookings,
    isTutor,
    loading,
    sentError,
    receivedError,
    updatingStatus,
    refetchBookings,
    updateBookingStatus
  } = useBookings()

  // Handler functions
  const handleRefresh = async () => {
    toast({
      title: "Refreshing...",
      description: "Fetching latest booking data",
    })
    await refetchBookings()
    toast({
      title: "Refreshed",
      description: "Bookings data has been updated",
    })
  }

  const handleUpdateStatus = async (id: string, status: any, tutorComment?: string) => {
    try {
      await updateBookingStatus(id, status, tutorComment)
    } catch (error) {
      // Error handling is done in the hook
    }
  }

  // Determine current data based on active panel
  const currentBookings = Array.isArray(activePanel === "received" ? receivedBookings : sentBookings) 
    ? (activePanel === "received" ? receivedBookings : sentBookings)
    : []
  const currentError = activePanel === "received" ? receivedError : sentError

  // Render booking card
  const renderBookingCard = (booking: any) => (
    <BookingCard
      key={booking._id}
      booking={booking}
      type={activePanel === "received" ? "received" : "sent"}
      onUpdateStatus={handleUpdateStatus}
      updatingStatus={updatingStatus === booking._id}
    />
  )

  return (
    <LayoutWrapper>
      <div className="mb-6">
        <BookingsHeader onRefresh={handleRefresh} />
      </div>

      {!isTutor && activePanel === "received" && (
        <div className="mb-6">
          <TutorRegistrationMessage />
        </div>
      )}

      <div className="mb-6">
        <PanelSelector
          activePanel={activePanel}
          onPanelChange={setActivePanel}
          sentCount={sentBookings.length}
          receivedCount={receivedBookings.length}
          isTutor={isTutor}
        />
      </div>

      {currentError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
          <p className="font-semibold">Error loading bookings</p>
          <p className="text-sm">{currentError}</p>
        </div>
      )}

      <BookingsTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        activePanel={activePanel}
        bookings={currentBookings}
        loading={loading}
        error={currentError}
        onRefresh={handleRefresh}
        onUpdateStatus={handleUpdateStatus}
        updatingStatus={updatingStatus}
        renderBookingCard={renderBookingCard}
      />
    </LayoutWrapper>
  )
}

