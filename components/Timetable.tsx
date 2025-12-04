
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, MoreHorizontal, Calendar } from 'lucide-react';
import { timetableSchedule } from '../data';

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export const Timetable: React.FC = () => {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const [selectedDay, setSelectedDay] = useState(days.includes(today) ? today : "Monday");

  const schedule = timetableSchedule[selectedDay] || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-end gap-4 mb-2">
        <div>
           <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Schedule</h1>
           <p className="text-slate-500 dark:text-slate-400 mt-1">{selectedDay}'s Classes</p>
        </div>
        
        {/* Day Selector */}
        <div className="flex bg-white dark:bg-[#1C1C1E] p-1 rounded-xl shadow-sm border border-slate-100 dark:border-white/5 overflow-x-auto max-w-full no-scrollbar">
           {days.map(day => (
             <button
               key={day}
               onClick={() => setSelectedDay(day)}
               className={`px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
                 selectedDay === day 
                   ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md' 
                   : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
               }`}
             >
               {day.substring(0, 3)}
             </button>
           ))}
        </div>
      </div>

      <div className="relative pl-4 md:pl-8">
        {/* Vertical Timeline Line */}
        <div className="absolute left-[23px] md:left-[39px] top-4 bottom-10 w-0.5 bg-slate-200 dark:bg-white/10"></div>

        <div className="space-y-8">
          <AnimatePresence mode="wait">
            {schedule.length > 0 ? (
              schedule.map((item, index) => {
                const isActive = false; // Logic for active class can be added based on time
                return (
                  <motion.div 
                    key={selectedDay + index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                    className="relative flex gap-6 md:gap-8 group"
                  >
                    {/* Timeline Dot */}
                    <div className={`
                      absolute left-0 mt-6 w-4 h-4 rounded-full border-4 z-10 transition-all duration-300
                      ${item.type === 'active'
                        ? 'border-orange-500 bg-white dark:bg-[#1C1C1E]' 
                        : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-[#1C1C1E]'}
                    `}></div>

                    {/* Time Column */}
                    <div className="w-20 pt-5 text-right flex-shrink-0">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">{item.time}</p>
                      <p className="text-xs text-slate-400">{item.endTime}</p>
                    </div>

                    {/* Content Card */}
                    <div className="flex-1">
                      <div className={`
                        p-5 rounded-[1.5rem] border transition-all duration-300 relative overflow-hidden bg-white dark:bg-[#1C1C1E] border-slate-100 dark:border-white/5 hover:border-slate-300 dark:hover:border-slate-600 shadow-sm
                      `}>
                        <div className="relative z-10">
                          <div className="flex justify-between items-start mb-2">
                            <span className={`
                              text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md
                              ${item.type === 'break' ? 'bg-orange-100 text-orange-600' : 
                                item.type === 'lab' ? 'bg-purple-100 text-purple-600' :
                                'bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400'}
                            `}>
                              {item.type}
                            </span>
                          </div>
                          
                          <h3 className="text-xl font-bold mb-1 text-slate-900 dark:text-white">
                            {item.subject}
                          </h3>
                          
                          <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                            <div className="flex items-center gap-1.5">
                               <MapPin size={14} />
                               <span>Room {item.room}</span>
                            </div>
                            {item.teacher !== '-' && (
                              <div className="flex items-center gap-1.5">
                                <span className="w-1 h-1 rounded-full bg-current opacity-50"></span>
                                <span>{item.teacher}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <motion.div 
                 initial={{ opacity: 0 }} 
                 animate={{ opacity: 1 }} 
                 className="py-12 text-center text-slate-400"
              >
                <div className="w-16 h-16 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                   <Calendar size={24} />
                </div>
                <p>No classes scheduled for {selectedDay}.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
