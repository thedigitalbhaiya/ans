
import React, { useState, useEffect, useContext, useCallback } from 'react';
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
import { Achievements } from './components/Achievements'; 
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

// Persistence Helper
function usePersistedState<T>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [state, setState] = useState<T>(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : initialValue;
    } catch (e) {
      return initialValue;
    }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, setState];
}

const MOCK_OTP = '1234';

const INITIAL_ADMINS: AdminUser[] = [
  { 
    id: 1, 
    name: "Principal", 
    username: "admin", 
    password: "123", 
    role: "Super Admin", 
    photo: "https://ui-avatars.com/api/?name=Principal&background=0D8ABC&color=fff",
    mobile: '8709605412' 
  },
  { 
    id: 2, 
    name: "Ms. Anjali", 
    username: "teacher", 
    password: "123", 
    role: "Teacher", 
    assignedClass: "X",
    assignedSection: "A",
    photo: "https://ui-avatars.com/api/?name=Anjali+Teacher&background=random",
    mobile: '9988776655' 
  }
];

const DEFAULT_SETTINGS: SchoolSettings = {
  schoolName: 'Azim National School',
  schoolAddress: 'Bahadurganj, Kishanganj, Bihar - 855101',
  contactNumber: '+91 94306 46481',
  email: 'azimnationalschool@gmail.com',
  logoUrl: 'https://cdn-icons-png.flaticon.com/512/2996/2996962.png',
  currentSession: '2025-26',
  totalTeachers: 28, 
  idCardHeader: 'AZIM NATIONAL SCHOOL',
  idCardSubHeader: 'Affiliated to CBSE, Delhi',
  idCardAddress: 'Bahadurganj, Kishanganj, Bihar',
  idCardThemeColor: '#0077D4',
  enableStudentLogin: true,
  showResults: true,
  admissionsOpen: true,
  enableOnlineFees: true,
  siblingLoginEnabled: true,
  enableHomework: true,
  staffPermissions: {
    allowFees: true,
    allowAdmissions: true,
    allowNotices: true,
    allowGallery: true,
    allowFeedback: true
  }
};

export const ThemeContext = React.createContext({ theme: Theme.LIGHT, toggleTheme: () => {} });

export const AuthContext = React.createContext<{
  isLoggedIn: boolean;
  isAdmin: boolean;
  loginStep: number;
  loginRole: 'student' | 'admin' | null;
  verifyNumber: (mobile: string) => Promise<boolean>;
  verifyOTP: (otp: string) => Promise<'success' | 'next_step' | 'invalid'>;
  verifyPassword: (password: string) => Promise<boolean>;
  resetAuthFlow: () => void;
  logout: () => void;
  currentStudent: Student;
  allStudents: Student[];
  setAllStudents: React.Dispatch<React.SetStateAction<Student[]>>;
  availableProfiles: Student[];
  selectProfile: (admissionNo: string) => void;
  switchStudent: (admissionNo: string) => void;
  updateStudentData: (student: Student) => void;
  adminUsers: AdminUser[];
  setAdminUsers: React.Dispatch<React.SetStateAction<AdminUser[]>>;
  currentAdmin: AdminUser | null;
  setCurrentAdmin: React.Dispatch<React.SetStateAction<AdminUser | null>>;
  updateAdminProfile: (admin: AdminUser) => void;
}>({
  isLoggedIn: false, isAdmin: false, loginStep: 0, loginRole: null,
  verifyNumber: async () => false, verifyOTP: async () => 'invalid', verifyPassword: async () => false,
  resetAuthFlow: () => {}, logout: () => {}, currentStudent: initialStudents[0], allStudents: [],
  setAllStudents: () => {}, availableProfiles: [], selectProfile: () => {}, switchStudent: () => {},
  updateStudentData: () => {}, adminUsers: [], setAdminUsers: () => {}, currentAdmin: null,
  setCurrentAdmin: () => {}, updateAdminProfile: () => {},
});

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
  schoolName: string;
  setSchoolName: (name: string) => void;
  currentSession: string;
  setCurrentSession: (session: string) => void;
  notifications: NotificationItem[];
  unreadCount: number;
  markAllAsRead: () => void;
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
}>({
  settings: DEFAULT_SETTINGS, updateSettings: () => {}, dailyNotice: initialNotice, setDailyNotice: () => {},
  flashNotice: { isVisible: false, title: '', message: '', targetAudience: 'ALL' }, setFlashNotice: () => {},
  showBirthdayWidget: true, setShowBirthdayWidget: () => {}, examResults: initialResults, setExamResults: () => {},
  notices: [], setNotices: () => {}, gallery: [], setGallery: () => {}, magazines: [], setMagazines: () => {},
  applications: [], setApplications: () => {}, addApplication: () => {}, leaveApplications: [],
  setLeaveApplications: () => {}, addLeaveApplication: () => {}, updateLeaveStatus: () => {},
  attendance: {}, setAttendance: () => {}, timetable: initialTimetable, setTimetable: () => {},
  admissions: [], setAdmissions: () => {}, addAdmission: () => {}, feedback: [], setFeedback: () => {},
  addFeedback: () => {}, feeStructure: {}, setFeeStructure: () => {}, socialLinks: {}, updateSocialLink: () => {},
  posts: [], setPosts: () => {}, addPost: () => {}, deletePost: () => {}, homework: [], setHomework: () => {},
  addHomework: () => {}, deleteHomework: () => {}, achievements: [], setAchievements: () => {},
  addAchievement: () => {}, deleteAchievement: () => {}, schoolName: DEFAULT_SETTINGS.schoolName,
  setSchoolName: () => {}, currentSession: DEFAULT_SETTINGS.currentSession, setCurrentSession: () => {},
  notifications: [], unreadCount: 0, markAllAsRead: () => {}, isModalOpen: false, setIsModalOpen: () => {},
});

