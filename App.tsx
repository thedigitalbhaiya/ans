
import React, { useState, useEffect, useContext } from 'react';
import { HashRouter as Router, Routes, Route, useLocation, Navigate, Outlet, useNavigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { Attendance } from './components/Attendance';
import { Homework } from './components/Homework';
import { Timetable } from './components/Timetable';
import { Notices } from './components/Notices';
import { Profile } from './components/Profile';
import { Fees } from './components/Fees';
import { Results } from './components/Results';
import { Gallery } from './components/Gallery';
import { Feedback } from './components/Feedback';
import { Application } from './components/Application';
import { Admission } from './components/Admission';
import { ProfileSelector } from './components/auth/ProfileSelector'; // New Component
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminStudents } from './components/admin/AdminStudents';
import { AdminStudentDetail } from './components/admin/AdminStudentDetail';
import { AdminAttendance } from './components/admin/AdminAttendance';
import { AdminResults } from './components/admin/AdminResults';
import { AdminFees } from './components/admin/AdminFees';
import { AdminTimetable } from './components/admin/AdminTimetable';
import { AdminCirculars } from './components/admin/AdminCirculars';
import { AdminGallery } from './components/admin/AdminGallery';
import { AdminApplications } from './components/admin/AdminApplications';
import { AdminAdmissions } from './components/admin/AdminAdmissions';
import { AdminFeedback } from './components/admin/AdminFeedback';
import { AdminSocials } from './components/admin/AdminSocials';
import { AdminSettings } from './components/admin/AdminSettings';
import { AdminHomework } from './components/admin/AdminHomework';
import { AdminUsers } from './components/admin/AdminUsers'; // New Component

import { Theme, Student, Notice, Album, Magazine, ApplicationRecord, ExamResultsData, AttendanceRecords, SchoolTimetable, AdmissionApplication, Feedback as FeedbackType, FeeStructure, LeaveApplication, Post, SchoolSettings, FlashNotice, SocialLinksMap, Homework as HomeworkType, NotificationItem, AdminUser } from './types';
import { 
  studentsList as initialStudents, 
  dailyNotice as initialNotice, 
  examResultsData as initialResults,
  noticesList as initialNotices,
  initialAlbums,
  initialMagazines,
  applicationHistory as initialApplications,
  timetableSchedule as initialTimetable,
  admissionApplicationsData as initialAdmissions,
  feedbackData as initialFeedback,
  attendanceRecordsData as initialAttendance,
  leaveApplicationsData as initialLeaveApplications,
  initialCampusPosts,
  homeworkList as initialHomework
} from './data';

// --- CREDENTIALS (DEPRECATED - Moved to State) ---
const MOCK_OTP = '1234';

const INITIAL_ADMINS: AdminUser[] = [
  { 
    id: 1, 
    name: "Principal", 
    username: "admin", 
    password: "123", // In real app, this would be hashed
    role: "Super Admin", 
    photo: "https://ui-avatars.com/api/?name=Principal&background=0D8ABC&color=fff",
    mobile: '8709605412' // Linked to Login
  },
  { 
    id: 2, 
    name: "Ms. Anjali", 
    username: "anjali5a", 
    password: "123", 
    role: "Teacher", 
    assignedClass: "X",
    assignedSection: "A",
    photo: "https://ui-avatars.com/api/?name=Anjali+Teacher&background=random",
    mobile: '9988776655' 
  }
];

// Default Settings
const DEFAULT_SETTINGS: SchoolSettings = {
  schoolName: 'Azim National School',
  schoolAddress: 'Bahadurganj, Kishanganj, Bihar - 855101',
  contactNumber: '+91 94306 46481',
  email: 'azimnationalschool@gmail.com',
  logoUrl: 'https://cdn-icons-png.flaticon.com/512/2996/2996962.png',
  currentSession: '2025-26',
  totalTeachers: 28, 
  enableStudentLogin: true,
  showResults: true,
  admissionsOpen: true,
  enableOnlineFees: true,
  siblingLoginEnabled: true,
  enableHomework: true,
};

