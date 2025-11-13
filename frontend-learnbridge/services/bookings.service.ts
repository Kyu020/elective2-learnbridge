import { Booking, BookingsData } from '@/interfaces/bookings.interfaces';

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
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async fetchBookings(): Promise<BookingsData> {
    const token = this.getToken();
    
    let sentBookings: Booking[] = [];
    let receivedBookings: Booking[] = [];
    let isTutor = false;

    // Fetch sent bookings (student requests)
    try {
      const sentRes = await this.fetchWithAuth<{ body: Booking[] }>('/request/getstudentrequests');
      sentBookings = sentRes.body || [];
    } catch (error: any) {
      if (!error.message.includes('404')) {
        throw new Error(`Failed to fetch sent bookings: ${error.message}`);
      }
      // 404 means no sent bookings - this is fine
    }

    // Try to fetch received bookings (will fail if user is not a tutor)
    try {
      const receivedRes = await this.fetchWithAuth<{ body: Booking[] }>('/request/getrequests');
      receivedBookings = receivedRes.body || [];
      isTutor = true;
    } catch (error: any) {
      if (error.message.includes('403')) {
        // User is not a tutor - this is expected
        isTutor = false;
      } else if (!error.message.includes('404')) {
        throw new Error(`Failed to fetch received bookings: ${error.message}`);
      }
      // 404 means no received bookings - this is fine
    }

    return {
      sentBookings,
      receivedBookings,
      isTutor
    };
  }

  async updateBookingStatus(id: string, status: Booking["status"], tutorComment?: string): Promise<Booking> {
    const data = await this.fetchWithAuth<{ body: Booking }>(`/request/updaterequeststatus/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status, tutorComment }),
    });
    
    return data.body;
  }
}

export const bookingsService = new BookingsService();