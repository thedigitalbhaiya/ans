
import React, { useState, useContext, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, GraduationCap, IndianRupee, Activity, Send, 
  Trash2, Bell, AlertTriangle, Edit2, MapPin, 
  Phone, Zap, ArrowUpRight, TrendingUp, Sparkles, Globe
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AuthContext, SchoolContext } from '../../App';

export const AdminDashboard: React.FC = () => {
  const { allStudents } = useContext(AuthContext);
  const { posts, addPost, deletePost, settings, flashNotice, setFlashNotice } = useContext(SchoolContext);
  const navigate = useNavigate();
  const [postContent, setPostContent] = useState('');

  const stats = useMemo(() => ({
    students: allStudents.length,
    teachers: settings.totalTeachers,
    attendance: "94.2%",
    pendingFees: "₹ 1.2L"
  }), [allStudents, settings]);

  const handlePost = () => {
    if (postContent.trim()) {
      addPost(postContent);
      setPostContent('');
    }
  };

  return (
    <div className="space-y-8 pb-32">
      
      {/* 1. Command Center Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
         <div>
            <p className="text-[11px] font-black text-ios-blue uppercase tracking-[0.2em] mb-1">Operational Intel</p>
            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Command Center</h1>
         </div>
         <div className="flex items-center gap-2 bg-white dark:bg-[#1C1C1E] p-2 rounded-2xl shadow-sm border border-slate-100 dark:border-white/5">
            <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-500/20 flex items-center justify-center text-green-600">
               <Zap size={20} fill="currentColor" />
            </div>
            <div className="pr-4">
               <p className="text-[10px] font-bold text-slate-400 uppercase">System Status</p>
               <p className="text-xs font-black text-slate-900 dark:text-white">All Systems Nominal</p>
            </div>
         </div>
      </div>

      {/* 2. Bento Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
         <StatsBento label="Students" value={stats.students} icon={Users} color="text-blue-500" bg="bg-blue-50 dark:bg-blue-500/10" />
         <StatsBento label="Faculty" value={stats.teachers} icon={GraduationCap} color="text-purple-500" bg="bg-purple-50 dark:bg-purple-500/10" />
         <StatsBento label="Today's Attendance" value={stats.attendance} icon={Activity} color="text-green-500" bg="bg-green-50 dark:bg-green-500/10" trend="+0.4%" />
         <StatsBento label="Outstanding" value={stats.pendingFees} icon={IndianRupee} color="text-orange-500" bg="bg-orange-50 dark:bg-orange-500/10" />
      </div>

      {/* 3. Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         
         {/* Announcements Broadcasting */}
         <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between px-2">
               <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Bell className="text-ios-blue" size={22} /> Global Broadcast
               </h3>
               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{posts.length} Sent Recently</span>
            </div>

            <div className="bg-white dark:bg-[#1C1C1E] p-8 rounded-[2.5rem] shadow-apple border border-slate-100 dark:border-white/5 relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-64 h-64 bg-ios-blue/5 rounded-full blur-3xl -mr-20 -mt-20 group-hover:bg-ios-blue/10 transition-colors"></div>
               <div className="flex gap-5 relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-ios-blue flex items-center justify-center text-white shadow-lg flex-shrink-0">
                     <Edit2 size={28} />
                  </div>
                  <div className="flex-1">
                     <textarea 
                        value={postContent}
                        onChange={(e) => setPostContent(e.target.value)}
                        placeholder="Broadcast a message to all student dashboards..." 
                        className="w-full bg-slate-50 dark:bg-black/20 rounded-2xl p-5 text-slate-900 dark:text-white font-medium outline-none focus:ring-4 focus:ring-ios-blue/10 transition-all resize-none h-28"
                     />
                     <div className="flex justify-end mt-4">
                        <button 
                           onClick={handlePost} 
                           disabled={!postContent.trim()} 
                           className="bg-slate-900 dark:bg-white text-white dark:text-black px-10 py-4 rounded-2xl font-black text-sm shadow-xl flex items-center gap-3 active:scale-95 transition-all disabled:opacity-50"
                        >
                           <Send size={18} /> Broadcast Now
                        </button>
                     </div>
                  </div>
               </div>
            </div>

            <div className="space-y-4">
               {posts.map((post, idx) => (
                  <motion.div 
                    key={post.id} 
                    initial={{ opacity: 0, y: 10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white dark:bg-[#1C1C1E] p-6 rounded-[2rem] shadow-sm border border-slate-100 dark:border-white/5 flex items-start justify-between group hover:border-slate-200 dark:hover:border-white/10 transition-all"
                  >
                     <div className="flex gap-4 min-w-0">
                        <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-500 font-bold overflow-hidden">
                           <img src={`https://ui-avatars.com/api/?name=${post.author}&background=random`} alt="" />
                        </div>
                        <div className="min-w-0">
                           <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-bold text-slate-900 dark:text-white text-sm">{post.author}</h4>
                              <span className="text-[9px] bg-slate-100 dark:bg-white/10 px-2 py-0.5 rounded font-black text-slate-500 uppercase tracking-tighter">{post.role}</span>
                           </div>
                           <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{post.content}</p>
                           <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase tracking-wider">{post.timestamp}</p>
                        </div>
                     </div>
                     <button onClick={() => deletePost(post.id)} className="p-2 text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                        <Trash2 size={18} />
                     </button>
                  </motion.div>
               ))}
            </div>
         </div>

         {/* Emergency & Trends */}
         <div className="space-y-8">
            <div className="space-y-4">
               <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] px-2">High Priority</h3>
               <div className={`p-8 rounded-[2.5rem] shadow-2xl text-white relative overflow-hidden transition-all duration-500 ${flashNotice.isVisible ? 'bg-red-600 shadow-red-500/20' : 'bg-slate-900 shadow-slate-900/20'}`}>
                  <div className="relative z-10 space-y-6">
                     <div className="flex items-center justify-between">
                        <h4 className="font-black text-xs uppercase tracking-widest flex items-center gap-2">
                           <AlertTriangle size={18} className={flashNotice.isVisible ? "animate-pulse text-yellow-300" : ""} /> Flash Notice
                        </h4>
                        <button 
                           onClick={() => setFlashNotice({...flashNotice, isVisible: !flashNotice.isVisible})}
                           className={`w-14 h-8 rounded-full p-1 transition-colors ${flashNotice.isVisible ? 'bg-white' : 'bg-slate-700'}`}
                        >
                           <motion.div 
                             className={`w-6 h-6 rounded-full shadow-md ${flashNotice.isVisible ? 'bg-red-600' : 'bg-slate-400'}`}
                             animate={{ x: flashNotice.isVisible ? 24 : 0 }}
                           />
                        </button>
                     </div>

                     <div className="space-y-5">
                        <div className="space-y-1">
                           <label className="text-[9px] font-black opacity-60 uppercase ml-1">Notice Header</label>
                           <input 
                              type="text" 
                              className="w-full bg-white/10 border-none rounded-xl px-4 py-4 text-sm font-black placeholder:text-white/30 outline-none focus:bg-white/20 transition-all" 
                              placeholder="e.g. Urgent Holiday Alert"
                              value={flashNotice.title}
                              onChange={(e) => setFlashNotice({...flashNotice, title: e.target.value})}
                           />
                        </div>
                        <div className="space-y-1">
                           <label className="text-[9px] font-black opacity-60 uppercase ml-1">Message Content</label>
                           <textarea 
                              className="w-full bg-white/10 border-none rounded-xl px-4 py-4 text-sm font-medium placeholder:text-white/30 outline-none focus:bg-white/20 h-32 resize-none transition-all" 
                              placeholder="Enter the critical message..."
                              value={flashNotice.message}
                              onChange={(e) => setFlashNotice({...flashNotice, message: e.target.value})}
                           />
                        </div>
                     </div>
                  </div>
                  <div className={`absolute -right-10 -bottom-10 w-48 h-48 rounded-full blur-[60px] opacity-30 ${flashNotice.isVisible ? 'bg-yellow-400' : 'bg-blue-500'}`}></div>
               </div>
            </div>

            <div className="space-y-4">
               <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] px-2">Campus Vitality</h3>
               <div className="bg-white dark:bg-[#1C1C1E] p-8 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-white/5 space-y-6">
                  <TrendItem icon={TrendingUp} label="Admissions" value="+18%" color="text-blue-500" bg="bg-blue-50 dark:bg-blue-500/10" />
                  <div className="h-[1px] bg-slate-100 dark:bg-white/5"></div>
                  <TrendItem icon={Globe} label="Portal Traffic" value="High" color="text-purple-500" bg="bg-purple-50 dark:bg-purple-500/10" />
                  <div className="h-[1px] bg-slate-100 dark:bg-white/5"></div>
                  <TrendItem icon={Sparkles} label="Achievement Rate" value="92.4" color="text-orange-500" bg="bg-orange-50 dark:bg-orange-500/10" />
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

const StatsBento = ({ label, value, icon: Icon, color, bg, trend }: any) => (
   <motion.div whileHover={{ y: -5, scale: 1.02 }} className="bg-white dark:bg-[#1C1C1E] p-7 rounded-[2.5rem] shadow-apple border border-slate-100 dark:border-white/5 flex flex-col justify-between h-44 relative overflow-hidden group">
      <div className="flex justify-between items-start relative z-10">
         <div className={`w-14 h-14 rounded-[1.25rem] flex items-center justify-center ${bg} ${color} shadow-sm`}>
            <Icon size={28} strokeWidth={2.5} />
         </div>
         {trend && <span className="text-[10px] font-black text-green-600 bg-green-100 dark:bg-green-500/20 px-3 py-1.5 rounded-full uppercase">{trend}</span>}
      </div>
      <div className="relative z-10">
         <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter mb-1">{value}</h3>
         <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{label}</p>
      </div>
      <div className="absolute -right-6 -bottom-6 opacity-0 group-hover:opacity-[0.05] transition-all duration-700 group-hover:rotate-12 group-hover:scale-150">
         <Icon size={120} strokeWidth={1} />
      </div>
   </motion.div>
);

const TrendItem = ({ icon: Icon, label, value, color, bg }: any) => (
   <div className="flex items-center justify-between group cursor-default">
      <div className="flex items-center gap-4">
         <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${bg} ${color}`}>
            <Icon size={22} />
         </div>
         <div>
            <p className="text-sm font-black text-slate-900 dark:text-white">{value}</p>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{label}</p>
         </div>
      </div>
      <ArrowUpRight size={18} className="text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors" />
   </div>
);
