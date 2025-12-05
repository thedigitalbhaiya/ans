
import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Trophy, Calendar, AlertTriangle, Search, ChevronRight, LayoutList, CalendarDays, ChevronLeft, X, Clock, Sparkles } from 'lucide-react';
import { SchoolContext } from '../App';
import { Notice } from '../types';

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const Notices: React.FC = () => {
  const { notices } = useContext(SchoolContext);
  const [view, setView] = useState<'list' | 'calendar'>('list');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarGrid, setCalendarGrid] = useState<(number | null)[]>([]);
  const [selectedDateStr, setSelectedDateStr] = useState<string | null>(null);
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);

  // Filter: Published Only
  const visibleNotices = notices
    .filter(n => n.isPublished)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Check for "New" (within 48 hours)
  const isNew = (dateStr: string) => {
    const diff = new Date().getTime() - new Date(dateStr).getTime();
    const hours = diff / (1000 * 3600);
    return hours < 48 && hours >= 0;
  };

  // Calendar Logic
  useEffect(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();

    const daysArray: (number | null)[] = Array(firstDay).fill(null);
    for (let i = 1; i <= daysInMonth; i++) {
      daysArray.push(i);
    }
    setCalendarGrid(daysArray);
  }, [currentDate]);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    setSelectedDateStr(null);
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    setSelectedDateStr(null);
  };

  const getEventForDate = (day: number) => {
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    const dateKey = `${year}-${month}-${dayStr}`;
    
    // Check global notices list
    return visibleNotices.find(n => n.date === dateKey);
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-end">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Circulars & Events</h1>
        </div>
        
        {/* Toggle Switch */}
        <div className="flex bg-white dark:bg-[#1C1C1E] p-1 rounded-2xl shadow-sm border border-slate-100 dark:border-white/5 w-full md:w-auto self-start">
           <button 
             onClick={() => setView('list')}
             className={`flex-1 md:flex-none px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${view === 'list' ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'}`}
           >
             <LayoutList size={16} /> List
           </button>
           <button 
             onClick={() => setView('calendar')}
             className={`flex-1 md:flex-none px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${view === 'calendar' ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'}`}
           >
             <CalendarDays size={16} /> Calendar
           </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {view === 'list' ? (
          <motion.div 
            key="list"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-4"
          >
             {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="text" 
                placeholder="Search circulars..." 
                className="w-full bg-white dark:bg-[#1C1C1E] border-none rounded-2xl py-3.5 pl-12 pr-4 text-slate-900 dark:text-white shadow-sm placeholder-slate-400 focus:ring-2 focus:ring-ios-blue/50 outline-none transition-all"
              />
            </div>

            <div className="grid gap-4">
              {visibleNotices.map((notice, index) => {
                const isNewItem = isNew(notice.date);
                return (
                  <motion.div
                    key={notice.id}
                    layoutId={`notice-${notice.id}`}
                    onClick={() => setSelectedNotice(notice)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.01 }}
                    className="bg-white dark:bg-[#1C1C1E] p-6 rounded-[1.5rem] shadow-sm border border-slate-100 dark:border-white/5 group cursor-pointer relative overflow-hidden"
                  >
                    {isNewItem && (
                       <div className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl shadow-md z-10 animate-pulse">
                          NEW
                       </div>
                    )}

                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-2xl ${notice.bg || 'bg-slate-100'} ${notice.color || 'text-slate-500'} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                        <Bell size={24} />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${notice.bg || 'bg-slate-100'} ${notice.color || 'text-slate-500'}`}>
                              {notice.category}
                            </span>
                            <span className="text-xs text-slate-400">• {notice.date}</span>
                          </div>
                        </div>
                        
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-ios-blue transition-colors">
                          {notice.title}
                        </h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed line-clamp-2">
                          {notice.content}
                        </p>
                      </div>
                      
                      <div className="self-center text-slate-300 dark:text-slate-600">
                        <ChevronRight size={24} />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="calendar"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
             <div className="bg-white dark:bg-[#1C1C1E] rounded-[2rem] shadow-sm border border-slate-100 dark:border-white/5 p-6 md:p-8">
                {/* Calendar Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                  </h2>
                  <div className="flex gap-2">
                    <button 
                      onClick={handlePrevMonth}
                      className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 transition-colors text-slate-600 dark:text-slate-300"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button 
                      onClick={handleNextMonth}
                      className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 transition-colors text-slate-600 dark:text-slate-300"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-7 mb-4">
                  {weekDays.map(day => (
                    <div key={day} className="text-xs font-semibold text-slate-400 text-center uppercase tracking-widest">{day}</div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-y-4 md:gap-y-6">
                   {calendarGrid.map((day, i) => {
                     if (day === null) return <div key={`empty-${i}`} />;
                     
                     const event = getEventForDate(day);
                     const year = currentDate.getFullYear();
                     const month = String(currentDate.getMonth() + 1).padStart(2, '0');
                     const dayStr = String(day).padStart(2, '0');
                     const fullDate = `${year}-${month}-${dayStr}`;
                     const isSelected = selectedDateStr === fullDate;

                     return (
                       <div 
                        key={day} 
                        onClick={() => setSelectedDateStr(fullDate)}
                        className="flex flex-col items-center gap-1 cursor-pointer group"
                       >
                         <div className={`
                            w-10 h-10 flex items-center justify-center rounded-full text-sm font-medium transition-all duration-300 relative
                            ${isSelected ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900' : 'text-slate-700 dark:text-slate-300 group-hover:bg-slate-100 dark:group-hover:bg-white/10'}
                         `}>
                            {day}
                            {event && !isSelected && (
                              <span className={`absolute bottom-1 w-1.5 h-1.5 rounded-full ${event.category === 'Holiday' ? 'bg-red-500' : 'bg-blue-500'}`}></span>
                            )}
                         </div>
                       </div>
                     );
                   })}
                </div>
             </div>

             {/* Selected Date Details */}
             <AnimatePresence mode="wait">
               {selectedDateStr && (
                 <motion.div 
                   key={selectedDateStr}
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0 }}
                   className="bg-slate-50 dark:bg-white/5 rounded-[1.5rem] p-6 border border-slate-100 dark:border-white/5"
                 >
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-3">
                      {new Date(selectedDateStr).toLocaleDateString('default', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </h3>
                    
                    {visibleNotices.find(e => e.date === selectedDateStr) ? (
                      <div className="flex items-center gap-4 bg-white dark:bg-[#1C1C1E] p-4 rounded-xl shadow-sm">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${visibleNotices.find(e => e.date === selectedDateStr)?.bg}`}>
                           <Calendar size={20} />
                        </div>
                        <div>
                           <h4 className="font-bold text-slate-900 dark:text-white">
                             {visibleNotices.find(e => e.date === selectedDateStr)?.title}
                           </h4>
                           <span className="text-xs text-slate-500 capitalize">
                             {visibleNotices.find(e => e.date === selectedDateStr)?.category}
                           </span>
                        </div>
                      </div>
                    ) : (
                      <p className="text-slate-500 dark:text-slate-400 italic">No events scheduled for this day.</p>
                    )}
                 </motion.div>
               )}
             </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notice Modal */}
      <AnimatePresence>
        {selectedNotice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 px-4">
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setSelectedNotice(null)}
               className="absolute inset-0 bg-black/40 backdrop-blur-sm"
             />
             <motion.div 
               layoutId={`notice-${selectedNotice.id}`}
               className="bg-white dark:bg-[#1C1C1E] w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl relative z-10"
             >
                <div className={`h-32 ${selectedNotice.bg ? selectedNotice.bg.replace('/10', '/30') : 'bg-slate-100'} flex items-center justify-center`}>
                  <div className={`w-16 h-16 rounded-2xl bg-white/50 dark:bg-black/20 flex items-center justify-center ${selectedNotice.color}`}>
                    <Bell size={32} />
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedNotice(null)}
                  className="absolute top-4 right-4 p-2 bg-black/10 hover:bg-black/20 dark:bg-white/10 dark:hover:bg-white/20 rounded-full transition-colors"
                >
                  <X size={20} className="text-slate-900 dark:text-white" />
                </button>
                
                <div className="p-8">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg ${selectedNotice.bg} ${selectedNotice.color}`}>
                      {selectedNotice.category}
                    </span>
                    <span className="text-xs font-medium text-slate-400 flex items-center gap-1">
                      <Clock size={12} /> {selectedNotice.date}
                    </span>
                  </div>
                  
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 leading-tight">
                    {selectedNotice.title}
                  </h2>
                  
                  <div className="prose dark:prose-invert">
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-base">
                      {selectedNotice.content}
                    </p>
                  </div>
                  
                  <div className="mt-8 pt-6 border-t border-slate-100 dark:border-white/10 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                       <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-white/10"></div>
                       <div className="text-xs">
                         <p className="font-bold text-slate-900 dark:text-white">Admin Office</p>
                         <p className="text-slate-400">Posted by</p>
                       </div>
                    </div>
                    <button 
                      onClick={() => setSelectedNotice(null)}
                      className="px-6 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-black rounded-xl font-bold text-sm"
                    >
                      Close
                    </button>
                  </div>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
