
import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, MoreHorizontal, User, Phone } from 'lucide-react';
import { AuthContext } from '../../App';

export const AdminStudents: React.FC = () => {
  const { allStudents } = useContext(AuthContext);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Student Directory</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage student records</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
           <button className="bg-ios-blue text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-ios-blue/20 active:scale-95 transition-transform text-sm">
             + Add New
           </button>
        </div>
      </div>

      <div className="bg-white dark:bg-[#1C1C1E] p-4 rounded-[2rem] shadow-sm border border-slate-100 dark:border-white/5 flex gap-4">
         <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Search by name, roll no..." 
              className="w-full bg-slate-50 dark:bg-black/20 border-none rounded-xl py-3 pl-12 pr-4 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-ios-blue/50 outline-none"
            />
         </div>
         <button className="p-3 bg-slate-50 dark:bg-black/20 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
            <Filter size={20} />
         </button>
      </div>

      <div className="space-y-4">
        {allStudents.map((student, index) => (
          <motion.div
            key={student.admissionNo}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-[#1C1C1E] p-4 rounded-[1.5rem] shadow-sm border border-slate-100 dark:border-white/5 flex items-center justify-between group"
          >
             <div className="flex items-center gap-4">
               <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-slate-100 dark:border-white/10">
                 <img src={student.avatar} alt={student.name} className="w-full h-full object-cover" />
               </div>
               <div>
                 <h3 className="font-bold text-slate-900 dark:text-white">{student.name}</h3>
                 <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-0.5">
                   <span className="bg-slate-100 dark:bg-white/10 px-2 py-0.5 rounded-md">Class {student.class}</span>
                   <span>Roll: {student.rollNo}</span>
                 </p>
               </div>
             </div>
             
             <div className="flex items-center gap-2">
                <button className="w-10 h-10 rounded-full bg-slate-50 dark:bg-white/5 flex items-center justify-center text-slate-400 hover:text-ios-green hover:bg-green-50 dark:hover:bg-green-500/20 transition-colors">
                   <Phone size={18} />
                </button>
                <button className="w-10 h-10 rounded-full bg-slate-50 dark:bg-white/5 flex items-center justify-center text-slate-400 hover:text-ios-blue hover:bg-blue-50 dark:hover:bg-blue-500/20 transition-colors">
                   <MoreHorizontal size={18} />
                </button>
             </div>
          </motion.div>
        ))}
        {/* Placeholder for more list items */}
         {[1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: (i + 2) * 0.1 }}
            className="bg-white dark:bg-[#1C1C1E] p-4 rounded-[1.5rem] shadow-sm border border-slate-100 dark:border-white/5 flex items-center justify-between group opacity-60"
          >
             <div className="flex items-center gap-4">
               <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center text-slate-300">
                  <User size={20} />
               </div>
               <div>
                 <h3 className="font-bold text-slate-900 dark:text-white">Student Name {i}</h3>
                 <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-0.5">
                   <span className="bg-slate-100 dark:bg-white/10 px-2 py-0.5 rounded-md">Class X-A</span>
                   <span>Roll: 0{i}</span>
                 </p>
               </div>
             </div>
             
             <div className="flex items-center gap-2">
                <button className="w-10 h-10 rounded-full bg-slate-50 dark:bg-white/5 flex items-center justify-center text-slate-400">
                   <MoreHorizontal size={18} />
                </button>
             </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
