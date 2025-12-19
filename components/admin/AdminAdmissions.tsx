
import React, { useContext, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UserPlus, 
  Phone, 
  MessageCircle, 
  CheckCircle, 
  Trash2, 
  Filter, 
  ChevronDown, 
  Inbox, 
  X, 
  MapPin, 
  School,
  Calendar,
  Clock,
  ChevronRight
} from 'lucide-react';
import { SchoolContext } from '../../App';
import { AdmissionApplication } from '../../types';

export const AdminAdmissions: React.FC = () => {
  const { admissions, setAdmissions } = useContext(SchoolContext);
  const [filterStatus, setFilterStatus] = useState<'All' | 'New' | 'Contacted'>('All');
  const [selectedClass, setSelectedClass] = useState('All');
  const [selectedInquiry, setSelectedInquiry] = useState<AdmissionApplication | null>(null);

  // Derived Data
  const uniqueClasses = useMemo(() => ['All', ...Array.from(new Set(admissions.map(a => a.admissionForClass)))], [admissions]);

  const filteredAdmissions = useMemo(() => {
    return admissions
      .filter(app => {
        if (filterStatus === 'New') return app.status === 'Received';
        if (filterStatus === 'Contacted') return app.status === 'Contacted' || app.status === 'In Progress';
        return true;
      })
      .filter(app => selectedClass === 'All' || app.admissionForClass === selectedClass)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [admissions, filterStatus, selectedClass]);

  // Actions
  const handleMarkContacted = (id: number) => {
    setAdmissions(prev => prev.map(a => a.id === id ? { ...a, status: 'Contacted' } : a));
    setSelectedInquiry(prev => prev ? { ...prev, status: 'Contacted' } : null);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this inquiry?")) {
      setAdmissions(prev => prev.filter(a => a.id !== id));
      setSelectedInquiry(null);
    }
  };

  const handleWhatsApp = (mobile: string, name: string) => {
    const message = `Hello, we received an admission inquiry for ${name} at Azim National School. How can we assist you further?`;
    window.open(`https://wa.me/91${mobile}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Received': return 'text-blue-600 bg-blue-100 dark:bg-blue-500/20 dark:text-blue-400';
      case 'Contacted': return 'text-slate-600 bg-slate-100 dark:bg-white/10 dark:text-slate-300';
      case 'Admitted': return 'text-green-600 bg-green-100 dark:bg-green-500/20 dark:text-green-400';
      case 'Rejected': return 'text-red-600 bg-red-100 dark:bg-red-500/20 dark:text-red-400';
      default: return 'text-orange-600 bg-orange-100 dark:bg-orange-500/20 dark:text-orange-400';
    }
  };

  return (
    <div className="space-y-6 h-[calc(100vh-140px)] flex flex-col pb-20 md:pb-0">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            <Inbox className="text-ios-blue" size={32} /> Admission Inbox
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage and respond to new student inquiries.</p>
        </div>
        
        <div className="flex gap-2 bg-white dark:bg-[#1C1C1E] p-1.5 rounded-xl border border-slate-100 dark:border-white/5 shadow-sm w-full md:w-auto">
           <button 
             onClick={() => setFilterStatus('New')}
             className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-sm font-bold transition-all ${filterStatus === 'New' ? 'bg-blue-500 text-white shadow-md' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'}`}
           >
             New
           </button>
           <button 
             onClick={() => setFilterStatus('All')}
             className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-sm font-bold transition-all ${filterStatus === 'All' ? 'bg-slate-900 dark:bg-white text-white dark:text-black shadow-md' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'}`}
           >
             All
           </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-white dark:bg-[#1C1C1E] p-4 rounded-[1.5rem] border border-slate-100 dark:border-white/5 shrink-0 gap-3">
         <div className="flex items-center gap-2 text-slate-500 w-full md:w-auto">
            <Filter size={18} />
            <span className="text-sm font-bold">Filter By Class:</span>
         </div>
         <div className="relative w-full md:w-auto">
            <select 
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full md:w-auto appearance-none bg-slate-50 dark:bg-black/20 pl-4 pr-10 py-2 rounded-lg text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-ios-blue/50 cursor-pointer"
            >
               {uniqueClasses.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
         </div>
      </div>

      {/* Inbox List */}
      <div className="flex-1 bg-white dark:bg-[#1C1C1E] rounded-[2rem] border border-slate-100 dark:border-white/5 shadow-sm overflow-hidden flex flex-col">
         {/* Desktop Table Header */}
         <div className="hidden md:grid grid-cols-[1fr_1.5fr_1fr_1fr_1fr] gap-4 p-5 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5 text-xs font-bold text-slate-500 uppercase tracking-wider sticky top-0 z-10">
            <div>Date Received</div>
            <div>Student Name</div>
            <div>Target Class</div>
            <div>Contact</div>
            <div className="text-center">Status</div>
         </div>

         {/* List Body */}
         <div className="overflow-y-auto flex-1 p-2 md:p-0">
            {filteredAdmissions.length > 0 ? (
               filteredAdmissions.map((app) => (
                  <motion.div 
                    key={app.id}
                    layout
                    onClick={() => setSelectedInquiry(app)}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`
                      cursor-pointer transition-colors
                      md:grid md:grid-cols-[1fr_1.5fr_1fr_1fr_1fr] md:gap-4 md:p-5 md:border-b border-slate-100 dark:border-white/5 md:items-center
                      flex flex-col gap-2 p-4 rounded-2xl mb-2 bg-slate-50 dark:bg-white/5 md:bg-transparent md:mb-0 md:rounded-none
                      ${selectedInquiry?.id === app.id ? 'ring-2 ring-ios-blue md:ring-0 md:bg-ios-blue/5 dark:md:bg-blue-500/10' : 'hover:bg-slate-100 dark:hover:bg-white/10'}
                    `}
                  >
                     {/* Mobile Header Line */}
                     <div className="flex justify-between items-center md:block">
                        <div className="text-sm font-medium text-slate-500 flex items-center gap-2">
                            {app.status === 'Received' && <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" title="New Inquiry"></div>}
                            {new Date(app.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                        </div>
                        <span className={`md:hidden px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${getStatusColor(app.status)}`}>
                           {app.status === 'Received' ? 'New' : app.status}
                        </span>
                     </div>

                     <div className="font-bold text-slate-900 dark:text-white truncate text-base md:text-sm">
                        {app.studentName}
                        <span className="block text-xs font-normal text-slate-400">c/o {app.fatherName}</span>
                     </div>

                     <div className="text-sm text-slate-700 dark:text-slate-300 font-medium flex justify-between md:block">
                        <span className="md:hidden text-slate-400 text-xs uppercase font-bold">Class:</span>
                        {app.admissionForClass}
                     </div>

                     <div className="text-sm text-slate-500 font-mono flex justify-between md:block">
                        <span className="md:hidden text-slate-400 text-xs font-sans uppercase font-bold">Mobile:</span>
                        {app.mobile}
                     </div>

                     <div className="hidden md:flex justify-center">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusColor(app.status)}`}>
                           {app.status === 'Received' ? 'New' : app.status}
                        </span>
                     </div>
                  </motion.div>
               ))
            ) : (
               <div className="flex flex-col items-center justify-center h-full text-slate-400 py-20">
                  <Inbox size={48} className="mb-4 opacity-50" />
                  <p>No inquiries found</p>
               </div>
            )}
         </div>
      </div>

      {/* DETAIL MODAL */}
      <AnimatePresence>
         {selectedInquiry && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
               <motion.div 
                 initial={{ opacity: 0 }} 
                 animate={{ opacity: 1 }} 
                 exit={{ opacity: 0 }}
                 onClick={() => setSelectedInquiry(null)}
                 className="absolute inset-0 bg-black/60 backdrop-blur-sm"
               />
               <motion.div 
                 layoutId={`inquiry-${selectedInquiry.id}`}
                 className="relative bg-white/90 dark:bg-[#1C1C1E]/90 backdrop-blur-xl w-full max-w-2xl rounded-[2.5rem] shadow-2xl border border-white/20 overflow-hidden flex flex-col max-h-[90vh]"
               >
                  {/* Modal Header */}
                  <div className="p-6 md:p-8 md:pb-6 border-b border-slate-200 dark:border-white/10">
                     <div className="flex justify-between items-start">
                        <div>
                           <div className="flex items-center gap-3 mb-2">
                              <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${getStatusColor(selectedInquiry.status)}`}>
                                 {selectedInquiry.status === 'Received' ? 'New Inquiry' : selectedInquiry.status}
                              </span>
                              <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                                 <Clock size={12} /> {selectedInquiry.date}
                              </span>
                           </div>
                           <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{selectedInquiry.studentName}</h2>
                           <p className="text-slate-500 dark:text-slate-400 text-base md:text-lg">Admission for <span className="text-slate-900 dark:text-white font-bold">{selectedInquiry.admissionForClass}</span></p>
                        </div>
                        <button 
                           onClick={() => setSelectedInquiry(null)}
                           className="p-2 rounded-full bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 transition-colors"
                        >
                           <X size={24} className="text-slate-600 dark:text-slate-300" />
                        </button>
                     </div>
                  </div>

                  {/* Modal Body */}
                  <div className="p-6 md:p-8 overflow-y-auto space-y-6">
                     {/* Parent & Contact */}
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-black/20 border border-slate-100 dark:border-white/5">
                           <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Parent Details</h3>
                           <div className="flex items-center gap-3 mb-2">
                              <div className="w-10 h-10 rounded-full bg-white dark:bg-white/10 flex items-center justify-center text-slate-500">
                                 <UserPlus size={20} />
                              </div>
                              <div>
                                 <p className="font-bold text-slate-900 dark:text-white">{selectedInquiry.fatherName}</p>
                                 <p className="text-xs text-slate-500">Father / Guardian</p>
                              </div>
                           </div>
                           <div className="flex items-center gap-3 mt-4">
                              <div className="w-10 h-10 rounded-full bg-white dark:bg-white/10 flex items-center justify-center text-slate-500">
                                 <Phone size={20} />
                              </div>
                              <div>
                                 <p className="font-bold text-slate-900 dark:text-white font-mono text-lg">{selectedInquiry.mobile}</p>
                                 <p className="text-xs text-slate-500">Primary Contact</p>
                              </div>
                           </div>
                        </div>

                        {/* Location */}
                        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-black/20 border border-slate-100 dark:border-white/5">
                           <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Background</h3>
                           <div className="space-y-4">
                              <div className="flex items-start gap-3">
                                 <School size={18} className="text-ios-blue mt-0.5" />
                                 <div>
                                    <p className="text-xs text-slate-400 font-bold uppercase">Previous School</p>
                                    <p className="font-semibold text-slate-900 dark:text-white">{selectedInquiry.previousSchool || 'Not Mentioned'}</p>
                                 </div>
                              </div>
                              <div className="flex items-start gap-3">
                                 <MapPin size={18} className="text-ios-red mt-0.5" />
                                 <div>
                                    <p className="text-xs text-slate-400 font-bold uppercase">Address</p>
                                    <p className="font-semibold text-slate-900 dark:text-white leading-tight">{selectedInquiry.address || 'Not Provided'}</p>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* Modal Footer (Actions) */}
                  <div className="p-6 bg-slate-50 dark:bg-white/5 border-t border-slate-200 dark:border-white/10 flex flex-col md:flex-row flex-wrap gap-3 justify-end">
                     <button 
                        onClick={() => handleDelete(selectedInquiry.id)}
                        className="px-5 py-3 rounded-xl font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center justify-center gap-2 md:mr-auto w-full md:w-auto order-last md:order-first"
                     >
                        <Trash2 size={18} /> Delete
                     </button>

                     <a 
                        href={`tel:${selectedInquiry.mobile}`}
                        className="px-6 py-3 rounded-xl font-bold bg-white dark:bg-[#2C2C2E] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white shadow-sm hover:bg-slate-50 dark:hover:bg-white/10 transition-colors flex items-center justify-center gap-2 w-full md:w-auto"
                     >
                        <Phone size={18} /> Call
                     </a>

                     <button 
                        onClick={() => handleWhatsApp(selectedInquiry.mobile, selectedInquiry.studentName)}
                        className="px-6 py-3 rounded-xl font-bold bg-[#25D366] text-white shadow-lg hover:brightness-110 transition-all flex items-center justify-center gap-2 w-full md:w-auto"
                     >
                        <MessageCircle size={18} /> WhatsApp
                     </button>

                     {selectedInquiry.status === 'Received' && (
                        <button 
                           onClick={() => handleMarkContacted(selectedInquiry.id)}
                           className="px-6 py-3 rounded-xl font-bold bg-ios-blue text-white shadow-lg hover:brightness-110 transition-all flex items-center justify-center gap-2 w-full md:w-auto"
                        >
                           <CheckCircle size={18} /> Mark Contacted
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
