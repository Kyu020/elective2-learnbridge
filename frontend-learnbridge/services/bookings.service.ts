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
      
      // Handle different response structures
      if (Array.isArray(sentRes.body)) {
        sentBookings = sentRes.body;
      } else if (Array.isArray(sentRes.bookings)) {
        sentBookings = sentRes.bookings;
      } else if (Array.isArray(sentRes.requests)) {
        sentBookings = sentRes.requests;
      } else if (Array.isArray(sentRes)) {
        sentBookings = sentRes;
      }
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
      
      // Handle different response structures
      if (Array.isArray(receivedRes.body)) {
        receivedBookings = receivedRes.body;
      } else if (Array.isArray(receivedRes.bookings)) {
        receivedBookings = receivedRes.bookings;
      } else if (Array.isArray(receivedRes.requests)) {
        receivedBookings = receivedRes.requests;
      } else if (Array.isArray(receivedRes)) {
        receivedBookings = receivedRes;
      }
      
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
    
    // Handle different response structures
    return data.body || data.booking || data.request || data as Booking;
  }
}

export const bookingsService = new BookingsService();