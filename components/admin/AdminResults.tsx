
import React, { useContext, useState, useMemo, useEffect, useRef } from 'react';
import { SchoolContext, AuthContext } from '../../App';
import { Search, Save, Cloud, Check, Filter, ChevronDown, FileSpreadsheet, AlertCircle, Eye, EyeOff, UploadCloud, Download, Settings, Plus, X, Trash2, Edit3, MoreHorizontal, Lock, BookOpen, GraduationCap, Calculator, Loader2, Copy, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExamResult, Student } from '../../types';
import Papa from 'papaparse';

// Initial Defaults (can be overridden by admin)
const DEFAULT_EXAMS = ['PT1', 'Half Yearly', 'PT2', 'Annual'];
const DEFAULT_MAX_MARKS = 100;

const getSubjectsForClass = (className: string): string[] => {
  const cls = className.toUpperCase();
  if (['NURSERY', 'LKG', 'UKG'].includes(cls)) return ['English', 'Hindi', 'Maths', 'EVS', 'GK', 'Art'];
  if (['I', 'II'].includes(cls)) return ['English', 'Hindi', 'Maths', 'EVS', 'GK', 'Computers', 'Art'];
  if (['III', 'IV', 'V'].includes(cls)) return ['English', 'Hindi', 'Maths', 'EVS', 'Computers', 'GK', 'Art'];
  if (['VI', 'VII', 'VIII'].includes(cls)) return ['English', 'Hindi', 'Maths', 'Science', 'SST', 'Computers'];
  if (['IX', 'X'].includes(cls)) return ['English', 'Hindi/Urdu', 'Maths', 'Science', 'SST', 'Computers'];
  return ['English', 'Hindi', 'Maths', 'Science', 'SST'];
};

