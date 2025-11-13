// components/bookings/SentBookingCard.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Send, Calendar, Clock, User, DollarSign, BookOpen, MessageSquare } from "lucide-react";
import { Booking } from '@/interfaces/bookings.interfaces';
import { formatSessionDate, formatDuration, getStatusColor } from '@/lib/booking-utils';

interface SentBookingCardProps {
  booking: Booking;
}

export const SentBookingCard = ({ booking }: SentBookingCardProps) => {
  return (
    <Card className="transition-shadow hover:shadow-lg">
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex items-center gap-4 sm:block sm:w-16">
            <div className="h-12 w-12 sm:h-16 sm:w-16 flex-shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center text-white text-sm sm:text-lg font-bold">
              {booking.tutorInfo?.username?.charAt(0)?.toUpperCase() || 'T'}
            </div>
            {/* Mobile status badge */}
            <Badge className={`sm:hidden ${getStatusColor(booking.status)}`}>
              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
            </Badge>
          </div>
          <div className="flex-1 min-w-0">
            <div className="mb-2">
              <div className="flex items-center gap-2 mb-1">
                <Send className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <h3 className="font-semibold text-foreground truncate">To: {booking.tutorInfo?.username || "Unknown Tutor"}</h3>
              </div>
              <p className="text-sm text-muted-foreground truncate">
                {booking.tutorInfo?.program || "No program"} • {booking.tutorInfo?.specialization || "No specialization"}
              </p>
              
              {/* Session Details */}
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-blue-500 flex-shrink-0" />
                  <span className="font-medium">Subject:</span>
                  <Badge variant="outline" className="ml-1 truncate min-w-0">{booking.subject}</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <span className="font-medium">Duration:</span>
                  <span>{formatDuration(booking.duration)}</span>
                </div>
                <div className="flex items-center gap-2 sm:col-span-2">
                  <Calendar className="h-4 w-4 text-purple-500 flex-shrink-0" />
                  <span className="font-medium flex-shrink-0">Session:</span>
                  <span className="truncate ml-1">{formatSessionDate(booking.sessionDate)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-green-600 flex-shrink-0" />
                  <span className="font-medium">Price:</span>
                  <span>₱{booking.price.toFixed(2)}</span>
                </div>
              </div>

              {/* Student Comment */}
              {booking.comment && (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-start gap-2">
                    <MessageSquare className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-700">Your Note:</p>
                      <p className="text-sm text-gray-600 mt-1 break-words">{booking.comment}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Tutor Comment */}
              {booking.tutorComment && (
                <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-start gap-2">
                    <MessageSquare className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-blue-700">Tutor's Response:</p>
                      <p className="text-sm text-blue-600 mt-1 break-words">{booking.tutorComment}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between mt-4">
              <Badge className={`hidden sm:inline-block ${getStatusColor(booking.status)}`}>
                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
              </Badge>
              <span className="text-xs text-muted-foreground">
                Sent: {new Date(booking.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};