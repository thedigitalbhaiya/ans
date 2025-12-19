
import React, { useContext, useState, useEffect, useMemo, useRef } from 'react';
import { 
  BookOpen, Clock, CreditCard, Trophy, Image, MessageSquare, 
  FileText, Bell, UserPlus, Megaphone, 
  MapPin, Phone, Mail, CalendarClock, ChevronRight, Award, Lock, Cake, Gift, X, ExternalLink,
  Flame, School, ArrowRightLeft, User, Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, Cell, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { AuthContext, SchoolContext } from '../App';

export const Dashboard: React.FC = () => {
  const { currentStudent, isLoggedIn, allStudents, availableProfiles, switchStudent } = useContext(AuthContext);
  const { dailyNotice, settings, timetable, flashNotice, achievements, attendance, setIsModalOpen } = useContext(SchoolContext);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showFlashModal, setShowFlashModal] = useState(false);
  const [showProfileSwitcher, setShowProfileSwitcher] = useState(false);
  const navigate = useNavigate();

  // --- REFS FOR AUTO SCROLL ---
  const birthdayScrollRef = useRef<HTMLDivElement>(null);
  const fameScrollRef = useRef<HTMLDivElement>(null);
  const [isBirthdayPaused, setIsBirthdayPaused] = useState(false);
  const [isFamePaused, setIsFamePaused] = useState(false);

  // Sync modal state
  useEffect(() => {
    if (showFlashModal || showProfileSwitcher) setIsModalOpen(true);
    else setIsModalOpen(false);
  }, [showFlashModal, showProfileSwitcher, setIsModalOpen]);

  // --- APPS GRID CONFIG (Circular Screenshot Style) ---
  const apps = useMemo(() => {
    const list = [
      { name: 'Fees', icon: CreditCard, path: '/fees', bg: 'bg-[#34C759]', delay: 0.05 },
      { name: 'Results', icon: Trophy, path: '/results', bg: 'bg-[#FFCC00]', delay: 0.1 },
      { name: 'Homework', icon: BookOpen, path: '/homework', bg: 'bg-[#007AFF]', delay: 0.15 },
      { name: 'Schedule', icon: Clock, path: '/timetable', bg: 'bg-[#5856D6]', delay: 0.2 },
      { name: 'Awards', icon: Award, path: '/achievements', bg: 'bg-[#FF9500]', delay: 0.25 },
      { name: 'Gallery', icon: Image, path: '/gallery', bg: 'bg-[#8E8E93]', delay: 0.3 },
      { name: 'Feedback', icon: MessageSquare, path: '/feedback', bg: 'bg-[#FF9500]', delay: 0.35 },
      { name: 'Apply', icon: FileText, path: '/application', bg: 'bg-[#5AC8FA]', delay: 0.4 },
      { name: 'Notices', icon: Bell, path: '/circulars', bg: 'bg-[#FF3B30]', delay: 0.45 },
      { name: 'Join', icon: UserPlus, path: '/admission', bg: 'bg-[#FF2D55]', delay: 0.5 },
    ];

    return list.filter(item => {
        if (item.name === 'Fees' && !settings.enableOnlineFees) return false;
        if (item.name === 'Results' && !settings.showResults) return false;
        if (item.name === 'Join' && !settings.admissionsOpen) return false;
        if (item.name === 'Homework' && !settings.enableHomework) return false;
        return true;
    });
  }, [settings]);

  // --- TIME & DATE ---
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const formattedDate = currentTime.toLocaleDateString('en-GB', { 
    weekday: 'long', day: 'numeric', month: 'long' 
  }).toUpperCase();

  // --- AUTO SCROLL EFFECT ---
  useEffect(() => {
    const scrollContainer = (ref: React.RefObject<HTMLDivElement>, paused: boolean) => {
      if (paused || !ref.current) return;
      const container = ref.current;
      const { scrollLeft, scrollWidth, clientWidth } = container;
      const scrollAmount = 280; 
      
      if (scrollLeft + clientWidth >= scrollWidth - 10) {
        container.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    };

    const birthdayTimer = setInterval(() => scrollContainer(birthdayScrollRef, isBirthdayPaused), 4000);
    const fameTimer = setInterval(() => scrollContainer(fameScrollRef, isFamePaused), 5000);

    return () => {
      clearInterval(birthdayTimer);
      clearInterval(fameTimer);
    };
  }, [isBirthdayPaused, isFamePaused]);

  // --- DATA LOGIC ---
  const getNextClass = () => {
    const dayName = currentTime.toLocaleDateString('en-US', { weekday: 'long' });
    const studentClassKey = `${currentStudent.class}-${currentStudent.section}`;
    const todaySchedule = timetable[studentClassKey]?.[dayName] || [];
    if (todaySchedule.length > 0) return { ...todaySchedule[0], timeLabel: 'Next Class' };
    return { subject: "Free Period", room: "-", teacher: "-", time: "Relax", timeLabel: "Now", endTime: "" };
  };
  const nextClass = getNextClass();

  // --- ATTENDANCE GRAPH ---
  const attendanceGraphData = useMemo(() => {
    const data = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const dateKey = d.toISOString().split('T')[0];
        const dayLabel = d.toLocaleDateString('en-US', { weekday: 'narrow' }); 
        let statusValue = 2; let color = '#E5E7EB'; 
        const record = attendance[dateKey]?.[currentStudent.admissionNo];
        if (d.getDay() === 0) { statusValue = 2; color = 'transparent'; } 
        else {
            if (record === 'present') { statusValue = 10; color = '#34C759'; } 
            else if (record === 'late') { statusValue = 7; color = '#FF9500'; } 
            else if (record === 'absent') { statusValue = 4; color = '#FF3B30'; } 
            else if (record === 'holiday') { statusValue = 10; color = '#AF52DE'; } 
            else { statusValue = 2; color = '#E5E7EB'; }
        }
        data.push({ day: dayLabel, value: statusValue, color });
    }
    return data;
  }, [attendance, currentStudent]);

  const birthdaysToday = useMemo(() => {
    const m = currentTime.getMonth() + 1;
    const d = currentTime.getDate();
    return allStudents.filter(s => {
        const [_, sm, sd] = s.dob.split('-').map(Number);
        return sm === m && sd === d;
    });
  }, [allStudents, currentTime]);

  const recentAchievements = useMemo(() => achievements.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()), [achievements]);

  const handleProfileSwitch = (admissionNo: string) => {
    switchStudent(admissionNo);
    setShowProfileSwitcher(false);
  };

  return (
    <div className="space-y-8 pb-4">
      
      {/* 1. SCHOOL BRANDING HEADER CARD */}
      <div className="flex items-center gap-4 bg-white dark:bg-[#1C1C1E] p-5 rounded-[2rem] shadow-apple border border-slate-100 dark:border-white/5">
         <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-white/5 p-1 flex-shrink-0 flex items-center justify-center">
            <img src={settings.logoUrl} alt="Logo" className="w-10 h-10 object-contain" />
         </div>
         <div className="flex-1 min-w-0">
            <h1 className="text-lg font-extrabold text-slate-900 dark:text-white leading-tight truncate">
               {settings.schoolName}
            </h1>
            <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-widest truncate mt-0.5">
               <MapPin size={10} className="shrink-0" />
               <span className="truncate">{settings.schoolAddress}</span>
            </div>
         </div>
      </div>

      {/* 2. GREETING (Switch Icon Removed from Body) */}
      <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-1 px-1">
        <p className="text-[#8E8E93] dark:text-[#98989D] font-black uppercase tracking-[0.15em] text-[11px] mb-0.5">
          {formattedDate}
        </p>
        <div className="flex items-center gap-4">
           <h1 className="text-[42px] font-[900] text-slate-900 dark:text-white tracking-tighter leading-none">
             {isLoggedIn ? `Hi, ${currentStudent.name.split(' ')[0]}` : 'Welcome'}
           </h1>
        </div>
      </motion.div>

      {/* 3. NOTICE BANNER */}
      <AnimatePresence>
        {flashNotice.isVisible && isLoggedIn && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div 
               onClick={() => setShowFlashModal(true)}
               className="bg-slate-900 dark:bg-white text-white dark:text-black px-6 py-5 rounded-[2rem] shadow-apple flex items-center gap-5 relative overflow-hidden group cursor-pointer"
            >
               <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 dark:bg-black/5 rounded-full blur-xl"></div>
               <div className="p-3 bg-white/20 dark:bg-black/10 rounded-full backdrop-blur-md shrink-0">
                  <Megaphone size={20} className="animate-pulse" />
               </div>
               <div className="flex-1 min-w-0 relative z-10">
                  <h3 className="font-bold text-sm truncate">{flashNotice.title}</h3>
                  <p className="text-xs opacity-80 truncate font-medium">{flashNotice.message}</p>
               </div>
               <ChevronRight size={18} className="opacity-50" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. QUICK ACTIONS GRID */}
      <div>
         <h2 className="text-[11px] font-black text-[#8E8E93] dark:text-[#98989D] mb-6 px-1 uppercase tracking-[0.2em]">Quick Actions</h2>
         <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-x-4 gap-y-8">
            {apps.map((app) => (
               <motion.div
                  key={app.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: app.delay }}
                  onClick={() => navigate(app.path)}
                  whileTap={{ scale: 0.9 }}
                  className="flex flex-col items-center gap-2.5 cursor-pointer group"
               >
                  <div className={`w-[60px] h-[60px] rounded-full flex items-center justify-center text-white shadow-xl ${app.bg} transition-all duration-300 group-hover:scale-105 active:brightness-90 relative overflow-hidden`}>
                     <div className="absolute inset-0 bg-gradient-to-tr from-black/10 to-transparent"></div>
                     <app.icon size={26} strokeWidth={2.5} className="drop-shadow-md relative z-10" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 text-center leading-none tracking-tight w-full group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                     {app.name}
                  </span>
               </motion.div>
            ))}
         </div>
      </div>

      {/* 5. BENTO WIDGETS */}
      {isLoggedIn ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <motion.div 
             initial={{ opacity: 0, scale: 0.98 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ delay: 0.1 }}
             className="bg-white dark:bg-[#1C1C1E] p-7 rounded-[2.5rem] shadow-apple border border-slate-100 dark:border-white/5 relative overflow-hidden group flex flex-col justify-between min-h-[180px]"
           >
              <div className="absolute -right-8 -bottom-8 opacity-[0.03] dark:opacity-[0.05] pointer-events-none group-hover:scale-110 transition-transform duration-500 rotate-12">
                 <BookOpen size={180} />
              </div>
              <div className="relative z-10">
                 <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-bold text-ios-blue bg-blue-50 dark:bg-blue-500/10 px-3 py-1.5 rounded-lg uppercase tracking-wider border border-blue-100 dark:border-blue-500/20">
                       {nextClass.timeLabel}
                    </span>
                    <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-white/5 flex items-center justify-center text-slate-400">
                       <CalendarClock size={20} />
                    </div>
                 </div>
                 <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
                    {nextClass.subject}
                 </h3>
                 <p className="text-slate-500 dark:text-slate-400 font-medium text-sm flex items-center gap-2 mt-2">
                    <Clock size={16} className="text-slate-400" /> {nextClass.time}
                 </p>
              </div>
              <div className="relative z-10 flex items-center gap-4 mt-6 pt-4 border-t border-slate-100 dark:border-white/5">
                 <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center text-slate-500">
                       <MapPin size={12} />
                    </div>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Room {nextClass.room}</span>
                 </div>
                 <div className="w-[1px] h-4 bg-slate-200 dark:bg-white/10"></div>
                 <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{nextClass.teacher}</span>
              </div>
           </motion.div>

           <motion.div 
             initial={{ opacity: 0, scale: 0.98 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ delay: 0.2 }}
             onClick={() => navigate('/attendance')}
             className="bg-white dark:bg-[#1C1C1E] p-7 rounded-[2.5rem] shadow-apple border border-slate-100 dark:border-white/5 flex flex-col justify-between cursor-pointer hover:border-ios-blue/30 transition-colors relative group min-h-[180px]"
           >  
              <div className="flex items-center justify-between mb-4">
                 <p className="text-base font-black text-slate-900 dark:text-white">Attendance</p>
                 <span className="text-sm font-black text-green-600 bg-green-100 dark:bg-green-500/20 px-3 py-1 rounded-xl border border-green-200 dark:border-green-500/20">
                    {currentStudent.stats.attendance}
                 </span>
              </div>
              
              <div className="h-20 w-full mt-auto mb-2">
                 <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={attendanceGraphData} barSize={8}>
                       <Bar dataKey="value" radius={[10, 10, 10, 10]}>
                          {attendanceGraphData.map((entry, index) => (
                             <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                       </Bar>
                    </BarChart>
                 </ResponsiveContainer>
              </div>
              <div className="flex justify-between px-1">
                 {attendanceGraphData.map((d, i) => (
                    <span key={i} className="text-[9px] font-bold text-slate-400 w-2 text-center uppercase">{d.day.charAt(0)}</span>
                 ))}
              </div>
           </motion.div>
        </div>
      ) : (
        <div className="bg-white dark:bg-[#1C1C1E] p-8 rounded-[2.5rem] shadow-apple border border-slate-100 dark:border-white/5 text-center flex flex-col items-center justify-center min-h-[220px]">
           <div className="w-16 h-16 bg-slate-50 dark:bg-white/5 rounded-full flex items-center justify-center mb-4 text-slate-300">
              <Lock size={32} />
           </div>
           <h3 className="text-xl font-bold text-slate-900 dark:text-white">Dashboard Locked</h3>
           <p className="text-slate-500 mt-2 mb-6 text-sm max-w-[240px] leading-relaxed">Sign in with your admission number to access your personal dashboard.</p>
           <button 
             onClick={() => navigate('/profile')}
             className="bg-slate-900 dark:bg-white text-white dark:text-black px-10 py-3.5 rounded-2xl font-bold text-sm shadow-xl active:scale-95 transition-all"
           >
             Login Now
           </button>
        </div>
      )}

      {/* 6. LATEST CIRCULAR CARD */}
      <motion.div 
         initial={{ opacity: 0, y: 15 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ delay: 0.4 }}
         onClick={() => navigate('/circulars')}
         className="bg-[#1C1C1E] dark:bg-black p-8 rounded-[2.5rem] text-white shadow-2xl cursor-pointer active:scale-[0.99] transition-transform relative overflow-hidden group border border-white/10"
      >
         <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-white/10 transition-colors duration-500"></div>
         <div className="relative z-10 flex items-center justify-between gap-6">
            <div className="flex-1 min-w-0">
               <div className="flex items-center gap-3 mb-3">
                  <span className="px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest bg-white/10 border border-white/10 text-white/90">
                     Latest Notice
                  </span>
                  <span className="text-white/40 text-[11px] font-bold">{dailyNotice.date}</span>
               </div>
               <h3 className="text-2xl font-black leading-tight truncate pr-4">{dailyNotice.title}</h3>
               <p className="text-white/50 mt-2 text-sm truncate font-medium">{dailyNotice.message}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center shrink-0 group-hover:bg-white group-hover:text-black transition-all">
               <ChevronRight size={22} />
            </div>
         </div>
      </motion.div>

      {/* URGENT ANNOUNCEMENT MODAL */}
      <AnimatePresence>
         {showFlashModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
               <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  exit={{ opacity: 0 }} 
                  onClick={() => setShowFlashModal(false)}
                  className="absolute inset-0 bg-black/60 backdrop-blur-xl"
               />
               <motion.div 
                  initial={{ scale: 0.9, opacity: 0, y: 20 }} 
                  animate={{ scale: 1, opacity: 1, y: 0 }} 
                  exit={{ scale: 0.9, opacity: 0, y: 20 }}
                  className="relative w-full max-w-sm bg-white dark:bg-[#1C1C1E] rounded-[2.5rem] shadow-2xl overflow-hidden"
               >
                  <div className="bg-gradient-to-br from-red-500 to-rose-600 p-8 pt-10 text-white relative">
                     <button onClick={() => setShowFlashModal(false)} className="absolute top-4 right-4 p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
                        <X size={20} />
                     </button>
                     <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-sm shadow-inner">
                        <Megaphone size={32} className="animate-pulse" />
                     </div>
                     <h2 className="text-2xl font-black leading-tight">Urgent Announcement</h2>
                     <p className="text-white/80 text-sm mt-1 font-bold">Please read carefully</p>
                  </div>
                  <div className="p-8">
                     <h3 className="text-lg font-black text-slate-900 dark:text-white mb-3">{flashNotice.title}</h3>
                     <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-8 font-medium">
                        {flashNotice.message}
                     </p>
                     
                     {flashNotice.actionLink && (
                        <a 
                           href={flashNotice.actionLink} 
                           target="_blank" 
                           rel="noopener noreferrer"
                           className="flex items-center justify-center gap-2 w-full py-3.5 bg-slate-900 dark:bg-white text-white dark:text-black rounded-2xl font-black shadow-lg active:scale-95 transition-transform mb-3"
                        >
                           <ExternalLink size={18} /> View Details
                        </a>
                     )}
                     
                     <button 
                        onClick={() => setShowFlashModal(false)}
                        className="w-full py-3.5 text-slate-500 font-black text-sm hover:bg-slate-50 dark:hover:bg-white/5 rounded-2xl transition-colors"
                     >
                        Dismiss
                     </button>
                  </div>
               </motion.div>
            </div>
         )}
      </AnimatePresence>

      {/* PROFILE SWITCHER MODAL */}
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
                                  handleProfileSwitch(student.admissionNo);
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
