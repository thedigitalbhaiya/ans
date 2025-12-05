
import React, { useState, useContext, useMemo } from 'react';
import { Calendar, CheckCircle2, Circle, Clock, Filter, BookOpen, LogIn, Lock, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SchoolContext, AuthContext } from '../App';
import { Link } from 'react-router-dom';

export const Homework: React.FC = () => {
  const { isLoggedIn, currentStudent } = useContext(AuthContext);
  const { homework, settings } = useContext(SchoolContext);
  const [filter, setFilter] = useState('All');
  
  // 1. GLOBAL GUARD: If Module is Disabled
  if (!settings.enableHomework) {
     return (
        <div className="flex flex-col items-center justify-center py-20 text-center h-[60vh]">
           <div className="w-24 h-24 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-6 text-slate-400">
              <Lock size={40} />
           </div>
           <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Module Disabled</h2>
           <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-xs mx-auto">
              Homework section is currently turned off by the administration.
           </p>
        </div>
     );
  }

  // 2. AUTH GUARD
  if (!isLoggedIn) {
      return (
         <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-24 h-24 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-6 text-slate-400">
               <BookOpen size={40} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Homework Locked</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-xs mx-auto">
               Please login to view your assigned homework and project deadlines.
            </p>
            <Link to="/profile" className="mt-8 px-8 py-3 bg-slate-900 dark:bg-white text-white dark:text-black font-bold rounded-xl flex items-center gap-2 hover:scale-105 transition-transform">
               <LogIn size={20} /> Login Now
            </Link>
         </div>
      );
  }

  // 3. SMART FILTERING: Filter by Class & Status
  const filteredTasks = useMemo(() => {
     return homework
        .filter(task => task.targetClass === currentStudent.class) // CLASS FILTER
        .filter(task => { // STATUS FILTER
           if (filter === 'All') return true;
           return task.status.toLowerCase() === filter.toLowerCase();
        })
        .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()); // Sort by due date ascending
  }, [homework, currentStudent.class, filter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Homework</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Assignments for Class {currentStudent.class}</p>
        </div>
        
        {/* Filter Pills */}
        <div className="flex p-1 bg-white dark:bg-[#1C1C1E] rounded-full border border-slate-100 dark:border-white/5 shadow-sm overflow-hidden">
           {['All', 'Pending', 'Completed'].map((f) => {
             const isActive = filter === f;
             return (
               <button 
                key={f}
                onClick={() => setFilter(f)}
                className={`relative px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 z-10 ${
                  isActive 
                    ? 'text-white' 
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
               >
                 {isActive && (
                   <motion.div 
                     layoutId="activeFilter"
                     className="absolute inset-0 bg-ios-blue rounded-full shadow-md"
                     transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                     style={{ zIndex: -1 }}
                   />
                 )}
                 {f}
               </button>
             );
           })}
        </div>
      </div>

      <div className="grid gap-4">
        <AnimatePresence mode="popLayout">
          {filteredTasks.length > 0 ? (
             filteredTasks.map((task, index) => (
            <motion.div
              key={task.id}
              layout
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.01 }}
              className="group relative bg-white dark:bg-[#1C1C1E] p-5 rounded-[1.5rem] shadow-sm border border-slate-100 dark:border-white/5 flex items-start gap-5 overflow-hidden"
            >
              {/* Left Color Bar */}
              <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${task.color || 'bg-blue-500'}`}></div>

              {/* Status Checkbox */}
              <button className="flex-shrink-0 text-slate-300 dark:text-slate-600 hover:text-ios-green transition-colors mt-1">
                 {task.status === 'completed' 
                   ? <CheckCircle2 size={24} className="text-ios-green" /> 
                   : <Circle size={24} strokeWidth={2} />
                 }
              </button>

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400`}>
                    {task.subject}
                  </span>
                  {task.status === 'pending' && (
                    <span className="text-[10px] font-bold text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded-md uppercase tracking-wider flex items-center gap-1">
                      <Clock size={10} /> Due {task.dueDate}
                    </span>
                  )}
                </div>
                <h3 className={`text-lg font-semibold text-slate-900 dark:text-white truncate ${task.status === 'completed' ? 'line-through text-slate-400' : ''}`}>
                  {task.title}
                </h3>
                {task.description && (
                   <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{task.description}</p>
                )}
                
                <p className="text-[10px] text-slate-400 mt-2">Posted on {task.postedDate}</p>
              </div>

              {/* Decorative Icon */}
              <div className="hidden sm:flex w-12 h-12 rounded-2xl bg-slate-50 dark:bg-white/5 items-center justify-center text-slate-400 dark:text-slate-500 group-hover:scale-110 transition-transform duration-300">
                <FileText size={24} />
              </div>
            </motion.div>
          ))) : (
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className="text-center py-20 bg-slate-50 dark:bg-white/5 rounded-[2rem] border border-dashed border-slate-200 dark:border-white/10"
             >
               <div className="w-20 h-20 bg-white dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300 shadow-sm">
                 <Filter size={32} />
               </div>
               <h3 className="text-lg font-bold text-slate-900 dark:text-white">All Caught Up!</h3>
               <p className="text-slate-500 dark:text-slate-400 font-medium text-sm mt-1">No homework found for this filter.</p>
             </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
