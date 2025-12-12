
import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { Award, Trophy, Calendar, Star } from 'lucide-react';
import { AuthContext, SchoolContext } from '../App';

export const Achievements: React.FC = () => {
  const { currentStudent } = useContext(AuthContext);
  const { achievements } = useContext(SchoolContext);

  const myAchievements = achievements
    .filter(a => a.studentId === currentStudent.admissionNo)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const getGradient = (cat: string) => {
    switch(cat) {
      case 'Gold': return 'from-yellow-400 to-amber-600';
      case 'Silver': return 'from-slate-300 to-slate-500';
      case 'Bronze': return 'from-orange-300 to-orange-600';
      case 'Special': return 'from-indigo-500 to-purple-600';
      default: return 'from-slate-700 to-slate-900';
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
           <Trophy className="text-yellow-500" size={32} /> My Achievements
        </h1>
        <p className="text-slate-500 dark:text-slate-400">Celebrating your academic and extracurricular success.</p>
      </div>

      {myAchievements.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {myAchievements.map((award, index) => (
              <motion.div 
                 key={award.id}
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: index * 0.1 }}
                 className={`relative overflow-hidden rounded-[2rem] p-8 text-white shadow-xl bg-gradient-to-br ${getGradient(award.category)}`}
              >
                 <div className="absolute top-0 right-0 p-4 opacity-20">
                    <Award size={100} />
                 </div>
                 <div className="relative z-10 flex flex-col h-full justify-between">
                    <div>
                       <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider mb-4 border border-white/20 backdrop-blur-md">
                          {award.category} Award
                       </span>
                       <h3 className="text-2xl font-extrabold leading-tight mb-2">{award.title}</h3>
                       {award.description && (
                          <p className="text-white/90 text-sm leading-relaxed mb-4">{award.description}</p>
                       )}
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-white/80 uppercase tracking-widest pt-4 border-t border-white/10">
                       <Calendar size={14} /> {new Date(award.date).toLocaleDateString(undefined, { dateStyle: 'long' })}
                    </div>
                 </div>
              </motion.div>
           ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
           <div className="w-24 h-24 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-6 text-slate-300">
              <Award size={48} />
           </div>
           <h3 className="text-xl font-bold text-slate-900 dark:text-white">No Awards Yet</h3>
           <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-xs mx-auto">
              Keep participating and excelling to earn badges and awards here!
           </p>
        </div>
      )}
    </div>
  );
};
