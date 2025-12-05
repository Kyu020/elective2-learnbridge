import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, ExternalLink, Calendar, User, Clock, DollarSign } from "lucide-react";
import { Tutor } from '@/interfaces/tutors.interfaces';
import { useToast } from '@/hooks/use-toast';

interface TutorCardProps {
  tutor: Tutor;
  isFavorite: boolean;
  onToggleFavorite: (tutorId: string) => void;
  onScheduleSession: (tutor: Tutor) => void;
  onViewProfile: (tutor: Tutor) => void;
  isUpdatingFavorite?: boolean;
}

export const TutorCard = ({ 
  tutor, 
  isFavorite, 
  onToggleFavorite, 
  onScheduleSession,
  onViewProfile,
  isUpdatingFavorite = false 
}: TutorCardProps) => {
  const { toast } = useToast();
  const favoriteCount = tutor.favoriteCount || 0;

  return (
    <Card className="transition-all hover:shadow-lg border-2 hover:border-blue-200">
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
          {/* Tutor Profile Image/Initial */}
          <div className="flex-shrink-0 flex items-start justify-center sm:justify-start">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-lg sm:text-xl font-bold">
              {tutor.name.charAt(0).toUpperCase()}
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            {/* Header with name and price */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-3">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg sm:text-xl font-semibold text-foreground line-clamp-1">
                  {tutor.name}
                </h3>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {tutor.bio}
                </p>
              </div>
              <div className="flex items-center gap-2 justify-between sm:justify-end">
                <div className="text-right">
                  <div className="flex items-center gap-1 text-lg sm:text-xl font-bold text-green-600">
                    <DollarSign className="h-4 w-4" />
                    {tutor.hourlyRate}
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground">per hour</p>
                </div>
                {/* Favorite Button - Moved to header on right side */}
                <Button
                  onClick={() => onToggleFavorite(tutor.studentId)}
                  variant="outline"
                  disabled={isUpdatingFavorite}
                  className={`p-2 sm:p-3 rounded-lg transition-all duration-200 flex-shrink-0 ${
                    isFavorite
                      ? 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100'
                      : 'border-gray-300 text-gray-400 hover:text-red-500 hover:border-red-200'
                  }`}
                >
                  <Heart 
                    className={`h-4 w-4 sm:h-5 sm:w-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} 
                  />
                </Button>
              </div>
            </div>
            
            {/* Courses */}
            <div className="flex flex-wrap gap-2 my-3">
              {tutor.course.length > 0 ? (
                tutor.course.slice(0, 3).map((subject) => (
                  <Badge key={subject} variant="outline" className="text-xs">
                    {subject}
                  </Badge>
                ))
              ) : (
                <span className="text-sm text-muted-foreground">No subjects listed</span>
              )}
              {tutor.course.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{tutor.course.length - 3} more
                </Badge>
              )}
            </div>
            
            {/* Availability & Favorite Count */}
            <div className="flex flex-wrap gap-3 text-xs sm:text-sm text-muted-foreground mb-4">
              {tutor.availability.length > 0 ? (
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                  Available
                </span>
              ) : (
                <span className="text-sm text-muted-foreground">No availability set</span>
              )}
              
              {/* Favorite Count */}
              {favoriteCount > 0 && (
                <span className="flex items-center gap-1 text-red-600">
                  <Heart className="h-3 w-3 sm:h-4 sm:w-4 fill-red-500 text-red-500" />
                  {favoriteCount} favorite{favoriteCount !== 1 ? 's' : ''}
                </span>
              )}
            </div>
            
            {/* Credentials */}
            {tutor.credentials && (
              <p className="text-sm italic text-foreground mb-4 line-clamp-2">
                {tutor.credentials}
              </p>
            )}

            {/* Action Buttons - Only Schedule and View Profile now */}
            <div className="flex flex-col sm:flex-row gap-2">
              {/* Schedule Button */}
              <Button
                onClick={() => onScheduleSession(tutor)}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-2 px-3 sm:px-4 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden xs:inline">Apply for Schedule</span>
                <span className="xs:hidden">Schedule</span>
              </Button>

              {/* View Profile Button */}
              <Button
                onClick={() => onViewProfile(tutor)}
                variant="outline"
                className="flex-1 border-2 border-gray-300 hover:border-blue-600 text-gray-700 hover:text-blue-600 py-2 px-3 sm:px-4 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <User className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden xs:inline">View Profile</span>
                <span className="xs:hidden">Profile</span>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};