// app/bookings/page.tsx
"use client"

import { useState } from "react"
import { LayoutWrapper } from "@/components/templates/LayoutWrapper"
import { BookingsHeader } from "@/components/molecules/BookingsHeader"
import { PanelSelector } from "@/components/molecules/PanelSelector"
import { TutorRegistrationMessage } from "@/components/molecules/TutorRegistrationMessage"
import { BookingsTabs } from "@/components/organisms/BookingsTab"
import { BookingCard } from "@/components/organisms/BookingCard"
import { useBookings } from "@/hooks/data/useBookings"
import { useToast } from "@/hooks/ui/use-toast"
import { RefreshCw } from "lucide-react"

export default function BookingsPage() {
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
  const currentBookings = activePanel === "received" ? receivedBookings : sentBookings
  const currentError = activePanel === "received" ? receivedError : sentError

  // Filter bookings by status tab
  const filteredBookings = currentBookings.filter(booking => {
    if (activeTab === "all") return true;
    return booking.status === activeTab;
  });

  const showTutorRegistrationMessage = activePanel === "received" && !isTutor

  return (
    <LayoutWrapper>
      <div className="w-full max-w-full overflow-x-hidden">
        {/* Header Section */}
        <BookingsHeader 
          onRefresh={handleRefresh}
          refreshing={loading}
        />

        {/* Panel Selection */}
        <PanelSelector
          activePanel={activePanel}
          onPanelChange={setActivePanel}
          sentCount={sentBookings.length}
          receivedCount={receivedBookings.length}
          isTutor={isTutor}
        />

        {/* Tutor Registration Message */}
        {showTutorRegistrationMessage && (
          <TutorRegistrationMessage />
        )}

        {/* Bookings Tabs */}
        {!showTutorRegistrationMessage && (
          <div className="w-full">
            {/* Tabs */}
            <div className="flex space-x-1 border-b mb-6">
              {["pending", "accepted", "completed", "rejected", "cancelled", "all"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                    activeTab === tab
                      ? "bg-blue-50 text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  {tab !== "all" && (
                    <span className="ml-2 text-xs bg-gray-200 px-2 py-0.5 rounded-full">
                      {currentBookings.filter(b => b.status === tab).length}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Bookings List */}
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-12">
                  <RefreshCw className="h-8 w-8 animate-spin mx-auto text-gray-400" />
                  <p className="mt-2 text-gray-500">Loading bookings...</p>
                </div>
              ) : currentError ? (
                <div className="text-center py-12">
                  <p className="text-red-500">Error loading bookings: {currentError}</p>
                  <button
                    onClick={handleRefresh}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Retry
                  </button>
                </div>
              ) : filteredBookings.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">
                    No {activeTab !== "all" ? activeTab : ""} bookings found
                  </p>
                  {activeTab !== "all" && (
                    <button
                      onClick={() => setActiveTab("all")}
                      className="mt-2 text-sm text-blue-500 hover:text-blue-600"
                    >
                      View all bookings
                    </button>
                  )}
                </div>
              ) : (
                filteredBookings.map((booking) => (
                  <BookingCard
                    key={booking._id}
                    booking={booking}
                    type={activePanel}
                    onUpdateStatus={activePanel === "received" ? handleUpdateStatus : undefined}
                    updatingStatus={updatingStatus}
                  />
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </LayoutWrapper>
  )
}