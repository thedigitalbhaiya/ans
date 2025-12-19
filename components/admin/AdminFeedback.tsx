
import React, { useContext, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  Search, 
  ChevronDown, 
  Phone, 
  User, 
  X,
  AlertTriangle,
  ThumbsUp,
  HelpCircle,
  Inbox,
  ShieldAlert
} from 'lucide-react';
import { SchoolContext, AuthContext } from '../../App';
import { Feedback } from '../../types';

export const AdminFeedback: React.FC = () => {
  const { feedback, setFeedback } = useContext(SchoolContext);
  const { currentAdmin } = useContext(AuthContext);
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [filterType, setFilterType] = useState<'All' | 'Complaint' | 'Suggestion' | 'Appreciation'>('All');

  // PERMISSION CHECK
  if (currentAdmin?.role === 'Teacher') {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <div className="w-24 h-24 bg-red-50 dark:bg-red-500/10 rounded-full flex items-center justify-center mb-6">
           <ShieldAlert size={48} className="text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Access Denied</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-sm">
           Feedback and complaints are managed by the administrative office.
        </p>
      </div>
    );
  }

  // Filter and Sort Logic
  const filteredFeedback = feedback
    .filter(f => filterType === 'All' || f.type === filterType)
    .sort((a, b) => {
        // Sort by Status (Unread first), then by Date (Newest first)
        if (a.status === 'Unread' && b.status !== 'Unread') return -1;
        if (a.status !== 'Unread' && b.status === 'Unread') return 1;
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

  // Actions
  const handleDelete = (id: number, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (window.confirm("Are you sure you want to delete this message?")) {
        setFeedback(prev => prev.filter(f => f.id !== id));
        if (selectedFeedback?.id === id) setSelectedFeedback(null);
    }
  };

  const handleResolve = (id: number) => {
    setFeedback(prev => prev.map(f => f.id === id ? { ...f, status: 'Resolved' } : f));
    if (selectedFeedback) setSelectedFeedback(prev => prev ? { ...prev, status: 'Resolved' } : null);
  };

  const handleOpen = (item: Feedback) => {
      // Mark as read if unread
      if (item.status === 'Unread') {
          setFeedback(prev => prev.map(f => f.id === item.id ? { ...f, status: 'Read' } : f));
          setSelectedFeedback({ ...item, status: 'Read' });
      } else {
          setSelectedFeedback(item);
      }
  };

  // Helper for Badges
  const getTypeBadge = (type: string) => {
      switch(type) {
          case 'Complaint': return { icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-500/10' };
          case 'Suggestion': return { icon: HelpCircle, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-500/10' };
          case 'Appreciation': return { icon: ThumbsUp, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-500/10' };
          default: return { icon: MessageSquare, color: 'text-slate-500', bg: 'bg-slate-50 dark:bg-white/5' };
      }
  };

  return (
    <div className="space-y-6 h-[calc(100vh-140px)] flex flex-col">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
             <MessageSquare className="text-ios-blue" size={32} /> Help Desk
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Inbox for complaints, suggestions, and feedback.</p>
        </div>
        
        {/* Type Filter */}
        <div className="flex bg-white dark:bg-[#1C1C1E] p-1.5 rounded-xl border border-slate-100 dark:border-white/5 shadow-sm overflow-x-auto max-w-full">
           {['All', 'Complaint', 'Suggestion', 'Appreciation'].map(type => (
               <button 
                 key={type}
                 onClick={() => setFilterType(type as any)}
                 className={`px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${filterType === type ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'}`}
               >
                 {type}
               </button>
           ))}
        </div>
      </div>

      {/* Inbox List */}
      <div className="flex-1 bg-white dark:bg-[#1C1C1E] rounded-[2rem] border border-slate-100 dark:border-white/5 shadow-sm overflow-hidden flex flex-col relative">
         <div className="overflow-y-auto flex-1 p-2">
            {filteredFeedback.length > 0 ? (
                <div className="space-y-2">
                    {filteredFeedback.map((item) => {
                        const Badge = getTypeBadge(item.type);
                        return (
                            <motion.div 
                                key={item.id}
                                layout
                                onClick={() => handleOpen(item)}
                                className={`
                                    p-4 rounded-2xl cursor-pointer border transition-all flex items-start gap-4 group
                                    ${item.status === 'Unread' ? 'bg-blue-50/50 dark:bg-blue-500/5 border-blue-100 dark:border-blue-500/20' : 'bg-transparent border-transparent hover:bg-slate-50 dark:hover:bg-white/5'}
                                    ${selectedFeedback?.id === item.id ? 'ring-2 ring-ios-blue ring-inset' : ''}
                                `}
                            >
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${Badge.bg} ${Badge.color}`}>
                                    <Badge.icon size={20} />
                                </div>
                                
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start mb-1">
                                        <div>
                                            <h4 className={`text-sm font-bold ${item.status === 'Unread' ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}>
                                                {item.studentName}
                                                {item.status === 'Unread' && <span className="ml-2 inline-block w-2 h-2 rounded-full bg-blue-500"></span>}
                                            </h4>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">Class {item.class}</p>
                                        </div>
                                        <span className="text-xs text-slate-400 whitespace-nowrap ml-2">{item.date}</span>
                                    </div>
                                    <p className={`text-sm line-clamp-2 ${item.status === 'Unread' ? 'text-slate-800 dark:text-slate-200 font-medium' : 'text-slate-500 dark:text-slate-400'}`}>
                                        {item.message}
                                    </p>
                                </div>

                                <div className="self-center hidden sm:flex flex-col items-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button 
                                        onClick={(e) => handleDelete(item.id, e)}
                                        className="p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-500/20 text-slate-400 hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-400">
                    <Inbox size={48} className="mb-4 opacity-50" />
                    <p>No messages found</p>
                </div>
            )}
         </div>
      </div>

      {/* Message Detail Modal */}
      <AnimatePresence>
         {selectedFeedback && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
               <motion.div 
                 initial={{ opacity: 0 }} 
                 animate={{ opacity: 1 }} 
                 exit={{ opacity: 0 }}
                 onClick={() => setSelectedFeedback(null)}
                 className="absolute inset-0 bg-black/60 backdrop-blur-sm"
               />
               <motion.div 
                 layoutId={`feedback-${selectedFeedback.id}`}
                 initial={{ scale: 0.9, opacity: 0 }}
                 animate={{ scale: 1, opacity: 1 }}
                 exit={{ scale: 0.9, opacity: 0 }}
                 className="relative bg-white/90 dark:bg-[#1C1C1E]/90 backdrop-blur-xl w-full max-w-2xl rounded-[2.5rem] shadow-2xl border border-white/20 overflow-hidden flex flex-col max-h-[90vh]"
               >
                  {/* Modal Header */}
                  <div className="p-8 pb-6 border-b border-slate-200 dark:border-white/10 flex justify-between items-start">
                     <div>
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider mb-3 ${getTypeBadge(selectedFeedback.type).bg} ${getTypeBadge(selectedFeedback.type).color}`}>
                           {React.createElement(getTypeBadge(selectedFeedback.type).icon, { size: 14 })}
                           {selectedFeedback.type}
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Message Detail</h2>
                        <span className="text-sm text-slate-500 flex items-center gap-1">
                           <Clock size={14} /> Received on {selectedFeedback.date}
                        </span>
                     </div>
                     <button 
                        onClick={() => setSelectedFeedback(null)}
                        className="p-2 rounded-full bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 transition-colors"
                     >
                        <X size={24} className="text-slate-600 dark:text-slate-300" />
                     </button>
                  </div>

                  {/* Modal Body */}
                  <div className="p-8 overflow-y-auto space-y-8">
                     
                     {/* The Message */}
                     <div className="bg-slate-50 dark:bg-black/20 p-6 rounded-2xl border border-slate-100 dark:border-white/5">
                        <p className="text-slate-800 dark:text-slate-200 text-lg leading-relaxed whitespace-pre-wrap">
                           {selectedFeedback.message}
                        </p>
                     </div>

                     {/* Sender Profile */}
                     <div className="flex items-center gap-4 p-4 rounded-2xl border border-slate-100 dark:border-white/10">
                        <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-white/10 flex items-center justify-center text-slate-500">
                           <User size={24} />
                        </div>
                        <div>
                           <p className="text-sm text-slate-400 font-bold uppercase tracking-wider">Sent By</p>
                           <p className="font-bold text-slate-900 dark:text-white text-lg">{selectedFeedback.studentName}</p>
                           <p className="text-sm text-slate-500">Class {selectedFeedback.class} • ID: {selectedFeedback.studentId.split('/').pop()}</p>
                        </div>
                     </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="p-6 bg-slate-50 dark:bg-white/5 border-t border-slate-200 dark:border-white/10 flex flex-wrap gap-3 justify-end">
                     <button 
                        onClick={() => handleDelete(selectedFeedback.id)}
                        className="px-5 py-3 rounded-xl font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-2 mr-auto"
                     >
                        <Trash2 size={18} /> Delete
                     </button>

                     <a 
                        href={`tel:${selectedFeedback.mobile}`}
                        className="px-6 py-3 rounded-xl font-bold bg-white dark:bg-[#2C2C2E] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white shadow-sm hover:bg-slate-50 dark:hover:bg-white/10 transition-colors flex items-center gap-2"
                     >
                        <Phone size={18} /> Call Parent
                     </a>

                     {selectedFeedback.type === 'Complaint' && selectedFeedback.status !== 'Resolved' && (
                        <button 
                           onClick={() => handleResolve(selectedFeedback.id)}
                           className="px-6 py-3 rounded-xl font-bold bg-green-500 text-white shadow-lg hover:bg-green-600 transition-all flex items-center gap-2"
                        >
                           <CheckCircle2 size={18} /> Mark as Resolved
                        </button>
                     )}
                     
                     {selectedFeedback.status === 'Resolved' && (
                        <div className="px-6 py-3 rounded-xl font-bold bg-green-100 text-green-700 flex items-center gap-2 cursor-default">
                           <CheckCircle2 size={18} /> Resolved
                        </div>
                     )}
                  </div>
               </motion.div>
            </div>
         )}
      </AnimatePresence>
    </div>
  );
};
