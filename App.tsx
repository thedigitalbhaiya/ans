
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
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
import { Theme, Student } from './types';
import { studentsList } from './data';

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
  login: () => void;
  logout: () => void;
  currentStudent: Student;
  allStudents: Student[];
  switchStudent: (admissionNo: string) => void;
}>({
  isLoggedIn: false,
  login: () => {},
  logout: () => {},
  currentStudent: studentsList[0],
  allStudents: [],
  switchStudent: () => {},
});

const AppContent: React.FC = () => {
  const location = useLocation();
  
  return (
    <Layout>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/homework" element={<Homework />} />
        <Route path="/timetable" element={<Timetable />} />
        <Route path="/circulars" element={<Notices />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/fees" element={<Fees />} />
        <Route path="/results" element={<Results />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/application" element={<Application />} />
        <Route path="/admission" element={<Admission />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
};

export default function App() {
  const [theme, setTheme] = useState<Theme>(Theme.LIGHT); // Default to light
  
  // Persistent Login State
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });

  // Manage Current Student
  const [currentStudent, setCurrentStudent] = useState<Student>(studentsList[0]);

  const login = () => {
    localStorage.setItem('isLoggedIn', 'true');
    setIsLoggedIn(true);
    // Reset to first student on login
    setCurrentStudent(studentsList[0]);
  };

  const logout = () => {
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
  };

  const switchStudent = (admissionNo: string) => {
    const student = studentsList.find(s => s.admissionNo === admissionNo);
    if (student) {
      setCurrentStudent(student);
    }
  };

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === Theme.LIGHT ? Theme.DARK : Theme.LIGHT));
  };

  return (
    <AuthContext.Provider value={{ 
      isLoggedIn, 
      login, 
      logout, 
      currentStudent, 
      allStudents: studentsList,
      switchStudent
    }}>
      <ThemeContext.Provider value={{ theme, toggleTheme }}>
        <Router>
           <AppContent />
           {/* Forced Login Overlay Removed - Users can now browse freely */}
        </Router>
      </ThemeContext.Provider>
    </AuthContext.Provider>
  );
}
