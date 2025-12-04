
import React, { useContext, useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Plus, Search, CheckCircle2, AlertCircle, MoreVertical } from 'lucide-react';
import { AuthContext } from '../../App';

export const AdminFees: React.FC = () => {
  const { allStudents } = useContext(AuthContext);
  const [filter, setFilter] = useState('All');

  // Mock fee data linked to students
  const feeStatus = allStudents.map(s => ({
     ...s,
     dues: Math.random() > 0.5 ? 4500 : 0,
     lastPaid: '12 Oct 2025'
  }));

  const filteredStudents = feeStatus.filter(s => {
    if (filter === 'Paid') return s.dues === 0;
    if (filter === 'Pending') return s.dues > 0;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Fee Management</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Track payments and invoices</p>
        </div>
        <button className="bg-slate-900 dark:bg-white text-white dark:text-black px-6 py-3 rounded-xl font-bold shadow-lg flex items-center gap-2 text-sm active:scale-95 transition-transform">
           <Plus size={18} /> Create Invoice
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
         <div className="bg-white dark:bg-[#1C1C1E] p-6 rounded-[1.5rem] border border-slate-100 dark:border-white/5 shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total Collected</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">₹ 24,50,000</h3>
            <span className="text-xs font-bold text-green-500 bg-green-50 dark:bg-green-500/10 px-2 py-0.5 rounded mt-2 inline-block">This Month</span>
         </div>
         <div className="bg-white dark:bg-[#1C1C1E] p-6 rounded-[1.5rem] border border-slate-100 dark:border-white/5 shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Pending Dues</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">₹ 3,25,000</h3>
            <span className="text-xs font-bold text-red-500 bg-red-50 dark:bg-red-500/10 px-2 py-0.5 rounded mt-2 inline-block">45 Students</span>
         </div>
      </div>

      {/* List Control */}
      <div className="flex flex-col md:flex-row gap-4">
         <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Search by name or admission no..." 
              className="w-full bg-white dark:bg-[#1C1C1E] border border-slate-100 dark:border-white/5 rounded-2xl py-3 pl-12 pr-4 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-ios-blue/50 outline-none"
            />
         </div>
         <div className="flex bg-white dark:bg-[#1C1C1E] p-1 rounded-xl border border-slate-100 dark:border-white/5 w-fit">
            {['All', 'Paid', 'Pending'].map(f => (
               <button 
                 key={f}
                 onClick={() => setFilter(f)}
                 className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${filter === f ? 'bg-slate-900 dark:bg-white text-white dark:text-black shadow-md' : 'text-slate-500'}`}
               >
                 {f}
               </button>
            ))}
         </div>
      </div>

      {/* Student Fee List */}
      <div className="space-y-3">
         {filteredStudents.map((student, i) => (
            <motion.div 
               key={student.admissionNo}
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: i * 0.05 }}
               className="bg-white dark:bg-[#1C1C1E] p-5 rounded-[1.5rem] border border-slate-100 dark:border-white/5 shadow-sm flex flex-col md:flex-row items-center gap-4 md:gap-6"
            >
               <div className="flex items-center gap-4 flex-1 w-full">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-100">
                     <img src={student.avatar} className="w-full h-full object-cover" />
                  </div>
                  <div>
                     <h4 className="font-bold text-slate-900 dark:text-white">{student.name}</h4>
                     <p className="text-xs text-slate-500">{student.admissionNo}</p>
                  </div>
               </div>
               
               <div className="flex items-center justify-between w-full md:w-auto gap-8">
                  <div className="text-right">
                     <p className="text-xs font-bold text-slate-400 uppercase">Status</p>
                     {student.dues > 0 ? (
                        <div className="flex items-center gap-1.5 text-red-500 font-bold">
                           <AlertCircle size={16} /> Pending
                        </div>
                     ) : (
                        <div className="flex items-center gap-1.5 text-green-500 font-bold">
                           <CheckCircle2 size={16} /> Paid
                        </div>
                     )}
                  </div>

                  <div className="text-right w-24">
                     <p className="text-xs font-bold text-slate-400 uppercase">Amount</p>
                     <p className={`text-lg font-bold ${student.dues > 0 ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>
                        ₹ {student.dues > 0 ? student.dues : '0'}
                     </p>
                  </div>

                  <button className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full transition-colors">
                     <MoreVertical size={20} className="text-slate-400" />
                  </button>
               </div>
            </motion.div>
         ))}
      </div>
    </div>
  );
};
