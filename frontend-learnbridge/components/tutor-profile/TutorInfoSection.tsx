import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Calendar, Clock, Award } from "lucide-react";
import { Tutor } from '@/interfaces/tutor-profile.interfaces';

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
            {tutor.subjects.map((subject) => (
              <Badge key={subject} variant="secondary" className="text-sm py-2 px-3">
                {subject}
              </Badge>
            ))}
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
            {tutor.availability.map((slot, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-foreground break-words">{slot}</span>
              </div>
            ))}
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