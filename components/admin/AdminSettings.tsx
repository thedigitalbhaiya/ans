
import React, { useContext, useState } from 'react';
import { motion } from 'framer-motion';
import { SchoolContext } from '../../App';
import { Settings, Save, ToggleLeft, ToggleRight, Layout, Megaphone, Edit3 } from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const { 
    dailyNotice, 
    setDailyNotice, 
    showBirthdayWidget, 
    setShowBirthdayWidget, 
    schoolName, 
    setSchoolName 
  } = useContext(SchoolContext);

  const [localSchoolName, setLocalSchoolName] = useState(schoolName);
  const [noticeTitle, setNoticeTitle] = useState(dailyNotice.title);
  const [noticeMessage, setNoticeMessage] = useState(dailyNotice.message);

  const handleSaveNotice = () => {
    setDailyNotice({
      ...dailyNotice,
      title: noticeTitle,
      message: noticeMessage,
      date: 'Just Updated'
    });
    alert('Circular Updated Successfully!');
  };

  const handleSaveSchoolInfo = () => {
    setSchoolName(localSchoolName);
    alert('School Info Updated!');
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">App Control</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Customize the student experience</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* 1. Daily Bulletin Control */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-[#1C1C1E] p-8 rounded-[2rem] shadow-sm border border-slate-100 dark:border-white/5"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 flex items-center justify-center">
              <Megaphone size={20} />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Daily Bulletin</h2>
          </div>

          <div className="space-y-4">
             <div>
               <label className="block text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Notice Title</label>
               <input 
                 type="text" 
                 value={noticeTitle}
                 onChange={(e) => setNoticeTitle(e.target.value)}
                 className="w-full p-4 rounded-xl bg-slate-50 dark:bg-black/20 border-none font-medium text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-ios-blue/50"
               />
             </div>
             <div>
               <label className="block text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Message Content</label>
               <textarea 
                 rows={3}
                 value={noticeMessage}
                 onChange={(e) => setNoticeMessage(e.target.value)}
                 className="w-full p-4 rounded-xl bg-slate-50 dark:bg-black/20 border-none font-medium text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-ios-blue/50 resize-none"
               />
             </div>
             <button 
               onClick={handleSaveNotice}
               className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-black font-bold rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-transform"
             >
               <Save size={18} /> Publish Notice
             </button>
          </div>
        </motion.div>

        {/* 2. Layout & Widgets */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-[#1C1C1E] p-8 rounded-[2rem] shadow-sm border border-slate-100 dark:border-white/5"
        >
           <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Layout size={20} />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Layout & Widgets</h2>
          </div>

          <div className="space-y-6">
             <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-black/20 rounded-2xl">
                <div>
                   <h3 className="font-bold text-slate-900 dark:text-white">Birthday Widget</h3>
                   <p className="text-xs text-slate-500">Show upcoming birthdays on dashboard</p>
                </div>
                <button 
                  onClick={() => setShowBirthdayWidget(!showBirthdayWidget)}
                  className={`text-3xl transition-colors ${showBirthdayWidget ? 'text-green-500' : 'text-slate-300'}`}
                >
                  {showBirthdayWidget ? <ToggleRight size={40} /> : <ToggleLeft size={40} />}
                </button>
             </div>

             <div>
                <label className="block text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">School Branding Name</label>
                <div className="flex gap-2">
                   <input 
                      type="text" 
                      value={localSchoolName}
                      onChange={(e) => setLocalSchoolName(e.target.value)}
                      className="flex-1 p-4 rounded-xl bg-slate-50 dark:bg-black/20 border-none font-medium text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-ios-blue/50"
                   />
                   <button 
                      onClick={handleSaveSchoolInfo}
                      className="px-6 rounded-xl bg-slate-200 dark:bg-white/10 text-slate-900 dark:text-white font-bold hover:bg-slate-300 dark:hover:bg-white/20"
                   >
                      <Save size={20} />
                   </button>
                </div>
             </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
};
