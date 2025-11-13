import { useState, useEffect } from 'react';
import { bookingsService } from '@/services/bookings.service';
import { Booking, BookingsData } from '@/interfaces/bookings.interfaces';
import { useToast } from '@/hooks/use-toast';

interface UseBookingsReturn extends BookingsData {
  loading: boolean;
  sentError: string | null;
  receivedError: string | null;
  updatingStatus: boolean;
  refetchBookings: () => Promise<void>;
  updateBookingStatus: (id: string, status: Booking["status"], tutorComment?: string) => Promise<void>;
}

export const useBookings = (): UseBookingsReturn => {
  const [bookingsData, setBookingsData] = useState<BookingsData>({
    sentBookings: [],
    receivedBookings: [],
    isTutor: false,
  });
  const [loading, setLoading] = useState(true);
  const [sentError, setSentError] = useState<string | null>(null);
  const [receivedError, setReceivedError] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const { toast } = useToast();

  const fetchBookings = async (): Promise<void> => {
    try {
      setLoading(true);
      setSentError(null);
      setReceivedError(null);

      const data = await bookingsService.fetchBookings();
      setBookingsData(data);

      // Show success toasts
      if (data.sentBookings.length > 0) {
        toast({
          title: "Bookings loaded",
          description: `Found ${data.sentBookings.length} sent booking(s)`,
        });
      }
      if (data.isTutor && data.receivedBookings.length > 0) {
        toast({
          title: "Tutor bookings loaded",
          description: `Found ${data.receivedBookings.length} received booking(s)`,
        });
      }
    } catch (error: any) {
      console.error("Error fetching bookings:", error);
      
      if (error.message.includes('sent bookings')) {
        setSentError(error.message);
        toast({
          title: "Error loading sent bookings",
          description: "Failed to load your sent requests",
          variant: "destructive",
        });
      } else if (error.message.includes('received bookings')) {
        setReceivedError(error.message);
        toast({
          title: "Error loading received bookings",
          description: "Failed to load tutor requests",
          variant: "destructive",
        });
      } else {
        setSentError("Failed to fetch bookings");
        setReceivedError("Failed to fetch bookings");
        toast({
          title: "Error",
          description: "Failed to load bookings. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (id: string, status: Booking["status"], tutorComment?: string): Promise<void> => {
    try {
      setUpdatingStatus(true);

      // Show loading toast for actions that might take time
      if (status === "accepted" || status === "completed") {
        toast({
          title: "Updating booking...",
          description: "Please wait while we process your request",
        });
      }

      const updatedBooking = await bookingsService.updateBookingStatus(id, status, tutorComment);

      // Update local state
      setBookingsData(prev => ({
        ...prev,
        receivedBookings: prev.receivedBookings.map(booking =>
          booking._id === id ? updatedBooking : booking
        ),
      }));

      // Show success toast based on action
      let toastTitle = "";
      let toastDescription = "";
      
      switch (status) {
        case "accepted":
          toastTitle = "Booking Accepted";
          toastDescription = "You have successfully accepted the booking request";
          break;
        case "completed":
          toastTitle = "Booking Completed";
          toastDescription = "The session has been marked as completed";
          break;
        case "rejected":
          toastTitle = "Booking Rejected";
          toastDescription = "You have rejected the booking request";
          break;
        default:
          toastTitle = "Status Updated";
          toastDescription = "Booking status has been updated";
      }
      
      toast({
        title: toastTitle,
        description: toastDescription,
      });

    } catch (error: any) {
      console.error("Error updating booking status:", error);
      
      let errorMessage = "Failed to update booking status";
      if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Update Failed",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    } finally {
      setUpdatingStatus(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return {
    ...bookingsData,
    loading,
    sentError,
    receivedError,
    updatingStatus,
    refetchBookings: fetchBookings,
    updateBookingStatus,
  };
};