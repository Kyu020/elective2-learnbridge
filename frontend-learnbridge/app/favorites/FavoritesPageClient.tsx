// app/favorites/FavoritesPageClient.tsx
"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import { useRouter } from "next/navigation"
import { LayoutWrapper } from "@/components/templates/LayoutWrapper"
import { PageLoader } from "@/components/ui/loading-spinner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EmptyState } from "@/components/molecules/EmptyState"
import { useFavorites } from "@/hooks/data/useFavorites"

// Lazy load heavy components
const FavoriteTutorCard = dynamic(() => import("@/components/molecules/FavoriteTutorCard").then(mod => ({ default: mod.FavoriteTutorCard })), {
  loading: () => <div className="animate-pulse bg-gray-200 h-64 rounded-lg" />
})

const FavoriteResourceCard = dynamic(() => import("@/components/molecules/FavoriteResourceCard").then(mod => ({ default: mod.FavoriteResourceCard })), {
  loading: () => <div className="animate-pulse bg-gray-200 h-64 rounded-lg" />
})

export function FavoritesPageClient() {
  const router = useRouter()
  const { favorites, favoriteResources, favoriteTutors, loading, removeFavorite } = useFavorites()
  const [removingId, setRemovingId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"tutors" | "resources">("tutors")

  const handleRemoveFavorite = async (id: string, tutorId?: string, resourceId?: string) => {
    setRemovingId(id)
    try {
      await removeFavorite(id, tutorId, resourceId)
    } catch (error) {
      // Error handling is done in the hook
    } finally {
      setRemovingId(null)
    }
  }

  const handleViewTutorProfile = (tutor: any) => {
    if (tutor?.studentId) {
      router.push(`/tutors/${tutor.studentId}`)
    }
  }

  const handleBookNow = (tutor: any) => {
    if (tutor?.studentId) {
      router.push(`/tutors/${tutor.studentId}`)
    }
  }

  const handleViewResource = (resource: any) => {
    if (resource?._id) {
      // Open resource in new tab or navigate to resource page
      if (resource.url) {
        window.open(resource.url, '_blank')
      }
    }
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
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
          My Favorites
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          {favorites.length === 0 
            ? "You haven't saved any favorites yet" 
            : `You have ${favorites.length} favorite item${favorites.length === 1 ? '' : 's'}`}
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as typeof activeTab)} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="tutors">
            Tutors ({favoriteTutors.length})
          </TabsTrigger>
          <TabsTrigger value="resources">
            Resources ({favoriteResources.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tutors" className="mt-0">
          {favoriteTutors.length === 0 ? (
            <EmptyState 
              type="favorites-tutors"
              onClearFilters={() => {}}
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {favoriteTutors.map((favorite) => (
                <FavoriteTutorCard
                  key={favorite._id}
                  favorite={favorite}
                  onRemove={handleRemoveFavorite}
                  onViewProfile={handleViewTutorProfile}
                  onBookNow={handleBookNow}
                  isRemoving={removingId === favorite._id}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="resources" className="mt-0">
          {favoriteResources.length === 0 ? (
            <EmptyState 
              type="favorites-resources"
              onClearFilters={() => {}}
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {favoriteResources.map((favorite) => (
                <FavoriteResourceCard
                  key={favorite._id}
                  favorite={favorite}
                  onRemove={handleRemoveFavorite}
                  onView={handleViewResource}
                  isRemoving={removingId === favorite._id}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </LayoutWrapper>
  )
}

