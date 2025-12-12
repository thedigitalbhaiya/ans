
import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Send, Calendar, CheckCircle2, Loader2, LogIn, Clock, XCircle, AlertCircle } from 'lucide-react';
import { AuthContext, SchoolContext } from '../App';
import { Link } from 'react-router-dom';

export const Application: React.FC = () => {
  const { currentStudent } = useContext(AuthContext);
  const { leaveApplications, addLeaveApplication } = useContext(SchoolContext);
  const [activeTab, setActiveTab] = useState<'new' | 'history'>('new');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Form State
  const [subject, setSubject] = useState('');
  const [reason, setReason] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const myApplications = leaveApplications
    .filter(app => app.studentId === currentStudent.admissionNo)
    .sort((a, b) => new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate network request
    setTimeout(() => {
      addLeaveApplication({
        studentId: currentStudent.admissionNo,
        studentName: currentStudent.name,
        class: currentStudent.class + '-' + currentStudent.section,
        rollNo: currentStudent.rollNo,
        startDate: startDate,
        endDate: endDate,
        subject: subject,
        reason: reason
      });

      setIsSubmitting(false);
      setSubmitted(true);
      
      // Reset form
      setSubject('');
      setReason('');
      setStartDate('');
      setEndDate('');

      setTimeout(() => {
        setSubmitted(false);
        setActiveTab('history');
      }, 2000);
    }, 1500);
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'Approved':
        return <span className="bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1"><CheckCircle2 size={14} /> Approved</span>;
      case 'Rejected':
        return <span className="bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1"><XCircle size={14} /> Rejected</span>;
      default:
        return <span className="bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1"><Clock size={14} /> Pending</span>;
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center mb-4">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Leave Application</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Request leave or view status</p>
      </div>

      <div className="flex bg-white dark:bg-[#1C1C1E] p-1 rounded-2xl shadow-sm border border-slate-100 dark:border-white/5 mb-6">
        <button 
          onClick={() => setActiveTab('new')}
          className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all ${activeTab === 'new' ? 'bg-ios-blue text-white shadow-md' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'}`}
        >
          New Request
        </button>
        <button 
          onClick={() => setActiveTab('history')}
          className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all ${activeTab === 'history' ? 'bg-ios-blue text-white shadow-md' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'}`}
        >
          My History
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'new' ? (
          <motion.form 
            key="new"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="bg-white dark:bg-[#1C1C1E] p-8 rounded-[2rem] shadow-sm border border-slate-100 dark:border-white/5 space-y-6 relative overflow-hidden"
            onSubmit={handleSubmit}
          >
            {submitted && (
              <div className="absolute inset-0 bg-white/90 dark:bg-[#1C1C1E]/90 z-20 flex flex-col items-center justify-center backdrop-blur-sm">
                 <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-green-500 mb-4">
                    <CheckCircle2 size={64} />
                 </motion.div>
                 <h3 className="text-xl font-bold text-slate-900 dark:text-white">Application Sent!</h3>
                 <p className="text-slate-500 text-sm mt-1">Check history for status updates.</p>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-500 dark:text-slate-400 ml-1 uppercase tracking-wider">Leave Type / Subject</label>
              <select 
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
                className="w-full p-4 rounded-xl bg-slate-50 dark:bg-black/20 border-none outline-none focus:ring-2 focus:ring-ios-blue/50 text-slate-900 dark:text-white font-medium"
              >
                <option value="" disabled>Select Reason</option>
                <option value="Sick Leave">Sick Leave</option>
                <option value="Casual Leave">Casual Leave</option>
                <option value="Urgent Work">Urgent Piece of Work</option>
                <option value="Family Function">Family Function</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-500 dark:text-slate-400 ml-1 uppercase tracking-wider">From Date</label>
                <input 
                  type="date" 
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full p-4 rounded-xl bg-slate-50 dark:bg-black/20 border-none outline-none focus:ring-2 focus:ring-ios-blue/50 text-slate-900 dark:text-white font-medium" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-500 dark:text-slate-400 ml-1 uppercase tracking-wider">To Date</label>
                <input 
                  type="date" 
                  required
                  min={startDate || new Date().toISOString().split('T')[0]}
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full p-4 rounded-xl bg-slate-50 dark:bg-black/20 border-none outline-none focus:ring-2 focus:ring-ios-blue/50 text-slate-900 dark:text-white font-medium" 
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-500 dark:text-slate-400 ml-1 uppercase tracking-wider">Reason Details</label>
              <textarea 
                rows={4}
                required
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Please describe why you need leave..."
                className="w-full p-4 rounded-xl bg-slate-50 dark:bg-black/20 border-none outline-none focus:ring-2 focus:ring-ios-blue/50 text-slate-900 dark:text-white resize-none font-medium"
              ></textarea>
            </div>

            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-ios-blue text-white font-bold rounded-xl shadow-lg shadow-ios-blue/30 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? <Loader2 className="animate-spin" /> : <><Send size={20} /> Submit Request</>}
            </button>
          </motion.form>
        ) : (
          <motion.div 
            key="history"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            {myApplications.length > 0 ? (
              myApplications.map((app, index) => (
                 <motion.div 
                   key={app.id}
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: index * 0.05 }}
                   className="bg-white dark:bg-[#1C1C1E] p-5 rounded-[1.5rem] shadow-sm border border-slate-100 dark:border-white/5 flex flex-col gap-3"
                 >
                   <div className="flex justify-between items-start">
                     <div className="flex items-center gap-4">
                       <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-white/5 flex items-center justify-center text-slate-500">
                          <FileText size={24} />
                       </div>
                       <div>
                         <h4 className="font-bold text-slate-900 dark:text-white text-lg">{app.subject}</h4>
                         <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
                           <Calendar size={12} />
                           <span>{new Date(app.startDate).toLocaleDateString()} - {new Date(app.endDate).toLocaleDateString()}</span>
                         </div>
                       </div>
                     </div>
                     {getStatusBadge(app.status)}
                   </div>
                   
                   <div className="pl-16">
                      <p className="text-sm text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-black/20 p-3 rounded-xl">
                        {app.reason}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-2 text-right">Applied on {app.appliedDate}</p>
                   </div>
                 </motion.div>
              ))
            ) : (
              <div className="text-center py-10 text-slate-400">
                <FileText size={48} className="mx-auto mb-4 opacity-20" />
                <p>No applications found.</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