// Theme Context
export const ThemeContext = React.createContext<{
  theme: Theme;
  toggleTheme: () => void;
}>({
  theme: Theme.LIGHT,
  toggleTheme: () => {},
});

// Auth Context
export const AuthContext = React.createContext<{
  isLoggedIn: boolean;
  isAdmin: boolean;
  loginStep: number; // 0: Mobile, 1: OTP, 2: Password
  loginRole: 'student' | 'admin' | null;
  verifyNumber: (mobile: string) => Promise<boolean>;
  verifyOTP: (otp: string) => Promise<'success' | 'next_step' | 'invalid'>;
  verifyPassword: (password: string) => Promise<boolean>;
  resetAuthFlow: () => void;
  logout: () => void;
  currentStudent: Student;
  allStudents: Student[];
  setAllStudents: React.Dispatch<React.SetStateAction<Student[]>>;
  availableProfiles: Student[]; // For siblings
  selectProfile: (admissionNo: string) => void;
  switchStudent: (admissionNo: string) => void; // Admin switcher
  updateStudentData: (student: Student) => void; // Syncs DB and Session
  // Multi-Admin
  adminUsers: AdminUser[];
  setAdminUsers: React.Dispatch<React.SetStateAction<AdminUser[]>>;
  currentAdmin: AdminUser | null;
  setCurrentAdmin: React.Dispatch<React.SetStateAction<AdminUser | null>>;
  updateAdminProfile: (admin: AdminUser) => void;
}>({
  isLoggedIn: false,
  isAdmin: false,
  loginStep: 0,
  loginRole: null,
  verifyNumber: async () => false,
  verifyOTP: async () => 'invalid',
  verifyPassword: async () => false,
  resetAuthFlow: () => {},
  logout: () => {},
  currentStudent: initialStudents[0],
  allStudents: [],
  setAllStudents: () => {},
  availableProfiles: [],
  selectProfile: () => {},
  switchStudent: () => {},
  updateStudentData: () => {},
  adminUsers: [],
  setAdminUsers: () => {},
  currentAdmin: null,
  setCurrentAdmin: () => {},
  updateAdminProfile: () => {},
});

