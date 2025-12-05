
import React, { useContext, useState, useMemo, useEffect, useRef } from 'react';
import { SchoolContext, AuthContext } from '../../App';
import { 
  Search, Save, Cloud, Check, Filter, ChevronDown, 
  FileSpreadsheet, AlertCircle, Eye, EyeOff, UploadCloud, Download,
  Settings, Plus, X, Trash2, Edit3, MoreHorizontal, Lock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExamResult, Student } from '../../types';
import Papa from 'papaparse';

const STANDARD_EXAMS = ['PT1', 'Half Yearly', 'PT2', 'Annual'];

// --- DYNAMIC SUBJECT DEFAULTS ---
const getSubjectsForClass = (className: string): string[] => {
  const cls = className.toUpperCase();
  
  if (['NURSERY', 'LKG', 'UKG'].includes(cls)) {
    return ['English', 'Hindi', 'Maths', 'EVS', 'GK', 'Art'];
  }
  if (['I', 'II'].includes(cls)) {
    return ['English', 'Hindi', 'Maths', 'EVS', 'GK', 'Computers', 'Art'];
  }
  if (['III', 'IV', 'V'].includes(cls)) {
    return ['English', 'Hindi', 'Maths', 'EVS', 'Computers', 'GK', 'Art'];
  }
  if (['VI', 'VII', 'VIII'].includes(cls)) {
    return ['English', 'Hindi', 'Maths', 'Science', 'SST', 'Computers'];
  }
  if (['IX', 'X'].includes(cls)) {
    return ['English', 'Hindi/Urdu', 'Maths', 'Science', 'SST', 'Computers'];
  }
  // Default fallback
  return ['English', 'Hindi', 'Maths', 'Science', 'SST'];
};

