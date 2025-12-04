
import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';
import { 
  User, 
  Phone, 
  MapPin, 
  LogOut,
  Users,
  Fingerprint,
  Calendar,
  Shield,
  MessageCircle,
  Copy
} from 'lucide-react';
import { Login } from './Login';

export const Profile: React.FC = () => {
  const { logout, login, currentStudent, isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = () => {
    login();
    navigate('/');
  };

  if (!isLoggedIn) {
    return (
      <div className="max-w-md mx-auto space-y-8">
        <div className="text-center space-y-2">
           <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Welcome Back</h1>
           <p className="text-slate-500 dark:text-slate-400">Access your school portal</p>
        </div>
        
        {/* Embedded Login Component */}
        <div className="bg-white dark:bg-[#1C1C1E] rounded-[2.5rem] p-2 shadow-xl border border-slate-100 dark:border-white/5">
           <Login onLogin={handleLogin} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-10 px-4 md:px-0">
      
      {/* Header with blurred background effect */}
      <div className="relative pt-6 pb-6 flex flex-col items-center">
         {/* Decorative background elements */}
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-48 bg-gradient-to-b from-ios-blue/5 to-transparent rounded-b-[3rem] -z-10 dark:from-white/5"></div>
         
         <motion.div
           initial={{ scale: 0.9, opacity: 0 }}
           animate={{ scale: 1, opacity: 1 }}
           className="relative mb-4"
         >
            <div className="w-36 h-36 rounded-full overflow-hidden border-[6px] border-white dark:border-[#1C1C1E] shadow-2xl bg-slate-200">
              <img src={currentStudent.avatar} alt="Profile" className="w-full h-full object-cover" />
            </div>
            <div className="absolute bottom-2 right-2 w-8 h-8 bg-green-500 rounded-full border-[4px] border-white dark:border-[#1C1C1E] flex items-center justify-center">
               <div className="w-2.5 h-2.5 bg-white rounded-full animate-pulse"></div>
            </div>
         </motion.div>
         
         <div className="text-center space-y-1">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{currentStudent.name}</h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium text-lg flex items-center justify-center gap-2">
               Class {currentStudent.class} 
               <span className="w-1 h-1 rounded-full bg-slate-400"></span> 
               Roll No. {currentStudent.rollNo}
            </p>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (Personal & Academic) - spans 7 cols on large screens */}
        <div className="lg:col-span-7 space-y-6">
           
           {/* Academic & Personal Info Combined Card */}
           <motion.div
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             className="bg-white dark:bg-[#1C1C1E] p-6 md:p-8 rounded-[2rem] shadow-sm border border-slate-100 dark:border-white/5"
           >
              <div className="flex items-center gap-3 mb-6">
                 <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-500/10 text-ios-blue dark:text-blue-400 flex items-center justify-center">
                   <User size={24} />
                 </div>
                 <div>
                   <h3 className="text-lg font-bold text-slate-900 dark:text-white">Student Details</h3>
                   <p className="text-xs text-slate-500 dark:text-slate-400">Personal & Academic Information</p>
                 </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-8">
                 <InfoItem label="Admission No" value={currentStudent.admissionNo} icon={<Fingerprint size={16}/>} />
                 <InfoItem label="Session" value={currentStudent.session} icon={<Calendar size={16}/>} />
                 <InfoItem label="Date of Birth" value={currentStudent.dob} />
                 <InfoItem label="Gender" value={currentStudent.gender} />
                 <InfoItem label="Blood Group" value={currentStudent.bloodGroup} highlight />
                 <InfoItem label="Category" value={currentStudent.category} />
              </div>
           </motion.div>

           {/* Family Info */}
           <motion.div
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.1 }}
             className="bg-white dark:bg-[#1C1C1E] p-6 md:p-8 rounded-[2rem] shadow-sm border border-slate-100 dark:border-white/5"
           >
              <div className="flex items-center gap-3 mb-6">
                 <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                   <Users size={24} />
                 </div>
                 <div>
                   <h3 className="text-lg font-bold text-slate-900 dark:text-white">Family & Contact</h3>
                   <p className="text-xs text-slate-500 dark:text-slate-400">Parents & Communication</p>
                 </div>
              </div>

              <div className="space-y-6">
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-1">
                       <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Father's Name</label>
                       <p className="text-base font-semibold text-slate-900 dark:text-white">{currentStudent.fatherName}</p>
                    </div>
                    <div className="space-y-1">
                       <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Mother's Name</label>
                       <p className="text-base font-semibold text-slate-900 dark:text-white">{currentStudent.motherName}</p>
                    </div>
                 </div>
                 
                 <div className="pt-6 border-t border-slate-50 dark:border-white/5 grid grid-cols-1 gap-6">
                     <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-green-50 dark:bg-green-500/10 flex items-center justify-center text-green-600 flex-shrink-0">
                           <Phone size={18} />
                        </div>
                        <div>
                           <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Mobile Number</label>
                           <p className="text-base font-semibold text-slate-900 dark:text-white">+91 {currentStudent.mobile}</p>
                        </div>
                     </div>
                     <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center text-orange-600 flex-shrink-0">
                           <MapPin size={18} />
                        </div>
                        <div>
                           <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Address</label>
                           <p className="text-base font-semibold text-slate-900 dark:text-white leading-relaxed">{currentStudent.address}</p>
                        </div>
                     </div>
                 </div>
              </div>
           </motion.div>
        </div>

        {/* Right Column (Login, WhatsApp, Actions) - spans 5 cols on large screens */}
        <div className="lg:col-span-5 space-y-6">
           
           {/* Login Credentials Card - Enhanced */}
           <motion.div
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.2 }}
             className="bg-gradient-to-br from-slate-900 to-slate-800 dark:from-white dark:to-slate-100 p-8 rounded-[2rem] shadow-xl text-white dark:text-slate-900 relative overflow-hidden"
           >
              {/* Abstract decorative circles */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 dark:bg-black/5 rounded-full -mr-10 -mt-10 blur-xl"></div>
              
              <div className="flex items-center gap-3 mb-8 relative z-10">
                 <div className="w-10 h-10 rounded-xl bg-white/10 dark:bg-black/10 flex items-center justify-center">
                   <Shield size={20} />
                 </div>
                 <h3 className="text-lg font-bold">Portal Access</h3>
              </div>

              <div className="space-y-6 relative z-10">
                 <div className="space-y-2">
                    <div className="flex justify-between items-center">
                       <label className="text-xs font-bold opacity-60 uppercase tracking-widest">Username / ID</label>
                       <Copy size={14} className="opacity-60 hover:opacity-100 cursor-pointer transition-opacity" />
                    </div>
                    <div className="bg-white/10 dark:bg-black/5 p-4 rounded-xl font-mono text-xl tracking-wide font-medium">
                       {currentStudent.admissionNo}
                    </div>
                 </div>
                 
                 <div className="space-y-2">
                    <label className="text-xs font-bold opacity-60 uppercase tracking-widest">Password</label>
                    <div className="bg-white/10 dark:bg-black/5 p-4 rounded-xl font-mono text-xl tracking-[0.5em] font-medium flex items-center h-[60px]">
                       ••••••••
                    </div>
                 </div>
              </div>
           </motion.div>

           {/* WhatsApp Group Card */}
           <motion.div
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.3 }}
             className="bg-[#25D366] p-1 rounded-[2rem] shadow-xl shadow-green-500/20"
           >
              <div className="bg-[#25D366] p-6 rounded-[1.8rem] flex flex-col items-center text-center text-white">
                 <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4">
                    <MessageCircle size={32} />
                 </div>
                 <h3 className="text-xl font-bold mb-1">Class {currentStudent.class} Group</h3>
                 <p className="text-green-100 text-sm mb-6">Join your official class group for updates.</p>
                 <button 
                   onClick={() => window.open('https://chat.whatsapp.com', '_blank')}
                   className="w-full py-3.5 bg-white text-[#25D366] font-bold rounded-xl shadow-sm hover:bg-green-50 transition-colors flex items-center justify-center gap-2"
                 >
                   Join via WhatsApp
                 </button>
              </div>
           </motion.div>

           {/* Logout Button */}
           <motion.button 
             onClick={logout}
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 0.4 }}
             className="w-full py-4 rounded-[2rem] bg-red-50 text-red-500 dark:bg-red-500/10 dark:text-red-400 font-bold text-sm hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors flex items-center justify-center gap-2 border border-red-100 dark:border-transparent"
           >
             <LogOut size={18} />
             Secure Sign Out
           </motion.button>
        </div>
      </div>
    </div>
  );
};

// Helper Component for consistency
const InfoItem = ({ label, value, icon, highlight = false }: { label: string, value: string, icon?: React.ReactNode, highlight?: boolean }) => (
  <div className="space-y-1.5">
     <div className="flex items-center gap-1.5 text-slate-400">
        {icon}
        <span className="text-xs font-bold uppercase tracking-wider">{label}</span>
     </div>
     <p className={`text-base font-semibold ${highlight ? 'text-ios-blue dark:text-blue-400' : 'text-slate-900 dark:text-white'}`}>
        {value}
     </p>
  </div>
);
