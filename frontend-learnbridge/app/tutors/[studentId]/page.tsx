// app/tutors/[studentId]/page.tsx
"use client"

import React, { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { LayoutWrapper } from "@/components/templates/LayoutWrapper"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, DollarSign, Star, Mail, BookOpen, Award, ArrowLeft, User, Heart, MessageSquare, ThumbsUp, Edit, Trash2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "@/hooks/ui/use-toast"
import api from "@/lib/axios"

interface Tutor {
  _id: string
  studentId: string
  name: string
  bio: string
  subjects: string[]
  hourlyRate: number
  availability: string[]
  credentials?: string
  isAvailable?: boolean
  createdAt: string
  updatedAt: string
}

interface Review {
  _id: string
  studentId: string
  tutorId: string
  rating: number
  comment: string
  studentName: string
  createdAt: string
  updatedAt: string
}

interface ScheduleForm {
  sessionDate: string
  time: string
  duration: string
  price: string
  course: string
  subject?: string // Keep for backward compatibility
  comment: string
}

interface ReviewForm {
  rating: number
  comment: string
}

export default function TutorProfilePage() {
  const params = useParams()
  const router = useRouter()
  const studentId = params.studentId as string
  
  const [tutor, setTutor] = useState<Tutor | null>(null)
  const [loading, setLoading] = useState(true)
  const [scheduleDialog, setScheduleDialog] = useState(false)
  const [reviewDialog, setReviewDialog] = useState(false)
  const [scheduling, setScheduling] = useState(false)
  const [submittingReview, setSubmittingReview] = useState(false)
  const [scheduleForm, setScheduleForm] = useState<ScheduleForm>({
    sessionDate: "",
    time: "",
    duration: "60",
    price: "",
    course: "",
    comment: ""
  })
  const [reviewForm, setReviewForm] = useState<ReviewForm>({
    rating: 5,
    comment: ""
  })
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [addingFavorite, setAddingFavorite] = useState(false)
  const [reviews, setReviews] = useState<Review[]>([])
  const [reviewsLoading, setReviewsLoading] = useState(true)
  const [userReview, setUserReview] = useState<Review | null>(null)
  const [deletingReview, setDeletingReview] = useState(false)

  // Load favorites from API
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) return

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

  // Fetch reviews when tutor is loaded
  useEffect(() => {
    if (tutor) {
      fetchReviews().catch(error => {
        console.error("Failed to fetch reviews:", error)
        // Ensure reviews are set to empty array even if promise rejects
        setReviews([])
        setUserReview(null)
        setReviewsLoading(false)
      })
    }
  }, [tutor])

  const fetchReviews = async () => {
    if (!tutor) return
    
    try {
      setReviewsLoading(true)
      const token = localStorage.getItem("token")
      
      console.log("🔍 Fetching reviews for tutor:", tutor.studentId)

      const res = await api.get(`/reviews/getreviews/${tutor.studentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      console.log("✅ Reviews API response:", res.data)

      if (res.status === 200) {
        // Handle different possible response structures
        let reviewsData = res.data
        
        // If response is an object with a reviews property
        if (reviewsData && typeof reviewsData === 'object' && !Array.isArray(reviewsData)) {
          reviewsData = reviewsData.reviews || reviewsData.data || []
        }
        
        // Ensure reviewsData is always an array
        const safeReviewsData = Array.isArray(reviewsData) ? reviewsData : []
        
        console.log("📝 Processed reviews data:", safeReviewsData)
        
        const transformedReviews = safeReviewsData.map((review: any) => ({
          _id: review._id,
          studentId: review.studentId,
          tutorId: review.tutorId,
          rating: review.rating,
          comment: review.comment,
          studentName: review.student?.username || review.studentName || 'Anonymous Student',
          createdAt: review.createdAt,
          updatedAt: review.updatedAt
        }))
        
        console.log("🔄 Transformed reviews:", transformedReviews)
        
        setReviews(transformedReviews)
        
        // Check if current user has already reviewed
        const currentUserId = localStorage.getItem("studentId")
        console.log("👤 Current user ID:", currentUserId)
        
        const existingUserReview = transformedReviews.find((review: Review) => review.studentId === currentUserId)
        setUserReview(existingUserReview || null)
        
        if (existingUserReview) {
          setReviewForm({
            rating: existingUserReview.rating,
            comment: existingUserReview.comment
          })
        }
      }
    } catch (err: any) {
      console.error("❌ Fetch reviews error:", err)
      console.error("❌ Error status:", err.response?.status)
      console.error("❌ Error details:", err.response?.data || err.message)
      
      // Handle different error scenarios gracefully
      if (err.response?.status === 404 || err.response?.status === 400) {
        console.log("📝 No reviews found for this tutor")
        setReviews([])
        setUserReview(null)
        toast({
          title: "No Reviews Yet 📝",
          description: "This tutor doesn't have any reviews yet. Be the first to share your experience!",
        })
      } else if (err.code === 'NETWORK_ERROR' || err.message?.includes('Network Error')) {
        toast({
          title: "Network Error 🌐",
          description: "Unable to fetch reviews. Please check your internet connection.",
          variant: "destructive"
        })
      } else {
        // For any other error, still handle gracefully
        console.log("⚠️ Unknown error, setting empty reviews")
        setReviews([])
        setUserReview(null)
        toast({
          title: "No Reviews Available",
          description: "Unable to load reviews at this time.",
        })
      }
    } finally {
      setReviewsLoading(false)
    }
  }

  // Auto-open booking if needed
  useEffect(() => {
    if (tutor) {
      const shouldOpenBooking = sessionStorage.getItem('autoOpenBooking') === 'true'
      if (shouldOpenBooking) {
        setScheduleDialog(true)
        sessionStorage.removeItem('autoOpenBooking')
        toast({
          title: "Schedule Session",
          description: `Ready to schedule with ${tutor.name}`,
        })
      }
    }
  }, [tutor])

  useEffect(() => {
    const fetchTutorProfile = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!studentId) {
          toast({
            title: "Invalid Tutor ID",
            description: "No tutor ID provided in the URL",
            variant: "destructive"
          })
          setLoading(false)
          return
        }

        console.log("🔍 Fetching tutor profile for studentId:", studentId)
        
        toast({
          title: "Loading tutor profile...",
          description: "Please wait while we fetch the tutor information",
        })

        const res = await api.get(`/tutor/gettutor/${studentId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        
        console.log("✅ Backend response:", res.data)
        
        if (res.status === 200 && res.data.data) {
          setTutor(res.data.data)
          toast({
            title: "Profile Loaded! 🎓",
            description: `Successfully loaded ${res.data.data.name}'s profile`,
          })
        } else {
          console.log("❌ No tutor data found in response")
          toast({ 
            title: "Tutor Not Found", 
            description: "The requested tutor profile could not be found", 
            variant: "destructive" 
          })
          router.push("/tutors")
        }
      } catch (err: any) {
        console.error("❌ Fetch tutor error:", err)
        console.error("❌ Error response:", err.response?.data)
        
        if (err.response?.status === 404) {
          toast({ 
            title: "Tutor Not Found", 
            description: "The tutor profile you're looking for doesn't exist", 
            variant: "destructive" 
          })
        } else {
          toast({ 
            title: "Error Loading Profile", 
            description: "Failed to load tutor profile. Please try again.", 
            variant: "destructive" 
          })
        }
        router.push("/tutors")
      } finally {
        setLoading(false)
      }
    }

    fetchTutorProfile()
  }, [studentId, router])

  const toggleFavorite = async () => {
    if (!tutor) return
    
    const isCurrentlyFavorite = favorites.has(tutor.studentId)
    
    if (isCurrentlyFavorite) {
      await removeFavorite(tutor.studentId)
    } else {
      await addFavorite(tutor.studentId)
    }
  }

  const addFavorite = async (tutorId: string) => {
    try {
      setAddingFavorite(true)
      const token = localStorage.getItem("token")
      if (!token) {
        toast({
          title: "Authentication Required",
          description: "Please log in to add favorites",
          variant: "destructive"
        })
        return
      }

      toast({
        title: "Adding to favorites...",
        description: "Saving tutor to your favorites list",
      })

      const res = await api.post(
        "/favorites/addfave",
        { tutorId },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      if (res.status === 201) {
        setFavorites(prev => new Set(prev).add(tutorId))
        toast({ 
          title: "Added to Favorites! ❤️", 
          description: "Tutor has been added to your favorites list!" 
        })
      }
    } catch (err: any) {
      console.error("❌ Add favorite error:", err)
      
      if (err.response?.status === 400 && err.response?.data?.message === "Already added to favorites") {
        setFavorites(prev => new Set(prev).add(tutorId))
        toast({ 
          title: "Already in Favorites", 
          description: "This tutor is already in your favorites list." 
        })
      } else {
        toast({ 
          title: "Error Adding Favorite", 
          description: "Failed to add tutor to favorites. Please try again.", 
          variant: "destructive" 
        })
      }
    } finally {
      setAddingFavorite(false)
    }
  }

  const removeFavorite = async (tutorId: string) => {
    try {
      setAddingFavorite(true)
      const token = localStorage.getItem("token")
      if (!token) {
        toast({
          title: "Authentication Required",
          description: "Please log in to manage favorites",
          variant: "destructive"
        })
        return
      }
      
      toast({
        title: "Removing from favorites...",
        description: "Removing tutor from your favorites",
      })

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
        toast({ 
          title: "Removed from Favorites", 
          description: "Tutor has been removed from your favorites list." 
        })
      }
    } catch (err: any) {
      console.error("❌ Remove favorite error:", err)
      toast({ 
        title: "Error Removing Favorite", 
        description: "Failed to remove tutor from favorites. Please try again.", 
        variant: "destructive" 
      })
    } finally {
      setAddingFavorite(false)
    }
  }

  const handleOpenScheduleDialog = () => {
    if (!tutor) return
    const defaultDuration = "60"
    const calculatedPrice = ((tutor.hourlyRate * parseInt(defaultDuration)) / 60).toFixed(2)
    
    const availableCourses = tutor.course || tutor.subjects || [];
    setScheduleForm({
      sessionDate: "",
      time: "",
      duration: defaultDuration,
      price: calculatedPrice,
      course: availableCourses[0] || "",
      comment: ""
    })
    setScheduleDialog(true)
    
    toast({
      title: "Schedule Session",
      description: `You are now scheduling a session with ${tutor.name}`,
    })
  }

  const handleScheduleSession = async () => {
    if (!tutor) return

    // Validate all required fields
    if (!scheduleForm.sessionDate || !scheduleForm.time || !scheduleForm.duration || !scheduleForm.price || !scheduleForm.course) {
      toast({ 
        title: "Missing Information", 
        description: "Please fill in all required fields (Date, Time, Duration, Course).", 
        variant: "destructive" 
      })
      return
    }

    // Validate numeric fields
    const duration = parseInt(scheduleForm.duration)
    const price = parseFloat(scheduleForm.price)
    
    if (isNaN(duration) || duration < 1) {
      toast({ 
        title: "Invalid Duration", 
        description: "Duration must be at least 1 minute.", 
        variant: "destructive" 
      })
      return
    }

    if (isNaN(price) || price <= 0) {
      toast({ 
        title: "Invalid Price", 
        description: "Price must be a positive number.", 
        variant: "destructive" 
      })
      return
    }

    const selectedDateTime = new Date(`${scheduleForm.sessionDate}T${scheduleForm.time}`)
    const now = new Date()
    
    if (selectedDateTime <= now) {
      toast({ 
        title: "Invalid Date/Time", 
        description: "Please select a future date and time for your session.", 
        variant: "destructive" 
      })
      return
    }

    setScheduling(true)
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        toast({
          title: "Authentication Required",
          description: "Please log in to schedule a session",
          variant: "destructive"
        })
        return
      }
      
      // Format the date for backend (ISO string)
      const sessionDate = selectedDateTime.toISOString()
      
      toast({
        title: "Sending Booking Request...",
        description: "Please wait while we send your tutoring request",
      })

      const res = await api.post(
        "/request/sendrequest",
        {
          tutorId: tutor.studentId,
          sessionDate: sessionDate,
          duration: duration,
          price: price,
          course: scheduleForm.course,
          subject: scheduleForm.course, // Keep for backend compatibility
          comment: scheduleForm.comment || "I would like to schedule a tutoring session"
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      if (res.status === 201) {
        toast({ 
          title: "Request Sent Successfully! ✅", 
          description: `Your tutoring request has been sent to ${tutor.name}. They will respond shortly.` 
        })
        setScheduleDialog(false)
        setScheduleForm({ 
          sessionDate: "", 
          time: "", 
          duration: "60", 
          price: "", 
          course: "", 
          comment: "" 
        })
      }
    } catch (err: any) {
      console.error("❌ Schedule session error:", err)
      const errorMessage = err.response?.data?.message || "Failed to schedule session. Please try again."
      toast({ 
        title: "Error Sending Request", 
        description: errorMessage, 
        variant: "destructive" 
      })
    } finally {
      setScheduling(false)
    }
  }

  const handleSubmitReview = async () => {
    if (!tutor) return

    if (!reviewForm.comment.trim()) {
      toast({
        title: "Review Required 📝",
        description: "Please write a review comment before submitting",
        variant: "destructive"
      })
      return
    }

    if (reviewForm.rating < 1 || reviewForm.rating > 5) {
      toast({
        title: "Invalid Rating ⭐",
        description: "Please select a rating between 1 and 5 stars",
        variant: "destructive"
      })
      return
    }

    setSubmittingReview(true)
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        toast({
          title: "Authentication Required",
          description: "Please log in to submit a review",
          variant: "destructive"
        })
        return
      }
      
      toast({
        title: userReview ? "Updating Your Review ✏️" : "Submitting Your Review 📤",
        description: userReview ? "Updating your review for this tutor..." : "Sending your review to the tutor...",
      })

      console.log("📤 Submitting review:", {
        tutorId: tutor.studentId,
        rating: reviewForm.rating,
        comment: reviewForm.comment
      })

      const res = await api.post("/reviews/review", {
        tutorId: tutor.studentId,
        rating: reviewForm.rating,
        comment: reviewForm.comment
      }, {
        headers: { Authorization: `Bearer ${token}` },
      })

      console.log("✅ Review submission response:", res.data)

      if (res.status === 200 || res.status === 201) {
        toast({
          title: userReview ? "Review Updated Successfully! ✅" : "Review Submitted Successfully! 🎉",
          description: userReview 
            ? "Your review has been updated and is now visible to others" 
            : `Thank you for reviewing ${tutor.name}! Your feedback helps other students.`
        })
        setReviewDialog(false)
        // Refresh reviews
        await fetchReviews()
        // Reset form if it was a new review
        if (!userReview) {
          setReviewForm({
            rating: 5,
            comment: ""
          })
        }
      }
    } catch (err: any) {
      console.error("❌ Submit review error:", err)
      console.error("❌ Error details:", err.response?.data)
      
      let errorTitle = "Error Submitting Review"
      let errorDescription = "Failed to submit review. Please try again."
      
      if (err.response?.status === 403) {
        errorTitle = "Session Required 📚"
        errorDescription = "You need to complete a session with this tutor before leaving a review."
      } else if (err.response?.status === 400 && err.response?.data?.message?.includes("cannot review yourself")) {
        errorTitle = "Cannot Review Yourself 🙅‍♂️"
        errorDescription = "You cannot leave a review for your own tutor profile."
      } else if (err.response?.status === 401) {
        errorTitle = "Authentication Required 🔐"
        errorDescription = "Please log in to submit a review."
      } else if (err.response?.data?.message) {
        errorDescription = err.response.data.message
      }
      
      toast({
        title: errorTitle,
        description: errorDescription,
        variant: "destructive"
      })
    } finally {
      setSubmittingReview(false)
    }
  }

  const handleOpenReviewDialog = () => {
    if (!tutor) return
    
    if (userReview) {
      toast({
        title: "Editing Your Review ✏️",
        description: "You're updating your existing review for this tutor",
      })
    } else {
      toast({
        title: "Writing a Review 📝",
        description: `Share your experience with ${tutor.name}`,
      })
    }
    setReviewDialog(true)
  }

  const handleRatingChange = (newRating: number) => {
    setReviewForm({ ...reviewForm, rating: newRating })
    
    const ratingMessages = {
      1: "Poor - Very dissatisfied",
      2: "Fair - Could be better", 
      3: "Good - Met expectations",
      4: "Very Good - Exceeded expectations",
      5: "Excellent - Outstanding experience"
    }
    
    toast({
      title: `${newRating} Star${newRating !== 1 ? 's' : ''} Selected ⭐`,
      description: ratingMessages[newRating as keyof typeof ratingMessages],
      duration: 2000
    })
  }

  const handleDeleteReview = async () => {
    if (!tutor || !userReview) return

    const confirmDelete = window.confirm("Are you sure you want to delete your review? This action cannot be undone.")
    if (!confirmDelete) {
      toast({
        title: "Deletion Cancelled",
        description: "Your review was not deleted",
      })
      return
    }

    setDeletingReview(true)
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        toast({
          title: "Authentication Required",
          description: "Please log in to delete your review",
          variant: "destructive"
        })
        return
      }
      
      toast({
        title: "Deleting Review... 🗑️",
        description: "Removing your review from this tutor's profile",
      })

      console.log("🗑️ Deleting review for tutor:", tutor.studentId)

      const res = await api.delete(`/reviews/deletereview/${tutor.studentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      console.log("✅ Review deletion response:", res.data)

      if (res.status === 200) {
        toast({
          title: "Review Deleted Successfully ✅",
          description: "Your review has been removed from the tutor's profile"
        })
        setUserReview(null)
        setReviewForm({
          rating: 5,
          comment: ""
        })
        await fetchReviews()
      }
    } catch (err: any) {
      console.error("❌ Delete review error:", err)
      console.error("❌ Error details:", err.response?.data)
      
      let errorTitle = "Error Deleting Review"
      let errorDescription = "Failed to delete review. Please try again."
      
      if (err.response?.status === 404) {
        errorTitle = "Review Not Found"
        errorDescription = "The review you're trying to delete doesn't exist or has already been removed."
      } else if (err.response?.status === 401) {
        errorTitle = "Authentication Required"
        errorDescription = "Please log in to delete your review."
      }
      
      toast({
        title: errorTitle,
        description: errorDescription,
        variant: "destructive"
      })
    } finally {
      setDeletingReview(false)
    }
  }

  const handleBackToTutors = () => {
    toast({
      title: "Returning to Tutors",
      description: "Taking you back to the tutors list",
    })
    router.push("/tutors")
  }

  // Get minimum date for date input (today)
  const getMinDate = () => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  }

  // Get minimum time for time input (if date is today)
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
    if (!tutor || !duration) return "0"
    const durationInHours = parseInt(duration) / 60
    return (tutor.hourlyRate * durationInHours).toFixed(2)
  }

  const handleCancelSchedule = () => {
    setScheduleDialog(false)
    toast({
      title: "Scheduling Cancelled",
      description: "Session scheduling has been cancelled",
    })
  }

  const handleCancelReview = () => {
    setReviewDialog(false)
    // Reset form if user was creating a new review
    if (!userReview) {
      setReviewForm({
        rating: 5,
        comment: ""
      })
    }
    toast({
      title: "Review Cancelled",
      description: "Review editing has been cancelled",
    })
  }

  // Calculate average rating
  const averageRating = React.useMemo(() => {
    if (!reviews || reviews.length === 0) return 0
    const sum = reviews.reduce((total: number, review: Review) => total + review.rating, 0)
    const avg = sum / reviews.length
    return Number(avg.toFixed(1))
  }, [reviews])

  // Count ratings
  const ratingCounts = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: reviews.filter((review: Review) => review.rating === rating).length
  }))

  if (loading) {
    return (
      <LayoutWrapper>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading tutor profile...</p>
          </div>
        </div>
      </LayoutWrapper>
    )
  }

  if (!tutor) {
    return (
      <LayoutWrapper>
        <div className="text-center py-12">
          <div className="text-6xl mb-4">😔</div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Tutor Not Found</h1>
          <p className="text-muted-foreground mb-6">The tutor profile you're looking for doesn't exist or may have been removed.</p>
          <Button onClick={handleBackToTutors}>
            Back to Tutors
          </Button>
        </div>
      </LayoutWrapper>
    )
  }

  const tutorName = tutor.name || "Unknown Tutor"
  const isFavorite = favorites.has(tutor.studentId)

  return (
    <LayoutWrapper>
      <div className="p-4 lg:p-6">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={handleBackToTutors}
          className="mb-6 flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Tutors
        </Button>

        {/* Schedule Session Dialog */}
        <Dialog open={scheduleDialog} onOpenChange={setScheduleDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Schedule Session with {tutorName}</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 mt-2">
              <div>
                <Label htmlFor="course">Course *</Label>
                <Select 
                  value={scheduleForm.course} 
                  onValueChange={(value) => setScheduleForm({...scheduleForm, course: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a course" />
                  </SelectTrigger>
                  <SelectContent>
                    {(tutor.course || tutor.subjects || []).map((course) => (
                      <SelectItem key={course} value={course}>
                        {course}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="sessionDate">Date *</Label>
                  <Input
                    id="sessionDate"
                    type="date"
                    value={scheduleForm.sessionDate}
                    onChange={(e) => setScheduleForm({...scheduleForm, sessionDate: e.target.value})}
                    min={getMinDate()}
                  />
                </div>
                <div>
                  <Label htmlFor="time">Time *</Label>
                  <Input
                    id="time"
                    type="time"
                    value={scheduleForm.time}
                    onChange={(e) => setScheduleForm({...scheduleForm, time: e.target.value})}
                    min={getMinTime()}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="duration">Duration (minutes) *</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={scheduleForm.duration}
                    onChange={(e) => {
                      const duration = e.target.value
                      const calculatedPrice = calculatePriceFromDuration(duration)
                      
                      setScheduleForm({
                        ...scheduleForm,
                        duration: duration,
                        price: calculatedPrice
                      })
                    }}
                    placeholder="60"
                    min="1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {(parseInt(scheduleForm.duration) / 60).toFixed(1)} hours
                  </p>
                </div>
                <div>
                  <Label htmlFor="price">Total Price (₱) *</Label>
                  <Input
                    id="price"
                    type="number"
                    value={scheduleForm.price}
                    readOnly
                    className="bg-muted cursor-not-allowed"
                    placeholder="Auto-calculated"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    ₱{tutor.hourlyRate}/hour × {(parseInt(scheduleForm.duration) / 60).toFixed(1)} hours
                  </p>
                </div>
              </div>

              {/* Cost Breakdown */}
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-blue-900">Cost Breakdown:</span>
                </div>
                <div className="space-y-1 text-sm text-blue-800">
                  <div className="flex justify-between">
                    <span>Hourly Rate:</span>
                    <span>₱{tutor.hourlyRate}/hour</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Duration:</span>
                    <span>{scheduleForm.duration} minutes ({(parseInt(scheduleForm.duration) / 60).toFixed(1)} hours)</span>
                  </div>
                  <div className="flex justify-between font-bold border-t border-blue-200 pt-1 mt-1">
                    <span>Total Cost:</span>
                    <span className="text-lg">₱{scheduleForm.price}</span>
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="comment">Additional Comments</Label>
                <Textarea
                  id="comment"
                  value={scheduleForm.comment}
                  onChange={(e) => setScheduleForm({...scheduleForm, comment: e.target.value})}
                  placeholder="Any specific topics you want to cover, learning goals, or special requirements..."
                  rows={3}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={handleCancelSchedule}>
                Cancel
              </Button>
              <Button onClick={handleScheduleSession} disabled={scheduling}>
                {scheduling ? "Sending Request..." : "Send Request"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Review Dialog */}
        <Dialog open={reviewDialog} onOpenChange={setReviewDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {userReview ? "Edit Your Review" : "Write a Review for " + tutorName}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 mt-2">
              <div>
                <Label htmlFor="rating">Rating</Label>
                <div className="flex gap-1 mt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Button
                      key={star}
                      type="button"
                      variant="ghost"
                      size="icon"
                      className={`h-10 w-10 ${
                        star <= reviewForm.rating
                          ? 'text-yellow-500 hover:text-yellow-600'
                          : 'text-gray-300 hover:text-gray-400'
                      }`}
                      onClick={() => handleRatingChange(star)}
                    >
                      <Star className={`h-6 w-6 ${star <= reviewForm.rating ? 'fill-current' : ''}`} />
                    </Button>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {reviewForm.rating} out of 5 stars - {
                    reviewForm.rating === 1 ? "Poor" :
                    reviewForm.rating === 2 ? "Fair" :
                    reviewForm.rating === 3 ? "Good" :
                    reviewForm.rating === 4 ? "Very Good" : "Excellent"
                  }
                </p>
              </div>

              <div>
                <Label htmlFor="comment">Your Review *</Label>
                <Textarea
                  id="comment"
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({...reviewForm, comment: e.target.value})}
                  placeholder="Share your experience with this tutor. What did you like? What could be improved?"
                  rows={4}
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Your review will help other students make informed decisions.
                </p>
              </div>

              {userReview && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-2 text-red-800">
                    <Trash2 className="h-4 w-4" />
                    <span className="text-sm font-medium">Danger Zone</span>
                  </div>
                  <p className="text-sm text-red-700 mt-1">
                    You can delete your review if you no longer want it to be visible.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2 text-red-600 border-red-300 hover:bg-red-50"
                    onClick={handleDeleteReview}
                    disabled={deletingReview}
                  >
                    {deletingReview ? "Deleting..." : "Delete Review"}
                  </Button>
                </div>
              )}
            </div>

            <DialogFooter className="flex justify-between items-center">
              <div>
                {userReview && (
                  <p className="text-sm text-muted-foreground">
                    Last updated: {new Date(userReview.updatedAt).toLocaleDateString()}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleCancelReview}>
                  Cancel
                </Button>
                <Button onClick={handleSubmitReview} disabled={submittingReview}>
                  {submittingReview ? "Submitting..." : (userReview ? "Update Review" : "Submit Review")}
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Header */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row items-start justify-between gap-6">
                  <div className="flex flex-col sm:flex-row items-start gap-6 w-full">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xl sm:text-2xl font-bold">
                      {tutorName.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-2">
                        <h1 className="text-2xl sm:text-3xl font-bold text-foreground truncate">{tutorName}</h1>
                        {tutor.isAvailable !== false && (
                          <Badge variant="secondary" className="bg-green-100 text-green-800 w-fit">
                            Available
                          </Badge>
                        )}
                      </div>
                      <p className="text-muted-foreground text-base sm:text-lg mb-4 break-words">{tutor.bio}</p>
                      
                      {/* Rating Summary */}
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1 rounded-full">
                            <Star className="h-5 w-5 text-yellow-500 fill-current" />
                            <span className="font-bold text-foreground">{averageRating}</span>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            ({reviews.length} review{reviews.length !== 1 ? 's' : ''})
                          </span>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleOpenReviewDialog}
                          className="flex items-center gap-2 w-fit"
                        >
                          <MessageSquare className="h-4 w-4" />
                          {userReview ? "Edit Review" : "Write Review"}
                        </Button>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Mail className="h-4 w-4" />
                          <span className="break-all">{tutor.studentId}@gordoncollege.edu.ph</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          <span className="font-semibold">₱{tutor.hourlyRate}/hour</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleFavorite}
                    disabled={addingFavorite}
                    className={`h-10 w-10 flex-shrink-0 ${
                      isFavorite
                        ? 'text-red-500 hover:text-red-600 bg-red-50'
                        : 'text-gray-400 hover:text-red-500'
                    }`}
                  >
                    <Heart 
                      className={`h-6 w-6 ${isFavorite ? 'fill-current' : ''}`} 
                    />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Rating Breakdown */}
            {reviews.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-500 fill-current" />
                    Rating Breakdown
                  </h2>
                  <div className="space-y-2">
                    {ratingCounts.map(({ rating, count }) => (
                      <div key={rating} className="flex items-center gap-3">
                        <div className="flex items-center gap-1 w-16">
                          <span className="text-sm font-medium w-4">{rating}</span>
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        </div>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-yellow-500 h-2 rounded-full" 
                            style={{ 
                              width: `${reviews.length > 0 ? (count / reviews.length) * 100 : 0}%` 
                            }}
                          />
                        </div>
                        <span className="text-sm text-muted-foreground w-8">
                          {count}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Reviews List */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Student Reviews ({reviews.length})
                  </h2>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setReviewDialog(true)}
                    className="flex items-center gap-2 w-fit"
                  >
                    <Edit className="h-4 w-4" />
                    {userReview ? "Edit Review" : "Write Review"}
                  </Button>
                </div>

                {reviewsLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : reviews.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-lg font-medium text-foreground mb-2">No reviews yet</p>
                    <p className="text-muted-foreground mb-4">Be the first to review this tutor</p>
                    <Button onClick={() => setReviewDialog(true)}>
                      Write First Review
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {reviews.map((review) => (
                      <div key={review._id} className="border-b border-gray-200 pb-6 last:border-0 last:pb-0">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-3 gap-3">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback className="bg-blue-100 text-blue-800">
                                {review.studentName.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-foreground">{review.studentName}</p>
                              <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className={`h-4 w-4 ${
                                      star <= review.rating
                                        ? 'text-yellow-500 fill-current'
                                        : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground sm:text-right">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <p className="text-foreground leading-relaxed break-words">{review.comment}</p>
                        
                        {userReview && userReview._id === review._id && (
                          <div className="flex items-center gap-2 mt-3">
                            <Badge variant="outline" className="text-xs">
                              Your Review
                            </Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setReviewDialog(true)}
                              className="h-6 px-2 text-xs"
                            >
                              <Edit className="h-3 w-3 mr-1" />
                              Edit
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Subjects */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Subjects
                </h2>
                <div className="flex flex-wrap gap-2">
                  {tutor.subjects.map((subject) => (
                    <Badge key={subject} variant="secondary" className="text-sm py-2 px-3">
                      {subject}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Availability */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Availability
                </h2>
                <div className="space-y-3">
                  {tutor.availability.map((slot, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-foreground break-words">{slot}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Credentials */}
            {tutor.credentials && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Credentials
                  </h2>
                  <p className="text-foreground leading-relaxed break-words">{tutor.credentials}</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact & Actions */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Get in Touch</h3>
                
                <div className="flex items-center gap-2 text-muted-foreground mb-4">
                  <User className="h-4 w-4" />
                  <span className="break-all">Student ID: {tutor.studentId}</span>
                </div>

                <Button 
                  onClick={handleOpenScheduleDialog}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 font-semibold mb-3"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Apply for Schedule
                </Button>

                <Button 
                  variant="outline" 
                  className={`w-full ${isFavorite ? 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100' : ''}`}
                  onClick={toggleFavorite}
                  disabled={addingFavorite}
                >
                  <Heart className={`h-4 w-4 mr-2 ${isFavorite ? 'fill-current' : ''}`} />
                  {addingFavorite ? "Processing..." : (isFavorite ? "Remove from Favorites" : "Add to Favorites")}
                </Button>

                <Button 
                  variant="outline" 
                  className="w-full mt-2"
                  onClick={() => setReviewDialog(true)}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  {userReview ? "Edit Review" : "Write Review"}
                </Button>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Tutor Info</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Hourly Rate</span>
                    <span className="font-semibold">₱{tutor.hourlyRate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subjects</span>
                    <span className="font-semibold">{tutor.subjects.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Availability</span>
                    <span className="font-semibold">{tutor.availability.length} slots</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Rating</span>
                    <span className="font-semibold flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      {averageRating} ({reviews.length})
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Member Since</span>
                    <span className="font-semibold">{new Date(tutor.createdAt).getFullYear()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </LayoutWrapper>
  )
}