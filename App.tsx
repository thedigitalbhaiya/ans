
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
import { Achievements } from './components/Achievements'; // New Component
import { ProfileSelector } from './components/auth/ProfileSelector';
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
import { AdminUsers } from './components/admin/AdminUsers';
import { AdminAchievements } from './components/admin/AdminAchievements';

import { Theme, Student, Notice, Album, Magazine, ApplicationRecord, ExamResultsData, AttendanceRecords, SchoolTimetable, AdmissionApplication, Feedback as FeedbackType, FeeStructure, LeaveApplication, Post, SchoolSettings, FlashNotice, SocialLinksMap, Homework as HomeworkType, NotificationItem, AdminUser, Achievement } from './types';
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
  homeworkList as initialHomework,
  initialAchievements
} from './data';

// --- PERSISTENCE HELPER ---
function usePersistedState<T>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [state, setState] = useState<T>(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : initialValue;
    } catch (e) {
      console.error("Error loading state for key:", key, e);
      return initialValue;
    }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, setState];
}

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
  achievements: Achievement[];
  setAchievements: React.Dispatch<React.SetStateAction<Achievement[]>>;
  addAchievement: (achievement: Omit<Achievement, 'id'>) => void;
  deleteAchievement: (id: number) => void;
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
  achievements: [],
  setAchievements: () => {},
  addAchievement: () => {},
  deleteAchievement: () => {},
  schoolName: DEFAULT_SETTINGS.schoolName,
  setSchoolName: () => {},
  currentSession: DEFAULT_SETTINGS.currentSession,
  setCurrentSession: () => {},
  notifications: [],
  unreadCount: 0,
  markAllAsRead: () => {},
});

