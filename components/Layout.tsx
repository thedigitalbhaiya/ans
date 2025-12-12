
import React, { useContext, useState, useRef, useEffect, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ThemeContext, AuthContext, SchoolContext } from '../App';
import { 
  LayoutGrid, 
  CalendarDays, 
  BookOpen, 
  Bell, 
  User, 
  Moon, 
  Sun,
  Clock,
  CreditCard,
  Trophy,
  FileText,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Check,
  IdCard,
  ArrowRightLeft,
  Settings,
  Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Theme } from '../types';
import { Logo } from './Logo';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { logout, currentStudent, availableProfiles, selectProfile, isLoggedIn, isAdmin } = useContext(AuthContext);
  const { settings } = useContext(SchoolContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const isHome = location.pathname === '/';
  const hasSiblings = availableProfiles.length > 1;

  // Dynamic Navigation Items
  const navItems = useMemo(() => {
    const items = [
      { path: '/', label: 'Home', icon: LayoutGrid },
      { path: '/attendance', label: 'Attendance', icon: CalendarDays },
      { path: '/profile', label: 'ID Card', icon: IdCard },
    ];

    if (settings.enableOnlineFees) {
      items.push({ path: '/fees', label: 'Payments', icon: CreditCard });
    }

    if (settings.showResults) {
      items.push({ path: '/results', label: 'Results', icon: Trophy });
    }

    items.push(
      { path: '/achievements', label: 'Awards', icon: Award },
      { path: '/timetable', label: 'Schedule', icon: Clock },
      { path: '/circulars', label: 'Notices', icon: Bell },
      { path: '/application', label: 'Apply', icon: FileText }
    );

    return items;
  }, [settings]);

  // Responsive sidebar
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-ios-bg dark:bg-black text-slate-900 dark:text-white font-sans selection:bg-ios-blue selection:text-white">
      
      {/* Desktop Sidebar (Glassmorphism) */}
      <aside 
        className={`hidden md:flex flex-col h-full bg-[#F9F9F9]/80 dark:bg-[#1C1C1E]/80 backdrop-blur-2xl border-r border-ios-separator/20 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] z-20 relative ${
          isCollapsed ? 'w-24 px-3' : 'w-[280px] px-5'
        } pt-8 pb-6`}
      >
        {/* Collapse Toggle */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-10 p-1.5 bg-white dark:bg-[#2C2C2E] border border-ios-separator/20 rounded-full text-slate-400 hover:text-ios-blue transition-colors shadow-sm z-30"
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>

        {/* Brand */}
        <div 
          className={`flex items-center gap-4 mb-10 cursor-pointer transition-all ${isCollapsed ? 'justify-center' : ''}`} 
          onClick={() => navigate('/')}
        >
            <div className="w-10 h-10 rounded-xl bg-ios-blue flex items-center justify-center text-white shadow-lg shadow-ios-blue/20">
               <Logo className="w-6 h-6 invert brightness-0" />
            </div>
            <div className={`overflow-hidden transition-all duration-300 ${isCollapsed ? 'w-0 opacity-0 hidden' : 'w-auto opacity-100'}`}>
              <h1 className="text-lg font-bold tracking-tight leading-none">
                {settings.schoolName.split(' ')[0]}
              </h1>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">
                Student Portal
              </span>
            </div>
        </div>
        
        {/* Profile Card (Sidebar) */}
        <div className="relative mb-8" ref={menuRef}>
          {isLoggedIn ? (
              <button 
                 onClick={() => {
                    if (isCollapsed) navigate('/profile');
                    else if (hasSiblings) setShowProfileMenu(!showProfileMenu);
                 }}
                 className={`flex items-center gap-3 w-full group outline-none transition-all p-2 rounded-2xl hover:bg-black/5 dark:hover:bg-white/5 ${isCollapsed ? 'justify-center' : ''}`}
                 disabled={!hasSiblings && !isCollapsed}
              >
                <div className="w-10 h-10 rounded-full overflow-hidden border border-black/5 dark:border-white/10 shadow-sm flex-shrink-0">
                  <img src={currentStudent.avatar} alt="Profile" className="w-full h-full object-cover" />
                </div>
                <div className={`flex-1 min-w-0 text-left transition-all duration-300 ${isCollapsed ? 'w-0 opacity-0 hidden' : 'w-auto opacity-100'}`}>
                  <span className="text-sm font-bold block truncate text-slate-900 dark:text-white">
                    {currentStudent.name.split(' ')[0]}
                  </span>
                  <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block">
                    {currentStudent.class}-{currentStudent.section}
                  </span>
                </div>
                {!isCollapsed && hasSiblings && <ChevronDown size={14} className="text-slate-400" />}
              </button>
          ) : (
             <Link to="/profile" className={`flex items-center gap-3 w-full p-2 rounded-2xl hover:bg-black/5 dark:hover:bg-white/5 ${isCollapsed ? 'justify-center' : ''}`}>
               <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-white/10 flex items-center justify-center text-slate-500">
                 <User size={20} />
               </div>
               <div className={`text-left transition-all duration-300 ${isCollapsed ? 'w-0 opacity-0 hidden' : 'w-auto opacity-100'}`}>
                 <span className="text-sm font-bold block">Guest</span>
                 <span className="text-[11px] text-ios-blue font-bold block">Tap to Login</span>
               </div>
             </Link>
          )}
          
          {/* Sibling Dropdown */}
          <AnimatePresence>
            {showProfileMenu && !isCollapsed && hasSiblings && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute top-full left-0 mt-2 w-full bg-white/90 dark:bg-[#2C2C2E]/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-black/5 dark:border-white/5 overflow-hidden z-50 p-1"
                >
                   {availableProfiles.map((student) => (
                     <button
                       key={student.admissionNo}
                       onClick={() => {
                         selectProfile(student.admissionNo);
                         setShowProfileMenu(false);
                         navigate('/');
                       }}
                       className={`w-full flex items-center gap-3 p-2 rounded-xl transition-all ${
                         currentStudent.admissionNo === student.admissionNo 
                           ? 'bg-ios-blue text-white' 
                           : 'hover:bg-black/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200'
                       }`}
                     >
                        <img src={student.avatar} className="w-6 h-6 rounded-full bg-white/20" alt="" />
                        <span className="text-xs font-bold flex-1 text-left truncate">{student.name.split(' ')[0]}</span>
                        {currentStudent.admissionNo === student.admissionNo && <Check size={12} />}
                     </button>
                   ))}
                </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 space-y-1 overflow-y-auto no-scrollbar">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className="relative group block"
                title={isCollapsed ? item.label : undefined}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute inset-0 bg-ios-blue rounded-xl"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <div className={`relative flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'text-white shadow-md shadow-ios-blue/20' 
                    : 'text-slate-500 dark:text-slate-400 hover:bg-black/5 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
                } ${isCollapsed ? 'justify-center' : ''}`}>
                  <item.icon size={20} strokeWidth={2.5} className="flex-shrink-0" />
                  <span className={`text-[13px] font-semibold tracking-wide whitespace-nowrap transition-all duration-300 ${isCollapsed ? 'w-0 opacity-0 hidden' : 'w-auto opacity-100'}`}>
                    {item.label}
                  </span>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className="space-y-2 pt-6 border-t border-ios-separator/20">
          <button
            onClick={toggleTheme}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-black/5 dark:hover:bg-white/5 transition-colors ${isCollapsed ? 'justify-center' : ''}`}
          >
            {theme === Theme.LIGHT ? <Moon size={20} /> : <Sun size={20} />}
            <span className={`text-[13px] font-semibold whitespace-nowrap transition-all duration-300 ${isCollapsed ? 'w-0 opacity-0 hidden' : 'w-auto opacity-100'}`}>
              {theme === Theme.LIGHT ? 'Dark Mode' : 'Light Mode'}
            </span>
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <main className="flex-1 h-full overflow-y-auto overflow-x-hidden relative no-scrollbar bg-ios-bg dark:bg-black scroll-smooth">
        
        {/* Mobile Header (Sticky & Glass) */}
        <header className="md:hidden sticky top-0 z-40 px-6 py-4 bg-[#F2F2F7]/80 dark:bg-black/80 backdrop-blur-xl border-b border-ios-separator/10 flex items-center justify-between transition-all duration-300">
           {isHome ? (
             <div className="relative" ref={menuRef}>
               {isLoggedIn ? (
                   <button 
                      onClick={() => { if(hasSiblings) setShowProfileMenu(!showProfileMenu); }}
                      className="flex items-center gap-3 active:opacity-70 transition-opacity"
                   >
                     <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden border border-black/5 dark:border-white/10 shadow-sm">
                       <img src={currentStudent.avatar} alt="Profile" className="w-full h-full object-cover" />
                     </div>
                     <div className="text-left">
                        <div className="flex items-center gap-1">
                          <span className="text-lg font-bold text-slate-900 dark:text-white leading-none">
                            {currentStudent.name.split(' ')[0]}
                          </span>
                          {hasSiblings && <ChevronDown size={14} className="text-slate-400" />}
                        </div>
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block leading-none mt-1">
                           Class {currentStudent.class}-{currentStudent.section}
                        </span>
                     </div>
                   </button>
               ) : (
                 <Link to="/profile" className="flex items-center gap-3">
                    <Logo className="w-9 h-9" />
                    <div>
                      <span className="text-base font-bold text-slate-900 dark:text-white block leading-none">Guest</span>
                      <span className="text-[10px] text-ios-blue font-bold block leading-none mt-1">Tap to Login</span>
                    </div>
                 </Link>
               )}
               
               {/* Mobile Sibling Menu */}
               <AnimatePresence>
                 {showProfileMenu && hasSiblings && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute top-full left-0 mt-3 w-56 bg-white/90 dark:bg-[#1C1C1E]/90 backdrop-blur-2xl rounded-2xl shadow-2xl border border-black/5 dark:border-white/10 overflow-hidden z-50 p-1.5"
                    >
                       {availableProfiles.map((student) => (
                         <button
                           key={student.admissionNo}
                           onClick={() => {
                             selectProfile(student.admissionNo);
                             setShowProfileMenu(false);
                           }}
                           className={`w-full flex items-center gap-3 p-2.5 rounded-xl transition-all mb-1 last:mb-0 ${
                             currentStudent.admissionNo === student.admissionNo 
                               ? 'bg-ios-blue text-white shadow-md' 
                               : 'hover:bg-black/5 dark:hover:bg-white/10 text-slate-900 dark:text-white'
                           }`}
                         >
                            <img src={student.avatar} className="w-6 h-6 rounded-full bg-white/20" alt="" />
                            <div className="flex-1 text-left">
                               <p className="text-xs font-bold leading-none">{student.name.split(' ')[0]}</p>
                               <p className="text-[9px] opacity-80 mt-0.5 leading-none">Class {student.class}</p>
                            </div>
                            {currentStudent.admissionNo === student.admissionNo && <Check size={14} />}
                         </button>
                       ))}
                    </motion.div>
                 )}
               </AnimatePresence>
             </div>
           ) : (
             <button
               onClick={() => navigate(-1)}
               className="flex items-center gap-1 active:opacity-60 transition-opacity text-ios-blue font-medium"
             >
               <ChevronLeft size={22} />
               <span className="text-base">Back</span>
             </button>
           )}

           <button
             onClick={toggleTheme}
             className="w-10 h-10 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center active:scale-95 transition-transform text-slate-600 dark:text-white"
           >
             {theme === Theme.LIGHT ? <Moon size={20} /> : <Sun size={20} />}
           </button>
        </header>

        {/* Content Wrapper - Updated padding to px-6 for mobile */}
        <div className="w-full max-w-5xl mx-auto px-6 py-6 pb-32 md:pb-10 md:p-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname + (isLoggedIn ? currentStudent.admissionNo : 'guest')}
              initial={{ opacity: 0, y: 10, scale: 0.99 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -5, scale: 0.99 }}
              transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Mobile Floating Dock (Bottom Nav) */}
      <nav className="md:hidden fixed bottom-6 left-6 right-6 z-50">
        <div className="bg-white/90 dark:bg-[#1C1C1E]/90 backdrop-blur-2xl rounded-[2rem] shadow-[0_8px_32px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)] border border-white/20 dark:border-white/5 p-1.5 flex justify-between items-center">
          {navItems.slice(0, 5).map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`relative flex flex-col items-center justify-center w-14 h-14 rounded-[1.5rem] transition-all duration-300 ${isActive ? 'text-white' : 'text-slate-400 dark:text-slate-500'}`}
              >
                {isActive && (
                  <motion.div
                    layoutId="mobile-dock-active"
                    className="absolute inset-0 bg-ios-blue shadow-lg shadow-ios-blue/30 rounded-[1.5rem]"
                    initial={false}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <div className="relative z-10 flex flex-col items-center gap-0.5">
                   <Icon
                     size={22}
                     strokeWidth={isActive ? 2.5 : 2}
                     className={`transition-transform duration-300 ${isActive ? 'scale-100' : 'scale-90'}`}
                   />
                </div>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
};