export const AdminResults: React.FC = () => {
  const { allStudents, currentAdmin } = useContext(AuthContext);
  const { examResults, setExamResults, currentSession, setCurrentSession } = useContext(SchoolContext);
  
  // --- View State ---
  const isTeacher = currentAdmin?.role === 'Teacher';
  const teacherClass = currentAdmin?.assignedClass || 'X';
  const teacherSection = currentAdmin?.assignedSection || 'A';

  const [selectedClass, setSelectedClass] = useState(isTeacher ? teacherClass : 'X');
  const [selectedSection, setSelectedSection] = useState(isTeacher ? teacherSection : 'A');
  const [selectedExam, setSelectedExam] = useState(DEFAULT_EXAMS[1]); // Default to Half Yearly

  // --- Configuration State ---
  const [availableExams, setAvailableExams] = useState<string[]>(DEFAULT_EXAMS);
  const [subjects, setSubjects] = useState<string[]>([]);
  // Maps ExamName -> SubjectName -> MaxMarks. If SubjectName is missing, use 'default' key.
  const [examConfigs, setExamConfigs] = useState<Record<string, Record<string, number>>>({
     'PT1': { 'default': 40 },
     'Half Yearly': { 'default': 80 },
     'PT2': { 'default': 40 },
     'Annual': { 'default': 100 }
  });
  
  // --- UI State ---
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [gridData, setGridData] = useState<Record<string, Record<string, string>>>({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Derived Data for Dropdowns
  const uniqueClasses = useMemo(() => Array.from(new Set(allStudents.map(s => s.class))), [allStudents]);
  const uniqueSections = useMemo(() => Array.from(new Set(allStudents.map(s => s.section))), [allStudents]);

  // --- Effects ---

  // 1. Sync Teacher Lock
  useEffect(() => {
    if (isTeacher) { setSelectedClass(teacherClass); setSelectedSection(teacherSection); }
  }, [isTeacher, teacherClass, teacherSection]);

  // 2. Load Subjects on Class Change
  useEffect(() => {
    // Only set default if empty (first load for this class context)
    if (subjects.length === 0) {
       setSubjects(getSubjectsForClass(selectedClass));
    }
  }, [selectedClass]);

  // 3. Load Marks Grid
  const filteredStudents = useMemo(() => 
    allStudents.filter(s => s.class === selectedClass && s.section === selectedSection).sort((a, b) => Number(a.rollNo) - Number(b.rollNo)), 
  [allStudents, selectedClass, selectedSection]);

  useEffect(() => {
    const newGrid: Record<string, Record<string, string>> = {};
    filteredStudents.forEach(student => {
      const studentSessionData = examResults[student.admissionNo]?.[currentSession] || {};
      const examData = studentSessionData[selectedExam] || [];
      const studentMarks: Record<string, string> = {};
      subjects.forEach(sub => {
        const found = examData.find(r => r.name === sub);
        studentMarks[sub] = found ? String(found.score) : '';
      });
      newGrid[student.admissionNo] = studentMarks;
    });
    setGridData(newGrid);
    setHasUnsavedChanges(false);
    setSaveSuccess(false);
  }, [selectedClass, selectedSection, selectedExam, currentSession, filteredStudents, examResults, subjects]);

  // --- Helpers ---
  const getMaxMarks = (exam: string, subject: string) => {
     const config = examConfigs[exam];
     if (!config) return 100;
     return config[subject] || config['default'] || 100;
  };

  // --- Handlers ---

  const handleCellChange = (studentId: string, subject: string, value: string) => {
    // Validation
    const currentMax = getMaxMarks(selectedExam, subject);
    const numVal = parseFloat(value);
    
    if (value !== '') {
        if (isNaN(numVal) || numVal < 0) return; // Invalid number
        if (numVal > currentMax) {
            alert(`Marks cannot exceed ${currentMax} for ${subject} in ${selectedExam}`);
            return;
        }
    }
    
    setGridData(prev => ({ ...prev, [studentId]: { ...prev[studentId], [subject]: value } }));
    setHasUnsavedChanges(true);
    setSaveSuccess(false);
  };

  const handleSave = () => {
    setIsSaving(true);
    
    // Simulate network delay for effect
    setTimeout(() => {
        setExamResults(prevGlobal => {
          const newGlobal = { ...prevGlobal };
          filteredStudents.forEach(student => {
            const studentId = student.admissionNo;
            const marks = gridData[studentId] || {};
            
            const resultsArray: ExamResult[] = subjects.map(sub => {
              const score = Number(marks[sub]) || 0;
              const currentMax = getMaxMarks(selectedExam, sub);
              return { 
                  name: sub, 
                  score: score, 
                  maxScore: currentMax, 
                  grade: getGrade(score, currentMax), 
                  color: getSubjectColor(sub) 
              };
            });

            if (!newGlobal[studentId]) newGlobal[studentId] = {};
            if (!newGlobal[studentId][currentSession]) newGlobal[studentId][currentSession] = {};
            newGlobal[studentId][currentSession][selectedExam] = resultsArray;
          });
          return newGlobal;
        });
        
        setIsSaving(false);
        setHasUnsavedChanges(false);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
    }, 800);
  };

  // CSV Import
  const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const importedData: Record<string, Record<string, string>> = { ...gridData };
        let importCount = 0;
        results.data.forEach((row: any) => {
          const admNo = row.admissionNo || row.ID || row.AdmissionNo || row.id;
          if (admNo && importedData[admNo]) {
             importCount++;
             subjects.forEach(sub => {
                const rowKey = Object.keys(row).find(k => k.toLowerCase() === sub.toLowerCase());
                if (rowKey && row[rowKey] !== undefined) {
                    const val = row[rowKey];
                    if (val !== null && val !== '') {
                        importedData[admNo][sub] = val;
                    }
                }
             });
          }
        });
        setGridData(importedData);
        setHasUnsavedChanges(true);
        alert(`Successfully mapped marks for ${importCount} students.`);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    });
  };

  const handleDownloadTemplate = () => {
    const header = ['admissionNo', 'Name', ...subjects];
    const rows = filteredStudents.map(s => [s.admissionNo, s.name, ...subjects.map(() => '')]);
    const csvContent = [header.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `marks_template_${selectedClass}_${selectedSection}_${selectedExam}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6 pb-32 md:pb-24 relative min-h-screen">
      
      {/* Header & Quick Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
         <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
               Marks Manager 
               {hasUnsavedChanges && <span className="text-xs bg-orange-500 text-white px-2 py-1 rounded-full animate-pulse">Unsaved</span>}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Manage exam results for Class {selectedClass}-{selectedSection}</p>
         </div>
         
         <div className="flex gap-2 w-full md:w-auto">
            <button 
               onClick={() => setShowConfigModal(true)} 
               className="bg-slate-900 dark:bg-white text-white dark:text-black px-5 py-3 rounded-xl font-bold shadow-lg shadow-slate-900/20 active:scale-95 transition-transform text-sm flex items-center gap-2"
            >
               <Settings size={18} /> Configuration
            </button>
         </div>
      </div>

      {/* Control Bar */}
      <div className="bg-white dark:bg-[#1C1C1E] p-4 rounded-[2rem] shadow-sm border border-slate-100 dark:border-white/5 flex flex-col xl:flex-row gap-4 items-center">
         <div className="flex flex-wrap gap-3 w-full xl:w-auto">
            <div className="relative group">
               <select value={currentSession} onChange={(e) => setCurrentSession(e.target.value)} className="appearance-none pl-4 pr-10 py-3 bg-slate-50 dark:bg-black/20 rounded-xl font-bold text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-ios-blue/50 cursor-pointer">
                  <option>2024-25</option><option>2025-26</option><option>2026-27</option>
               </select>
               <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>

            {isTeacher ? (
               <div className="flex items-center gap-2 px-4 py-3 bg-blue-50 dark:bg-blue-500/10 rounded-xl text-blue-700 dark:text-blue-300 font-bold border border-blue-100 dark:border-blue-500/20 text-sm">
                  <Lock size={14} /> <span>{teacherClass}-{teacherSection}</span>
               </div>
            ) : (
               <>
                  <div className="relative">
                     <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} className="appearance-none pl-4 pr-10 py-3 bg-slate-50 dark:bg-black/20 rounded-xl font-bold text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-ios-blue/50 cursor-pointer min-w-[100px]">
                        {uniqueClasses.map(c => <option key={c} value={c}>Class {c}</option>)}
                     </select>
                     <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                  <div className="relative">
                     <select value={selectedSection} onChange={(e) => setSelectedSection(e.target.value)} className="appearance-none pl-4 pr-10 py-3 bg-slate-50 dark:bg-black/20 rounded-xl font-bold text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-ios-blue/50 cursor-pointer min-w-[80px]">
                        {uniqueSections.map(s => <option key={s} value={s}>Sec {s}</option>)}
                     </select>
                     <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
               </>
            )}
         </div>

         <div className="w-[1px] h-10 bg-slate-100 dark:bg-white/10 hidden xl:block"></div>

         <div className="flex items-center gap-2 w-full xl:w-auto overflow-x-auto no-scrollbar pb-2 xl:pb-0">
            {availableExams.map(exam => (
               <button
                  key={exam}
                  onClick={() => setSelectedExam(exam)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
                     selectedExam === exam 
                     ? 'bg-ios-blue text-white shadow-md' 
                     : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-white/5'
                  }`}
               >
                  {exam}
               </button>
            ))}
         </div>

         <div className="flex-1"></div>

         <div className="flex gap-2 w-full xl:w-auto">
            <input type="file" accept=".csv" ref={fileInputRef} className="hidden" onChange={handleImportCSV} />
            <button onClick={() => fileInputRef.current?.click()} className="flex-1 xl:flex-none px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 font-bold text-sm flex items-center justify-center gap-2 transition-colors">
               <UploadCloud size={16} /> Import
            </button>
            <button onClick={handleDownloadTemplate} className="flex-1 xl:flex-none px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 font-bold text-sm flex items-center justify-center gap-2 transition-colors">
               <Download size={16} /> Template
            </button>
         </div>
      </div>

      {/* Data Grid */}
      <div className="bg-white dark:bg-[#1C1C1E] rounded-[2rem] shadow-xl border border-slate-100 dark:border-white/5 overflow-hidden flex flex-col h-[60vh] relative z-0">
         <div className="overflow-auto flex-1 relative custom-scrollbar">
            <table className="w-full text-left border-collapse min-w-[1000px]">
               <thead className="bg-slate-50 dark:bg-[#252527] sticky top-0 z-20 shadow-sm">
                  <tr>
                     <th className="sticky left-0 z-30 bg-slate-50 dark:bg-[#252527] p-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider w-16 border-b border-r dark:border-white/10">Roll</th>
                     <th className="sticky left-16 z-30 bg-slate-50 dark:bg-[#252527] p-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider w-48 border-b border-r dark:border-white/10">Student Name</th>
                     {subjects.map(sub => (
                        <th key={sub} className="p-3 border-b border-r dark:border-white/10 min-w-[100px]">
                           <div className="flex flex-col items-center">
                              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider truncate max-w-[120px]" title={sub}>{sub}</span>
                              <span className="text-[9px] text-slate-400 font-medium">Max: {getMaxMarks(selectedExam, sub)}</span>
                           </div>
                        </th>
                     ))}
                     <th className="p-4 text-[10px] font-bold text-slate-900 dark:text-white uppercase tracking-wider text-center bg-blue-50/30 dark:bg-blue-900/10 border-b w-24">Total</th>
                     <th className="p-4 text-[10px] font-bold text-slate-900 dark:text-white uppercase tracking-wider text-center bg-blue-50/30 dark:bg-blue-900/10 border-b w-20">Percentage</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                  {filteredStudents.map((student) => {
                     const marks = gridData[student.admissionNo] || {};
                     const total = Object.values(marks).reduce<number>((sum, val) => sum + (Number(val) || 0), 0);
                     // Calculate total max marks for this student (sum of max marks for all subjects)
                     const maxTotal = subjects.reduce((sum, sub) => sum + getMaxMarks(selectedExam, sub), 0);
                     const percentage = maxTotal > 0 ? ((total / maxTotal) * 100).toFixed(1) : '0';

                     return (
                        <tr key={student.admissionNo} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group">
                           <td className="sticky left-0 z-10 bg-white dark:bg-[#1C1C1E] p-4 font-mono text-xs font-bold text-slate-500 border-b border-r dark:border-white/10 group-hover:bg-slate-50 dark:group-hover:bg-white/5">{student.rollNo}</td>
                           <td className="sticky left-16 z-10 bg-white dark:bg-[#1C1C1E] p-4 border-b border-r dark:border-white/10 group-hover:bg-slate-50 dark:group-hover:bg-white/5">
                              <div className="flex items-center gap-3">
                                 <div className="w-6 h-6 rounded-full bg-slate-100 overflow-hidden"><img src={student.avatar} className="w-full h-full object-cover" /></div>
                                 <span className="font-bold text-slate-900 dark:text-white text-xs truncate max-w-[120px]">{student.name}</span>
                              </div>
                           </td>
                           {subjects.map((sub) => (
                              <td key={sub} className="p-2 text-center border-r border-slate-100 dark:border-white/5">
                                 <input 
                                    type="number" 
                                    value={marks[sub] || ''} 
                                    placeholder="-" 
                                    onChange={(e) => handleCellChange(student.admissionNo, sub, e.target.value)} 
                                    className="w-full h-9 text-center font-bold bg-transparent rounded-lg outline-none focus:bg-ios-blue/10 focus:ring-2 focus:ring-inset focus:ring-ios-blue/50 text-sm text-slate-700 dark:text-slate-300 transition-all placeholder-slate-300" 
                                 />
                              </td>
                           ))}
                           <td className="p-4 text-center font-bold text-slate-900 dark:text-white bg-blue-50/20 dark:bg-blue-900/5 text-sm">
                              {total}
                           </td>
                           <td className="p-4 text-center font-bold text-slate-600 dark:text-slate-400 bg-blue-50/20 dark:bg-blue-900/5 text-xs">
                              {percentage}%
                           </td>
                        </tr>
                     );
                  })}
               </tbody>
            </table>
         </div>
      </div>

      {/* Publish Action Bar */}
      <motion.div 
         initial={{ y: 100 }} 
         animate={{ y: 0 }} 
         className="fixed bottom-24 lg:bottom-6 left-4 right-4 md:left-1/2 md:right-auto md:-translate-x-1/2 z-40 bg-slate-900/95 dark:bg-white/95 backdrop-blur-xl p-2 pl-6 pr-2 rounded-full shadow-2xl flex items-center justify-between gap-6 text-white dark:text-black border border-white/10 max-w-lg mx-auto"
      >
         <div className="flex items-center gap-4">
            <span className={`text-sm font-bold flex items-center gap-2 ${hasUnsavedChanges ? 'text-orange-400 animate-pulse' : saveSuccess ? 'text-green-400' : 'text-slate-400'}`}>
               {hasUnsavedChanges ? <AlertCircle size={18} /> : saveSuccess ? <Check size={18} /> : <Check size={18} />} 
               {hasUnsavedChanges ? 'Unsaved Changes' : saveSuccess ? 'All Saved!' : 'Ready'}
            </span>
         </div>
         
         <motion.button 
            whileTap={{ scale: 0.95 }}
            onClick={handleSave} 
            disabled={isSaving}
            className={`px-8 py-3 rounded-full font-bold shadow-lg transition-all text-sm flex items-center gap-2 min-w-[140px] justify-center ${saveSuccess ? 'bg-green-500 text-white' : 'bg-ios-blue text-white'}`}
         >
            {isSaving ? <Loader2 size={18} className="animate-spin" /> : saveSuccess ? <><Check size={18} /> Published</> : <><Save size={18} /> Publish Results</>}
         </motion.button>
      </motion.div>

      {/* Configuration Modal */}
      <AnimatePresence>
        {showConfigModal && (
           <ResultConfigModal 
              currentClass={selectedClass}
              subjects={subjects}
              onUpdateSubjects={setSubjects}
              exams={availableExams}
              onUpdateExams={setAvailableExams}
              examConfigs={examConfigs}
              onUpdateConfigs={setExamConfigs}
              onClose={() => setShowConfigModal(false)}
           />
        )}
      </AnimatePresence>
    </div>
  );
};

