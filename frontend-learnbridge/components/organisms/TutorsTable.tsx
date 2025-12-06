// components/organisms/TutorsTable.tsx
"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Star, Clock, Users, Eye, Calendar } from "lucide-react"
import { Tutor } from "@/interfaces/tutor.interface"

interface TutorsTableProps {
  tutors: Tutor[]
  favorites: Set<string>
  onToggleFavorite: (tutorId: string) => void
  onScheduleSession: (tutor: Tutor) => void
  onViewProfile: (tutor: Tutor) => void
  isUpdatingFavorite: string | null
}

export const TutorsTable = ({
  tutors,
  favorites,
  onToggleFavorite,
  onScheduleSession,
  onViewProfile,
  isUpdatingFavorite
}: TutorsTableProps) => {
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({})

  const handleImageError = (studentId: string) => {
    setImageErrors(prev => ({ ...prev, [studentId]: true }))
  }

  const getTeachingLevelColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case "beginner": return "bg-green-100 text-green-800"
      case "intermediate": return "bg-yellow-100 text-yellow-800"
      case "advanced": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  if (tutors.length === 0) {
    return (
      <div className="text-center py-12">
        <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">No tutors found</p>
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">Photo</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Courses</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Hourly Rate</TableHead>
            <TableHead>Level</TableHead>
            <TableHead>Availability</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tutors.map((tutor) => {
            // Get courses from course field
            const courses = Array.isArray(tutor.course) 
              ? tutor.course.filter((c: any) => c && typeof c === 'string' && c.trim().length > 0)
              : []
            
            const rating = tutor.ratingAverage || 0
            const ratingCount = tutor.ratingCount || 0
            const isFavorite = favorites.has(tutor.studentId)
            const hasProfilePicture = tutor.profilePicture?.url && !imageErrors[tutor.studentId]
            const initials = tutor.name?.charAt(0)?.toUpperCase() || 'T'

            return (
              <TableRow key={tutor.studentId} className="hover:bg-muted/50">
                <TableCell>
                  <div className="relative h-10 w-10 rounded-full overflow-hidden flex-shrink-0">
                    {hasProfilePicture ? (
                      <Image
                        src={tutor.profilePicture.url}
                        alt={tutor.name || "Tutor"}
                        fill
                        className="object-cover rounded-full"
                        sizes="40px"
                        onError={() => handleImageError(tutor.studentId)}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                        {initials}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell className="font-medium">
                  <div className="flex flex-col">
                    <span className="font-semibold">{tutor.name || "Unknown Tutor"}</span>
                    {tutor.bio && (
                      <span className="text-xs text-muted-foreground line-clamp-1 max-w-[200px]">
                        {tutor.bio}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1 max-w-[200px]">
                    {courses.length > 0 ? (
                      courses.slice(0, 2).map((course: string, index: number) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {course}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-xs text-muted-foreground">No courses</span>
                    )}
                    {courses.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{courses.length - 2}
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">
                      {rating.toFixed(1)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      ({ratingCount})
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="font-semibold">₱{tutor.hourlyRate || 0}</span>
                  <span className="text-xs text-muted-foreground">/hr</span>
                </TableCell>
                <TableCell>
                  {tutor.teachingLevel ? (
                    <Badge className={getTeachingLevelColor(tutor.teachingLevel)}>
                      {tutor.teachingLevel}
                    </Badge>
                  ) : (
                    <span className="text-xs text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>
                      {Array.isArray(tutor.availability) && tutor.availability.length > 0
                        ? `${tutor.availability.length} slot${tutor.availability.length === 1 ? '' : 's'}`
                        : 'Not specified'}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => onToggleFavorite(tutor.studentId)}
                      disabled={isUpdatingFavorite === tutor.studentId}
                    >
                      <Star
                        className={`h-4 w-4 ${
                          isFavorite
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-400"
                        }`}
                      />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewProfile(tutor)}
                      className="h-8"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => onScheduleSession(tutor)}
                      className="h-8"
                    >
                      <Calendar className="h-4 w-4 mr-1" />
                      Schedule
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}

