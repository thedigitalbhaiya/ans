
import React, { useContext, useState, useMemo, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Check, X, Clock, Save, ChevronDown, Filter, Lock, UploadCloud, Download, FileSpreadsheet } from 'lucide-react';
import { AuthContext, SchoolContext } from '../../App';
import Papa from 'papaparse';

export const AdminAttendance: React.FC = () => {
  const { allStudents, currentAdmin } = useContext(AuthContext);
  const { attendance: globalAttendance, setAttendance: setGlobalAttendance } = useContext(SchoolContext);
  
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Logic for Class Teacher View Locking
  const isTeacher = currentAdmin?.role === 'Teacher';
  const teacherClass = currentAdmin?.assignedClass || 'All';
  const teacherSection = currentAdmin?.assignedSection || 'All';

  const [selectedClass, setSelectedClass] = useState(isTeacher ? teacherClass : 'All');
  const [selectedSection, setSelectedSection] = useState(isTeacher ? teacherSection : 'All');

  // Enforce lock on mount and update if context changes
  useEffect(() => {
    if (isTeacher) {
      setSelectedClass(teacherClass);
      setSelectedSection(teacherSection);
    }
  }, [isTeacher, teacherClass, teacherSection]);
  
  // Local state for the current editing session
  const [dailyAttendance, setDailyAttendance] = useState<Record<string, 'present' | 'absent' | 'late'>>({});

  // Sync local state when date changes
  useEffect(() => {
    setDailyAttendance(globalAttendance[date] || {});
  }, [date, globalAttendance]);

  // Derived Data for Filters
  const uniqueClasses = useMemo(() => ['All', ...Array.from(new Set(allStudents.map(s => s.class)))], [allStudents]);
  const uniqueSections = useMemo(() => ['All', ...Array.from(new Set(allStudents.map(s => s.section)))], [allStudents]);

  const filteredStudents = useMemo(() => {
    return allStudents.filter(student => {
      const classMatch = selectedClass === 'All' || student.class === selectedClass;
      const sectionMatch = selectedSection === 'All' || student.section === selectedSection;
      return classMatch && sectionMatch;
    });
  }, [allStudents, selectedClass, selectedSection]);

  const handleStatusChange = (id: string, status: 'present' | 'absent' | 'late') => {
    setDailyAttendance(prev => ({ ...prev, [id]: status }));
  };

  const markAll = (status: 'present' | 'absent') => {
    const updates: Record<string, 'present' | 'absent' | 'late'> = {};
    filteredStudents.forEach(s => {
      updates[s.admissionNo] = status;
    });
    setDailyAttendance(prev => ({ ...prev, ...updates }));
  };

  const handleSave = () => {
    setGlobalAttendance(prev => ({
      ...prev,
      [date]: { ...prev[date], ...dailyAttendance }
    }));
    alert(`Attendance for ${date} saved successfully!`);
  };

  // CSV Operations
  const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const newDaily = { ...dailyAttendance };
        results.data.forEach((row: any) => {
           const id = row.admissionNo || row.ID;
           const status = row.status?.toLowerCase();
           if (id && ['present','absent','late'].includes(status)) {
              newDaily[id] = status as 'present' | 'absent' | 'late';
           } else if (id && status === 'p') newDaily[id] = 'present';
           else if (id && status === 'a') newDaily[id] = 'absent';
           else if (id && status === 'l') newDaily[id] = 'late';
        });
        setDailyAttendance(newDaily);
        alert(`Imported status for ${results.data.length} students. Click Save to confirm.`);
        if(fileInputRef.current) fileInputRef.current.value = '';
      }
    });
  };

  const handleDownloadTemplate = () => {
    const header = "admissionNo,name,status";
    const rows = filteredStudents.map(s => `${s.admissionNo},${s.name},present`).join('\n');
    const blob = new Blob([`${header}\n${rows}`], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance_template_${date}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Daily Attendance</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Mark student presence for the day</p>
        </div>
        <div className="flex gap-4 items-center bg-white dark:bg-[#1C1C1E] p-2 rounded-xl border border-slate-100 dark:border-white/5 shadow-sm">
           <Calendar size={18} className="text-slate-400 ml-2" />
           <input 
             type="date" 
             value={date} 
             onChange={(e) => setDate(e.target.value)}
             className="bg-transparent border-none outline-none text-slate-900 dark:text-white font-bold text-sm"
           />
        </div>
      </div>

      {/* Filters & Bulk Tools */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white dark:bg-[#1C1C1E] p-3 rounded-[1.5rem] border border-slate-100 dark:border-white/5">
         {isTeacher ? (
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-500/10 rounded-xl text-blue-700 dark:text-blue-300 font-bold border border-blue-100 dark:border-blue-500/20 whitespace-nowrap w-fit">
               <Lock size={16} /> 
               <span>My Class: {teacherClass}-{teacherSection}</span>
            </div>
         ) : (
            <div className="flex gap-2">
               <FilterDropdown label="Class" options={uniqueClasses} selected={selectedClass} onSelect={setSelectedClass} />
               <FilterDropdown label="Section" options={uniqueSections} selected={selectedSection} onSelect={setSelectedSection} />
            </div>
         )}

         <div className="flex gap-2">
            <input type="file" accept=".csv" ref={fileInputRef} className="hidden" onChange={handleImportCSV} />
            <button onClick={() => fileInputRef.current?.click()} className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors flex items-center gap-2 text-sm font-bold" title="Import CSV">
               <UploadCloud size={18} /> <span className="hidden sm:inline">Import</span>
            </button>
            <button onClick={handleDownloadTemplate} className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors flex items-center gap-2 text-sm font-bold" title="Download Template">
               <Download size={18} /> <span className="hidden sm:inline">Template</span>
            </button>
         </div>
      </div>

      {/* List */}
      <div className="bg-white dark:bg-[#1C1C1E] rounded-[2rem] shadow-sm border border-slate-100 dark:border-white/5 overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-white/5 flex justify-between items-center bg-slate-50 dark:bg-white/5">
           <h3 className="font-bold text-lg text-slate-900 dark:text-white">Student List ({filteredStudents.length})</h3>
           <div className="flex gap-2">
              <button 
                onClick={() => markAll('present')}
                className="text-xs font-bold text-green-600 bg-green-100 dark:bg-green-500/20 px-3 py-2 rounded-lg hover:bg-green-200 transition-colors"
              >
                Mark All Present
              </button>
           </div>
        </div>
        
        <div className="divide-y divide-slate-100 dark:divide-white/5 max-h-[60vh] overflow-y-auto">
           {filteredStudents.map((student) => {
             const status = dailyAttendance[student.admissionNo] || 'present'; // Default to present visually if undefined
             return (
               <div key={student.admissionNo} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-200 dark:border-white/10">
                        <img src={student.avatar} alt={student.name} className="w-full h-full object-cover" />
                     </div>
                     <div>
                        <p className="font-bold text-slate-900 dark:text-white text-sm">{student.name}</p>
                        <p className="text-xs text-slate-500">Roll No: {student.rollNo}</p>
                     </div>
                  </div>

                  <div className="flex bg-slate-100 dark:bg-black/20 rounded-lg p-1 gap-1">
                     <button 
                       onClick={() => handleStatusChange(student.admissionNo, 'present')}
                       className={`p-2 rounded-md transition-all ${status === 'present' ? 'bg-white dark:bg-[#2C2C2E] text-green-500 shadow-sm scale-105' : 'text-slate-400 hover:text-slate-600'}`}
                       title="Present"
                     >
                        <Check size={18} strokeWidth={3} />
                     </button>
                     <button 
                       onClick={() => handleStatusChange(student.admissionNo, 'absent')}
                       className={`p-2 rounded-md transition-all ${status === 'absent' ? 'bg-white dark:bg-[#2C2C2E] text-red-500 shadow-sm scale-105' : 'text-slate-400 hover:text-slate-600'}`}
                       title="Absent"
                     >
                        <X size={18} strokeWidth={3} />
                     </button>
                     <button 
                       onClick={() => handleStatusChange(student.admissionNo, 'late')}
                       className={`p-2 rounded-md transition-all ${status === 'late' ? 'bg-white dark:bg-[#2C2C2E] text-orange-500 shadow-sm scale-105' : 'text-slate-400 hover:text-slate-600'}`}
                       title="Late"
                     >
                        <Clock size={18} strokeWidth={3} />
                     </button>
                  </div>
               </div>
             );
           })}
           {filteredStudents.length === 0 && (
             <div className="p-8 text-center text-slate-400">No students found for selection.</div>
           )}
        </div>
      </div>

      <div className="fixed bottom-6 right-6 md:relative md:bottom-auto md:right-auto flex justify-end">
         <motion.button
           whileHover={{ scale: 1.05 }}
           whileTap={{ scale: 0.95 }}
           onClick={handleSave}
           className="bg-ios-blue text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-ios-blue/30 flex items-center gap-2"
         >
            <Save size={20} />
            Save Attendance
         </motion.button>
      </div>
    </div>
  );
};

const FilterDropdown: React.FC<{ label: string, options: string[], selected: string, onSelect: (value: string) => void }> = ({ label, options, selected, onSelect }) => (
    <div className="relative">
        <select
            value={selected}
            onChange={e => onSelect(e.target.value)}
            className="appearance-none w-32 bg-white dark:bg-[#1C1C1E] border border-slate-200 dark:border-white/10 rounded-xl py-3 px-4 text-slate-900 dark:text-white font-bold text-sm focus:ring-2 focus:ring-ios-blue/50 outline-none cursor-pointer"
        >
            {options.map(opt => <option key={opt} value={opt}>{opt === 'All' ? `All ${label}s` : opt}</option>)}
        </select>
        <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
    </div>
);
