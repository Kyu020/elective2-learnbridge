export interface User {
    _id: string;
    username: string;
    email: string;
    role: string;
}

export interface Resource {
    _id: string;
    title: string;
    program: string;
    difficulty?: string;
    uploader: string;
    favoriteCount: number;
    createdAt: string;
}

export interface Tutor{ 
    studentId: string;
    name: string;
    subjects: string[];
    rating: number;
    reviews: number;
    hourlyRate: number;
    favoriteCount: number;
}

export interface DashboardData {
    user : User | null;
    resources: Resource[];
    tutors: Tutor[];
}