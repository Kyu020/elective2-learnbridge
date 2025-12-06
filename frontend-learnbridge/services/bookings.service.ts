// services/bookings.service.ts
import { Booking, BookingsData } from '@/interfaces/booking.interface';

class BookingsService {
  private baseUrl = 'http://localhost:5000/api';

  private getToken(): string {
    if (typeof window === 'undefined') {
      throw new Error("Cannot access localStorage on server side");
    }

    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error("No authentication token found");
    }

    return token;
  }

  private async fetchWithAuth<T>(url: string, options: RequestInit = {}): Promise<T> {
    const token = this.getToken();

    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText || response.statusText}`);
    }

    return response.json();
  }

  async fetchBookings(): Promise<BookingsData> {
    let sentBookings: Booking[] = [];
    let receivedBookings: Booking[] = [];
    let isTutor = false;

    // Fetch sent bookings (student requests)
    try {
      const sentRes = await this.fetchWithAuth<{ body?: Booking[]; bookings?: Booking[]; requests?: Booking[] }>(
        `${this.baseUrl}/request/getstudentrequests`
      );
      
      // Handle different response structures and map data
      let rawBookings: any[] = [];
      if (Array.isArray(sentRes.body)) {
        rawBookings = sentRes.body;
      } else if (Array.isArray(sentRes.bookings)) {
        rawBookings = sentRes.bookings;
      } else if (Array.isArray(sentRes.requests)) {
        rawBookings = sentRes.requests;
      } else if (Array.isArray(sentRes)) {
        rawBookings = sentRes;
      }
      
      // Map bookings to ensure course/subject compatibility and user info
      sentBookings = rawBookings.map((booking: any) => {
        // Preserve tutorInfo as-is - backend already provides correct structure
        // Just ensure name field exists for frontend compatibility
        const tutorInfo = booking.tutorInfo ? {
          ...booking.tutorInfo,
          name: booking.tutorInfo.name || booking.tutorInfo.username || ""
        } : null;

        return {
          ...booking,
          course: booking.course || booking.subject || "",
          subject: booking.subject || booking.course || "",
          tutorInfo,
          studentInfo: booking.studentInfo || null
        };
      });
    } catch (error: any) {
      if (error.message.includes('404') || error.message.includes('No bookings found')) {
        // No sent bookings found - this is fine
        console.log('No sent bookings found');
      } else {
        console.error('Failed to fetch sent bookings:', error);
        throw new Error(`Failed to fetch sent bookings: ${error.message}`);
      }
    }

    // Try to fetch received bookings (will fail if user is not a tutor)
    try {
      const receivedRes = await this.fetchWithAuth<{ body?: Booking[]; bookings?: Booking[]; requests?: Booking[] }>(
        `${this.baseUrl}/request/getrequests`
      );
      
      // Handle different response structures and map data
      let rawBookings: any[] = [];
      if (Array.isArray(receivedRes.body)) {
        rawBookings = receivedRes.body;
      } else if (Array.isArray(receivedRes.bookings)) {
        rawBookings = receivedRes.bookings;
      } else if (Array.isArray(receivedRes.requests)) {
        rawBookings = receivedRes.requests;
      } else if (Array.isArray(receivedRes)) {
        rawBookings = receivedRes;
      }
      
      // Map bookings to ensure course/subject compatibility and user info
      receivedBookings = rawBookings.map((booking: any) => {
        // Preserve studentInfo as-is - backend already provides correct structure
        // Just ensure name field exists for frontend compatibility
        const studentInfo = booking.studentInfo ? {
          ...booking.studentInfo,
          name: booking.studentInfo.name || booking.studentInfo.username || ""
        } : null;

        return {
          ...booking,
          course: booking.course || booking.subject || "",
          subject: booking.subject || booking.course || "",
          studentInfo,
          tutorInfo: booking.tutorInfo || null
        };
      });
      
      isTutor = true;
    } catch (error: any) {
      if (error.message.includes('403') || error.message.includes('Unauthorized') || error.message.includes('Not a tutor')) {
        // User is not a tutor - this is expected
        isTutor = false;
        console.log('User is not a tutor, cannot fetch received bookings');
      } else if (error.message.includes('404') || error.message.includes('No bookings found')) {
        // No received bookings found - this is fine
        isTutor = true; // User is a tutor but has no bookings
        console.log('No received bookings found');
      } else {
        console.error('Failed to fetch received bookings:', error);
        throw new Error(`Failed to fetch received bookings: ${error.message}`);
      }
    }

    return {
      sentBookings,
      receivedBookings,
      isTutor
    };
  }

  async updateBookingStatus(id: string, status: Booking["status"], tutorComment?: string): Promise<Booking> {
    const data = await this.fetchWithAuth<{ body?: Booking; booking?: Booking; request?: Booking }>(
      `${this.baseUrl}/request/updaterequeststatus/${id}`,
      {
        method: 'PUT',
        body: JSON.stringify({ status, tutorComment }),
      }
    );
    
    // Handle different response structures and map data
    const rawBooking = data.body || data.booking || data.request || data as Booking;
    
    // Preserve user info structure
    const studentInfo = (rawBooking as any).studentInfo ? {
      ...(rawBooking as any).studentInfo,
      username: (rawBooking as any).studentInfo.username || (rawBooking as any).studentInfo.name || "",
      name: (rawBooking as any).studentInfo.name || (rawBooking as any).studentInfo.username || "",
      program: (rawBooking as any).studentInfo.program || "",
      profilePicture: (rawBooking as any).studentInfo.profilePicture || null
    } : null;
    
    const tutorInfo = (rawBooking as any).tutorInfo ? {
      ...(rawBooking as any).tutorInfo,
      username: (rawBooking as any).tutorInfo.username || (rawBooking as any).tutorInfo.name || "",
      name: (rawBooking as any).tutorInfo.name || (rawBooking as any).tutorInfo.username || "",
      program: (rawBooking as any).tutorInfo.program || "",
      profilePicture: (rawBooking as any).tutorInfo.profilePicture || null
    } : null;
    
    return {
      ...rawBooking,
      course: (rawBooking as any).course || (rawBooking as any).subject || "",
      subject: (rawBooking as any).subject || (rawBooking as any).course || "",
      studentInfo,
      tutorInfo
    } as Booking;
  }
}

export const bookingsService = new BookingsService();