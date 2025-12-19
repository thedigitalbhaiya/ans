
import { CheckCircle2, Circle, Trophy, Calendar, Bell, AlertTriangle, BookOpen, Clock, FileText, User, Users, BookUser, MapPin, Phone, Droplets, Cake } from 'lucide-react';
import { Homework, WeeklySchedule, Notice, FeeRecord, ExamResult, Album, Magazine, ApplicationRecord, Student, AdmissionApplication, Feedback, ExamResultsData, SchoolTimetable, AttendanceRecords, LeaveApplication, Post, Achievement } from './types';

// --- HELPERS ---
const generateFeeHistory = (): FeeRecord[] => {
  return [
    { id: 1, month: 'April 2025', amount: '₹ 1500', status: 'Paid', date: '05/04/2025', invoice: '#INV-001', paymentMethod: 'Online' },
    { id: 2, month: 'May 2025', amount: '₹ 1500', status: 'Paid', date: '06/05/2025', invoice: '#INV-092', paymentMethod: 'Online' },
    { id: 3, month: 'June 2025', amount: '₹ 1500', status: 'Pending', date: '-', invoice: '-', paymentMethod: 'Offline' },
  ];
};

// --- DATA ---

export const studentsList: Student[] = [
  {
    name: "Aarav Sharma",
    admissionNo: "ANS/2025/37",
    session: "2025-26",
    rollNo: "1",
    class: "X",
    section: "A",
    dob: "2010-05-15",
    gender: "Male",
    bloodGroup: "B+",
    fatherName: "Rajesh Sharma",
    motherName: "Sunita Sharma",
    mobile: "9430646481",
    address: "123, Main Road, Bahadurganj",
    religion: "Hindu",
    category: "General",
    avatar: "https://ui-avatars.com/api/?name=Aarav+Sharma&background=0D8ABC&color=fff",
    profilePic: "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?auto=format&fit=crop&q=80&w=200",
    stats: {
      attendance: "92%",
      grade: "A1",
      rank: "5th"
    },
    feeHistory: generateFeeHistory()
  },
  {
    name: "Ishita Sharma",
    admissionNo: "ANS/2025/1",
    session: "2025-26",
    rollNo: "1",
    class: "Nursery",
    section: "A",
    dob: "2021-08-20",
    gender: "Female",
    bloodGroup: "O+",
    fatherName: "Rajesh Sharma",
    motherName: "Sunita Sharma",
    mobile: "9430646481",
    address: "123, Main Road, Bahadurganj",
    religion: "Hindu",
    category: "General",
    avatar: "https://ui-avatars.com/api/?name=Ishita+Sharma&background=F472B6&color=fff",
    stats: {
      attendance: "88%",
      grade: "A",
      rank: "-"
    },
    feeHistory: generateFeeHistory()
  },
  {
    name: "Rohan Gupta",
    admissionNo: "ANS/2025/45",
    session: "2025-26",
    rollNo: "12",
    class: "X",
    section: "A",
    dob: "2009-12-10",
    gender: "Male",
    bloodGroup: "AB+",
    fatherName: "Vikram Gupta",
    motherName: "Priya Gupta",
    mobile: "9988776655",
    address: "Station Road, Kishanganj",
    religion: "Hindu",
    category: "OBC",
    avatar: "https://ui-avatars.com/api/?name=Rohan+Gupta&background=random",
    stats: {
      attendance: "75%",
      grade: "B1",
      rank: "15th"
    },
    feeHistory: generateFeeHistory()
  }
];

export const dailyNotice = {
  title: "School closed tomorrow due to heavy rain alert.",
  date: "Oct 24, 2025",
  message: "As per DM order, school will remain closed for all classes.",
  category: "Holiday"
};

export const examResultsData: ExamResultsData = {
  "ANS/2025/37": {
    "2025-26": {
      "Half Yearly": [
        { name: "Maths", score: 78, maxScore: 80, grade: "A1", color: "bg-blue-500" },
        { name: "Science", score: 72, maxScore: 80, grade: "A2", color: "bg-green-500" },
        { name: "English", score: 65, maxScore: 80, grade: "B1", color: "bg-orange-500" },
        { name: "SST", score: 75, maxScore: 80, grade: "A1", color: "bg-purple-500" },
        { name: "Hindi", score: 70, maxScore: 80, grade: "A2", color: "bg-red-500" },
      ],
      "PT1": [
        { name: "Maths", score: 38, maxScore: 40, grade: "A1", color: "bg-blue-500" },
        { name: "Science", score: 35, maxScore: 40, grade: "A2", color: "bg-green-500" },
      ]
    }
  }
};

