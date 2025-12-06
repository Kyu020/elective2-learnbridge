// components/dashboard/TutorsSection.tsx
"use client"

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Star } from "lucide-react";
import { useToast } from "@/hooks/ui/use-toast";
import { Tutor } from "@/interfaces/tutor.interface";

interface TutorsSectionProps {
    tutors: Tutor[];   
}

export const TutorsSection = ({ tutors }: TutorsSectionProps) => {
    const { toast } = useToast();
    const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

    const recommendedTutors = tutors.slice(0, 3);
    
    const handleViewAllClick = () => {
        toast({
            title: "Viewing all tutors",
            description: "Taking you to the tutors page"
        });
    };

    const handleViewTutorClick = (tutorName: string) => {
        toast({
            title: "Viewing tutor profile",
            description: `Opening ${tutorName}'s profile`
        });
    };

    const handleImageError = (studentId: string) => {
        setImageErrors(prev => ({ ...prev, [studentId]: true }));
    };

    return (
        <div className="space-y-4 sm:space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-semibold text-foreground">Recommended Tutors</h2>
            <Link href="/tutors">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs sm:text-sm"
                onClick={handleViewAllClick}
              >
                View All
              </Button>
            </Link>
          </div>
          
          <div className="space-y-3 sm:space-y-4">
            {recommendedTutors.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-8 text-center">
                  <Users className="h-12 w-12 text-muted-foreground mb-3" />
                  <p className="font-medium text-foreground mb-1">No tutors available</p>
                  <p className="text-sm text-muted-foreground">Check back later for tutor profiles</p>
                </CardContent>
              </Card>
            ) : (
              recommendedTutors.map((tutor) => {
                const hasProfilePicture = tutor.profilePicture?.url && !imageErrors[tutor.studentId];
                const initials = tutor.name?.charAt(0)?.toUpperCase() || 'T';
                
                return (
                  <Card key={tutor.studentId} className="transition-all hover:shadow-lg border hover:border-green-200">
                    <CardContent className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4">
                      <div className="relative flex-shrink-0">
                        {/* Profile Picture Container - Perfect Circle */}
                        <div className="relative h-12 w-12 sm:h-14 sm:w-14 rounded-full overflow-hidden border-2 border-white shadow-lg">
                          {hasProfilePicture ? (
                            <Image
                              src={tutor.profilePicture.url}
                              alt={tutor.name || "Tutor"}
                              fill
                              className="object-cover rounded-full" // Added rounded-full for extra safety
                              sizes="(max-width: 56px) 56px, (max-width: 64px) 64px, 72px"
                              onError={() => handleImageError(tutor.studentId)}
                              style={{ borderRadius: '50%' }} // Force circular shape
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold text-base sm:text-lg rounded-full">
                              {initials}
                            </div>
                          )}
                        </div>
                        
                        {/* Favorite Count Badge - Circular */}
                        {tutor.favoriteCount > 0 && (
                          <div className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-xs border-2 border-white shadow-sm">
                            {tutor.favoriteCount}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground text-sm sm:text-base line-clamp-1">
                          {tutor.name || "Unknown Tutor"}
                        </h3>
                        
                        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-1 mt-1">
                          {tutor.course?.slice(0, 2).join(", ") || "No courses"}
                        </p>
                        
                        <div className="mt-2 flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            {tutor.ratingAverage?.toFixed(1) || "0.0"} ({tutor.ratingCount || 0})
                          </span>
                          
                          <span className="font-medium text-foreground">
                            ₱{tutor.hourlyRate?.toLocaleString() || 0}/hr
                          </span>
                          
                          {/* Teaching Level Badge - Circular */}
                          {tutor.teachingLevel && (
                            <Badge 
                              variant="outline" 
                              className="text-xs px-1.5 py-0.5 hidden sm:inline-flex rounded-full" // Added rounded-full
                            >
                              {tutor.teachingLevel}
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <Link href={`/tutors/${tutor.studentId}`} className="flex-shrink-0">
                        <Button 
                          size="sm" 
                          className="text-xs sm:text-sm whitespace-nowrap"
                          onClick={() => handleViewTutorClick(tutor.name || "Tutor")}
                        >
                          View
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </div>
    );
};