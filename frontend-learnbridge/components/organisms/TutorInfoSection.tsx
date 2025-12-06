// components/tutor-profile/TutorInfoSection.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Calendar, Clock, Award } from "lucide-react";
import { Tutor } from '@/interfaces/tutor.interface';

interface TutorInfoSectionProps {
  tutor: Tutor;
}

export const TutorInfoSection = ({ tutor }: TutorInfoSectionProps) => {
  return (
    <div className="space-y-6">
      {/* Subjects */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Subjects
          </h2>
                  <div className="flex flex-wrap gap-2">
                    {Array.isArray(tutor.course) && tutor.course.length > 0 ? (
                      tutor.course.map((course: string, index: number) => (
                        <Badge key={`${course}-${index}`} variant="secondary" className="text-sm py-2 px-3">
                          {course}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">No courses listed</p>
                    )}
                  </div>
        </CardContent>
      </Card>

      {/* Availability */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Availability
          </h2>
          <div className="space-y-3">
            {Array.isArray(tutor.availability) && tutor.availability.length > 0 ? (
              tutor.availability.map((slot, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground break-words">{slot}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No availability specified</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Credentials */}
      {tutor.credentials && (
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Award className="h-5 w-5" />
              Credentials
            </h2>
            <p className="text-foreground leading-relaxed break-words">{tutor.credentials}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};