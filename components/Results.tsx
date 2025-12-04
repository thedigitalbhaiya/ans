
import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, ChevronDown, Filter, LogIn } from 'lucide-react';
import { AuthContext, SchoolContext } from '../App';
import { Link } from 'react-router-dom';

export const Results: React.FC = () => {
  const { currentStudent, isLoggedIn } = useContext(AuthContext);
  const { examResults } = useContext(SchoolContext);
  const [selectedTerm, setSelectedTerm] = useState("Mid-Term");
  const [selectedSession, setSelectedSession] = useState("2025-26");

  if (!isLoggedIn) {
      return (
         <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-24 h-24 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-6 text-slate-400">
               <Trophy size={40} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Results Locked</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-xs mx-auto">
               Please login to view your exam marks and academic performance.
            </p>
            <Link to="/profile" className="mt-8 px-8 py-3 bg-slate-900 dark:bg-white text-white dark:text-black font-bold rounded-xl flex items-center gap-2 hover:scale-105 transition-transform">
               <LogIn size={20} /> Login Now
            </Link>
         </div>
      );
  }

  const currentResults = examResults[selectedTerm as keyof typeof examResults] || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Performance</h1>
        <p className="text-slate-500 dark:text-slate-400">Track your academic progress</p>
      </div>

      {/* Filters */}
      <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
         {/* Session Selector */}
         <div className="relative group">
            <select 
              value={selectedSession}
              onChange={(e) => setSelectedSession(e.target.value)}
              className="appearance-none bg-white dark:bg-[#1C1C1E] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 pr-10 text-sm font-bold text-slate-900 dark:text-white shadow-sm outline-none focus:ring-2 focus:ring-ios-blue/50"
            >
              <option>2025-26</option>
              <option>2024-25</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
         </div>

         {/* Term Selector */}
         <div className="relative group">
            <select 
              value={selectedTerm}
              onChange={(e) => setSelectedTerm(e.target.value)}
              className="appearance-none bg-white dark:bg-[#1C1C1E] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 pr-10 text-sm font-bold text-slate-900 dark:text-white shadow-sm outline-none focus:ring-2 focus:ring-ios-blue/50"
            >
              <option>Mid-Term</option>
              <option>Unit Test 1</option>
              <option>Finals</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
         </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
           key={selectedTerm}
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           exit={{ opacity: 0, y: -10 }}
           transition={{ duration: 0.2 }}
           className="space-y-8"
        >
          {/* GPA Card */}
          <div 
            className="bg-gradient-to-br from-ios-indigo to-violet-600 rounded-[2rem] p-8 text-white shadow-xl shadow-indigo-500/20 relative overflow-hidden"
          >
            <div className="flex justify-between items-start relative z-10">
              <div>
                <p className="text-indigo-200 font-medium uppercase tracking-wider text-xs mb-1">
                  {selectedTerm} • Overall
                </p>
                <h2 className="text-5xl font-bold">{currentStudent.stats.attendance}</h2>
              </div>
              <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-lg">
                <Trophy size={32} className="text-yellow-300" />
              </div>
            </div>
            <div className="mt-8 relative z-10 grid grid-cols-3 gap-4">
              <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm border border-white/5">
                <p className="text-xs text-indigo-200">Rank</p>
                <p className="text-xl font-bold">{currentStudent.stats.rank}</p>
              </div>
              <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm border border-white/5">
                <p className="text-xs text-indigo-200">Grade</p>
                <p className="text-xl font-bold">{currentStudent.stats.grade}</p>
              </div>
              <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm border border-white/5">
                <p className="text-xs text-indigo-200">Total</p>
                <p className="text-xl font-bold">438</p>
              </div>
            </div>
            {/* Background Decoration */}
            <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
          </div>

          {/* Subject List */}
          {currentResults.length > 0 ? (
            <div className="grid gap-4">
              {currentResults.map((sub, index) => (
                <motion.div
                  key={sub.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white dark:bg-[#1C1C1E] p-4 rounded-[1.5rem] shadow-sm border border-slate-100 dark:border-white/5 flex items-center gap-4 group"
                >
                  <div className={`w-12 h-12 rounded-2xl ${sub.color} flex items-center justify-center text-white font-bold shadow-md group-hover:scale-105 transition-transform`}>
                    {sub.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <h4 className="font-bold text-slate-900 dark:text-white">{sub.name}</h4>
                      <span className="font-bold text-slate-900 dark:text-white">{sub.score}/100</span>
                    </div>
                    {/* Progress Bar */}
                    <div className="h-2 w-full bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${sub.score}%` }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className={`h-full ${sub.color}`} 
                      />
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-white/5 flex items-center justify-center font-bold text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-white/5">
                    {sub.grade}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
             <div className="text-center py-10">
               <div className="w-16 h-16 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                  <Filter size={24} />
               </div>
               <p className="text-slate-500 dark:text-slate-400">No results found for {selectedTerm}.</p>
             </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
