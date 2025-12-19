
import React, { useContext, useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Calendar, Medal, Download, X, Sparkles, Star, Crown, Award, Share2, ChevronRight, Lock } from 'lucide-react';
import { AuthContext, SchoolContext } from '../App';
import { Achievement } from '../types';
import { Link } from 'react-router-dom';

export const Achievements: React.FC = () => {
  const { currentStudent, isLoggedIn } = useContext(AuthContext);
  const { achievements, setIsModalOpen } = useContext(SchoolContext);
  const [filter, setFilter] = useState('All');
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);

  // Sync modal state with global context to hide bottom navigation if needed
  useEffect(() => {
    setIsModalOpen(!!selectedAchievement);
    return () => setIsModalOpen(false);
  }, [selectedAchievement, setIsModalOpen]);

  // Data Filtering with Guard
  const myAchievements = useMemo(() => {
    if (!isLoggedIn || !currentStudent) return [];
    return achievements
      .filter(a => a.studentId === currentStudent.admissionNo)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [achievements, currentStudent, isLoggedIn]);

  const filteredAchievements = myAchievements.filter(a => filter === 'All' || a.category === filter);

  // Summary Stats
  const stats = useMemo(() => ({
    total: myAchievements.length,
    gold: myAchievements.filter(a => a.category === 'Gold').length,
    silver: myAchievements.filter(a => a.category === 'Silver').length,
    bronze: myAchievements.filter(a => a.category === 'Bronze').length,
  }), [myAchievements]);

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-20 h-20 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-6 text-slate-400">
          <Lock size={32} />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Hall of Fame Locked</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-xs mx-auto">Please login to view your personal awards and achievements.</p>
        <Link to="/profile" className="mt-8 px-8 py-3 bg-ios-blue text-white font-bold rounded-2xl shadow-lg shadow-ios-blue/20">Login Now</Link>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20">
      
      {/* 1. Header & Stats Section */}
      <div className="space-y-6">
        <div className="px-1">
          <h1 className="text-[34px] font-[900] text-slate-900 dark:text-white tracking-tight leading-none">Hall of Fame</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Celebrating your excellence at Azim National School</p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <StatMiniCard label="Gold" value={stats.gold} color="text-yellow-600" bg="bg-yellow-50 dark:bg-yellow-500/10" icon={Crown} />
          <StatMiniCard label="Silver" value={stats.silver} color="text-slate-500" bg="bg-slate-50 dark:bg-white/5" icon={Medal} />
          <StatMiniCard label="Bronze" value={stats.bronze} color="text-orange-600" bg="bg-orange-50 dark:bg-orange-500/10" icon={Award} />
        </div>
      </div>

      {/* 2. Filter Bar */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 px-1">
        {['All', 'Gold', 'Silver', 'Bronze', 'Special'].map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all border ${
              filter === t 
              ? 'bg-slate-900 dark:bg-white text-white dark:text-black border-transparent shadow-md scale-105' 
              : 'bg-white dark:bg-[#1C1C1E] text-slate-400 border-slate-100 dark:border-white/5'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* 3. Achievements Grid */}
      {filteredAchievements.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAchievements.map((award, index) => (
            <motion.div 
              key={award.id}
              layoutId={`award-${award.id}`}
              onClick={() => setSelectedAchievement(award)}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group bg-white dark:bg-[#1C1C1E] rounded-[2.25rem] p-6 shadow-sm hover:shadow-xl border border-slate-100 dark:border-white/5 transition-all cursor-pointer flex flex-col justify-between min-h-[180px] relative overflow-hidden"
            >
              {/* Subtle background glow based on category */}
              <div className={`absolute -right-12 -top-12 w-32 h-32 blur-[60px] opacity-20 pointer-events-none ${
                award.category === 'Gold' ? 'bg-yellow-400' : award.category === 'Silver' ? 'bg-slate-400' : 'bg-orange-400'
              }`}></div>

              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner ${
                    award.category === 'Gold' ? 'bg-yellow-50 text-yellow-600' : 
                    award.category === 'Silver' ? 'bg-slate-50 text-slate-500' : 
                    'bg-orange-50 text-orange-600'
                  }`}>
                    {award.category === 'Gold' ? <Crown size={24} /> : award.category === 'Silver' ? <Medal size={24} /> : <Award size={24} />}
                  </div>
                  <ChevronRight size={18} className="text-slate-300 group-hover:text-ios-blue group-hover:translate-x-1 transition-all" />
                </div>
                
                <h3 className="text-lg font-black text-slate-900 dark:text-white leading-tight line-clamp-2">{award.title}</h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">{award.category} Achievement</p>
              </div>

              <div className="relative z-10 pt-4 mt-4 border-t border-slate-50 dark:border-white/5 flex items-center gap-2 text-slate-400">
                <Calendar size={12} />
                <span className="text-[11px] font-bold uppercase tracking-tighter">{new Date(award.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-[#1C1C1E] rounded-[2.5rem] p-12 text-center border border-slate-100 dark:border-white/5 shadow-sm">
          <div className="w-20 h-20 bg-slate-50 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-200 dark:text-slate-700">
            <Trophy size={40} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">No Awards Yet</h3>
          <p className="text-slate-500 text-sm mt-2 max-w-xs mx-auto leading-relaxed">Keep up the hard work! Your future achievements will be showcased right here in your digital trophy cabinet.</p>
        </div>
      )}

      {/* 4. Full Detail Modal */}
      <AnimatePresence>
        {selectedAchievement && createPortal(
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedAchievement(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div 
              layoutId={`award-${selectedAchievement.id}`}
              className="relative w-full max-w-sm bg-white dark:bg-[#1C1C1E] rounded-[3rem] shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="absolute top-6 right-6 z-20">
                <button onClick={() => setSelectedAchievement(null)} className="p-2 bg-black/5 dark:bg-white/5 rounded-full backdrop-blur-md">
                  <X size={20} className="text-slate-600 dark:text-slate-300" />
                </button>
              </div>

              {/* Minimal Header Section */}
              <div className={`h-48 w-full flex items-center justify-center relative overflow-hidden ${
                selectedAchievement.category === 'Gold' ? 'bg-yellow-400' : selectedAchievement.category === 'Silver' ? 'bg-slate-400' : 'bg-orange-400'
              }`}>
                <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent"></div>
                <motion.div 
                  initial={{ scale: 0.5, opacity: 0, rotate: -20 }}
                  animate={{ scale: 1, opacity: 1, rotate: 0 }}
                  className="text-white drop-shadow-2xl"
                >
                  {selectedAchievement.category === 'Gold' ? <Crown size={80} /> : selectedAchievement.category === 'Silver' ? <Medal size={80} /> : <Award size={80} />}
                </motion.div>
                <div className="absolute bottom-4 text-white/50 text-[10px] font-black uppercase tracking-[0.3em]">Official Record</div>
              </div>

              {/* Award Details */}
              <div className="p-10 flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full border-4 border-white dark:border-[#1C1C1E] shadow-xl overflow-hidden -mt-20 relative z-10 bg-slate-200">
                   <img src={currentStudent?.profilePic || currentStudent?.avatar} className="w-full h-full object-cover" alt="" />
                </div>

                <div className="mt-6 mb-2">
                   <span className="px-4 py-1.5 rounded-full bg-slate-100 dark:bg-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                      {selectedAchievement.category} Medalist
                   </span>
                </div>

                <h2 className="text-3xl font-black text-slate-900 dark:text-white leading-tight tracking-tight mb-4">
                  {selectedAchievement.title}
                </h2>
                
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed mb-8">
                  {selectedAchievement.description || `This award recognizes ${currentStudent?.name}'s outstanding performance and dedication to excellence.`}
                </p>

                <div className="flex gap-3 w-full">
                  <button className="flex-1 py-4 bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white rounded-[1.5rem] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-all">
                    <Share2 size={16} /> Share
                  </button>
                  <button onClick={() => alert('Certificate Downloaded!')} className="flex-1 py-4 bg-ios-blue text-white rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-lg shadow-ios-blue/30 flex items-center justify-center gap-2 active:scale-95 transition-all">
                    <Download size={16} /> Save
                  </button>
                </div>
              </div>
            </motion.div>
          </div>,
          document.body
        )}
      </AnimatePresence>
    </div>
  );
};

// Internal Helper for Stats
const StatMiniCard = ({ label, value, color, bg, icon: Icon }: any) => (
  <div className={`p-4 rounded-[1.75rem] ${bg} flex flex-col items-center justify-center text-center border border-black/5 dark:border-white/5`}>
    <Icon size={24} className={`${color} mb-2`} />
    <span className="text-2xl font-black text-slate-900 dark:text-white leading-none">{value}</span>
    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">{label}</span>
  </div>
);
