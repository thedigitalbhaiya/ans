
import React, { useContext, useState, useEffect, useMemo } from 'react';
import { 
  BookOpen, Clock, CreditCard, Trophy, Image, MessageSquare, 
  FileText, Bell, UserPlus, ArrowRight, Megaphone, 
  MapPin, Phone, Mail, Calendar, Lock, Sparkles, Wallet, 
  CalendarClock, PartyPopper, ChevronRight, Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PieChart, Pie, Cell } from 'recharts';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext, SchoolContext } from '../App';
import { noticesList } from '../data';

export const Dashboard: React.FC = () => {
  const { currentStudent, isLoggedIn, allStudents } = useContext(AuthContext);
  const { dailyNotice, showBirthdayWidget, settings, timetable, flashNotice, socialLinks, achievements } = useContext(SchoolContext);
  const [currentTime, setCurrentTime] = useState(new Date());
  const navigate = useNavigate();

  // --- APPS GRID CONFIG ---
  const apps = useMemo(() => {
    const list = [
      { name: 'Homework', icon: BookOpen, path: '/homework', color: 'bg-ios-blue', delay: 0.1 },
      { name: 'Schedule', icon: Clock, path: '/timetable', color: 'bg-ios-indigo', delay: 0.15 },
      { name: 'Awards', icon: Award, path: '/achievements', color: 'bg-ios-yellow', delay: 0.18 },
      { name: 'Gallery', icon: Image, path: '/gallery', color: 'bg-ios-gray', delay: 0.2 },
      { name: 'Feedback', icon: MessageSquare, path: '/feedback', color: 'bg-ios-orange', delay: 0.25 },
      { name: 'Apply', icon: FileText, path: '/application', color: 'bg-ios-teal', delay: 0.3 },
      { name: 'Notices', icon: Bell, path: '/circulars', color: 'bg-ios-red', delay: 0.35 },
    ];

    if (settings.enableOnlineFees) {
      list.unshift({ name: 'Fees', icon: CreditCard, path: '/fees', color: 'bg-ios-green', delay: 0.05 });
    }
    if (settings.showResults) {
      list.splice(1, 0, { name: 'Results', icon: Trophy, path: '/results', color: 'bg-ios-yellow', delay: 0.12 });
    }
    if (settings.admissionsOpen) {
      list.push({ name: 'Join', icon: UserPlus, path: '/admission', color: 'bg-ios-pink', delay: 0.4 });
    }

    return list;
  }, [settings]);

  // --- LOGIC ---
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const formattedDate = currentTime.toLocaleDateString('en-GB', { 
    weekday: 'long', day: 'numeric', month: 'long' 
  }).toUpperCase();

  const getNextClass = () => {
    const dayName = currentTime.toLocaleDateString('en-US', { weekday: 'long' });
    const studentClassKey = `${currentStudent.class}-${currentStudent.section}`;
    const todaySchedule = timetable[studentClassKey]?.[dayName] || [];
    
    // Simplistic Logic for demo
    if (todaySchedule.length > 0) return { ...todaySchedule[0], timeLabel: 'Upcoming' };
    return { subject: "Free Period", room: "-", teacher: "-", time: "Relax", timeLabel: "Now", endTime: "" };
  };
  const nextClass = getNextClass();

  const attendanceValue = parseFloat(currentStudent.stats.attendance);
  const attendanceData = [
    { value: attendanceValue, color: '#34C759' },
    { value: 100 - attendanceValue, color: '#F2F2F7' }, // Light gray background
  ];

  const handleAppClick = (path: string) => navigate(path);

  // Filter achievements for current student
  const myAchievements = achievements.filter(a => a.studentId === currentStudent.admissionNo);

  const getGradient = (cat: string) => {
    switch(cat) {
      case 'Gold': return 'from-yellow-400 to-amber-600';
      case 'Silver': return 'from-slate-300 to-slate-500';
      case 'Bronze': return 'from-orange-300 to-orange-600';
      case 'Special': return 'from-indigo-500 to-purple-600';
      default: return 'from-slate-700 to-slate-900';
    }
  };

  return (
    <div className="space-y-10">
      
      {/* 1. GREETING HEADER */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }} 
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-end"
      >
        <div>
          <p className="text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider text-xs mb-1">
            {formattedDate}
          </p>
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
            {isLoggedIn ? `Hi, ${currentStudent.name.split(' ')[0]}` : 'Welcome'}
          </h1>
        </div>
        {isLoggedIn && (
           <div className="hidden md:block">
              <span className="px-4 py-2 rounded-full bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 text-sm font-bold shadow-sm">
                 Class {currentStudent.class}-{currentStudent.section}
              </span>
           </div>
        )}
      </motion.div>

      {/* 2. QUICK ACCESS GRID (Formerly Apps & Services) */}
      <div>
         <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-5 px-1 tracking-tight">Quick Access</h2>
         <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-y-8 gap-x-6">
            {apps.map((app) => (
               <motion.div
                  key={app.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: app.delay }}
                  onClick={() => handleAppClick(app.path)}
                  whileTap={{ scale: 0.9 }}
                  className="flex flex-col items-center gap-3 cursor-pointer group"
               >
                  <div className={`w-16 h-16 md:w-20 md:h-20 ${app.color} rounded-[1.3rem] shadow-lg shadow-black/5 flex items-center justify-center text-white transform transition-transform duration-300 group-hover:scale-105 relative overflow-hidden`}>
                     {/* Gloss effect */}
                     <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/20 to-transparent pointer-events-none"></div>
                     <app.icon size={30} strokeWidth={2} className="relative z-10 drop-shadow-sm" />
                  </div>
                  <span className="text-[11px] md:text-xs font-bold text-slate-600 dark:text-slate-300 text-center leading-tight group-hover:text-ios-blue transition-colors tracking-tight">
                     {app.name}
                  </span>
               </motion.div>
            ))}
         </div>
      </div>

      {/* 3. NOTICE BANNER (Dynamic Island Style) */}
      <AnimatePresence>
        {flashNotice.isVisible && isLoggedIn && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-slate-900 dark:bg-white text-white dark:text-black p-5 rounded-[1.8rem] shadow-xl flex items-start gap-4 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 dark:bg-black/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
               <div className="p-3 bg-white/20 dark:bg-black/10 rounded-full backdrop-blur-md">
                  <Megaphone size={20} className="animate-pulse" />
               </div>
               <div className="flex-1 relative z-10">
                  <h3 className="font-bold text-lg">{flashNotice.title}</h3>
                  <p className="text-sm opacity-90 leading-relaxed mt-1">{flashNotice.message}</p>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. HALL OF FAME (Achievements) - NEW */}
      {isLoggedIn && myAchievements.length > 0 && (
         <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
         >
            <h2 className="text-xl font-bold text-slate-900 dark:text-white px-1 tracking-tight flex items-center gap-2">
               <Trophy className="text-yellow-500" size={24} /> Hall of Fame
            </h2>
            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 snap-x">
               {myAchievements.map((award) => (
                  <div key={award.id} className={`snap-center flex-shrink-0 w-72 p-6 rounded-[2rem] bg-gradient-to-br ${getGradient(award.category)} text-white shadow-xl relative overflow-hidden`}>
                     <div className="absolute top-0 right-0 p-4 opacity-20">
                        <Award size={80} />
                     </div>
                     <div className="relative z-10">
                        <span className="inline-block px-2 py-1 rounded-md bg-white/20 text-[10px] font-bold uppercase tracking-wider mb-2 backdrop-blur-md border border-white/20">
                           {award.category} Award
                        </span>
                        <h3 className="text-xl font-extrabold leading-tight mb-1">{award.title}</h3>
                        <p className="text-xs text-white/80 mb-3">{award.date}</p>
                        {award.description && <p className="text-sm text-white/90 leading-relaxed">{award.description}</p>}
                     </div>
                  </div>
               ))}
            </div>
         </motion.div>
      )}

      {/* 5. WIDGETS ROW (Bento Grid) */}
      {isLoggedIn ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           
           {/* Widget A: Next Class (Large) */}
           <motion.div 
             initial={{ opacity: 0, scale: 0.95 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ delay: 0.1 }}
             className="col-span-1 md:col-span-2 bg-white dark:bg-[#1C1C1E] p-6 rounded-[2rem] shadow-apple border border-slate-100 dark:border-white/5 relative overflow-hidden group"
           >
              <div className="absolute right-0 bottom-0 opacity-5 dark:opacity-10 pointer-events-none transition-transform group-hover:scale-110 duration-700">
                 <BookOpen size={180} />
              </div>
              <div className="relative z-10 h-full flex flex-col justify-between min-h-[180px]">
                 <div className="flex justify-between items-start">
                    <div>
                       <span className="text-xs font-bold text-ios-blue bg-ios-blue/10 px-3 py-1 rounded-full uppercase tracking-wider">
                          {nextClass.timeLabel}
                       </span>
                       <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-3 tracking-tight">
                          {nextClass.subject}
                       </h3>
                       <p className="text-slate-500 dark:text-slate-400 font-medium mt-1 flex items-center gap-2">
                          <Clock size={16} /> {nextClass.time} - {nextClass.endTime}
                       </p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center">
                       <CalendarClock size={24} className="text-slate-600 dark:text-white" />
                    </div>
                 </div>
                 <div className="flex items-center gap-4 mt-6">
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-200">
                       <MapPin size={16} /> Room {nextClass.room}
                    </div>
                    <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                       {nextClass.teacher}
                    </div>
                 </div>
              </div>
           </motion.div>

           {/* Widget B: Attendance Ring */}
           <motion.div 
             initial={{ opacity: 0, scale: 0.95 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ delay: 0.2 }}
             onClick={() => navigate('/attendance')}
             className="bg-white dark:bg-[#1C1C1E] p-6 rounded-[2rem] shadow-apple border border-slate-100 dark:border-white/5 flex flex-col items-center justify-center cursor-pointer hover:border-ios-blue/30 transition-colors"
           >
              <div className="relative w-32 h-32">
                 <PieChart width={128} height={128}>
                    <Pie
                       data={attendanceData}
                       cx="50%" cy="50%"
                       innerRadius={45} outerRadius={55}
                       startAngle={90} endAngle={-270}
                       dataKey="value" stroke="none"
                       cornerRadius={4}
                    >
                       {attendanceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                       ))}
                    </Pie>
                 </PieChart>
                 <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-extrabold text-slate-900 dark:text-white">{currentStudent.stats.attendance}</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Present</span>
                 </div>
              </div>
              <p className="mt-4 text-sm font-semibold text-ios-blue flex items-center gap-1">
                 View History <ChevronRight size={14} />
              </p>
           </motion.div>

        </div>
      ) : (
        <div className="bg-white dark:bg-[#1C1C1E] p-8 rounded-[2rem] shadow-apple border border-slate-100 dark:border-white/5 text-center">
           <Lock size={40} className="mx-auto text-slate-300 mb-4" />
           <h3 className="text-xl font-bold text-slate-900 dark:text-white">Student Dashboard Locked</h3>
           <p className="text-slate-500 mt-2 mb-6">Please sign in to view your schedule, attendance, and tasks.</p>
           <button 
             onClick={() => navigate('/profile')}
             className="bg-ios-blue text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-ios-blue/30 active:scale-95 transition-transform"
           >
             Login to Portal
           </button>
        </div>
      )}

      {/* 6. LATEST CIRCULAR (Wide Card) */}
      <motion.div 
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ delay: 0.4 }}
         className="bg-gradient-to-br from-slate-900 to-slate-800 dark:from-[#2C2C2E] dark:to-black p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden"
      >
         <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
               <div className="flex items-center gap-2 mb-2">
                  <span className="px-3 py-1 rounded-full bg-white/10 border border-white/10 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
                     Latest Circular
                  </span>
                  <span className="text-slate-400 text-xs font-medium">{dailyNotice.date}</span>
               </div>
               <h3 className="text-2xl font-bold leading-tight">{dailyNotice.title}</h3>
               <p className="text-slate-300 mt-2 max-w-xl leading-relaxed">{dailyNotice.message}</p>
            </div>
            <button 
               onClick={() => navigate('/circulars')}
               className="px-6 py-3 bg-white text-black rounded-full font-bold text-sm shadow-lg hover:scale-105 transition-transform flex-shrink-0"
            >
               Read Full Notice
            </button>
         </div>
         {/* Decorative Circle */}
         <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-ios-blue/20 rounded-full blur-3xl"></div>
      </motion.div>

      {/* 7. SCHOOL INFO FOOTER */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-10">
         <div className="bg-[#E9E9EB] dark:bg-[#1C1C1E] p-6 rounded-[2rem] flex items-center gap-5">
            <div className="w-12 h-12 bg-white dark:bg-white/10 rounded-full flex items-center justify-center text-ios-green shadow-sm">
               <Phone size={24} />
            </div>
            <div>
               <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-0.5">Reception</p>
               <a href={`tel:${settings.contactNumber}`} className="text-lg font-bold text-slate-900 dark:text-white hover:underline">{settings.contactNumber}</a>
            </div>
         </div>
         <div className="bg-[#E9E9EB] dark:bg-[#1C1C1E] p-6 rounded-[2rem] flex items-center gap-5">
            <div className="w-12 h-12 bg-white dark:bg-white/10 rounded-full flex items-center justify-center text-ios-blue shadow-sm">
               <Mail size={24} />
            </div>
            <div>
               <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-0.5">Email Us</p>
               <a href={`mailto:${settings.email}`} className="text-lg font-bold text-slate-900 dark:text-white hover:underline truncate block">{settings.email}</a>
            </div>
         </div>
      </div>

    </div>
  );
};