// --- AUTH WRAPPER FOR STUDENTS ---
const RequireStudentAuth = ({ children }: { children: React.ReactNode }) => {
  const { isLoggedIn } = useContext(AuthContext);
  const location = useLocation();

  if (!isLoggedIn) {
    // Generate a friendly message based on the path
    const path = location.pathname.split('/')[1];
    let pageName = 'this content';
    if (path) pageName = path.charAt(0).toUpperCase() + path.slice(1);
    
    // Custom overrides
    if (path === 'application') pageName = 'Leave Applications';
    if (path === 'circulars') pageName = 'School Notices';

    return <Navigate to="/profile" state={{ message: `Please login to view ${pageName}.`, from: location }} replace />;
  }

  return <>{children}</>;
};

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
              <Route path="achievements" element={<AdminAchievements />} />
              <Route path="settings" element={<AdminSettings />} />
              <Route path="users" element={<AdminUsers />} /> 
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
            <Route path="/circulars" element={<Notices />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/admission" element={<Admission />} />
            <Route path="/profile" element={isLoggedIn && !isAdmin ? <Profile /> : <Profile />} />
            
            {/* Protected Routes */}
            <Route path="/attendance" element={<RequireStudentAuth><Attendance /></RequireStudentAuth>} />
            <Route path="/homework" element={<RequireStudentAuth><Homework /></RequireStudentAuth>} />
            <Route path="/timetable" element={<RequireStudentAuth><Timetable /></RequireStudentAuth>} />
            <Route path="/fees" element={<RequireStudentAuth><Fees /></RequireStudentAuth>} />
            <Route path="/results" element={<RequireStudentAuth><Results /></RequireStudentAuth>} />
            <Route path="/feedback" element={<RequireStudentAuth><Feedback /></RequireStudentAuth>} />
            <Route path="/application" element={<RequireStudentAuth><Application /></RequireStudentAuth>} />
            <Route path="/achievements" element={<RequireStudentAuth><Achievements /></RequireStudentAuth>} />
            
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
  
  // Persisted Data States using usePersistedState helper
  const [adminUsers, setAdminUsers] = usePersistedState<AdminUser[]>('adminUsers', INITIAL_ADMINS);
  const [settings, setSettings] = usePersistedState<SchoolSettings>('schoolSettings', DEFAULT_SETTINGS);
  const [allStudents, setAllStudents] = usePersistedState<Student[]>('allStudents', initialStudents);
  
  // Other Persisted School Data
  const [dailyNotice, setDailyNotice] = usePersistedState('dailyNotice', initialNotice);
  const [examResults, setExamResults] = usePersistedState<ExamResultsData>('examResults', initialResults);
  const [notices, setNotices] = usePersistedState<Notice[]>('noticesList', initialNotices);
  const [gallery, setGallery] = usePersistedState<Album[]>('gallery', initialAlbums);
  const [magazines, setMagazines] = usePersistedState<Magazine[]>('magazines', initialMagazines);
  const [applications, setApplications] = usePersistedState<ApplicationRecord[]>('applications', initialApplications);
  const [leaveApplications, setLeaveApplications] = usePersistedState<LeaveApplication[]>('leaveApplications', initialLeaveApplications);
  const [attendance, setAttendance] = usePersistedState<AttendanceRecords>('attendanceRecords', initialAttendance);
  const [timetable, setTimetable] = usePersistedState<SchoolTimetable>('timetable', initialTimetable);
  const [admissions, setAdmissions] = usePersistedState<AdmissionApplication[]>('admissions', initialAdmissions);
  const [feedback, setFeedback] = usePersistedState<FeedbackType[]>('feedback', initialFeedback);
  const [posts, setPosts] = usePersistedState<Post[]>('posts', initialCampusPosts);
  const [homework, setHomework] = usePersistedState<HomeworkType[]>('homework', initialHomework);
  const [achievements, setAchievements] = usePersistedState<Achievement[]>('achievements', initialAchievements);
  const [socialLinks, setSocialLinks] = usePersistedState<SocialLinksMap>('schoolSocialLinks', {});
  const [feeStructure, setFeeStructure] = usePersistedState<FeeStructure>('feeStructure', {
    "Nursery": 800, "LKG": 800, "UKG": 800,
    "I": 1000, "II": 1000, "III": 1000, "IV": 1000, "V": 1000,
    "VI": 1200, "VII": 1200, "VIII": 1200,
    "IX": 1500, "X": 1500, "XI": 2000, "XII": 2000
  });

  // Non-persisted local state
  const [currentAdmin, setCurrentAdmin] = useState<AdminUser | null>(() => {
    const saved = localStorage.getItem('currentAdmin');
    return saved ? JSON.parse(saved) : null;
  });

  const [loginStep, setLoginStep] = useState(0); 
  const [loginRole, setLoginRole] = useState<'student' | 'admin' | null>(null);
  const [loginMobile, setLoginMobile] = useState('');
  const [pendingAdminUser, setPendingAdminUser] = useState<AdminUser | null>(null);

  const [currentStudent, setCurrentStudent] = useState<Student>(initialStudents[0]);
  const [availableProfiles, setAvailableProfiles] = useState<Student[]>([]);
  
  const [flashNotice, setFlashNotice] = useState<FlashNotice>({
    isVisible: false,
    title: 'Urgent Announcement',
    message: '',
    targetAudience: 'ALL',
    actionLink: ''
  });

  const [showBirthdayWidget, setShowBirthdayWidget] = useState(true);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  // Auto-Generate Notifications Effect
  useEffect(() => {
    const newFeedback = feedback.filter(f => f.status === 'Unread');
    const newLeave = leaveApplications.filter(l => l.status === 'Pending');
    const newAdmissions = admissions.filter(a => a.status === 'Received');

    setNotifications(prev => {
      const existingIds = new Set(prev.map(n => n.id));
      const nextNotifications = [...prev];
      let hasNew = false;

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

      return hasNew ? nextNotifications : prev;
    });
  }, [feedback, leaveApplications, admissions]);

  // Derived notification values
  const unreadCount = notifications.filter(n => !n.isRead).length;
  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  // Sync Current Admin
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

  // --- AUTH LOGIC ---
  const verifyNumber = async (mobile: string): Promise<boolean> => {
    const matchedAdmin = adminUsers.find(a => a.mobile === mobile || a.username === mobile);
    if (matchedAdmin) {
      setLoginRole('admin');
      setLoginMobile(mobile);
      setPendingAdminUser(matchedAdmin);
      setLoginStep(1);
      alert(`CONFIDENTIAL: Your Admin OTP is ${MOCK_OTP}`);
      return true;
    }

    const matches = allStudents.filter(s => s.mobile === mobile);
    if (matches.length > 0) {
      if (!settings.enableStudentLogin) throw new Error("Student portal is currently under maintenance.");
      setLoginRole('student');
      setLoginMobile(mobile);
      setAvailableProfiles(matches);
      setLoginStep(1);
      alert(`Your OTP is ${MOCK_OTP}`);
      return true;
    }
    return false;
  };

  const verifyOTP = async (otp: string): Promise<'success' | 'next_step' | 'invalid'> => {
    if (otp !== MOCK_OTP) return 'invalid';
    if (loginRole === 'admin') {
      setLoginStep(2);
      return 'next_step';
    }
    if (loginRole === 'student') {
      if (availableProfiles.length === 1 || !settings.siblingLoginEnabled) {
        setCurrentStudent(availableProfiles[0]);
        finalizeLogin(false);
        navigate('/');
      } else {
        finalizeLogin(false);
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

  const updateStudentData = (updatedStudent: Student) => {
    setAllStudents(prev => prev.map(s => s.admissionNo === updatedStudent.admissionNo ? updatedStudent : s));
    if (currentStudent.admissionNo === updatedStudent.admissionNo) {
      setCurrentStudent(updatedStudent);
    }
  };

  // --- ACTIONS ---
  const addApplication = (app: Omit<ApplicationRecord, 'id' | 'color' | 'status'>) => {
    const newApp: ApplicationRecord = { ...app, id: Date.now(), status: 'Pending', color: 'bg-yellow-100 text-yellow-700' };
    setApplications(prev => [...prev, newApp]);
  };

  const addLeaveApplication = (app: Omit<LeaveApplication, 'id' | 'status' | 'appliedDate'>) => {
    const newLeave: LeaveApplication = { ...app, id: Date.now(), status: 'Pending', appliedDate: new Date().toISOString().split('T')[0] };
    setLeaveApplications(prev => [newLeave, ...prev]);
  };

  const updateLeaveStatus = (id: number, status: 'Approved' | 'Rejected') => {
    setLeaveApplications(prev => prev.map(app => app.id === id ? { ...app, status } : app));
  };

  const addAdmission = (app: Omit<AdmissionApplication, 'id' | 'status' | 'date'>) => {
    const newAdmission: AdmissionApplication = { ...app, id: Date.now(), status: 'Received', date: new Date().toISOString().split('T')[0] };
    setAdmissions(prev => [newAdmission, ...prev]);
  };
  
  const addFeedback = (fb: Omit<FeedbackType, 'id' | 'date' | 'read' | 'status'>) => {
    const newFeedback: FeedbackType = { ...fb, id: Date.now(), date: new Date().toISOString().split('T')[0], status: 'Unread' };
    setFeedback(prev => [newFeedback, ...prev]);
  };

  const addPost = (content: string) => {
    const newPost: Post = { id: Date.now(), author: 'Principal Office', role: 'Admin', content: content, timestamp: 'Just now', likes: 0 };
    setPosts(prev => [newPost, ...prev]);
  };

  const deletePost = (id: number) => {
    setPosts(prev => prev.filter(p => p.id !== id));
  };

  const addHomework = (hw: Omit<HomeworkType, 'id' | 'status' | 'postedDate' | 'color'>) => {
    const newHomework: HomeworkType = { ...hw, id: Date.now(), status: 'pending', postedDate: new Date().toISOString().split('T')[0], color: 'bg-blue-500' };
    setHomework(prev => [newHomework, ...prev]);
  };

  const deleteHomework = (id: number) => {
    setHomework(prev => prev.filter(h => h.id !== id));
  };

  const addAchievement = (achievement: Omit<Achievement, 'id'>) => {
    const newAchievement: Achievement = { ...achievement, id: Date.now() };
    setAchievements(prev => [newAchievement, ...prev]);
  };

  const deleteAchievement = (id: number) => {
    setAchievements(prev => prev.filter(a => a.id !== id));
  };

  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === Theme.LIGHT ? Theme.DARK : Theme.LIGHT));
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, isAdmin, loginStep, loginRole, verifyNumber, verifyOTP, verifyPassword, resetAuthFlow, logout, currentStudent, allStudents, setAllStudents, availableProfiles, selectProfile, switchStudent, updateStudentData, adminUsers, setAdminUsers, currentAdmin, setCurrentAdmin, updateAdminProfile }}>
      <ThemeContext.Provider value={{ theme, toggleTheme }}>
        <SchoolContext.Provider value={{ settings, updateSettings, schoolName: settings.schoolName, setSchoolName: (name) => updateSettings({ schoolName: name }), currentSession: settings.currentSession, setCurrentSession: (session) => updateSettings({ currentSession: session }), dailyNotice, setDailyNotice, flashNotice, setFlashNotice, showBirthdayWidget, setShowBirthdayWidget, examResults, setExamResults, notices, setNotices, gallery, setGallery, magazines, setMagazines, applications, setApplications, addApplication, leaveApplications, setLeaveApplications, addLeaveApplication, updateLeaveStatus, attendance, setAttendance, timetable, setTimetable, admissions, setAdmissions, addAdmission, feedback, setFeedback, addFeedback, feeStructure, setFeeStructure, socialLinks, updateSocialLink, posts, setPosts, addPost, deletePost, homework, setHomework, addHomework, deleteHomework, achievements, setAchievements, addAchievement, deleteAchievement, notifications, unreadCount, markAllAsRead }}>
          <AppContent />
        </SchoolContext.Provider>
      </ThemeContext.Provider>
    </AuthContext.Provider>
  );
}

const AppWrapper: React.FC = () => ( <Router><App /></Router> );
export { AppWrapper as default };
