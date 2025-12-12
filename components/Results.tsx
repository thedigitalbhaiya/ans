
import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, ChevronDown, Filter, LogIn, ChevronRight } from 'lucide-react';
import { AuthContext, SchoolContext } from '../App';
import { Link } from 'react-router-dom';

export const Results: React.FC = () => {
  const { currentStudent } = useContext(AuthContext);
  const { examResults, currentSession: globalSession } = useContext(SchoolContext);
  
  // Local state for view preference, defaulting to global current session
  const [selectedSession, setSelectedSession] = useState(globalSession);
  const [expandedExam, setExpandedExam] = useState<string | null>(null);

  // Get data for specific student > session
  const studentResults = examResults[currentStudent.admissionNo]?.[selectedSession] || {};
  const exams = Object.keys(studentResults);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Report Card</h1>
          <p className="text-slate-500 dark:text-slate-400">Track your academic progress</p>
        </div>

        {/* Session Selector */}
        <div className="relative group">
           <select 
             value={selectedSession}
             onChange={(e) => setSelectedSession(e.target.value)}
             className="appearance-none bg-white dark:bg-[#1C1C1E] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 pr-10 text-sm font-bold text-slate-900 dark:text-white shadow-sm outline-none focus:ring-2 focus:ring-ios-blue/50"
           >
             <option>2024-25</option>
             <option>2025-26</option>
             <option>2026-27</option>
           </select>
           <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
        </div>
      </div>

      <div className="space-y-4">
         {exams.length > 0 ? (
            exams.map((exam, index) => {
            const results = studentResults[exam] || [];
            const hasData = results.length > 0;
            const isOpen = expandedExam === exam;
            
            // Calculate total for preview
            const totalScore = results.reduce((acc, curr) => acc + curr.score, 0);
            const maxScore = results.reduce((acc, curr) => acc + (curr.maxScore || 100), 0);
            const percentage = maxScore > 0 ? ((totalScore / maxScore) * 100).toFixed(1) : 0;

            return (
               <motion.div 
                  key={exam}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`bg-white dark:bg-[#1C1C1E] rounded-[1.5rem] border overflow-hidden transition-all ${isOpen ? 'shadow-xl border-ios-blue dark:border-ios-blue' : 'shadow-sm border-slate-100 dark:border-white/5'}`}
               >
                  <div 
                     onClick={() => setExpandedExam(isOpen ? null : exam)}
                     className="p-6 flex items-center justify-between cursor-pointer"
                  >
                     <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-bold ${hasData ? 'bg-ios-blue/10 text-ios-blue' : 'bg-slate-100 dark:bg-white/5 text-slate-400'}`}>
                           {exam.charAt(0)}
                        </div>
                        <div>
                           <h3 className={`font-bold text-lg ${hasData ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>{exam}</h3>
                           {hasData ? (
                              <p className="text-xs text-slate-500 font-medium">{percentage}% Score • {results.length} Subjects</p>
                           ) : (
                              <p className="text-xs text-slate-400 italic">Result not declared</p>
                           )}
                        </div>
                     </div>
                     <ChevronRight size={20} className={`text-slate-400 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
                  </div>

                  <AnimatePresence>
                     {isOpen && hasData && (
                        <motion.div 
                           initial={{ height: 0, opacity: 0 }}
                           animate={{ height: 'auto', opacity: 1 }}
                           exit={{ height: 0, opacity: 0 }}
                           className="border-t border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-black/10 px-6 pb-6 pt-2"
                        >
                           <div className="grid gap-3 mt-4">
                              {results.map((sub) => (
                                 <div key={sub.name} className="flex items-center justify-between bg-white dark:bg-[#2C2C2E] p-3 rounded-xl border border-slate-100 dark:border-white/5 shadow-sm">
                                    <div className="flex items-center gap-3">
                                       <div className={`w-2 h-8 rounded-full ${sub.color}`}></div>
                                       <span className="font-bold text-slate-700 dark:text-white text-sm">{sub.name}</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                       <div className="text-right">
                                          <span className="block text-sm font-bold text-slate-900 dark:text-white">{sub.score}/{sub.maxScore || 100}</span>
                                       </div>
                                       <span className="px-2 py-1 rounded-md bg-slate-100 dark:bg-white/10 text-xs font-bold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10 w-8 text-center">
                                          {sub.grade}
                                       </span>
                                    </div>
                                 </div>
                              ))}
                           </div>
                           
                           {/* Summary Footer */}
                           <div className="mt-4 flex justify-between items-center bg-ios-blue text-white p-4 rounded-xl shadow-lg">
                              <span className="font-bold text-sm uppercase tracking-wider opacity-80">Total Marks</span>
                              <span className="font-bold text-xl">{totalScore} / {maxScore}</span>
                           </div>
                        </motion.div>
                     )}
                  </AnimatePresence>
               </motion.div>
            );
         })) : (
            <div className="flex flex-col items-center justify-center py-20 text-center text-slate-400">
               <Trophy size={48} className="opacity-20 mb-4" />
               <p>No results found for {selectedSession}</p>
            </div>
         )}
      </div>
    </div>
  );
};
