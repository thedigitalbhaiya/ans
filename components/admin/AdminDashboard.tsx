
import React from 'react';
import { motion } from 'framer-motion';
import { Users, CreditCard, CalendarDays, TrendingUp, Bell, ArrowRight, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminDashboard: React.FC = () => {
  const stats = [
    { label: 'Total Students', value: '1,248', icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Total Staff', value: '86', icon: UserPlus, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { label: 'Fees Collected', value: '₹ 24.5L', icon: CreditCard, color: 'text-green-500', bg: 'bg-green-500/10' },
    { label: 'Attendance', value: '94%', icon: CalendarDays, color: 'text-orange-500', bg: 'bg-orange-500/10' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Admin Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Overview of school performance</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500 bg-white dark:bg-[#1C1C1E] px-4 py-2 rounded-xl shadow-sm border border-slate-100 dark:border-white/5">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          Academic Session 2025-26
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-[#1C1C1E] p-6 rounded-[2rem] shadow-sm border border-slate-100 dark:border-white/5 flex flex-col justify-between h-40 group"
          >
            <div className="flex justify-between items-start">
              <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <span className="text-xs font-bold text-green-500 flex items-center gap-1 bg-green-500/10 px-2 py-1 rounded-lg">
                <TrendingUp size={12} /> +2.4%
              </span>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">{stat.value}</h3>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Recent Activities / Notices */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-[#1C1C1E] rounded-[2rem] p-8 shadow-sm border border-slate-100 dark:border-white/5"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Recent Circulars</h3>
            <Link to="/circulars" className="text-ios-blue text-sm font-bold flex items-center gap-1">View All <ArrowRight size={16}/></Link>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4 p-3 hover:bg-slate-50 dark:hover:bg-white/5 rounded-2xl transition-colors cursor-pointer group">
                <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-white/10 flex items-center justify-center text-slate-400 group-hover:text-ios-blue transition-colors">
                  <Bell size={20} />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">Winter Holiday Announcement</h4>
                  <p className="text-xs text-slate-500 mt-1">Published on 24 Oct, 2025</p>
                </div>
                <ChevronRight size={20} className="text-slate-300" />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-slate-900 dark:bg-white rounded-[2rem] p-8 text-white dark:text-black shadow-xl"
        >
          <h3 className="text-xl font-bold mb-6">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <button className="bg-white/10 dark:bg-black/5 hover:bg-white/20 dark:hover:bg-black/10 transition-colors p-4 rounded-xl text-left">
              <UserPlus size={24} className="mb-3" />
              <span className="block font-bold text-sm">Add Student</span>
            </button>
             <button className="bg-white/10 dark:bg-black/5 hover:bg-white/20 dark:hover:bg-black/10 transition-colors p-4 rounded-xl text-left">
              <Bell size={24} className="mb-3" />
              <span className="block font-bold text-sm">Post Notice</span>
            </button>
             <button className="bg-white/10 dark:bg-black/5 hover:bg-white/20 dark:hover:bg-black/10 transition-colors p-4 rounded-xl text-left">
              <CreditCard size={24} className="mb-3" />
              <span className="block font-bold text-sm">Record Fee</span>
            </button>
             <button className="bg-white/10 dark:bg-black/5 hover:bg-white/20 dark:hover:bg-black/10 transition-colors p-4 rounded-xl text-left">
              <CalendarDays size={24} className="mb-3" />
              <span className="block font-bold text-sm">Mark Staff</span>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// Simple Chevron component for local use
const ChevronRight = ({ size, className }: { size: number, className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="m9 18 6-6-6-6"/>
  </svg>
);
