
import React, { useContext, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../App';
import { 
  User, 
  Phone, 
  MapPin, 
  LogOut,
  Droplets,
  Cake,
  MessageCircle,
  Users,
  BookUser,
  Fingerprint,
  Calendar,
  LogIn,
  ArrowRight
} from 'lucide-react';
import { Logo } from './Logo';
import { Login } from './Login';

export const Profile: React.FC = () => {
  const { logout, login, currentStudent, isLoggedIn } = useContext(AuthContext);
  const [showLogin, setShowLogin] = useState(!isLoggedIn);

  if (!isLoggedIn) {
    return (
      <div className="max-w-md mx-auto space-y-8">
        <div className="text-center space-y-2">
           <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Student Login</h1>
           <p className="text-slate-500 dark:text-slate-400">Access your academic profile</p>
        </div>
        
        {/* Embedded Login Component */}
        <div className="bg-white dark:bg-[#1C1C1E] rounded-[2.5rem] p-2 shadow-xl border border-slate-100 dark:border-white/5">
           <Login onLogin={login} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-2xl mx-auto pb-10">
      {/* 1. Digital Student ID Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-gradient-to-br from-ios-blue via-blue-900 to-indigo-900 rounded-[2rem] shadow-2xl shadow-blue-900/30 text-white p-6 md:p-8"
      >
        {/* Decorative Watermark */}
        <div className="absolute -right-10 -bottom-10 opacity-[0.07] pointer-events-none">
           <Logo className="w-64 h-64" />
        </div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -mr-8 -mt-8"></div>

        {/* Header: School Info */}
        <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-6 relative z-10">
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center p-1.5 shadow-md">
            <Logo className="w-full h-full" />
          </div>
          <div>
            <h2 className="font-bold text-lg leading-tight">Azim National School</h2>
            <p className="text-[10px] text-blue-200 uppercase tracking-widest font-semibold">Bahadurganj • ID Card</p>
          </div>
          <div className="ml-auto text-right">
             <span className="block text-[10px] text-blue-200 uppercase tracking-wider">Session</span>
             <span className="font-bold">{currentStudent.session}</span>
          </div>
        </div>

        {/* Main ID Content */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 relative z-10">
          {/* Photo */}
          <div className="relative">
            <div className="w-32 h-32 rounded-2xl overflow-hidden border-4 border-white/20 shadow-lg bg-slate-800">
               <img src={currentStudent.avatar} alt="Profile" className="w-full h-full object-cover" />
            </div>
            <div className="absolute bottom-2 right-1/2 translate-x-1/2 md:translate-x-12 w-8 h-8 bg-green-500 rounded-full border-4 border-slate-900 flex items-center justify-center shadow-md">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          </div>

          {/* Details */}
          <div className="flex-1 text-center md:text-left space-y-4">
             <div>
                <h1 className="text-2xl font-bold tracking-tight">{currentStudent.name}</h1>
                <div className="flex items-center justify-center md:justify-start gap-2 mt-1">
                   <span className="bg-white/10 px-3 py-1 rounded-md text-xs font-mono tracking-wider text-blue-100 flex items-center gap-1">
                     <Fingerprint size={12} /> ID: {currentStudent.admissionNo}
                   </span>
                </div>
             </div>

             <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-black/20 rounded-xl p-3">
                   <span className="block text-[10px] text-blue-300 uppercase tracking-wider mb-0.5">Class</span>
                   <span className="font-bold text-lg">{currentStudent.class}</span>
                </div>
                <div className="bg-black/20 rounded-xl p-3">
                   <span className="block text-[10px] text-blue-300 uppercase tracking-wider mb-0.5">Roll No</span>
                   <span className="font-bold text-lg">{currentStudent.rollNo}</span>
                </div>
             </div>
          </div>
        </div>
      </motion.div>

      {/* 2. Parent & Contact Details (Requested Prominence) */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-4">Family & Contact</h3>
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-[#1C1C1E] rounded-[2rem] shadow-sm border border-slate-100 dark:border-white/5 overflow-hidden"
        >
          {/* Father */}
          <div className="p-4 border-b border-slate-100 dark:border-white/5 flex gap-4">
             <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0">
               <User size={24} />
             </div>
             <div>
               <p className="text-xs text-slate-400 uppercase tracking-wide font-bold">Father's Name</p>
               <p className="text-lg font-semibold text-slate-900 dark:text-white">{currentStudent.fatherName}</p>
             </div>
          </div>

          {/* Mother */}
          <div className="p-4 border-b border-slate-100 dark:border-white/5 flex gap-4">
             <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center flex-shrink-0">
               <User size={24} />
             </div>
             <div>
               <p className="text-xs text-slate-400 uppercase tracking-wide font-bold">Mother's Name</p>
               <p className="text-lg font-semibold text-slate-900 dark:text-white">{currentStudent.motherName}</p>
             </div>
          </div>

           {/* Mobile */}
           <div className="p-4 border-b border-slate-100 dark:border-white/5 flex gap-4 items-center">
             <div className="w-10 h-10 rounded-xl bg-green-500 flex items-center justify-center text-white shadow-sm flex-shrink-0">
               <Phone size={20} />
             </div>
             <div className="flex-1">
               <p className="text-xs text-slate-400 uppercase tracking-wide font-bold">Mobile</p>
               <p className="text-base font-medium text-slate-900 dark:text-white">{currentStudent.mobile}</p>
             </div>
              <button 
                onClick={() => window.open('https://whatsapp.com', '_blank')}
                className="bg-[#25D366] text-white p-2 rounded-lg"
              >
                <MessageCircle size={20} />
              </button>
          </div>

          {/* Address */}
          <div className="p-4 flex gap-4 items-center">
             <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center text-white shadow-sm flex-shrink-0">
               <MapPin size={20} />
             </div>
             <div>
               <p className="text-xs text-slate-400 uppercase tracking-wide font-bold">Address</p>
               <p className="text-base font-medium text-slate-900 dark:text-white">{currentStudent.address}</p>
             </div>
          </div>
        </motion.div>
      </div>

      {/* 3. Personal Details (Compact) */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-4">Personal Info</h3>
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-[#1C1C1E] rounded-[2rem] shadow-sm border border-slate-100 dark:border-white/5 overflow-hidden grid grid-cols-2 divide-x divide-slate-100 dark:divide-white/5"
        >
           <div className="p-4 flex items-center gap-3 border-b border-slate-100 dark:border-white/5">
              <div className="p-2 bg-pink-100 dark:bg-pink-900/20 text-pink-600 rounded-lg"><Cake size={18} /></div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-bold">DOB</p>
                <p className="text-sm font-semibold dark:text-white">{currentStudent.dob}</p>
              </div>
           </div>
           <div className="p-4 flex items-center gap-3 border-b border-slate-100 dark:border-white/5">
              <div className="p-2 bg-red-100 dark:bg-red-900/20 text-red-600 rounded-lg"><Droplets size={18} /></div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-bold">Blood Group</p>
                <p className="text-sm font-semibold dark:text-white">{currentStudent.bloodGroup}</p>
              </div>
           </div>
           <div className="p-4 flex items-center gap-3">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900/20 text-indigo-600 rounded-lg"><Users size={18} /></div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-bold">Religion</p>
                <p className="text-sm font-semibold dark:text-white">{currentStudent.religion}</p>
              </div>
           </div>
           <div className="p-4 flex items-center gap-3">
              <div className="p-2 bg-teal-100 dark:bg-teal-900/20 text-teal-600 rounded-lg"><BookUser size={18} /></div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-bold">Category</p>
                <p className="text-sm font-semibold dark:text-white">{currentStudent.category}</p>
              </div>
           </div>
        </motion.div>
      </div>
      
      <motion.button 
        onClick={logout}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="w-full py-4 rounded-[2rem] bg-red-50 text-red-500 dark:bg-red-500/10 dark:text-red-400 font-bold text-sm hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors flex items-center justify-center gap-2 mt-4"
      >
        <LogOut size={18} />
        Sign Out
      </motion.button>
    </div>
  );
};
