
import { CheckCircle2, Circle, Trophy, Calendar, Bell, AlertTriangle, BookOpen, Clock, FileText, User, Users, BookUser, MapPin, Phone, Droplets, Cake } from 'lucide-react';
import { Homework, TimetableEntry, WeeklySchedule, Notice, FeeRecord, ExamResult, GalleryItem, ApplicationRecord, Student } from './types';

// --- STUDENT PROFILE DATA ---
export const studentProfile: Student = {
  name: "Khushter Rahmani",
  admissionNo: "ANS/2015/892",
  session: "2025-26",
  rollNo: "24",
  class: "X-A",
  dob: "15 Aug 2010",
  gender: "Male",
  bloodGroup: "B+",
  fatherName: "Md Mushfique Anwer Rahmani",
  motherName: "Khurshedi Jahan",
  mobile: "9973640022",
  address: "Bahadurganj, India",
  religion: "Islam",
  category: "General",
  avatar: "https://ui-avatars.com/api/?name=Khushter+Rahmani&background=0f172a&color=fff&size=200",
  stats: {
    attendance: "87.6%",
    grade: "A1",
    rank: "5th"
  }
};

export const siblingProfile: Student = {
  name: "Ayan Rahmani",
  admissionNo: "ANS/2021/456",
  session: "2025-26",
  rollNo: "12",
  class: "V-B",
  dob: "22 Sep 2015",
  gender: "Male",
  bloodGroup: "O+",
  fatherName: "Md Mushfique Anwer Rahmani",
  motherName: "Khurshedi Jahan",
  mobile: "9973640022",
  address: "Bahadurganj, India",
  religion: "Islam",
  category: "General",
  avatar: "https://ui-avatars.com/api/?name=Ayan+Rahmani&background=3b82f6&color=fff&size=200",
  stats: {
    attendance: "92.4%",
    grade: "A+",
    rank: "2nd"
  }
};

export const studentsList: Student[] = [studentProfile, siblingProfile];

// --- DAILY NOTICE ---
export const dailyNotice = {
  title: "Winter Uniform Update",
  message: "Effective Nov 1st, winter uniform is mandatory. Please ensure blazers are ready.",
  date: "Today, 8:00 AM",
  priority: "high",
  author: "Principal's Desk"
};

// --- BIRTHDAY DATA ---
export const birthdays = [
  { name: "Aliza Naz", class: "Nursery", image: "https://ui-avatars.com/api/?name=Aliza+Naz&background=ff69b4&color=fff", date: "Today" },
  { name: "Rohan Kumar", class: "VIII-B", image: "https://ui-avatars.com/api/?name=Rohan+Kumar&background=3b82f6&color=fff", date: "Today" },
  { name: "Sara Khan", class: "X-A", image: "https://ui-avatars.com/api/?name=Sara+Khan&background=8b5cf6&color=fff", date: "Tomorrow" },
  { name: "Zainab Ali", class: "V-C", image: "https://ui-avatars.com/api/?name=Zainab+Ali&background=10b981&color=fff", date: "Today" }
];

// --- ATTENDANCE DATA ---
export const attendanceData = {
  summary: [
    { name: 'Present', value: 85, color: '#34C759' },
    { name: 'Absent', value: 15, color: '#FF3B30' },
  ],
  stats: {
    total: 24,
    present: 22,
    absent: 1,
    late: 1
  }
};

// --- HOMEWORK DATA ---
export const homeworkList: Homework[] = [
  { id: 1, subject: 'English', title: 'Chapter 5 Summary', due: 'Tomorrow', status: 'pending', color: 'bg-blue-500', icon: BookOpen },
  { id: 2, subject: 'Mathematics', title: 'Algebra Worksheet 4B', due: '25 Oct', status: 'pending', color: 'bg-indigo-500', icon: FileText },
  { id: 3, subject: 'Physics', title: 'Lab Report: Motion', due: '26 Oct', status: 'completed', color: 'bg-purple-500', icon: Clock },
  { id: 4, subject: 'History', title: 'World War II Timeline', due: '28 Oct', status: 'pending', color: 'bg-orange-500', icon: Calendar },
  { id: 5, subject: 'Computer Science', title: 'React Component Basics', due: '30 Oct', status: 'completed', color: 'bg-teal-500', icon: BookUser },
];

