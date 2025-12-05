
import React, { useContext, useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, Plus, Save, Trash2, X, Trophy, Calendar, 
  AlertTriangle, UploadCloud, Eye, EyeOff, Edit3, 
  FileSpreadsheet, Download, Check
} from 'lucide-react';
import { SchoolContext } from '../../App';
import { Notice } from '../../types';
import Papa from 'papaparse';

const emptyNotice: Omit<Notice, 'id' | 'icon' | 'color' | 'bg'> = {
  title: '',
  content: '',
  date: new Date().toISOString().split('T')[0],
  category: 'General',
  isPublished: true,
};

const categoryMap = {
  Academic: { color: 'text-blue-500', bg: 'bg-blue-500/10' },
  Event: { color: 'text-orange-500', bg: 'bg-orange-500/10' },
  Holiday: { color: 'text-purple-500', bg: 'bg-purple-500/10' },
  General: { color: 'text-red-500', bg: 'bg-red-500/10' },
  Exam: { color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
};

export const AdminCirculars: React.FC = () => {
  const { notices, setNotices } = useContext(SchoolContext);
  const [showModal, setShowModal] = useState(false);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Group notices by month (Format: "October 2025")
  const groupedNotices = useMemo(() => {
    const groups: Record<string, Notice[]> = {};
    // Sort by date descending
    const sorted = [...notices].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    sorted.forEach(notice => {
      const date = new Date(notice.date);
      const monthYear = date.toLocaleString('default', { month: 'long', year: 'numeric' });
      if (!groups[monthYear]) groups[monthYear] = [];
      groups[monthYear].push(notice);
    });
    return groups;
  }, [notices]);

  const handleOpenModal = (notice: Notice | null, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setEditingNotice(notice);
    setShowModal(true);
  };

  const handleSaveNotice = (noticeData: any) => {
    const categoryInfo = categoryMap[noticeData.category as keyof typeof categoryMap];
    const finalNotice = { ...noticeData, ...categoryInfo };

    if (editingNotice) {
      setNotices(notices.map(n => n.id === finalNotice.id ? finalNotice : n));
    } else {
      setNotices([...notices, { ...finalNotice, id: Date.now() }]);
    }
    setShowModal(false);
  };

  const handleDelete = (id: number, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (window.confirm("Are you sure you want to delete this notice?")) {
      setNotices(notices.filter(n => n.id !== id));
    }
  };

  const togglePublish = (id: number, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setNotices(notices.map(n => n.id === id ? { ...n, isPublished: !n.isPublished } : n));
  };

  // CSV Import Logic
  const handleCSVImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const newNotices: Notice[] = results.data.map((row: any) => {
          // Robust key matching (lowercase check)
          const keys = Object.keys(row);
          const getKey = (k: string) => keys.find(key => key.toLowerCase() === k.toLowerCase());
          
          const type = row[getKey('type') || ''] || 'General';
          const title = row[getKey('title') || ''] || 'Untitled';
          const date = row[getKey('date') || ''] || new Date().toISOString().split('T')[0];
          const description = row[getKey('description') || ''] || '';

          // Map Type to Category Key (Capitalize first letter)
          const catKey = type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
          const validCategory = Object.keys(categoryMap).includes(catKey) ? catKey : 'General';
          const catInfo = categoryMap[validCategory as keyof typeof categoryMap];

          return {
            id: Date.now() + Math.random(),
            title: title,
            date: date,
            category: validCategory,
            content: description,
            isPublished: true,
            ...catInfo
          } as Notice;
        });
        
        // Filter out bad data
        const validNotices = newNotices.filter(n => n.title && n.date);
        setNotices(prev => [...prev, ...validNotices]);
        alert(`Imported ${validNotices.length} events successfully.`);
      }
    });
    
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const downloadTemplate = () => {
    const csvContent = "date,title,type,description\n2025-04-07,New Session Begins,Event,Start of the 2025-26 Academic Year";
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'calendar_template.csv';
    a.click();
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Yearly Planner</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage Circulars, Holidays, and Events.</p>
        </div>
        
        <div className="flex gap-2">
           <input type="file" accept=".csv" ref={fileInputRef} className="hidden" onChange={handleCSVImport} />
           <button onClick={() => fileInputRef.current?.click()} className="bg-white dark:bg-[#1C1C1E] border border-slate-200 dark:border-white/10 text-slate-700 dark:text-white px-4 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors text-sm">
             <UploadCloud size={18} /> Bulk Import
           </button>
           <button onClick={downloadTemplate} className="bg-white dark:bg-[#1C1C1E] border border-slate-200 dark:border-white/10 text-slate-700 dark:text-white px-4 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors text-sm">
             <Download size={18} /> Template
           </button>
           <button onClick={(e) => handleOpenModal(null, e)} className="bg-ios-blue text-white px-5 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-ios-blue/20 active:scale-95 transition-transform text-sm">
             <Plus size={18} /> Add Event
           </button>
        </div>
      </div>

      {Object.keys(groupedNotices).length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-[#1C1C1E] rounded-[2rem] border border-dashed border-slate-200 dark:border-white/10">
           <Calendar size={48} className="mx-auto text-slate-300 mb-4" />
           <p className="text-slate-500 font-medium">No events found.</p>
           <p className="text-slate-400 text-sm mt-1">Import a CSV or add an event manually.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedNotices).map(([month, items]: [string, Notice[]]) => (
            <div key={month}>
               <h2 className="text-lg font-bold text-slate-500 uppercase tracking-widest mb-4 ml-2 sticky top-0 bg-ios-bg dark:bg-black py-2 z-10">{month}</h2>
               <div className="grid grid-cols-1 gap-3">
                  {items.map(notice => (
                    <motion.div 
                      key={notice.id}
                      layout
                      onClick={() => handleOpenModal(notice)}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`bg-white dark:bg-[#1C1C1E] p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-white/5 flex flex-col md:flex-row items-start md:items-center gap-4 cursor-pointer hover:border-ios-blue/30 transition-colors ${!notice.isPublished ? 'opacity-60 grayscale' : ''}`}
                    >
                       {/* Date Badge */}
                       <div className="flex flex-col items-center justify-center bg-slate-100 dark:bg-white/10 w-16 h-16 rounded-xl flex-shrink-0">
                          <span className="text-xs font-bold text-slate-500 uppercase">{new Date(notice.date).toLocaleString('default', { month: 'short' })}</span>
                          <span className="text-2xl font-bold text-slate-900 dark:text-white">{new Date(notice.date).getDate()}</span>
                       </div>

                       {/* Content */}
                       <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                             <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${categoryMap[notice.category as keyof typeof categoryMap]?.bg || 'bg-slate-100'} ${categoryMap[notice.category as keyof typeof categoryMap]?.color || 'text-slate-500'}`}>
                                {notice.category}
                             </span>
                             {!notice.isPublished && <span className="text-[10px] font-bold bg-slate-200 text-slate-600 px-2 py-0.5 rounded-md">DRAFT</span>}
                          </div>
                          <h3 className="font-bold text-slate-900 dark:text-white truncate">{notice.title}</h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">{notice.content}</p>
                       </div>

                       {/* Actions */}
                       <div className="flex items-center gap-2 self-end md:self-center">
                          <button 
                            onClick={(e) => togglePublish(notice.id, e)}
                            className={`p-2 rounded-full transition-colors ${notice.isPublished ? 'bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-400' : 'bg-slate-100 text-slate-400 dark:bg-white/10'}`}
                            title={notice.isPublished ? "Published" : "Hidden"}
                            type="button"
                          >
                             {notice.isPublished ? <Eye size={18} /> : <EyeOff size={18} />}
                          </button>
                          <button onClick={(e) => handleOpenModal(notice, e)} className="p-2 rounded-full hover:bg-blue-50 dark:hover:bg-blue-500/10 text-slate-400 hover:text-blue-500 transition-colors" type="button">
                             <Edit3 size={18} />
                          </button>
                          <button onClick={(e) => handleDelete(notice.id, e)} className="p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-500/10 text-slate-400 hover:text-red-500 transition-colors" type="button">
                             <Trash2 size={18} />
                          </button>
                       </div>
                    </motion.div>
                  ))}
               </div>
            </div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {showModal && <NoticeFormModal notice={editingNotice} onSave={handleSaveNotice} onClose={() => setShowModal(false)} />}
      </AnimatePresence>
    </div>
  );
};

export const NoticeFormModal: React.FC<{ notice: Notice | null, onSave: (notice: any) => void, onClose: () => void }> = ({ notice, onSave, onClose }) => {
  const [formData, setFormData] = useState<Partial<Notice>>(notice || emptyNotice);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-white dark:bg-[#1C1C1E] w-full max-w-lg rounded-[2rem] shadow-xl">
        <div className="p-6 border-b border-slate-100 dark:border-white/10 flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">{notice ? 'Edit Event' : 'New Event'}</h2>
          <button type="button" onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-1">
               <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Date</label>
               <input type="date" name="date" value={formData.date} onChange={handleChange} required className="w-full p-3 rounded-lg bg-slate-50 dark:bg-black/20 text-slate-900 dark:text-white border-none outline-none focus:ring-2 focus:ring-ios-blue/50" />
             </div>
             <div className="space-y-1">
               <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Type</label>
               <select name="category" value={formData.category} onChange={handleChange} className="w-full p-3 rounded-lg bg-slate-50 dark:bg-black/20 text-slate-900 dark:text-white border-none outline-none focus:ring-2 focus:ring-ios-blue/50">
                 {Object.keys(categoryMap).map(cat => <option key={cat} value={cat}>{cat}</option>)}
               </select>
             </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Title</label>
            <input type="text" name="title" value={formData.title || ''} onChange={handleChange} required className="w-full p-3 rounded-lg bg-slate-50 dark:bg-black/20 text-slate-900 dark:text-white border-none outline-none focus:ring-2 focus:ring-ios-blue/50" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Description</label>
            <textarea name="content" value={formData.content || ''} onChange={handleChange} rows={4} className="w-full p-3 rounded-lg bg-slate-50 dark:bg-black/20 text-slate-900 dark:text-white border-none outline-none focus:ring-2 focus:ring-ios-blue/50 resize-none" />
          </div>
          
          {/* Toggle Publish */}
          <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-white/5 rounded-xl cursor-pointer" onClick={() => setFormData(prev => ({...prev, isPublished: !prev.isPublished}))}>
             <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center ${formData.isPublished ? 'bg-ios-blue border-ios-blue' : 'border-slate-300'}`}>
                {formData.isPublished && <Check size={14} className="text-white" />}
             </div>
             <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Publish Immediately</span>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-6 py-3 rounded-xl font-bold bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300">Cancel</button>
            <button type="submit" className="px-6 py-3 rounded-xl font-bold bg-ios-blue text-white flex items-center gap-2 shadow-lg"><Save size={18} /> Save Event</button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
