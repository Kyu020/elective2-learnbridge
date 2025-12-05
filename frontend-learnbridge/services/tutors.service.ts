// services/tutors.service.ts
import { Tutor, TutorFormData, ScheduleFormData } from '@/interfaces/tutors.interfaces';

class TutorsService {
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

  async fetchTutors(): Promise<Tutor[]> {
    const data = await this.fetchWithAuth<{ tutors: any[] }>(`${this.baseUrl}/tutor/getalltutor`);
    
    // Format tutors to ensure they have required properties
    return data.tutors?.map((tutor: any) => ({
      studentId: tutor.studentId || tutor._id || "",
      name: tutor.name || tutor.username || "Unknown Tutor",
      bio: tutor.bio || "No bio available",
      course: Array.isArray(tutor.subjects) ? tutor.subjects : [],
      hourlyRate: tutor.hourlyRate || 0,
      availability: Array.isArray(tutor.availability) ? tutor.availability : [],
      credentials: tutor.credentials || "",
      favoriteCount: tutor.favoriteCount || 0,
      createdAt: tutor.createdAt,
      updatedAt: tutor.updatedAt
    })) || [];
  }

  async fetchFavorites(): Promise<string[]> {
    const data = await this.fetchWithAuth<{ favorites: any[] }>(`${this.baseUrl}/favorites/getfave`);
    return data.favorites
      ?.filter((fav: any) => fav.tutorId)
      .map((fav: any) => fav.tutorId) || [];
  }

  async verifyTutorProfile(): Promise<{ tutorProfile: Tutor | null }> {
    return this.fetchWithAuth<{ tutorProfile: Tutor | null }>(`${this.baseUrl}/tutor/verifytutorprofile`);
  }

  async toggleTutorMode(studentId: string, isTutor: boolean): Promise<void> {
    await this.fetchWithAuth(`${this.baseUrl}/tutor/toggletutormode/${studentId}`, {
      method: 'PUT',
      body: JSON.stringify({ isTutor }),
    });
  }

  async createTutorProfile(formData: TutorFormData): Promise<{ tutor: Tutor }> {
    // FIX: Properly process the form data
    const formattedData = {
      bio: formData.bio,
      subjects: formData.course.split(",").map((s: string) => s.trim()).filter((s: string) => s),
      availability: formData.availability.split(",").map((a: string) => a.trim()).filter((a: string) => a),
      hourlyRate: parseInt(formData.hourlyRate) || 0,
      credentials: formData.credentials,
    };

    return this.fetchWithAuth<{ tutor: Tutor }>(`${this.baseUrl}/tutor/createtutor`, {
      method: 'POST',
      body: JSON.stringify(formattedData),
    });
  }

  async updateTutorProfile(formData: TutorFormData): Promise<{ updatedProfile: Tutor }> {
    // FIX: Properly process the form data
    const formattedData = {
      bio: formData.bio,
      subjects: formData.course.split(",").map((s: string) => s.trim()).filter((s: string) => s),
      availability: formData.availability.split(",").map((a: string) => a.trim()).filter((a: string) => a),
      hourlyRate: parseInt(formData.hourlyRate) || 0,
      credentials: formData.credentials,
    };

    return this.fetchWithAuth<{ updatedProfile: Tutor }>(`${this.baseUrl}/tutor/updatetutor`, {
      method: 'PUT',
      body: JSON.stringify(formattedData),
    });
  }

  async scheduleSession(scheduleData: ScheduleFormData & { tutorId: string }): Promise<void> {
    const formattedData = {
      tutorId: scheduleData.tutorId,
      sessionDate: new Date(`${scheduleData.sessionDate}T${scheduleData.time}`).toISOString(),
      duration: parseInt(scheduleData.duration),
      price: parseFloat(scheduleData.price),
      subject: scheduleData.subject,
      comment: scheduleData.comment || "I would like to schedule a tutoring session"
    };

    await this.fetchWithAuth(`${this.baseUrl}/request/sendrequest`, {
      method: 'POST',
      body: JSON.stringify(formattedData),
    });
  }

  async addFavorite(tutorId: string): Promise<void> {
    await this.fetchWithAuth(`${this.baseUrl}/favorites/addfave`, {
      method: 'POST',
      body: JSON.stringify({ tutorId }),
    });
  }

  async removeFavorite(tutorId: string): Promise<void> {
    await this.fetchWithAuth(`${this.baseUrl}/favorites/removefave`, {
      method: 'POST',
      body: JSON.stringify({ tutorId }),
    });
  }
}

export const tutorsService = new TutorsService();