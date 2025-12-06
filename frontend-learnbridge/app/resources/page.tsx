"use client"

import { useState } from "react"
import { LayoutWrapper } from "@/components/templates/LayoutWrapper"
import { Button } from "@/components/ui/button"
import { PageLoader } from "@/components/ui/loading-spinner"
import { UploadDialog } from "@/components/organisms/UploadDialog"
import { SearchBar } from "@/components/molecules/SearchBar"
import { ResourceListingCard } from "@/components/molecules/ResourceListingCard"
import { EmptyState } from "@/components/molecules/EmptyState"
import { useResourcesData } from "@/hooks/data/useResources"
import { useResourceSearch } from "@/hooks/ui/useSearch"
import { Resource } from "@/interfaces/resource.interface"

export default function ResourcesPage() {
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [updatingFavorite, setUpdatingFavorite] = useState<string | null>(null);
  
  const { 
    resources, 
    favorites, 
    loading, 
    addResource, 
    toggleFavorite 
  } = useResourcesData();
  
  const {
    searchQuery,
    setSearchQuery,
    filteredData, // Changed from filteredResources
    clearSearch
  } = useResourceSearch(resources);

  const handleResourceUploaded = (resource: Resource) => { // Added type
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

  if (loading) {
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
        resultCount={filteredData.length} // Changed
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

      {/* Load More Section for larger datasets */}
      {filteredData.length > 0 && filteredData.length < resources.length && ( // Changed
        <div className="mt-8 text-center">
          <Button variant="outline" className="mx-auto">
            Load More Resources
          </Button>
        </div>
      )}
    </LayoutWrapper>
  );
}