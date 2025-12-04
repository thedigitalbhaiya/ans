import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Loader2, MessageSquare } from 'lucide-react';

export const Feedback: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSent(true);
    }, 1500);
  };

  if (sent) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-center">
         <div className="w-20 h-20 bg-ios-blue/10 rounded-full flex items-center justify-center text-ios-blue mb-4">
           <MessageSquare size={40} />
         </div>
         <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Feedback Sent!</h2>
         <p className="text-slate-500 mt-2">Thank you for your valuable feedback.</p>
         <button onClick={() => setSent(false)} className="mt-6 text-ios-blue font-semibold">Send Another</button>
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto space-y-8">
       <div className="text-center">
         <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Feedback</h1>
         <p className="text-slate-500 dark:text-slate-400 mt-2">We value your suggestions to improve our school.</p>
       </div>

       <motion.form 
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         className="bg-white dark:bg-[#1C1C1E] p-8 rounded-[2rem] shadow-sm border border-slate-100 dark:border-white/5 space-y-6"
         onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}
       >
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Topic</label>
            <select className="w-full p-4 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 outline-none focus:ring-2 focus:ring-ios-blue/50 text-slate-900 dark:text-white">
              <option>General Suggestion</option>
              <option>Academic Issue</option>
              <option>Facility Maintenance</option>
              <option>Other</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Message</label>
            <textarea 
              required
              rows={5}
              placeholder="Write your feedback here..."
              className="w-full p-4 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 outline-none focus:ring-2 focus:ring-ios-blue/50 text-slate-900 dark:text-white resize-none"
            ></textarea>
          </div>

          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-ios-blue text-white font-bold rounded-xl shadow-lg shadow-ios-blue/30 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:scale-100"
          >
            {isSubmitting ? <Loader2 className="animate-spin" /> : <><Send size={20} /> Submit Feedback</>}
          </button>
       </motion.form>
    </div>
  );
};