
import { CheckCircle2, Circle, Trophy, Calendar, Bell, AlertTriangle, BookOpen, Clock, FileText, User, Users, BookUser, MapPin, Phone, Droplets, Cake } from 'lucide-react';
import { Homework, WeeklySchedule, Notice, FeeRecord, ExamResult, Album, Magazine, ApplicationRecord, Student, AdmissionApplication, Feedback, ExamResultsData, SchoolTimetable, AttendanceRecords, LeaveApplication, Post, Achievement } from './types';

// --- HELPER: SEED DATA GENERATOR ---

const CLASSES = ["Nursery", "LKG", "UKG", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];
const SECTIONS = ["A", "B", "C"];
// Configured for 3 students per class (1 per section)
const STUDENTS_PER_SECTION = 1; 
const ACADEMIC_MONTHS = ["April", "May", "June", "July", "August", "September", "October", "November", "December", "January", "February", "March"];

const generateFeeHistory = (): FeeRecord[] => {
  // Randomly pay some months
  const paidCount = Math.floor(Math.random() * 8); // 0 to 7 months paid
  return ACADEMIC_MONTHS.slice(0, paidCount).map((month, idx) => ({
    id: Date.now() + Math.random(),
    month: `${month} 2025`,
    amount: "₹ 0", // Placeholder, UI calculates from Context
    status: 'Paid',
    date: `Paid ${month.substring(0,3)} 10`,
    invoice: `#INV-${Math.floor(10000 + Math.random() * 90000)}`,
    paymentMethod: Math.random() > 0.5 ? 'Online' : 'Offline'
  }));
};

const generateStudents = (): Student[] => {
  let students: Student[] = [];
  let globalCounter = 1;

  // Dates for Birthday Demo
  const today = new Date();
  const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);
  const dayAfter = new Date(today); dayAfter.setDate(today.getDate() + 2);

  const getDobForSection = (sec: string) => {
    const year = 2015; // Standard birth year
    let targetDate = today;
    
    if (sec === 'B') targetDate = tomorrow;
    if (sec === 'C') targetDate = dayAfter;

    const m = String(targetDate.getMonth() + 1).padStart(2, '0');
    const d = String(targetDate.getDate()).padStart(2, '0');
    return `${year}-${m}-${d}`;
  };

  CLASSES.forEach((cls) => {
    // Limit to Class X (Remove XI and XII for this reset)
    if (cls === 'XI' || cls === 'XII') return;

    SECTIONS.forEach((sec) => {
      for (let i = 1; i <= STUDENTS_PER_SECTION; i++) {
        // Unique Mobile: 9000000000 + globalCounter
        const mobileSuffix = String(globalCounter).padStart(5, '0');
        const mobile = `90000${mobileSuffix}`;
        
        const student: Student = {
          name: `Student ${cls}-${sec}-${i}`,
          admissionNo: `ANS/2025/${globalCounter}`,
          session: "2025-26",
          rollNo: String(i),
          class: cls,
          section: sec,
          dob: getDobForSection(sec), // Dynamic DOB based on section
          gender: i % 2 === 0 ? "Female" : "Male",
          bloodGroup: "B+",
          fatherName: `Parent of ${cls}-${sec}-${i}`,
          motherName: "Mother Name",
          mobile: mobile,
          address: "Bahadurganj, Bihar",
          religion: "General",
          category: "General",
          avatar: `https://ui-avatars.com/api/?name=${cls}+${sec}+${i}&background=random&size=200`,
          stats: { 
            attendance: `${75 + Math.floor(Math.random() * 25)}%`, 
            grade: ["A1", "A2", "B1"][Math.floor(Math.random() * 3)], 
            rank: `${i}th` 
          },
          feeHistory: generateFeeHistory(),
        };
        students.push(student);
        globalCounter++;
      }
    });
  });
  return students;
};

// --- EXPORTED DATA ---

export const studentsList: Student[] = generateStudents();

