
import React, { useContext, useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext, SchoolContext } from '../App';
import { 
  LogOut, Camera, Loader2, School, QrCode, 
  User, MapPin, Calendar, Phone, 
  Award, BookOpen, 
  FileText, IdCard, LayoutGrid,
  TrendingUp, X, ShieldCheck, Download,
} from 'lucide-react';
import { Login } from './Login';

export const Profile: React.FC = () => {
  const { logout, currentStudent, isLoggedIn, updateStudentData } = useContext(AuthContext);
  const { settings, achievements } = useContext(SchoolContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Modal States
  const [showPersonalDetails, setShowPersonalDetails] = useState(false);
  const [showDigitalID, setShowDigitalID] = useState(false);

  const alertMessage = location.state?.message;

  // Filter Achievements
  const myAchievements = achievements.filter(a => a.studentId === currentStudent.admissionNo);

  const handleLoginSuccess = () => {}; 

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

  const getGradient = (cat: string) => {
    switch(cat) {
      case 'Gold': return 'from-yellow-400 to-amber-600';
      case 'Silver': return 'from-slate-300 to-slate-500';
      case 'Bronze': return 'from-orange-300 to-orange-600';
      case 'Special': return 'from-indigo-500 to-purple-600';
      default: return 'from-slate-700 to-slate-900';
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] pb-10">
        <div className="w-full max-w-sm bg-white dark:bg-[#1C1C1E] p-8 rounded-[2.5rem] shadow-apple border border-slate-100 dark:border-white/5 relative z-10">
           <Login onLoginSuccess={handleLoginSuccess} alertMessage={alertMessage} />
        </div>
      </div>
    );
  }

  return (
    <div className="pb-32 -mx-6 -mt-6 md:mx-0 md:mt-0 relative min-h-screen bg-[#F2F2F7] dark:bg-black">
      
      {/* 1. HERO HEADER */}
      <div className="relative bg-white dark:bg-[#1C1C1E] pb-24 pt-12 px-6 rounded-b-[2.5rem] shadow-sm overflow-hidden">
         <div className="relative z-10 flex flex-col items-center text-center">
            {/* Avatar */}
            <div className="relative mb-4 group">
               <div className="w-28 h-28 rounded-full p-1 bg-white dark:bg-[#2C2C2E] shadow-xl border border-slate-100 dark:border-white/10">
                  <img 
                    src={currentStudent.profilePic || currentStudent.avatar} 
                    alt="Profile" 
                    className="w-full h-full rounded-full object-cover"
                  />
               </div>
               <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 p-2.5 bg-slate-900 dark:bg-white text-white dark:text-black rounded-full shadow-lg hover:scale-110 transition-transform"
               >
                  {isUploading ? <Loader2 size={16} className="animate-spin" /> : <Camera size={16} />}
               </button>
               <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handlePhotoUpload} />
            </div>

            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
               {currentStudent.name}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 font-medium flex items-center gap-2">
               <span className="bg-slate-100 dark:bg-white/10 px-2 py-0.5 rounded text-xs font-bold text-slate-600 dark:text-slate-300">Class {currentStudent.class}-{currentStudent.section}</span>
               <span>Roll {currentStudent.rollNo}</span>
            </p>
         </div>
      </div>

      {/* 2. FLOATING STATS CARD */}
      <div className="px-6 -mt-16 relative z-20">
         <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-[#2C2C2E] rounded-[2rem] p-5 shadow-xl border border-slate-100 dark:border-white/5 flex justify-around items-center"
         >
            <StatItem 
               icon={Calendar} 
               value={currentStudent.stats.attendance} 
               label="Attendance" 
               color="text-green-500" 
               bg="bg-green-50 dark:bg-green-500/10" 
            />
            <div className="w-[1px] h-8 bg-slate-100 dark:bg-white/10"></div>
            <StatItem 
               icon={TrendingUp} 
               value={currentStudent.stats.rank} 
               label="Rank" 
               color="text-blue-500" 
               bg="bg-blue-50 dark:bg-blue-500/10" 
            />
            <div className="w-[1px] h-8 bg-slate-100 dark:bg-white/10"></div>
            <StatItem 
               icon={Award} 
               value={currentStudent.stats.grade} 
               label="Grade" 
               color="text-orange-500" 
               bg="bg-orange-50 dark:bg-orange-500/10" 
            />
         </motion.div>
      </div>

      <div className="px-6 mt-8 space-y-8">
         
         {/* 3. AWARDS SECTION */}
         {myAchievements.length > 0 && (
            <div>
               <div className="flex items-center justify-between px-1 mb-3">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Achievements</h3>
                  <button onClick={() => navigate('/achievements')} className="text-xs font-bold text-ios-blue">See All</button>
               </div>
               <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 snap-x">
                  {myAchievements.map((award) => (
                     <div 
                        key={award.id} 
                        className={`snap-center flex-shrink-0 w-64 p-4 rounded-[1.5rem] bg-gradient-to-br ${getGradient(award.category)} text-white shadow-lg relative overflow-hidden`}
                     >
                        <div className="relative z-10 flex items-center gap-3">
                           <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                              <Award size={20} />
                           </div>
                           <div className="flex-1 min-w-0">
                              <p className="text-[10px] font-bold uppercase opacity-80 tracking-wider">{award.category}</p>
                              <h4 className="font-bold text-sm truncate">{award.title}</h4>
                           </div>
                        </div>
                        <div className="absolute -right-4 -bottom-4 opacity-10">
                           <Award size={80} />
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         )}

         {/* 4. MENU GRID */}
         <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 px-1">Profile & Settings</h3>
            <div className="grid grid-cols-2 gap-4">
               
               <ExploreCard 
                  icon={User} 
                  label="Details" 
                  subLabel="Personal Info"
                  color="text-purple-500" 
                  bg="bg-purple-50 dark:bg-purple-500/10"
                  onClick={() => setShowPersonalDetails(true)}
                  delay={0.1}
               />

               <ExploreCard 
                  icon={IdCard} 
                  label="ID Card" 
                  subLabel="Digital Pass"
                  color="text-blue-500" 
                  bg="bg-blue-50 dark:bg-blue-500/10"
                  onClick={() => { setShowDigitalID(true); }}
                  delay={0.2}
               />

               <ExploreCard 
                  icon={BookOpen} 
                  label="Academics" 
                  subLabel="Results & Marks"
                  color="text-orange-500" 
                  bg="bg-orange-50 dark:bg-orange-500/10"
                  onClick={() => navigate('/results')}
                  delay={0.3}
               />

               <ExploreCard 
                  icon={LogOut} 
                  label="Sign Out" 
                  subLabel="End Session"
                  color="text-red-500" 
                  bg="bg-red-50 dark:bg-red-500/10"
                  onClick={logout}
                  delay={0.4}
               />

            </div>
         </div>
      </div>

      {/* MODAL: PERSONAL DETAILS (iOS Style) */}
      <AnimatePresence>
         {showPersonalDetails && (
            <Modal onClose={() => setShowPersonalDetails(false)} title="Student Profile">
               <div className="space-y-6 pb-10">
                  
                  <DetailGroup title="Academic Identity">
                     <DetailRow label="Admission No" value={currentStudent.admissionNo} icon={School} />
                     <DetailRow label="Class & Section" value={`${currentStudent.class} - ${currentStudent.section}`} icon={LayoutGrid} />
                     <DetailRow label="Roll Number" value={currentStudent.rollNo} icon={FileText} isLast />
                  </DetailGroup>

                  <DetailGroup title="Personal Information">
                     <DetailRow label="Full Name" value={currentStudent.name} icon={User} />
                     <DetailRow label="Date of Birth" value={currentStudent.dob} icon={Calendar} />
                     <DetailRow label="Gender" value={currentStudent.gender} icon={User} />
                     <DetailRow label="Blood Group" value={currentStudent.bloodGroup} icon={ShieldCheck} />
                     <DetailRow label="Religion" value={currentStudent.religion} icon={User} />
                     <DetailRow label="Category" value={currentStudent.category} icon={User} isLast />
                  </DetailGroup>

                  <DetailGroup title="Family & Contact">
                     <DetailRow label="Father's Name" value={currentStudent.fatherName} icon={User} />
                     <DetailRow label="Mother's Name" value={currentStudent.motherName} icon={User} />
                     <DetailRow label="Mobile" value={currentStudent.mobile} icon={Phone} isLast />
                  </DetailGroup>

                  <DetailGroup title="Residential">
                     <DetailRow label="Address" value={currentStudent.address} icon={MapPin} isLast />
                  </DetailGroup>

               </div>
            </Modal>
         )}
      </AnimatePresence>

      {/* MODAL: DIGITAL ID CARD (SINGLE VIEW) */}
      <AnimatePresence>
         {showDigitalID && (
            <Modal onClose={() => setShowDigitalID(false)} title="Digital ID Card">
               <div className="flex flex-col items-center pt-2 pb-8 w-full">
                  
                  {/* Save Button (Top Center) */}
                  <button className="mb-6 bg-slate-900 dark:bg-white text-white dark:text-black px-6 py-2.5 rounded-full font-bold text-sm shadow-lg flex items-center gap-2 hover:scale-105 transition-transform">
                     <Download size={16} /> Save to Photos
                  </button>

                  {/* ID CARD CONTAINER */}
                  <div className="relative w-full max-w-[280px] sm:max-w-[320px] aspect-[1/1.58] overflow-hidden rounded-xl shadow-2xl bg-white border border-slate-200">
                     <div className="w-full h-full relative flex flex-col bg-white">
                        {/* Dynamic Colored Header */}
                        <div 
                           className="h-[36%] w-full flex flex-col items-center justify-start pt-4 text-white px-2 relative"
                           style={{ backgroundColor: settings.idCardThemeColor || '#0077D4' }}
                        >
                           <div className="bg-white/20 p-1.5 rounded-full mb-1 backdrop-blur-md">
                              <School size={22} strokeWidth={2.5} />
                           </div>
                           <h2 className="text-[12px] font-black uppercase tracking-wider leading-none text-center">
                              {settings.idCardHeader || settings.schoolName}
                           </h2>
                           <p className="text-[7px] font-medium opacity-90 mt-0.5">{settings.idCardSubHeader}</p>
                           <p className="text-[7px] opacity-80 leading-tight">{settings.idCardAddress}</p>
                        </div>

                        {/* Photo Area (Overlapping) */}
                        <div className="relative -mt-10 flex justify-center z-10">
                           <div className="w-20 h-20 rounded-full border-4 border-white bg-slate-200 overflow-hidden shadow-sm">
                              <img src={currentStudent.profilePic || currentStudent.avatar} className="w-full h-full object-cover" alt="Student" />
                           </div>
                        </div>

                        {/* Red Name Banner */}
                        <div className="bg-[#D32F2F] text-white text-center py-1 mt-2 z-10 w-full shadow-sm">
                           <h3 className="font-bold text-[10px] uppercase tracking-wider truncate px-4">
                              STUDENT {currentStudent.class}-{currentStudent.section}-{currentStudent.rollNo}
                           </h3>
                        </div>

                        {/* Details Body */}
                        <div className="flex-1 px-5 pt-2 pb-1 text-[10px] relative flex flex-col justify-center">
                           <div className="space-y-1.5 text-slate-800">
                              <div className="flex">
                                 <span className="text-[#D32F2F] font-bold w-24 shrink-0">Class</span>
                                 <span className="font-bold">: {currentStudent.class}</span>
                              </div>
                              <div className="flex">
                                 <span className="text-[#D32F2F] font-bold w-24 shrink-0">Section</span>
                                 <span className="font-bold">: {currentStudent.section}</span>
                              </div>
                              <div className="flex">
                                 <span className="text-[#D32F2F] font-bold w-24 shrink-0">Father's Name</span>
                                 <span className="font-bold truncate flex-1">: {currentStudent.fatherName}</span>
                              </div>
                              <div className="flex">
                                 <span className="text-[#D32F2F] font-bold w-24 shrink-0">Mother's Name</span>
                                 <span className="font-bold truncate flex-1">: {currentStudent.motherName}</span>
                              </div>
                              <div className="flex">
                                 <span className="text-[#D32F2F] font-bold w-24 shrink-0">Date of Birth</span>
                                 <span className="font-bold">: {currentStudent.dob}</span>
                              </div>
                              <div className="flex">
                                 <span className="text-[#D32F2F] font-bold w-24 shrink-0">ID. No.</span>
                                 <span className="font-bold">: {currentStudent.admissionNo.split('/').pop()}</span>
                              </div>
                           </div>
                        </div>
                        
                        {/* Footer Strip */}
                        <div className="h-3 bg-[#D32F2F] w-full mt-auto"></div>
                     </div>
                  </div>

               </div>
            </Modal>
         )}
      </AnimatePresence>

    </div>
  );
};

// --- SUB COMPONENTS ---

const StatItem: React.FC<{ icon: any, value: string, label: string, color: string, bg: string }> = ({ icon: Icon, value, label, color, bg }) => (
   <div className="flex flex-col items-center gap-1.5">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${bg} ${color} mb-1`}>
         <Icon size={18} strokeWidth={2.5} />
      </div>
      <div className="text-center">
         <p className="text-lg font-bold text-slate-900 dark:text-white leading-none">{value}</p>
         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</p>
      </div>
   </div>
);

const ExploreCard: React.FC<{ icon: any, label: string, subLabel: string, color: string, bg: string, onClick: () => void, delay: number }> = ({ icon: Icon, label, subLabel, color, bg, onClick, delay }) => (
   <motion.button 
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileTap={{ scale: 0.95 }}
      className="bg-white dark:bg-[#1C1C1E] p-4 rounded-[1.5rem] shadow-sm border border-slate-100 dark:border-white/5 flex flex-col items-start gap-3 text-left w-full active:bg-slate-50 dark:active:bg-white/5 transition-colors"
   >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${bg} ${color}`}>
         <Icon size={20} />
      </div>
      <div>
         <h4 className="font-bold text-slate-900 dark:text-white text-sm">{label}</h4>
         <p className="text-[10px] text-slate-500 font-medium">{subLabel}</p>
      </div>
   </motion.button>
);

const DetailGroup: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => (
  <div className="mb-6">
    <h3 className="text-[11px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold ml-4 mb-2">{title}</h3>
    <div className="bg-slate-50 dark:bg-black/20 rounded-2xl overflow-hidden border border-slate-200 dark:border-white/5 divide-y divide-slate-200 dark:divide-white/5">
      {children}
    </div>
  </div>
);

const DetailRow: React.FC<{ label: string, value: string, icon?: any, isLast?: boolean }> = ({ label, value, icon: Icon, isLast }) => (
  <div className="flex items-center justify-between p-4 bg-white dark:bg-[#1C1C1E]">
     <div className="flex items-center gap-3">
        {Icon && <div className="text-slate-400 dark:text-slate-500"><Icon size={16} /></div>}
        <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{label}</span>
     </div>
     <span className="text-sm font-bold text-slate-900 dark:text-white text-right max-w-[60%] truncate">{value || 'N/A'}</span>
  </div>
);

// Updated Modal to use Portal and set Global State
const Modal: React.FC<{ onClose: () => void, title: string, children: React.ReactNode }> = ({ onClose, title, children }) => {
   const { setIsModalOpen } = useContext(SchoolContext);

   useEffect(() => {
      setIsModalOpen(true);
      return () => setIsModalOpen(false);
   }, [setIsModalOpen]);

   return createPortal(
     <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
        <motion.div 
           initial={{ opacity: 0 }} 
           animate={{ opacity: 1 }} 
           exit={{ opacity: 0 }}
           onClick={onClose}
           className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />
        <motion.div 
           initial={{ y: "100%" }} 
           animate={{ y: 0 }} 
           exit={{ y: "100%" }}
           transition={{ type: "spring", damping: 25, stiffness: 300 }}
           className="relative bg-[#F2F2F7] dark:bg-black w-full max-w-lg rounded-t-[2rem] sm:rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
           <div className="px-6 py-4 border-b border-slate-200 dark:border-white/10 flex justify-between items-center bg-white/80 dark:bg-[#1C1C1E]/80 backdrop-blur-md sticky top-0 z-20">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h2>
              <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-200 dark:bg-white/10 hover:bg-slate-300 transition-colors">
                 <X size={16} className="text-slate-600 dark:text-slate-300" />
              </button>
           </div>
           <div className="p-4 sm:p-6 overflow-y-auto no-scrollbar flex justify-center">
              {children}
           </div>
        </motion.div>
     </div>,
     document.body
   );
};