// --- TIMETABLE DATA (WEEKLY) ---
export const timetableSchedule: WeeklySchedule = {
  "Monday": [
    { time: '09:00 AM', endTime: '09:45 AM', subject: 'Maths', room: '302', teacher: 'Mr. Anderson', type: 'lecture' },
    { time: '10:00 AM', endTime: '10:45 AM', subject: 'English', room: '101', teacher: 'Mrs. Davis', type: 'lecture' },
    { time: '11:00 AM', endTime: '11:45 AM', subject: 'Physics', room: 'Lab B', teacher: 'Dr. Brown', type: 'lab' },
  ],
  "Tuesday": [
    { time: '09:00 AM', endTime: '09:45 AM', subject: 'History', room: '204', teacher: 'Mr. Wilson', type: 'lecture' },
    { time: '10:00 AM', endTime: '10:45 AM', subject: 'Chemistry', room: 'Lab A', teacher: 'Ms. White', type: 'lab' },
    { time: '11:00 AM', endTime: '11:45 AM', subject: 'Maths', room: '302', teacher: 'Mr. Anderson', type: 'lecture' },
  ],
  "Wednesday": [
    { time: '09:00 AM', endTime: '09:45 AM', subject: 'English', room: '101', teacher: 'Mrs. Davis', type: 'lecture' },
    { time: '10:00 AM', endTime: '10:45 AM', subject: 'Computer Sc.', room: 'Comp Lab', teacher: 'Ms. Clark', type: 'lab' },
    { time: '11:00 AM', endTime: '11:45 AM', subject: 'Sports', room: 'Ground', teacher: 'Coach', type: 'active' },
  ],
  "Thursday": [
    { time: '09:00 AM', endTime: '09:45 AM', subject: 'English Lit.', room: '101', teacher: 'Mrs. Davis', type: 'lecture' },
    { time: '10:00 AM', endTime: '10:45 AM', subject: 'History', room: '204', teacher: 'Mr. Wilson', type: 'lecture' },
    { time: '10:30 AM', endTime: '11:15 AM', subject: 'Mathematics', room: '302', teacher: 'Mr. Anderson', type: 'active' },
    { time: '11:30 AM', endTime: '12:15 PM', subject: 'Physics Lab', room: 'Lab B', teacher: 'Dr. Brown', type: 'lab' },
    { time: '01:00 PM', endTime: '01:45 PM', subject: 'Lunch Break', room: 'Cafeteria', teacher: '-', type: 'break' },
    { time: '02:00 PM', endTime: '02:45 PM', subject: 'Computer Sc.', room: 'Comp Lab', teacher: 'Ms. Clark', type: 'lab' },
  ],
  "Friday": [
    { time: '09:00 AM', endTime: '09:45 AM', subject: 'Maths', room: '302', teacher: 'Mr. Anderson', type: 'lecture' },
    { time: '10:00 AM', endTime: '10:45 AM', subject: 'Physics', room: 'Lab B', teacher: 'Dr. Brown', type: 'lecture' },
    { time: '11:00 AM', endTime: '12:00 PM', subject: 'Jumma Break', room: '-', teacher: '-', type: 'break' },
  ],
  "Saturday": [
    { time: '09:00 AM', endTime: '09:45 AM', subject: 'Activity', room: 'Hall', teacher: 'All', type: 'active' },
    { time: '10:00 AM', endTime: '11:30 AM', subject: 'Weekly Test', room: '302', teacher: 'Mr. Anderson', type: 'lecture' },
  ],
  "Sunday": []
};

