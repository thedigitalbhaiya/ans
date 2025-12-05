
export interface Student {
  name: string;
  admissionNo: string;
  session: string;
  rollNo: string;
  class: string; // e.g., "X"
  section: string; // e.g., "A"
  dob: string;
  gender: string;
  bloodGroup: string;
  fatherName: string;
  motherName: string;
  mobile: string;
  address: string;
  religion: string;
  category: string;
  avatar: string;
  profilePic?: string; // Base64 string or URL
  stats: {
    attendance: string;
    grade: string;
    rank: string;
  };
  feeHistory: FeeRecord[];
}

export interface AdminUser {
  id: number;
  name: string;
  username: string;
  password: string; // In real app, this should be hashed
  role: 'Super Admin' | 'Staff' | 'Teacher';
  assignedClass?: string; // Only for Teacher
  assignedSection?: string; // Only for Teacher
  photo?: string;
  mobile: string;
}

export interface SchoolSettings {
  schoolName: string;
  schoolAddress: string;
  contactNumber: string;
  email: string;
  logoUrl: string;
  currentSession: string;
  totalTeachers: number; // New field
  
  // Feature Toggles
  enableStudentLogin: boolean;
  showResults: boolean;
  admissionsOpen: boolean;
  enableOnlineFees: boolean;
  siblingLoginEnabled: boolean;
  enableHomework: boolean; // New Toggle
}

// FORMAT: "CLASS-SECTION": "URL" (e.g., "X-A": "https://...")
export type SocialLinksMap = Record<string, string>;

export interface FlashNotice {
  isVisible: boolean;
  title: string;
  message: string;
  targetAudience: string; // "ALL" or specific class name like "X", "Nursery"
  actionLink?: string; // Optional URL
}

export interface NotificationItem {
  id: string;
  type: 'feedback' | 'leave' | 'admission';
  message: string;
  time: string; // ISO string or Date string
  isRead: boolean;
  link: string;
}

export interface Homework {
  id: number;
  targetClass: string; // "10", "X", "Nursery"
  subject: string;
  title: string;
  description: string;
  dueDate: string; // YYYY-MM-DD
  postedDate: string; // YYYY-MM-DD
  status: 'pending' | 'completed'; // Kept for UI state tracking logic in Student View
  color?: string; // UI Helper
  icon?: any; // UI Helper
}

export interface Notice {
  id: number;
  title: string;
  date: string; // YYYY-MM-DD format for sorting
  category: 'Academic' | 'Event' | 'Holiday' | 'General' | 'Exam';
  content: string;
  isPublished: boolean;
  icon?: any;
  color?: string;
  bg?: string;
}

export interface Post {
  id: number;
  author: string;
  role: string;
  content: string;
  timestamp: string;
  likes: number;
}

export interface TimetableEntry {
  period: number; // 1 to 8
  time: string;
  endTime: string;
  subject: string;
  room: string;
  teacher: string;
  type: 'lecture' | 'lab' | 'break' | 'active';
}

export interface WeeklySchedule {
  [key: string]: TimetableEntry[];
}
// Timetable per class, e.g., { "X-A": WeeklySchedule }
export type SchoolTimetable = Record<string, WeeklySchedule>;


export interface AttendanceRecord {
  date: string;
  status: 'Present' | 'Absent' | 'Late' | 'Holiday';
}

// Map of [dateString]: { [studentId]: status }
export type AttendanceRecords = Record<string, Record<string, 'present' | 'absent' | 'late'>>;


export interface FeeRecord {
  id: number;
  month: string;
  amount: string;
  status: 'Paid' | 'Pending';
  date: string;
  invoice: string;
  paymentMethod?: 'Online' | 'Offline';
}

export type FeeStructure = Record<string, number>;

export interface ExamResult {
  name: string; // Subject Name
  score: number;
  grade: string;
  color: string;
}

// Map of [studentId]: { [session]: { [examType]: ExamResult[] } }
export type ExamResultsData = Record<string, Record<string, Record<string, ExamResult[]>>>;

// --- GALLERY & MAGAZINE TYPES ---
export interface Album {
  id: number;
  title: string;
  date: string;
  coverUrl: string;
  images: string[]; // Array of image URLs
  category: string;
}

export interface Magazine {
  id: number;
  title: string;
  month: string;
  coverUrl: string;
  pdfUrl: string; // URL to the PDF file
  isPublished: boolean;
}

export interface LeaveApplication {
  id: number;
  studentId: string;
  studentName: string;
  class: string;
  rollNo: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  subject: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  appliedDate: string;
}

// Deprecated (kept for backward compatibility if needed, but LeaveApplication is preferred)
export interface ApplicationRecord {
  id: number;
  studentId: string;
  type: string;
  from: string;
  to: string;
  status: 'Approved' | 'Rejected' | 'Pending';
  color: string;
}

export interface AdmissionApplication {
  id: number;
  studentName: string;
  admissionForClass: string;
  fatherName: string;
  mobile: string;
  previousSchool?: string; // New field
  address?: string; // New field
  status: 'Received' | 'In Progress' | 'Contacted' | 'Admitted' | 'Rejected';
  date: string;
}

export interface Feedback {
  id: number;
  studentId: string;
  studentName: string;
  class: string;
  mobile: string;
  type: 'Complaint' | 'Suggestion' | 'Appreciation' | 'Other';
  message: string;
  date: string;
  status: 'Unread' | 'Read' | 'Resolved';
}


export enum Theme {
  LIGHT = 'light',
  DARK = 'dark',
}