// --- ATTENDANCE GENERATOR (NEW) ---
const generateAttendanceRecords = (): AttendanceRecords => {
  const records: AttendanceRecords = {};
  
  // Generate for last 30 days
  const today = new Date();
  for (let i = 0; i < 45; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateKey = date.toISOString().split('T')[0]; // YYYY-MM-DD
    
    // Skip Sundays
    if (date.getDay() === 0) continue;

    const dailyRecord: Record<string, 'present' | 'absent' | 'late'> = {};
    studentsList.forEach(s => {
       const rand = Math.random();
       if (rand > 0.15) dailyRecord[s.admissionNo] = 'present';
       else if (rand > 0.05) dailyRecord[s.admissionNo] = 'absent';
       else dailyRecord[s.admissionNo] = 'late';
    });
    records[dateKey] = dailyRecord;
  }
  return records;
};

export const attendanceRecordsData = generateAttendanceRecords();


// --- DAILY NOTICE ---
export const dailyNotice = {
  title: "Winter Uniform Update",
  message: "Effective Nov 1st, winter uniform is mandatory. Please ensure blazers are ready.",
  date: "Today, 8:00 AM",
  priority: "high",
  author: "Principal's Desk"
};

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

// --- CAMPUS FEED POSTS ---
export const initialCampusPosts: Post[] = [
  {
    id: 1,
    author: 'Principal Office',
    role: 'Admin',
    content: 'We are thrilled to announce that our school basketball team has won the inter-school championship! 🏆 Great job team!',
    timestamp: '2 hours ago',
    likes: 45
  },
  {
    id: 2,
    author: 'Admin',
    role: 'Admin',
    content: 'Reminder: Tomorrow is the last day to submit the Science Fair project proposals. Please ensure all students have their forms signed.',
    timestamp: '5 hours ago',
    likes: 12
  }
];

// --- HOMEWORK DATA ---
export const homeworkList: Homework[] = [
  { 
    id: 1, 
    targetClass: "X",
    subject: 'English', 
    title: 'Chapter 5 Summary', 
    description: 'Read Chapter 5 "The Last Lesson" and write a summary in 200 words. Focus on the main themes.',
    dueDate: '2025-10-25', 
    postedDate: '2025-10-24',
    status: 'pending', 
    color: 'bg-blue-500', 
    icon: BookOpen 
  },
  { 
    id: 2, 
    targetClass: "X",
    subject: 'Mathematics', 
    title: 'Algebra Worksheet 4B', 
    description: 'Complete exercises 1 to 15 on page 45 of your textbook. Show all working.',
    dueDate: '2025-10-25', 
    postedDate: '2025-10-24',
    status: 'pending', 
    color: 'bg-indigo-500', 
    icon: FileText 
  },
  { 
    id: 3, 
    targetClass: "IX",
    subject: 'Physics', 
    title: 'Lab Report: Motion', 
    description: 'Submit the final lab report for the Pendulum experiment conducted last week.',
    dueDate: '2025-10-26', 
    postedDate: '2025-10-22',
    status: 'completed', 
    color: 'bg-purple-500', 
    icon: Clock 
  },
  { 
    id: 4, 
    targetClass: "X",
    subject: 'History', 
    title: 'World War II Timeline', 
    description: 'Create a visual timeline of major events from 1939 to 1945 on a chart paper.',
    dueDate: '2025-10-28', 
    postedDate: '2025-10-20',
    status: 'pending', 
    color: 'bg-orange-500', 
    icon: Calendar 
  },
  { 
    id: 5, 
    targetClass: "V",
    subject: 'Computer Science', 
    title: 'Draw MS Paint', 
    description: 'Draw a scenery using MS Paint tools (Brush, Fill, Shapes) and bring the printout.',
    dueDate: '2025-10-30', 
    postedDate: '2025-10-24',
    status: 'completed', 
    color: 'bg-teal-500', 
    icon: BookUser 
  },
  {
    id: 6,
    targetClass: "V",
    subject: 'Maths',
    title: 'Multiplication Tables',
    description: 'Memorize tables from 12 to 15 for oral test.',
    dueDate: '2025-10-26',
    postedDate: '2025-10-25',
    status: 'pending',
    color: 'bg-indigo-500'
  }
];

