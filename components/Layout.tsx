
import React, { useContext, useState, useRef, useEffect, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ThemeContext, AuthContext, SchoolContext } from '../App';
import { 
  CalendarDays, 
  BookOpen, 
  Bell, 
  User, 
  Moon, 
  Sun,
  Clock,
  CreditCard,
  Trophy,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Check,
  IdCard,
  Home,
  Shield,
  ArrowRightLeft,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Theme } from '../types';
import { Logo } from './Logo';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { currentStudent, availableProfiles, isLoggedIn, isAdmin, switchStudent } = useContext(AuthContext);
  const { settings, isModalOpen } = useContext(SchoolContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [showProfileSwitcher, setShowProfileSwitcher] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const isHome = location.pathname === '/';
  const hasSiblings = availableProfiles.length > 1;

  // Dynamic Navigation Items
  const navItems = useMemo(() => {
    const items = [
      { path: '/', label: 'Home', icon: Home },
      { path: '/attendance', label: 'Attendance', icon: CalendarDays },
      { path: '/profile', label: 'ID Card', icon: IdCard },
    ];

    if (settings.enableOnlineFees) {
      items.push({ path: '/fees', label: 'Fees', icon: CreditCard });
    } else if (settings.showResults) {
      items.push({ path: '/results', label: 'Results', icon: Trophy });
    } else {
        items.push({ path: '/timetable', label: 'Schedule', icon: Clock });
    }

    items.push({ path: '/circulars', label: 'Notices', icon: Bell });

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

  return (
    <div className="flex h-screen w-full overflow-hidden bg-ios-bg dark:bg-black text-slate-900 dark:text-white font-sans selection:bg-ios-blue selection:text-white">
      
      {/* Desktop Sidebar */}
      <aside 
        className={`hidden md:flex flex-col h-full bg-white/70 dark:bg-[#1C1C1E]/70 backdrop-blur-2xl border-r border-black/5 dark:border-white/5 transition-all duration-500 z-20 relative ${
          isCollapsed ? 'w-24 px-3' : 'w-[280px] px-5'
        } pt-8 pb-6`}
      >
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-10 p-1.5 bg-white dark:bg-[#2C2C2E] border border-black/5 dark:border-white/10 rounded-full text-slate-400 hover:text-ios-blue transition-colors shadow-sm z-30"
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>

        <div 
          className={`flex items-center gap-4 mb-10 cursor-pointer transition-all ${isCollapsed ? 'justify-center' : ''}`} 
          onClick={() => navigate('/')}
        >
            <div className="w-10 h-10 rounded-xl bg-white dark:bg-white/5 p-1 flex items-center justify-center text-white shadow-sm border border-slate-100 dark:border-white/10">
               <img src={settings.logoUrl} alt="Logo" className="w-full h-full object-contain" />
            </div>
            <div className={`overflow-hidden transition-all duration-300 ${isCollapsed ? 'w-0 opacity-0 hidden' : 'w-auto opacity-100'}`}>
              <h1 className="text-sm font-bold tracking-tight leading-tight line-clamp-2 text-slate-900 dark:text-white">
                {settings.schoolName}
              </h1>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
                Student Portal
              </span>
            </div>
        </div>
        
        <div className="relative mb-8" ref={menuRef}>
          {isLoggedIn && !isAdmin ? (
              <button 
                 onClick={() => hasSiblings ? setShowProfileSwitcher(true) : navigate('/profile')}
                 className={`flex items-center gap-3 w-full group outline-none transition-all p-2 rounded-2xl hover:bg-black/5 dark:hover:bg-white/5 ${isCollapsed ? 'justify-center' : ''}`}
              >
                <div className="w-10 h-10 rounded-full overflow-hidden border border-black/5 dark:border-white/10 shadow-sm flex-shrink-0">
                  <img src={currentStudent.profilePic || currentStudent.avatar} alt="Profile" className="w-full h-full object-cover" />
                </div>
                <div className={`flex-1 min-w-0 text-left transition-all duration-300 ${isCollapsed ? 'w-0 opacity-0 hidden' : 'w-auto opacity-100'}`}>
                  <span className="text-sm font-bold block truncate text-slate-900 dark:text-white">
                    Hi, {currentStudent.name.split(' ')[0]}
                  </span>
                  <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block">
                    {currentStudent.class}-{currentStudent.section}
                  </span>
                </div>
                {hasSiblings && !isCollapsed && <ArrowRightLeft size={14} className="text-slate-300 group-hover:text-ios-blue transition-colors" />}
              </button>
          ) : isAdmin ? (
             <Link to="/admin/dashboard" className={`flex items-center gap-3 w-full p-2 rounded-2xl hover:bg-black/5 dark:hover:bg-white/5 ${isCollapsed ? 'justify-center' : ''}`}>
                <div className="w-10 h-10 rounded-full bg-ios-blue flex items-center justify-center text-white shadow-lg">
                   <Shield size={20} />
                </div>
                <div className={`text-left transition-all duration-300 ${isCollapsed ? 'w-0 opacity-0 hidden' : 'w-auto opacity-100'}`}>
                   <span className="text-sm font-black block text-slate-900 dark:text-white">Admin</span>
                   <span className="text-[10px] text-ios-blue font-black uppercase tracking-widest block">Principal</span>
                </div>
             </Link>
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
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto no-scrollbar">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path} className="relative group block">
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute inset-0 bg-ios-blue rounded-2xl shadow-lg shadow-ios-blue/20"
                    transition={{ type: "spring", stiffness: 400, damping: 35 }}
                  />
                )}
                <div className={`relative flex items-center gap-3 px-3 py-3.5 rounded-2xl transition-all duration-200 ${
                  isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400 hover:bg-black/5 dark:hover:bg-white/5'
                } ${isCollapsed ? 'justify-center' : ''}`}>
                  <item.icon size={22} strokeWidth={2.5} className="flex-shrink-0" />
                  <span className={`text-[13px] font-semibold tracking-tight transition-all duration-300 ${isCollapsed ? 'w-0 opacity-0 hidden' : 'w-auto opacity-100'}`}>
                    {item.label}
                  </span>
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="space-y-2 pt-6 border-t border-black/5 dark:border-white/5">
          <button
            onClick={toggleTheme}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-2xl text-slate-500 dark:text-slate-400 hover:bg-black/5 dark:hover:bg-white/5 transition-colors ${isCollapsed ? 'justify-center' : ''}`}
          >
            {theme === Theme.LIGHT ? <Moon size={22} /> : <Sun size={22} />}
            <span className={`text-[13px] font-semibold whitespace-nowrap transition-all duration-300 ${isCollapsed ? 'w-0 opacity-0 hidden' : 'w-auto opacity-100'}`}>
              Theme
            </span>
          </button>
        </div>
      </aside>

      <main className="flex-1 h-full overflow-y-auto overflow-x-hidden relative no-scrollbar bg-ios-bg dark:bg-black scroll-smooth">
        
        {/* MOBILE HEADER (Screenshot Match with Back Button for Student Panel) */}
        <header className="md:hidden sticky top-0 z-40 px-6 py-4 bg-ios-bg/80 dark:bg-black/80 backdrop-blur-xl border-b border-slate-200 dark:border-white/5 flex items-center justify-between">
           <div className="flex items-center gap-3">
             <AnimatePresence mode="popLayout">
               {!isHome && (
                 <motion.button
                   initial={{ opacity: 0, x: -10 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, x: -10 }}
                   onClick={() => navigate(-1)}
                   className="w-10 h-10 rounded-full bg-white dark:bg-white/10 shadow-sm border border-slate-200 dark:border-white/10 flex items-center justify-center active:scale-90 transition-all text-slate-700 dark:text-white"
                 >
                   <ChevronLeft size={20} strokeWidth={2.5} />
                 </motion.button>
               )}
             </AnimatePresence>

             <div className="flex items-center gap-3 cursor-default">
               {isLoggedIn && !isAdmin ? (
                   <>
                     <div className="w-10 h-10 rounded-full bg-white dark:bg-white/5 overflow-hidden border border-slate-200 dark:border-white/10 shadow-sm shrink-0">
                       <img src={currentStudent.profilePic || currentStudent.avatar} alt="Profile" className="w-full h-full object-cover" />
                     </div>
                     <div className="flex flex-col">
                        <span className="text-sm font-extrabold text-slate-900 dark:text-white leading-none">
                           Hi, {currentStudent.name.split(' ')[0]}
                        </span>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                             CLASS {currentStudent.class}-{currentStudent.section}
                          </span>
                          {hasSiblings && (
                            <motion.button 
                              whileTap={{ scale: 0.9 }}
                              onClick={() => setShowProfileSwitcher(true)}
                              className="p-1 bg-ios-blue/10 dark:bg-blue-500/20 text-ios-blue rounded-full transition-colors active:bg-ios-blue active:text-white"
                            >
                              <ArrowRightLeft size={10} strokeWidth={3} />
                            </motion.button>
                          )}
                        </div>
                     </div>
                   </>
               ) : (
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-xl bg-white dark:bg-white/5 overflow-hidden border border-black/5 dark:border-white/10 shadow-sm p-1">
                        <img src={settings.logoUrl} alt="School" className="w-full h-full object-contain" />
                     </div>
                     <span className="text-sm font-extrabold text-slate-900 dark:text-white">{isAdmin ? 'Principal' : 'Guest'}</span>
                  </div>
               )}
             </div>
           </div>

           <button
             onClick={toggleTheme}
             className="w-9 h-9 rounded-full bg-white dark:bg-white/10 shadow-sm border border-slate-200 dark:border-white/10 flex items-center justify-center active:scale-95 transition-transform text-slate-600 dark:text-white"
           >
             {theme === Theme.LIGHT ? <Moon size={18} /> : <Sun size={18} />}
           </button>
        </header>

        <div className="w-full max-w-5xl mx-auto px-6 py-6 pb-32 md:pb-10 md:p-10 min-h-screen">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname + (isLoggedIn ? currentStudent.admissionNo : 'guest')}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Mobile Tab Bar */}
      <nav 
        className={`md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/85 dark:bg-[#1C1C1E]/85 backdrop-blur-xl border-t border-black/5 dark:border-white/10 pb-safe-area-bottom transition-transform duration-300 ease-in-out ${isModalOpen ? 'translate-y-full' : 'translate-y-0'}`}
      >
        <div className="flex justify-between items-end px-2 pt-2 pb-5">
          {navItems.slice(0, 5).map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className="flex-1 flex flex-col items-center justify-center gap-1 py-1 active:scale-90 transition-transform duration-200"
              >
                <div className={`relative ${isActive ? 'text-ios-blue dark:text-blue-400' : 'text-[#999999]'}`}>
                   <Icon size={26} strokeWidth={isActive ? 2.5 : 2} />
                </div>
                <span className={`text-[10px] font-black tracking-tight leading-none uppercase ${isActive ? 'text-ios-blue' : 'text-[#999999]'}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* GLOBAL PROFILE SWITCHER OVERLAY */}
      <AnimatePresence>
         {showProfileSwitcher && availableProfiles && (
            <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
               <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
                  onClick={() => setShowProfileSwitcher(false)}
                  className="absolute inset-0 bg-black/60 backdrop-blur-xl"
               />
               <motion.div 
                  initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
                  transition={{ type: "spring", damping: 25, stiffness: 200 }}
                  className="relative w-full max-w-sm bg-ios-bg dark:bg-black rounded-t-[2.5rem] sm:rounded-[2.5rem] shadow-2xl overflow-hidden pb-10 sm:pb-6"
               >
                  <div className="p-6 pb-2 border-b border-slate-200 dark:border-white/10 flex justify-between items-center sticky top-0 bg-white/80 dark:bg-[#1C1C1E]/80 backdrop-blur-md z-10">
                     <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Switch Profile</h2>
                     <button onClick={() => setShowProfileSwitcher(false)} className="p-2 bg-slate-200 dark:bg-white/10 rounded-full transition-colors">
                        <X size={18} />
                     </button>
                  </div>
                  <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto no-scrollbar">
                     {availableProfiles.map((student) => {
                        const isCurrent = student.admissionNo === currentStudent.admissionNo;
                        return (
                           <motion.div 
                              key={student.admissionNo}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => {
                                if(!isCurrent) {
                                  switchStudent(student.admissionNo);
                                  setShowProfileSwitcher(false);
                                }
                              }}
                              className={`p-4 rounded-3xl flex items-center gap-4 transition-all border cursor-pointer ${isCurrent ? 'bg-white dark:bg-[#1C1C1E] border-ios-blue shadow-apple' : 'bg-white dark:bg-[#1C1C1E] border-transparent hover:border-slate-300 dark:hover:border-white/20 opacity-70 hover:opacity-100'}`}
                           >
                              <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-slate-100 dark:border-white/10 shadow-sm flex-shrink-0">
                                 <img src={student.avatar} className="w-full h-full object-cover" alt={student.name} />
                              </div>
                              <div className="flex-1 min-w-0">
                                 <h3 className="font-bold text-slate-900 dark:text-white truncate">{student.name}</h3>
                                 <p className="text-xs text-slate-500 font-medium uppercase tracking-tighter">Class {student.class}-{student.section} • Roll {student.rollNo}</p>
                              </div>
                              {isCurrent ? (
                                 <div className="w-8 h-8 rounded-full bg-ios-blue text-white flex items-center justify-center shrink-0 shadow-glow">
                                    <Check size={18} strokeWidth={4} />
                                 </div>
                              ) : (
                                 <ArrowRightLeft size={18} className="text-slate-300 shrink-0" />
                              )}
                           </motion.div>
                        )
                     })}
                  </div>
               </motion.div>
            </div>
         )}
      </AnimatePresence>
    </div>
  );
};
