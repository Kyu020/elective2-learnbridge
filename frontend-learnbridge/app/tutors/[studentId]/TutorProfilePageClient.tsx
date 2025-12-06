// app/tutors/[studentId]/TutorProfilePageClient.tsx
"use client"

import { useEffect, useMemo, useState } from "react"
import dynamic from "next/dynamic"
import { useRouter } from "next/navigation"
import { LayoutWrapper } from "@/components/templates/LayoutWrapper"
import { PageLoader } from "@/components/ui/loading-spinner"
import { Tutor } from "@/interfaces/tutor.interface"
import { useTutorProfile } from "@/hooks/data/useTutorProfile"
import { ScheduleFormData } from "@/interfaces/booking.interface"

// Lazy load heavy components
const TutorProfileHeader = dynamic(() => import("@/components/organisms/TutorProfileHeader").then(mod => ({ default: mod.TutorProfileHeader })), {
  loading: () => <div className="animate-pulse bg-gray-200 h-64 rounded-lg" />
})

const TutorSidebar = dynamic(() => import("@/components/organisms/TutorSidebar").then(mod => ({ default: mod.TutorSidebar })), {
  loading: () => <div className="animate-pulse bg-gray-200 h-96 rounded-lg" />
})

const TutorInfoSection = dynamic(() => import("@/components/organisms/TutorInfoSection").then(mod => ({ default: mod.TutorInfoSection })), {
  loading: () => <div className="animate-pulse bg-gray-200 h-64 rounded-lg" />
})

const ReviewSection = dynamic(() => import("@/components/organisms/ReviewSection").then(mod => ({ default: mod.ReviewSection })), {
  loading: () => <div className="animate-pulse bg-gray-200 h-64 rounded-lg" />
})

const ScheduleSessionDialog = dynamic(() => import("@/components/organisms/ScheduleSessionDialog").then(mod => ({ default: mod.ScheduleSessionDialog })), {
  ssr: false
})

const TutorProfileDialog = dynamic(() => import("@/components/organisms/TutorProfileDialog").then(mod => ({ default: mod.TutorProfileDialog })), {
  ssr: false
})

interface TutorProfilePageClientProps {
  initialTutor: Tutor
  studentId: string
}

export function TutorProfilePageClient({ initialTutor, studentId }: TutorProfilePageClientProps) {
  const router = useRouter()
  const {
    tutor,
    reviews,
    favorites,
    loading,
    averageRating,
    ratingCounts,
    userReview,
    isFavorite,
    scheduling,
    submittingReview,
    addingFavorite,
    scheduleSession,
    submitReview,
    deleteReview,
    toggleFavorite
  } = useTutorProfile()

  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false)
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false)
  const [scheduleForm, setScheduleForm] = useState<ScheduleFormData>({
    sessionDate: "",
    time: "",
    duration: "60",
    price: "",
    course: "",
    comment: ""
  })

  // Use initial tutor if available, otherwise use hook data
  const displayTutor = tutor || initialTutor

  useEffect(() => {
    if (initialTutor && !tutor) {
      // If we have initial data, we can skip the fetch
      // The hook will handle it
    }
  }, [initialTutor, tutor])

  const handleOpenScheduleDialog = () => {
    if (!displayTutor) return
    
    const defaultDuration = "60"
    const calculatedPrice = ((displayTutor.hourlyRate * parseInt(defaultDuration)) / 60).toFixed(2)
    
    const availableCourses = displayTutor.course || []
    const defaultCourse = availableCourses.length > 0 ? availableCourses[0] : ""
    
    setScheduleForm({
      sessionDate: "",
      time: "",
      duration: defaultDuration,
      price: calculatedPrice,
      course: defaultCourse,
      comment: ""
    })
    setScheduleDialogOpen(true)
  }

  const handleScheduleSession = async () => {
    if (!displayTutor) return

    try {
      await scheduleSession({
        ...scheduleForm,
        tutorId: displayTutor.studentId
      })
      setScheduleDialogOpen(false)
      setScheduleForm({
        sessionDate: "",
        time: "",
        duration: "60",
        price: "",
        course: "",
        comment: ""
      })
    } catch (error) {
      // Error handling is done in the hook
    }
  }

  const handleToggleFavorite = async () => {
    if (!displayTutor) return
    await toggleFavorite(displayTutor.studentId)
  }

  const handleOpenReview = () => {
    setReviewDialogOpen(true)
  }

  const calculatePriceFromDuration = (duration: string): string => {
    if (!displayTutor || !duration) return "0"
    const durationInHours = parseInt(duration) / 60
    return (displayTutor.hourlyRate * durationInHours).toFixed(2)
  }

  const getMinDate = (): string => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  }

  const getMinTime = (): string => {
    if (scheduleForm.sessionDate === new Date().toISOString().split('T')[0]) {
      const now = new Date()
      const hours = now.getHours().toString().padStart(2, '0')
      const minutes = now.getMinutes().toString().padStart(2, '0')
      return `${hours}:${minutes}`
    }
    return "00:00"
  }

  if (loading && !displayTutor) {
    return (
      <LayoutWrapper>
        <PageLoader />
      </LayoutWrapper>
    )
  }

  if (!displayTutor) {
    return (
      <LayoutWrapper>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Tutor not found</p>
          <button
            onClick={() => router.push("/tutors")}
            className="mt-4 text-blue-600 hover:text-blue-800"
          >
            Back to Tutors
          </button>
        </div>
      </LayoutWrapper>
    )
  }

  const reviewsCount = reviews?.length || 0
  const displayAverageRating = averageRating || 0

  return (
    <LayoutWrapper>
      <div className="mb-8">
        <TutorProfileHeader
          tutor={displayTutor}
          isFavorite={isFavorite}
          averageRating={displayAverageRating}
          reviewsCount={reviewsCount}
          onToggleFavorite={handleToggleFavorite}
          onScheduleSession={handleOpenScheduleDialog}
          onOpenReview={handleOpenReview}
          addingFavorite={addingFavorite}
        />
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          <TutorInfoSection tutor={displayTutor} />
          <ReviewSection
            reviews={reviews || []}
            averageRating={displayAverageRating}
            ratingCounts={ratingCounts || []}
            userReview={userReview}
            onSubmitReview={submitReview}
            onDeleteReview={deleteReview}
            submittingReview={submittingReview}
            deletingReview={false}
            tutorId={displayTutor.studentId}
          />
        </div>

        <div className="lg:col-span-1">
          <TutorSidebar
            tutor={displayTutor}
            isFavorite={isFavorite}
            averageRating={displayAverageRating}
            reviewsCount={reviewsCount}
            onScheduleSession={handleOpenScheduleDialog}
            onToggleFavorite={handleToggleFavorite}
            onOpenReview={handleOpenReview}
            addingFavorite={addingFavorite}
          />
        </div>
      </div>

      <ScheduleSessionDialog
        open={scheduleDialogOpen}
        onOpenChange={setScheduleDialogOpen}
        selectedTutor={displayTutor}
        formData={scheduleForm}
        onFormChange={setScheduleForm}
        onSubmit={handleScheduleSession}
        loading={scheduling}
        onCalculatePrice={calculatePriceFromDuration}
        getMinDate={getMinDate}
        getMinTime={getMinTime}
      />
    </LayoutWrapper>
  )
}

