
import React, { useContext, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, 
  Link as LinkIcon,
  CheckCircle2,
  Circle,
  Users,
  Lock
} from 'lucide-react';
import { SchoolContext, AuthContext } from '../../App';

const CLASSES = ["Nursery", "LKG", "UKG", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];
const SECTIONS = ["A", "B", "C", "D"];

export const AdminSocials: React.FC = () => {
  const { socialLinks, updateSocialLink } = useContext(SchoolContext);
  const { currentAdmin } = useContext(AuthContext);
  
  const isTeacher = currentAdmin?.role === 'Teacher';
  const teacherClass = currentAdmin?.assignedClass || 'X';
  const teacherSection = currentAdmin?.assignedSection || 'A';

  const [selectedClass, setSelectedClass] = useState(isTeacher ? teacherClass : "X");

  // Lock to teacher's class if applicable
  useEffect(() => {
    if (isTeacher) {
        setSelectedClass(teacherClass);
    }
  }, [isTeacher, teacherClass]);

  // Helper to check validity
  const isValidLink = (link: string) => link.startsWith('https://');

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
           <MessageCircle size={32} className="text-[#25D366]" /> Class WhatsApp Manager
        </h1>
        <p className="text-slate-500 dark:text-slate-400">Assign specific group links for each class and section.</p>
      </div>

      {/* Class Selector Scroll - Hide or Disable for Teachers */}
      {!isTeacher ? (
        <div className="bg-white dark:bg-[#1C1C1E] p-2 rounded-2xl shadow-sm border border-slate-100 dark:border-white/5 overflow-x-auto no-scrollbar sticky top-0 z-10">
            <div className="flex gap-2 min-w-max">
                {CLASSES.map((cls) => (
                <button
                    key={cls}
                    onClick={() => setSelectedClass(cls)}
                    className={`
                        px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300
                        ${selectedClass === cls 
                            ? 'bg-slate-900 dark:bg-white text-white dark:text-black shadow-lg scale-105' 
                            : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-white/10'}
                    `}
                >
                    Class {cls}
                </button>
                ))}
            </div>
        </div>
      ) : (
        <div className="bg-blue-50 dark:bg-blue-500/10 p-4 rounded-2xl border border-blue-100 dark:border-blue-500/20 flex items-center gap-3 text-blue-700 dark:text-blue-300">
            <Lock size={20} />
            <span className="font-bold text-sm">Restricted Mode: Editing for your assigned Class {teacherClass} only.</span>
        </div>
      )}

      {/* Section Matrix */}
      <div className="bg-white dark:bg-[#1C1C1E] rounded-[2.5rem] p-8 shadow-sm border border-slate-100 dark:border-white/5 min-h-[400px]">
         <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-slate-100 dark:bg-white/10 rounded-2xl flex items-center justify-center">
               <Users size={28} className="text-slate-700 dark:text-slate-300" />
            </div>
            <div>
               <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Managing Class {selectedClass}</h2>
               <p className="text-slate-500 dark:text-slate-400 text-sm">Paste invite links for each section below</p>
            </div>
         </div>

         <div className="grid gap-6">
            {SECTIONS.map((section, index) => {
               const key = `${selectedClass}-${section}`;
               const currentLink = socialLinks[key] || '';
               const hasValidLink = isValidLink(currentLink);
               
               // If teacher, only allow editing their section? Or whole class?
               // Requirement says "gc link of their class", implies full class access or specific section.
               // Let's assume full class access for simplicity, or just highlight their section.
               const isAssignedSection = isTeacher ? section === teacherSection : true;

               return (
                  <motion.div 
                     key={key}
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ delay: index * 0.05 }}
                     className={`
                        group relative flex flex-col md:flex-row items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-300
                        ${hasValidLink 
                           ? 'border-green-500/30 bg-green-50/30 dark:bg-green-500/5' 
                           : 'border-slate-100 dark:border-white/10 bg-slate-50 dark:bg-black/20 focus-within:border-ios-blue'}
                        ${!isAssignedSection && isTeacher ? 'opacity-50 pointer-events-none grayscale' : ''}
                     `}
                  >
                     {/* Section Badge */}
                     <div className="w-full md:w-auto flex justify-between md:justify-start items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg shadow-sm border ${isAssignedSection ? 'bg-white dark:bg-white/10 text-slate-900 dark:text-white border-slate-100 dark:border-white/5' : 'bg-slate-200 dark:bg-white/5 text-slate-400 border-transparent'}`}>
                           {section}
                        </div>
                        <div className="md:hidden">
                           {hasValidLink ? <CheckCircle2 className="text-green-500" size={24} /> : <Circle className="text-slate-300" size={24} />}
                        </div>
                     </div>

                     {/* Input Field */}
                     <div className="flex-1 w-full relative">
                        <LinkIcon size={18} className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${hasValidLink ? 'text-green-600' : 'text-slate-400'}`} />
                        <input 
                           type="text" 
                           placeholder={isAssignedSection ? "Paste WhatsApp Group Link..." : "Restricted Section"}
                           value={currentLink}
                           onChange={(e) => updateSocialLink(selectedClass, section, e.target.value)}
                           disabled={!isAssignedSection}
                           className="w-full pl-12 pr-4 py-4 rounded-xl bg-white dark:bg-[#2C2C2E] border-none outline-none focus:ring-2 focus:ring-ios-blue/50 text-slate-900 dark:text-white font-medium shadow-sm transition-all disabled:bg-transparent disabled:shadow-none"
                        />
                     </div>

                     {/* Desktop Status Indicator */}
                     <div className="hidden md:flex w-12 justify-center">
                        <AnimatePresence>
                           {hasValidLink ? (
                              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                                 <CheckCircle2 className="text-green-500" size={28} />
                              </motion.div>
                           ) : (
                              <Circle className="text-slate-200 dark:text-slate-700" size={28} />
                           )}
                        </AnimatePresence>
                     </div>
                  </motion.div>
               );
            })}
         </div>
      </div>
    </div>
  );
};
