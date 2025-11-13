2// components/tutor-profile/TutorProfileHeader.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, DollarSign, Heart, Calendar, MessageSquare } from "lucide-react";
import { Tutor } from '@/interfaces/tutor-profile.interfaces';
import { useToast } from '@/hooks/use-toast';

interface TutorProfileHeaderProps {
  tutor: Tutor;
  isFavorite: boolean;
  averageRating: number;
  reviewsCount: number;
  onToggleFavorite: () => void;
  onScheduleSession: () => void;
  onOpenReview: () => void;
  addingFavorite: boolean;
}

export const TutorProfileHeader = ({
  tutor,
  isFavorite,
  averageRating,
  reviewsCount,
  onToggleFavorite,
  onScheduleSession,
  onOpenReview,
  addingFavorite
}: TutorProfileHeaderProps) => {
  const { toast } = useToast();
  const tutorName = tutor.name || "Unknown Tutor";

  return (
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
                    ({reviewsCount} review{reviewsCount !== 1 ? 's' : ''})
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onOpenReview}
                  className="flex items-center gap-2 w-fit"
                >
                  <MessageSquare className="h-4 w-4" />
                  Write Review
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
            onClick={onToggleFavorite}
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

        {/* Action Buttons for Mobile */}
        <div className="flex flex-col sm:hidden gap-3 mt-6">
          <Button 
            onClick={onScheduleSession}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 font-semibold"
          >
            <Calendar className="h-4 w-4 mr-2" />
            Apply for Schedule
          </Button>
          
          <Button 
            variant="outline" 
            className={`w-full ${isFavorite ? 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100' : ''}`}
            onClick={onToggleFavorite}
            disabled={addingFavorite}
          >
            <Heart className={`h-4 w-4 mr-2 ${isFavorite ? 'fill-current' : ''}`} />
            {addingFavorite ? "Processing..." : (isFavorite ? "Remove from Favorites" : "Add to Favorites")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Star component for ratings
const Star = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
  </svg>
);