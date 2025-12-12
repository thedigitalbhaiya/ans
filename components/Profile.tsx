
import React, { useContext, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext, SchoolContext } from '../App';
import { LogOut, Camera, Loader2, QrCode, Copy, Phone, MapPin, School } from 'lucide-react';
import { Login } from './Login';

export const Profile: React.FC = () => {
  const { logout, currentStudent, isLoggedIn, updateStudentData } = useContext(AuthContext);
  const { socialLinks } = useContext(SchoolContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check for alert message from redirection
  const alertMessage = location.state?.message;

  const handleLoginSuccess = () => {}; // Handled by AuthContext navigation

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 500000) return alert("Image too large. Max 500KB.");
      setIsUploading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        updateStudentData({ ...currentStudent, profilePic: reader.result as string });
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-full max-w-sm bg-white dark:bg-[#1C1C1E] p-8 rounded-[2.5rem] shadow-apple border border-slate-100 dark:border-white/5">
           <Login onLoginSuccess={handleLoginSuccess} alertMessage={alertMessage} />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto space-y-8 pb-20">
      
      <div className="text-center">
         <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Student ID</h1>
         <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">Official Digital Card</p>
      </div>

      {/* APPLE WALLET STYLE CARD */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative w-full aspect-[3/4.5] max-w-[360px] mx-auto bg-gradient-to-br from-ios-blue to-blue-600 rounded-[2rem] shadow-2xl shadow-blue-500/30 overflow-hidden text-white p-8 flex flex-col justify-between"
      >
         {/* Top Pattern */}
         <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
         
         {/* Header */}
         <div className="relative z-10 flex justify-between items-start">
            <div className="flex items-center gap-2">
               <School className="text-white/80" size={24} />
               <span className="font-bold tracking-wider text-sm opacity-90">AZIM NATIONAL SCHOOL</span>
            </div>
            <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold border border-white/20">
               2025-26
            </span>
         </div>

         {/* Photo & Name */}
         <div className="relative z-10 flex flex-col items-center text-center mt-6">
            <div 
               onClick={() => fileInputRef.current?.click()}
               className="w-32 h-32 rounded-full border-4 border-white/30 shadow-xl overflow-hidden mb-4 relative group cursor-pointer bg-white/10"
            >
               <img src={currentStudent.profilePic || currentStudent.avatar} className="w-full h-full object-cover" alt="" />
               <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  {isUploading ? <Loader2 className="animate-spin" /> : <Camera />}
               </div>
            </div>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handlePhotoUpload} />
            
            <h2 className="text-3xl font-extrabold tracking-tight leading-tight">{currentStudent.name}</h2>
            <p className="text-blue-100 font-medium text-lg mt-1">Class {currentStudent.class} - {currentStudent.section}</p>
         </div>

         {/* Details Grid */}
         <div className="relative z-10 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 mt-6 grid grid-cols-2 gap-4">
            <div>
               <p className="text-[10px] uppercase font-bold text-blue-200 tracking-wider">Admission No</p>
               <p className="font-bold text-sm truncate">{currentStudent.admissionNo}</p>
            </div>
            <div>
               <p className="text-[10px] uppercase font-bold text-blue-200 tracking-wider">Roll No</p>
               <p className="font-bold text-sm">{currentStudent.rollNo}</p>
            </div>
            <div>
               <p className="text-[10px] uppercase font-bold text-blue-200 tracking-wider">DOB</p>
               <p className="font-bold text-sm">{currentStudent.dob}</p>
            </div>
            <div>
               <p className="text-[10px] uppercase font-bold text-blue-200 tracking-wider">Blood Group</p>
               <p className="font-bold text-sm">{currentStudent.bloodGroup}</p>
            </div>
         </div>

         {/* Barcode Strip */}
         <div className="relative z-10 mt-auto pt-6 flex items-center justify-between border-t border-white/10">
            <div className="flex flex-col">
               <span className="text-[10px] font-bold text-blue-200 uppercase">Valid Student</span>
               <span className="text-xs font-mono opacity-80">{currentStudent.admissionNo}</span>
            </div>
            <QrCode size={40} className="opacity-90" />
         </div>
      </motion.div>

      {/* Info List */}
      <div className="bg-white dark:bg-[#1C1C1E] rounded-[2rem] shadow-apple border border-slate-100 dark:border-white/5 overflow-hidden">
         <div className="p-4 border-b border-slate-100 dark:border-white/5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center">
               <Phone size={20} className="text-slate-500" />
            </div>
            <div className="flex-1">
               <p className="text-xs font-bold text-slate-400 uppercase">Guardian Contact</p>
               <p className="font-bold text-slate-900 dark:text-white">+91 {currentStudent.mobile}</p>
            </div>
         </div>
         <div className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center">
               <MapPin size={20} className="text-slate-500" />
            </div>
            <div className="flex-1">
               <p className="text-xs font-bold text-slate-400 uppercase">Address</p>
               <p className="font-bold text-slate-900 dark:text-white text-sm leading-tight">{currentStudent.address}</p>
            </div>
         </div>
      </div>

      <button 
         onClick={logout}
         className="w-full py-4 rounded-2xl bg-slate-100 dark:bg-white/5 text-red-500 font-bold text-sm hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors flex items-center justify-center gap-2"
      >
         <LogOut size={18} /> Sign Out
      </button>

    </div>
  );
};
