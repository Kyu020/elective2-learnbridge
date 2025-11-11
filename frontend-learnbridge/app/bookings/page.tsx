"use client"

import { useState, useEffect } from "react"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MoreVertical, Check, Slash, User, Send, AlertCircle, Loader2, RefreshCw, DollarSign, BookOpen, MessageSquare } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import api from "@/lib/axios"

interface StudentInfo {
  _id: string
  username: string
  email: string
  program: string
  specialization: string
}

interface TutorInfo {
  _id: string
  username: string
  email: string
  program: string
  specialization: string
}

interface Booking {
  _id: string
  studentId: string
  tutorId: string
  sessionDate: string
  duration: number
  price: number
  subject: string
  comment: string
  tutorComment?: string
  status: "pending" | "accepted" | "completed" | "rejected" | "cancelled"
  createdAt: string
  updatedAt: string
  studentInfo?: StudentInfo
  tutorInfo?: TutorInfo     
}

export default function BookingsPage() {
  const [activePanel, setActivePanel] = useState("sent")
  const [activeTab, setActiveTab] = useState("pending")
  const [receivedBookings, setReceivedBookings] = useState<Booking[]>([])
  const [sentBookings, setSentBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [sentError, setSentError] = useState<string | null>(null)
  const [receivedError, setReceivedError] = useState<string | null>(null)
  const [isTutor, setIsTutor] = useState<boolean>(false)
  const { toast } = useToast()

  const fetchBookings = async () => {
    try {
      setLoading(true)
      setSentError(null)
      setReceivedError(null)
      const token = localStorage.getItem("token")
      
      if (!token) {
        setSentError("No authentication token found")
        toast({
          title: "Authentication Error",
          description: "Please log in again",
          variant: "destructive",
        })
        setLoading(false)
        return
      }

      console.log("Starting to fetch bookings...")

      // Fetch sent bookings (student requests)
      try {
        console.log("Fetching sent bookings...")
        const sentRes = await api.get(`/request/getstudentrequests`, {
          headers: { Authorization: `Bearer ${token}` }
        })

        console.log("Sent bookings response:", sentRes)
        
        if (sentRes.status === 200) {
          const sentData = sentRes.data.body || []
          setSentBookings(sentData)
          console.log("Sent bookings set:", sentData.length)
          
          if (sentData.length > 0) {
            toast({
              title: "Bookings loaded",
              description: `Found ${sentData.length} sent booking(s)`,
            })
          }
        } else {
          setSentError("Unexpected response from server")
        }
      } catch (sentErr: any) {
        console.error("Error fetching sent bookings:", sentErr)
        if (sentErr.response?.status === 404) {
          // No sent bookings found is not an error - just empty array
          setSentBookings([])
        } else if (sentErr.response?.data?.message) {
          const errorMsg = `Failed to fetch sent bookings: ${sentErr.response.data.message}`
          setSentError(errorMsg)
          toast({
            title: "Error loading sent bookings",
            description: sentErr.response.data.message,
            variant: "destructive",
          })
        } else {
          setSentError("Failed to fetch your sent requests")
          toast({
            title: "Error",
            description: "Failed to load your sent bookings",
            variant: "destructive",
          })
        }
      }

      // Try to fetch received bookings (will fail if user is not a tutor)
      try {
        console.log("Trying to fetch received bookings...")
        const receivedRes = await api.get(`/request/getrequests`, {
          headers: { Authorization: `Bearer ${token}` }
        })

        console.log("Received bookings response:", receivedRes)

        if (receivedRes.status === 200) {
          const receivedData = receivedRes.data.body || []
          setReceivedBookings(receivedData)
          setIsTutor(true) // User is a tutor since they can access this endpoint
          console.log("Received bookings set:", receivedData.length)
          
          if (receivedData.length > 0) {
            toast({
              title: "Tutor bookings loaded",
              description: `Found ${receivedData.length} received booking(s)`,
            })
          }
        } else {
          setReceivedError("Unexpected response from server")
        }
      } catch (receivedErr: any) {
        console.log("User is not a tutor or error fetching received bookings:", receivedErr)
        if (receivedErr.response?.status === 403) {
          // User is not a tutor - this is expected, not an error
          setIsTutor(false)
          setReceivedBookings([])
        } else if (receivedErr.response?.status === 404) {
          // No received bookings found - not an error
          setIsTutor(true)
          setReceivedBookings([])
        } else if (receivedErr.response?.data?.message) {
          const errorMsg = `Failed to fetch received bookings: ${receivedErr.response.data.message}`
          setReceivedError(errorMsg)
          setIsTutor(false)
          toast({
            title: "Error loading received bookings",
            description: receivedErr.response.data.message,
            variant: "destructive",
          })
        } else {
          // Other errors - assume user is not a tutor
          setIsTutor(false)
          setReceivedBookings([])
        }
      }

    } catch (err: any) {
      console.error("General error fetching bookings:", err)
      setSentError("Failed to fetch bookings")
      toast({
        title: "Error",
        description: "Failed to load bookings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
      console.log("Loading completed")
    }
  }

  useEffect(() => {
    fetchBookings()
  }, [])

  const updateBookingStatus = async (id: string, status: Booking["status"], tutorComment?: string) => {
    try {
      const token = localStorage.getItem("token")
      
      // Show loading toast for actions that might take time
      if (status === "accepted" || status === "completed") {
        toast({
          title: "Updating booking...",
          description: "Please wait while we process your request",
        })
      }

      const res = await api.put(`/request/updaterequeststatus/${id}`, 
        { status, tutorComment },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      
      if (res.status === 200) {
        setReceivedBookings((prev) => prev.map((b) => (b._id === id ? res.data.body : b)))
        
        // Show success toast based on action
        let toastTitle = ""
        let toastDescription = ""
        
        switch (status) {
          case "accepted":
            toastTitle = "Booking Accepted"
            toastDescription = "You have successfully accepted the booking request"
            break
          case "completed":
            toastTitle = "Booking Completed"
            toastDescription = "The session has been marked as completed"
            break
          case "rejected":
            toastTitle = "Booking Rejected"
            toastDescription = "You have rejected the booking request"
            break
          default:
            toastTitle = "Status Updated"
            toastDescription = "Booking status has been updated"
        }
        
        toast({
          title: toastTitle,
          description: toastDescription,
          variant: "default",
        })
        
        fetchBookings() // Refresh data
      }
    } catch (err: any) {
      console.error("Error updating status:", err)
      setReceivedError("Failed to update booking status")
      
      let errorMessage = "Failed to update booking status"
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message
      }
      
      toast({
        title: "Update Failed",
        description: errorMessage,
        variant: "destructive",
      })
    }
  }

  const handleRefresh = async () => {
    toast({
      title: "Refreshing...",
      description: "Fetching latest booking data",
    })
    await fetchBookings()
    toast({
      title: "Refreshed",
      description: "Bookings data has been updated",
    })
  }

  const formatSessionDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return dateString
    }
  }

  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} minutes`
    } else {
      const hours = minutes / 60
      return `${hours} hour${hours > 1 ? 's' : ''}`
    }
  }

  const statusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-700"
      case "accepted": return "bg-blue-100 text-blue-700"
      case "completed": return "bg-green-100 text-green-700"
      case "rejected": return "bg-red-100 text-red-700"
      case "cancelled": return "bg-gray-100 text-gray-700"
      default: return "bg-gray-100 text-gray-700"
    }
  }

  const currentBookings = activePanel === "received" ? receivedBookings : sentBookings
  const currentError = activePanel === "received" ? receivedError : sentError
  const filteredBookings = (status: Booking["status"]) =>
    currentBookings.filter((b) => b.status === status)

  // Received Booking Card (for tutor)
  const ReceivedBookingCard = ({ booking }: { booking: Booking }) => (
    <Card className="transition-shadow hover:shadow-lg">
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex items-center gap-4 sm:block sm:w-16">
            <div className="h-12 w-12 sm:h-16 sm:w-16 flex-shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm sm:text-lg font-bold">
              {booking.studentInfo?.username?.charAt(0)?.toUpperCase() || 'S'}
            </div>
            {/* Mobile status badge */}
            <Badge className={`sm:hidden ${statusColor(booking.status)}`}>
              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
            </Badge>
          </div>
          <div className="flex-1 min-w-0">
            <div className="mb-2 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <User className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <h3 className="font-semibold text-foreground truncate">{booking.studentInfo?.username || "Unknown Student"}</h3>
                </div>
                <p className="text-sm text-muted-foreground truncate">{booking.studentInfo?.program || "No program"} • {booking.studentInfo?.specialization || "No specialization"}</p>
                
                {/* Session Details */}
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-blue-500 flex-shrink-0" />
                    <span className="font-medium">Subject:</span>
                    <Badge variant="outline" className="ml-1 truncate min-w-0">{booking.subject}</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="font-medium">Duration:</span>
                    <span>{formatDuration(booking.duration)}</span>
                  </div>
                  <div className="flex items-center gap-2 sm:col-span-2">
                    <Calendar className="h-4 w-4 text-purple-500 flex-shrink-0" />
                    <span className="font-medium flex-shrink-0">Session:</span>
                    <span className="truncate ml-1">{formatSessionDate(booking.sessionDate)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-green-600 flex-shrink-0" />
                    <span className="font-medium">Price:</span>
                    <span>₱{booking.price.toFixed(2)}</span>
                  </div>
                </div>

                {/* Student Comment */}
                {booking.comment && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-start gap-2">
                      <MessageSquare className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-700">Student's Note:</p>
                        <p className="text-sm text-gray-600 mt-1 break-words">{booking.comment}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tutor Comment */}
                {booking.tutorComment && (
                  <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-start gap-2">
                      <MessageSquare className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-blue-700">Your Response:</p>
                        <p className="text-sm text-blue-600 mt-1 break-words">{booking.tutorComment}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between sm:justify-end gap-2 sm:flex-col sm:items-end">
                {/* Mobile date */}
                <span className="text-xs text-muted-foreground sm:hidden">
                  {new Date(booking.createdAt).toLocaleDateString()}
                </span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {booking.status === "pending" && (
                      <>
                        <DropdownMenuItem onClick={() => updateBookingStatus(booking._id, "accepted")}>
                          <Check className="mr-2 h-4 w-4" /> Accept
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => updateBookingStatus(booking._id, "rejected")} className="text-destructive">
                          <Slash className="mr-2 h-4 w-4" /> Reject
                        </DropdownMenuItem>
                      </>
                    )}
                    {booking.status === "accepted" && (
                      <DropdownMenuItem onClick={() => updateBookingStatus(booking._id, "completed")}>
                        <Check className="mr-2 h-4 w-4" /> Mark as Completed
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="hidden sm:flex items-center justify-between mt-4">
              <Badge className={statusColor(booking.status)}>
                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
              </Badge>
              <span className="text-xs text-muted-foreground">
                Requested: {new Date(booking.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  // Sent Booking Card (for student)
  const SentBookingCard = ({ booking }: { booking: Booking }) => (
    <Card className="transition-shadow hover:shadow-lg">
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex items-center gap-4 sm:block sm:w-16">
            <div className="h-12 w-12 sm:h-16 sm:w-16 flex-shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center text-white text-sm sm:text-lg font-bold">
              {booking.tutorInfo?.username?.charAt(0)?.toUpperCase() || 'T'}
            </div>
            {/* Mobile status badge */}
            <Badge className={`sm:hidden ${statusColor(booking.status)}`}>
              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
            </Badge>
          </div>
          <div className="flex-1 min-w-0">
            <div className="mb-2">
              <div className="flex items-center gap-2 mb-1">
                <Send className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <h3 className="font-semibold text-foreground truncate">To: {booking.tutorInfo?.username || "Unknown Tutor"}</h3>
              </div>
              <p className="text-sm text-muted-foreground truncate">{booking.tutorInfo?.program || "No program"} • {booking.tutorInfo?.specialization || "No specialization"}</p>
              
              {/* Session Details */}
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-blue-500 flex-shrink-0" />
                  <span className="font-medium">Subject:</span>
                  <Badge variant="outline" className="ml-1 truncate min-w-0">{booking.subject}</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <span className="font-medium">Duration:</span>
                  <span>{formatDuration(booking.duration)}</span>
                </div>
                <div className="flex items-center gap-2 sm:col-span-2">
                  <Calendar className="h-4 w-4 text-purple-500 flex-shrink-0" />
                  <span className="font-medium flex-shrink-0">Session:</span>
                  <span className="truncate ml-1">{formatSessionDate(booking.sessionDate)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-green-600 flex-shrink-0" />
                  <span className="font-medium">Price:</span>
                  <span>₱{booking.price.toFixed(2)}</span>
                </div>
              </div>

              {/* Student Comment */}
              {booking.comment && (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-start gap-2">
                    <MessageSquare className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-700">Your Note:</p>
                      <p className="text-sm text-gray-600 mt-1 break-words">{booking.comment}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Tutor Comment */}
              {booking.tutorComment && (
                <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-start gap-2">
                    <MessageSquare className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-blue-700">Tutor's Response:</p>
                      <p className="text-sm text-blue-600 mt-1 break-words">{booking.tutorComment}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between mt-4">
              <Badge className={`hidden sm:inline-block ${statusColor(booking.status)}`}>
                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
              </Badge>
              <span className="text-xs text-muted-foreground">
                Sent: {new Date(booking.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const renderTab = (status: Booking["status"]) => {
    const list = filteredBookings(status)
    
    if (loading) {
      return (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500 mb-4" />
            <h3 className="mb-2 text-lg font-semibold text-foreground">Loading bookings...</h3>
            <p className="text-sm text-muted-foreground">Please wait while we fetch your data</p>
          </CardContent>
        </Card>
      )
    }
    
    if (currentError) {
      return (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
            <h3 className="mb-2 text-lg font-semibold text-foreground">Error Loading {activePanel === "received" ? "Received" : "Sent"} Bookings</h3>
            <p className="text-sm text-muted-foreground text-center mb-4">{currentError}</p>
            <Button onClick={handleRefresh} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      )
    }

    if (list.length === 0) {
      return (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Send className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="mb-2 text-lg font-semibold text-foreground">
              No {status} {activePanel === "received" ? "received" : "sent"} bookings
            </h3>
            <p className="text-sm text-muted-foreground text-center">
              {activePanel === "received" 
                ? "You don't have any booking requests in this status"
                : "You haven't sent any booking requests in this status"
              }
            </p>
          </CardContent>
        </Card>
      )
    }
    
    return (
      <div className="space-y-4">
        {list.map((b) => 
          activePanel === "received" 
            ? <ReceivedBookingCard key={b._id} booking={b} />
            : <SentBookingCard key={b._id} booking={b} />
        )}
      </div>
    )
  }

  const showTutorRegistrationMessage = activePanel === "received" && !isTutor

  return (
    <LayoutWrapper>
      <div className="w-full max-w-full overflow-x-hidden">
        {/* Header Section */}
        <div className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 px-4 sm:px-6">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 truncate">My Bookings</h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">Manage your tutoring sessions and requests</p>
          </div>
          <Button onClick={handleRefresh} variant="outline" size="sm" className="w-full sm:w-auto shrink-0">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Panel Selection */}
        <div className="mb-6 bg-white rounded-lg border border-gray-200 mx-4 sm:mx-6">
          <div className="flex gap-1 overflow-x-auto scrollbar-hide p-1">
            <button
              onClick={() => setActivePanel("sent")}
              className={`px-3 sm:px-4 py-2 rounded-md transition-colors flex-shrink-0 text-sm sm:text-base min-w-max ${
                activePanel === "sent"
                  ? "bg-green-500 text-white font-semibold shadow-sm"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              <div className="flex items-center gap-2">
                <Send className="h-4 w-4" />
                <span className="whitespace-nowrap">Sent</span>
                <Badge variant="secondary" className="ml-1 text-xs bg-white/20 text-white">
                  {sentBookings.length}
                </Badge>
              </div>
            </button>
            
            {isTutor && (
              <button
                onClick={() => setActivePanel("received")}
                className={`px-3 sm:px-4 py-2 rounded-md transition-colors flex-shrink-0 text-sm sm:text-base min-w-max ${
                  activePanel === "received"
                    ? "bg-blue-500 text-white font-semibold shadow-sm"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span className="whitespace-nowrap">Received</span>
                  <Badge variant="secondary" className="ml-1 text-xs bg-white/20 text-white">
                    {receivedBookings.length}
                  </Badge>
                </div>
              </button>
            )}
          </div>
        </div>

        {/* Tutor Registration Message */}
        {showTutorRegistrationMessage && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg mx-4 sm:mx-6 p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-yellow-800 text-sm sm:text-base">Tutor Registration Required</h3>
                <p className="text-yellow-700 text-xs sm:text-sm mt-1">
                  Register as a tutor to start receiving booking requests from students.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mx-4 sm:mx-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="border-b border-gray-200">
              <TabsList className="w-full overflow-x-auto flex justify-start p-1 sm:p-2 bg-white scrollbar-hide">
                <div className="flex gap-1 min-w-max">
                  <TabsTrigger 
                    value="pending" 
                    className="text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:border-blue-200 whitespace-nowrap"
                  >
                    Pending ({filteredBookings("pending").length})
                  </TabsTrigger>
                  <TabsTrigger 
                    value="accepted" 
                    className="text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:border-blue-200 whitespace-nowrap"
                  >
                    Accepted ({filteredBookings("accepted").length})
                  </TabsTrigger>
                  <TabsTrigger 
                    value="completed" 
                    className="text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:border-blue-200 whitespace-nowrap"
                  >
                    Completed ({filteredBookings("completed").length})
                  </TabsTrigger>
                  <TabsTrigger 
                    value="rejected" 
                    className="text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:border-blue-200 whitespace-nowrap"
                  >
                    Rejected ({filteredBookings("rejected").length})
                  </TabsTrigger>
                  <TabsTrigger 
                    value="cancelled" 
                    className="text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:border-blue-200 whitespace-nowrap"
                  >
                    Cancelled ({filteredBookings("cancelled").length})
                  </TabsTrigger>
                </div>
              </TabsList>
            </div>

            <div className="p-4 sm:p-6">
              <TabsContent value="pending" className="mt-0 space-y-4">
                {renderTab("pending")}
              </TabsContent>
              <TabsContent value="accepted" className="mt-0 space-y-4">
                {renderTab("accepted")}
              </TabsContent>
              <TabsContent value="completed" className="mt-0 space-y-4">
                {renderTab("completed")}
              </TabsContent>
              <TabsContent value="rejected" className="mt-0 space-y-4">
                {renderTab("rejected")}
              </TabsContent>
              <TabsContent value="cancelled" className="mt-0 space-y-4">
                {renderTab("cancelled")}
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </LayoutWrapper>
  )
}