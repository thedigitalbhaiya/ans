
import React, { useState, useContext, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  GraduationCap, 
  IndianRupee, 
  Activity, 
  Send, 
  Trash2, 
  CreditCard, 
  UserPlus, 
  Bell, 
  UploadCloud, 
  MessageSquare, 
  Calendar, 
  FileText, 
  AlertTriangle, 
  Link as LinkIcon, 
  Edit2 
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { LineChart, Line, ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { AuthContext, SchoolContext } from '../../App';

const ALL_CLASSES = ['ALL', 'Nursery', 'LKG', 'UKG', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];

export const AdminDashboard: React.FC = () => {
  const { allStudents, currentAdmin } = useContext(AuthContext);
  const { posts, addPost, deletePost, leaveApplications, feeStructure, flashNotice, setFlashNotice, settings, updateSettings } = useContext(SchoolContext);
  const navigate = useNavigate();
  const [postContent, setPostContent] = useState('');
  const [isEditingTeachers, setIsEditingTeachers] = useState(false);
  const [tempTeacherCount, setTempTeacherCount] = useState(settings.totalTeachers);

  // Stats Logic
  const totalStudents = allStudents.length;
  const attendanceToday = "94%";
  
  const pendingFees = useMemo(() => {
    let totalPending = 0;
    const monthsDue = 7; 
    allStudents.forEach(student => {
        const paidCount = student.feeHistory.length;
        const pendingCount = Math.max(0, monthsDue - paidCount);
        const monthlyFee = feeStructure[student.class] || 1000;
        totalPending += pendingCount * monthlyFee;
    });
    return totalPending;
  }, [allStudents, feeStructure]);

  const handlePost = () => {
    if (postContent.trim()) {
      addPost(postContent);
      setPostContent('');
    }
  };

  const updateFlashNotice = (key: string, value: any) => {
    setFlashNotice(prev => ({ ...prev, [key]: value }));
  };

  const saveTeacherCount = () => {
    updateSettings({ totalTeachers: tempTeacherCount });
    setIsEditingTeachers(false);
  };

  // Mock Data
  const attendanceTrendData = [
    { day: 'Mon', value: 92 }, { day: 'Tue', value: 94 }, { day: 'Wed', value: 91 },
    { day: 'Thu', value: 95 }, { day: 'Fri', value: 89 }, { day: 'Sat', value: 85 },
  ];
  const feePieData = [
    { name: 'Collected', value: 65, color: '#34C759' },
    { name: 'Pending', value: 35, color: '#FF3B30' },
  ];
  const recentActivity = [
    { id: 1, type: 'Admission', text: 'Rohan (Class 5) just joined.', time: '10 min ago', icon: UserPlus, color: 'text-blue-500 bg-blue-100' },
    { id: 2, type: 'Feedback', text: 'New complaint from Parent.', time: '1 hour ago', icon: MessageSquare, color: 'text-orange-500 bg-orange-100' },
    { id: 3, type: 'Leave', text: `Leave request from ${leaveApplications[0]?.studentName || 'Amit'}.`, time: '2 hours ago', icon: FileText, color: 'text-purple-500 bg-purple-100' },
  ];

  return (
    <div className="space-y-6 pb-24 md:pb-10">
      
      {/* 1. STATS GRID (Responsive) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
         <StatCard label="Total Students" value={totalStudents.toString()} icon={Users} color="text-blue-600" bg="bg-blue-100 dark:bg-blue-500/20" />
         <div className="relative group">
            <StatCard label="Total Teachers" value={settings.totalTeachers.toString()} icon={GraduationCap} color="text-purple-600" bg="bg-purple-100 dark:bg-purple-500/20" />
            {currentAdmin?.role === 'Super Admin' && (
               <button onClick={() => { setTempTeacherCount(settings.totalTeachers); setIsEditingTeachers(true); }} className="absolute top-2 right-2 p-1.5 bg-white/50 hover:bg-white rounded-full text-slate-500 hover:text-purple-600 shadow-sm opacity-0 group-hover:opacity-100 transition-all">
                  <Edit2 size={14} />
               </button>
            )}
         </div>
         <StatCard label="Attendance" value={attendanceToday} icon={Activity} color="text-green-600" bg="bg-green-100 dark:bg-green-500/20" trend="+2.4%" />
         {currentAdmin?.role !== 'Teacher' && (
            <StatCard label="Pending Fees" value={`₹ ${(pendingFees / 1000).toFixed(1)}k`} icon={IndianRupee} color="text-orange-600" bg="bg-orange-100 dark:bg-orange-500/20" />
         )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
         
         {/* 2. CAMPUS FEED (Full width on mobile) */}
         <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
               <Bell className="text-ios-blue" size={24} /> Campus Feed
            </h2>

            {/* Create Post */}
            <div className="bg-white dark:bg-[#1C1C1E] p-5 rounded-[2rem] shadow-sm border border-slate-100 dark:border-white/5">
               <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden flex-shrink-0">
                     <img src="https://ui-avatars.com/api/?name=Admin&background=random" alt="Admin" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 space-y-3">
                     <textarea 
                        value={postContent}
                        onChange={(e) => setPostContent(e.target.value)}
                        placeholder="What's happening?" 
                        className="w-full bg-slate-50 dark:bg-black/20 rounded-xl p-4 text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:ring-2 focus:ring-ios-blue/50 resize-none h-20"
                     />
                     <div className="flex justify-end">
                        <button onClick={handlePost} disabled={!postContent.trim()} className="bg-ios-blue text-white px-5 py-2 rounded-xl font-bold shadow-lg flex items-center gap-2 active:scale-95 transition-transform disabled:opacity-50 disabled:scale-100 text-sm">
                           <Send size={16} /> Post
                        </button>
                     </div>
                  </div>
               </div>
            </div>

            {/* Feed List */}
            <div className="space-y-4">
               <AnimatePresence>
                  {posts.map((post) => (
                     <motion.div key={post.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white dark:bg-[#1C1C1E] p-5 rounded-[2rem] shadow-sm border border-slate-100 dark:border-white/5 relative group">
                        <div className="flex items-center gap-3 mb-2">
                           <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-xs">{post.author[0]}</div>
                           <div>
                              <h4 className="font-bold text-slate-900 dark:text-white text-sm">{post.author}</h4>
                              <p className="text-[10px] text-slate-500 dark:text-slate-400">{post.timestamp} • {post.role}</p>
                           </div>
                        </div>
                        <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed pl-12">{post.content}</p>
                        <button onClick={() => deletePost(post.id)} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-red-500 transition-colors opacity-50 group-hover:opacity-100"><Trash2 size={16} /></button>
                     </motion.div>
                  ))}
               </AnimatePresence>
            </div>
         </div>

         {/* 3. RIGHT COLUMN (Charts & Flash) */}
         <div className="space-y-6">
            
            {/* Flash Alert */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 dark:from-[#2C2C2E] dark:to-black p-5 rounded-[2rem] shadow-xl text-white relative overflow-hidden">
               <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl -mr-10 -mt-10 transition-colors duration-500 ${flashNotice.isVisible ? 'bg-red-500/30' : 'bg-white/5'}`}></div>
               <div className="flex justify-between items-start mb-4 relative z-10">
                  <h3 className="font-bold flex items-center gap-2"><AlertTriangle size={18} className={flashNotice.isVisible ? "text-red-400 animate-pulse" : "text-slate-400"} /> Flash Alert</h3>
                  <div onClick={() => updateFlashNotice('isVisible', !flashNotice.isVisible)} className={`w-10 h-6 rounded-full p-1 cursor-pointer transition-colors duration-300 ${flashNotice.isVisible ? 'bg-green-500' : 'bg-slate-600'}`}>
                     <motion.div layout className="w-4 h-4 bg-white rounded-full shadow-md" animate={{ x: flashNotice.isVisible ? 16 : 0 }} />
                  </div>
               </div>
               <div className="space-y-3 relative z-10">
                  <input type="text" placeholder="Title" className="w-full bg-white/10 border border-white/10 rounded-xl px-3 py-2 text-xs font-bold text-white outline-none focus:bg-white/20" value={flashNotice.title} onChange={(e) => updateFlashNotice('title', e.target.value)} />
                  <textarea rows={2} placeholder="Message..." className="w-full bg-white/10 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:bg-white/20 resize-none" value={flashNotice.message} onChange={(e) => updateFlashNotice('message', e.target.value)} />
               </div>
            </div>

            {/* Analytics */}
            <div className="bg-white dark:bg-[#1C1C1E] p-5 rounded-[2rem] shadow-sm border border-slate-100 dark:border-white/5">
               <h3 className="font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2 text-sm"><Activity size={18} className="text-green-500" /> Analytics</h3>
               <div className="space-y-6">
                  <div>
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Attendance (Week)</p>
                     <div className="h-28 w-full"><ResponsiveContainer width="100%" height="100%"><LineChart data={attendanceTrendData}><Tooltip contentStyle={{ backgroundColor: '#1C1C1E', borderRadius: '8px', border: 'none', color: '#fff', fontSize: '12px' }} /><Line type="monotone" dataKey="value" stroke="#34C759" strokeWidth={3} dot={false} /></LineChart></ResponsiveContainer></div>
                  </div>
                  <div className="flex items-center gap-4">
                     <div className="h-24 w-24 relative flex-shrink-0">
                        <ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={feePieData} innerRadius={25} outerRadius={40} paddingAngle={5} dataKey="value">{feePieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}</Pie></PieChart></ResponsiveContainer>
                        <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none"><span className="text-sm font-bold text-slate-900 dark:text-white">65%</span></div>
                     </div>
                     <div className="text-xs text-slate-500">
                        <p className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-500"></span> Collected</p>
                        <p className="flex items-center gap-2 mt-1"><span className="w-2 h-2 rounded-full bg-red-500"></span> Pending</p>
                     </div>
                  </div>
               </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white dark:bg-[#1C1C1E] p-5 rounded-[2rem] shadow-sm border border-slate-100 dark:border-white/5">
               <h3 className="font-bold text-slate-900 dark:text-white mb-4 text-sm">Recent Activity</h3>
               <div className="space-y-3">
                  {recentActivity.map((item) => (
                     <div key={item.id} className="flex gap-3 items-start">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${item.color}`}><item.icon size={12} /></div>
                        <div><p className="text-xs font-medium text-slate-800 dark:text-slate-200 leading-tight">{item.text}</p><p className="text-[10px] text-slate-400 mt-0.5">{item.time}</p></div>
                     </div>
                  ))}
               </div>
            </div>

         </div>
      </div>

      {/* Edit Teacher Modal */}
      <AnimatePresence>
         {isEditingTeachers && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
               <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white dark:bg-[#1C1C1E] p-6 rounded-2xl shadow-xl w-full max-w-xs">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Total Teachers</h3>
                  <input type="number" value={tempTeacherCount} onChange={(e) => setTempTeacherCount(parseInt(e.target.value) || 0)} className="w-full p-3 bg-slate-100 dark:bg-white/5 rounded-xl text-center text-2xl font-bold mb-6 outline-none focus:ring-2 focus:ring-purple-500" autoFocus />
                  <div className="flex gap-3"><button onClick={() => setIsEditingTeachers(false)} className="flex-1 py-2 rounded-xl font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-white/10">Cancel</button><button onClick={saveTeacherCount} className="flex-1 py-2 rounded-xl font-bold bg-purple-600 text-white hover:bg-purple-700 shadow-lg">Save</button></div>
               </motion.div>
            </div>
         )}
      </AnimatePresence>
    </div>
  );
};

const StatCard = ({ label, value, icon: Icon, color, bg, trend }: any) => (
   <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-[#1C1C1E] p-4 rounded-[1.8rem] shadow-sm border border-slate-100 dark:border-white/5 flex flex-col justify-between h-28 relative overflow-hidden">
      <div className="flex justify-between items-start z-10">
         <div className={`p-2.5 rounded-xl ${bg} ${color}`}><Icon size={18} /></div>
         {trend && <span className="text-[10px] font-bold text-green-500 bg-green-100 dark:bg-green-500/20 px-1.5 py-0.5 rounded-md">{trend}</span>}
      </div>
      <div className="z-10">
         <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">{value}</h3>
         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</p>
      </div>
      <Icon size={60} className={`absolute -right-3 -bottom-3 opacity-5 ${color.replace('text-', 'text-')}`} />
   </motion.div>
);
