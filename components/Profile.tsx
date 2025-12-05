
import React, { useContext, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { AuthContext, SchoolContext } from '../App';
import { 
  User, 
  Phone, 
  MapPin, 
  LogOut,
  Users,
  Fingerprint,
  Calendar,
  MessageCircle,
  Copy,
  Check,
  Camera,
  Loader2
} from 'lucide-react';
import { Login } from './Login';

export const Profile: React.FC = () => {
  const { logout, currentStudent, isLoggedIn, updateStudentData } = useContext(AuthContext);
  const { socialLinks } = useContext(SchoolContext);
  const navigate = useNavigate();
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLoginSuccess = () => {
    // The login logic in App.tsx already handles navigation.
  };

  const handleCopy = (link: string, type: string) => {
    navigator.clipboard.writeText(link);
    setCopiedLink(type);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  // --- PHOTO UPLOAD LOGIC ---
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 500000) { // 500KB limit
        alert("Image is too large. Please use a file under 500KB.");
        return;
      }

      setIsUploading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        // Update both local session and database
        updateStudentData({ ...currentStudent, profilePic: base64String });
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    }
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
           <Login onLoginSuccess={handleLoginSuccess} />
        </div>
      </div>
    );
  }

  // Get Social Config for Student's Class
  const classKey = `${currentStudent.class}-${currentStudent.section}`;
  const whatsappLink = socialLinks[classKey];
  const showSocials = !!whatsappLink;

  // Determine Display Image
  // Priority: 1. profilePic (Uploaded) 2. avatar (UI Avatars) 3. Initials (Fallback)
  const hasProfilePic = !!currentStudent.profilePic;
  const initials = currentStudent.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-10 px-4 md:px-0">
      
      {/* Header with blurred background effect */}
      <div className="relative pt-6 pb-6 flex flex-col items-center">
         {/* Decorative background elements */}
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-48 bg-gradient-to-b from-ios-blue/5 to-transparent rounded-b-[3rem] -z-10 dark:from-white/5"></div>
         
         <motion.div
           initial={{ scale: 0.9, opacity: 0 }}
           animate={{ scale: 1, opacity: 1 }}
           className="relative mb-4 group cursor-pointer"
           onClick={() => fileInputRef.current?.click()}
         >
            <div className="w-36 h-36 rounded-full overflow-hidden border-[6px] border-white dark:border-[#1C1C1E] shadow-2xl bg-white dark:bg-[#2C2C2E] flex items-center justify-center relative">
              {isUploading ? (
                 <Loader2 className="animate-spin text-ios-blue" size={32} />
              ) : hasProfilePic ? (
                 <img src={currentStudent.profilePic} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                 <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold text-4xl">
                    {initials}
                 </div>
              )}
              
              {/* Overlay on Hover */}
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                 <Camera className="text-white" size={24} />
              </div>
            </div>
            
            {/* Edit Button Badge */}
            <div className="absolute bottom-2 right-2 w-10 h-10 bg-slate-900 dark:bg-white text-white dark:text-black rounded-full border-[4px] border-white dark:border-[#1C1C1E] flex items-center justify-center shadow-lg transition-transform group-hover:scale-110">
               <Camera size={14} />
            </div>

            <input 
               type="file" 
               ref={fileInputRef} 
               accept="image/*" 
               className="hidden" 
               onChange={handlePhotoUpload} 
            />
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

        {/* Right Column (WhatsApp, Actions) - spans 5 cols on large screens */}
        <div className="lg:col-span-5 space-y-6">
           
           {/* Dynamic Class Community Card */}
           {showSocials ? (
             <motion.div
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.3 }}
               className="bg-white dark:bg-[#1C1C1E] p-1 rounded-[2rem] shadow-xl border border-slate-100 dark:border-white/5"
             >
                <div className="p-6">
                   <div className="flex items-center gap-4 mb-6">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-400 to-blue-500 text-white flex items-center justify-center shadow-lg">
                         <MessageCircle size={28} />
                      </div>
                      <div>
                         <h3 className="text-lg font-bold text-slate-900 dark:text-white">Class Communities</h3>
                         <p className="text-sm text-slate-500 dark:text-slate-400">Join official groups for Class {currentStudent.class}</p>
                      </div>
                   </div>

                   <div className="space-y-3">
                      {/* WhatsApp Button */}
                      {whatsappLink && (
                        <div className="flex gap-2">
                           <button 
                             onClick={() => window.open(whatsappLink, '_blank')}
                             className="flex-1 py-3.5 bg-[#25D366] text-white font-bold rounded-xl shadow-lg hover:brightness-110 transition-all flex items-center justify-center gap-2 active:scale-95"
                           >
                             <MessageCircle size={18} /> Join WhatsApp
                           </button>
                           <button 
                             onClick={() => handleCopy(whatsappLink, 'wa')}
                             className="w-12 flex items-center justify-center bg-slate-100 dark:bg-white/10 rounded-xl text-slate-500 hover:bg-slate-200 dark:hover:bg-white/20 transition-colors"
                             title="Copy Link"
                           >
                             {copiedLink === 'wa' ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                           </button>
                        </div>
                      )}
                   </div>
                </div>
             </motion.div>
           ) : (
             <div className="bg-slate-100 dark:bg-white/5 rounded-[2rem] p-6 text-center border border-dashed border-slate-300 dark:border-white/10">
                <p className="text-slate-400 text-sm font-bold">No community links available for Class {currentStudent.class} yet.</p>
             </div>
           )}

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
