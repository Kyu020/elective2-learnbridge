// app/resources/ResourcesPageClient.tsx
"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import { LayoutWrapper } from "@/components/templates/LayoutWrapper"
import { PageLoader } from "@/components/ui/loading-spinner"
import { Button } from "@/components/ui/button"
import { SearchBar } from "@/components/molecules/SearchBar"
import { EmptyState } from "@/components/molecules/EmptyState"
import { useResourcesData } from "@/hooks/data/useResources"
import { useResourceSearch } from "@/hooks/ui/useSearch"
import { Resource } from "@/interfaces/resource.interface"

// Lazy load heavy components
const UploadDialog = dynamic(() => import("@/components/organisms/UploadDialog").then(mod => ({ default: mod.UploadDialog })), {
  ssr: false
})

const ResourceListingCard = dynamic(() => import("@/components/molecules/ResourceListingCard").then(mod => ({ default: mod.ResourceListingCard })), {
  loading: () => <div className="animate-pulse bg-gray-200 h-64 rounded-lg" />
})

interface ResourcesPageClientProps {
  initialResources?: Resource[]
}

export function ResourcesPageClient({ initialResources = [] }: ResourcesPageClientProps) {
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [updatingFavorite, setUpdatingFavorite] = useState<string | null>(null);
  
  const { 
    resources, 
    favorites, 
    loading, 
    addResource, 
    toggleFavorite 
  } = useResourcesData(initialResources);
  
  const {
    searchQuery,
    setSearchQuery,
    filteredData,
    clearSearch
  } = useResourceSearch(resources);

  const handleResourceUploaded = (resource: Resource) => {
    addResource(resource);
  };

  const handleToggleFavorite = async (resourceId: string) => {
    setUpdatingFavorite(resourceId);
    await toggleFavorite(resourceId);
    setUpdatingFavorite(null);
  };

  const handleOpenUploadDialog = () => {
    setIsUploadDialogOpen(true);
  };

  if (loading && resources.length === 0) {
    return (
      <LayoutWrapper>
        <PageLoader />
      </LayoutWrapper>
    );
  }

  return (
    <LayoutWrapper>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-1 sm:mb-2">
            All Resources
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Explore our comprehensive learning materials
          </p>
        </div>

        <UploadDialog 
          onResourceUploaded={handleResourceUploaded} 
        />
      </div>

      <SearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onClearSearch={clearSearch}
        resultCount={filteredData.length}
        totalCount={resources.length}
      />

      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {filteredData.length > 0 ? (
          filteredData.map((resource: Resource) => (
            <ResourceListingCard
              key={resource._id}
              resource={resource}
              isFavorite={favorites.has(resource._id)}
              onToggleFavorite={handleToggleFavorite}
              isUpdatingFavorite={updatingFavorite === resource._id}
            />
          ))
        ) : (
          <EmptyState
            type="resources"
            searchQuery={searchQuery}
            onUploadClick={handleOpenUploadDialog}
            onClearSearch={clearSearch}
          />
        )}
      </div>

      {filteredData.length > 0 && filteredData.length < resources.length && (
        <div className="mt-8 text-center">
          <Button variant="outline" className="mx-auto">
            Load More Resources
          </Button>
        </div>
      )}
    </LayoutWrapper>
  );
}