const RequireStudentAuth = ({ children }: React.PropsWithChildren) => {
  const { isLoggedIn, isAdmin } = useContext(AuthContext);
  const location = useLocation();
  if (!isLoggedIn) return <Navigate to="/profile" state={{ message: "Please login to access this section.", from: location }} replace />;
  return <>{children}</>;
};

const ProtectedRoute = ({ isAllowed, redirectTo, children }: { isAllowed: boolean; redirectTo: string; children?: React.ReactNode }) => {
  if (!isAllowed) return <Navigate to={redirectTo} replace />;
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
            <Route path="/profile" element={<Profile />} />
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

function App() {
  const [theme, setTheme] = useState<Theme>(Theme.LIGHT);
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('isLoggedIn') === 'true');
  const [isAdmin, setIsAdmin] = useState(() => localStorage.getItem('isAdmin') === 'true');
  const [adminUsers, setAdminUsers] = usePersistedState<AdminUser[]>('adminUsers', INITIAL_ADMINS);
  const [settings, setSettings] = usePersistedState<SchoolSettings>('schoolSettings', DEFAULT_SETTINGS);
  const [allStudents, setAllStudents] = usePersistedState<Student[]>('allStudents', initialStudents);
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
    "Nursery": 800, "LKG": 800, "UKG": 800, "I": 1000, "II": 1000, "III": 1000, "IV": 1000, "V": 1000,
    "VI": 1200, "VII": 1200, "VIII": 1200, "IX": 1500, "X": 1500, "XI": 2000, "XII": 2000
  });

  const [currentAdmin, setCurrentAdmin] = useState<AdminUser | null>(() => {
    const saved = localStorage.getItem('currentAdmin');
    return saved ? JSON.parse(saved) : null;
  });

  const [currentStudent, setCurrentStudent] = useState<Student>(() => {
    const saved = localStorage.getItem('currentStudent');
    return saved ? JSON.parse(saved) : initialStudents[0];
  });

  useEffect(() => {
    localStorage.setItem('currentStudent', JSON.stringify(currentStudent));
  }, [currentStudent]);

  const [loginStep, setLoginStep] = useState(0); 
  const [loginRole, setLoginRole] = useState<'student' | 'admin' | null>(null);
  const [availableProfiles, setAvailableProfiles] = usePersistedState<Student[]>('availableProfiles', []);
  const [flashNotice, setFlashNotice] = useState<FlashNotice>({ isVisible: false, title: '', message: '', targetAudience: 'ALL' });
  const [isModalOpen, setIsModalOpen] = useState(false);

  // CRITICAL FIX: Ensure siblings are always found when student data changes or on load
  useEffect(() => {
    if (isLoggedIn && !isAdmin && currentStudent) {
        const siblings = allStudents.filter(s => s.mobile === currentStudent.mobile);
        if (siblings.length > 0) {
            setAvailableProfiles(siblings);
        }
    }
  }, [isLoggedIn, isAdmin, currentStudent, allStudents, setAvailableProfiles]);

  useEffect(() => {
    if (currentAdmin) localStorage.setItem('currentAdmin', JSON.stringify(currentAdmin));
    else localStorage.removeItem('currentAdmin');
  }, [currentAdmin]);

  const verifyNumber = async (mobile: string): Promise<boolean> => {
    const matchedAdmin = adminUsers.find(a => a.mobile === mobile || a.username === mobile);
    if (matchedAdmin) {
      setLoginRole('admin');
      setLoginStep(1);
      alert(`Admin OTP: ${MOCK_OTP}`);
      return true;
    }
    const matches = allStudents.filter(s => s.mobile === mobile);
    if (matches.length > 0) {
      setLoginRole('student');
      setAvailableProfiles(matches);
      setLoginStep(1);
      alert(`Student OTP: ${MOCK_OTP}`);
      return true;
    }
    return false;
  };

  const verifyOTP = async (otp: string): Promise<'success' | 'next_step' | 'invalid'> => {
    if (otp !== MOCK_OTP) return 'invalid';
    if (loginRole === 'admin') { setLoginStep(2); return 'next_step'; }
    if (loginRole === 'student') {
      if (availableProfiles.length === 1) {
        setCurrentStudent(availableProfiles[0]);
        finalizeLogin(false);
        navigate('/');
        return 'success';
      } else {
        setLoginStep(0); 
        navigate('/select-profile');
        return 'success';
      }
    }
    return 'invalid';
  };

  const verifyPassword = async (password: string): Promise<boolean> => {
    const matchedAdmin = adminUsers.find(a => a.password === password);
    if (loginRole === 'admin' && matchedAdmin) {
        setCurrentAdmin(matchedAdmin);
        finalizeLogin(true);
        navigate('/admin/dashboard');
        return true;
    }
    return false;
  };

  const finalizeLogin = (asAdmin: boolean) => {
    setIsLoggedIn(true);
    setIsAdmin(asAdmin);
    localStorage.setItem('isLoggedIn', 'true');
    if (asAdmin) localStorage.setItem('isAdmin', 'true');
    else localStorage.removeItem('isAdmin');
    setLoginStep(0);
  };

  const logout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setIsAdmin(false);
    setCurrentAdmin(null);
    setCurrentStudent(initialStudents[0]);
    navigate('/');
  };

  const selectProfile = useCallback((admissionNo: string) => {
    const found = allStudents.find(s => s.admissionNo === admissionNo);
    if (found) {
      setCurrentStudent(found);
      finalizeLogin(false);
      navigate('/');
    }
  }, [allStudents, navigate]);

  const switchStudent = useCallback((admissionNo: string) => {
    const found = allStudents.find(s => s.admissionNo === admissionNo);
    if (found) {
      setCurrentStudent({...found}); // Force object reference change for re-renders
      navigate('/');
    }
  }, [allStudents, navigate]);

  const addAchievement = (achievement: Omit<Achievement, 'id'>) => setAchievements(prev => [{ ...achievement, id: Date.now() }, ...prev]);
  const deleteAchievement = (id: number) => setAchievements(prev => prev.filter(a => a.id !== id));

  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
  }, [theme]);

  return (
    <AuthContext.Provider value={{ isLoggedIn, isAdmin, loginStep, loginRole, verifyNumber, verifyOTP, verifyPassword, resetAuthFlow: () => setLoginStep(0), logout, currentStudent, allStudents, setAllStudents, availableProfiles, selectProfile, switchStudent, updateStudentData: (s) => setAllStudents(prev => prev.map(st => st.admissionNo === s.admissionNo ? s : st)), adminUsers, setAdminUsers, currentAdmin, setCurrentAdmin, updateAdminProfile: (a) => setAdminUsers(prev => prev.map(ad => ad.id === a.id ? a : ad)) }}>
      <ThemeContext.Provider value={{ theme, toggleTheme: () => setTheme(prev => prev === Theme.LIGHT ? Theme.DARK : Theme.LIGHT) }}>
        <SchoolContext.Provider value={{ settings, updateSettings: (s) => setSettings(prev => ({...prev, ...s})), schoolName: settings.schoolName, setSchoolName: (n) => setSettings(prev => ({...prev, schoolName: n})), currentSession: settings.currentSession, setCurrentSession: (s) => setSettings(prev => ({...prev, currentSession: s})), dailyNotice, setDailyNotice, flashNotice, setFlashNotice, showBirthdayWidget: true, setShowBirthdayWidget: () => {}, examResults, setExamResults, notices, setNotices, gallery, setGallery, magazines, setMagazines, applications, setApplications, addApplication: () => {}, leaveApplications, setLeaveApplications, addLeaveApplication: (a) => setLeaveApplications(prev => [{...a, id: Date.now(), status: 'Pending', appliedDate: new Date().toISOString().split('T')[0]}, ...prev]), updateLeaveStatus: (id, s) => setLeaveApplications(prev => prev.map(a => a.id === id ? {...a, status: s} : a)), attendance, setAttendance, timetable, setTimetable, admissions, setAdmissions, addAdmission: (a) => setAdmissions(prev => [{...a, id: Date.now(), status: 'Received', date: new Date().toISOString().split('T')[0]}, ...prev]), feedback, setFeedback, addFeedback: (f) => setFeedback(prev => [{...f, id: Date.now(), status: 'Unread', date: new Date().toISOString().split('T')[0]}, ...prev]), feeStructure, setFeeStructure, socialLinks, updateSocialLink: (c, s, l) => setSocialLinks(prev => ({...prev, [`${c}-${s}`]: l})), posts, setPosts, addPost: (c) => setPosts(prev => [{id: Date.now(), author: 'Admin', role: 'Staff', content: c, timestamp: 'Now', likes: 0}, ...prev]), deletePost: (id) => setPosts(prev => prev.filter(p => p.id !== id)), homework, setHomework, addHomework: (h) => setHomework(prev => [{...h, id: Date.now(), status: 'pending', postedDate: new Date().toISOString().split('T')[0]}, ...prev]), deleteHomework: (id) => setHomework(prev => prev.filter(h => h.id !== id)), achievements, setAchievements, addAchievement, deleteAchievement, notifications: [], unreadCount: 0, markAllAsRead: () => {}, isModalOpen, setIsModalOpen }}>
          <AppContent />
        </SchoolContext.Provider>
      </ThemeContext.Provider>
    </AuthContext.Provider>
  );
}

const AppWrapper: React.FC = () => ( <Router><App /></Router> );
export { AppWrapper as default };
