
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Edit3, Plus, Trash2, Clock, MapPin, User, Save } from 'lucide-react';
import { timetableSchedule } from '../../data';

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export const AdminTimetable: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState("Monday");
  // In a real app, this would be editable state
  const schedule = timetableSchedule[selectedDay] || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
           <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Manage Schedule</h1>
           <p className="text-slate-500 dark:text-slate-400 mt-1">Edit class routines and teachers</p>
        </div>
        <button className="bg-ios-blue text-white px-6 py-3 rounded-xl font-bold shadow-lg flex items-center gap-2 active:scale-95 transition-transform">
           <Save size={18} /> Publish Changes
        </button>
      </div>

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

      <div className="bg-white dark:bg-[#1C1C1E] rounded-[2rem] p-6 shadow-sm border border-slate-100 dark:border-white/5 min-h-[500px]">
         <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">{selectedDay}'s Routine</h3>
            <button className="text-ios-blue text-sm font-bold flex items-center gap-1 hover:bg-blue-50 dark:hover:bg-blue-500/10 px-3 py-1.5 rounded-lg transition-colors">
               <Plus size={16} /> Add Period
            </button>
         </div>

         <div className="space-y-4">
            {schedule.length > 0 ? schedule.map((item, index) => (
               <motion.div 
                 key={index}
                 layout
                 className="group bg-slate-50 dark:bg-black/20 p-4 rounded-2xl border border-transparent hover:border-slate-200 dark:hover:border-white/10 transition-all"
               >
                  <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                     {/* Time Inputs */}
                     <div className="flex items-center gap-2 bg-white dark:bg-[#1C1C1E] p-2 rounded-xl border border-slate-100 dark:border-white/5">
                        <Clock size={16} className="text-slate-400" />
                        <div className="flex gap-2 text-sm font-bold">
                           <input type="text" defaultValue={item.time} className="w-20 bg-transparent outline-none text-slate-900 dark:text-white" />
                           <span className="text-slate-400">-</span>
                           <input type="text" defaultValue={item.endTime} className="w-20 bg-transparent outline-none text-slate-900 dark:text-white" />
                        </div>
                     </div>

                     {/* Details Inputs */}
                     <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3 w-full">
                        <div className="flex items-center gap-2 bg-white dark:bg-[#1C1C1E] px-3 py-2 rounded-xl border border-slate-100 dark:border-white/5">
                           <Edit3 size={14} className="text-blue-500" />
                           <input type="text" defaultValue={item.subject} className="w-full bg-transparent outline-none text-sm font-bold text-slate-900 dark:text-white" placeholder="Subject" />
                        </div>
                        <div className="flex items-center gap-2 bg-white dark:bg-[#1C1C1E] px-3 py-2 rounded-xl border border-slate-100 dark:border-white/5">
                           <User size={14} className="text-purple-500" />
                           <input type="text" defaultValue={item.teacher} className="w-full bg-transparent outline-none text-sm font-medium text-slate-600 dark:text-slate-300" placeholder="Teacher" />
                        </div>
                        <div className="flex items-center gap-2 bg-white dark:bg-[#1C1C1E] px-3 py-2 rounded-xl border border-slate-100 dark:border-white/5">
                           <MapPin size={14} className="text-orange-500" />
                           <input type="text" defaultValue={item.room} className="w-full bg-transparent outline-none text-sm font-medium text-slate-600 dark:text-slate-300" placeholder="Room" />
                        </div>
                     </div>

                     <button className="p-2 text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors self-end md:self-center">
                        <Trash2 size={18} />
                     </button>
                  </div>
               </motion.div>
            )) : (
               <div className="text-center py-12 text-slate-400">
                  <p>No periods added for this day.</p>
               </div>
            )}
         </div>
      </div>
    </div>
  );
};
