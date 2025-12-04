
import React, { useState, useContext } from 'react';
import { Calendar, CheckCircle2, Circle, Clock, Filter, BookOpen, LogIn } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { homeworkList } from '../data';
import { AuthContext } from '../App';
import { Link } from 'react-router-dom';

export const Homework: React.FC = () => {
  const { isLoggedIn } = useContext(AuthContext);
  const [filter, setFilter] = useState('All');
  
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

  const filteredTasks = homeworkList.filter(task => {
    if (filter === 'All') return true;
    return task.status.toLowerCase() === filter.toLowerCase();
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Homework</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Keep track of your assignments</p>
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
          {filteredTasks.map((task, index) => {
             const Icon = task.icon;
             return (
            <motion.div
              key={task.id}
              layout
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.01 }}
              className="group relative bg-white dark:bg-[#1C1C1E] p-5 rounded-[1.5rem] shadow-sm border border-slate-100 dark:border-white/5 flex items-center gap-5 overflow-hidden"
            >
              {/* Left Color Bar */}
              <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${task.color}`}></div>

              {/* Status Checkbox */}
              <button className="flex-shrink-0 text-slate-300 dark:text-slate-600 hover:text-ios-green transition-colors">
                 {task.status === 'completed' 
                   ? <CheckCircle2 size={28} className="text-ios-green" /> 
                   : <Circle size={28} strokeWidth={2} />
                 }
              </button>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-opacity-10 ${task.color.replace('bg-', 'text-')} ${task.color.replace('bg-', 'bg-')}`}>
                    {task.subject}
                  </span>
                  {task.status === 'pending' && (
                    <span className="text-[10px] font-bold text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded-md uppercase tracking-wider">
                      Due {task.due}
                    </span>
                  )}
                </div>
                <h3 className={`text-lg font-semibold text-slate-900 dark:text-white truncate ${task.status === 'completed' ? 'line-through text-slate-400' : ''}`}>
                  {task.title}
                </h3>
              </div>

              {/* Icon */}
              <div className="hidden sm:flex w-12 h-12 rounded-2xl bg-slate-50 dark:bg-white/5 items-center justify-center text-slate-400 dark:text-slate-500 group-hover:scale-110 transition-transform duration-300">
                <Icon size={24} />
              </div>
            </motion.div>
          )})}
        </AnimatePresence>
        
        {filteredTasks.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="w-20 h-20 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
              <Filter size={32} />
            </div>
            <p className="text-slate-500 dark:text-slate-400 font-medium">No homework found</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};
