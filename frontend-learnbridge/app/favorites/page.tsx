"use client"

import { useEffect, useState } from "react"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, Clock, Users, BookOpen, Heart, Trash2, ExternalLink } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "@/hooks/use-toast"
import api from "@/lib/axios"

interface FavoriteResource {
  _id: string
  title: string
  program: string
  googleDriveLink: string
  uploader?: string
  createdAt: string
}

interface FavoriteTutor {
  _id: string
  name: string
  bio: string
  subjects: string[]
  hourlyRate: number
  studentId: string
  credentials?: string
}

interface FavoriteItem {
  _id: string
  tutorId?: string
  resourceId?: string
  tutor?: FavoriteTutor
  resource?: FavoriteResource
  createdAt: string
}

export default function FavoritesPage() {
  const router = useRouter()
  const [favorites, setFavorites] = useState<FavoriteItem[]>([])
  const [loading, setLoading] = useState(true)
  const [removing, setRemoving] = useState<string | null>(null)

  useEffect(() => {
    fetchFavorites()
  }, [])

  const fetchFavorites = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("token")
      
      toast({
        title: "Loading favorites...",
        description: "Please wait while we fetch your saved items",
      })

      const res = await api.get("/favorites/getfave", {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (res.status === 200) {
        const favoritesData = res.data.favorites || []
        setFavorites(favoritesData)
        
        toast({
          title: "Favorites loaded",
          description: `Found ${favoritesData.length} saved item(s)`,
        })
      }
    } catch (err: any) {
      console.error("❌ Fetch favorites error:", err)
      const errorMessage = err.response?.data?.message || "Failed to load favorites"
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const removeFavorite = async (favoriteId: string, tutorId?: string, resourceId?: string) => {
    try {
      setRemoving(favoriteId)
      const token = localStorage.getItem("token")
      
      const itemType = tutorId ? "tutor" : "resource"
      
      toast({
        title: "Removing...",
        description: `Removing ${itemType} from favorites`,
      })

      const res = await api.post("/favorites/removefave", {
        tutorId,
        resourceId
      }, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (res.status === 200) {
        toast({
          title: "Removed from favorites",
          description: `The ${itemType} has been removed from your favorites`,
        })
        // Remove from local state
        setFavorites(prev => prev.filter(fav => fav._id !== favoriteId))
      }
    } catch (err: any) {
      console.error("❌ Remove favorite error:", err)
      const errorMessage = err.response?.data?.message || "Failed to remove from favorites"
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      })
    } finally {
      setRemoving(null)
    }
  }

  // Handle navigation to tutor profile (same as Tutors page)
  const handleViewProfile = (tutor: FavoriteTutor) => {
    if (tutor?.studentId) {
      toast({
        title: "Opening profile...",
        description: "Redirecting to tutor profile",
      })
      router.push(`/tutors/${tutor.studentId}`)
    } else {
      toast({
        title: "Error",
        description: "Unable to view tutor profile",
        variant: "destructive"
      })
    }
  }

  // Handle Book Now - navigate to tutor profile with booking intent
  const handleBookNow = (tutor: FavoriteTutor) => {
    if (tutor?.studentId) {
      toast({
        title: "Booking session...",
        description: "Redirecting to book a session",
      })
      // Store booking intent in sessionStorage (same pattern as Tutors page)
      sessionStorage.setItem('autoOpenBooking', 'true')
      // Navigate to tutor profile
      router.push(`/tutors/${tutor.studentId}`)
    } else {
      toast({
        title: "Error",
        description: "Unable to book session",
        variant: "destructive"
      })
    }
  }

  const handleViewResource = (resource: FavoriteResource) => {
    if (resource?.googleDriveLink) {
      toast({
        title: "Opening resource...",
        description: "Opening the resource in a new tab",
      })
      window.open(resource.googleDriveLink, '_blank', 'noopener,noreferrer')
    } else {
      toast({
        title: "Error",
        description: "Resource link not available",
        variant: "destructive"
      })
    }
  }

  const favoriteResources = favorites.filter(fav => fav.resourceId && fav.resource)
  const favoriteTutors = favorites.filter(fav => fav.tutorId && fav.tutor)

  if (loading) {
    return (
      <LayoutWrapper>
        <div className="mb-6 px-4 sm:px-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">My Favorites</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Loading your favorites...</p>
        </div>
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </LayoutWrapper>
    )
  }

  return (
    <LayoutWrapper>
      <div className="mb-6 px-4 sm:px-0">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">My Favorites</h1>
        <p className="text-sm sm:text-base text-muted-foreground">Resources and tutors you've saved for later</p>
      </div>

      <Tabs defaultValue="resources" className="w-full">
        <TabsList className="mb-6 mx-4 sm:mx-0">
          <TabsTrigger value="resources" className="flex items-center gap-2 text-xs sm:text-sm">
            <BookOpen className="h-4 w-4" />
            Resources ({favoriteResources.length})
          </TabsTrigger>
          <TabsTrigger value="tutors" className="flex items-center gap-2 text-xs sm:text-sm">
            <Users className="h-4 w-4" />
            Tutors ({favoriteTutors.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="resources" className="space-y-4">
          {favoriteResources.length === 0 ? (
            <Card className="mx-4 sm:mx-0">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Heart className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium text-foreground mb-2 text-center">No favorite resources yet</p>
                <p className="text-sm text-muted-foreground mb-4 text-center">Start exploring and save resources you like</p>
                <Link href="/resources">
                  <Button onClick={() => toast({
                    title: "Redirecting...",
                    description: "Taking you to resources page",
                  })}>
                    Browse Resources
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 px-4 sm:px-0">
              {favoriteResources.map((fav) => (
                <Card key={fav._id} className="group relative overflow-hidden transition-shadow hover:shadow-lg w-full">
                  <div className="absolute top-3 right-3 z-10 flex gap-2">
                    <Button 
                      size="icon" 
                      variant="secondary" 
                      className="h-8 w-8 rounded-full bg-white/90 hover:bg-white"
                    >
                      <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                    </Button>
                    <Button
                      size="icon"
                      variant="secondary"
                      className="h-8 w-8 rounded-full bg-white/90 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeFavorite(fav._id, undefined, fav.resourceId)}
                      disabled={removing === fav._id}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                  
                  <CardContent className="p-4">
                    <div className="mb-2">
                      <h3 className="font-semibold text-foreground line-clamp-2 text-sm sm:text-base">
                        {fav.resource?.title || "Untitled Resource"}
                      </h3>
                    </div>
                    
                    <div className="mb-3">
                      {fav.resource?.program && (
                        <Badge variant="secondary" className="text-xs mb-2">
                          {fav.resource.program}
                        </Badge>
                      )}
                      {fav.resource?.uploader && (
                        <p className="text-xs text-muted-foreground">
                          Uploaded by {fav.resource.uploader}
                        </p>
                      )}
                    </div>
                    
                    <div className="mb-4 flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Added {new Date(fav.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <Button 
                      className="w-full" 
                      size="sm"
                      onClick={() => fav.resource && handleViewResource(fav.resource)}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Resource
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="tutors" className="space-y-4">
          {favoriteTutors.length === 0 ? (
            <Card className="mx-4 sm:mx-0">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Heart className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium text-foreground mb-2 text-center">No favorite tutors yet</p>
                <p className="text-sm text-muted-foreground mb-4 text-center">Find tutors you'd like to work with</p>
                <Link href="/tutors">
                  <Button onClick={() => toast({
                    title: "Redirecting...",
                    description: "Taking you to tutors page",
                  })}>
                    Browse Tutors
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 px-4 sm:px-0">
              {favoriteTutors.map((fav) => (
                <Card key={fav._id} className="group relative transition-shadow hover:shadow-lg flex flex-col w-full">
                  <div className="absolute top-3 right-3 z-10 flex gap-2">
                    <Button 
                      size="icon" 
                      variant="secondary" 
                      className="h-8 w-8 rounded-full bg-white/90 hover:bg-white"
                    >
                      <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                    </Button>
                    <Button
                      size="icon"
                      variant="secondary"
                      className="h-8 w-8 rounded-full bg-white/90 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeFavorite(fav._id, fav.tutorId, undefined)}
                      disabled={removing === fav._id}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                  
                  <CardContent className="p-4 sm:p-6 flex flex-col flex-1">
                    <div className="mb-4 flex flex-col items-center flex-1">
                      <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 mb-3 flex items-center justify-center text-white text-xl sm:text-2xl font-bold">
                        {fav.tutor?.name?.charAt(0)?.toUpperCase() || 'T'}
                      </div>
                      <h3 className="font-semibold text-foreground text-center mb-2 text-sm sm:text-base">
                        {fav.tutor?.name || "Unknown Tutor"}
                      </h3>
                      <p className="text-xs sm:text-sm text-muted-foreground text-center line-clamp-2 mb-3">
                        {fav.tutor?.bio || "No bio available"}
                      </p>
                      
                      <div className="mb-3 flex flex-wrap gap-1 justify-center">
                        {fav.tutor?.subjects?.slice(0, 3).map((subject, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {subject}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="mb-4 text-center">
                        <span className="text-xl sm:text-2xl font-bold text-foreground">₱{fav.tutor?.hourlyRate || 0}</span>
                        <span className="text-xs sm:text-sm text-muted-foreground">/hour</span>
                      </div>
                    </div>
                    
                    {/* Action buttons at the bottom - same pattern as Tutors page */}
                    <div className="flex gap-2 mt-auto">
                      <Button 
                        variant="outline" 
                        className="flex-1 bg-transparent text-xs sm:text-sm" 
                        size="sm"
                        onClick={() => fav.tutor && handleViewProfile(fav.tutor)}
                      >
                        View Profile
                      </Button>
                      <Button 
                        className="flex-1 text-xs sm:text-sm" 
                        size="sm"
                        onClick={() => fav.tutor && handleBookNow(fav.tutor)}
                      >
                        Book Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </LayoutWrapper>
  )
}