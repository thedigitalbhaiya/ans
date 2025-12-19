
import React, { useState, useContext, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, ChevronDown, Check, Trash2, Award, Calendar, User, Camera, Upload, LayoutTemplate, Medal, Image as ImageIcon, Sparkles, Send, Star, Crown } from 'lucide-react';
import { AuthContext, SchoolContext } from '../../App';
import { Achievement } from '../../types';

export const AdminAchievements: React.FC = () => {
  const { allStudents } = useContext(AuthContext);
  const { achievements, addAchievement, deleteAchievement } = useContext(SchoolContext);

  // Form State
  const [selectedClass, setSelectedClass] = useState('X');
  const [selectedSection, setSelectedSection] = useState('A');
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'Gold' | 'Silver' | 'Bronze' | 'Special'>('Gold');
  const [type, setType] = useState<'Academic' | 'Sports' | 'Cultural' | 'Leadership' | 'Other'>('Academic');
  const [description, setDescription] = useState('');
  
  // Visual Mode
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filters
  const uniqueClasses = useMemo(() => Array.from(new Set(allStudents.map(s => s.class))), [allStudents]);
  const filteredStudents = useMemo(() => allStudents.filter(s => s.class === selectedClass && s.section === selectedSection), [allStudents, selectedClass, selectedSection]);
  const selectedStudent = useMemo(() => allStudents.find(s => s.admissionNo === selectedStudentId), [allStudents, selectedStudentId]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPhotoUrl(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent || !title) return;

    addAchievement({
      studentId: selectedStudent.admissionNo,
      studentName: selectedStudent.name,
      title,
      category,
      type,
      date: new Date().toISOString().split('T')[0],
      description,
      photoUrl: photoUrl,
      timestamp: new Date().toISOString(),
      cheers: 0
    });

    setTitle('');
    setDescription('');
    setPhotoUrl('');
    alert("Achievement published to Student Dashboard!");
  };

  const getTheme = (cat: string) => {
    switch(cat) {
      case 'Gold': return { 
          bg: 'bg-gradient-to-br from-[#FFF9C4] to-[#FFF176] dark:from-yellow-900/40 dark:to-yellow-600/20',
          accent: 'text-yellow-800 dark:text-yellow-400',
          icon: <Crown size={48} className="drop-shadow-md" fill="currentColor" />
      };
      case 'Silver': return { 
          bg: 'bg-gradient-to-br from-[#F5F5F5] to-[#E0E0E0] dark:from-slate-800/60 dark:to-slate-700/40',
          accent: 'text-slate-700 dark:text-slate-300',
          icon: <Medal size={48} className="drop-shadow-md" fill="currentColor" />
      };
      case 'Bronze': return { 
          bg: 'bg-gradient-to-br from-[#FFCCBC] to-[#FFAB91] dark:from-orange-900/40 dark:to-orange-700/20',
          accent: 'text-[#BF360C] dark:text-orange-400',
          icon: <Award size={48} className="drop-shadow-md" fill="currentColor" />
      };
      default: return { 
          bg: 'bg-gradient-to-br from-[#E1BEE7] to-[#CE93D8] dark:from-purple-900/40 dark:to-purple-700/20',
          accent: 'text-purple-900 dark:text-purple-300',
          icon: <Sparkles size={48} className="drop-shadow-md" fill="currentColor" />
      };
    }
  };

  return (
    <div className="space-y-8 pb-32">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        
        {/* Creation Hub */}
        <div className="space-y-6">
           <div className="bg-white dark:bg-[#1C1C1E] p-8 rounded-[2.5rem] shadow-apple border border-slate-100 dark:border-white/5 space-y-8">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                 <Trophy className="text-yellow-500" size={32} /> Award Assigner
              </h2>
              
              <div className="space-y-5">
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Class</label>
                       <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} className="w-full p-4 bg-slate-50 dark:bg-black/20 rounded-2xl outline-none font-bold text-slate-900 dark:text-white">
                          {uniqueClasses.map(c => <option key={c} value={c}>Class {c}</option>)}
                       </select>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Section</label>
                       <select value={selectedSection} onChange={(e) => setSelectedSection(e.target.value)} className="w-full p-4 bg-slate-50 dark:bg-black/20 rounded-2xl outline-none font-bold text-slate-900 dark:text-white">
                          {['A', 'B', 'C', 'D'].map(s => <option key={s} value={s}>Sec {s}</option>)}
                       </select>
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Recipient</label>
                    <select value={selectedStudentId} onChange={(e) => setSelectedStudentId(e.target.value)} className="w-full p-4 bg-slate-50 dark:bg-black/20 rounded-2xl outline-none font-bold text-slate-900 dark:text-white">
                        <option value="">Choose a student...</option>
                        {filteredStudents.map(s => <option key={s.admissionNo} value={s.admissionNo}>{s.name} (Roll {s.rollNo})</option>)}
                    </select>
                 </div>

                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Medal Tier</label>
                    <div className="grid grid-cols-4 gap-2">
                       {['Gold', 'Silver', 'Bronze', 'Special'].map(cat => (
                          <button key={cat} onClick={() => setCategory(cat as any)} className={`py-4 rounded-2xl text-[10px] font-black uppercase tracking-tighter transition-all ${category === cat ? 'bg-slate-900 dark:bg-white text-white dark:text-black shadow-xl scale-105' : 'bg-slate-50 dark:bg-white/5 text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10'}`}>
                             {cat}
                          </button>
                       ))}
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Achievement Title</label>
                    <input type="text" placeholder="e.g. 1st Place - Inter School Chess" className="w-full p-4 bg-slate-50 dark:bg-black/20 rounded-2xl outline-none font-bold text-slate-900 dark:text-white" value={title} onChange={e => setTitle(e.target.value)} />
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Award Citation (Optional)</label>
                    <textarea placeholder="Write a short description..." className="w-full p-4 bg-slate-50 dark:bg-black/20 rounded-2xl outline-none font-bold text-slate-900 dark:text-white resize-none h-24" value={description} onChange={e => setDescription(e.target.value)} />
                 </div>

                 <button onClick={handleSubmit} disabled={!selectedStudent || !title} className="w-full py-5 bg-ios-blue text-white rounded-3xl font-black text-lg shadow-2xl shadow-blue-500/20 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-30">
                    <Send size={22} /> Unlock Achievement
                 </button>
              </div>
           </div>
        </div>

        {/* Live Preview Console */}
        <div className="space-y-6">
           <div className="bg-white dark:bg-[#1C1C1E] p-10 rounded-[3rem] shadow-apple border border-slate-100 dark:border-white/5 text-center flex flex-col items-center">
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-10">Real-time Visualization</p>
              
              <AnimatePresence mode="wait">
                <motion.div 
                  key={category}
                  initial={{ scale: 0.8, opacity: 0, rotateY: 90 }}
                  animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                  className={`w-72 h-96 rounded-[3rem] ${getTheme(category).bg} shadow-2xl flex flex-col items-center justify-center p-8 border border-white/20 relative overflow-hidden group`}
                >
                   {/* Reflective Overlay */}
                   <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-black/5 pointer-events-none"></div>
                   <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>

                   <div className={`${getTheme(category).accent} mb-6 drop-shadow-xl animate-bounce-slow`}>
                      {getTheme(category).icon}
                   </div>
                   
                   <h4 className="text-2xl font-black text-slate-900 leading-tight mb-3">
                      {title || "Award Title"}
                   </h4>
                   
                   <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${getTheme(category).accent} bg-white/20 backdrop-blur-sm`}>
                      {category} Medal
                   </span>
                   
                   <div className="mt-auto pt-6 border-t border-black/5 w-full">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{selectedStudent?.name || "Recipient Name"}</p>
                      <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">Azim National School</p>
                   </div>
                </motion.div>
              </AnimatePresence>
              
              <div className="mt-8 flex items-center gap-3 bg-slate-50 dark:bg-white/5 px-4 py-3 rounded-2xl">
                 <Sparkles className="text-yellow-500" size={16} />
                 <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">This award will appear in the student's Hall of Fame instantly.</p>
              </div>
           </div>

           {/* Quick History Log */}
           <div className="bg-white dark:bg-[#1C1C1E] p-6 rounded-[2.5rem] border border-slate-100 dark:border-white/5">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-5 ml-2">Recent Hall of Fame</h3>
              <div className="space-y-3">
                 {achievements.slice(0, 4).map(ach => (
                    <div key={ach.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-white/5 rounded-2xl group hover:bg-slate-100 dark:hover:bg-white/10 transition-colors">
                       <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${getTheme(ach.category).bg}`}>
                             <Award size={18} className={getTheme(ach.category).accent} />
                          </div>
                          <div>
                             <p className="text-sm font-black text-slate-900 dark:text-white">{ach.title}</p>
                             <p className="text-[11px] text-slate-500 font-medium">{ach.studentName} • Class {allStudents.find(s => s.admissionNo === ach.studentId)?.class}</p>
                          </div>
                       </div>
                       <button onClick={() => deleteAchievement(ach.id)} className="p-2 text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                    </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
