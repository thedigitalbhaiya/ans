
import React, { useContext, useState } from 'react';
import { SchoolContext, AuthContext } from '../../App';
import { Plus, Save, Trash2, GraduationCap } from 'lucide-react';
import { motion } from 'framer-motion';

export const AdminResults: React.FC = () => {
  const { examResults, setExamResults } = useContext(SchoolContext);
  const { currentStudent } = useContext(AuthContext);
  const [term, setTerm] = useState('Mid-Term');
  
  // Local state for the form
  const [subjects, setSubjects] = useState(
    examResults[term as keyof typeof examResults] || []
  );

  const handleScoreChange = (index: number, val: string) => {
    const newSubjects = [...subjects];
    newSubjects[index].score = Number(val);
    setSubjects(newSubjects);
  };

  const handleAddSubject = () => {
    setSubjects([...subjects, { name: 'New Subject', score: 0, grade: 'F', color: 'bg-gray-500' }]);
  };

  const handleRemoveSubject = (index: number) => {
    const newSubjects = subjects.filter((_, i) => i !== index);
    setSubjects(newSubjects);
  };

  const handleSave = () => {
    setExamResults({
      ...examResults,
      [term]: subjects
    });
    alert(`Results for ${term} published successfully!`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
         <div className="w-12 h-12 bg-ios-blue/10 rounded-full flex items-center justify-center text-ios-blue">
            <GraduationCap size={24} />
         </div>
         <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Result Manager</h1>
            <p className="text-slate-500 text-sm">Editing for: <span className="font-bold text-slate-700 dark:text-slate-300">{currentStudent.name}</span></p>
         </div>
      </div>

      <div className="bg-white dark:bg-[#1C1C1E] p-6 rounded-[2rem] shadow-sm border border-slate-100 dark:border-white/5">
         <div className="flex gap-4 mb-6">
            <select 
               value={term} 
               onChange={(e) => {
                  setTerm(e.target.value);
                  // Reset subjects view when term changes to reflect current context or default
                  setSubjects(examResults[e.target.value as keyof typeof examResults] || []);
               }}
               className="p-3 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 font-bold text-slate-900 dark:text-white"
            >
               <option>Mid-Term</option>
               <option>Unit Test 1</option>
               <option>Finals</option>
            </select>
         </div>

         <div className="space-y-3">
            {subjects.map((sub, index) => (
               <motion.div 
                 key={index}
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 className="flex items-center gap-3 bg-slate-50 dark:bg-black/20 p-3 rounded-xl"
               >
                  <input 
                     type="text" 
                     value={sub.name} 
                     onChange={(e) => {
                        const newSubjects = [...subjects];
                        newSubjects[index].name = e.target.value;
                        setSubjects(newSubjects);
                     }}
                     className="flex-1 bg-transparent font-bold outline-none text-slate-900 dark:text-white"
                     placeholder="Subject Name"
                  />
                  <div className="flex items-center gap-2">
                     <span className="text-xs text-slate-400 font-bold uppercase">Marks</span>
                     <input 
                        type="number" 
                        value={sub.score} 
                        onChange={(e) => handleScoreChange(index, e.target.value)}
                        className="w-16 p-2 rounded-lg bg-white dark:bg-[#1C1C1E] text-center font-bold outline-none border border-slate-200 dark:border-white/10"
                     />
                  </div>
                  <button 
                     onClick={() => handleRemoveSubject(index)}
                     className="p-2 text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                     <Trash2 size={18} />
                  </button>
               </motion.div>
            ))}
         </div>

         <div className="flex gap-4 mt-6">
            <button 
               onClick={handleAddSubject}
               className="flex-1 py-3 border-2 border-dashed border-slate-300 dark:border-white/20 rounded-xl text-slate-400 font-bold flex items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
            >
               <Plus size={20} /> Add Subject
            </button>
            <button 
               onClick={handleSave}
               className="flex-1 py-3 bg-ios-blue text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-transform"
            >
               <Save size={20} /> Publish Results
            </button>
         </div>
      </div>
    </div>
  );
};