export const AdminResults: React.FC = () => {
  const { allStudents, currentAdmin } = useContext(AuthContext);
  const { examResults, setExamResults, currentSession, setCurrentSession } = useContext(SchoolContext);
  
  // Logic for Class Teacher View Locking
  const isTeacher = currentAdmin?.role === 'Teacher';
  const teacherClass = currentAdmin?.assignedClass || 'X'; // Default fallback
  const teacherSection = currentAdmin?.assignedSection || 'A'; // Default fallback

  // Selection State - Forced defaults for teacher
  const [selectedClass, setSelectedClass] = useState(isTeacher ? teacherClass : 'X');
  const [selectedSection, setSelectedSection] = useState(isTeacher ? teacherSection : 'A');
  const [selectedExam, setSelectedExam] = useState('Half Yearly');
  
  // Enforce lock on mount and update if context changes
  useEffect(() => {
    if (isTeacher) {
      setSelectedClass(teacherClass);
      setSelectedSection(teacherSection);
    }
  }, [isTeacher, teacherClass, teacherSection]);

  // Configuration State
  const [subjects, setSubjects] = useState<string[]>([]);
  const [maxMarks, setMaxMarks] = useState(100);
  const [showConfigModal, setShowConfigModal] = useState(false);

  // Local Grid State (for fast entry before save)
  const [gridData, setGridData] = useState<Record<string, Record<string, string>>>({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Derived: Filtered Students
  const filteredStudents = useMemo(() => {
    return allStudents
      .filter(s => s.class === selectedClass && s.section === selectedSection)
      .sort((a, b) => Number(a.rollNo) - Number(b.rollNo));
  }, [allStudents, selectedClass, selectedSection]);

  // Derived: Unique Classes/Sections
  const uniqueClasses = useMemo(() => Array.from(new Set(allStudents.map(s => s.class))), [allStudents]);
  const uniqueSections = useMemo(() => Array.from(new Set(allStudents.map(s => s.section))), [allStudents]);

  // Initialize Subjects based on Class Selection & Existing Data
  useEffect(() => {
    const defaults = getSubjectsForClass(selectedClass);
    
    // Scan existing results to find any custom subjects previously saved
    const existingSubjects = new Set<string>();
    filteredStudents.forEach(s => {
       const results = examResults[s.admissionNo]?.[currentSession]?.[selectedExam] || [];
       results.forEach(r => existingSubjects.add(r.name));
    });

    // Merge defaults with existing (preserving order of defaults, appending new ones)
    const merged = [...defaults];
    existingSubjects.forEach(sub => {
      if (!merged.includes(sub)) merged.push(sub);
    });

    setSubjects(merged);
  }, [selectedClass, selectedExam, currentSession, allStudents, filteredStudents]);

  // Load Data into Grid when Selection or Subjects Change
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
  }, [selectedClass, selectedSection, selectedExam, currentSession, filteredStudents, examResults, subjects]);

  // Handle Cell Change (Spreadsheet Logic)
  const handleCellChange = (studentId: string, subject: string, value: string) => {
    const numVal = parseFloat(value);
    
    // Allow empty string for deletion, otherwise validate
    if (value !== '' && (isNaN(numVal) || numVal < 0)) return;

    setGridData(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [subject]: value
      }
    }));
    setHasUnsavedChanges(true);
  };

  // --- CSV LOGIC ---

  const handleDownloadTemplate = () => {
    // Headers: RollNo, Name, ...Subjects
    const headers = ['RollNo', 'Name', ...subjects];
    
    // Rows: Pre-fill with student data
    const rows = filteredStudents.map(s => {
      // Create a row with empty marks
      const rowData = [s.rollNo, s.name, ...subjects.map(() => '')];
      return rowData.join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Marks_Template_${selectedClass}_${selectedSection}_${selectedExam}.csv`;
    a.click();
  };

  const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const parsedData = results.data as any[];
        const newGrid = { ...gridData };
        let matchCount = 0;

        parsedData.forEach(row => {
          // Find student by Roll No
          const student = filteredStudents.find(s => s.rollNo === row['RollNo']);
          
          if (student) {
            matchCount++;
            const studentId = student.admissionNo;
            if (!newGrid[studentId]) newGrid[studentId] = {};

            subjects.forEach(sub => {
              const val = row[sub];
              if (val !== undefined) {
                const num = parseFloat(val);
                if (!isNaN(num) && num >= 0 && num <= maxMarks) {
                   newGrid[studentId][sub] = val;
                }
              }
            });
          }
        });

        setGridData(newGrid);
        setHasUnsavedChanges(true);
        alert(`Import Successful! Matched ${matchCount} students. Review data and click 'Publish'.`);
      }
    });
    
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // --- SAVE LOGIC ---
  const handleSave = () => {
    setExamResults(prevGlobal => {
      const newGlobal = { ...prevGlobal };

      filteredStudents.forEach(student => {
        const studentId = student.admissionNo;
        const marks = gridData[studentId] || {};
        
        // Construct ExamResult Array based on CURRENT subjects schema
        const resultsArray: ExamResult[] = subjects.map(sub => {
          const score = Number(marks[sub]) || 0;
          return {
            name: sub,
            score: score,
            grade: getGrade(score, maxMarks),
            color: getSubjectColor(sub)
          };
        });

        // Deep merge safely
        if (!newGlobal[studentId]) newGlobal[studentId] = {};
        if (!newGlobal[studentId][currentSession]) newGlobal[studentId][currentSession] = {};
        
        newGlobal[studentId][currentSession][selectedExam] = resultsArray;
      });

      return newGlobal;
    });
    setHasUnsavedChanges(false);
    alert("Results Published Successfully!");
  };

  return (
    <div className="space-y-6 pb-32 md:pb-24 relative min-h-screen">
      
      {/* HEADER AREA */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-6">
        <div>
           <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Marks Manager</h1>
           <p className="text-slate-500 dark:text-slate-400 mt-1">Configure exams and enter marks</p>
        </div>

        {/* CONTROLS BAR */}
        <div className="flex flex-wrap items-center gap-3 bg-white dark:bg-[#1C1C1E] p-2 rounded-[1.5rem] shadow-sm border border-slate-100 dark:border-white/5 w-full xl:w-auto">
           {/* Session */}
           <div className="relative group">
              <select 
                value={currentSession}
                onChange={(e) => setCurrentSession(e.target.value)}
                className="appearance-none pl-4 pr-10 py-3 bg-slate-100 dark:bg-white/5 rounded-xl text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-ios-blue/50 cursor-pointer min-w-[120px]"
              >
                 <option>2024-25</option>
                 <option>2025-26</option>
                 <option>2026-27</option>
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 opacity-50 pointer-events-none" />
           </div>

           {/* Class & Section Selection or Locked View */}
           {isTeacher ? (
              <div className="flex items-center gap-2 px-4 py-3 bg-blue-50 dark:bg-blue-500/10 rounded-xl text-blue-700 dark:text-blue-300 font-bold border border-blue-100 dark:border-blue-500/20 whitespace-nowrap">
                 <Lock size={16} /> 
                 <span>My Class: {teacherClass}-{teacherSection}</span>
              </div>
           ) : (
             <div className="flex gap-2">
               <div className="relative">
                  <select 
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className="appearance-none pl-4 pr-10 py-3 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-ios-blue/50 cursor-pointer min-w-[100px]"
                  >
                     {uniqueClasses.map(c => <option key={c} value={c}>Class {c}</option>)}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 opacity-50 pointer-events-none" />
               </div>

               <div className="relative">
                  <select 
                    value={selectedSection}
                    onChange={(e) => setSelectedSection(e.target.value)}
                    className="appearance-none pl-4 pr-10 py-3 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-ios-blue/50 cursor-pointer min-w-[90px]"
                  >
                     {uniqueSections.map(s => <option key={s} value={s}>Sec {s}</option>)}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 opacity-50 pointer-events-none" />
               </div>
             </div>
           )}

           <div className="w-[1px] h-8 bg-slate-200 dark:bg-white/10 mx-1 hidden sm:block"></div>

           {/* Exam Type */}
           <div className="relative flex-1 sm:flex-none">
              <select 
                value={selectedExam}
                onChange={(e) => setSelectedExam(e.target.value)}
                className="appearance-none w-full sm:w-auto pl-4 pr-10 py-3 bg-ios-blue text-white rounded-xl text-sm font-bold outline-none shadow-md cursor-pointer"
              >
                 {STANDARD_EXAMS.map(e => <option key={e} value={e}>{e}</option>)}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 pointer-events-none" />
           </div>

           {/* Config Button */}
           <button 
             onClick={() => setShowConfigModal(true)}
             className="px-3 py-3 bg-slate-900 dark:bg-white text-white dark:text-black rounded-xl hover:scale-105 transition-transform shadow-lg"
             title="Configure Subjects & Max Marks"
           >
             <Settings size={18} />
           </button>
        </div>
      </div>

      {/* DATA GRID */}
      <div className="bg-white dark:bg-[#1C1C1E] rounded-[2rem] shadow-xl border border-slate-100 dark:border-white/5 overflow-hidden flex flex-col h-[65vh] relative z-0">
         {/* Scrollable Table Container */}
         <div className="overflow-auto flex-1 relative custom-scrollbar">
            <table className="w-full text-left border-collapse min-w-[1000px]">
               <thead className="bg-slate-50 dark:bg-[#252527] sticky top-0 z-20 backdrop-blur-md shadow-sm">
                  <tr>
                     <th className="sticky left-0 z-30 bg-slate-50 dark:bg-[#252527] p-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-16 border-b border-slate-200 dark:border-white/10 shadow-[4px_0_10px_rgba(0,0,0,0.02)]">Roll</th>
                     <th className="sticky left-16 z-30 bg-slate-50 dark:bg-[#252527] p-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-56 border-b border-slate-200 dark:border-white/10 shadow-[4px_0_10px_rgba(0,0,0,0.02)] border-r">Student Name</th>
                     
                     {subjects.map(sub => (
                        <th key={sub} className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center border-b border-slate-200 dark:border-white/10 w-32 border-r border-slate-100 dark:border-white/5">
                           <div className="flex flex-col items-center">
                              <span>{sub}</span>
                              <span className="text-[10px] text-slate-400 bg-slate-100 dark:bg-white/5 px-2 py-0.5 rounded mt-1">Max: {maxMarks}</span>
                           </div>
                        </th>
                     ))}
                     
                     <th className="p-4 text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider text-center bg-blue-50/30 dark:bg-blue-900/10 border-b border-slate-200 dark:border-white/10 w-28 border-l border-blue-100 dark:border-white/5">
                        Total <span className="text-[10px] text-slate-400 block">/{subjects.length * maxMarks}</span>
                     </th>
                     <th className="p-4 text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider text-center bg-blue-50/30 dark:bg-blue-900/10 border-b border-slate-200 dark:border-white/10 w-24">%</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                  {filteredStudents.map((student, rIndex) => {
                     const marks = gridData[student.admissionNo] || {};
                     const total = Object.values(marks).reduce<number>((sum, val) => sum + (Number(val) || 0), 0);
                     const grandTotal = subjects.length * maxMarks;
                     const percentage = grandTotal > 0 ? (total / grandTotal) * 100 : 0;

                     return (
                        <tr key={student.admissionNo} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group">
                           <td className="sticky left-0 z-10 bg-white dark:bg-[#1C1C1E] p-4 font-mono text-sm font-bold text-slate-500 group-hover:bg-slate-50 dark:group-hover:bg-[#2C2C2E] shadow-[4px_0_10px_rgba(0,0,0,0.02)] transition-colors border-b border-slate-100 dark:border-white/5">
                              {student.rollNo}
                           </td>
                           <td className="sticky left-16 z-10 bg-white dark:bg-[#1C1C1E] p-4 group-hover:bg-slate-50 dark:group-hover:bg-[#2C2C2E] shadow-[4px_0_10px_rgba(0,0,0,0.02)] transition-colors border-b border-r border-slate-100 dark:border-white/5">
                              <div className="flex items-center gap-3">
                                 <img src={student.avatar} className="w-8 h-8 rounded-full bg-slate-100 object-cover" alt="" />
                                 <span className="font-bold text-slate-900 dark:text-white text-sm whitespace-nowrap">{student.name}</span>
                              </div>
                           </td>
                           
                           {subjects.map((sub, cIndex) => {
                              const val = marks[sub] || '';
                              const numVal = parseFloat(val);
                              const isInvalid = numVal > maxMarks;
                              const isFail = numVal < (maxMarks * 0.33) && val !== '';

                              return (
                                 <td key={sub} className="p-2 text-center relative border-r border-slate-100 dark:border-white/5 last:border-none">
                                    <input 
                                       type="number"
                                       min="0" max={maxMarks}
                                       value={val}
                                       placeholder="-"
                                       onChange={(e) => handleCellChange(student.admissionNo, sub, e.target.value)}
                                       className={`
                                          w-full h-10 text-center font-bold bg-transparent rounded-lg outline-none transition-all
                                          focus:bg-ios-blue/10 focus:ring-2 focus:ring-ios-blue/50
                                          ${isInvalid ? 'text-red-600 bg-red-100 ring-2 ring-red-500' : 
                                            isFail ? 'text-red-500 bg-red-50/50' : 
                                            'text-slate-700 dark:text-slate-300'}
                                       `}
                                       tabIndex={0}
                                    />
                                 </td>
                              );
                           })}

                           <td className="p-4 text-center font-bold text-slate-900 dark:text-white bg-blue-50/20 dark:bg-blue-900/5 border-l border-blue-100 dark:border-white/5">{total}</td>
                           <td className={`p-4 text-center font-bold bg-blue-50/20 dark:bg-blue-900/5 ${percentage >= 90 ? 'text-green-600' : percentage < 33 ? 'text-red-500' : 'text-slate-700 dark:text-slate-300'}`}>
                              {percentage.toFixed(1)}%
                           </td>
                        </tr>
                     );
                  })}
               </tbody>
            </table>
            {filteredStudents.length === 0 && (
               <div className="flex flex-col items-center justify-center h-full text-slate-400">
                  <FileSpreadsheet size={48} className="opacity-20 mb-4" />
                  <p className="font-medium">No students found in {selectedClass}-{selectedSection}.</p>
               </div>
            )}
         </div>
      </div>

      {/* FLOATING ACTION BAR */}
      <motion.div 
         initial={{ y: 100 }}
         animate={{ y: 0 }}
         className="fixed bottom-6 left-4 right-4 md:left-1/2 md:right-auto md:-translate-x-1/2 z-40 bg-slate-900/90 dark:bg-white/90 backdrop-blur-xl p-3 pl-6 pr-3 rounded-full shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4 text-white dark:text-black border border-white/10 min-w-[320px] max-w-2xl"
      >
         <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-start">
            <div className="flex items-center gap-2 text-sm font-medium">
                {hasUnsavedChanges ? (
                   <span className="text-orange-400 dark:text-orange-600 flex items-center gap-2 font-bold animate-pulse"><AlertCircle size={16} /> Unsaved</span>
                ) : (
                   <span className="text-green-400 dark:text-green-600 flex items-center gap-2 font-bold"><Check size={16} /> Saved</span>
                )}
            </div>
            
            <div className="h-4 w-[1px] bg-white/20 dark:bg-black/10 hidden sm:block"></div>
            
            <div className="flex gap-1">
               <button 
                  onClick={handleDownloadTemplate}
                  className="p-2 rounded-full hover:bg-white/10 dark:hover:bg-black/10 transition-colors"
                  title="Download CSV Template"
               >
                  <Download size={18} />
               </button>
               <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 rounded-full hover:bg-white/10 dark:hover:bg-black/10 transition-colors"
                  title="Import CSV"
               >
                  <UploadCloud size={18} />
               </button>
               <input type="file" accept=".csv" ref={fileInputRef} className="hidden" onChange={handleImportCSV} />
            </div>
         </div>

         <button 
            onClick={handleSave}
            className="w-full sm:w-auto px-8 py-3 bg-ios-blue text-white rounded-full font-bold shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
         >
            <Save size={18} /> Publish Results
         </button>
      </motion.div>

      {/* CONFIGURATION MODAL */}
      <AnimatePresence>
        {showConfigModal && (
          <ExamConfigModal 
            subjects={subjects}
            setSubjects={setSubjects}
            maxMarks={maxMarks}
            setMaxMarks={setMaxMarks}
            onClose={() => setShowConfigModal(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// ... (Existing ExamConfigModal, getGrade, getSubjectColor)
// Include the existing helper components here to maintain file integrity

const ExamConfigModal: React.FC<{ 
  subjects: string[], 
  setSubjects: (s: string[]) => void, 
  maxMarks: number, 
  setMaxMarks: (n: number) => void,
  onClose: () => void 
}> = ({ subjects, setSubjects, maxMarks, setMaxMarks, onClose }) => {
  const [newSubject, setNewSubject] = useState('');

  const addSubject = (e: React.FormEvent) => {
    e.preventDefault();
    const sub = newSubject.trim();
    if (sub && !subjects.includes(sub)) {
      setSubjects([...subjects, sub]);
      setNewSubject('');
    }
  };

  const removeSubject = (subToRemove: string) => {
    if (confirm(`Remove "${subToRemove}" from columns? Existing marks for this subject will be hidden.`)) {
      setSubjects(subjects.filter(s => s !== subToRemove));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="relative bg-white dark:bg-[#1C1C1E] w-full max-w-md rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        
        <div className="p-6 border-b border-slate-100 dark:border-white/5 flex justify-between items-center bg-slate-50 dark:bg-white/5">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Settings size={20} className="text-ios-blue" /> Configure Exam
          </h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"><X size={20} /></button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6">
          {/* Max Marks */}
          <div className="p-5 bg-slate-50 dark:bg-black/20 rounded-2xl border border-slate-100 dark:border-white/5">
             <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Max Marks (Per Subject)</label>
             <div className="flex items-center gap-4">
                <input 
                  type="number" 
                  value={maxMarks} 
                  onChange={(e) => setMaxMarks(Number(e.target.value))} 
                  className="w-28 p-3 rounded-xl bg-white dark:bg-[#2C2C2E] font-bold text-center text-xl outline-none focus:ring-2 focus:ring-ios-blue/50 text-slate-900 dark:text-white shadow-sm"
                />
                <div className="text-xs text-slate-500 leading-tight">
                   Total Score: <strong className="text-slate-900 dark:text-white block text-lg">{subjects.length * maxMarks}</strong>
                </div>
             </div>
          </div>

          {/* Subject List */}
          <div>
             <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex justify-between">
                <span>Active Subjects ({subjects.length})</span>
             </label>
             <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1 custom-scrollbar">
                {subjects.map(sub => (
                   <div key={sub} className="flex justify-between items-center p-3 rounded-xl bg-white dark:bg-white/5 border border-slate-100 dark:border-white/5 group hover:border-ios-blue/30 transition-colors">
                      <span className="font-bold text-slate-700 dark:text-slate-300">{sub}</span>
                      <button onClick={() => removeSubject(sub)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/20 transition-colors">
                         <Trash2 size={16} />
                      </button>
                   </div>
                ))}
             </div>
          </div>

          {/* Add Subject */}
          <form onSubmit={addSubject} className="relative">
             <input 
               type="text" 
               placeholder="Type new subject name..." 
               className="w-full p-4 pr-12 rounded-xl bg-slate-50 dark:bg-black/20 border-none outline-none focus:ring-2 focus:ring-ios-blue/50 text-slate-900 dark:text-white font-medium placeholder-slate-400"
               value={newSubject}
               onChange={e => setNewSubject(e.target.value)}
             />
             <button type="submit" disabled={!newSubject.trim()} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-ios-blue text-white rounded-lg shadow-md disabled:opacity-50 hover:scale-105 transition-transform">
                <Plus size={20} />
             </button>
          </form>
        </div>

        <div className="p-6 border-t border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-white/5">
           <button onClick={onClose} className="w-full py-3 bg-slate-900 dark:bg-white text-white dark:text-black font-bold rounded-xl shadow-lg hover:brightness-110 transition-all">
              Apply Changes
           </button>
        </div>
      </motion.div>
    </div>
  );
};

// Utils
const getGrade = (score: number, max: number) => {
   const percentage = (score / max) * 100;
   if (percentage >= 90) return 'A1';
   if (percentage >= 80) return 'A2';
   if (percentage >= 70) return 'B1';
   if (percentage >= 60) return 'B2';
   if (percentage >= 50) return 'C1';
   if (percentage >= 33) return 'D';
   return 'F';
};

const getSubjectColor = (subject: string) => {
   const sub = subject.toLowerCase();
   if (sub.includes('math')) return 'bg-blue-500';
   if (sub.includes('science') || sub.includes('evs')) return 'bg-green-500';
   if (sub.includes('english')) return 'bg-orange-500';
   if (sub.includes('sst') || sub.includes('social')) return 'bg-red-500';
   if (sub.includes('hindi') || sub.includes('urdu')) return 'bg-yellow-500';
   if (sub.includes('computer')) return 'bg-cyan-500';
   if (sub.includes('gk')) return 'bg-purple-500';
   if (sub.includes('art')) return 'bg-pink-500';
   return 'bg-slate-500';
};
