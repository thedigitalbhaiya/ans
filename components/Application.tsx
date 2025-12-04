
import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { FileText, Send, Calendar, CheckCircle2, Loader2, LogIn } from 'lucide-react';
import { applicationHistory } from '../data';
import { AuthContext } from '../App';
import { Link } from 'react-router-dom';

export const Application: React.FC = () => {
  const { isLoggedIn } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState<'new' | 'history'>('new');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isLoggedIn) {
      return (
         <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-24 h-24 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-6 text-slate-400">
               <FileText size={40} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Applications Locked</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-xs mx-auto">
               Please login to submit leave requests or view your application history.
            </p>
            <Link to="/profile" className="mt-8 px-8 py-3 bg-slate-900 dark:bg-white text-white dark:text-black font-bold rounded-xl flex items-center gap-2 hover:scale-105 transition-transform">
               <LogIn size={20} /> Login Now
            </Link>
         </div>
      );
  }

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      // Reset after showing success for a bit or leave it
      setTimeout(() => {
        setSubmitted(false);
        setActiveTab('history');
      }, 2000);
    }, 1500);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Applications</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Submit leave requests or other applications.</p>
      </div>

      <div className="flex bg-white dark:bg-[#1C1C1E] p-1 rounded-2xl shadow-sm border border-slate-100 dark:border-white/5 mb-6">
        <button 
          onClick={() => setActiveTab('new')}
          className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all ${activeTab === 'new' ? 'bg-ios-blue text-white shadow-md' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'}`}
        >
          New Application
        </button>
        <button 
          onClick={() => setActiveTab('history')}
          className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all ${activeTab === 'history' ? 'bg-ios-blue text-white shadow-md' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'}`}
        >
          History
        </button>
      </div>

      {activeTab === 'new' ? (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-[#1C1C1E] p-8 rounded-[2rem] shadow-sm border border-slate-100 dark:border-white/5 space-y-6 relative overflow-hidden"
        >
          {submitted && (
            <div className="absolute inset-0 bg-white/90 dark:bg-[#1C1C1E]/90 z-10 flex flex-col items-center justify-center backdrop-blur-sm">
               <CheckCircle2 size={48} className="text-green-500 mb-4" />
               <h3 className="text-xl font-bold text-slate-900 dark:text-white">Request Sent!</h3>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Application Type</label>
            <select className="w-full p-4 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 outline-none focus:ring-2 focus:ring-ios-blue/50 text-slate-900 dark:text-white">
              <option>Sick Leave</option>
              <option>Casual Leave</option>
              <option>Urgent Piece of Work</option>
              <option>Other</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">From Date</label>
              <input type="date" className="w-full p-4 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 outline-none focus:ring-2 focus:ring-ios-blue/50 text-slate-900 dark:text-white" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">To Date</label>
              <input type="date" className="w-full p-4 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 outline-none focus:ring-2 focus:ring-ios-blue/50 text-slate-900 dark:text-white" />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Reason</label>
            <textarea 
              rows={4}
              placeholder="Please specify the reason..."
              className="w-full p-4 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 outline-none focus:ring-2 focus:ring-ios-blue/50 text-slate-900 dark:text-white resize-none"
            ></textarea>
          </div>

          <button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full py-4 bg-ios-blue text-white font-bold rounded-xl shadow-lg shadow-ios-blue/30 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            {isSubmitting ? <Loader2 className="animate-spin" /> : <><Send size={20} /> Submit Application</>}
          </button>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {applicationHistory.map((app, index) => (
             <motion.div 
               key={app.id}
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: index * 0.1 }}
               className="bg-white dark:bg-[#1C1C1E] p-5 rounded-[1.5rem] shadow-sm border border-slate-100 dark:border-white/5 flex items-center justify-between"
             >
               <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-white/5 flex items-center justify-center text-slate-500">
                    <FileText size={24} />
                 </div>
                 <div>
                   <h4 className="font-bold text-slate-900 dark:text-white">{app.type}</h4>
                   <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1">
                     <Calendar size={12} />
                     <span>{app.from} - {app.to}</span>
                   </div>
                 </div>
               </div>
               <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${app.color}`}>
                 {app.status}
               </span>
             </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