const classX_Schedule: WeeklySchedule = {
  "Monday": [
    { period: 1, time: '09:00 AM', endTime: '09:45 AM', subject: 'Maths', room: '302', teacher: 'Mr. Anderson', type: 'lecture' },
    { period: 2, time: '10:00 AM', endTime: '10:45 AM', subject: 'English', room: '101', teacher: 'Mrs. Davis', type: 'lecture' },
    { period: 3, time: '11:00 AM', endTime: '11:45 AM', subject: 'Physics', room: 'Lab B', teacher: 'Dr. Brown', type: 'lab' },
  ],
  "Tuesday": [
    { period: 1, time: '09:00 AM', endTime: '09:45 AM', subject: 'History', room: '204', teacher: 'Mr. Wilson', type: 'lecture' },
    { period: 2, time: '10:00 AM', endTime: '10:45 AM', subject: 'Chemistry', room: 'Lab A', teacher: 'Ms. White', type: 'lab' },
  ],
  "Wednesday": [], "Thursday": [], "Friday": [], "Saturday": [], "Sunday": []
};

const classV_Schedule: WeeklySchedule = {
  "Monday": [
    { period: 1, time: '09:00 AM', endTime: '09:45 AM', subject: 'EVS', room: '105', teacher: 'Ms. Green', type: 'lecture' },
    { period: 2, time: '10:00 AM', endTime: '10:45 AM', subject: 'Hindi', room: '105', teacher: 'Mr. Sharma', type: 'lecture' },
  ],
  "Tuesday": [], "Wednesday": [], "Thursday": [], "Friday": [], "Saturday": [], "Sunday": []
};

export const timetableSchedule: SchoolTimetable = {
  "X-A": classX_Schedule,
  "V-B": classV_Schedule
};

