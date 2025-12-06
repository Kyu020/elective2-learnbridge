import { User } from "@/interfaces/user.interface";
import { Resource } from "@/interfaces/resource.interface";
import { Tutor } from "@/interfaces/tutor.interface";
import { DashboardData } from "@/interfaces/dashboard.interface";

class DashboardService {
    private baseUrl = 'http://localhost:5000/api';

    private getToken(): string {
        if (typeof window === 'undefined') {
            throw new Error("Cannot access localStorage on server side");
        }

        const token = localStorage.getItem('token');
        if (!token){
            throw new Error("No auth token found");
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

        return response.json() as Promise <T>;
    }

    async fetchResources(): Promise<Resource[]> {
        const data = await this.fetchWithAuth<{ resources: Resource []}>(`${this.baseUrl}/upload/getallfile`);
        return data.resources || [];
    }

    async fetchTutors(): Promise<Tutor[]> {
        const data = await this.fetchWithAuth<{ tutors: any[]}>(`${this.baseUrl}/tutor/getalltutor`);
        
        // Format tutors to ensure they have required properties, similar to tutors.service.ts
        return data.tutors?.map((tutor: any) => {
            // Use course field from backend
            const courses = Array.isArray(tutor.course) ? tutor.course : [];
            
            return {
                studentId: tutor.studentId || tutor._id || "",
                name: tutor.name || tutor.username || "Unknown Tutor",
                bio: tutor.bio || "No bio available",
                course: courses,
                hourlyRate: tutor.hourlyRate || 0,
                availability: Array.isArray(tutor.availability) ? tutor.availability : [],
                credentials: tutor.credentials || "",
                favoriteCount: tutor.favoriteCount || 0,
                createdAt: tutor.createdAt,
                updatedAt: tutor.updatedAt,
                teachingLevel: tutor.teachingLevel,
                teachingStyle: tutor.teachingStyle,
                modeOfTeaching: tutor.modeOfTeaching,
                profilePicture: tutor.profilePicture,
                ratingAverage: tutor.ratingAverage,
                ratingCount: tutor.ratingCount,
                credibilityScore: tutor.credibilityScore,
                sessionsCompleted: tutor.sessionsCompleted,
                sessionsCancelled: tutor.sessionsCancelled,
                availabilitySlots: tutor.availabilitySlots
            };
        }) || [];
    }  

    async fetchCurrentUser(): Promise<User | null> {
        const data = await this.fetchWithAuth<{user: User | null}>(`${this.baseUrl}/auth/me`);
        return data.user || null;
    }

    async fetchDashboardData(): Promise<DashboardData> {
        const [user, resources, tutors] = await Promise.all([
            this.fetchCurrentUser(),
            this.fetchResources(),
            this.fetchTutors()
        ]);

        return { user, resources, tutors };
    }
}

export const dashboardService = new DashboardService();