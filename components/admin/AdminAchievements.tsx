
import React, { useState, useContext, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Search, ChevronDown, Check, Trash2, Award, Calendar, User, Star } from 'lucide-react';
import { AuthContext, SchoolContext } from '../../App';
import { Achievement, Student } from '../../types';

export const AdminAchievements: React.FC = () => {
  const { allStudents } = useContext(AuthContext);
  const { achievements, addAchievement, deleteAchievement } = useContext(SchoolContext);

  // Selector State
  const [selectedClass, setSelectedClass] = useState('X');
  const [selectedSection, setSelectedSection] = useState('A');
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  
  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'Gold' | 'Silver' | 'Bronze' | 'Special'>('Gold');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');

  // Derived Data
  const uniqueClasses = useMemo(() => Array.from(new Set(allStudents.map(s => s.class))), [allStudents]);
  const uniqueSections = useMemo(() => Array.from(new Set(allStudents.map(s => s.section))), [allStudents]);

  const filteredStudents = useMemo(() => {
    return allStudents.filter(s => s.class === selectedClass && s.section === selectedSection);
  }, [allStudents, selectedClass, selectedSection]);

  const selectedStudent = useMemo(() => 
    allStudents.find(s => s.admissionNo === selectedStudentId), 
  [allStudents, selectedStudentId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent || !title) return;

    addAchievement({
      studentId: selectedStudent.admissionNo,
      studentName: selectedStudent.name,
      title,
      category,
      date,
      description
    });

    // Reset Form (keep student selected)
    setTitle('');
    setDescription('');
    setDate(new Date().toISOString().split('T')[0]);
    alert("Achievement Awarded Successfully!");
  };

  const getGradient = (cat: string) => {
    switch(cat) {
      case 'Gold': return 'from-yellow-400 to-amber-600 text-white';
      case 'Silver': return 'from-slate-300 to-slate-500 text-white';
      case 'Bronze': return 'from-orange-300 to-orange-600 text-white';
      case 'Special': return 'from-indigo-500 to-purple-600 text-white';
      default: return 'from-slate-700 to-slate-900 text-white';
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
           <Award size={32} className="text-yellow-500" /> Student Achievements
        </h1>
        <p className="text-slate-500 dark:text-slate-400">Recognize and reward student excellence.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: ASSIGN FORM */}
        <div className="lg:col-span-1 space-y-6">
           <div className="bg-white dark:bg-[#1C1C1E] p-6 rounded-[2rem] shadow-sm border border-slate-100 dark:border-white/5 space-y-6">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Assign Award</h2>
              
              {/* Student Selector */}
              <div className="space-y-4">
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                       <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Class</label>
                       <div className="relative mt-1">
                          <select 
                             value={selectedClass} 
                             onChange={(e) => { setSelectedClass(e.target.value); setSelectedStudentId(''); }}
                             className="w-full p-3 bg-slate-50 dark:bg-black/20 rounded-xl appearance-none outline-none font-bold text-slate-900 dark:text-white"
                          >
                             {uniqueClasses.map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
                       </div>
                    </div>
                    <div>
                       <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Section</label>
                       <div className="relative mt-1">
                          <select 
                             value={selectedSection} 
                             onChange={(e) => { setSelectedSection(e.target.value); setSelectedStudentId(''); }}
                             className="w-full p-3 bg-slate-50 dark:bg-black/20 rounded-xl appearance-none outline-none font-bold text-slate-900 dark:text-white"
                          >
                             {uniqueSections.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
                       </div>
                    </div>
                 </div>

                 <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Student</label>
                    <div className="relative mt-1">
                       <select 
                          value={selectedStudentId} 
                          onChange={(e) => setSelectedStudentId(e.target.value)}
                          className="w-full p-3 bg-slate-50 dark:bg-black/20 rounded-xl appearance-none outline-none font-medium text-slate-900 dark:text-white"
                       >
                          <option value="">Select Student</option>
                          {filteredStudents.map(s => <option key={s.admissionNo} value={s.admissionNo}>{s.name} ({s.rollNo})</option>)}
                       </select>
                       <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
                    </div>
                 </div>
              </div>

              {/* Award Details */}
              {selectedStudent && (
                 <motion.form 
                    initial={{ opacity: 0, height: 0 }} 
                    animate={{ opacity: 1, height: 'auto' }}
                    onSubmit={handleSubmit}
                    className="space-y-4 pt-4 border-t border-slate-100 dark:border-white/5"
                 >
                    <div>
                       <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Award Title</label>
                       <input 
                          type="text" 
                          required 
                          placeholder="e.g. 1st Place - Debate"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          className="w-full mt-1 p-3 bg-slate-50 dark:bg-black/20 rounded-xl outline-none focus:ring-2 focus:ring-ios-blue/50 text-slate-900 dark:text-white font-bold"
                       />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                       <div>
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Category</label>
                          <div className="relative mt-1">
                             <select 
                                value={category} 
                                onChange={(e) => setCategory(e.target.value as any)}
                                className="w-full p-3 bg-slate-50 dark:bg-black/20 rounded-xl appearance-none outline-none font-medium text-slate-900 dark:text-white"
                             >
                                <option value="Gold">Gold</option>
                                <option value="Silver">Silver</option>
                                <option value="Bronze">Bronze</option>
                                <option value="Special">Special</option>
                             </select>
                             <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
                          </div>
                       </div>
                       <div>
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Date</label>
                          <input 
                             type="date" 
                             required 
                             value={date}
                             onChange={(e) => setDate(e.target.value)}
                             className="w-full mt-1 p-3 bg-slate-50 dark:bg-black/20 rounded-xl outline-none text-slate-900 dark:text-white"
                          />
                       </div>
                    </div>

                    <div>
                       <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Description (Optional)</label>
                       <textarea 
                          rows={3} 
                          placeholder="Details about the achievement..."
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          className="w-full mt-1 p-3 bg-slate-50 dark:bg-black/20 rounded-xl outline-none focus:ring-2 focus:ring-ios-blue/50 text-slate-900 dark:text-white resize-none"
                       />
                    </div>

                    <button 
                       type="submit"
                       className="w-full py-4 bg-ios-blue text-white font-bold rounded-xl shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2"
                    >
                       <Award size={18} /> Assign Achievement
                    </button>
                 </motion.form>
              )}
           </div>
        </div>

        {/* RIGHT COLUMN: PREVIEW & LIST */}
        <div className="lg:col-span-2 space-y-8">
           
           {/* Live Preview Card */}
           {selectedStudent && (
              <div className="bg-white dark:bg-[#1C1C1E] p-6 rounded-[2rem] shadow-sm border border-slate-100 dark:border-white/5">
                 <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Live Preview</h2>
                 <div className={`relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br ${getGradient(category)} shadow-2xl`}>
                    <div className="absolute top-0 right-0 p-4 opacity-20">
                       <Trophy size={120} />
                    </div>
                    <div className="relative z-10 flex items-center gap-5">
                       <div className="w-16 h-16 rounded-full border-4 border-white/30 overflow-hidden bg-white/10 flex-shrink-0">
                          <img src={selectedStudent.avatar} className="w-full h-full object-cover" alt="" />
                       </div>
                       <div>
                          <div className="inline-block px-2 py-0.5 rounded-md bg-white/20 text-white text-[10px] font-bold uppercase tracking-wider mb-1 backdrop-blur-md">
                             {category} Award
                          </div>
                          <h3 className="text-2xl font-extrabold leading-tight">{title || 'Achievement Title'}</h3>
                          <p className="text-white/80 text-sm mt-1">{selectedStudent.name}</p>
                       </div>
                    </div>
                 </div>
              </div>
           )}

           {/* History List */}
           <div className="bg-white dark:bg-[#1C1C1E] rounded-[2rem] border border-slate-100 dark:border-white/5 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-white/5 flex justify-between items-center">
                 <h2 className="text-lg font-bold text-slate-900 dark:text-white">Award History</h2>
                 <span className="text-xs font-bold text-slate-500 bg-slate-200 dark:bg-white/10 px-2 py-1 rounded-md">Total: {achievements.length}</span>
              </div>
              
              <div className="max-h-[500px] overflow-y-auto p-4 space-y-3">
                 {achievements.length > 0 ? (
                    achievements.map((item) => (
                       <motion.div 
                          key={item.id}
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-white dark:bg-[#2C2C2E] p-4 rounded-2xl border border-slate-100 dark:border-white/5 flex items-center gap-4 group"
                       >
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${getGradient(item.category)} shadow-md flex-shrink-0`}>
                             <Trophy size={20} className="text-white" />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                             <div className="flex justify-between items-start">
                                <h4 className="font-bold text-slate-900 dark:text-white truncate">{item.title}</h4>
                                <span className="text-[10px] font-bold text-slate-400">{item.date}</span>
                             </div>
                             <p className="text-sm text-slate-600 dark:text-slate-300 truncate">Awarded to <span className="font-bold">{item.studentName}</span></p>
                             {item.description && <p className="text-xs text-slate-400 truncate mt-0.5">{item.description}</p>}
                          </div>

                          <button 
                             onClick={() => deleteAchievement(item.id)}
                             className="p-2 rounded-full bg-slate-100 dark:bg-white/10 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/20 transition-colors opacity-0 group-hover:opacity-100"
                          >
                             <Trash2 size={16} />
                          </button>
                       </motion.div>
                    ))
                 ) : (
                    <div className="py-12 text-center text-slate-400">
                       <Trophy size={48} className="mx-auto mb-3 opacity-20" />
                       <p>No achievements recorded yet.</p>
                    </div>
                 )}
              </div>
           </div>

        </div>
      </div>
    </div>
  );
};