const getGrade = (score: number, max: number) => {
   if (max === 0) return 'F';
   const p = (score / max) * 100;
   if (p >= 90) return 'A1'; 
   if (p >= 80) return 'A2'; 
   if (p >= 70) return 'B1'; 
   if (p >= 60) return 'B2'; 
   if (p >= 50) return 'C1'; 
   if (p >= 33) return 'D'; 
   return 'F';
};

const getSubjectColor = (s: string) => { 
    const l = s.toLowerCase(); 
    if(l.includes('math')) return 'bg-blue-500'; 
    if(l.includes('sci') || l.includes('evs')) return 'bg-green-500'; 
    if(l.includes('eng') || l.includes('hindi')) return 'bg-orange-500';
    return 'bg-slate-500'; 
};

// --- CONFIGURATION MODAL ---
const ResultConfigModal: React.FC<{
    currentClass: string;
    subjects: string[];
    onUpdateSubjects: React.Dispatch<React.SetStateAction<string[]>>;
    exams: string[];
    onUpdateExams: React.Dispatch<React.SetStateAction<string[]>>;
    examConfigs: Record<string, Record<string, number>>;
    onUpdateConfigs: React.Dispatch<React.SetStateAction<Record<string, Record<string, number>>>>;
    onClose: () => void;
}> = ({ currentClass, subjects, onUpdateSubjects, exams, onUpdateExams, examConfigs, onUpdateConfigs, onClose }) => {
    
    const [activeTab, setActiveTab] = useState<'Subjects' | 'Exams' | 'Scoring' | 'Patterns'>('Subjects');
    const [newItem, setNewItem] = useState('');
    const [expandedExam, setExpandedExam] = useState<string | null>(null);

    // Pattern State
    const [patternParts, setPatternParts] = useState<{name: string, max: string}[]>([{ name: 'Written', max: '80' }, { name: 'Assignment', max: '20' }]);
    const [selectedPatternSubjects, setSelectedPatternSubjects] = useState<string[]>([]);

    const addItem = () => {
        if (!newItem.trim()) return;
        if (activeTab === 'Subjects') {
            if (!subjects.includes(newItem)) onUpdateSubjects(prev => [...prev, newItem]);
        } else if (activeTab === 'Exams') {
            if (!exams.includes(newItem)) {
                onUpdateExams(prev => [...prev, newItem]);
                // Init config for new exam
                onUpdateConfigs(prev => ({ ...prev, [newItem]: { 'default': 100 } })); 
            }
        }
        setNewItem('');
    };

    const removeItem = (item: string) => {
        if (activeTab === 'Subjects') onUpdateSubjects(prev => prev.filter(s => s !== item));
        if (activeTab === 'Exams') onUpdateExams(prev => prev.filter(e => e !== item));
    };

    const handleDefaultMaxMarkChange = (exam: string, val: string) => {
        onUpdateConfigs(prev => ({ 
            ...prev, 
            [exam]: { ...prev[exam], 'default': Number(val) } 
        }));
    };

    const handleSubjectMaxMarkChange = (exam: string, subject: string, val: string) => {
        onUpdateConfigs(prev => ({ 
            ...prev, 
            [exam]: { ...prev[exam], [subject]: Number(val) } 
        }));
    };

    // --- PATTERN LOGIC ---
    const addPatternPart = () => setPatternParts(prev => [...prev, { name: '', max: '' }]);
    const removePatternPart = (idx: number) => setPatternParts(prev => prev.filter((_, i) => i !== idx));
    const updatePatternPart = (idx: number, field: 'name' | 'max', val: string) => {
        setPatternParts(prev => prev.map((p, i) => i === idx ? { ...p, [field]: val } : p));
    };
    
    const togglePatternSubject = (sub: string) => {
        setSelectedPatternSubjects(prev => prev.includes(sub) ? prev.filter(s => s !== sub) : [...prev, sub]);
    };

    const applyPattern = () => {
        if (patternParts.some(p => !p.name || !p.max)) {
            alert("Please fill all pattern details.");
            return;
        }
        if (selectedPatternSubjects.length === 0) {
            alert("Select at least one subject to apply this pattern.");
            return;
        }

        // 1. Generate new subjects list
        const newSubjects = [...subjects];
        const removedSubjects: string[] = [];

        selectedPatternSubjects.forEach(baseSub => {
            // Remove base subject
            const index = newSubjects.indexOf(baseSub);
            if (index > -1) {
                newSubjects.splice(index, 1);
                removedSubjects.push(baseSub);
            }
            // Add new components
            patternParts.forEach(part => {
                const newName = `${baseSub} (${part.name})`;
                if (!newSubjects.includes(newName)) newSubjects.push(newName);
            });
        });

        // 2. Update Subjects
        onUpdateSubjects(newSubjects);

        // 3. Update Max Marks for ALL exams
        onUpdateConfigs(prev => {
            const newConfigs = { ...prev };
            exams.forEach(exam => {
                const examConfig = { ...newConfigs[exam] };
                
                selectedPatternSubjects.forEach(baseSub => {
                    patternParts.forEach(part => {
                        const newName = `${baseSub} (${part.name})`;
                        examConfig[newName] = Number(part.max);
                    });
                });
                newConfigs[exam] = examConfig;
            });
            return newConfigs;
        });

        alert("Pattern applied successfully! Subjects have been split.");
        setActiveTab('Scoring'); // Move to scoring tab to show result
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
            <motion.div 
                initial={{ scale: 0.9, opacity: 0 }} 
                animate={{ scale: 1, opacity: 1 }} 
                exit={{ scale: 0.9, opacity: 0 }} 
                className="bg-white dark:bg-[#1C1C1E] w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
                onClick={e => e.stopPropagation()}
            >
                <div className="p-6 pb-2 border-b border-slate-100 dark:border-white/5">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Configuration</h2>
                            <p className="text-sm text-slate-500">Settings for Class {currentClass}</p>
                        </div>
                        <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10"><X size={20} /></button>
                    </div>
                    
                    <div className="flex gap-2 p-1 bg-slate-50 dark:bg-white/5 rounded-xl overflow-x-auto no-scrollbar">
                        {['Subjects', 'Exams', 'Scoring', 'Patterns'].map(tab => (
                            <button 
                                key={tab} 
                                onClick={() => setActiveTab(tab as any)}
                                className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${activeTab === tab ? 'bg-white dark:bg-white/10 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500'}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
                    {activeTab === 'Scoring' ? (
                        <div className="space-y-4">
                            {exams.map(exam => {
                                const isExpanded = expandedExam === exam;
                                return (
                                <div key={exam} className="rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 overflow-hidden transition-all">
                                    <div 
                                        className="flex items-center justify-between p-4 cursor-pointer"
                                        onClick={() => setExpandedExam(isExpanded ? null : exam)}
                                    >
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-slate-700 dark:text-slate-300">{exam}</span>
                                            {isExpanded && <span className="text-xs text-slate-400">(Expanded)</span>}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-bold text-slate-400 uppercase">Default Max</span>
                                            <input 
                                                type="number" 
                                                value={examConfigs[exam]?.['default'] || 100} 
                                                onClick={(e) => e.stopPropagation()}
                                                onChange={(e) => handleDefaultMaxMarkChange(exam, e.target.value)}
                                                className="w-16 p-2 rounded-lg bg-white dark:bg-black/20 text-center font-bold outline-none focus:ring-2 focus:ring-ios-blue/50 text-sm"
                                            />
                                        </div>
                                    </div>
                                    
                                    {isExpanded && (
                                        <motion.div 
                                            initial={{ height: 0 }} 
                                            animate={{ height: 'auto' }} 
                                            className="px-4 pb-4 border-t border-slate-200 dark:border-white/10 bg-slate-100/50 dark:bg-black/10"
                                        >
                                            <p className="text-[10px] text-slate-500 uppercase tracking-widest py-3">Override Subject Marks</p>
                                            <div className="space-y-2">
                                                {subjects.map(sub => (
                                                    <div key={sub} className="flex justify-between items-center text-sm">
                                                        <span className="text-slate-600 dark:text-slate-400 truncate max-w-[200px]" title={sub}>{sub}</span>
                                                        <input 
                                                            type="number" 
                                                            value={examConfigs[exam]?.[sub] || examConfigs[exam]?.['default'] || 100}
                                                            onChange={(e) => handleSubjectMaxMarkChange(exam, sub, e.target.value)}
                                                            className="w-14 p-1.5 rounded bg-white dark:bg-white/10 text-center text-xs font-bold outline-none border border-slate-200 dark:border-white/10 focus:border-ios-blue"
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </div>
                            )})}
                        </div>
                    ) : activeTab === 'Patterns' ? (
                        <div className="space-y-6">
                            <div className="bg-blue-50 dark:bg-blue-500/10 p-4 rounded-xl text-xs text-blue-700 dark:text-blue-300 leading-relaxed border border-blue-100 dark:border-blue-500/20">
                                <strong>Subject Breakdown:</strong> Split specific subjects into components (e.g. Maths → Written + Assignment). This will create separate columns in the mark sheet.
                            </div>

                            <div className="space-y-3">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Step 1: Define Structure</label>
                                {patternParts.map((part, idx) => (
                                    <div key={idx} className="flex gap-2">
                                        <input 
                                            type="text" 
                                            placeholder="Component (e.g. Written)" 
                                            value={part.name}
                                            onChange={e => updatePatternPart(idx, 'name', e.target.value)}
                                            className="flex-1 p-2.5 rounded-lg bg-slate-50 dark:bg-black/20 text-sm font-bold outline-none border border-slate-200 dark:border-white/10 focus:border-ios-blue"
                                        />
                                        <input 
                                            type="number" 
                                            placeholder="Max" 
                                            value={part.max}
                                            onChange={e => updatePatternPart(idx, 'max', e.target.value)}
                                            className="w-20 p-2.5 rounded-lg bg-slate-50 dark:bg-black/20 text-sm font-bold text-center outline-none border border-slate-200 dark:border-white/10 focus:border-ios-blue"
                                        />
                                        {patternParts.length > 1 && (
                                            <button onClick={() => removePatternPart(idx)} className="p-2 text-slate-400 hover:text-red-500"><X size={16} /></button>
                                        )}
                                    </div>
                                ))}
                                <button onClick={addPatternPart} className="text-xs font-bold text-ios-blue flex items-center gap-1 hover:underline">
                                    <Plus size={12} /> Add Component
                                </button>
                            </div>

                            <div className="space-y-3">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Step 2: Apply to Subjects</label>
                                <div className="flex flex-wrap gap-2">
                                    {subjects.filter(s => !s.includes('(')).map(sub => (
                                        <button 
                                            key={sub} 
                                            onClick={() => togglePatternSubject(sub)}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                                                selectedPatternSubjects.includes(sub) 
                                                ? 'bg-ios-blue text-white border-ios-blue' 
                                                : 'bg-white dark:bg-white/5 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-white/10'
                                            }`}
                                        >
                                            {sub}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button onClick={applyPattern} className="w-full py-3 bg-slate-900 dark:bg-white text-white dark:text-black font-bold rounded-xl shadow-lg flex items-center justify-center gap-2">
                                <Layers size={16} /> Apply Pattern
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="flex gap-2">
                                <input 
                                    type="text" 
                                    placeholder={`Add new ${activeTab === 'Subjects' ? 'Subject' : 'Exam'}...`}
                                    value={newItem}
                                    onChange={e => setNewItem(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && addItem()}
                                    className="flex-1 p-3 bg-slate-50 dark:bg-black/20 rounded-xl outline-none focus:ring-2 focus:ring-ios-blue/50"
                                />
                                <button onClick={addItem} className="p-3 bg-ios-blue text-white rounded-xl shadow-lg"><Plus size={20} /></button>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {(activeTab === 'Subjects' ? subjects : exams).map(item => (
                                    <div key={item} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-100 dark:bg-white/10 text-sm font-bold text-slate-700 dark:text-slate-300 animate-fade-in">
                                        {item}
                                        <button onClick={() => removeItem(item)} className="text-slate-400 hover:text-red-500 transition-colors"><X size={14} /></button>
                                    </div>
                                ))}
                                {(activeTab === 'Subjects' ? subjects : exams).length === 0 && (
                                    <p className="text-slate-400 text-sm w-full text-center py-4">No items added yet.</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-6 border-t border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-white/5">
                    <button onClick={onClose} className="w-full py-3 bg-ios-blue text-white rounded-xl font-bold shadow-lg">Done</button>
                </div>
            </motion.div>
        </div>
    );
};
