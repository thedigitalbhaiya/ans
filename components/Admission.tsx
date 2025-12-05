
import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Loader2, User, MapPin, Phone, Heart, Globe, School, Bus } from 'lucide-react';
import { SchoolContext } from '../App';

export const Admission: React.FC = () => {
  const { addAdmission } = useContext(SchoolContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    setIsSubmitting(true);
    
    setTimeout(() => {
      addAdmission({
        studentName: data.studentName as string,
        admissionForClass: data.admissionForClass as string,
        fatherName: data.fatherName as string,
        mobile: data.fatherMobile as string,
        previousSchool: data.previousSchool as string,
        address: data.address as string,
      });
      setIsSubmitting(false);
      setIsSuccess(true);
      e.currentTarget.reset();
    }, 2000);
  };

  if (isSuccess) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center h-[60vh] text-center p-6"
      >
        <div className="w-24 h-24 bg-green-100 dark:bg-green-500/20 rounded-full flex items-center justify-center text-green-600 dark:text-green-400 mb-6 shadow-lg shadow-green-500/10">
          <CheckCircle2 size={48} strokeWidth={3} />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Application Submitted!</h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-md">
          Your admission form for Azim National School has been received successfully. We will contact you shortly.
        </p>
        <button 
          onClick={() => setIsSuccess(false)}
          className="mt-8 px-8 py-3 bg-slate-900 dark:bg-white text-white dark:text-black font-bold rounded-xl shadow-lg hover:scale-105 transition-transform"
        >
          Submit Another
        </button>
      </motion.div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Admission Form</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Azim National School • Session 2025-26</p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-[#1C1C1E] p-6 md:p-10 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-white/5"
      >
        <form onSubmit={handleSubmit} className="space-y-10">
          
          {/* Section 1: Academic Info */}
          <div className="space-y-6">
             <div className="flex items-center gap-3 border-b border-slate-100 dark:border-white/5 pb-2">
                <School className="text-ios-blue dark:text-blue-400" size={24} />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest">Academic Details</h3>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                   <label className="text-xs font-bold text-slate-500 uppercase tracking-wide ml-1">Admission for Class</label>
                   <select name="admissionForClass" required className="w-full p-4 rounded-xl bg-slate-50 dark:bg-black/20 border-none outline-none focus:ring-2 focus:ring-ios-blue/50 text-slate-900 dark:text-white font-medium">
                     <option value="">Select Class</option>
                     <option>Nursery</option>
                     <option>LKG</option>
                     <option>UKG</option>
                     <option>Class I</option>
                     <option>Class II</option>
                     <option>Class III</option>
                     <option>Class IV</option>
                     <option>Class V</option>
                     <option>Class VI</option>
                     <option>Class VII</option>
                     <option>Class VIII</option>
                     <option>Class IX</option>
                     <option>Class XI</option>
                   </select>
                </div>
                <div className="space-y-2">
                   <label className="text-xs font-bold text-slate-500 uppercase tracking-wide ml-1">Student Type</label>
                   <select required className="w-full p-4 rounded-xl bg-slate-50 dark:bg-black/20 border-none outline-none focus:ring-2 focus:ring-ios-blue/50 text-slate-900 dark:text-white font-medium">
                     <option>Day Scholar</option>
                     <option>Hosteller</option>
                   </select>
                </div>
                <div className="space-y-2 md:col-span-2">
                   <label className="text-xs font-bold text-slate-500 uppercase tracking-wide ml-1">Previous School Studied</label>
                   <input name="previousSchool" required type="text" placeholder="Name of previous school" className="w-full p-4 rounded-xl bg-slate-50 dark:bg-black/20 border-none outline-none focus:ring-2 focus:ring-ios-blue/50 text-slate-900 dark:text-white font-medium" />
                </div>
             </div>
          </div>

          {/* Section 2: Personal Details */}
          <div className="space-y-6">
             <div className="flex items-center gap-3 border-b border-slate-100 dark:border-white/5 pb-2">
                <User className="text-ios-blue dark:text-blue-400" size={24} />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest">Student Details</h3>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                   <label className="text-xs font-bold text-slate-500 uppercase tracking-wide ml-1">Student Name</label>
                   <input name="studentName" required type="text" className="w-full p-4 rounded-xl bg-slate-50 dark:bg-black/20 border-none outline-none focus:ring-2 focus:ring-ios-blue/50 text-slate-900 dark:text-white font-medium" />
                </div>
                <div className="space-y-2">
                   <label className="text-xs font-bold text-slate-500 uppercase tracking-wide ml-1">Date of Birth</label>
                   <input required type="date" className="w-full p-4 rounded-xl bg-slate-50 dark:bg-black/20 border-none outline-none focus:ring-2 focus:ring-ios-blue/50 text-slate-900 dark:text-white font-medium" />
                </div>
                <div className="space-y-2">
                   <label className="text-xs font-bold text-slate-500 uppercase tracking-wide ml-1">Gender</label>
                   <select className="w-full p-4 rounded-xl bg-slate-50 dark:bg-black/20 border-none outline-none focus:ring-2 focus:ring-ios-blue/50 text-slate-900 dark:text-white font-medium">
                     <option>Male</option>
                     <option>Female</option>
                     <option>Other</option>
                   </select>
                </div>
                <div className="space-y-2">
                   <label className="text-xs font-bold text-slate-500 uppercase tracking-wide ml-1">Mother Tongue</label>
                   <input type="text" className="w-full p-4 rounded-xl bg-slate-50 dark:bg-black/20 border-none outline-none focus:ring-2 focus:ring-ios-blue/50 text-slate-900 dark:text-white font-medium" />
                </div>
                <div className="space-y-2">
                   <label className="text-xs font-bold text-slate-500 uppercase tracking-wide ml-1">Aadhar Number</label>
                   <input type="text" placeholder="XXXX XXXX XXXX" className="w-full p-4 rounded-xl bg-slate-50 dark:bg-black/20 border-none outline-none focus:ring-2 focus:ring-ios-blue/50 text-slate-900 dark:text-white font-medium" />
                </div>
                <div className="space-y-2">
                   <label className="text-xs font-bold text-slate-500 uppercase tracking-wide ml-1">Nationality</label>
                   <input type="text" defaultValue="Indian" className="w-full p-4 rounded-xl bg-slate-50 dark:bg-black/20 border-none outline-none focus:ring-2 focus:ring-ios-blue/50 text-slate-900 dark:text-white font-medium" />
                </div>
             </div>
          </div>

          {/* Section 3: Parents Info */}
          <div className="space-y-6">
             <div className="flex items-center gap-3 border-b border-slate-100 dark:border-white/5 pb-2">
                <User className="text-ios-blue dark:text-blue-400" size={24} />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest">Parents Details</h3>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                   <label className="text-xs font-bold text-slate-500 uppercase tracking-wide ml-1">Father's Name</label>
                   <input name="fatherName" required type="text" className="w-full p-4 rounded-xl bg-slate-50 dark:bg-black/20 border-none outline-none focus:ring-2 focus:ring-ios-blue/50 text-slate-900 dark:text-white font-medium" />
                </div>
                <div className="space-y-2">
                   <label className="text-xs font-bold text-slate-500 uppercase tracking-wide ml-1">Father's Contact Number</label>
                   <input name="fatherMobile" required type="tel" className="w-full p-4 rounded-xl bg-slate-50 dark:bg-black/20 border-none outline-none focus:ring-2 focus:ring-ios-blue/50 text-slate-900 dark:text-white font-medium" />
                </div>
                <div className="space-y-2">
                   <label className="text-xs font-bold text-slate-500 uppercase tracking-wide ml-1">Mother's Name</label>
                   <input required type="text" className="w-full p-4 rounded-xl bg-slate-50 dark:bg-black/20 border-none outline-none focus:ring-2 focus:ring-ios-blue/50 text-slate-900 dark:text-white font-medium" />
                </div>
                <div className="space-y-2">
                   <label className="text-xs font-bold text-slate-500 uppercase tracking-wide ml-1">Mother's Contact Number</label>
                   <input type="tel" className="w-full p-4 rounded-xl bg-slate-50 dark:bg-black/20 border-none outline-none focus:ring-2 focus:ring-ios-blue/50 text-slate-900 dark:text-white font-medium" />
                </div>
             </div>
          </div>

          {/* Section 4: Address */}
          <div className="space-y-6">
             <div className="flex items-center gap-3 border-b border-slate-100 dark:border-white/5 pb-2">
                <MapPin className="text-ios-blue dark:text-blue-400" size={24} />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest">Address</h3>
             </div>
             <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                   <label className="text-xs font-bold text-slate-500 uppercase tracking-wide ml-1">Present Address</label>
                   <textarea name="address" required rows={3} className="w-full p-4 rounded-xl bg-slate-50 dark:bg-black/20 border-none outline-none focus:ring-2 focus:ring-ios-blue/50 text-slate-900 dark:text-white font-medium resize-none"></textarea>
                </div>
             </div>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full py-5 bg-slate-900 dark:bg-white text-white dark:text-black font-bold text-lg rounded-2xl shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2 mt-8 disabled:opacity-70 disabled:scale-100"
          >
            {isSubmitting ? <Loader2 className="animate-spin" /> : <><CheckCircle2 size={22} /> Submit Application</>}
          </button>
        </form>
      </motion.div>
    </div>
  );
};
