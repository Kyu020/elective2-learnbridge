export interface StudentInfo {
  _id: string;
  username: string;
  email: string;
  program: string;
  specialization: string;
}

export interface TutorInfo {
  _id: string;
  username: string;
  email: string;
  program: string;
  specialization: string;
}

export interface Booking {
  _id: string;
  studentId: string;
  tutorId: string;
  sessionDate: string;
  duration: number;
  price: number;
  subject: string;
  comment: string;
  tutorComment?: string;
  status: "pending" | "accepted" | "completed" | "rejected" | "cancelled";
  createdAt: string;
  updatedAt: string;
  studentInfo?: StudentInfo;
  tutorInfo?: TutorInfo;
}

export interface BookingsData {
  sentBookings: Booking[];
  receivedBookings: Booking[];
  isTutor: boolean;
}