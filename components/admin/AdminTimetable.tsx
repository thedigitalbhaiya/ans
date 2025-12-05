
import React, { useState, useContext, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit3, Plus, Trash2, Clock, MapPin, User, Save, ChevronDown, Filter, X } from 'lucide-react';
import { SchoolContext, AuthContext } from '../../App';
import { TimetableEntry } from '../../types';

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const PERIODS = [1, 2, 3, 4, 5, 6, 7, 8];

export const AdminTimetable: React.FC = () => {
  const { timetable, setTimetable } = useContext(SchoolContext);
  const { allStudents } = useContext(AuthContext);

  const [selectedClass, setSelectedClass] = useState("X");
  const [selectedSection, setSelectedSection] = useState("A");
  const [editingSlot, setEditingSlot] = useState<{ day: string, period: number, entry: TimetableEntry | null } | null>(null);

  // Derive unique classes and sections from student data for the dropdowns
  const uniqueClasses = useMemo(() => Array.from(new Set(allStudents.map(s => s.class))), [allStudents]);
  const uniqueSections = useMemo(() => Array.from(new Set(allStudents.map(s => s.section))), [allStudents]);

  const currentClassKey = `${selectedClass}-${selectedSection}`;
  const currentSchedule = timetable[currentClassKey] || {};

  const handleSaveSlot = (entry: TimetableEntry) => {
    if (!editingSlot) return;

    setTimetable(prev => {
      const newSchedule = { ...prev };
      const classSchedule = { ...(newSchedule[currentClassKey] || {}) };
      const daySchedule = [...(classSchedule[editingSlot.day] || [])];

      // Remove existing entry for this period if it exists
      const filteredDaySchedule = daySchedule.filter(e => e.period !== editingSlot.period);
      
      // Add the new/updated entry
      filteredDaySchedule.push(entry);
      
      classSchedule[editingSlot.day] = filteredDaySchedule;
      newSchedule[currentClassKey] = classSchedule;
      return newSchedule;
    });
    setEditingSlot(null);
  };

  const handleDeleteSlot = () => {
    if (!editingSlot) return;
    setTimetable(prev => {
        const newSchedule = { ...prev };
        const classSchedule = { ...(newSchedule[currentClassKey] || {}) };
        const daySchedule = [...(classSchedule[editingSlot.day] || [])];
  
        // Remove entry
        const filteredDaySchedule = daySchedule.filter(e => e.period !== editingSlot.period);
        
        classSchedule[editingSlot.day] = filteredDaySchedule;
        newSchedule[currentClassKey] = classSchedule;
        return newSchedule;
      });
      setEditingSlot(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
           <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Manage Schedule</h1>
           <p className="text-slate-500 dark:text-slate-400 mt-1">Configure weekly routine for Class {currentClassKey}</p>
        </div>
        
        <div className="flex gap-2">
            <FilterDropdown label="Class" options={uniqueClasses} selected={selectedClass} onSelect={setSelectedClass} />
            <FilterDropdown label="Section" options={uniqueSections} selected={selectedSection} onSelect={setSelectedSection} />
        </div>
      </div>

      {/* TIMETABLE GRID CONTAINER */}
      <div className="bg-white dark:bg-[#1C1C1E] rounded-[2rem] p-6 shadow-sm border border-slate-100 dark:border-white/5 overflow-x-auto">
         <div className="min-w-[1000px]"> {/* Force min width for scrolling */}
            
            {/* Header Row (Periods) */}
            <div className="grid grid-cols-[100px_repeat(8,_1fr)] gap-2 mb-4">
               <div className="flex items-center justify-center font-bold text-slate-400 uppercase text-xs tracking-wider">Day</div>
               {PERIODS.map(p => (
                  <div key={p} className="flex flex-col items-center justify-center bg-slate-50 dark:bg-white/5 rounded-xl py-2">
                     <span className="font-bold text-slate-900 dark:text-white text-sm">Period {p}</span>
                  </div>
               ))}
            </div>

            {/* Data Rows (Days) */}
            <div className="space-y-2">
               {DAYS.map(day => (
                  <div key={day} className="grid grid-cols-[100px_repeat(8,_1fr)] gap-2">
                     {/* Row Header */}
                     <div className="flex items-center justify-center font-bold text-slate-900 dark:text-white text-sm bg-slate-100 dark:bg-white/5 rounded-xl">
                        {day.substring(0, 3)}
                     </div>

                     {/* Slots */}
                     {PERIODS.map(period => {
                        const daySchedule = currentSchedule[day] || [];
                        const entry = daySchedule.find(e => e.period === period);
                        
                        return (
                           <motion.div
                              key={`${day}-${period}`}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => setEditingSlot({ day, period, entry: entry || null })}
                              className={`
                                 h-24 rounded-xl p-2 cursor-pointer border transition-all flex flex-col justify-center relative overflow-hidden group
                                 ${entry 
                                    ? 'bg-blue-50 dark:bg-blue-500/10 border-blue-100 dark:border-blue-500/20' 
                                    : 'bg-white dark:bg-black/20 border-slate-100 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/20'
                                 }
                              `}
                           >
                              {entry ? (
                                 <>
                                    <div className="flex justify-between items-start mb-1">
                                       <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider truncate">{entry.type}</span>
                                       <span className="text-[10px] text-slate-400">{entry.room}</span>
                                    </div>
                                    <h4 className="font-bold text-slate-900 dark:text-white text-sm leading-tight line-clamp-2">{entry.subject}</h4>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 truncate">{entry.teacher}</p>
                                    <p className="text-[10px] text-slate-400 mt-auto">{entry.time}</p>
                                 </>
                              ) : (
                                 <div className="flex items-center justify-center h-full opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Plus size={20} className="text-slate-300" />
                                 </div>
                              )}
                           </motion.div>
                        );
                     })}
                  </div>
               ))}
            </div>
         </div>
      </div>

      {/* EDIT SLOT MODAL */}
      <AnimatePresence>
         {editingSlot && (
            <SlotModal 
               day={editingSlot.day}
               period={editingSlot.period}
               entry={editingSlot.entry}
               onSave={handleSaveSlot}
               onDelete={handleDeleteSlot}
               onClose={() => setEditingSlot(null)}
            />
         )}
      </AnimatePresence>
    </div>
  );
};

