// components/molecules/FavoriteTutorCard.tsx
import { useState } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FavoriteItem, FavoriteTutor } from "@/interfaces/favorite.interface";
import { FavoriteActions } from "../atoms/FavoriteActions";

interface FavoriteTutorCardProps {
  favorite: FavoriteItem;
  onRemove: (id: string, tutorId?: string) => void;
  onViewProfile: (tutor: FavoriteTutor) => void;
  onBookNow: (tutor: FavoriteTutor) => void;
  isRemoving: boolean;
}

export const FavoriteTutorCard = ({ favorite, onRemove, onViewProfile, onBookNow, isRemoving }: FavoriteTutorCardProps) => {
  const [imageError, setImageError] = useState(false);

  return (
    <Card className="group relative transition-shadow hover:shadow-lg flex flex-col w-full">
      <FavoriteActions 
        onRemove={() => onRemove(favorite._id, favorite.tutorId)}
        isRemoving={isRemoving}
      />
      
      <CardContent className="p-4 sm:p-6 flex flex-col flex-1">
        <div className="mb-4 flex flex-col items-center flex-1">
          <div className="relative h-16 w-16 sm:h-20 sm:w-20 rounded-full overflow-hidden mb-3 border-2 border-primary/20 shadow-md">
            {favorite.tutor?.profilePicture?.url && !imageError ? (
              <Image
                src={favorite.tutor.profilePicture.url}
                alt={favorite.tutor?.name || "Tutor"}
                fill
                className="object-cover rounded-full"
                sizes="(max-width: 80px) 80px, 96px"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xl sm:text-2xl font-bold">
                {favorite.tutor?.name?.charAt(0)?.toUpperCase() || 'T'}
              </div>
            )}
          </div>
        <h3 className="font-semibold text-foreground text-center mb-2 text-sm sm:text-base">
          {favorite.tutor?.name || "Unknown Tutor"}
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground text-center line-clamp-2 mb-3">
          {favorite.tutor?.bio || "No bio available"}
        </p>
        
        <div className="mb-3 flex flex-wrap gap-1 justify-center">
          {(favorite.tutor?.course || []).slice(0, 3).map((subject, idx) => (
            <Badge key={idx} variant="secondary" className="text-xs">
              {subject}
            </Badge>
          ))}
        </div>
        
        <div className="mb-4 text-center">
          <span className="text-xl sm:text-2xl font-bold text-foreground">
            ₱{favorite.tutor?.hourlyRate || 0}
          </span>
          <span className="text-xs sm:text-sm text-muted-foreground">/hour</span>
        </div>
      </div>
      
      <div className="flex gap-2 mt-auto">
        <Button 
          variant="outline" 
          className="flex-1 bg-transparent text-xs sm:text-sm" 
          size="sm"
          onClick={() => favorite.tutor && onViewProfile(favorite.tutor)}
        >
          View Profile
        </Button>
        <Button 
          className="flex-1 text-xs sm:text-sm" 
          size="sm"
          onClick={() => favorite.tutor && onBookNow(favorite.tutor)}
        >
          Book Now
        </Button>
      </div>
    </CardContent>
  </Card>
  );
};