export const noticesList: Notice[] = [
  {
    id: 1,
    title: "Annual Sports Day Registration",
    date: "2025-10-20",
    category: "Event",
    content: "Registration for Annual Sports Day is now open. Interested students can give their names to their respective class teachers.",
    isPublished: true,
    color: "text-orange-500",
    bg: "bg-orange-100"
  },
  {
    id: 2,
    title: "Diwali Holidays",
    date: "2025-10-28",
    category: "Holiday",
    content: "School will remain closed from Oct 30 to Nov 2 for Diwali celebrations.",
    isPublished: true,
    color: "text-purple-500",
    bg: "bg-purple-100"
  },
  {
    id: 3,
    title: "PT-2 Exam Schedule",
    date: "2025-11-15",
    category: "Exam",
    content: "Periodic Test 2 will commence from December 1st. Datesheet has been displayed on the notice board.",
    isPublished: true,
    color: "text-blue-500",
    bg: "bg-blue-100"
  }
];

export const timetableSchedule: SchoolTimetable = {
  "X-A": {
    "Monday": [
      { period: 1, subject: "Maths", teacher: "Mr. R.K. Verma", room: "101", time: "08:00 AM", endTime: "08:45 AM", type: "lecture" },
      { period: 2, subject: "Science", teacher: "Mrs. S. Gupta", room: "Lab 2", time: "08:45 AM", endTime: "09:30 AM", type: "lab" },
      { period: 3, subject: "English", teacher: "Ms. Anjali", room: "101", time: "09:30 AM", endTime: "10:15 AM", type: "lecture" },
      { period: 4, subject: "Break", teacher: "-", room: "Ground", time: "10:15 AM", endTime: "10:45 AM", type: "break" },
      { period: 5, subject: "SST", teacher: "Mr. Khan", room: "101", time: "10:45 AM", endTime: "11:30 AM", type: "lecture" },
    ],
    "Tuesday": [
      { period: 1, subject: "Science", teacher: "Mrs. S. Gupta", room: "101", time: "08:00 AM", endTime: "08:45 AM", type: "lecture" },
      { period: 2, subject: "Maths", teacher: "Mr. R.K. Verma", room: "101", time: "08:45 AM", endTime: "09:30 AM", type: "lecture" },
    ]
  }
};

export const attendanceRecordsData: AttendanceRecords = {
  "2025-10-24": {
    "ANS/2025/37": "present",
    "ANS/2025/1": "absent",
    "ANS/2025/45": "present"
  },
  "2025-10-23": {
    "ANS/2025/37": "present",
    "ANS/2025/1": "present",
    "ANS/2025/45": "late"
  },
  "2025-10-22": {
    "ANS/2025/37": "absent",
    "ANS/2025/1": "present",
    "ANS/2025/45": "present"
  }
};

export const initialCampusPosts: Post[] = [
  {
    id: 1,
    author: "Principal Office",
    role: "Admin",
    content: "Congratulations to our debate team for winning the district championship! We are proud of you.",
    timestamp: "2 hours ago",
    likes: 45
  },
  {
    id: 2,
    author: "Sports Dept",
    role: "Staff",
    content: "Football trials for the senior team will be held this Saturday at 8 AM.",
    timestamp: "5 hours ago",
    likes: 32
  }
];

export const homeworkList: Homework[] = [
  {
    id: 1,
    targetClass: "X",
    subject: "Maths",
    title: "Quadratic Equations",
    description: "Solve Exercise 4.3 questions 1 to 10.",
    dueDate: "2025-10-26",
    postedDate: "2025-10-24",
    status: "pending",
    color: "bg-blue-500"
  },
  {
    id: 2,
    targetClass: "X",
    subject: "Science",
    title: "Light - Reflection",
    description: "Draw ray diagrams for concave mirrors.",
    dueDate: "2025-10-27",
    postedDate: "2025-10-24",
    status: "pending",
    color: "bg-green-500"
  }
];

