
import React, { useContext, useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ThemeContext, AuthContext, SchoolContext } from '../App';
import { 
  LayoutDashboard, 
  CalendarDays, 
  BookOpen, 
  Bell, 
  User, 
  Moon, 
  Sun,
  Clock,
  CreditCard,
  Trophy,
  LogOut,
  FileText,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Check,
  IdCard
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Theme } from '../types';
import { Logo } from './Logo';

// Navigation Items
const navItems = [
  { path: '/', label: 'Home', icon: LayoutDashboard },
  { path: '/attendance', label: 'Attendance', icon: CalendarDays },
  { path: '/profile', label: 'Student ID', icon: IdCard },
  { path: '/fees', label: 'Fees', icon: CreditCard },
  { path: '/results', label: 'Results', icon: Trophy },
  { path: '/timetable', label: 'Schedule', icon: Clock },
  { path: '/circulars', label: 'Circulars', icon: Bell },
  { path: '/application', label: 'Application', icon: FileText },
];

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { logout, currentStudent, allStudents, switchStudent, isLoggedIn } = useContext(AuthContext);
  const { schoolName } = useContext(SchoolContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const isHome = location.pathname === '/';

  // Responsive sidebar logic
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && window.innerWidth < 1280) {
        setIsCollapsed(true);
      } else if (window.innerWidth >= 1280) {
        setIsCollapsed(false);
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize(); 
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogoClick = () => {
    if (isLoggedIn && !isCollapsed) {
      setShowProfileMenu(!showProfileMenu);
    } else {
      navigate('/profile');
    }
  };

  const ProfileSwitcherMenu = () => (
    <motion.div 
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-[#2C2C2E] rounded-2xl shadow-xl border border-slate-100 dark:border-white/10 overflow-hidden z-50"
    >
       <div className="p-3 bg-slate-50 dark:bg-white/5 border-b border-slate-100 dark:border-white/5">
         <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Switch Profile</span>
       </div>
       <div className="p-2 space-y-1">
         {allStudents.map((student) => (
           <button
             key={student.admissionNo}
             onClick={() => {
               switchStudent(student.admissionNo);
               setShowProfileMenu(false);
               navigate('/');
             }}
             className={`w-full flex items-center gap-3 p-2 rounded-xl transition-colors ${
               currentStudent.admissionNo === student.admissionNo 
                 ? 'bg-ios-blue/10 dark:bg-blue-500/20' 
                 : 'hover:bg-slate-100 dark:hover:bg-white/5'
             }`}
           >
              <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-200 dark:border-white/10">
                <img src={student.avatar} alt={student.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 text-left">
                <p className={`text-sm font-bold truncate ${
                   currentStudent.admissionNo === student.admissionNo 
                     ? 'text-ios-blue dark:text-blue-400' 
                     : 'text-slate-900 dark:text-white'
                }`}>
                  {student.name.split(' ')[0]}
                </p>
                <p className="text-[10px] text-slate-500 truncate">Class {student.class}</p>
              </div>
              {currentStudent.admissionNo === student.admissionNo && (
                <Check size={16} className="text-ios-blue dark:text-blue-400" />
              )}
           </button>
         ))}
       </div>
    </motion.div>
  );

  return (
    <div className="flex h-screen w-full overflow-hidden bg-ios-bg dark:bg-black transition-colors duration-500 font-sans">
      {/* Sidebar for Desktop */}
      <aside 
        className={`hidden md:flex flex-col h-full bg-white/80 dark:bg-[#1C1C1E]/80 backdrop-blur-2xl border-r border-ios-divider/20 dark:border-white/10 pt-8 pb-6 transition-all duration-300 z-20 relative ${
          isCollapsed ? 'w-20 px-2' : 'w-72 px-4'
        }`}
      >
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-9 p-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-slate-400 hover:text-ios-blue transition-colors shadow-sm z-30"
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>

        <div 
          className={`flex items-center gap-3 mb-8 cursor-pointer transition-all ${isCollapsed ? 'justify-center px-0' : 'px-2'}`} 
          onClick={handleLogoClick}
        >
            <Logo className="w-10 h-10 flex-shrink-0" />
            <div className={`overflow-hidden transition-all duration-300 ${isCollapsed ? 'w-0 opacity-0 hidden' : 'w-auto opacity-100'}`}>
              <h1 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight leading-none whitespace-nowrap">
                {schoolName.split(' ')[0]}
              </h1>
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap">
                School App
              </span>
            </div>
        </div>
        
        {/* User Profile */}
        <div className="relative mb-6" ref={menuRef}>
          {isLoggedIn ? (
              <button 
                 onClick={() => isCollapsed ? navigate('/profile') : setShowProfileMenu(!showProfileMenu)}
                 className={`flex items-center gap-3 w-full group outline-none transition-all ${isCollapsed ? 'justify-center px-0' : 'px-4'}`}
              >
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white dark:border-white/10 shadow-md ring-2 ring-slate-100 dark:ring-white/5 transition-transform group-hover:scale-105 flex-shrink-0">
                  <img src={currentStudent.avatar} alt="Profile" className="w-full h-full object-cover" />
                </div>
                <div className={`flex-1 min-w-0 text-left transition-all duration-300 ${isCollapsed ? 'w-0 opacity-0 hidden' : 'w-auto opacity-100'}`}>
                  <span className="text-sm font-bold tracking-tight text-slate-900 dark:text-white block truncate group-hover:text-ios-blue transition-colors">
                    {currentStudent.name.split(' ')[0]}
                  </span>
                  <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                    ID: {currentStudent.admissionNo.split('/')[2] || '---'}
                  </span>
                </div>
                {!isCollapsed && <ChevronDown size={16} className={`text-slate-400 transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} />}
              </button>
          ) : (
             <Link to="/profile" className={`flex items-center gap-3 w-full group ${isCollapsed ? 'justify-center px-0' : 'px-4'}`}>
               <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center border-2 border-dashed border-slate-300 dark:border-white/20 flex-shrink-0">
                 <User size={20} className="text-slate-400" />
               </div>
               <div className={`text-left transition-all duration-300 ${isCollapsed ? 'w-0 opacity-0 hidden' : 'w-auto opacity-100'}`}>
                 <span className="text-sm font-bold text-slate-900 dark:text-white whitespace-nowrap">Guest</span>
                 <span className="text-[10px] text-ios-blue dark:text-blue-400 font-bold block">Login</span>
               </div>
             </Link>
          )}
          
          <AnimatePresence>
            {showProfileMenu && !isCollapsed && <ProfileSwitcherMenu />}
          </AnimatePresence>
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto no-scrollbar py-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className="relative group block"
                title={isCollapsed ? item.label : undefined}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-nav"
                    className="absolute inset-0 bg-ios-blue dark:bg-blue-600 shadow-lg shadow-ios-blue/20 dark:shadow-blue-600/20 rounded-xl"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <div className={`relative flex items-center gap-3 py-3 rounded-xl transition-colors duration-200 ${
                  isActive 
                    ? 'text-white' 
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
                } ${isCollapsed ? 'justify-center px-0' : 'px-4'}`}>
                  <Icon size={22} className={`${isActive ? 'text-white' : 'text-slate-400 dark:text-slate-500 group-hover:text-current transition-colors'} flex-shrink-0`} strokeWidth={2} />
                  <span className={`font-medium whitespace-nowrap transition-all duration-300 ${isCollapsed ? 'w-0 opacity-0 hidden' : 'w-auto opacity-100'}`}>
                    {item.label}
                  </span>
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="space-y-2 pt-4 border-t border-ios-divider/20 dark:border-white/10">
          <button
            onClick={toggleTheme}
            className={`w-full flex items-center gap-3 py-3 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors ${isCollapsed ? 'justify-center px-0' : 'px-4'}`}
          >
            {theme === Theme.LIGHT ? <Moon size={22} /> : <Sun size={22} />}
            <span className={`font-medium whitespace-nowrap transition-all duration-300 ${isCollapsed ? 'w-0 opacity-0 hidden' : 'w-auto opacity-100'}`}>
              {theme === Theme.LIGHT ? 'Dark Mode' : 'Light Mode'}
            </span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 h-full overflow-y-auto overflow-x-hidden relative no-scrollbar bg-ios-bg dark:bg-black transition-colors duration-500">
        {/* Header for Mobile */}
        <header className="md:hidden sticky top-0 z-30 flex items-center justify-between px-6 py-4 bg-white/80 dark:bg-[#1C1C1E]/80 backdrop-blur-xl border-b border-ios-divider/10 dark:border-white/10">
           {isHome ? (
             <div className="relative" ref={menuRef}>
               {isLoggedIn ? (
                   <button 
                      onClick={() => setShowProfileMenu(!showProfileMenu)}
                      className="flex items-center gap-3 active:opacity-80 transition-opacity"
                   >
                     <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden border border-slate-100 dark:border-white/10 shadow-sm relative">
                       <img src={currentStudent.avatar} alt="Profile" className="w-full h-full object-cover" />
                     </div>
                     <div className="text-left">
                        <div className="flex items-center gap-1">
                          <span className="text-sm font-bold text-slate-900 dark:text-white block leading-none">
                            {currentStudent.name.split(' ')[0]}
                          </span>
                          <ChevronDown size={12} className="text-slate-400" />
                        </div>
                        <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block leading-none mt-1 uppercase tracking-wider">
                          Class {currentStudent.class}
                        </span>
                     </div>
                   </button>
               ) : (
                 <Link to="/profile" className="flex items-center gap-3">
                    <Logo className="w-10 h-10" />
                    <div>
                      <span className="text-sm font-bold text-slate-900 dark:text-white block">Guest</span>
                      <span className="text-[10px] text-ios-blue dark:text-blue-400 font-bold block">Login</span>
                    </div>
                 </Link>
               )}
               <AnimatePresence>
                 {showProfileMenu && <ProfileSwitcherMenu />}
               </AnimatePresence>
             </div>
           ) : (
             <button
               onClick={() => navigate(-1)}
               className="flex items-center gap-2 active:opacity-60 transition-opacity group"
             >
               <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center text-slate-900 dark:text-white group-hover:bg-slate-200 dark:group-hover:bg-white/20 transition-colors">
                 <ChevronLeft size={24} />
               </div>
               <span className="text-lg font-bold text-slate-900 dark:text-white">Back</span>
             </button>
           )}

           <button
             onClick={toggleTheme}
             className="p-2.5 rounded-full bg-slate-100 dark:bg-white/10 active:scale-95 transition-transform"
           >
             {theme === Theme.LIGHT ? <Moon size={18} className="text-slate-700" /> : <Sun size={18} className="text-yellow-400" />}
           </button>
        </header>

        <div className="max-w-6xl mx-auto p-6 pb-32 md:pb-12 md:p-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname + (isLoggedIn ? currentStudent.admissionNo : 'guest')}
              initial={{ opacity: 0, y: 15, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Bottom Nav for Mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/85 dark:bg-[#1C1C1E]/90 backdrop-blur-2xl border-t border-ios-divider/20 dark:border-white/10 pb-safe pt-2 px-6 shadow-2xl">
        <div className="flex justify-between items-center h-16">
          {navItems.slice(0, 5).map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className="relative flex flex-col items-center justify-center w-12 h-12"
              >
                {isActive && (
                  <motion.div
                    layoutId="mobile-nav-indicator"
                    className="absolute -top-2 w-1 h-1 rounded-full bg-ios-blue dark:bg-blue-500 shadow-[0_0_8px_rgba(27,20,100,0.6)] dark:shadow-[0_0_8px_rgba(59,130,246,0.6)]"
                  />
                )}
                <Icon
                  size={26}
                  className={`transition-all duration-300 ${
                    isActive 
                      ? 'text-ios-blue dark:text-blue-500 scale-110' 
                      : 'text-slate-400 dark:text-slate-600'
                  }`}
                  strokeWidth={isActive ? 2.5 : 2}
                />
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
};
