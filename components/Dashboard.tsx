
import React, { useContext, useState, useEffect, useMemo } from 'react';
import { 
  BookOpen, 
  CalendarClock, 
  Clock,
  Sparkles,
  CreditCard,
  Trophy,
  Image,
  MessageSquare,
  FileText,
  Bus,
  PartyPopper,
  Bell,
  UserPlus,
  ArrowRight,
  Megaphone,
  MapPin,
  Phone,
  Mail,
  Facebook,
  Globe,
  Clock3,
  Lock,
  PieChart as PieChartIcon,
  LogIn,
  User,
  Wallet,
  Cake,
  AlertTriangle,
  X,
  ExternalLink,
  MessageCircle,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PieChart, Pie, Cell } from 'recharts';
import { Link, useNavigate } from 'react-router-dom';
import { Logo } from './Logo';
import { noticesList } from '../data';
import { AuthContext, SchoolContext } from '../App';
import { Student } from '../types';

export const Dashboard: React.FC = () => {
  const { currentStudent, isLoggedIn, allStudents } = useContext(AuthContext);
  const { dailyNotice, showBirthdayWidget, settings, timetable, flashNotice, socialLinks } = useContext(SchoolContext);
  const [currentBirthdayIndex, setCurrentBirthdayIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());
  const navigate = useNavigate();

  // Filter apps based on settings
  const apps = useMemo(() => {
    const list = [
      { name: 'Homework', icon: BookOpen, path: '/homework', color: 'bg-blue-500' },
      { name: 'Schedule', icon: Clock, path: '/timetable', color: 'bg-cyan-500' },
      { name: 'e-Magazine', icon: Image, path: '/gallery', color: 'bg-purple-500' },
      { name: 'Feedback', icon: MessageSquare, path: '/feedback', color: 'bg-orange-500' },
      { name: 'Application', icon: FileText, path: '/application', color: 'bg-indigo-500' },
      { name: 'Circulars', icon: Bell, path: '/circulars', color: 'bg-red-500' },
    ];

    if (settings.enableOnlineFees) {
      list.unshift({ name: 'Fees', icon: CreditCard, path: '/fees', color: 'bg-green-600' });
    }
    if (settings.showResults) {
      list.splice(1, 0, { name: 'Results', icon: Trophy, path: '/results', color: 'bg-yellow-500' });
    }
    if (settings.admissionsOpen) {
      list.push({ name: 'Admission', icon: UserPlus, path: '/admission', color: 'bg-rose-500' });
    }

    return list;
  }, [settings]);

  // --- AUTOMATED BIRTHDAY LOGIC ---
  const todayBirthdays = useMemo(() => {
    const today = new Date();
    const currentMonth = today.getMonth() + 1;
    const currentDay = today.getDate();

    return allStudents.filter(student => {
      // Robust date parsing (ignoring year)
      const [year, month, day] = student.dob.split('-').map(Number);
      return month === currentMonth && day === currentDay;
    });
  }, [allStudents]);

  const isCurrentUserBirthday = useMemo(() => {
    return isLoggedIn && todayBirthdays.some(s => s.admissionNo === currentStudent.admissionNo);
  }, [isLoggedIn, todayBirthdays, currentStudent]);

  // Parse attendance percentage from string (e.g., "87.6%")
  const attendancePercentage = parseFloat(currentStudent.stats.attendance.replace('%', ''));
  const dynamicAttendanceData = [
    { name: 'Present', value: attendancePercentage, color: '#34C759' },
    { name: 'Absent', value: 100 - attendancePercentage, color: '#FF3B30' },
  ];

  // Birthday Carousel Logic (cycling through names if multiple)
  useEffect(() => {
    if (todayBirthdays.length === 0) return;
    const interval = setInterval(() => {
      setCurrentBirthdayIndex((prev) => (prev + 1) % todayBirthdays.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [todayBirthdays]);

  // Live Time Logic
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const formattedDate = currentTime.toLocaleDateString('en-GB', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long' 
  });

  // Dynamic Next Period Logic
  const getNextClass = () => {
    const dayName = currentTime.toLocaleDateString('en-US', { weekday: 'long' });
    const studentClassKey = `${currentStudent.class}-${currentStudent.section}`;
    const todaySchedule = timetable[studentClassKey]?.[dayName] || [];
    
    const timeToMinutes = (timeStr: string) => {
      const [time, period] = timeStr.split(' ');
      let [hours, minutes] = time.split(':').map(Number);
      if (period === 'PM' && hours !== 12) hours += 12;
      if (period === 'AM' && hours === 12) hours = 0;
      return hours * 60 + minutes;
    };
    const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();
    const nextClass = todaySchedule.find(entry => {
       const endMinutes = timeToMinutes(entry.endTime);
       return endMinutes > currentMinutes;
    });

    if (nextClass) {
        return {
          subject: nextClass.subject,
          room: nextClass.room,
          teacher: nextClass.teacher,
          time: `${nextClass.time} - ${nextClass.endTime}`
        };
    } else {
      return { subject: "No Classes", room: "-", teacher: "-", time: "Relax" };
    }
  };

  const nextClassInfo = getNextClass();

  // --- WHATSAPP LOGIC ---
  const classKey = `${currentStudent.class}-${currentStudent.section}`;
  const whatsappLink = socialLinks[classKey];

  const handleAppClick = (path: string) => {
    navigate(path);
  };

  const handleLogoClick = () => {
    navigate('/profile');
  };

  // Determine if Flash Notice should show
  const shouldShowFlash = flashNotice.isVisible && isLoggedIn && (flashNotice.targetAudience === 'ALL' || flashNotice.targetAudience === currentStudent.class);

  return (
    <div className="space-y-8">
      
      {/* 1. School Banner (Hero Section) */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full h-48 md:h-64 rounded-[2rem] overflow-hidden shadow-2xl shadow-ios-blue/20"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-ios-blue via-indigo-900 to-blue-800"></div>
        {/* Decorative Circles */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-black/20 rounded-full blur-2xl -ml-10 -mb-10"></div>
        
        <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-12">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-5 mb-2 group cursor-pointer" onClick={handleLogoClick}>
              <div className="w-24 h-24 rounded-2xl bg-white flex items-center justify-center shadow-xl p-3 transform group-hover:scale-105 transition-transform duration-300">
                 <img src={settings.logoUrl} alt="Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                 <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-blue-100 text-[10px] font-bold tracking-widest uppercase border border-white/10 mb-2 inline-block">
                    {settings.currentSession}
                 </span>
                 <h1 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">{settings.schoolName}</h1>
                 <p className="text-blue-200 text-xs md:text-sm font-medium mt-1">Affiliated to CBSE, Delhi</p>
                 <p className="text-yellow-300 text-xs md:text-sm font-bold mt-1 tracking-wide">AFFILIATION NO. 331140</p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* WHATSAPP CARD (CONDITIONAL) */}
      {isLoggedIn && whatsappLink && (
         <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#25D366] rounded-[2rem] p-6 text-white shadow-xl shadow-green-500/20 relative overflow-hidden cursor-pointer active:scale-[0.98] transition-transform"
            onClick={() => window.open(whatsappLink, '_blank')}
         >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full -mr-10 -mt-10 blur-xl"></div>
            <div className="relative z-10 flex items-center justify-between">
               <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-md">
                     <MessageCircle size={32} className="text-[#25D366]" fill="currentColor" />
                  </div>
                  <div>
                     <h3 className="text-lg font-bold">Join Class {currentStudent.class}-{currentStudent.section} Group</h3>
                     <p className="text-green-50 font-medium text-sm">Official WhatsApp Community</p>
                  </div>
               </div>
               <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <ArrowRight size={20} />
               </div>
            </div>
         </motion.div>
      )}

      {/* 2. Quick Access Apps Grid */}
      <div className="space-y-4">
        <div className="flex justify-between items-center px-2">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Quick Access</h3>
        </div>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
          {apps.map((app, index) => {
            const isLocked = !isLoggedIn && ['/fees', '/results', '/homework', '/application'].includes(app.path);
            return (
              <div key={app.name} onClick={() => handleAppClick(app.path)} className="flex flex-col items-center gap-2 group cursor-pointer">
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className={`relative w-14 h-14 md:w-16 md:h-16 rounded-2xl ${app.color} flex items-center justify-center text-white shadow-lg shadow-gray-200 dark:shadow-none transition-all`}
                >
                  <app.icon size={26} strokeWidth={2} />
                  {isLocked && (
                    <div className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center backdrop-blur-[1px]">
                       <Lock size={16} className="text-white/80" />
                    </div>
                  )}
                </motion.div>
                <span className="text-xs font-medium text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                  {app.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. IMPORTANT NOTICE (Replaces Pop-up) */}
      <AnimatePresence>
        {shouldShowFlash && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-white dark:bg-[#1C1C1E] border-l-4 border-red-500 rounded-[1.5rem] p-6 shadow-sm relative overflow-hidden">
               {/* Clean Background effect */}
               <div className="absolute right-0 top-0 w-32 h-32 bg-red-500/5 rounded-bl-full pointer-events-none"></div>
               
               <div className="flex items-start gap-4 relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-500/10 flex items-center justify-center text-red-500 flex-shrink-0 animate-pulse">
                     <AlertTriangle size={24} />
                  </div>
                  <div className="flex-1">
                     <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 tracking-tight">
                        {flashNotice.title}
                     </h3>
                     <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-3">
                        {flashNotice.message}
                     </p>
                     {flashNotice.actionLink && (
                        <button 
                           onClick={() => window.open(flashNotice.actionLink, '_blank')}
                           className="text-xs font-bold bg-slate-900 dark:bg-white text-white dark:text-black px-4 py-2 rounded-lg flex items-center gap-2 w-fit hover:scale-105 transition-transform"
                        >
                           View Details <ExternalLink size={12} />
                        </button>
                     )}
                  </div>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. Daily Bulletin */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        onClick={() => navigate('/circulars')}
        className="relative rounded-2xl bg-white dark:bg-[#1C1C1E] border border-slate-100 dark:border-white/5 shadow-sm overflow-hidden cursor-pointer group"
      >
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-purple-500 to-orange-500"></div>
        <div className="flex items-center gap-4 p-4 pl-6">
           <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
              <Megaphone size={20} />
           </div>
           <div className="flex-1 min-w-0">
             <div className="flex justify-between items-center mb-1">
               <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-ios-blue transition-colors">{dailyNotice.title}</h3>
               <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide flex-shrink-0 ml-2">{dailyNotice.date}</span>
             </div>
             <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
               {dailyNotice.message}
             </p>
           </div>
        </div>
      </motion.div>

      {/* Guest vs Student View for Personal Widgets */}
      {isLoggedIn ? (
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-6`}>
          {/* Next Class Widget */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`md:col-span-2 bg-white dark:bg-[#1C1C1E] rounded-[2rem] p-8 shadow-sm border border-slate-100 dark:border-white/5 relative overflow-hidden flex flex-col justify-between min-h-[220px] ${!showBirthdayWidget || todayBirthdays.length === 0 ? 'md:col-span-3' : ''}`}
          >
               <div className="flex justify-between items-start z-10">
                 <div className="flex items-center gap-2 bg-ios-blue/10 px-3 py-1 rounded-full">
                    <Clock size={14} className="text-ios-blue" />
                    <span className="text-xs font-bold text-ios-blue tracking-wide uppercase">{formattedDate}</span>
                 </div>
                 <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-white/10 flex items-center justify-center">
                   <CalendarClock size={20} className="text-slate-600 dark:text-white" />
                 </div>
               </div>
               
               <div className="mt-6 z-10">
                 <div className="flex justify-between items-end">
                   <div>
                      <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                        {nextClassInfo.time}
                      </h3>
                      <h4 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                         {nextClassInfo.subject}
                      </h4>
                   </div>
                   <div className="text-right hidden sm:block">
                      <p className="text-3xl font-bold text-slate-900 dark:text-white">Room {nextClassInfo.room}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{nextClassInfo.teacher}</p>
                   </div>
                 </div>
               </div>
               <div className="absolute right-0 bottom-0 opacity-5 dark:opacity-10 pointer-events-none">
                  <BookOpen size={180} />
               </div>
          </motion.div>

          {/* Birthday Widget (Mini Sidebar Version - Only shows if Widget Setting is ON and birthdays exist) */}
          {showBirthdayWidget && todayBirthdays.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-pink-500 to-rose-500 rounded-[2rem] p-6 shadow-lg shadow-pink-500/20 text-white relative overflow-hidden flex flex-col"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full -mr-8 -mt-8 blur-2xl"></div>
              
              <div className="flex items-center gap-2 mb-4 relative z-10">
                <PartyPopper size={24} className="text-white" />
                <h3 className="text-lg font-bold">Birthdays</h3>
              </div>
              
              <div className="flex-1 flex flex-col items-center justify-center text-center relative z-10 w-full">
                <AnimatePresence mode="wait">
                   {todayBirthdays.length > 0 && (
                     <motion.div
                       key={currentBirthdayIndex}
                       initial={{ opacity: 0, x: 20 }}
                       animate={{ opacity: 1, x: 0 }}
                       exit={{ opacity: 0, x: -20 }}
                       transition={{ duration: 0.4 }}
                       className="flex flex-col items-center w-full"
                     >
                       <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md border-2 border-white/30 p-1 mb-3 shadow-lg">
                         <img 
                            src={todayBirthdays[currentBirthdayIndex].avatar} 
                            className="w-full h-full rounded-full object-cover" 
                            alt="Birthday" 
                         />
                       </div>
                       <h4 className="font-bold text-xl truncate w-full">{todayBirthdays[currentBirthdayIndex].name}</h4>
                       <p className="text-pink-100 text-sm">Class {todayBirthdays[currentBirthdayIndex].class}-{todayBirthdays[currentBirthdayIndex].section}</p>
                     </motion.div>
                   )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </div>
      ) : (
        /* Guest View - Locked Personal Widgets */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-80">
          <div className="relative overflow-hidden bg-slate-50 dark:bg-white/5 rounded-[2rem] p-8 text-center border border-slate-200 dark:border-white/10 flex flex-col items-center justify-center min-h-[200px]">
             <div className="absolute inset-0 backdrop-blur-sm z-10 flex items-center justify-center bg-white/30 dark:bg-black/30">
                <Link to="/profile" className="flex flex-col items-center gap-2 p-4 bg-white dark:bg-[#1C1C1E] rounded-2xl shadow-xl border border-slate-100 dark:border-white/10 transform hover:scale-105 transition-transform">
                   <Lock size={24} className="text-ios-blue" />
                   <span className="font-bold text-sm text-slate-900 dark:text-white">Login to View Schedule</span>
                </Link>
             </div>
             <CalendarClock size={40} className="text-slate-300 mb-4" />
             <h3 className="text-xl font-bold text-slate-400">Daily Schedule Locked</h3>
          </div>
          <div className="relative overflow-hidden bg-slate-50 dark:bg-white/5 rounded-[2rem] p-8 text-center border border-slate-200 dark:border-white/10 flex flex-col items-center justify-center min-h-[200px]">
             <div className="absolute inset-0 backdrop-blur-sm z-10 flex items-center justify-center bg-white/30 dark:bg-black/30">
                <Link to="/profile" className="flex flex-col items-center gap-2 p-4 bg-white dark:bg-[#1C1C1E] rounded-2xl shadow-xl border border-slate-100 dark:border-white/10 transform hover:scale-105 transition-transform">
                   <Lock size={24} className="text-ios-blue" />
                   <span className="font-bold text-sm text-slate-900 dark:text-white">Login to View Attendance</span>
                </Link>
             </div>
             <PieChartIcon size={40} className="text-slate-300 mb-4" />
             <h3 className="text-xl font-bold text-slate-400">Attendance Locked</h3>
          </div>
        </div>
      )}

      {isLoggedIn && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Fee Widget - Show only if fees enabled */}
          {settings.enableOnlineFees && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              onClick={() => navigate('/fees')}
              className="bg-white dark:bg-[#1C1C1E] rounded-[2rem] p-6 shadow-sm border border-slate-100 dark:border-white/5 cursor-pointer group hover:shadow-md transition-shadow"
            >
               <div className="flex justify-between items-start mb-4">
                 <div className="w-12 h-12 rounded-2xl bg-green-100 dark:bg-green-500/20 flex items-center justify-center text-green-600 dark:text-green-400">
                    <Wallet size={24} />
                 </div>
                 <ArrowRight size={20} className="text-slate-300 group-hover:text-green-500 transition-colors" />
               </div>
               <p className="text-sm font-bold text-slate-500 uppercase tracking-wide">Fee Status</p>
               <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">Pending</h3>
               <p className="text-xs text-red-500 font-bold mt-2">Due: ₹ 4,500</p>
            </motion.div>
          )}

          {/* Attendance Summary - Span full width if fees hidden */}
          <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.35 }}
             className={`${settings.enableOnlineFees ? 'md:col-span-2' : 'md:col-span-3'} bg-white dark:bg-[#1C1C1E] rounded-[2rem] p-6 shadow-sm border border-slate-100 dark:border-white/5`}
          >
             <div className="flex justify-between items-center mb-6">
               <h3 className="text-lg font-bold text-slate-900 dark:text-white">Attendance Overview</h3>
               <Link to="/attendance" className="text-ios-blue text-sm font-medium">View Details</Link>
             </div>
             <div className="flex items-center gap-6">
               <div className="w-32 h-32 relative flex-shrink-0">
                 <PieChart width={128} height={128}>
                   <Pie
                     data={dynamicAttendanceData}
                     cx="50%"
                     cy="50%"
                     innerRadius={45}
                     outerRadius={55}
                     paddingAngle={5}
                     cornerRadius={4}
                     dataKey="value"
                     startAngle={90}
                     endAngle={-270}
                     stroke="none"
                   >
                      {dynamicAttendanceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                   </Pie>
                 </PieChart>
                 <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                   <span className="text-xl font-bold text-slate-900 dark:text-white">{currentStudent.stats.attendance}</span>
                 </div>
               </div>
               
               <div className="space-y-3 flex-1">
                 <div className="flex justify-between items-center">
                   <div className="flex items-center gap-2">
                     <div className="w-3 h-3 rounded-full bg-ios-green"></div>
                     <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Present</span>
                   </div>
                   <span className="font-bold text-slate-900 dark:text-white">{attendancePercentage}%</span>
                 </div>
                 <div className="flex justify-between items-center">
                   <div className="flex items-center gap-2">
                     <div className="w-3 h-3 rounded-full bg-red-500"></div>
                     <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Absent</span>
                   </div>
                   <span className="font-bold text-slate-900 dark:text-white">{(100 - attendancePercentage).toFixed(1)}%</span>
                 </div>
               </div>
             </div>
          </motion.div>
        </div>
      )}
      
      {/* Circulars Section */}
      {isLoggedIn && (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-4"
          >
            <div className="flex justify-between items-center px-1">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles size={20} className="text-ios-indigo" />
                Circulars
              </h3>
              <Link to="/circulars" className="text-ios-blue text-sm font-medium hover:opacity-80 transition-opacity">View All</Link>
            </div>

            <div className="space-y-3">
               {noticesList.slice(0, 2).map((notice, i) => (
                 <motion.div 
                   key={i}
                   onClick={() => navigate('/circulars')}
                   whileHover={{ scale: 1.01 }}
                   className="bg-white dark:bg-[#1C1C1E] p-4 rounded-[1.5rem] shadow-sm border border-slate-100 dark:border-white/5 flex items-center gap-4 cursor-pointer"
                 >
                   <div className={`w-12 h-12 rounded-2xl ${notice.color} bg-opacity-10 dark:bg-opacity-20 flex items-center justify-center text-xl`}>
                      <span className="text-2xl">📢</span>
                   </div>
                   <div className="flex-1">
                     <h4 className="font-semibold text-slate-900 dark:text-white">{notice.title}</h4>
                     <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{notice.content.substring(0, 40)}... • {notice.date}</p>
                   </div>
                 </motion.div>
               ))}
            </div>
          </motion.div>
      )}

      {/* Account Actions Section (Bottom of Feed) */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="flex gap-4"
      >
        {!isLoggedIn ? (
          <button 
            onClick={() => navigate('/profile')}
            className="flex-1 bg-slate-900 dark:bg-white text-white dark:text-black py-4 rounded-[1.5rem] font-bold shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-transform"
          >
            <LogIn size={20} />
            User Login
          </button>
        ) : (
          <button 
            onClick={() => navigate('/profile')}
            className="flex-1 bg-slate-900 dark:bg-white text-white dark:text-black py-4 rounded-[1.5rem] font-bold shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-transform"
          >
            <User size={20} />
            View Student Card
          </button>
        )}
      </motion.div>

      {/* Quick Call Actions */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.48 }}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4"
      >
        <a 
          href={`tel:${settings.contactNumber}`} 
          className="relative overflow-hidden bg-[#25D366] text-white p-5 rounded-[1.8rem] shadow-lg shadow-green-500/20 flex items-center justify-center gap-4 active:scale-95 transition-transform group"
        >
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-8 -mt-8 blur-2xl"></div>
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <Phone size={24} fill="currentColor" className="text-white" />
            </div>
            <div className="text-left">
              <p className="text-[11px] font-bold text-green-50 uppercase tracking-widest opacity-90">Reception</p>
              <p className="text-xl font-bold leading-none mt-0.5">Call Office</p>
            </div>
        </a>
        <a 
          href={`tel:${settings.contactNumber}`} 
          className="relative overflow-hidden bg-[#1B1464] text-white p-5 rounded-[1.8rem] shadow-lg shadow-blue-900/20 flex items-center justify-center gap-4 active:scale-95 transition-transform group"
        >
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-8 -mt-8 blur-2xl"></div>
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <User size={24} fill="currentColor" className="text-white" />
            </div>
            <div className="text-left">
              <p className="text-[11px] font-bold text-indigo-100 uppercase tracking-widest opacity-90">Management</p>
              <p className="text-xl font-bold leading-none mt-0.5">Call Principal</p>
            </div>
        </a>
      </motion.div>

      {/* 4. School Contact Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-[#0F172A] dark:bg-black rounded-[2.5rem] p-8 md:p-10 text-white relative overflow-hidden"
      >
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px] pointer-events-none -ml-20 -mb-20"></div>

        <div className="relative z-10">
          <h3 className="text-2xl font-bold mb-8 tracking-tight">Contact Information</h3>
          
          <div className="space-y-8">
             {/* Address */}
             <div className="flex items-start gap-5">
                <div className="w-14 h-14 rounded-2xl bg-[#1E293B] flex items-center justify-center flex-shrink-0 shadow-inner border border-white/5">
                   <MapPin size={26} className="text-blue-500" />
                </div>
                <div className="pt-1">
                   <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">Address</p>
                   <p className="text-lg font-medium leading-relaxed text-slate-100">
                     {settings.schoolName}<br/>
                     {settings.schoolAddress}
                   </p>
                </div>
             </div>

             {/* Phone */}
             <div className="flex items-start gap-5">
                <div className="w-14 h-14 rounded-2xl bg-[#1E293B] flex items-center justify-center flex-shrink-0 shadow-inner border border-white/5">
                   <Phone size={26} className="text-green-500" />
                </div>
                <div className="pt-1">
                   <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">Phone</p>
                   <p className="text-xl font-bold text-white">{settings.contactNumber}</p>
                   <p className="text-sm text-slate-500 mt-1">Mon - Sat, 9am - 4pm</p>
                </div>
             </div>

             {/* Email */}
             <div className="flex items-start gap-5">
                <div className="w-14 h-14 rounded-2xl bg-[#1E293B] flex items-center justify-center flex-shrink-0 shadow-inner border border-white/5">
                   <Mail size={26} className="text-orange-500" />
                </div>
                <div className="pt-1">
                   <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">Email</p>
                   <p className="text-lg font-medium text-white break-all">{settings.email}</p>
                </div>
             </div>
          </div>

          <div className="mt-10 pt-8 border-t border-white/10">
             <h4 className="text-lg font-bold mb-4">Office Hours</h4>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-[#1E293B] p-4 rounded-2xl border border-white/5 flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <Clock3 size={20} className="text-slate-400" />
                      <span className="text-slate-200 font-medium">Mon - Sat</span>
                   </div>
                   <span className="font-bold text-white">08:00 - 02:00</span>
                </div>
                <div className="bg-[#1E293B] p-4 rounded-2xl border border-white/5 flex items-center justify-between opacity-75">
                   <div className="flex items-center gap-3">
                      <Clock3 size={20} className="text-slate-400" />
                      <span className="text-slate-200 font-medium">Sunday</span>
                   </div>
                   <span className="font-bold text-red-400">Closed</span>
                </div>
             </div>
          </div>
          
        </div>
      </motion.div>
    </div>
  );
};
