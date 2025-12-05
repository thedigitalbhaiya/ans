
import React, { useContext, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, Plus, Trash2, Calendar, FileText, 
  ToggleLeft, Check, ChevronDown, Filter, AlertTriangle 
} from 'lucide-react';
import { SchoolContext } from '../../App';
import { Homework } from '../../types';

const CLASSES = ["Nursery", "LKG", "UKG", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];

export const AdminHomework: React.FC = () => {
  const { homework, addHomework, deleteHomework, settings, updateSettings } = useContext(SchoolContext);
  const [selectedClass, setSelectedClass] = useState("X");
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [formData, setFormData] = useState<Partial<Homework>>({
    subject: '',
    title: '',
    description: '',
    dueDate: ''
  });

  const filteredHomework = useMemo(() => {
    return homework
      .filter(h => h.targetClass === selectedClass)
      .sort((a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime());
  }, [homework, selectedClass]);

  const handleToggleModule = () => {
    updateSettings({ enableHomework: !settings.enableHomework });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.subject || !formData.title || !formData.dueDate) return;

    addHomework({
      targetClass: selectedClass,
      subject: formData.subject,
      title: formData.title,
      description: formData.description || '',
      dueDate: formData.dueDate,
    });
    
    setShowModal(false);
    setFormData({ subject: '', title: '', description: '', dueDate: '' });
  };

  const handleDelete = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this assignment?')) {
      deleteHomework(id);
    }
  };

  return (
    <div className="space-y-8 pb-20">
      
      {/* HEADER & CONTROLS */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
             <BookOpen className="text-ios-blue" size={32} /> Homework Manager
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Assign and manage tasks for each class.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
           {/* Master Switch */}
           <div 
              onClick={handleToggleModule}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border cursor-pointer transition-all ${settings.enableHomework ? 'bg-green-50 border-green-200 dark:bg-green-500/10 dark:border-green-500/20' : 'bg-red-50 border-red-200 dark:bg-red-500/10 dark:border-red-500/20'}`}
           >
              <div className={`w-10 h-6 rounded-full p-1 transition-colors ${settings.enableHomework ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-600'}`}>
                 <motion.div 
                   className="w-4 h-4 bg-white rounded-full shadow-md"
                   animate={{ x: settings.enableHomework ? 16 : 0 }}
                 />
              </div>
              <div>
                 <span className={`text-xs font-bold uppercase tracking-wider block ${settings.enableHomework ? 'text-green-700 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {settings.enableHomework ? 'Module Active' : 'Module Disabled'}
                 </span>
              </div>
           </div>

           {/* Class Selector */}
           <div className="relative">
              <select 
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="appearance-none w-full md:w-48 bg-white dark:bg-[#1C1C1E] border border-slate-200 dark:border-white/10 rounded-xl py-3 px-4 pr-10 text-slate-900 dark:text-white font-bold text-sm focus:ring-2 focus:ring-ios-blue/50 outline-none cursor-pointer shadow-sm"
              >
                 {CLASSES.map(c => <option key={c} value={c}>Class {c}</option>)}
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
           </div>

           <button 
             onClick={() => setShowModal(true)}
             className="bg-ios-blue text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-ios-blue/30 active:scale-95 transition-transform flex items-center justify-center gap-2"
           >
             <Plus size={18} /> New Assignment
           </button>
        </div>
      </div>

      {!settings.enableHomework && (
         <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 p-4 rounded-xl flex items-center gap-3 text-red-600 dark:text-red-400">
            <AlertTriangle size={20} />
            <span className="font-medium text-sm">Homework module is currently hidden from all students. Enable it to make assignments visible.</span>
         </motion.div>
      )}

      {/* LIST VIEW */}
      <div className="bg-white dark:bg-[#1C1C1E] rounded-[2rem] shadow-xl border border-slate-100 dark:border-white/5 overflow-hidden min-h-[400px]">
         {/* List Header */}
         <div className="grid grid-cols-[1fr_2fr_1fr_100px] gap-4 p-5 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5 text-xs font-bold text-slate-500 uppercase tracking-wider">
            <div>Subject</div>
            <div>Assignment Details</div>
            <div>Deadlines</div>
            <div className="text-right">Actions</div>
         </div>

         <div className="overflow-y-auto">
            <AnimatePresence mode="popLayout">
               {filteredHomework.length > 0 ? (
                  filteredHomework.map((item) => (
                     <motion.div 
                        key={item.id}
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="grid grid-cols-[1fr_2fr_1fr_100px] gap-4 p-5 border-b border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors items-center group"
                     >
                        <div>
                           <span className="inline-block px-3 py-1 rounded-lg bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wide border border-blue-100 dark:border-blue-500/20">
                              {item.subject}
                           </span>
                        </div>
                        
                        <div className="min-w-0">
                           <h3 className="font-bold text-slate-900 dark:text-white truncate">{item.title}</h3>
                           <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">{item.description}</p>
                        </div>

                        <div className="text-sm">
                           <div className="flex items-center gap-2 text-red-500 font-medium">
                              <Calendar size={14} /> Due: {item.dueDate}
                           </div>
                           <p className="text-[10px] text-slate-400 mt-1 ml-6">Posted: {item.postedDate}</p>
                        </div>

                        <div className="flex justify-end">
                           <button 
                              onClick={(e) => handleDelete(e, item.id)}
                              className="p-2 rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/20 transition-colors"
                           >
                              <Trash2 size={18} />
                           </button>
                        </div>
                     </motion.div>
                  ))
               ) : (
                  <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                     <div className="w-20 h-20 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-4">
                        <Filter size={32} className="opacity-50" />
                     </div>
                     <p className="font-medium">No homework assigned for Class {selectedClass}</p>
                  </div>
               )}
            </AnimatePresence>
         </div>
      </div>

      {/* CREATE MODAL */}
      <AnimatePresence>
         {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
               <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  exit={{ opacity: 0 }} 
                  onClick={() => setShowModal(false)}
                  className="absolute inset-0 bg-black/60 backdrop-blur-sm"
               />
               <motion.div 
                  initial={{ scale: 0.95, opacity: 0 }} 
                  animate={{ scale: 1, opacity: 1 }} 
                  exit={{ scale: 0.95, opacity: 0 }}
                  className="relative bg-white dark:bg-[#1C1C1E] w-full max-w-lg rounded-[2rem] shadow-2xl p-8"
               >
                  <div className="mb-6">
                     <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Assign Homework</h2>
                     <p className="text-slate-500 dark:text-slate-400 text-sm">Adding for <span className="font-bold text-ios-blue">Class {selectedClass}</span></p>
                  </div>

                  <form onSubmit={handleSave} className="space-y-4">
                     <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Subject</label>
                        <input 
                           type="text" 
                           placeholder="e.g. Mathematics" 
                           required
                           className="w-full p-3 bg-slate-50 dark:bg-black/20 rounded-xl outline-none focus:ring-2 focus:ring-ios-blue/50 text-slate-900 dark:text-white font-medium"
                           value={formData.subject}
                           onChange={e => setFormData({...formData, subject: e.target.value})}
                        />
                     </div>

                     <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Title</label>
                        <input 
                           type="text" 
                           placeholder="e.g. Algebra Worksheet 4.2" 
                           required
                           className="w-full p-3 bg-slate-50 dark:bg-black/20 rounded-xl outline-none focus:ring-2 focus:ring-ios-blue/50 text-slate-900 dark:text-white font-medium"
                           value={formData.title}
                           onChange={e => setFormData({...formData, title: e.target.value})}
                        />
                     </div>

                     <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Due Date</label>
                        <input 
                           type="date" 
                           required
                           min={new Date().toISOString().split('T')[0]}
                           className="w-full p-3 bg-slate-50 dark:bg-black/20 rounded-xl outline-none focus:ring-2 focus:ring-ios-blue/50 text-slate-900 dark:text-white font-medium"
                           value={formData.dueDate}
                           onChange={e => setFormData({...formData, dueDate: e.target.value})}
                        />
                     </div>

                     <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Instructions (Optional)</label>
                        <textarea 
                           rows={3}
                           placeholder="Detailed instructions for students..." 
                           className="w-full p-3 bg-slate-50 dark:bg-black/20 rounded-xl outline-none focus:ring-2 focus:ring-ios-blue/50 text-slate-900 dark:text-white font-medium resize-none"
                           value={formData.description}
                           onChange={e => setFormData({...formData, description: e.target.value})}
                        />
                     </div>

                     <div className="pt-4 flex gap-3">
                        <button 
                           type="button" 
                           onClick={() => setShowModal(false)}
                           className="flex-1 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
                        >
                           Cancel
                        </button>
                        <button 
                           type="submit"
                           className="flex-1 py-3 bg-ios-blue text-white rounded-xl font-bold shadow-lg active:scale-95 transition-transform"
                        >
                           Publish
                        </button>
                     </div>
                  </form>
               </motion.div>
            </div>
         )}
      </AnimatePresence>
    </div>
  );
};
