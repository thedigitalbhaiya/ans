
import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { Send, Loader2, MessageSquare, LogIn } from 'lucide-react';
import { SchoolContext, AuthContext } from '../App';
import { Link } from 'react-router-dom';

export const Feedback: React.FC = () => {
  const { addFeedback } = useContext(SchoolContext);
  const { isLoggedIn, currentStudent } = useContext(AuthContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  // If not logged in, show lock screen
  if (!isLoggedIn) {
      return (
         <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-24 h-24 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-6 text-slate-400">
               <MessageSquare size={40} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Feedback Locked</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-xs mx-auto">
               Please login to submit complaints, suggestions, or appreciation.
            </p>
            <Link to="/profile" className="mt-8 px-8 py-3 bg-slate-900 dark:bg-white text-white dark:text-black font-bold rounded-xl flex items-center gap-2 hover:scale-105 transition-transform">
               <LogIn size={20} /> Login Now
            </Link>
         </div>
      );
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    setIsSubmitting(true);
    
    // Simulate network delay
    setTimeout(() => {
      addFeedback({
        studentId: currentStudent.admissionNo,
        studentName: currentStudent.name,
        class: `${currentStudent.class}-${currentStudent.section}`,
        mobile: currentStudent.mobile,
        type: data.type as any,
        message: data.message as string,
      });
      setIsSubmitting(false);
      setSent(true);
      e.currentTarget.reset();
    }, 1500);
  };

  if (sent) {
    return (
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="flex flex-col items-center justify-center h-[50vh] text-center"
      >
         <div className="w-24 h-24 bg-green-100 dark:bg-green-500/20 rounded-full flex items-center justify-center text-green-600 dark:text-green-400 mb-6 shadow-xl">
           <MessageSquare size={40} />
         </div>
         <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Message Sent!</h2>
         <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-sm">Thank you for reaching out. The administration has received your message.</p>
         <button 
           onClick={() => setSent(false)} 
           className="mt-8 px-8 py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-black font-bold shadow-lg hover:scale-105 transition-transform"
         >
           Send Another
         </button>
      </motion.div>
    )
  }

  return (
    <div className="max-w-xl mx-auto space-y-8 pb-20">
       <div className="text-center">
         <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Help & Feedback</h1>
         <p className="text-slate-500 dark:text-slate-400 mt-2">Submit a complaint, suggestion, or appreciation.</p>
       </div>

       <motion.form 
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         className="bg-white dark:bg-[#1C1C1E] p-8 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-white/5 space-y-6"
         onSubmit={handleSubmit}
       >
          {/* Read Only Info */}
          <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-black/20 rounded-2xl border border-slate-100 dark:border-white/5 mb-2">
             <div className="w-10 h-10 rounded-full bg-white dark:bg-white/10 flex items-center justify-center text-slate-500">
                <MessageSquare size={20} />
             </div>
             <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sending As</p>
                <p className="text-sm font-bold text-slate-900 dark:text-white">{currentStudent.name}</p>
             </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">Feedback Type</label>
            <div className="relative">
              <select name="type" className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-black/20 border-none outline-none focus:ring-2 focus:ring-ios-blue/50 text-slate-900 dark:text-white font-medium appearance-none cursor-pointer">
                <option value="Complaint">Complaint</option>
                <option value="Suggestion">Suggestion</option>
                <option value="Appreciation">Appreciation</option>
                <option value="Other">Other</option>
              </select>
              {/* Custom Arrow */}
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                 <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">Your Message</label>
            <textarea 
              name="message"
              required
              rows={6}
              placeholder="Write your details here..."
              className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-black/20 border-none outline-none focus:ring-2 focus:ring-ios-blue/50 text-slate-900 dark:text-white resize-none font-medium placeholder-slate-400"
            ></textarea>
          </div>

          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-ios-blue text-white font-bold rounded-2xl shadow-lg shadow-ios-blue/30 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:scale-100"
          >
            {isSubmitting ? <Loader2 className="animate-spin" /> : <><Send size={20} /> Submit Feedback</>}
          </button>
       </motion.form>
    </div>
  );
};