// --- NOTICES DATA ---
export const noticesList: Notice[] = [
  { id: 1, title: 'Annual Sports Day Registration', date: 'Upcoming', category: 'Event', content: 'Registration for the annual sports meet is now open for all students. Please collect forms from the office.', icon: Trophy, color: 'text-orange-500', bg: 'bg-orange-500/10' },
  { id: 2, title: 'Mid-Term Examination Schedule', date: 'Next Month', category: 'Academic', content: 'The final datesheet for mid-term exams has been released. Exams start from Nov 10.', icon: Calendar, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { id: 3, title: 'Holiday Announcement: Diwali', date: 'Upcoming', category: 'Holiday', content: 'The school will remain closed from Oct 31st to Nov 4th on account of Diwali.', icon: Bell, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  { id: 4, title: 'Library Books Return', date: 'Urgent', category: 'General', content: 'All students must return borrowed books before the term break.', icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-500/10' },
];

// Helper to get formatted date string for current month
const getDynamicDate = (dayOffset: number) => {
  const date = new Date();
  date.setDate(date.getDate() + dayOffset);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export const calendarEvents = [
  { date: getDynamicDate(2), type: 'event', title: 'Sports Day Reg.' },
  { date: getDynamicDate(5), type: 'holiday', title: 'Local Holiday' },
  { date: getDynamicDate(10), type: 'exam', title: 'Unit Test' },
  { date: getDynamicDate(-2), type: 'event', title: 'Art Competition' },
  { date: getDynamicDate(15), type: 'holiday', title: 'Festival Break' }
];

// --- RESULTS DATA (Now grouped by Terms) ---
export const examResultsData = {
  "Mid-Term": [
    { name: 'Mathematics', score: 92, grade: 'A1', color: 'bg-blue-500' },
    { name: 'Science', score: 88, grade: 'A2', color: 'bg-green-500' },
    { name: 'English', score: 85, grade: 'A2', color: 'bg-orange-500' },
    { name: 'Computer Sc.', score: 95, grade: 'A1', color: 'bg-purple-500' },
    { name: 'Social Studies', score: 78, grade: 'B1', color: 'bg-red-500' },
  ],
  "Unit Test 1": [
    { name: 'Mathematics', score: 85, grade: 'A2', color: 'bg-blue-500' },
    { name: 'Science', score: 90, grade: 'A1', color: 'bg-green-500' },
    { name: 'English', score: 82, grade: 'B1', color: 'bg-orange-500' },
    { name: 'Computer Sc.', score: 98, grade: 'A1', color: 'bg-purple-500' },
    { name: 'Social Studies', score: 80, grade: 'B1', color: 'bg-red-500' },
  ],
  "Finals": [
    // Future data or empty
  ]
};

// --- FEES DATA ---
export const feeHistory: FeeRecord[] = [
  { id: 1, month: 'October 2025', amount: '₹ 4,500', status: 'Pending', date: 'Due Oct 10', invoice: '#INV-2025-010' },
  { id: 2, month: 'September 2025', amount: '₹ 4,500', status: 'Paid', date: 'Paid Sep 05', invoice: '#INV-2025-009' },
  { id: 3, month: 'August 2025', amount: '₹ 4,500', status: 'Paid', date: 'Paid Aug 02', invoice: '#INV-2025-008' },
  { id: 4, month: 'July 2025', amount: '₹ 4,500', status: 'Paid', date: 'Paid Jul 04', invoice: '#INV-2025-007' },
];

// --- GALLERY DATA ---
export const galleryImages: GalleryItem[] = [
  { id: 1, title: 'Science Exhibition 2025', category: 'Events', url: 'https://images.unsplash.com/photo-1564939558297-fc396f18e5c7?auto=format&fit=crop&q=80&w=800' },
  { id: 2, title: 'Sports Day Winners', category: 'Sports', url: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&q=80&w=800' },
  { id: 3, title: 'Annual Day Celebrations', category: 'Culture', url: 'https://images.unsplash.com/photo-1514533450685-4493e01d1fdc?auto=format&fit=crop&q=80&w=800' },
  { id: 4, title: 'Plantation Drive', category: 'Social', url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800' },
];

// --- APPLICATION DATA ---
export const applicationHistory: ApplicationRecord[] = [
  { id: 1, type: 'Sick Leave', from: '10 Oct 2025', to: '12 Oct 2025', status: 'Approved', color: 'bg-green-100 text-green-700' },
  { id: 2, type: 'Family Function', from: '24 Sep 2025', to: '25 Sep 2025', status: 'Rejected', color: 'bg-red-100 text-red-700' },
];
