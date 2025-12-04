
import React, { useContext, useState, useEffect } from 'react';
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
  Wallet
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Link, useNavigate } from 'react-router-dom';
import { Logo } from './Logo';
import { attendanceData, noticesList, birthdays, dailyNotice, timetableSchedule } from '../data';
import { AuthContext } from '../App';

const apps = [
  { name: 'Fees', icon: CreditCard, path: '/fees', color: 'bg-green-600' },
  { name: 'Results', icon: Trophy, path: '/results', color: 'bg-yellow-500' },
  { name: 'Homework', icon: BookOpen, path: '/homework', color: 'bg-blue-500' },
  { name: 'Schedule', icon: Clock, path: '/timetable', color: 'bg-cyan-500' }, // Added Schedule
  { name: 'e-Magazine', icon: Image, path: '/gallery', color: 'bg-purple-500' },
  { name: 'Feedback', icon: MessageSquare, path: '/feedback', color: 'bg-orange-500' },
  { name: 'Application', icon: FileText, path: '/application', color: 'bg-indigo-500' },
  { name: 'Admission', icon: UserPlus, path: '/admission', color: 'bg-rose-500' }, 
  { name: 'Circulars', icon: Bell, path: '/circulars', color: 'bg-red-500' },
];

export const Dashboard: React.FC = () => {
  const { currentStudent, isLoggedIn } = useContext(AuthContext);
  const [currentBirthdayIndex, setCurrentBirthdayIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());
  const navigate = useNavigate();

  // Parse attendance percentage from string (e.g., "87.6%")
  const attendancePercentage = parseFloat(currentStudent.stats.attendance.replace('%', ''));
  const dynamicAttendanceData = [
    { name: 'Present', value: attendancePercentage, color: '#34C759' },
    { name: 'Absent', value: 100 - attendancePercentage, color: '#FF3B30' },
  ];

  // Birthday Carousel Logic
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBirthdayIndex((prev) => (prev + 1) % birthdays.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

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
    const todaySchedule = timetableSchedule[dayName] || [];
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

  const handleAppClick = (path: string) => {
    // Only lock specific "student-personal" apps
    const lockedApps = ['/fees', '/results', '/homework', '/application'];
    if (lockedApps.includes(path) && !isLoggedIn) {
       // Navigate to the page, but the page itself will handle the locked state (showing Login Required)
       navigate(path);
    } else {
       navigate(path);
    }
  };

  const handleLogoClick = () => {
    navigate('/profile');
  };

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
                 <Logo className="w-full h-full" />
              </div>
              <div>
                 <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-blue-100 text-[10px] font-bold tracking-widest uppercase border border-white/10 mb-2 inline-block">
                    Bahadurganj
                 </span>
                 <h1 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">Azim National School</h1>
                 <p className="text-blue-200 text-xs md:text-sm font-medium mt-1">Affiliated to CBSE, Delhi</p>
                 <p className="text-yellow-300 text-xs md:text-sm font-bold mt-1 tracking-wide">AFFILIATION NO. 331140</p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

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

      {/* 3. Daily Bulletin */}
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Next Class Widget */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="md:col-span-2 bg-white dark:bg-[#1C1C1E] rounded-[2rem] p-8 shadow-sm border border-slate-100 dark:border-white/5 relative overflow-hidden flex flex-col justify-between min-h-[220px]"
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

          {/* Birthday Widget */}
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
                        src={birthdays[currentBirthdayIndex].image} 
                        className="w-full h-full rounded-full object-cover" 
                        alt="Birthday" 
                     />
                   </div>
                   <h4 className="font-bold text-xl truncate w-full">{birthdays[currentBirthdayIndex].name}</h4>
                   <p className="text-pink-100 text-sm">Class {birthdays[currentBirthdayIndex].class} • {birthdays[currentBirthdayIndex].date}</p>
                 </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
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
          {/* Fee Widget (Added) */}
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

          {/* Attendance Summary */}
          <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.35 }}
             className="md:col-span-2 bg-white dark:bg-[#1C1C1E] rounded-[2rem] p-6 shadow-sm border border-slate-100 dark:border-white/5"
          >
             <div className="flex justify-between items-center mb-6">
               <h3 className="text-lg font-bold text-slate-900 dark:text-white">Attendance Overview</h3>
               <Link to="/attendance" className="text-ios-blue text-sm font-medium">View Details</Link>
             </div>
             <div className="flex items-center gap-6">
               <div className="w-32 h-32 relative flex-shrink-0">
                 <ResponsiveContainer width="100%" height="100%">
                   <PieChart>
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
                 </ResponsiveContainer>
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

      {/* 4. School Contact Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-slate-900 dark:bg-black rounded-[2.5rem] p-8 md:p-10 text-white relative overflow-hidden mt-8"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-ios-blue/20 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
          <div>
            <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                 <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center flex-shrink-0">
                   <MapPin size={24} className="text-blue-400" />
                 </div>
                 <div>
                   <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-1">Address</p>
                   <p className="font-medium leading-relaxed text-slate-200">
                     Azim National School<br/>
                     Bahadurganj, Kishanganj<br/>
                     Bihar, India - 855101
                   </p>
                 </div>
              </div>
              
              <div className="flex items-start gap-4">
                 <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center flex-shrink-0">
                   <Phone size={24} className="text-green-400" />
                 </div>
                 <div>
                   <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-1">Phone</p>
                   <p className="font-medium text-slate-200">+91 94306 46481</p>
                   <p className="text-sm text-slate-500 mt-0.5">Mon - Sat, 9am - 4pm</p>
                 </div>
              </div>

              <div className="flex items-start gap-4">
                 <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center flex-shrink-0">
                   <Mail size={24} className="text-orange-400" />
                 </div>
                 <div>
                   <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-1">Email</p>
                   <p className="font-medium text-slate-200">azimnationalschool@gmail.com</p>
                 </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-between space-y-8">
             <div>
                <h3 className="text-xl font-bold mb-6">Office Hours</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center border-b border-white/10 pb-3">
                    <span className="text-slate-300 flex items-center gap-2"><Clock3 size={16} /> Monday - Saturday</span>
                    <span className="font-bold">08:00 AM - 02:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/10 pb-3">
                    <span className="text-slate-300 flex items-center gap-2"><Clock3 size={16} /> Sunday</span>
                    <span className="text-red-400 font-bold">Closed</span>
                  </div>
                </div>
             </div>

             <div className="space-y-4">
               <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Connect With Us</h3>
               <div className="flex gap-4">
                  <a href="https://www.facebook.com/profile.php?id=100057429640301" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-3 bg-[#1877F2] hover:bg-[#155fc4] transition-colors rounded-xl font-bold text-sm">
                    <Facebook size={18} /> Facebook
                  </a>
                  <a href="https://saras.cbse.gov.in/SARAS/AffiliatedList/AfflicationDetails/331140" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-3 bg-[#CB6CE6] hover:bg-[#b053cb] transition-colors rounded-xl font-bold text-sm">
                    <Globe size={18} /> CBSE Affiliation
                  </a>
               </div>
             </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