// --- SUB-COMPONENTS ---

const FilterDropdown: React.FC<{ label: string, options: string[], selected: string, onSelect: (value: string) => void }> = ({ label, options, selected, onSelect }) => (
    <div className="relative">
        <select
            value={selected}
            onChange={e => onSelect(e.target.value)}
            className="appearance-none w-full md:w-32 bg-slate-50 dark:bg-black/20 border-none rounded-xl py-3 px-4 text-slate-900 dark:text-white font-bold text-sm focus:ring-2 focus:ring-ios-blue/50 outline-none cursor-pointer"
        >
            {options.map(opt => <option key={opt} value={opt}>{opt === 'All' ? `All ${label}s` : opt}</option>)}
        </select>
        <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
    </div>
);

const SlotModal: React.FC<{ 
   day: string;
   period: number;
   entry: TimetableEntry | null;
   onSave: (entry: TimetableEntry) => void;
   onDelete: () => void;
   onClose: () => void;
}> = ({ day, period, entry, onSave, onDelete, onClose }) => {
   
   const [formData, setFormData] = useState<TimetableEntry>(
      entry || {
         period: period,
         subject: '',
         teacher: '',
         room: '',
         time: '09:00 AM',
         endTime: '09:45 AM',
         type: 'lecture'
      }
   );

   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
   };

   return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
         <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
         />
         <motion.div 
            initial={{ scale: 0.95, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }} 
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative bg-white dark:bg-[#1C1C1E] w-full max-w-md rounded-[2rem] shadow-2xl overflow-hidden"
         >
            <div className="p-6 border-b border-slate-100 dark:border-white/5 flex justify-between items-center bg-slate-50 dark:bg-white/5">
               <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">Edit Slot</h2>
                  <p className="text-sm text-slate-500">{day} • Period {period}</p>
               </div>
               <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-white/10"><X size={20} /></button>
            </div>

            <div className="p-6 space-y-4">
               <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Subject</label>
                  <input name="subject" value={formData.subject} onChange={handleChange} className="w-full mt-1 p-3 rounded-lg bg-slate-50 dark:bg-black/20 border-none outline-none focus:ring-2 focus:ring-ios-blue/50" placeholder="e.g. Mathematics" autoFocus />
               </div>
               
               <div className="grid grid-cols-2 gap-4">
                  <div>
                     <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Teacher</label>
                     <input name="teacher" value={formData.teacher} onChange={handleChange} className="w-full mt-1 p-3 rounded-lg bg-slate-50 dark:bg-black/20 border-none outline-none focus:ring-2 focus:ring-ios-blue/50" placeholder="e.g. Mr. Smith" />
                  </div>
                  <div>
                     <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Room</label>
                     <input name="room" value={formData.room} onChange={handleChange} className="w-full mt-1 p-3 rounded-lg bg-slate-50 dark:bg-black/20 border-none outline-none focus:ring-2 focus:ring-ios-blue/50" placeholder="e.g. 101" />
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div>
                     <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Start Time</label>
                     <input name="time" value={formData.time} onChange={handleChange} className="w-full mt-1 p-3 rounded-lg bg-slate-50 dark:bg-black/20 border-none outline-none focus:ring-2 focus:ring-ios-blue/50" />
                  </div>
                  <div>
                     <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">End Time</label>
                     <input name="endTime" value={formData.endTime} onChange={handleChange} className="w-full mt-1 p-3 rounded-lg bg-slate-50 dark:bg-black/20 border-none outline-none focus:ring-2 focus:ring-ios-blue/50" />
                  </div>
               </div>

               <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Type</label>
                  <select name="type" value={formData.type} onChange={handleChange} className="w-full mt-1 p-3 rounded-lg bg-slate-50 dark:bg-black/20 border-none outline-none focus:ring-2 focus:ring-ios-blue/50">
                     <option value="lecture">Lecture</option>
                     <option value="lab">Lab</option>
                     <option value="break">Break</option>
                     <option value="active">Activity</option>
                  </select>
               </div>
            </div>

            <div className="p-6 border-t border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-white/5 flex gap-3">
               {entry && (
                  <button onClick={onDelete} className="px-4 py-3 bg-red-100 text-red-600 rounded-xl font-bold hover:bg-red-200 transition-colors">
                     <Trash2 size={20} />
                  </button>
               )}
               <button onClick={() => onSave(formData)} className="flex-1 py-3 bg-ios-blue text-white rounded-xl font-bold shadow-lg flex items-center justify-center gap-2">
                  <Save size={18} /> Save Slot
               </button>
            </div>
         </motion.div>
      </div>
   );
};