// School Context
export const SchoolContext = React.createContext<{
  settings: SchoolSettings;
  updateSettings: (newSettings: Partial<SchoolSettings>) => void;
  dailyNotice: typeof initialNotice;
  setDailyNotice: (notice: typeof initialNotice) => void;
  flashNotice: FlashNotice;
  setFlashNotice: React.Dispatch<React.SetStateAction<FlashNotice>>;
  showBirthdayWidget: boolean;
  setShowBirthdayWidget: (show: boolean) => void;
  examResults: ExamResultsData;
  setExamResults: React.Dispatch<React.SetStateAction<ExamResultsData>>;
  notices: Notice[];
  setNotices: React.Dispatch<React.SetStateAction<Notice[]>>;
  gallery: Album[];
  setGallery: React.Dispatch<React.SetStateAction<Album[]>>;
  magazines: Magazine[];
  setMagazines: React.Dispatch<React.SetStateAction<Magazine[]>>;
  applications: ApplicationRecord[];
  setApplications: React.Dispatch<React.SetStateAction<ApplicationRecord[]>>;
  addApplication: (app: Omit<ApplicationRecord, 'id' | 'color' | 'status'>) => void;
  leaveApplications: LeaveApplication[];
  setLeaveApplications: React.Dispatch<React.SetStateAction<LeaveApplication[]>>;
  addLeaveApplication: (app: Omit<LeaveApplication, 'id' | 'status' | 'appliedDate'>) => void;
  updateLeaveStatus: (id: number, status: 'Approved' | 'Rejected') => void;
  attendance: AttendanceRecords;
  setAttendance: React.Dispatch<React.SetStateAction<AttendanceRecords>>;
  timetable: SchoolTimetable;
  setTimetable: React.Dispatch<React.SetStateAction<SchoolTimetable>>;
  admissions: AdmissionApplication[];
  setAdmissions: React.Dispatch<React.SetStateAction<AdmissionApplication[]>>;
  addAdmission: (app: Omit<AdmissionApplication, 'id' | 'status' | 'date'>) => void;
  feedback: FeedbackType[];
  setFeedback: React.Dispatch<React.SetStateAction<FeedbackType[]>>;
  addFeedback: (fb: Omit<FeedbackType, 'id' | 'date' | 'read' | 'status'>) => void;
  feeStructure: FeeStructure;
  setFeeStructure: React.Dispatch<React.SetStateAction<FeeStructure>>;
  socialLinks: SocialLinksMap;
  updateSocialLink: (cls: string, section: string, link: string) => void;
  posts: Post[];
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
  addPost: (content: string) => void;
  deletePost: (id: number) => void;
  homework: HomeworkType[];
  setHomework: React.Dispatch<React.SetStateAction<HomeworkType[]>>;
  addHomework: (hw: Omit<HomeworkType, 'id' | 'status' | 'postedDate' | 'color'>) => void;
  deleteHomework: (id: number) => void;
  schoolName: string; // Keep for backward compatibility proxy
  setSchoolName: (name: string) => void;
  currentSession: string;
  setCurrentSession: (session: string) => void;
  // Notifications
  notifications: NotificationItem[];
  unreadCount: number;
  markAllAsRead: () => void;
}>({
  settings: DEFAULT_SETTINGS,
  updateSettings: () => {},
  dailyNotice: initialNotice,
  setDailyNotice: () => {},
  flashNotice: { isVisible: false, title: '', message: '', targetAudience: 'ALL' },
  setFlashNotice: () => {},
  showBirthdayWidget: true,
  setShowBirthdayWidget: () => {},
  examResults: initialResults,
  setExamResults: () => {},
  notices: [],
  setNotices: () => {},
  gallery: [],
  setGallery: () => {},
  magazines: [],
  setMagazines: () => {},
  applications: [],
  setApplications: () => {},
  addApplication: () => {},
  leaveApplications: [],
  setLeaveApplications: () => {},
  addLeaveApplication: () => {},
  updateLeaveStatus: () => {},
  attendance: {},
  setAttendance: () => {},
  timetable: initialTimetable,
  setTimetable: () => {},
  admissions: [],
  setAdmissions: () => {},
  addAdmission: () => {},
  feedback: [],
  setFeedback: () => {},
  addFeedback: () => {},
  feeStructure: {},
  setFeeStructure: () => {},
  socialLinks: {},
  updateSocialLink: () => {},
  posts: [],
  setPosts: () => {},
  addPost: () => {},
  deletePost: () => {},
  homework: [],
  setHomework: () => {},
  addHomework: () => {},
  deleteHomework: () => {},
  schoolName: DEFAULT_SETTINGS.schoolName,
  setSchoolName: () => {},
  currentSession: DEFAULT_SETTINGS.currentSession,
  setCurrentSession: () => {},
  notifications: [],
  unreadCount: 0,
  markAllAsRead: () => {},
});

