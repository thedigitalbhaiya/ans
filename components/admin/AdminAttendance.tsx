
import React, { useContext, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Check, X, Clock, Save, Search, Filter } from 'lucide-react';
import { AuthContext } from '../../App';

export const AdminAttendance: React.FC = () => {
  const { allStudents } = useContext(AuthContext);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  // Mock state for attendance, in a real app this would fetch from DB based on date
  const [attendance, setAttendance] = useState<Record<string, 'present' | 'absent' | 'late'>>({});

  const handleStatusChange = (id: string, status: 'present' | 'absent' | 'late') => {
    setAttendance(prev => ({ ...prev, [id]: status }));
  };

  const handleSave = () => {
    alert(`Attendance for ${date} saved successfully!`);
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'present': return 'bg-green-500 text-white';
      case 'absent': return 'bg-red-500 text-white';
      case 'late': return 'bg-orange-500 text-white';
      default: return 'bg-slate-100 dark:bg-white/10 text-slate-400';
    }
  };

  return (
    <div className="space-y-6">
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

      <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
         {['Class X-A', 'Class X-B', 'Class IX-A', 'Class IX-B'].map((cls, i) => (
           <button 
             key={cls}
             className={`px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${i === 0 ? 'bg-slate-900 dark:bg-white text-white dark:text-black shadow-lg' : 'bg-white dark:bg-[#1C1C1E] text-slate-500 border border-slate-100 dark:border-white/5'}`}
           >
             {cls}
           </button>
         ))}
      </div>

      <div className="bg-white dark:bg-[#1C1C1E] rounded-[2rem] shadow-sm border border-slate-100 dark:border-white/5 overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-white/5 flex justify-between items-center">
           <h3 className="font-bold text-lg text-slate-900 dark:text-white">Student List</h3>
           <div className="flex gap-2">
              <button className="text-xs font-bold text-green-600 bg-green-50 dark:bg-green-500/10 px-3 py-1.5 rounded-lg hover:bg-green-100 transition-colors">Mark All Present</button>
           </div>
        </div>
        
        <div className="divide-y divide-slate-100 dark:divide-white/5">
           {allStudents.map((student) => {
             const status = attendance[student.admissionNo] || 'present'; // Default to present
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
                       className={`p-2 rounded-md transition-all ${status === 'present' ? 'bg-white dark:bg-[#2C2C2E] text-green-500 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                       title="Present"
                     >
                        <Check size={18} strokeWidth={3} />
                     </button>
                     <button 
                       onClick={() => handleStatusChange(student.admissionNo, 'absent')}
                       className={`p-2 rounded-md transition-all ${status === 'absent' ? 'bg-white dark:bg-[#2C2C2E] text-red-500 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                       title="Absent"
                     >
                        <X size={18} strokeWidth={3} />
                     </button>
                     <button 
                       onClick={() => handleStatusChange(student.admissionNo, 'late')}
                       className={`p-2 rounded-md transition-all ${status === 'late' ? 'bg-white dark:bg-[#2C2C2E] text-orange-500 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                       title="Late"
                     >
                        <Clock size={18} strokeWidth={3} />
                     </button>
                  </div>
               </div>
             );
           })}
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
