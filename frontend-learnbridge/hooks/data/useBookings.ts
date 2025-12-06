// hooks/useBookings.ts
import { useState, useEffect } from 'react';
import { Booking, BookingsData } from '@/interfaces/booking.interface';
import { bookingsService } from '@/services/bookings.service';

export const useBookings = () => {
  const [bookingsData, setBookingsData] = useState<BookingsData>({
    sentBookings: [],
    receivedBookings: [],
    isTutor: false
  });
  const [loading, setLoading] = useState(true);
  const [sentError, setSentError] = useState<string | null>(null);
  const [receivedError, setReceivedError] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const fetchBookings = async () => {
    setLoading(true);
    setSentError(null);
    setReceivedError(null);

    try {
      const data = await bookingsService.fetchBookings();
      setBookingsData(data);
    } catch (error: any) {
      console.error('Error fetching bookings:', error);
      setSentError(error.message || 'Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (id: string, status: Booking["status"], tutorComment?: string) => {
    setUpdatingStatus(true);
    try {
      const updatedBooking = await bookingsService.updateBookingStatus(id, status, tutorComment);
      
      // Update the bookings in state
      setBookingsData(prev => ({
        ...prev,
        sentBookings: prev.sentBookings.map(booking =>
          booking._id === id ? { ...booking, ...updatedBooking } : booking
        ),
        receivedBookings: prev.receivedBookings.map(booking =>
          booking._id === id ? { ...booking, ...updatedBooking } : booking
        )
      }));
    } catch (error: any) {
      console.error('Error updating booking status:', error);
      throw error;
    } finally {
      setUpdatingStatus(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return {
    sentBookings: bookingsData.sentBookings,
    receivedBookings: bookingsData.receivedBookings,
    isTutor: bookingsData.isTutor,
    loading,
    sentError,
    receivedError,
    updatingStatus,
    refetchBookings: fetchBookings,
    updateBookingStatus
  };
};