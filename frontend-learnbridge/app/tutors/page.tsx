"use client"

import { useEffect, useState } from "react"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Search, Star, Clock, DollarSign, Award, Heart, Calendar, User, Edit, Filter, X } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import api from "@/lib/axios"

interface Tutor {
  studentId: string
  name: string
  bio: string
  subjects: string[]
  hourlyRate: number
  availability: string[]
  credentials?: string
  favoriteCount: number
  createdAt?: string
  updatedAt?: string
}

export default function TutorsPage() {
  const router = useRouter()
  const [tutors, setTutors] = useState<Tutor[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [priceRange, setPriceRange] = useState("all")
  const [loading, setLoading] = useState(true)
  const [isTutor, setIsTutor] = useState(false)
  const [openDialog, setOpenDialog] = useState(false)
  const [editDialog, setEditDialog] = useState(false)
  const [scheduleDialog, setScheduleDialog] = useState(false)
  const [selectedTutor, setSelectedTutor] = useState<Tutor | null>(null)
  const [form, setForm] = useState({
    bio: "",
    subjects: "",
    hourlyRate: "",
    availability: "",
    credentials: "",
  })
  const [editForm, setEditForm] = useState({
    bio: "",
    subjects: "",
    hourlyRate: "",
    availability: "",
    credentials: "",
  })
  const [scheduleForm, setScheduleForm] = useState({
    sessionDate: "",
    time: "",
    duration: "60", // Default to 60 minutes
    price: "",
    subject: "",
    comment: ""
  })
  const [saving, setSaving] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [scheduling, setScheduling] = useState(false)
  const [hasTutorProfile, setHasTutorProfile] = useState(false)
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [addingFavorite, setAddingFavorite] = useState<string | null>(null)
  const [userTutorProfile, setUserTutorProfile] = useState<Tutor | null>(null)
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  useEffect(() => {
    async function fetchTutors() {
      try {
        const token = localStorage.getItem("token")
        const res = await fetch("http://localhost:5000/api/tutor/getalltutor", {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await res.json()
        if (data.tutors) {
          // Ensure all tutors have required properties
          const formattedTutors = data.tutors.map((tutor: any) => ({
            studentId: tutor.studentId || tutor._id || "",
            name: tutor.name || tutor.username || "Unknown Tutor",
            bio: tutor.bio || "No bio available",
            subjects: Array.isArray(tutor.subjects) ? tutor.subjects : [],
            hourlyRate: tutor.hourlyRate || 0,
            availability: Array.isArray(tutor.availability) ? tutor.availability : [],
            credentials: tutor.credentials || "",
            favoriteCount: tutor.favoriteCount || 0,
            createdAt: tutor.createdAt,
            updatedAt: tutor.updatedAt
          }))
          setTutors(formattedTutors)
          
          // Show success toast
          toast({
            title: "Tutors loaded! 🎓",
            description: `Found ${formattedTutors.length} tutors`,
          })
        } else {
          setTutors([])
          toast({
            title: "No tutors found",
            description: "No tutors are currently available",
          })
        }
      } catch (err) {
        console.error("❌ Fetch tutors error:", err)
        setTutors([])
        toast({
          title: "Error loading tutors",
          description: "Failed to load tutor list",
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }
    fetchTutors()
  }, [])

  useEffect(() => {
    async function fetchFavorites() {
      try {
        const token = localStorage.getItem("token")
        const res = await api.get("/favorites/getfave", {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (res.status === 200) {
          const favoriteTutorIds = res.data.favorites
            ?.filter((fav: any) => fav.tutorId)
            .map((fav: any) => fav.tutorId) || []
          
          setFavorites(new Set(favoriteTutorIds))
        }
      } catch (err) {
        console.error("❌ Fetch favorites error:", err)
      }
    }

    fetchFavorites()
  }, [])

  // Fetch user data to get actual tutor status
  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token")
      const res = await fetch("http://localhost:5000/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      
      if (data.user) {
        setIsTutor(data.user.isTutor || false)
      }
    } catch (err) {
      console.error("❌ Fetch user data error:", err)
    }
  }

  const verifyTutorProfile = async () => {
    try {
      const token = localStorage.getItem("token")
      const res = await api.get("/tutor/verifytutorprofile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.status === 200 && res.data.tutorProfile) {
        setHasTutorProfile(true)
        setUserTutorProfile(res.data.tutorProfile)
        // Pre-fill edit form with existing data
        setEditForm({
          bio: res.data.tutorProfile.bio || "",
          subjects: Array.isArray(res.data.tutorProfile.subjects) ? res.data.tutorProfile.subjects.join(", ") : "",
          hourlyRate: res.data.tutorProfile.hourlyRate?.toString() || "",
          availability: Array.isArray(res.data.tutorProfile.availability) ? res.data.tutorProfile.availability.join(", ") : "",
          credentials: res.data.tutorProfile.credentials || "",
        })
      }
    } catch (err) {
      console.error("❌ Verify tutor profile error:", err)
      setHasTutorProfile(false)
    }
  }

  useEffect(() => {
    verifyTutorProfile()
    fetchUserData()
  }, [])

  const filteredTutors = tutors.filter((tutor) => {
    const matchesSearch =
      tutor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tutor.subjects.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesPrice =
      priceRange === "all" ||
      (priceRange === "low" && tutor.hourlyRate < 50) ||
      (priceRange === "medium" && tutor.hourlyRate >= 50 && tutor.hourlyRate < 100) ||
      (priceRange === "high" && tutor.hourlyRate >= 100)
    return matchesSearch && matchesPrice
  })

  // Show search results toast
  useEffect(() => {
    if (!loading && searchQuery) {
      if (filteredTutors.length === 0) {
        toast({
          title: "No matching tutors",
          description: `No tutors found for "${searchQuery}"`,
        })
      } else {
        toast({
          title: "Search results",
          description: `Found ${filteredTutors.length} tutor${filteredTutors.length !== 1 ? 's' : ''} matching "${searchQuery}"`,
        })
      }
    }
  }, [filteredTutors.length, searchQuery, loading])

  const handleToggleTutor = async (checked: boolean) => {
    const token = localStorage.getItem("token");
    const studentId = localStorage.getItem("studentId");

    if (!token || !studentId) {
      toast({ title: "Error", description: "You must be logged in.", variant: "destructive" });
      return;
    }

    try {
      const res = await api.put(
        `/tutor/toggletutormode/${studentId}`,
        { isTutor: checked },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.status === 200) {
        setIsTutor(checked);
        toast({
          title: "Success",
          description: `Tutor mode ${checked ? "enabled" : "disabled"}`,
        })
      }
    } catch (err: any) {
      console.error("Toggle tutor mode error:", err)
      toast({
        title: "Error",
        description: "Failed to update tutor mode",
        variant: "destructive"
      })
    }
  };

  const handleCreateTutor = async () => {
    if (!form.bio || !form.subjects || !form.hourlyRate) {
      toast({ title: "Error", description: "Please fill in all required fields.", variant: "destructive" })
      return
    }

    setSaving(true)
    try {
      const token = localStorage.getItem("token")
      const res = await api.post(
        "/tutor/createtutor",
        {
          ...form,
          subjects: form.subjects.split(",").map((s) => s.trim()).filter(s => s),
          availability: form.availability.split(",").map((a) => a.trim()).filter(a => a),
          hourlyRate: parseInt(form.hourlyRate) || 0,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      if (res.status === 200 || res.status === 201) {
        setHasTutorProfile(true)
        setIsTutor(true)
        setUserTutorProfile(res.data.tutor)
        setOpenDialog(false)
        toast({ 
          title: "Tutor profile created! 🎉", 
          description: "You are now listed as a tutor." 
        })
        // Reset form
        setForm({
          bio: "",
          subjects: "",
          hourlyRate: "",
          availability: "",
          credentials: "",
        })
        // Refresh tutors list
        const tutorsRes = await fetch("http://localhost:5000/api/tutor/getalltutor", {
          headers: { Authorization: `Bearer ${token}` },
        })
        const tutorsData = await tutorsRes.json()
        if (tutorsData.tutors) {
          setTutors(tutorsData.tutors)
        }
      }
    } catch (err: any) {
      console.error("❌ Create tutor error:", err)
      const errorMessage = err.response?.data?.message || "Failed to create tutor profile."
      toast({ title: "Error", description: errorMessage, variant: "destructive" })
    } finally {
      setSaving(false)
    }
  }

  const handleUpdateTutor = async () => {
    if (!editForm.bio || !editForm.subjects || !editForm.hourlyRate) {
      toast({ title: "Error", description: "Please fill in all required fields.", variant: "destructive" })
      return
    }

    setUpdating(true)
    try {
      const token = localStorage.getItem("token")
      const res = await api.put(
        "/tutor/updatetutor",
        {
          ...editForm,
          subjects: editForm.subjects.split(",").map((s) => s.trim()).filter(s => s),
          availability: editForm.availability.split(",").map((a) => a.trim()).filter(a => a),
          hourlyRate: parseInt(editForm.hourlyRate) || 0,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      if (res.status === 200) {
        setUserTutorProfile(res.data.updatedProfile)
        setEditDialog(false)
        toast({ 
          title: "Profile Updated ✅", 
          description: "Tutor profile updated successfully." 
        })
        // Refresh tutors list to show updated data
        const tutorsRes = await fetch("http://localhost:5000/api/tutor/getalltutor", {
          headers: { Authorization: `Bearer ${token}` },
        })
        const tutorsData = await tutorsRes.json()
        if (tutorsData.tutors) {
          setTutors(tutorsData.tutors)
        }
      }
    } catch (err: any) {
      console.error("❌ Update tutor error:", err)
      const errorMessage = err.response?.data?.message || "Failed to update tutor profile."
      toast({ title: "Error", description: errorMessage, variant: "destructive" })
    } finally {
      setUpdating(false)
    }
  }

  const openEditDialog = () => {
    setEditDialog(true)
    toast({
      title: "Edit Profile",
      description: "Updating your tutor profile",
    })
  }

  const toggleFavorite = async (tutorId: string) => {
    const isCurrentlyFavorite = favorites.has(tutorId)
    
    if (isCurrentlyFavorite) {
      await removeFavorite(tutorId)
    } else {
      await addFavorite(tutorId)
    }
  }

  const addFavorite = async (tutorId: string) => {
    try {
      setAddingFavorite(tutorId)
      const token = localStorage.getItem("token")

      const res = await api.post(
        "/favorites/addfave",
        { tutorId },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      if (res.status === 201) {
        setFavorites(prev => new Set(prev).add(tutorId))
        // Update favorite count locally
        setTutors(prev => prev.map(tutor => 
          tutor.studentId === tutorId 
            ? { ...tutor, favoriteCount: (tutor.favoriteCount || 0) + 1 }
            : tutor
        ))
        toast({ 
          title: "Added to favorites! ❤️", 
          description: "Tutor added to your favorites!" 
        })
      }
    } catch (err: any) {
      console.error("❌ Add favorite error:", err)
      
      if (err.response?.status === 400 && err.response?.data?.message === "Already added to favorites") {
        setFavorites(prev => new Set(prev).add(tutorId))
        toast({ 
          title: "Already in favorites", 
          description: "This tutor is already in your favorites." 
        })
      } else {
        toast({ 
          title: "Error", 
          description: "Failed to add to favorites", 
          variant: "destructive" 
        })
      }
    } finally {
      setAddingFavorite(null)
    }
  }

  const removeFavorite = async (tutorId: string) => {
    try {
      setAddingFavorite(tutorId)
      const token = localStorage.getItem("token")
      
      const res = await api.post(
        "/favorites/removefave", 
        { tutorId },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      if (res.status === 200) {
        setFavorites(prev => {
          const newFavorites = new Set(prev)
          newFavorites.delete(tutorId)
          return newFavorites
        })
        // Update favorite count locally
        setTutors(prev => prev.map(tutor => 
          tutor.studentId === tutorId 
            ? { ...tutor, favoriteCount: Math.max(0, (tutor.favoriteCount || 1) - 1) }
            : tutor
        ))
        toast({ 
          title: "Removed from favorites", 
          description: "Tutor removed from your favorites." 
        })
      }
    } catch (err: any) {
      console.error("❌ Remove favorite error:", err)
      toast({ 
        title: "Error", 
        description: "Failed to remove from favorites", 
        variant: "destructive" 
      })
    } finally {
      setAddingFavorite(null)
    }
  }

  const handleOpenScheduleDialog = (tutor: Tutor) => {
    setSelectedTutor(tutor)
    const defaultDuration = "60"
    const calculatedPrice = ((tutor.hourlyRate * parseInt(defaultDuration)) / 60).toFixed(2)
    
    setScheduleForm({
      sessionDate: "",
      time: "",
      duration: defaultDuration,
      price: calculatedPrice,
      subject: tutor.subjects[0] || "",
      comment: ""
    })
    setScheduleDialog(true)
    
    toast({
      title: "Schedule Session",
      description: `Scheduling with ${tutor.name}`,
    })
  }

  const handleScheduleSession = async () => {
    if (!selectedTutor) return

    // Validate all required fields
    if (!scheduleForm.sessionDate || !scheduleForm.time || !scheduleForm.duration || !scheduleForm.price || !scheduleForm.subject) {
      toast({ 
        title: "Missing information", 
        description: "Please fill in all required fields.", 
        variant: "destructive" 
      })
      return
    }

    // Validate numeric fields
    const duration = parseInt(scheduleForm.duration)
    const price = parseFloat(scheduleForm.price)
    
    if (isNaN(duration) || duration < 1) {
      toast({ 
        title: "Invalid duration", 
        description: "Duration must be at least 1 minute.", 
        variant: "destructive" 
      })
      return
    }

    if (isNaN(price) || price <= 0) {
      toast({ 
        title: "Invalid price", 
        description: "Price must be a positive number.", 
        variant: "destructive" 
      })
      return
    }

    const selectedDateTime = new Date(`${scheduleForm.sessionDate}T${scheduleForm.time}`)
    const now = new Date()
    
    if (selectedDateTime <= now) {
      toast({ 
        title: "Invalid date", 
        description: "Please select a future date and time.", 
        variant: "destructive" 
      })
      return
    }

    setScheduling(true)
    try {
      const token = localStorage.getItem("token")
      
      // Format the date for backend (ISO string)
      const sessionDate = selectedDateTime.toISOString()
      
      toast({
        title: "Sending request...",
        description: "Please wait while we send your booking request",
      })

      const res = await api.post(
        "/request/sendrequest",
        {
          tutorId: selectedTutor.studentId,
          sessionDate: sessionDate,
          duration: duration,
          price: price,
          subject: scheduleForm.subject,
          comment: scheduleForm.comment || "I would like to schedule a tutoring session"
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      if (res.status === 201) {
        toast({ 
          title: "Request Sent! ✅", 
          description: `Your tutoring request has been sent to ${selectedTutor.name}.` 
        })
        setScheduleDialog(false)
        setSelectedTutor(null)
        setScheduleForm({ 
          sessionDate: "", 
          time: "", 
          duration: "60", 
          price: "", 
          subject: "", 
          comment: "" 
        })
      }
    } catch (err: any) {
      console.error("❌ Schedule session error:", err)
      const errorMessage = err.response?.data?.message || "Failed to schedule session"
      toast({ 
        title: "Error", 
        description: errorMessage, 
        variant: "destructive" 
      })
    } finally {
      setScheduling(false)
    }
  }

  const getMinDate = () => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  }

  const getMinTime = () => {
    if (scheduleForm.sessionDate === new Date().toISOString().split('T')[0]) {
      const now = new Date()
      const hours = now.getHours().toString().padStart(2, '0')
      const minutes = now.getMinutes().toString().padStart(2, '0')
      return `${hours}:${minutes}`
    }
    return "00:00"
  }

  // Calculate price based on duration
  const calculatePriceFromDuration = (duration: string) => {
    if (!selectedTutor || !duration) return "0"
    const durationInHours = parseInt(duration) / 60
    return (selectedTutor.hourlyRate * durationInHours).toFixed(2)
  }

  const handleViewProfile = (tutor: Tutor) => {
    toast({
      title: "Viewing Profile",
      description: `Opening ${tutor.name}'s profile`,
    })
    router.push(`/tutors/${tutor.studentId}`)
  }

  const handleClearFilters = () => {
    setSearchQuery("")
    setPriceRange("all")
    toast({
      title: "Filters cleared",
      description: "Showing all tutors",
    })
  }

  if (loading) {
    return (
      <LayoutWrapper>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading tutors...</p>
          </div>
        </div>
      </LayoutWrapper>
    )
  }

  return (
    <LayoutWrapper>
      {/* Header Section */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-1 sm:mb-2">
            Find a Tutor
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Connect with expert tutors for personalized learning
          </p>
        </div>

        <div className="flex items-center gap-4">
          {hasTutorProfile ? (
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
              <div className="flex items-center gap-2">
                <Label className="text-sm text-foreground whitespace-nowrap">Available as Tutor</Label>
                <Switch 
                  checked={isTutor} 
                  onCheckedChange={handleToggleTutor}
                />
              </div>
              <Button variant="outline" size="sm" onClick={openEditDialog} className="whitespace-nowrap">
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </div>
          ) : (
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
              <DialogTrigger asChild>
                <Button 
                  onClick={() => toast({
                    title: "Create Tutor Profile",
                    description: "Set up your tutoring profile"
                  })}
                  size="sm"
                  className="whitespace-nowrap"
                >
                  Create Tutor Profile
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md w-[95vw] sm:w-full">
                <DialogHeader>
                  <DialogTitle className="text-lg sm:text-xl">Create Tutor Profile</DialogTitle>
                </DialogHeader>

                <form onSubmit={(e) => { e.preventDefault(); handleCreateTutor(); }} className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm sm:text-base">Bio *</Label>
                    <Textarea
                      value={form.bio}
                      onChange={(e) => setForm({ ...form, bio: e.target.value })}
                      placeholder="Tell us about yourself..."
                      required
                      className="text-sm sm:text-base min-h-[80px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm sm:text-base">Subjects (comma separated) *</Label>
                    <Input
                      value={form.subjects}
                      onChange={(e) => setForm({ ...form, subjects: e.target.value })}
                      placeholder="e.g. Database, Web Development"
                      required
                      className="text-sm sm:text-base"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm sm:text-base">Hourly Rate (₱) *</Label>
                    <Input
                      type="number"
                      value={form.hourlyRate}
                      onChange={(e) => setForm({ ...form, hourlyRate: e.target.value })}
                      placeholder="150"
                      required
                      className="text-sm sm:text-base"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm sm:text-base">Availability (comma separated)</Label>
                    <Input
                      value={form.availability}
                      onChange={(e) => setForm({ ...form, availability: e.target.value })}
                      placeholder="Monday 10AM-12PM, Wednesday 1PM-4PM"
                      className="text-sm sm:text-base"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm sm:text-base">Credentials</Label>
                    <Input
                      value={form.credentials}
                      onChange={(e) => setForm({ ...form, credentials: e.target.value })}
                      placeholder="Portfolio, Achievements, etc."
                      className="text-sm sm:text-base"
                    />
                  </div>
                  
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setOpenDialog(false)} className="text-sm sm:text-base">
                      Cancel
                    </Button>
                    <Button type="submit" disabled={saving} className="text-sm sm:text-base">
                      {saving ? "Creating..." : "Create Profile"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {/* Edit Tutor Profile Dialog */}
      <Dialog open={editDialog} onOpenChange={setEditDialog}>
        <DialogContent className="max-w-md w-[95vw] sm:w-full">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">Edit Tutor Profile</DialogTitle>
          </DialogHeader>

          <form onSubmit={(e) => { e.preventDefault(); handleUpdateTutor(); }} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm sm:text-base">Bio *</Label>
              <Textarea
                value={editForm.bio}
                onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                placeholder="Tell us about yourself..."
                required
                className="text-sm sm:text-base min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm sm:text-base">Subjects (comma separated) *</Label>
              <Input
                value={editForm.subjects}
                onChange={(e) => setEditForm({ ...editForm, subjects: e.target.value })}
                placeholder="e.g. Database, Web Development"
                required
                className="text-sm sm:text-base"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm sm:text-base">Hourly Rate (₱) *</Label>
              <Input
                type="number"
                value={editForm.hourlyRate}
                onChange={(e) => setEditForm({ ...editForm, hourlyRate: e.target.value })}
                placeholder="150"
                required
                className="text-sm sm:text-base"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm sm:text-base">Availability (comma separated)</Label>
              <Input
                value={editForm.availability}
                onChange={(e) => setEditForm({ ...editForm, availability: e.target.value })}
                placeholder="Monday 10AM-12PM, Wednesday 1PM-4PM"
                className="text-sm sm:text-base"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm sm:text-base">Credentials</Label>
              <Input
                value={editForm.credentials}
                onChange={(e) => setEditForm({ ...editForm, credentials: e.target.value })}
                placeholder="Portfolio, Achievements, etc."
                className="text-sm sm:text-base"
              />
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setEditDialog(false)} className="text-sm sm:text-base">
                Cancel
              </Button>
              <Button type="submit" disabled={updating} className="text-sm sm:text-base">
                {updating ? "Updating..." : "Update Profile"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Mobile Filters Toggle */}
      <div className="lg:hidden mb-4">
        <Button
          variant="outline"
          className="w-full justify-center"
          onClick={() => setShowMobileFilters(!showMobileFilters)}
        >
          <Filter className="h-4 w-4 mr-2" />
          {showMobileFilters ? "Hide Filters" : "Show Filters"}
        </Button>
      </div>

      {/* Main Content Grid */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filters Sidebar */}
        <div className={`
          ${showMobileFilters ? 'block' : 'hidden'} 
          lg:block lg:w-80 xl:w-96
        `}>
          <Card className="sticky top-6">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">Search & Filters</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearFilters}
                  className="text-xs"
                >
                  Clear All
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="search" className="text-sm">Search Tutors</Label>
                  <div className="relative mt-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="search"
                      placeholder="Search by name or subject..."
                      className="pl-10 text-sm"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Label className="mb-2 block text-sm">Price Range</Label>
                  <Select value={priceRange} onValueChange={setPriceRange}>
                    <SelectTrigger className="text-sm">
                      <SelectValue placeholder="All Prices" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Prices</SelectItem>
                      <SelectItem value="low">Under ₱50/hr</SelectItem>
                      <SelectItem value="medium">₱50-₱100/hr</SelectItem>
                      <SelectItem value="high">₱100+/hr</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Results Count */}
                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground">
                    Showing {filteredTutors.length} of {tutors.length} tutors
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tutors List */}
        <div className="flex-1 space-y-4">
          {filteredTutors.length > 0 ? (
            filteredTutors.map((tutor) => (
              <Card key={tutor.studentId} className="transition-all hover:shadow-lg border-2 hover:border-blue-200">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                    {/* Tutor Profile Image/Initial */}
                    <div className="flex-shrink-0 flex items-start">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-lg sm:text-xl font-bold">
                        {tutor.name.charAt(0).toUpperCase()}
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg sm:text-xl font-semibold text-foreground line-clamp-1">
                            {tutor.name}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {tutor.bio}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1 text-lg sm:text-xl font-bold text-green-600">
                            <DollarSign className="h-4 w-4" />
                            {tutor.hourlyRate}
                          </div>
                          <p className="text-xs sm:text-sm text-muted-foreground">per hour</p>
                        </div>
                      </div>
                      
                      {/* Subjects */}
                      <div className="flex flex-wrap gap-2 my-3">
                        {tutor.subjects.length > 0 ? (
                          tutor.subjects.slice(0, 3).map((s) => (
                            <Badge key={s} variant="outline" className="text-xs">
                              {s}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-sm text-muted-foreground">No subjects listed</span>
                        )}
                        {tutor.subjects.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{tutor.subjects.length - 3} more
                          </Badge>
                        )}
                      </div>
                      
                      {/* Availability & Favorite Count */}
                      <div className="flex flex-wrap gap-3 text-xs sm:text-sm text-muted-foreground mb-4">
                        {tutor.availability.length > 0 ? (
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                            Available
                          </span>
                        ) : (
                          <span className="text-sm text-muted-foreground">No availability set</span>
                        )}
                        
                        {/* Favorite Count */}
                        {tutor.favoriteCount > 0 && (
                          <span className="flex items-center gap-1 text-red-600">
                            <Heart className="h-3 w-3 sm:h-4 sm:w-4 fill-red-500 text-red-500" />
                            {tutor.favoriteCount} favorite{tutor.favoriteCount !== 1 ? 's' : ''}
                          </span>
                        )}
                      </div>
                      
                      {/* Credentials */}
                      {tutor.credentials && (
                        <p className="text-sm italic text-foreground mb-4 line-clamp-2">
                          {tutor.credentials}
                        </p>
                      )}

                      {/* Action Buttons */}
                      <div className="flex flex-col sm:flex-row gap-2">
                        {/* Schedule Button */}
                        <Button
                          onClick={() => handleOpenScheduleDialog(tutor)}
                          className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-2 px-3 sm:px-4 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 text-sm sm:text-base"
                        >
                          <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                          <span className="hidden xs:inline">Apply for Schedule</span>
                          <span className="xs:hidden">Schedule</span>
                        </Button>

                        {/* View Profile Button */}
                        <Button
                          onClick={() => handleViewProfile(tutor)}
                          variant="outline"
                          className="flex-1 border-2 border-gray-300 hover:border-blue-600 text-gray-700 hover:text-blue-600 py-2 px-3 sm:px-4 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 text-sm sm:text-base"
                        >
                          <User className="h-3 w-3 sm:h-4 sm:w-4" />
                          <span className="hidden xs:inline">View Profile</span>
                          <span className="xs:hidden">Profile</span>
                        </Button>

                        {/* Favorite Button */}
                        <Button
                          onClick={() => toggleFavorite(tutor.studentId)}
                          variant="outline"
                          disabled={addingFavorite === tutor.studentId}
                          className={`p-2 sm:p-3 rounded-lg transition-all duration-200 flex-shrink-0 ${
                            favorites.has(tutor.studentId)
                              ? 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100'
                              : 'border-gray-300 text-gray-400 hover:text-red-500 hover:border-red-200'
                          }`}
                        >
                          <Heart 
                            className={`h-4 w-4 sm:h-5 sm:w-5 ${favorites.has(tutor.studentId) ? 'fill-red-500 text-red-500' : ''}`} 
                          />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="p-8 sm:p-12 text-center">
                <div className="text-4xl sm:text-6xl mb-4">👨‍🏫</div>
                <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">No tutors found</h3>
                <p className="text-sm sm:text-base text-muted-foreground mb-4 max-w-md mx-auto">
                  Try adjusting your search criteria or check back later for new tutors.
                </p>
                <Button 
                  variant="outline" 
                  onClick={handleClearFilters}
                  size="sm"
                >
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Schedule Session Dialog */}
      <Dialog open={scheduleDialog} onOpenChange={setScheduleDialog}>
        <DialogContent className="max-w-md w-[95vw] sm:w-full">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">
              Schedule with {selectedTutor?.name}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-2">
            <div>
              <Label htmlFor="subject" className="text-sm sm:text-base">Subject *</Label>
              <Select 
                value={scheduleForm.subject} 
                onValueChange={(value) => setScheduleForm({...scheduleForm, subject: value})}
              >
                <SelectTrigger className="text-sm sm:text-base">
                  <SelectValue placeholder="Select a subject" />
                </SelectTrigger>
                <SelectContent>
                  {selectedTutor?.subjects.map((subject) => (
                    <SelectItem key={subject} value={subject} className="text-sm sm:text-base">
                      {subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="sessionDate" className="text-sm sm:text-base">Date *</Label>
                <Input
                  id="sessionDate"
                  type="date"
                  value={scheduleForm.sessionDate}
                  onChange={(e) => setScheduleForm({...scheduleForm, sessionDate: e.target.value})}
                  min={getMinDate()}
                  className="text-sm sm:text-base"
                />
              </div>
              <div>
                <Label htmlFor="time" className="text-sm sm:text-base">Time *</Label>
                <Input
                  id="time"
                  type="time"
                  value={scheduleForm.time}
                  onChange={(e) => setScheduleForm({...scheduleForm, time: e.target.value})}
                  min={getMinTime()}
                  className="text-sm sm:text-base"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="duration" className="text-sm sm:text-base">Duration (minutes) *</Label>
                <Input
                  id="duration"
                  type="number"
                  value={scheduleForm.duration}
                  onChange={(e) => {
                    const duration = e.target.value;
                    const calculatedPrice = calculatePriceFromDuration(duration);
                    
                    setScheduleForm({
                      ...scheduleForm,
                      duration: duration,
                      price: calculatedPrice
                    });
                  }}
                  placeholder="60"
                  min="1"
                  className="text-sm sm:text-base"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {(parseInt(scheduleForm.duration) / 60).toFixed(1)} hours
                </p>
              </div>
              <div>
                <Label htmlFor="price" className="text-sm sm:text-base">Total Price (₱) *</Label>
                <Input
                  id="price"
                  type="number"
                  value={scheduleForm.price}
                  readOnly
                  className="bg-muted cursor-not-allowed text-sm sm:text-base"
                  placeholder="Auto-calculated"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  ₱{selectedTutor?.hourlyRate}/hour × {(parseInt(scheduleForm.duration) / 60).toFixed(1)} hours
                </p>
              </div>
            </div>

            {/* Cost Breakdown */}
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-blue-900">Cost Breakdown:</span>
              </div>
              <div className="space-y-1 text-xs sm:text-sm text-blue-800">
                <div className="flex justify-between">
                  <span>Hourly Rate:</span>
                  <span>₱{selectedTutor?.hourlyRate}/hour</span>
                </div>
                <div className="flex justify-between">
                  <span>Duration:</span>
                  <span>{scheduleForm.duration} minutes ({(parseInt(scheduleForm.duration) / 60).toFixed(1)} hours)</span>
                </div>
                <div className="flex justify-between font-bold border-t border-blue-200 pt-1 mt-1">
                  <span>Total Cost:</span>
                  <span className="text-base sm:text-lg">₱{scheduleForm.price}</span>
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="comment" className="text-sm sm:text-base">Additional Comments</Label>
              <Textarea
                id="comment"
                value={scheduleForm.comment}
                onChange={(e) => setScheduleForm({...scheduleForm, comment: e.target.value})}
                placeholder="Any specific topics you want to cover..."
                rows={3}
                className="text-sm sm:text-base"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setScheduleDialog(false)} className="text-sm sm:text-base">
              Cancel
            </Button>
            <Button onClick={handleScheduleSession} disabled={scheduling} className="text-sm sm:text-base">
              {scheduling ? "Sending Request..." : "Send Request"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </LayoutWrapper>
  )
}