// components/organisms/TutorListingCard.tsx
"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Clock, MapPin, Monitor, Users } from "lucide-react"
import { Tutor } from "@/interfaces/tutor.interface"

interface TutorListingCardProps {
  tutor: Tutor
  isFavorite: boolean
  onToggleFavorite: (tutorId: string) => void
  onScheduleSession: (tutor: Tutor) => void
  onViewProfile: (tutor: Tutor) => void
  isUpdatingFavorite: boolean
}

export const TutorListingCard = ({
  tutor,
  isFavorite,
  onToggleFavorite,
  onScheduleSession,
  onViewProfile,
  isUpdatingFavorite
}: TutorListingCardProps) => {
  const [imageError, setImageError] = useState(false)

  const handleImageError = () => {
    setImageError(true)
  }

          const courses = Array.isArray(tutor.course) ? tutor.course : []
  const rating = tutor.ratingAverage || 0
  const ratingCount = tutor.ratingCount || 0
  
  const availability = Array.isArray(tutor.availability) 
    ? tutor.availability.join(", ")
    : tutor.availability || "Not specified"
  
  const getTeachingLevelColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case "beginner": return "bg-green-100 text-green-800"
      case "intermediate": return "bg-yellow-100 text-yellow-800"
      case "advanced": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getTeachingStyleIcon = (style: string) => {
    switch (style?.toLowerCase()) {
      case "structured": return "📚"
      case "interactive": return "🤝"
      case "conversational": return "💬"
      case "project-based": return "📁"
      case "problem-solving": return "🔍"
      default: return "🎓"
    }
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row gap-6">
          <div className="flex-shrink-0">
            <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
              {tutor.profilePicture?.url && !imageError ? (
                <Image
                  src={tutor.profilePicture.url}
                  alt={tutor.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 96px) 96px, 96px"
                  onError={handleImageError}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                  <Users className="w-12 h-12 text-gray-400" />
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <h3 className="text-xl font-semibold text-gray-900 truncate">
                    {tutor.name}
                  </h3>
                  <button
                    onClick={() => onToggleFavorite(tutor.studentId)}
                    disabled={isUpdatingFavorite}
                    className="ml-2 flex-shrink-0"
                  >
                    <Star
                      className={`w-5 h-5 ${
                        isFavorite 
                          ? "fill-yellow-400 text-yellow-400" 
                          : "text-gray-300 hover:text-yellow-400"
                      } transition-colors`}
                    />
                  </button>
                </div>
                
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="ml-1 font-semibold">{rating.toFixed(1)}</span>
                  </div>
                  <span className="text-gray-500 text-sm">
                    ({ratingCount} {ratingCount === 1 ? 'review' : 'reviews'})
                  </span>
                </div>

                {tutor.teachingLevel && (
                  <Badge className={`mt-2 ${getTeachingLevelColor(tutor.teachingLevel)}`}>
                    {tutor.teachingLevel.charAt(0).toUpperCase() + tutor.teachingLevel.slice(1)}
                  </Badge>
                )}
              </div>

              <div className="flex-shrink-0">
                <div className="text-2xl font-bold text-gray-900">
                  ₱{tutor.hourlyRate}
                  <span className="text-sm font-normal text-gray-500">/hr</span>
                </div>
              </div>
            </div>

            <p className="text-gray-600 mt-4 line-clamp-2">
              {tutor.bio}
            </p>

            {courses.length > 0 && (
              <div className="mt-4">
                <div className="flex flex-wrap gap-2">
                  {courses.slice(0, 3).map((course: string, index: number) => (
                    <Badge 
                      key={index} 
                      variant="secondary"
                      className="text-xs"
                    >
                      {course}
                    </Badge>
                  ))}
                  {courses.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{courses.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-gray-500">
              {tutor.teachingStyle && (
                <div className="flex items-center gap-1">
                  <span>{getTeachingStyleIcon(tutor.teachingStyle)}</span>
                  <span>{tutor.teachingStyle}</span>
                </div>
              )}
              
              {tutor.modeOfTeaching && (
                <div className="flex items-center gap-1">
                  {tutor.modeOfTeaching === "online" ? (
                    <Monitor className="w-4 h-4" />
                  ) : tutor.modeOfTeaching === "in-person" ? (
                    <MapPin className="w-4 h-4" />
                  ) : (
                    <Users className="w-4 h-4" />
                  )}
                  <span>
                    {tutor.modeOfTeaching === "either" 
                      ? "Online/In-person" 
                      : tutor.modeOfTeaching}
                  </span>
                </div>
              )}
              
              <div className="flex items-center gap-1">
                <Clock className="w-4 w-4" />
                <span className="truncate max-w-[200px]">{availability}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="bg-gray-50 px-6 py-4 border-t">
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <Button
            variant="outline"
            onClick={() => onViewProfile(tutor)}
            className="flex-1"
          >
            View Profile
          </Button>
          <Button
            onClick={() => onScheduleSession(tutor)}
            className="flex-1"
          >
            Schedule Session
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

