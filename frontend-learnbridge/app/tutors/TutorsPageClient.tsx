// app/tutors/TutorsPageClient.tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import dynamic from "next/dynamic"
import { Search, X } from "lucide-react"
import { LayoutWrapper } from "@/components/templates/LayoutWrapper"
import { PageLoader } from "@/components/ui/loading-spinner"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { TutorHeader } from "@/components/molecules/TutorHeader"
import { EmptyState } from "@/components/molecules/EmptyState"
import { useTutorsData } from "@/hooks/data/useTutors"
import { useTutorSearch } from "@/hooks/ui/useSearch"
import { TutorFormData, Tutor } from "@/interfaces/tutor.interface"
import { ScheduleFormData } from "@/interfaces/booking.interface"
import { useToast } from "@/hooks/ui/use-toast"

// Lazy load heavy components
const Filters = dynamic(() => import("@/components/organisms/Filters").then(mod => ({ default: mod.Filters })), {
  loading: () => <div className="animate-pulse bg-gray-200 h-96 rounded-lg" />
})

const TutorsTable = dynamic(() => import("@/components/organisms/TutorsTable").then(mod => ({ default: mod.TutorsTable })), {
  loading: () => <div className="animate-pulse bg-gray-200 h-64 rounded-lg" />
})

const TutorProfileDialog = dynamic(() => import("@/components/organisms/TutorProfileDialog").then(mod => ({ default: mod.TutorProfileDialog })), {
  ssr: false
})

const ScheduleSessionDialog = dynamic(() => import("@/components/organisms/ScheduleSessionDialog").then(mod => ({ default: mod.ScheduleSessionDialog })), {
  ssr: false
})

interface TutorsPageClientProps {
  initialTutors?: Tutor[]
}

