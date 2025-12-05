
import React, { useState, useEffect, useContext } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, LogIn } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext, SchoolContext } from '../App';
import { Link } from 'react-router-dom';

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const Attendance: React.FC = () => {
  const { isLoggedIn, currentStudent } = useContext(AuthContext);
  const { attendance } = useContext(SchoolContext);
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarData, setCalendarData] = useState<(number | null)[]>([]);

  // Function to get the number of days in a month
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  // Function to get the day of the week the month starts on
  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  useEffect(() => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    
    const daysArray: (number | null)[] = Array(firstDay).fill(null);
    for (let i = 1; i <= daysInMonth; i++) {
      daysArray.push(i);
    }
    setCalendarData(daysArray);
  }, [currentDate]);

  if (!isLoggedIn) {
      return (
         <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-24 h-24 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-6 text-slate-400">
               <CalendarIcon size={40} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Attendance Locked</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-xs mx-auto">
               Please login to view your attendance record.
            </p>
            <Link to="/profile" className="mt-8 px-8 py-3 bg-slate-900 dark:bg-white text-white dark:text-black font-bold rounded-xl flex items-center gap-2 hover:scale-105 transition-transform">
               <LogIn size={20} /> Login Now
            </Link>
         </div>
      );
  }

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // REAL DATA LOGIC
  const getStatus = (day: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    
    // Weekend check
    if (date.getDay() === 0) return 'weekend';
    
    // Format YYYY-MM-DD (Local time handling safe for date strings created via constructor)
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    const dateString = `${year}-${month}-${d}`;

    const dailyRecord = attendance[dateString];
    
    // Future date check
    if (date > new Date()) return 'future';

    if (!dailyRecord) return 'unknown'; // No data recorded for this day yet

    return dailyRecord[currentStudent.admissionNo] || 'unknown';
  };

  // Calculate Monthly Stats based on Context Data
  const daysInMonth = getDaysInMonth(currentDate);
  let presentCount = 0;
  let absentCount = 0;
  let lateCount = 0;
  let totalRecorded = 0;

  for (let i = 1; i <= daysInMonth; i++) {
     const status = getStatus(i);
     if (status === 'present') presentCount++;
     if (status === 'absent') absentCount++;
     if (status === 'late') lateCount++;
     if (['present', 'absent', 'late'].includes(status)) totalRecorded++;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Attendance</h1>
          <motion.p 
            key={currentDate.toString()}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2 capitalize"
          >
            <CalendarIcon size={16} />
            {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </motion.p>
        </div>
        <div className="flex gap-2 self-start md:self-auto bg-white dark:bg-[#1C1C1E] p-1.5 rounded-full border border-slate-100 dark:border-white/5 shadow-sm">
          <button 
            onClick={handlePrevMonth}
            className="p-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 transition-colors text-slate-600 dark:text-slate-300 active:scale-95"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={handleNextMonth}
            className="p-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 transition-colors text-slate-600 dark:text-slate-300 active:scale-95"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {[
          { label: 'Working Days', value: totalRecorded, color: 'text-ios-blue', bg: 'bg-ios-blue/10' },
          { label: 'Present', value: presentCount, color: 'text-ios-green', bg: 'bg-ios-green/10' },
          { label: 'Absent', value: absentCount, color: 'text-ios-red', bg: 'bg-ios-red/10' },
          { label: 'Late', value: lateCount, color: 'text-ios-orange', bg: 'bg-ios-orange/10' },
        ].map((stat, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="bg-white dark:bg-[#1C1C1E] p-5 rounded-[1.5rem] shadow-sm border border-slate-100 dark:border-white/5 flex flex-col items-center text-center group hover:shadow-md transition-all duration-300"
          >
            <div className={`p-3 rounded-full ${stat.bg} mb-3 group-hover:scale-110 transition-transform`}>
              <div className={`w-2 h-2 rounded-full ${stat.color.replace('text-', 'bg-')}`}></div>
            </div>
            <p className="text-3xl font-bold text-slate-900 dark:text-white mb-1">{stat.value}</p>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Calendar Grid */}
      <motion.div 
        layout
        className="bg-white dark:bg-[#1C1C1E] rounded-[2rem] shadow-sm border border-slate-100 dark:border-white/5 p-6 md:p-8"
      >
        <div className="grid grid-cols-7 mb-6">
          {weekDays.map(day => (
            <div key={day} className="text-xs font-semibold text-slate-400 text-center uppercase tracking-widest">{day}</div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-y-6 gap-x-2">
          <AnimatePresence mode="popLayout">
            {calendarData.map((day, index) => {
              if (day === null) {
                return <div key={`empty-${index}`} className="h-10"></div>;
              }

              const status = getStatus(day);
              const isToday = day === new Date().getDate() && currentDate.getMonth() === new Date().getMonth() && currentDate.getFullYear() === new Date().getFullYear();
              
              return (
                <motion.div 
                  key={`${currentDate.getMonth()}-${day}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                  whileHover={{ scale: 1.1 }}
                  className="relative flex flex-col items-center group cursor-pointer"
                >
                  <div className={`
                    w-10 h-10 flex items-center justify-center rounded-full text-sm font-medium transition-all duration-300
                    ${isToday 
                      ? 'bg-ios-blue text-white shadow-lg shadow-ios-blue/30' 
                      : 'text-slate-700 dark:text-slate-200 group-hover:bg-slate-50 dark:group-hover:bg-white/10'}
                    ${status === 'weekend' ? 'text-slate-300 dark:text-slate-600' : ''}
                  `}>
                    {day}
                  </div>
                  
                  {/* Status Dot */}
                  {status !== 'weekend' && status !== 'future' && status !== 'unknown' && (
                    <div className={`mt-2 w-1.5 h-1.5 rounded-full transition-transform group-hover:scale-150 ${
                      status === 'present' ? 'bg-ios-green shadow-[0_0_8px_rgba(52,199,89,0.5)]' : 
                      status === 'absent' ? 'bg-ios-red shadow-[0_0_8px_rgba(255,59,48,0.5)]' : 'bg-ios-orange'
                    }`} />
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </motion.div>
      
      {/* Legend */}
      <div className="flex flex-wrap gap-6 justify-center text-sm text-slate-500 dark:text-slate-400 pt-2">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-[#1C1C1E] shadow-sm border border-slate-100 dark:border-white/5">
          <div className="w-2 h-2 rounded-full bg-ios-green"></div> Present
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-[#1C1C1E] shadow-sm border border-slate-100 dark:border-white/5">
          <div className="w-2 h-2 rounded-full bg-ios-red"></div> Absent
        </div>
         <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-[#1C1C1E] shadow-sm border border-slate-100 dark:border-white/5">
          <div className="w-2 h-2 rounded-full bg-ios-orange"></div> Late
        </div>
      </div>
    </div>
  );
};
