
import React, { useContext, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, Search, CheckCircle2, X, ChevronDown, IndianRupee, Calendar, Check, AlertCircle, Filter, Settings, Save, ShieldAlert } from 'lucide-react';
import { AuthContext, SchoolContext } from '../../App';
import { Student, FeeRecord, FeeStructure } from '../../types';

const ACADEMIC_MONTHS = [
  "April", "May", "June", "July", "August", "September", 
  "October", "November", "December", "January", "February", "March"
];

export const AdminFees: React.FC = () => {
  const { allStudents, setAllStudents, currentAdmin } = useContext(AuthContext);
  const { feeStructure, setFeeStructure } = useContext(SchoolContext);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState('All');
  const [selectedSection, setSelectedSection] = useState('All');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  // --- ACCESS CHECK ---
  if (currentAdmin?.role === 'Teacher') {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <div className="w-24 h-24 bg-red-50 dark:bg-red-500/10 rounded-full flex items-center justify-center mb-6">
           <ShieldAlert size={48} className="text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Access Restricted</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-sm">
           Fee management is restricted to administrative staff only.
        </p>
      </div>
    );
  }

  // --- DERIVED DATA ---
  const uniqueClasses = useMemo(() => ['All', ...Array.from(new Set(allStudents.map(s => s.class)))], [allStudents]);
  const uniqueSections = useMemo(() => ['All', ...Array.from(new Set(allStudents.map(s => s.section)))], [allStudents]);

  const filteredStudents = useMemo(() => {
    return allStudents.filter(student => {
      const searchMatch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) || student.admissionNo.includes(searchQuery);
      const classMatch = selectedClass === 'All' || student.class === selectedClass;
      const sectionMatch = selectedSection === 'All' || student.section === selectedSection;
      return searchMatch && classMatch && sectionMatch;
    });
  }, [allStudents, searchQuery, selectedClass, selectedSection]);

  // --- HELPERS ---
  const getFeeStatus = (student: Student) => {
    const paidMonths = student.feeHistory.map(f => f.month.split(' ')[0]); 
    const paidCount = paidMonths.length;
    
    if (paidCount === 12) return { text: "Fully Paid", color: "text-green-600 bg-green-100" };
    if (paidCount === 0) return { text: "No Payments", color: "text-red-600 bg-red-100" };
    
    return { text: `Paid: ${paidCount} Months`, color: "text-blue-600 bg-blue-100" };
  };

  const handleUpdateStudent = (updatedStudent: Student) => {
    setAllStudents(prev => prev.map(s => s.admissionNo === updatedStudent.admissionNo ? updatedStudent : s));
    setSelectedStudent(updatedStudent);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Fee Management</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Track monthly collections & invoices</p>
        </div>
        <button 
           onClick={() => setShowSettings(true)}
           className="bg-slate-900 dark:bg-white text-white dark:text-black px-5 py-3 rounded-xl font-bold shadow-lg flex items-center gap-2 text-sm"
        >
           <Settings size={16} /> Fee Settings
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-[#1C1C1E] p-4 rounded-[2rem] shadow-sm border border-slate-100 dark:border-white/5 flex flex-col md:flex-row gap-4">
         <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Search student..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 dark:bg-black/20 border-none rounded-xl py-3 pl-12 pr-4 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-ios-blue/50 outline-none"
            />
         </div>
         <div className="flex gap-2">
            <FilterDropdown label="Class" options={uniqueClasses} selected={selectedClass} onSelect={setSelectedClass} />
            <FilterDropdown label="Section" options={uniqueSections} selected={selectedSection} onSelect={setSelectedSection} />
         </div>
      </div>

      {/* Student List */}
      <div className="space-y-3">
         {filteredStudents.map((student, i) => {
            const status = getFeeStatus(student);
            const monthlyFee = feeStructure[student.class] || 1000;

            return (
            <motion.div 
               key={student.admissionNo}
               onClick={() => setSelectedStudent(student)}
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: i * 0.05 }}
               className="bg-white dark:bg-[#1C1C1E] p-5 rounded-[1.5rem] border border-slate-100 dark:border-white/5 shadow-sm flex flex-col md:flex-row items-center gap-4 md:gap-6 cursor-pointer hover:border-ios-blue/50 transition-colors group"
            >
               <div className="flex items-center gap-4 flex-1 w-full">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-slate-100 dark:border-white/10 group-hover:scale-105 transition-transform">
                     <img src={student.avatar} alt={student.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                     <h4 className="font-bold text-slate-900 dark:text-white text-lg">{student.name}</h4>
                     <p className="text-xs text-slate-500 font-medium">
                        Class {student.class}-{student.section} • Roll {student.rollNo}
                     </p>
                  </div>
               </div>
               
               <div className="flex items-center justify-between w-full md:w-auto gap-6">
                  <div className="text-right">
                     <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Monthly Fee</p>
                     <p className="text-slate-900 dark:text-white font-bold">₹ {monthlyFee}</p>
                  </div>

                  <div className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider ${status.color}`}>
                     {status.text}
                  </div>

                  <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-white/5 flex items-center justify-center text-slate-400 group-hover:bg-ios-blue group-hover:text-white transition-colors">
                     <CreditCard size={16} />
                  </div>
               </div>
            </motion.div>
         )})}
      </div>

      {/* FEE DETAIL MODAL */}
      <AnimatePresence>
        {selectedStudent && (
          <FeeDetailModal 
            student={selectedStudent} 
            feeStructure={feeStructure}
            onClose={() => setSelectedStudent(null)} 
            onUpdate={handleUpdateStudent}
          />
        )}
        {showSettings && (
           <FeeStructureModal 
             feeStructure={feeStructure}
             onSave={setFeeStructure}
             onClose={() => setShowSettings(false)}
           />
        )}
      </AnimatePresence>
    </div>
  );
};

// --- SUB-COMPONENTS ---

const FilterDropdown: React.FC<{ label: string, options: string[], selected: string, onSelect: (value: string) => void }> = ({ label, options, selected, onSelect }) => (
    <div className="relative">
        <select
            value={selected}
            onChange={e => onSelect(e.target.value)}
            className="appearance-none w-full md:w-32 bg-slate-50 dark:bg-black/20 border-none rounded-xl py-3 px-4 text-slate-900 dark:text-white font-bold text-sm focus:ring-2 focus:ring-ios-blue/50 outline-none cursor-pointer"
        >
            {options.map(opt => <option key={opt} value={opt}>{opt === 'All' ? `All ${label}s` : opt}</option>)}
        </select>
        <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
    </div>
);

// --- FEE STRUCTURE SETTINGS MODAL ---
const FeeStructureModal: React.FC<{ feeStructure: FeeStructure, onSave: (f: FeeStructure) => void, onClose: () => void }> = ({ feeStructure, onSave, onClose }) => {
   const [localStructure, setLocalStructure] = useState<FeeStructure>({...feeStructure});

   const handleChange = (cls: string, val: string) => {
      setLocalStructure(prev => ({...prev, [cls]: Number(val)}));
   };

   const handleSave = () => {
      onSave(localStructure);
      onClose();
   };

   return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }} 
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }} 
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative bg-white dark:bg-[#1C1C1E] w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
      >
         <div className="p-6 border-b border-slate-100 dark:border-white/5 flex justify-between items-center bg-slate-50 dark:bg-white/5">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
               <Settings size={20} /> Fee Configuration
            </h2>
            <button type="button" onClick={onClose} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-white/10"><X size={20} /></button>
         </div>
         
         <div className="p-6 overflow-y-auto space-y-4">
            {Object.entries(localStructure).map(([cls, amount]) => (
               <div key={cls} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-black/20">
                  <span className="font-bold text-slate-700 dark:text-slate-300">Class {cls}</span>
                  <div className="flex items-center gap-2">
                     <span className="text-slate-400 font-bold">₹</span>
                     <input 
                        type="number" 
                        value={amount} 
                        onChange={(e) => handleChange(cls, e.target.value)}
                        className="w-24 p-2 rounded-lg bg-white dark:bg-[#1C1C1E] text-center font-bold outline-none focus:ring-2 focus:ring-ios-blue/50"
                     />
                  </div>
               </div>
            ))}
         </div>

         <div className="p-6 border-t border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-white/5">
            <button 
               onClick={handleSave}
               className="w-full py-3 bg-ios-blue text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-transform"
            >
               <Save size={18} /> Save Structure
            </button>
         </div>
      </motion.div>
    </div>
   );
};

// --- THE FEE DETAIL MODAL ---
const FeeDetailModal: React.FC<{ student: Student, feeStructure: FeeStructure, onClose: () => void, onUpdate: (s: Student) => void }> = ({ student, feeStructure, onClose, onUpdate }) => {
  
  const monthlyFee = feeStructure[student.class] || 1000;
  
  const isPaid = (month: string) => student.feeHistory.some(r => r.month.startsWith(month));

  const toggleMonth = (month: string) => {
    let newHistory = [...student.feeHistory];
    
    if (isPaid(month)) {
      newHistory = newHistory.filter(r => !r.month.startsWith(month));
    } else {
      const newRecord: FeeRecord = {
        id: Date.now(),
        month: `${month} 2025`,
        amount: `₹ ${monthlyFee}`,
        status: 'Paid',
        date: new Date().toLocaleDateString('en-GB'),
        invoice: `#INV-${Math.floor(10000 + Math.random() * 90000)}`,
        paymentMethod: 'Offline'
      };
      newHistory.push(newRecord);
    }
    
    onUpdate({ ...student, feeHistory: newHistory });
  };

  const payWholeYear = () => {
    let newHistory = [...student.feeHistory];
    ACADEMIC_MONTHS.forEach(month => {
      if (!isPaid(month)) {
        newHistory.push({
          id: Date.now() + Math.random(),
          month: `${month} 2025`,
          amount: `₹ ${monthlyFee}`,
          status: 'Paid',
          date: new Date().toLocaleDateString('en-GB'),
          invoice: `BULK-${Math.floor(Math.random()*1000)}`,
          paymentMethod: 'Offline'
        });
      }
    });
    onUpdate({ ...student, feeHistory: newHistory });
  };

  const payNext3Months = () => {
    let count = 0;
    let newHistory = [...student.feeHistory];
    
    for (const month of ACADEMIC_MONTHS) {
      if (count >= 3) break;
      if (!isPaid(month)) {
        newHistory.push({
          id: Date.now() + Math.random(),
          month: `${month} 2025`,
          amount: `₹ ${monthlyFee}`,
          status: 'Paid',
          date: new Date().toLocaleDateString('en-GB'),
          invoice: `PART-${Math.floor(Math.random()*1000)}`,
          paymentMethod: 'Offline'
        });
        count++;
      }
    }
    if (count > 0) onUpdate({ ...student, feeHistory: newHistory });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }} 
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 20 }} 
        animate={{ scale: 1, opacity: 1, y: 0 }} 
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative bg-white dark:bg-[#1C1C1E] w-full max-w-4xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Modal Header */}
        <div className="bg-slate-50 dark:bg-white/5 p-6 md:p-8 flex justify-between items-start border-b border-slate-100 dark:border-white/5">
           <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-white dark:border-[#2C2C2E] shadow-lg">
                 <img src={student.avatar} alt="" className="w-full h-full object-cover" />
              </div>
              <div>
                 <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{student.name}</h2>
                 <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 text-sm mt-1">
                    <span className="font-semibold bg-white dark:bg-white/10 px-2 py-0.5 rounded border border-slate-200 dark:border-white/5">Class {student.class} - {student.section}</span>
                    <span>•</span>
                    <span>Roll No. {student.rollNo}</span>
                 </div>
              </div>
           </div>
           
           <div className="text-right hidden md:block">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Fee Structure</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white flex items-center justify-end gap-1">
                 <span className="text-lg text-slate-400">₹</span> {monthlyFee}<span className="text-sm text-slate-400 font-medium">/mo</span>
              </p>
           </div>

           <button onClick={onClose} className="absolute top-6 right-6 p-2 rounded-full bg-slate-200 dark:bg-white/10 hover:bg-slate-300 transition-colors">
              <X size={20} />
           </button>
        </div>

        {/* Modal Body - Scrollable */}
        <div className="p-6 md:p-8 overflow-y-auto no-scrollbar">
           
           {/* Bulk Actions Toolbar */}
           <div className="flex flex-wrap gap-3 mb-8">
              <button 
                onClick={payWholeYear}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-black font-bold text-sm shadow-lg active:scale-95 transition-transform"
              >
                 <CheckCircle2 size={18} /> Pay Whole Year
              </button>
              <button 
                onClick={payNext3Months}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-ios-blue/10 text-ios-blue font-bold text-sm hover:bg-ios-blue/20 transition-colors active:scale-95"
              >
                 <Calendar size={18} /> Pay Next 3 Months
              </button>
           </div>

           {/* The Fee Grid */}
           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {ACADEMIC_MONTHS.map((month) => {
                 const paid = isPaid(month);
                 return (
                    <motion.div
                       key={month}
                       layout
                       onClick={() => toggleMonth(month)}
                       className={`
                          relative p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 flex flex-col justify-between h-28 group
                          ${paid 
                             ? 'bg-green-50 dark:bg-green-500/10 border-green-500 dark:border-green-500/50' 
                             : 'bg-white dark:bg-[#2C2C2E] border-slate-100 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/20'}
                       `}
                    >
                       <div className="flex justify-between items-start">
                          <span className={`text-sm font-bold uppercase tracking-wider ${paid ? 'text-green-700 dark:text-green-400' : 'text-slate-500'}`}>
                             {month}
                          </span>
                          {paid ? (
                             <div className="bg-green-500 text-white p-1 rounded-full shadow-sm">
                                <Check size={12} strokeWidth={4} />
                             </div>
                          ) : (
                             <div className="w-5 h-5 rounded-full border-2 border-slate-200 dark:border-white/10 group-hover:border-slate-400"></div>
                          )}
                       </div>
                       
                       <div className="mt-auto">
                          <p className={`text-lg font-bold ${paid ? 'text-green-900 dark:text-white' : 'text-slate-900 dark:text-slate-300'}`}>
                             ₹ {monthlyFee}
                          </p>
                          <p className={`text-[10px] font-bold uppercase mt-1 ${paid ? 'text-green-600' : 'text-red-400'}`}>
                             {paid ? 'Paid' : 'Pending'}
                          </p>
                       </div>
                    </motion.div>
                 );
              })}
           </div>
        </div>
      </motion.div>
    </div>
  );
};
