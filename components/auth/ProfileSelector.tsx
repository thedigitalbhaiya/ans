
import React, { useContext, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, ChevronRight, ArrowLeft } from 'lucide-react';
import { AuthContext } from '../../App';
import { useNavigate } from 'react-router-dom';

export const ProfileSelector: React.FC = () => {
  const { availableProfiles, selectProfile, isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  // If already logged in, no need to be here unless choosing a sibling
  useEffect(() => {
    if (isLoggedIn && (!availableProfiles || availableProfiles.length <= 1)) {
        navigate('/');
    }
  }, [isLoggedIn, availableProfiles, navigate]);

  // If accessed directly without data, redirect to login
  if (!availableProfiles || availableProfiles.length === 0) {
    return (
      <div className="min-h-screen bg-ios-bg dark:bg-black flex flex-col items-center justify-center p-6 text-center">
         <h1 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Session Expired</h1>
         <button onClick={() => navigate('/profile')} className="text-ios-blue font-bold">Go to Login</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ios-bg dark:bg-black flex flex-col items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="text-center mb-8">
           <div className="w-20 h-20 bg-white dark:bg-[#1C1C1E] rounded-[2.5rem] flex items-center justify-center shadow-xl mx-auto mb-6">
              <Users size={32} className="text-ios-blue" />
           </div>
           <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Who is studying?</h1>
           <p className="text-slate-500 dark:text-slate-400 mt-2">Select a profile to continue</p>
        </div>

        <div className="space-y-4">
           {availableProfiles.map((student, index) => (
             <motion.button
               key={student.admissionNo}
               onClick={() => {
                  selectProfile(student.admissionNo);
               }}
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: index * 0.1 }}
               whileHover={{ scale: 1.02 }}
               whileTap={{ scale: 0.98 }}
               className="w-full bg-white dark:bg-[#1C1C1E] p-4 rounded-[2rem] shadow-sm border border-slate-100 dark:border-white/5 flex items-center gap-4 group text-left"
             >
                <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-slate-50 dark:border-white/10 group-hover:border-ios-blue/20 transition-colors">
                   <img src={student.avatar} alt={student.name} className="w-full h-full object-cover" />
                </div>
                
                <div className="flex-1 min-w-0">
                   <h3 className="text-lg font-bold text-slate-900 dark:text-white truncate">{student.name}</h3>
                   <div className="flex items-center gap-2 mt-1">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/10 text-xs font-bold text-slate-600 dark:text-slate-300">
                        Class {student.class}-{student.section}
                      </span>
                      <span className="text-xs text-slate-400">Roll: {student.rollNo}</span>
                   </div>
                </div>

                <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-white/5 flex items-center justify-center text-slate-300 group-hover:bg-ios-blue group-hover:text-white transition-all">
                   <ChevronRight size={20} />
                </div>
             </motion.button>
           ))}
        </div>

        <button 
          onClick={() => navigate('/profile')}
          className="mt-8 flex items-center justify-center gap-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white font-bold w-full"
        >
           <ArrowLeft size={18} /> Use different number
        </button>
      </motion.div>
    </div>
  );
};
