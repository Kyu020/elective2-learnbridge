// components/molecules/EmptyState.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Heart } from "lucide-react";
import Link from "next/link";

export type EmptyStateType = 'tutors' | 'resources' | 'favorites-resources' | 'favorites-tutors';

interface EmptyStateProps {
  type: EmptyStateType;
  searchQuery?: string;
  onClearFilters?: () => void;
  onUploadClick?: () => void;
  onClearSearch?: () => void;
  onBrowse?: () => void;
}

export const EmptyState = ({ 
  type, 
  searchQuery, 
  onClearFilters, 
  onUploadClick, 
  onClearSearch,
  onBrowse 
}: EmptyStateProps) => {
  // Tutors empty state
  if (type === 'tutors') {
    return (
      <Card>
        <CardContent className="p-8 sm:p-12 text-center">
          <div className="text-4xl sm:text-6xl mb-4">👨‍🏫</div>
          <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">
            {searchQuery ? "No tutors found" : "No tutors available"}
          </h3>
          <p className="text-sm sm:text-base text-muted-foreground mb-4 max-w-md mx-auto">
            {searchQuery 
              ? "Try adjusting your search criteria or check back later for new tutors."
              : "No tutors are currently registered. Check back later!"
            }
          </p>
          {searchQuery && onClearFilters && (
            <Button 
              variant="outline" 
              onClick={onClearFilters}
              size="sm"
            >
              Clear Filters
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  // Resources empty state
  if (type === 'resources') {
    return (
      <div className="col-span-full text-center py-8 sm:py-12">
        <div className="text-4xl sm:text-6xl mb-4">📚</div>
        <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">
          {searchQuery ? "No matching resources found" : "No resources found"}
        </h3>
        <p className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto mb-4">
          {searchQuery 
            ? "Try adjusting your search terms or browse all resources."
            : "No resources have been uploaded yet. Be the first to share!"
          }
        </p>
        {searchQuery && onClearSearch ? (
          <Button 
            variant="outline" 
            className="mt-2"
            onClick={onClearSearch}
            size="sm"
          >
            Clear Search
          </Button>
        ) : onUploadClick ? (
          <Button 
            className="gap-2 mt-2"
            onClick={onUploadClick}
            size="sm"
          >
            <Upload className="h-4 w-4" /> 
            Upload First Resource
          </Button>
        ) : null}
      </div>
    );
  }

  // Favorites empty state
  const isResources = type === 'favorites-resources';
  const favoriteType = isResources ? 'resources' : 'tutors';
  
  return (
    <Card className="mx-4 sm:mx-0">
      <CardContent className="flex flex-col items-center justify-center py-12">
        <Heart className="h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-lg font-medium text-foreground mb-2 text-center">
          No favorite {favoriteType} yet
        </p>
        <p className="text-sm text-muted-foreground mb-4 text-center">
          {isResources 
            ? "Start exploring and save resources you like" 
            : "Find tutors you'd like to work with"}
        </p>
        {onBrowse ? (
          <Button onClick={onBrowse}>
            Browse {favoriteType.charAt(0).toUpperCase() + favoriteType.slice(1)}
          </Button>
        ) : (
          <Link href={isResources ? "/resources" : "/tutors"}>
            <Button>
              Browse {favoriteType.charAt(0).toUpperCase() + favoriteType.slice(1)}
            </Button>
          </Link>
        )}
      </CardContent>
    </Card>
  );
};