// --- GALLERY DATA ---
export const initialAlbums: Album[] = [
  { 
    id: 1, 
    title: 'Science Exhibition 2025', 
    date: 'Oct 15, 2025',
    category: 'Events', 
    coverUrl: 'https://images.unsplash.com/photo-1564939558297-fc396f18e5c7?auto=format&fit=crop&q=80&w=800',
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1564939558297-fc396f18e5c7?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1517976487492-5750f3195933?auto=format&fit=crop&q=80&w=800'
    ]
  },
  { 
    id: 2, 
    title: 'Sports Day Winners', 
    date: 'Sep 28, 2025',
    category: 'Sports', 
    coverUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&q=80&w=800',
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1576267423445-b2e0074d68a4?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&q=80&w=800'
    ]
  },
  { 
    id: 3, 
    title: 'Annual Day Celebrations', 
    date: 'Aug 15, 2025',
    category: 'Cultural', 
    coverUrl: 'https://images.unsplash.com/photo-1514533450685-4493e01d1fdc?auto=format&fit=crop&q=80&w=800',
    featured: false,
    images: [
      'https://images.unsplash.com/photo-1514533450685-4493e01d1fdc?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=800'
    ]
  },
  {
    id: 4,
    title: 'Art Competition',
    date: 'July 20, 2025',
    category: 'Arts',
    coverUrl: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&q=80&w=800',
    featured: false,
    images: [
      'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=800'
    ]
  }
];

export const initialMagazines: Magazine[] = [
  {
    id: 1,
    title: "School Chronicles Vol. 5",
    month: "October 2025",
    coverUrl: "https://images.unsplash.com/photo-1544716278-ca65e1112019?auto=format&fit=crop&w=600&q=80",
    pdfUrl: "#", 
    isPublished: true
  },
  {
    id: 2,
    title: "The Scholar's Voice",
    month: "September 2025",
    coverUrl: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=600&q=80",
    pdfUrl: "#",
    isPublished: true
  }
];

export const leaveApplicationsData: LeaveApplication[] = [
  { 
    id: 101, 
    studentId: "ANS/2025/37", 
    studentName: "Aarav Sharma", 
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
    studentName: "Aarav Sharma", 
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
    studentId: "ANS/2025/1", 
    studentName: "Ishita Sharma", 
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

export const applicationHistory: ApplicationRecord[] = [
  { id: 1, studentId: "ANS/2025/37", type: 'Sick Leave', from: '10 Oct 2025', to: '12 Oct 2025', status: 'Approved', color: 'bg-green-100 text-green-700' },
  { id: 2, studentId: "ANS/2025/37", type: 'Family Function', from: '24 Sep 2025', to: '25 Sep 2025', status: 'Rejected', color: 'bg-red-100 text-red-700' },
];

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
  }
];

export const feedbackData: Feedback[] = [
  { 
    id: 1, 
    studentId: "ANS/2025/37",
    studentName: "Aarav Sharma",
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
    studentName: "Ishita Sharma",
    class: "Nursery-A",
    mobile: "9988776655",
    type: 'Suggestion', 
    message: 'It would be great if we could have a chess club as part of the extracurricular activities.', 
    date: '2025-10-22', 
    status: 'Read' 
  }
];

const generateRandomAchievements = (): Achievement[] => {
  const titles = [
    { title: "1st Place - Debate", cat: "Gold", type: "Cultural", desc: "Won the Inter-School debate championship." },
    { title: "Student of the Month", cat: "Special", type: "Leadership", desc: "For exemplary discipline and academic performance." },
    { title: "Science Fair Winner", cat: "Gold", type: "Academic", desc: "Best innovative project in Physics category." },
    { title: "Sports Captain", cat: "Special", type: "Sports", desc: "Appointed as the captain of the Football team." },
    { title: "Math Olympiad - Silver", cat: "Silver", type: "Academic", desc: "Secured 2nd position in the state level Math Olympiad." }
  ];

  // We use the exported studentsList here, so it must be defined before this function or inside
  const students = studentsList.slice(0, 15); 
  return students.map((s, idx) => {
    const award = titles[idx % titles.length];
    return {
      id: Date.now() + idx,
      studentId: s.admissionNo,
      studentName: s.name,
      title: award.title,
      category: award.cat as any,
      type: award.type as any,
      date: new Date().toISOString().split('T')[0],
      timestamp: new Date().toISOString(),
      description: award.desc,
      photoUrl: s.avatar,
      cheers: Math.floor(Math.random() * 50) + 10
    };
  });
};

export const initialAchievements: Achievement[] = generateRandomAchievements();
