
import React, { useContext, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Check, X, Calendar, Clock, User, Filter, AlertCircle, ChevronRight, Inbox, Phone, MessageCircle, Trash2, Lock } from 'lucide-react';
import { SchoolContext, AuthContext } from '../../App';
import { LeaveApplication } from '../../types';

export const AdminApplications: React.FC = () => {
  const { leaveApplications, updateLeaveStatus, setLeaveApplications } = useContext(SchoolContext);
  const { allStudents, currentAdmin } = useContext(AuthContext); 
  const [selectedApp, setSelectedApp] = useState<LeaveApplication | null>(null);
  const [filter, setFilter] = useState<'All' | 'Pending' | 'Processed'>('Pending');

  // Teacher Filter Logic
  const isTeacher = currentAdmin?.role === 'Teacher';
  const teacherClass = currentAdmin?.assignedClass || '';
  const teacherSection = currentAdmin?.assignedSection || '';

  const filteredApplications = useMemo(() => {
    return leaveApplications
      .filter(app => {
        // Status Filter
        if (filter === 'Pending') {
            if (app.status !== 'Pending') return false;
        }
        if (filter === 'Processed') {
            if (app.status === 'Pending') return false;
        }

        // Teacher Restriction Filter
        if (isTeacher) {
            // Assuming app.class format is "X-A"
            const targetClassStr = `${teacherClass}-${teacherSection}`;
            if (app.class !== targetClassStr) return false;
        }

        return true;
      })
      .sort((a, b) => new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime());
  }, [leaveApplications, filter, isTeacher, teacherClass, teacherSection]);

  const handleStatusChange = (id: number, status: 'Approved' | 'Rejected') => {
    updateLeaveStatus(id, status);
    setSelectedApp(null);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this application permanently?")) {
      setLeaveApplications(prev => prev.filter(app => app.id !== id));
      setSelectedApp(null);
    }
  };

  const getDuration = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; 
    return `${diffDays} Day${diffDays > 1 ? 's' : ''}`;
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Approved': return 'text-green-600 bg-green-100 dark:bg-green-500/20 dark:text-green-400';
      case 'Rejected': return 'text-red-600 bg-red-100 dark:bg-red-500/20 dark:text-red-400';
      default: return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-500/20 dark:text-yellow-400';
    }
  };

  // Helper to find student profile
  const getStudentProfile = (id: string) => {
    return allStudents.find(s => s.admissionNo === id);
  };

  const handleWhatsApp = (mobile: string, name: string) => {
    const text = `Hello, regarding the leave application for ${name} at Azim National School...`;
    window.open(`https://wa.me/91${mobile}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="space-y-6 h-[calc(100vh-140px)] flex flex-col">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
             <FileText className="text-ios-blue" size={32} /> Leave Requests
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage student leave applications.</p>
        </div>
        
        {isTeacher && (
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-500/10 rounded-xl text-blue-700 dark:text-blue-300 font-bold border border-blue-100 dark:border-blue-500/20 whitespace-nowrap text-sm">
                <Lock size={14} /> 
                <span>Managing Class: {teacherClass}-{teacherSection}</span>
            </div>
        )}

        <div className="flex bg-white dark:bg-[#1C1C1E] p-1.5 rounded-xl border border-slate-100 dark:border-white/5 shadow-sm">
           {['Pending', 'Processed', 'All'].map((f) => (
               <button 
                 key={f}
                 onClick={() => setFilter(f as any)}
                 className={`px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${filter === f ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'}`}
               >
                 {f}
               </button>
           ))}
        </div>
      </div>

      {/* List */}
      <div className="flex-1 bg-white dark:bg-[#1C1C1E] rounded-[2rem] border border-slate-100 dark:border-white/5 shadow-sm overflow-hidden flex flex-col relative">
         <div className="overflow-y-auto flex-1 p-2">
            {filteredApplications.length > 0 ? (
                <div className="space-y-2">
                    {filteredApplications.map((app) => (
                        <motion.div 
                            key={app.id}
                            layout
                            onClick={() => setSelectedApp(app)}
                            className={`
                                p-4 rounded-2xl cursor-pointer border transition-all flex items-center gap-4 group
                                ${app.status === 'Pending' ? 'bg-yellow-50/50 dark:bg-yellow-500/5 border-yellow-100 dark:border-yellow-500/20' : 'bg-transparent border-transparent hover:bg-slate-50 dark:hover:bg-white/5'}
                            `}
                        >
                            <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-white/10 flex items-center justify-center text-slate-500 flex-shrink-0">
                                <User size={20} />
                            </div>
                            
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start mb-1">
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                                            {app.studentName}
                                        </h4>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">Class {app.class} • Roll {app.rollNo}</p>
                                    </div>
                                    <span className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider ${getStatusColor(app.status)}`}>
                                        {app.status}
                                    </span>
                                </div>
                                <div className="flex items-center gap-4 text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
                                    <span className="flex items-center gap-1"><Calendar size={12} /> {app.startDate} to {app.endDate}</span>
                                    <span className="hidden sm:flex items-center gap-1 px-2 py-0.5 bg-slate-100 dark:bg-white/10 rounded-md text-slate-600 dark:text-slate-300">
                                      {app.subject}
                                    </span>
                                </div>
                            </div>
                            
                            <ChevronRight size={20} className="text-slate-300 dark:text-slate-600" />
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-400">
                    <div className="w-20 h-20 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-4">
                        <Inbox size={40} className="opacity-50" />
                    </div>
                    <p className="font-medium">All caught up!</p>
                    <p className="text-sm opacity-60">No applications found in this filter.</p>
                </div>
            )}
         </div>
      </div>

      {/* Decision Modal */}
      <AnimatePresence>
         {selectedApp && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
               <motion.div 
                 initial={{ opacity: 0 }} 
                 animate={{ opacity: 1 }} 
                 exit={{ opacity: 0 }}
                 onClick={() => setSelectedApp(null)}
                 className="absolute inset-0 bg-black/60 backdrop-blur-sm"
               />
               <motion.div 
                 layoutId={`app-${selectedApp.id}`}
                 initial={{ scale: 0.9, opacity: 0 }}
                 animate={{ scale: 1, opacity: 1 }}
                 exit={{ scale: 0.9, opacity: 0 }}
                 className="relative bg-white/90 dark:bg-[#1C1C1E]/90 backdrop-blur-xl w-full max-w-lg rounded-[2.5rem] shadow-2xl border border-white/20 overflow-hidden flex flex-col"
               >
                  {/* Modal Header */}
                  <div className="p-8 pb-6 border-b border-slate-200 dark:border-white/10 flex justify-between items-start">
                     <div>
                        <div className="flex items-center gap-2 mb-2">
                           <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${getStatusColor(selectedApp.status)}`}>
                              {selectedApp.status}
                           </span>
                           <span className="text-xs text-slate-500 font-medium">{selectedApp.appliedDate}</span>
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Leave Request</h2>
                        <p className="text-slate-500 dark:text-slate-400">from <span className="font-bold text-slate-900 dark:text-white">{selectedApp.studentName}</span></p>
                     </div>
                     <button 
                        onClick={() => setSelectedApp(null)}
                        className="p-2 rounded-full bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 transition-colors"
                     >
                        <X size={20} className="text-slate-600 dark:text-slate-300" />
                     </button>
                  </div>

                  {/* Modal Body */}
                  <div className="p-8 space-y-6">
                     <div className="flex gap-4 p-4 bg-slate-50 dark:bg-black/20 rounded-2xl border border-slate-100 dark:border-white/5">
                        <div className="flex-1">
                           <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Duration</p>
                           <p className="font-bold text-slate-900 dark:text-white text-lg">{getDuration(selectedApp.startDate, selectedApp.endDate)}</p>
                           <p className="text-xs text-slate-500">{selectedApp.startDate} to {selectedApp.endDate}</p>
                        </div>
                        <div className="w-[1px] bg-slate-200 dark:bg-white/10"></div>
                        <div className="flex-1">
                           <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Subject</p>
                           <p className="font-bold text-slate-900 dark:text-white text-lg">{selectedApp.subject}</p>
                        </div>
                     </div>

                     {/* Contact Actions Row */}
                     {getStudentProfile(selectedApp.studentId) && (
                        <div className="flex gap-3">
                           <a 
                              href={`tel:${getStudentProfile(selectedApp.studentId)?.mobile}`}
                              className="flex-1 py-3 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm font-bold text-slate-700 dark:text-white flex items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-white/10 transition-colors"
                           >
                              <Phone size={16} className="text-green-500" /> Call Parent
                           </a>
                           <button 
                              onClick={() => handleWhatsApp(getStudentProfile(selectedApp.studentId)?.mobile || '', selectedApp.studentName)}
                              className="flex-1 py-3 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm font-bold text-slate-700 dark:text-white flex items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-white/10 transition-colors"
                           >
                              <MessageCircle size={16} className="text-[#25D366]" /> WhatsApp
                           </button>
                        </div>
                     )}

                     <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Reason provided</p>
                        <div className="p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5 text-slate-700 dark:text-slate-300 italic">
                           "{selectedApp.reason}"
                        </div>
                     </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="p-6 bg-slate-50 dark:bg-white/5 border-t border-slate-200 dark:border-white/10 flex flex-wrap gap-3 justify-end">
                     {selectedApp.status === 'Pending' ? (
                       <>
                        <button 
                           onClick={() => handleDelete(selectedApp.id)}
                           className="px-5 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors flex items-center gap-2 mr-auto"
                        >
                           <Trash2 size={18} /> Delete
                        </button>
                        <button 
                           onClick={() => handleStatusChange(selectedApp.id, 'Rejected')}
                           className="flex-1 py-3 rounded-xl font-bold bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-500/20 dark:text-red-400 dark:hover:bg-red-500/30 transition-colors flex items-center justify-center gap-2"
                        >
                           <X size={18} /> Reject
                        </button>
                        <button 
                           onClick={() => handleStatusChange(selectedApp.id, 'Approved')}
                           className="flex-1 py-3 rounded-xl font-bold bg-green-500 text-white shadow-lg hover:bg-green-600 transition-all flex items-center justify-center gap-2"
                        >
                           <Check size={18} /> Approve
                        </button>
                       </>
                     ) : (
                        <button 
                           onClick={() => handleDelete(selectedApp.id)}
                           className="px-5 py-3 rounded-xl font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-2 w-full justify-center"
                        >
                           <Trash2 size={18} /> Delete Application
                        </button>
                     )}
                  </div>
               </motion.div>
            </div>
         )}
      </AnimatePresence>
    </div>
  );
};
