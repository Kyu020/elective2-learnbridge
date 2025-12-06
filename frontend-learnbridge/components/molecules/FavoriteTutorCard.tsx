// components/molecules/FavoriteTutorCard.tsx
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

export const FavoriteTutorCard = ({ favorite, onRemove, onViewProfile, onBookNow, isRemoving }: FavoriteTutorCardProps) => (
  <Card className="group relative transition-shadow hover:shadow-lg flex flex-col w-full">
    <FavoriteActions 
      onRemove={() => onRemove(favorite._id, favorite.tutorId)}
      isRemoving={isRemoving}
    />
    
    <CardContent className="p-4 sm:p-6 flex flex-col flex-1">
      <div className="mb-4 flex flex-col items-center flex-1">
        <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 mb-3 flex items-center justify-center text-white text-xl sm:text-2xl font-bold">
          {favorite.tutor?.name?.charAt(0)?.toUpperCase() || 'T'}
        </div>
        <h3 className="font-semibold text-foreground text-center mb-2 text-sm sm:text-base">
          {favorite.tutor?.name || "Unknown Tutor"}
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground text-center line-clamp-2 mb-3">
          {favorite.tutor?.bio || "No bio available"}
        </p>
        
        <div className="mb-3 flex flex-wrap gap-1 justify-center">
          {favorite.tutor?.subjects?.slice(0, 3).map((subject, idx) => (
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