// --- NOTICES DATA (2025-26 ACADEMIC CALENDAR) ---
export const noticesList: Notice[] = [
  // April 2025
  { id: 1, date: "2025-04-07", title: "New Session 2025–26 Begins", category: "Event", content: "Welcome back students!", isPublished: true, icon: Trophy, color: 'text-orange-500', bg: 'bg-orange-500/10' },
  { id: 2, date: "2025-04-14", title: "Ambedkar Jayanti", category: "Holiday", content: "School Closed", isPublished: true, icon: Bell, color: 'text-purple-500', bg: 'bg-purple-500/10' },

  // May 2025
  { id: 3, date: "2025-05-01", title: "May Day", category: "Holiday", content: "Labour Day - School Closed", isPublished: true, icon: Bell, color: 'text-purple-500', bg: 'bg-purple-500/10' },

  // June 2025
  { id: 4, date: "2025-06-12", title: "Summer Break Begins", category: "Holiday", content: "Break from 12th June to 21st June", isPublished: true, icon: Bell, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  { id: 5, date: "2025-06-23", title: "School Reopens", category: "Event", content: "Classes resume after Summer Break", isPublished: true, icon: Trophy, color: 'text-orange-500', bg: 'bg-orange-500/10' },
  { id: 6, date: "2025-06-28", title: "Result Declaration (2024–25)", category: "Academic", content: "Results for Nur–X", isPublished: true, icon: BookOpen, color: 'text-blue-500', bg: 'bg-blue-500/10' },

  // July 2025
  { id: 7, date: "2025-07-20", title: "Eid-ul-Azha", category: "Holiday", content: "Bakrid - School Closed", isPublished: true, icon: Bell, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  { id: 8, date: "2025-07-25", title: "Chhatrapati Shivaji Jayanti", category: "Event", content: "Celebration", isPublished: true, icon: Trophy, color: 'text-orange-500', bg: 'bg-orange-500/10' },

  // August 2025
  { id: 9, date: "2025-08-01", title: "Muharram", category: "Holiday", content: "School Closed", isPublished: true, icon: Bell, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  { id: 10, date: "2025-08-15", title: "Independence Day", category: "Event", content: "Flag Hoisting & Celebration", isPublished: true, icon: Trophy, color: 'text-orange-500', bg: 'bg-orange-500/10' },

  // September 2025
  { id: 11, date: "2025-09-06", title: "Shree Krishna Janmashtami", category: "Event", content: "Celebration", isPublished: true, icon: Trophy, color: 'text-orange-500', bg: 'bg-orange-500/10' },
  { id: 12, date: "2025-09-07", title: "Shree Vishwakarma Puja", category: "Holiday", content: "School Closed", isPublished: true, icon: Bell, color: 'text-purple-500', bg: 'bg-purple-500/10' },

  // October 2025
  { id: 13, date: "2025-10-02", title: "Gandhi Jayanti", category: "Event", content: "Celebration", isPublished: true, icon: Trophy, color: 'text-orange-500', bg: 'bg-orange-500/10' },
  { id: 14, date: "2025-10-03", title: "Half-Yearly Exams Begin", category: "Exam", content: "Exams from 3rd Oct to 5th Oct", isPublished: true, icon: Calendar, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
  { id: 15, date: "2025-10-20", title: "Durga Puja", category: "Holiday", content: "School Closed", isPublished: true, icon: Bell, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  { id: 16, date: "2025-10-21", title: "School Reopens (Durga Puja)", category: "Event", content: "Classes Resume", isPublished: true, icon: Trophy, color: 'text-orange-500', bg: 'bg-orange-500/10' },
  { id: 17, date: "2025-10-23", title: "Diwali", category: "Holiday", content: "Deepavali - School Closed", isPublished: true, icon: Bell, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  { id: 18, date: "2025-10-24", title: "Bhaiya Dooj", category: "Holiday", content: "School Closed", isPublished: true, icon: Bell, color: 'text-purple-500', bg: 'bg-purple-500/10' },

  // November 2025
  { id: 19, date: "2025-11-04", title: "Chatth Festival", category: "Holiday", content: "School Closed", isPublished: true, icon: Bell, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  { id: 20, date: "2025-11-15", title: "Children’s Day Celebration", category: "Event", content: "Fun activities for students", isPublished: true, icon: Trophy, color: 'text-orange-500', bg: 'bg-orange-500/10' },
  { id: 21, date: "2025-11-20", title: "Annual Sports Meet", category: "Event", content: "Sports for Nur–X", isPublished: true, icon: Trophy, color: 'text-orange-500', bg: 'bg-orange-500/10' },
  { id: 22, date: "2025-11-22", title: "First Pre-Board Exams", category: "Exam", content: "Exams from 22nd Nov to 29th Nov", isPublished: true, icon: Calendar, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },

  // December 2025
  { id: 23, date: "2025-12-25", title: "Christmas Day", category: "Holiday", content: "School Closed", isPublished: true, icon: Bell, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  { id: 24, date: "2025-12-27", title: "Winter Break Begins", category: "Holiday", content: "Break from 27th Dec to 1st Jan", isPublished: true, icon: Bell, color: 'text-purple-500', bg: 'bg-purple-500/10' },

  // January 2026
  { id: 25, date: "2026-01-02", title: "School Reopens", category: "Event", content: "Classes resume after Winter Break", isPublished: true, icon: Trophy, color: 'text-orange-500', bg: 'bg-orange-500/10' },
  { id: 26, date: "2026-01-24", title: "Result Declaration (1st PT-II)", category: "Academic", content: "PT-II Results", isPublished: true, icon: BookOpen, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { id: 27, date: "2026-01-25", title: "Republic Day Celebration", category: "Event", content: "Flag Hoisting", isPublished: true, icon: Trophy, color: 'text-orange-500', bg: 'bg-orange-500/10' },
  { id: 28, date: "2026-01-26", title: "Republic Day", category: "Holiday", content: "National Holiday", isPublished: true, icon: Bell, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  { id: 29, date: "2026-01-29", title: "Farewell Class X", category: "Event", content: "Farewell Party", isPublished: true, icon: Trophy, color: 'text-orange-500', bg: 'bg-orange-500/10' },

  // February 2026
  { id: 30, date: "2026-02-14", title: "Annual Exams Begin", category: "Exam", content: "Final Exams for Nur-X", isPublished: true, icon: Calendar, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },

  // March 2026
  { id: 31, date: "2026-03-03", title: "New Admission Tests", category: "Academic", content: "Tests for 2026-27 Batch", isPublished: true, icon: BookOpen, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { id: 32, date: "2026-03-09", title: "Holi", category: "Holiday", content: "Festival of Colors", isPublished: true, icon: Bell, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  { id: 33, date: "2026-03-29", title: "New Session 2026-27 Begins", category: "Event", content: "Start of next academic year", isPublished: true, icon: Trophy, color: 'text-orange-500', bg: 'bg-orange-500/10' }
];

// Helper to get formatted date string
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

// --- PER-STUDENT RESULTS DATA ---
export const examResultsData: ExamResultsData = {
  // ID 37 corresponds to X-A-1 in the new generation logic (12 prior classes * 3 sections * 1 student = 36)
  "ANS/2025/37": {
    "2025-26": {
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
      ],
      "Finals": []
    }
  },
  // ID 1 corresponds to Nursery-A-1
  "ANS/2025/1": {
    "2025-26": {
      "Mid-Term": [
        { name: 'English', score: 98, grade: 'A1', color: 'bg-blue-500' },
        { name: 'Maths', score: 95, grade: 'A1', color: 'bg-green-500' },
        { name: 'Hindi', score: 92, grade: 'A1', color: 'bg-orange-500' },
      ],
      "Unit Test 1": [],
      "Finals": []
    }
  }
};

// --- GALLERY DATA ---
export const initialAlbums: Album[] = [
  { 
    id: 1, 
    title: 'Science Exhibition 2025', 
    date: 'Oct 15, 2025',
    category: 'Events', 
    coverUrl: 'https://images.unsplash.com/photo-1564939558297-fc396f18e5c7?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1564939558297-fc396f18e5c7?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&q=80&w=800'
    ]
  },
  { 
    id: 2, 
    title: 'Sports Day Winners', 
    date: 'Sep 28, 2025',
    category: 'Sports', 
    coverUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1576267423445-b2e0074d68a4?auto=format&fit=crop&q=80&w=800'
    ]
  },
  { 
    id: 3, 
    title: 'Annual Day Celebrations', 
    date: 'Aug 15, 2025',
    category: 'Culture', 
    coverUrl: 'https://images.unsplash.com/photo-1514533450685-4493e01d1fdc?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1514533450685-4493e01d1fdc?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=800'
    ]
  },
];

export const initialMagazines: Magazine[] = [
  {
    id: 1,
    title: "School Chronicles Vol. 5",
    month: "October 2025",
    coverUrl: "https://images.unsplash.com/photo-1544716278-ca65e1112019?auto=format&fit=crop&w=600&q=80",
    pdfUrl: "#", // Placeholder
    isPublished: true
  },
  {
    id: 2,
    title: "The Scholar's Voice",
    month: "September 2025",
    coverUrl: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=600&q=80",
    pdfUrl: "#", // Placeholder
    isPublished: true
  }
];

// --- LEAVE APPLICATION DATA (NEW) ---
export const leaveApplicationsData: LeaveApplication[] = [
  { 
    id: 101, 
    studentId: "ANS/2025/37", // X-A-1
    studentName: "Student X-A-1", 
    class: "X-A", 
    rollNo: "1", 
    startDate: '2025-10-28', 
    endDate: '2025-10-30', 
    subject: 'Sick Leave', 
    reason: 'Suffering from high fever and cold. Doctor advised rest.', 
    status: 'Pending', 
    appliedDate: '2025-10-27' 
  },
  { 
    id: 102, 
    studentId: "ANS/2025/37", 
    studentName: "Student X-A-1", 
    class: "X-A", 
    rollNo: "1", 
    startDate: '2025-09-15', 
    endDate: '2025-09-16', 
    subject: 'Family Function', 
    reason: 'Attending cousin\'s wedding ceremony.', 
    status: 'Approved', 
    appliedDate: '2025-09-10' 
  },
  { 
    id: 103, 
    studentId: "ANS/2025/1", // Nursery-A-1 
    studentName: "Student Nursery-A-1", 
    class: "Nursery-A", 
    rollNo: "1", 
    startDate: '2025-10-29', 
    endDate: '2025-10-29', 
    subject: 'Urgent Work', 
    reason: 'Need to visit the bank for Aadhaar update.', 
    status: 'Pending', 
    appliedDate: '2025-10-28' 
  },
];

// --- APPLICATION DATA (Legacy - Keep for compatibility if used elsewhere, else ignore) ---
export const applicationHistory: ApplicationRecord[] = [
  { id: 1, studentId: "ANS/2025/37", type: 'Sick Leave', from: '10 Oct 2025', to: '12 Oct 2025', status: 'Approved', color: 'bg-green-100 text-green-700' },
  { id: 2, studentId: "ANS/2025/37", type: 'Family Function', from: '24 Sep 2025', to: '25 Sep 2025', status: 'Rejected', color: 'bg-red-100 text-red-700' },
];

// --- ADMISSION APPLICATIONS (for Admin) ---
export const admissionApplicationsData: AdmissionApplication[] = [
  { 
    id: 1, 
    studentName: 'Riya Sharma', 
    admissionForClass: 'Class V', 
    fatherName: 'Manish Sharma', 
    mobile: '9876543210', 
    status: 'Received', 
    date: '2025-10-25',
    previousSchool: 'St. Xavier High School',
    address: 'Sector 4, Bahadurganj'
  },
  { 
    id: 2, 
    studentName: 'Amit Kumar', 
    admissionForClass: 'Nursery', 
    fatherName: 'Suresh Kumar', 
    mobile: '9123456789', 
    status: 'Contacted', 
    date: '2025-10-24',
    previousSchool: 'Play Pen Kids',
    address: 'Near Main Market, Kishanganj'
  },
  { 
    id: 3, 
    studentName: 'Zara Khan', 
    admissionForClass: 'Class IX', 
    fatherName: 'Imran Khan', 
    mobile: '9988776655', 
    status: 'Received', 
    date: '2025-10-23',
    previousSchool: 'Delhi Public School',
    address: 'Civil Lines, Bahadurganj'
  },
  { 
    id: 4, 
    studentName: 'Aryan Singh', 
    admissionForClass: 'Class I', 
    fatherName: 'Vikram Singh', 
    mobile: '8877665544', 
    status: 'Received', 
    date: '2025-10-22',
    previousSchool: 'Little Angels',
    address: 'Highway Road, Bahadurganj'
  },
  { 
    id: 5, 
    studentName: 'Sneha Gupta', 
    admissionForClass: 'Class XI', 
    fatherName: 'Rajesh Gupta', 
    mobile: '7766554433', 
    status: 'Rejected', 
    date: '2025-10-20',
    previousSchool: 'Kendriya Vidyalaya',
    address: 'Station Road, Kishanganj'
  },
  { 
    id: 6, 
    studentName: 'Kabir Das', 
    admissionForClass: 'Class III', 
    fatherName: 'Mohan Das', 
    mobile: '9000011111', 
    status: 'Admitted', 
    date: '2025-10-18',
    previousSchool: 'Sunshine Academy',
    address: 'Village Chowk, Bahadurganj'
  },
];

// --- FEEDBACK DATA (for Admin) ---
export const feedbackData: Feedback[] = [
  { 
    id: 1, 
    studentId: "ANS/2025/37",
    studentName: "Student X-A-1",
    class: "X-A",
    mobile: "9430646481",
    type: 'Complaint', 
    message: 'The school bus on Route 4 is consistently arriving 20 minutes late in the mornings. Please look into this.', 
    date: '2025-10-23', 
    status: 'Unread' 
  },
  { 
    id: 2, 
    studentId: "ANS/2025/1",
    studentName: "Student Nursery-A-1",
    class: "Nursery-A",
    mobile: "9988776655",
    type: 'Suggestion', 
    message: 'It would be great if we could have a chess club as part of the extracurricular activities.', 
    date: '2025-10-22', 
    status: 'Read' 
  },
  { 
    id: 3, 
    studentId: "ANS/2025/37",
    studentName: "Student X-A-1",
    class: "X-A",
    mobile: "9430646481",
    type: 'Appreciation', 
    message: 'A big thank you to the math teacher for the extra help classes. My son has improved significantly.', 
    date: '2025-10-20', 
    status: 'Resolved' 
  },
];

// --- ACHIEVEMENTS DATA (NEW) ---
export const initialAchievements: Achievement[] = [
  {
    id: 1,
    studentId: "ANS/2025/37",
    studentName: "Student X-A-1",
    title: "1st Place - Inter-School Debate",
    category: "Gold",
    date: "2025-10-15",
    description: "Secured first position in the district level debate competition on 'AI in Education'."
  },
  {
    id: 2,
    studentId: "ANS/2025/37",
    studentName: "Student X-A-1",
    title: "Student of the Month",
    category: "Special",
    date: "2025-09-30",
    description: "Awarded for exemplary conduct and academic excellence in September."
  }
];