export function TutorsPageClient({ initialTutors = [] }: TutorsPageClientProps) {
  const router = useRouter()
  const { toast } = useToast()
  
  const [openCreateDialog, setOpenCreateDialog] = useState(false)
  const [openEditDialog, setOpenEditDialog] = useState(false)
  const [openScheduleDialog, setOpenScheduleDialog] = useState(false)
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [updatingFavorite, setUpdatingFavorite] = useState<string | null>(null)
  const [selectedTutor, setSelectedTutor] = useState<Tutor | null>(null)
  
  const [createForm, setCreateForm] = useState<TutorFormData>({
    bio: "",
    course: [],
    hourlyRate: "",
    availability: "",
    credentials: "",
  })

  const [editForm, setEditForm] = useState<TutorFormData>({
    bio: "",
    course: [],
    hourlyRate: "",
    availability: "",
    credentials: "",
  })

  const [scheduleForm, setScheduleForm] = useState<ScheduleFormData>({
    sessionDate: "",
    time: "",
    duration: "60",
    price: "",
    course: "",
    comment: ""
  })

  const {
    tutors,
    favorites,
    userTutorStatus,
    loading,
    toggleTutorMode,
    createTutorProfile,
    updateTutorProfile,
    scheduleSession,
    toggleFavorite,
  } = useTutorsData(initialTutors)

  const {
    searchQuery,
    setSearchQuery,
    priceRange,
    setPriceRange,
    filteredTutors,
    clearFilters,
  } = useTutorSearch(tutors)

  // Handler functions
  const handleCreateTutor = async () => {
    try {
      await createTutorProfile(createForm)
      setOpenCreateDialog(false)
      setCreateForm({
        bio: "",
        course: [],
        hourlyRate: "",
        availability: "",
        credentials: "",
      })
    } catch (error) {
      // Error handling is done in the hook
    }
  }

  const handleUpdateTutor = async () => {
    try {
      await updateTutorProfile(editForm)
      setOpenEditDialog(false)
    } catch (error) {
      // Error handling is done in the hook
    }
  }

  const handleOpenEditDialog = () => {
    if (userTutorStatus.userTutorProfile) {
      const tutorProfile = userTutorStatus.userTutorProfile;
      
      setEditForm({
        bio: tutorProfile.bio || "",
        course: Array.isArray(tutorProfile.course) ? tutorProfile.course : [],
        hourlyRate: tutorProfile.hourlyRate?.toString() || "",
        availability: Array.isArray(tutorProfile.availability) 
          ? tutorProfile.availability.join(", ") 
          : (tutorProfile.availability || ""),
        credentials: tutorProfile.credentials || "",
        teachingLevel: tutorProfile.teachingLevel || "",
        teachingStyle: tutorProfile.teachingStyle || "",
        modeOfTeaching: tutorProfile.modeOfTeaching || "either",
      })
      setOpenEditDialog(true)
      
      toast({
        title: "Edit Profile",
        description: "Updating your tutor profile",
      })
    }
  }

  const handleOpenCreateDialog = () => {
    setOpenCreateDialog(true)
    toast({
      title: "Create Tutor Profile",
      description: "Set up your tutoring profile"
    })
  }

  const handleToggleFavorite = async (tutorId: string) => {
    setUpdatingFavorite(tutorId)
    await toggleFavorite(tutorId)
    setUpdatingFavorite(null)
  }

  const handleOpenScheduleDialog = (tutor: Tutor) => {
    setSelectedTutor(tutor)
    const defaultDuration = "60"
    const calculatedPrice = calculatePriceFromDuration(defaultDuration, tutor)
    
    const availableCourses = tutor.course || [];
    const defaultCourse = availableCourses.length > 0 ? availableCourses[0] : "";
    
    setScheduleForm({
      sessionDate: "",
      time: "",
      duration: defaultDuration,
      price: calculatedPrice,
      course: defaultCourse,
      comment: ""
    })
    setOpenScheduleDialog(true)
    
    toast({
      title: "Schedule Session",
      description: `Scheduling with ${tutor.name}`,
    })
  }

  const handleScheduleSession = async () => {
    if (!selectedTutor) return

    try {
      await scheduleSession({
        ...scheduleForm,
        tutorId: selectedTutor.studentId
      })
      setOpenScheduleDialog(false)
      setSelectedTutor(null)
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

  const handleViewProfile = (tutor: Tutor) => {
    toast({
      title: "Viewing Profile",
      description: `Opening ${tutor.name}'s profile`,
    })
    router.push(`/tutors/${tutor.studentId}`)
  }

  // Utility functions
  const calculatePriceFromDuration = (duration: string, tutor?: Tutor): string => {
    const currentTutor = tutor || selectedTutor
    if (!currentTutor || !duration) return "0"
    const durationInHours = parseInt(duration) / 60
    return (currentTutor.hourlyRate * durationInHours).toFixed(2)
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

  if (loading && tutors.length === 0) {
    return (
      <LayoutWrapper>
        <PageLoader />
      </LayoutWrapper>
    )
  }

  return (
    <LayoutWrapper>
      <div className="mb-8">
        <TutorHeader
          userTutorStatus={userTutorStatus}
          onToggleTutorMode={toggleTutorMode}
          onEditProfile={handleOpenEditDialog}
          onCreateProfile={handleOpenCreateDialog}
        />
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-80 flex-shrink-0">
          <div className="sticky top-6">
            <div className={`
              ${showMobileFilters ? 'block' : 'hidden'} 
              lg:block
            `}>
              <Filters
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                priceRange={priceRange}
                onPriceRangeChange={setPriceRange}
                onClearFilters={clearFilters}
                resultCount={filteredTutors.length}
                totalCount={tutors.length}
                showMobileFilters={showMobileFilters}
                onMobileFiltersToggle={() => setShowMobileFilters(!showMobileFilters)}
              />
            </div>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative max-w-2xl">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search tutors by name or courses..."
                className="pl-10 pr-10 text-sm sm:text-base"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  onClick={clearFilters}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            {searchQuery && (
              <div className="mt-2 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Found {filteredTutors.length} tutor{filteredTutors.length !== 1 ? 's' : ''} matching "{searchQuery}"
                </p>
                {filteredTutors.length > 0 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={clearFilters}
                    className="text-xs"
                  >
                    Clear
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Results Count */}
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-foreground">
              {filteredTutors.length} {filteredTutors.length === 1 ? 'tutor' : 'tutors'} found
            </h2>
          </div>

          {filteredTutors.length > 0 ? (
            <TutorsTable
              tutors={filteredTutors}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
              onScheduleSession={handleOpenScheduleDialog}
              onViewProfile={handleViewProfile}
              isUpdatingFavorite={updatingFavorite}
            />
          ) : (
            <EmptyState 
              type="tutors"
              searchQuery={searchQuery}
              onClearFilters={clearFilters}
            />
          )}
        </div>
      </div>

      <TutorProfileDialog
        open={openCreateDialog}
        onOpenChange={setOpenCreateDialog}
        title="Create Tutor Profile"
        formData={createForm}
        onFormChange={setCreateForm}
        onSubmit={handleCreateTutor}
        loading={false}
        userProgram="BSIT"
      />

      <TutorProfileDialog
        open={openEditDialog}
        onOpenChange={setOpenEditDialog}
        title="Edit Tutor Profile"
        formData={editForm}
        onFormChange={setEditForm}
        onSubmit={handleUpdateTutor}
        loading={false}
        isEdit={true}
        userProgram="BSIT"
      />

      <ScheduleSessionDialog
        open={openScheduleDialog}
        onOpenChange={setOpenScheduleDialog}
        selectedTutor={selectedTutor}
        formData={scheduleForm}
        onFormChange={setScheduleForm}
        onSubmit={handleScheduleSession}
        loading={false}
        onCalculatePrice={(duration) => calculatePriceFromDuration(duration)}
        getMinDate={getMinDate}
        getMinTime={getMinTime}
      />
    </LayoutWrapper>
  )
}
