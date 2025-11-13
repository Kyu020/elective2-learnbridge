"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { PageLoader } from "@/components/ui/loading-spinner"
import { TutorHeader } from "@/components/tutors/TutorHeader"
import { Filters } from "@/components/tutors/Filters"
import { TutorCard } from "@/components/tutors/TutorCard"
import { TutorProfileDialog } from "@/components/tutors/TutorProfileDialog"
import { ScheduleDialog } from "@/components/tutors/ScheduleDialog"
import { EmptyState } from "@/components/tutors/EmptyState"
import { useTutorsData } from "@/hooks/useTutorsData"
import { useTutorSearch } from "@/hooks/useTutorSearch"
import { TutorFormData, ScheduleFormData } from "@/interfaces/tutors.interfaces"
import { useToast } from "@/hooks/use-toast"

export default function TutorsPage() {
  const router = useRouter()
  const { toast } = useToast()
  
  const [openCreateDialog, setOpenCreateDialog] = useState(false)
  const [openEditDialog, setOpenEditDialog] = useState(false)
  const [openScheduleDialog, setOpenScheduleDialog] = useState(false)
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [updatingFavorite, setUpdatingFavorite] = useState<string | null>(null)
  const [selectedTutor, setSelectedTutor] = useState<any>(null)
  
  const [createForm, setCreateForm] = useState<TutorFormData>({
    bio: "",
    subjects: "",
    hourlyRate: "",
    availability: "",
    credentials: "",
  })

  const [editForm, setEditForm] = useState<TutorFormData>({
    bio: "",
    subjects: "",
    hourlyRate: "",
    availability: "",
    credentials: "",
  })

  const [scheduleForm, setScheduleForm] = useState<ScheduleFormData>({
    sessionDate: "",
    time: "",
    duration: "60",
    price: "",
    subject: "",
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
  } = useTutorsData()

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
        subjects: "",
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
      setEditForm({
        bio: userTutorStatus.userTutorProfile.bio || "",
        subjects: Array.isArray(userTutorStatus.userTutorProfile.subjects) 
          ? userTutorStatus.userTutorProfile.subjects.join(", ") 
          : "",
        hourlyRate: userTutorStatus.userTutorProfile.hourlyRate?.toString() || "",
        availability: Array.isArray(userTutorStatus.userTutorProfile.availability) 
          ? userTutorStatus.userTutorProfile.availability.join(", ") 
          : "",
        credentials: userTutorStatus.userTutorProfile.credentials || "",
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

  const handleOpenScheduleDialog = (tutor: any) => {
    setSelectedTutor(tutor)
    const defaultDuration = "60"
    const calculatedPrice = calculatePriceFromDuration(defaultDuration, tutor)
    
    setScheduleForm({
      sessionDate: "",
      time: "",
      duration: defaultDuration,
      price: calculatedPrice,
      subject: tutor.subjects[0] || "",
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
        subject: "", 
        comment: "" 
      })
    } catch (error) {
      // Error handling is done in the hook
    }
  }

  const handleViewProfile = (tutor: any) => {
    toast({
      title: "Viewing Profile",
      description: `Opening ${tutor.name}'s profile`,
    })
    router.push(`/tutors/${tutor.studentId}`)
  }

  // Utility functions
  const calculatePriceFromDuration = (duration: string, tutor?: any): string => {
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

  if (loading) {
    return (
      <LayoutWrapper>
        <PageLoader />
      </LayoutWrapper>
    )
  }

  return (
    <LayoutWrapper>
      {/* Header Section */}
      <div className="mb-8">
        <TutorHeader
          userTutorStatus={userTutorStatus}
          onToggleTutorMode={toggleTutorMode}
          onEditProfile={handleOpenEditDialog}
          onCreateProfile={handleOpenCreateDialog}
        />
      </div>

      {/* Main Content Grid */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="lg:w-80 flex-shrink-0">
          <div className="sticky top-6">
            {/* Handle mobile visibility in the parent */}
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

        {/* Rest of your content remains the same */}
        <div className="flex-1 min-w-0">
          {/* Results Header */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-foreground">
              {filteredTutors.length} {filteredTutors.length === 1 ? 'tutor' : 'tutors'} found
            </h2>
            {searchQuery && (
              <p className="text-sm text-muted-foreground mt-1">
                Search results for "{searchQuery}"
              </p>
            )}
          </div>

          {/* Tutors List */}
          <div className="space-y-6">
            {filteredTutors.length > 0 ? (
              filteredTutors.map((tutor) => (
                <TutorCard
                  key={tutor.studentId}
                  tutor={tutor}
                  isFavorite={favorites.has(tutor.studentId)}
                  onToggleFavorite={handleToggleFavorite}
                  onScheduleSession={handleOpenScheduleDialog}
                  onViewProfile={handleViewProfile}
                  isUpdatingFavorite={updatingFavorite === tutor.studentId}
                />
              ))
            ) : (
              <EmptyState 
                searchQuery={searchQuery}
                onClearFilters={clearFilters}
              />
            )}
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <TutorProfileDialog
        open={openCreateDialog}
        onOpenChange={setOpenCreateDialog}
        title="Create Tutor Profile"
        formData={createForm}
        onFormChange={setCreateForm}
        onSubmit={handleCreateTutor}
        loading={false}
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
      />

      <ScheduleDialog
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