const AppContent: React.FC = () => {
  const { isLoggedIn, isAdmin } = useContext(AuthContext);
  const location = useLocation();

  return (
    <Routes location={location} key={location.pathname}>
      <Route path="/admin/*" element={
        <ProtectedRoute isAllowed={isAdmin} redirectTo="/">
          <AdminLayout>
            <Routes>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="students" element={<AdminStudents />} />
              <Route path="students/:admissionNo" element={<AdminStudentDetail />} />
              <Route path="attendance" element={<AdminAttendance />} />
              <Route path="results" element={<AdminResults />} />
              <Route path="fees" element={<AdminFees />} />
              <Route path="schedule" element={<AdminTimetable />} />
              <Route path="circulars" element={<AdminCirculars />} />
              <Route path="homework" element={<AdminHomework />} />
              <Route path="gallery" element={<AdminGallery />} />
              <Route path="applications" element={<AdminApplications />} />
              <Route path="admissions" element={<AdminAdmissions />} />
              <Route path="feedback" element={<AdminFeedback />} />
              <Route path="socials" element={<AdminSocials />} />
              <Route path="settings" element={<AdminSettings />} />
              <Route path="users" element={<AdminUsers />} /> {/* New Route */}
              <Route path="*" element={<Navigate to="dashboard" replace />} />
            </Routes>
          </AdminLayout>
        </ProtectedRoute>
      } />

      <Route path="/select-profile" element={<ProfileSelector />} />

      <Route path="/*" element={
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/homework" element={<Homework />} />
            <Route path="/timetable" element={<Timetable />} />
            <Route path="/circulars" element={<Notices />} />
            <Route path="/profile" element={isLoggedIn && !isAdmin ? <Profile /> : <Profile />} />
            <Route path="/fees" element={<Fees />} />
            <Route path="/results" element={<Results />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/application" element={<Application />} />
            <Route path="/admission" element={<Admission />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      } />
    </Routes>
  );
};

const ProtectedRoute = ({ isAllowed, redirectTo, children }: { isAllowed: boolean; redirectTo: string; children?: React.ReactNode }) => {
  if (!isAllowed) {
    return <Navigate to={redirectTo} replace />;
  }
  return <>{children}</>;
};

function App() {
  const [theme, setTheme] = useState<Theme>(Theme.LIGHT);
  const navigate = useNavigate();

  // Roles and Auth State
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('isLoggedIn') === 'true');
  const [isAdmin, setIsAdmin] = useState(() => localStorage.getItem('isAdmin') === 'true');
  
  // Admin Data State
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(() => {
    const saved = localStorage.getItem('adminUsers');
    return saved ? JSON.parse(saved) : INITIAL_ADMINS;
  });
  
  const [currentAdmin, setCurrentAdmin] = useState<AdminUser | null>(() => {
    const saved = localStorage.getItem('currentAdmin');
    return saved ? JSON.parse(saved) : null;
  });

  // Login Wizard State
  const [loginStep, setLoginStep] = useState(0); // 0: Mobile, 1: OTP, 2: Password
  const [loginRole, setLoginRole] = useState<'student' | 'admin' | null>(null);
  const [loginMobile, setLoginMobile] = useState('');
  const [pendingAdminUser, setPendingAdminUser] = useState<AdminUser | null>(null);

  const [allStudents, setAllStudents] = useState<Student[]>(initialStudents);
  const [currentStudent, setCurrentStudent] = useState<Student>(initialStudents[0]);
  const [availableProfiles, setAvailableProfiles] = useState<Student[]>([]);
  
  // School Data State
  const [settings, setSettings] = useState<SchoolSettings>(() => {
    const saved = localStorage.getItem('schoolSettings');
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });

  const [dailyNotice, setDailyNotice] = useState(initialNotice);
  
  // Initialize Flash Notice with defaults
  const [flashNotice, setFlashNotice] = useState<FlashNotice>({
    isVisible: false,
    title: 'Urgent Announcement',
    message: '',
    targetAudience: 'ALL',
    actionLink: ''
  });

  const [showBirthdayWidget, setShowBirthdayWidget] = useState(true);
  const [examResults, setExamResults] = useState<ExamResultsData>(initialResults);
  const [notices, setNotices] = useState(initialNotices);
  const [gallery, setGallery] = useState<Album[]>(initialAlbums);
  const [magazines, setMagazines] = useState<Magazine[]>(initialMagazines);
  const [applications, setApplications] = useState(initialApplications);
  const [leaveApplications, setLeaveApplications] = useState<LeaveApplication[]>(initialLeaveApplications);
  const [attendance, setAttendance] = useState<AttendanceRecords>(initialAttendance);
  const [timetable, setTimetable] = useState<SchoolTimetable>(initialTimetable);
  const [admissions, setAdmissions] = useState<AdmissionApplication[]>(initialAdmissions);
  const [feedback, setFeedback] = useState<FeedbackType[]>(initialFeedback);
  const [posts, setPosts] = useState<Post[]>(initialCampusPosts);
  const [homework, setHomework] = useState<HomeworkType[]>(initialHomework);
  
  // Notifications State
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  
  // Initial Fee Structure
  const [feeStructure, setFeeStructure] = useState<FeeStructure>({
    "Nursery": 800, "LKG": 800, "UKG": 800,
    "I": 1000, "II": 1000, "III": 1000, "IV": 1000, "V": 1000,
    "VI": 1200, "VII": 1200, "VIII": 1200,
    "IX": 1500, "X": 1500, "XI": 2000, "XII": 2000
  });

  // New Social Links Map (Class-Section)
  const [socialLinks, setSocialLinks] = useState<SocialLinksMap>(() => {
    const saved = localStorage.getItem('schoolSocialLinks');
    return saved ? JSON.parse(saved) : {};
  });

  // Auto-Generate Notifications Effect
  useEffect(() => {
    // 1. Feedback (Unread)
    const newFeedback = feedback.filter(f => f.status === 'Unread');
    // 2. Leave (Pending)
    const newLeave = leaveApplications.filter(l => l.status === 'Pending');
    // 3. Admissions (Received)
    const newAdmissions = admissions.filter(a => a.status === 'Received');

    setNotifications(prev => {
      const existingIds = new Set(prev.map(n => n.id));
      const nextNotifications = [...prev];
      let hasNew = false;

      // Helper to add if not exists
      const addIfNotExists = (idPrefix: string, type: 'feedback' | 'leave' | 'admission', msg: string, link: string, dateStr: string) => {
          const notifId = `${type}-${idPrefix}`;
          if (!existingIds.has(notifId)) {
              nextNotifications.unshift({
                  id: notifId,
                  type,
                  message: msg,
                  time: dateStr || new Date().toISOString(),
                  isRead: false,
                  link
              });
              hasNew = true;
          }
      };

      newFeedback.forEach(f => addIfNotExists(f.id.toString(), 'feedback', `New feedback from ${f.studentName}`, '/admin/feedback', f.date));
      newLeave.forEach(l => addIfNotExists(l.id.toString(), 'leave', `Leave request: ${l.studentName}`, '/admin/applications', l.appliedDate));
      newAdmissions.forEach(a => addIfNotExists(a.id.toString(), 'admission', `Admission inquiry: ${a.studentName}`, '/admin/admissions', a.date));

      // Trigger Browser Notification if new items and permission granted
      if (hasNew && isAdmin && Notification.permission === 'granted') {
         new Notification('School Admin Alert', { 
            body: `You have new pending items. Check the dashboard.`,
            icon: settings.logoUrl
         });
      }

      return hasNew ? nextNotifications : prev;
    });
  }, [feedback, leaveApplications, admissions, isAdmin, settings.logoUrl]);

  // Request Notification Permission on Admin Login
  useEffect(() => {
    if (isAdmin && 'Notification' in window && Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  }, [isAdmin]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  // Persist Data
  useEffect(() => {
    localStorage.setItem('schoolSocialLinks', JSON.stringify(socialLinks));
  }, [socialLinks]);

  useEffect(() => {
    localStorage.setItem('schoolSettings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('adminUsers', JSON.stringify(adminUsers));
  }, [adminUsers]);

  useEffect(() => {
    if (currentAdmin) {
      localStorage.setItem('currentAdmin', JSON.stringify(currentAdmin));
    } else {
      localStorage.removeItem('currentAdmin');
    }
  }, [currentAdmin]);

  const updateSettings = (newSettings: Partial<SchoolSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const updateSocialLink = (cls: string, section: string, link: string) => {
    const key = `${cls}-${section}`;
    setSocialLinks(prev => ({ ...prev, [key]: link }));
  };

  const updateAdminProfile = (updatedAdmin: AdminUser) => {
    setAdminUsers(prev => prev.map(user => user.id === updatedAdmin.id ? updatedAdmin : user));
    if (currentAdmin && currentAdmin.id === updatedAdmin.id) {
      setCurrentAdmin(updatedAdmin);
    }
  };

  // --- REBUILT AUTH LOGIC ---

  const verifyNumber = async (mobile: string): Promise<boolean> => {
    // 1. Check for Admin in adminUsers array
    const matchedAdmin = adminUsers.find(a => a.mobile === mobile || a.username === mobile); // Allow username login via mobile field hack if needed, but primary is mobile
    
    if (matchedAdmin) {
      setLoginRole('admin');
      setLoginMobile(mobile);
      setPendingAdminUser(matchedAdmin);
      setLoginStep(1); // Move to OTP
      alert(`CONFIDENTIAL: Your Admin OTP is ${MOCK_OTP}`);
      return true;
    }

    // 2. Check for Student
    const matches = allStudents.filter(s => s.mobile === mobile);
    if (matches.length > 0) {
      if (!settings.enableStudentLogin) {
        throw new Error("Student portal is currently under maintenance.");
      }
      setLoginRole('student');
      setLoginMobile(mobile);
      setAvailableProfiles(matches); // Store for later
      setLoginStep(1); // Move to OTP
      alert(`Your OTP is ${MOCK_OTP}`);
      return true;
    }

    return false;
  };

  const verifyOTP = async (otp: string): Promise<'success' | 'next_step' | 'invalid'> => {
    if (otp !== MOCK_OTP) {
      return 'invalid';
    }

    if (loginRole === 'admin') {
      // Admin needs 2FA Password
      setLoginStep(2);
      return 'next_step';
    }

    if (loginRole === 'student') {
      // Student is authenticated
      if (availableProfiles.length === 1 || !settings.siblingLoginEnabled) {
        // Single profile
        const student = availableProfiles[0];
        setCurrentStudent(student);
        finalizeLogin(false);
        navigate('/');
      } else {
        // Multiple profiles
        finalizeLogin(false); // Auth is valid, but need selection
        navigate('/select-profile');
      }
      return 'success';
    }

    return 'invalid';
  };

  const verifyPassword = async (password: string): Promise<boolean> => {
    if (loginRole === 'admin' && pendingAdminUser) {
      if (password === pendingAdminUser.password) {
        setCurrentAdmin(pendingAdminUser);
        finalizeLogin(true);
        navigate('/admin/dashboard');
        return true;
      }
    }
    return false;
  };

  const finalizeLogin = (asAdmin: boolean) => {
    setIsLoggedIn(true);
    setIsAdmin(asAdmin);
    localStorage.setItem('isLoggedIn', 'true');
    if (asAdmin) localStorage.setItem('isAdmin', 'true');
    // Reset wizard state
    setLoginStep(0);
    setLoginRole(null);
    setLoginMobile('');
    setPendingAdminUser(null);
  };

  const resetAuthFlow = () => {
    setLoginStep(0);
    setLoginRole(null);
    setLoginMobile('');
    setPendingAdminUser(null);
    setAvailableProfiles([]);
  };

  const selectProfile = (admissionNo: string) => {
    const student = availableProfiles.find(s => s.admissionNo === admissionNo);
    if (student) {
      setCurrentStudent(student);
      navigate('/');
    }
  };

  const logout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('currentAdmin');
    setIsLoggedIn(false);
    setIsAdmin(false);
    setCurrentAdmin(null);
    resetAuthFlow();
    navigate('/');
  };

  const switchStudent = (admissionNo: string) => {
    const student = allStudents.find(s => s.admissionNo === admissionNo);
    if (student) setCurrentStudent(student);
  };

  // Helper to update both database (allStudents) and session (currentStudent)
  const updateStudentData = (updatedStudent: Student) => {
    setAllStudents(prev => prev.map(s => s.admissionNo === updatedStudent.admissionNo ? updatedStudent : s));
    if (currentStudent.admissionNo === updatedStudent.admissionNo) {
      setCurrentStudent(updatedStudent);
    }
  };

  // --- END AUTH LOGIC ---

  const addApplication = (app: Omit<ApplicationRecord, 'id' | 'color' | 'status'>) => {
    const newApp: ApplicationRecord = {
      ...app,
      id: Date.now(),
      status: 'Pending',
      color: 'bg-yellow-100 text-yellow-700'
    };
    setApplications(prev => [...prev, newApp]);
  };

  const addLeaveApplication = (app: Omit<LeaveApplication, 'id' | 'status' | 'appliedDate'>) => {
    const newLeave: LeaveApplication = {
      ...app,
      id: Date.now(),
      status: 'Pending',
      appliedDate: new Date().toISOString().split('T')[0]
    };
    setLeaveApplications(prev => [newLeave, ...prev]);
  };

  const updateLeaveStatus = (id: number, status: 'Approved' | 'Rejected') => {
    setLeaveApplications(prev => prev.map(app => app.id === id ? { ...app, status } : app));
  };

  const addAdmission = (app: Omit<AdmissionApplication, 'id' | 'status' | 'date'>) => {
    const newAdmission: AdmissionApplication = {
      ...app,
      id: Date.now(),
      status: 'Received',
      date: new Date().toISOString().split('T')[0] // Standardized format
    };
    setAdmissions(prev => [newAdmission, ...prev]);
  };
  
  const addFeedback = (fb: Omit<FeedbackType, 'id' | 'date' | 'read' | 'status'>) => {
    const newFeedback: FeedbackType = {
      ...fb,
      id: Date.now(),
      date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
      status: 'Unread'
    };
    setFeedback(prev => [newFeedback, ...prev]);
  };

  const addPost = (content: string) => {
    const newPost: Post = {
      id: Date.now(),
      author: 'Principal Office',
      role: 'Admin',
      content: content,
      timestamp: 'Just now',
      likes: 0
    };
    setPosts(prev => [newPost, ...prev]);
  };

  const deletePost = (id: number) => {
    setPosts(prev => prev.filter(p => p.id !== id));
  };

  // --- HOMEWORK ACTIONS ---
  const addHomework = (hw: Omit<HomeworkType, 'id' | 'status' | 'postedDate' | 'color'>) => {
    const newHomework: HomeworkType = {
      ...hw,
      id: Date.now(),
      status: 'pending',
      postedDate: new Date().toISOString().split('T')[0],
      color: 'bg-blue-500' // Default visual cue
    };
    setHomework(prev => [newHomework, ...prev]);
  };

  const deleteHomework = (id: number) => {
    setHomework(prev => prev.filter(h => h.id !== id));
  };

  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === Theme.LIGHT ? Theme.DARK : Theme.LIGHT));
  };

  return (
    <AuthContext.Provider value={{ 
      isLoggedIn, 
      isAdmin, 
      loginStep,
      loginRole,
      verifyNumber,
      verifyOTP,
      verifyPassword,
      resetAuthFlow,
      logout, 
      currentStudent, 
      allStudents, 
      setAllStudents, 
      availableProfiles, 
      selectProfile,
      switchStudent,
      updateStudentData,
      adminUsers,
      setAdminUsers,
      currentAdmin,
      setCurrentAdmin,
      updateAdminProfile
    }}>
      <ThemeContext.Provider value={{ theme, toggleTheme }}>
        <SchoolContext.Provider value={{
          settings, updateSettings,
          schoolName: settings.schoolName, // Proxy
          setSchoolName: (name) => updateSettings({ schoolName: name }), // Proxy
          currentSession: settings.currentSession, // Proxy
          setCurrentSession: (session) => updateSettings({ currentSession: session }), // Proxy
          dailyNotice, setDailyNotice,
          flashNotice, setFlashNotice,
          showBirthdayWidget, setShowBirthdayWidget,
          examResults, setExamResults,
          notices, setNotices,
          gallery, setGallery,
          magazines, setMagazines,
          applications, setApplications, addApplication,
          leaveApplications, setLeaveApplications, addLeaveApplication, updateLeaveStatus,
          attendance, setAttendance,
          timetable, setTimetable,
          admissions, setAdmissions, addAdmission,
          feedback, setFeedback, addFeedback,
          feeStructure, setFeeStructure,
          socialLinks, updateSocialLink,
          posts, setPosts, addPost, deletePost,
          homework, setHomework, addHomework, deleteHomework,
          notifications, unreadCount, markAllAsRead
        }}>
          <AppContent />
        </SchoolContext.Provider>
      </ThemeContext.Provider>
    </AuthContext.Provider>
  );
}

const AppWrapper: React.FC = () => (
  <Router><App /></Router>
);

export { AppWrapper as default };
