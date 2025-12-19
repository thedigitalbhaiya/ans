
import React, { useContext, useState, useEffect, useRef, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ThemeContext, AuthContext, SchoolContext } from '../../App';
import { 
  LayoutDashboard, 
  Users,
  CalendarDays,
  GraduationCap,
  CreditCard,
  Clock,
  Bell,
  Image,
  FileText,
  UserPlus,
  MessageSquare,
  Settings,
  Moon, 
  Sun,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Shield,
  MessageCircle,
  BookOpen,
  CheckCheck,
  Search,
  User,
  Key,
  Camera,
  Save,
  Loader2,
  UserCog,
  ArrowRightLeft,
  Grid,
  X,
  Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Theme, AdminUser } from '../../types';
import { Logo } from '../Logo';

const adminNavItems = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/students', label: 'Students', icon: Users },
  { path: '/admin/attendance', label: 'Attendance', icon: CalendarDays },
  { path: '/admin/results', label: 'Marks', icon: GraduationCap },
  { path: '/admin/fees', label: 'Fees', icon: CreditCard },
  { path: '/admin/schedule', label: 'Schedule', icon: Clock },
  { path: '/admin/homework', label: 'Homework', icon: BookOpen }, 
  { path: '/admin/circulars', label: 'Circulars', icon: Bell },
  { path: '/admin/gallery', label: 'e-Magazine', icon: Image },
  { path: '/admin/achievements', label: 'Achievements', icon: Award },
  { path: '/admin/applications', label: 'Applications', icon: FileText },
  { path: '/admin/admissions', label: 'Admissions', icon: UserPlus },
  { path: '/admin/socials', label: 'Community', icon: MessageCircle },
  { path: '/admin/feedback', label: 'Feedback', icon: MessageSquare },
  { path: '/admin/settings', label: 'Settings', icon: Settings },
];

export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { logout, currentAdmin, updateAdminProfile, adminUsers, setCurrentAdmin } = useContext(AuthContext);
  const { feedback, unreadCount, notifications, markAllAsRead, isModalOpen, settings } = useContext(SchoolContext);
  const location = useLocation();
  const navigate = useNavigate();
  
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) setIsCollapsed(true);
      else setIsCollapsed(false);
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Filter Nav Items based on Role
  const visibleNavItems = useMemo(() => {
    return adminNavItems.filter(item => {
      const role = currentAdmin?.role;
      
      // Super Admin sees everything
      if (role === 'Super Admin') return true;

      // Teacher Restrictions
      if (role === 'Teacher') {
        if (item.path === '/admin/settings') return false;
        if (item.path === '/admin/fees') return false;
        if (item.path === '/admin/feedback') return false;
        if (item.path === '/admin/admissions') return false; 
        return true; 
      }

      // Office Staff Restrictions (Controlled by Principal/Settings)
      if (role === 'Staff') {
        if (item.path === '/admin/settings') return false;
        if (item.path === '/admin/fees' && !settings.staffPermissions.allowFees) return false;
        if (item.path === '/admin/admissions' && !settings.staffPermissions.allowAdmissions) return false;
        if (item.path === '/admin/circulars' && !settings.staffPermissions.allowNotices) return false;
        if (item.path === '/admin/gallery' && !settings.staffPermissions.allowGallery) return false;
        if (item.path === '/admin/feedback' && !settings.staffPermissions.allowFeedback) return false;
        return true;
      }

      return true;
    });
  }, [currentAdmin, settings.staffPermissions]);

  // Primary Mobile Items (Bottom Dock)
  const mobilePrimaryItems = visibleNavItems.slice(0, 4);
  const mobileSecondaryItems = visibleNavItems.slice(4);

  // Close notifications on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadFeedbackCount = feedback.filter(f => f.status === 'Unread').length;

  const handleNotificationClick = (link: string) => {
    setShowNotifications(false);
    navigate(link);
  };

  const getNotifIcon = (type: string) => {
    switch (type) {
        case 'feedback': return <MessageSquare size={16} className="text-blue-500" />;
        case 'leave': return <FileText size={16} className="text-orange-500" />;
        case 'admission': return <UserPlus size={16} className="text-green-500" />;
        default: return <Bell size={16} className="text-slate-500" />;
    }
  };

  const timeAgo = (dateStr: string) => {
    const diff = Math.floor((new Date().getTime() - new Date(dateStr).getTime()) / 60000);
    if (diff < 1) return 'Just now';
    if (diff < 60) return `${diff} mins ago`;
    const hours = Math.floor(diff / 60);
    if (hours < 24) return `${hours} hours ago`;
    return `${Math.floor(hours / 24)} days ago`;
  };

  const isDashboard = location.pathname === '/admin/dashboard';

  return (
    <div className="flex h-screen w-full overflow-hidden bg-ios-bg dark:bg-black font-sans transition-colors duration-500">
      
      {/* DESKTOP SIDEBAR (Hidden on Mobile) */}
      <aside 
        className={`hidden lg:flex flex-col h-full bg-white/80 dark:bg-[#1C1C1E]/80 backdrop-blur-2xl border-r border-ios-separator/20 transition-all duration-300 z-20 relative ${
          isCollapsed ? 'w-20 px-2' : 'w-72 px-4'
        } pt-8 pb-6`}
      >
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-9 p-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-slate-400 hover:text-ios-blue transition-colors shadow-sm z-30"
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
        
        <div className={`flex items-center gap-3 mb-8 ${isCollapsed ? 'justify-center' : 'px-2'}`}>
          <Logo className="w-10 h-10 flex-shrink-0" />
          <div className={`overflow-hidden transition-all duration-300 ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
            <h1 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight leading-none whitespace-nowrap">Admin</h1>
            <span className="text-[10px] font-bold text-ios-blue dark:text-blue-400 uppercase tracking-wider whitespace-nowrap">Console</span>
          </div>
        </div>
        
        <div className="relative mb-6">
          <div className={`flex items-center gap-3 w-full ${isCollapsed ? 'justify-center' : 'px-4'}`}>
            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center flex-shrink-0 text-slate-500 overflow-hidden">
              {currentAdmin?.photo ? (
                <img src={currentAdmin.photo} alt="Admin" className="w-full h-full object-cover" />
              ) : (
                <Shield size={20} />
              )}
            </div>
            <div className={`flex-1 min-w-0 text-left transition-all duration-300 ${isCollapsed ? 'w-0 opacity-0 hidden' : 'w-auto opacity-100'}`}>
              <span className="text-sm font-bold tracking-tight text-slate-900 dark:text-white block truncate">{currentAdmin?.name || 'Administrator'}</span>
              <span className="text-[10px] font-bold text-green-500 uppercase tracking-wider block">{currentAdmin?.role || 'Verified'}</span>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto no-scrollbar py-2">
          {visibleNavItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            const Icon = item.icon;
            const isFeedback = item.path === '/admin/feedback';
            
            return (
              <Link key={item.path} to={item.path} className="relative group block" title={isCollapsed ? item.label : undefined}>
                {isActive && (
                  <motion.div
                    layoutId="admin-active-nav"
                    className="absolute inset-0 bg-ios-blue dark:bg-blue-600 shadow-lg shadow-ios-blue/20 rounded-xl"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <div className={`relative flex items-center gap-3 py-3 rounded-xl transition-colors duration-200 ${
                  isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'
                } ${isCollapsed ? 'justify-center' : 'px-4'}`}>
                  <div className="relative">
                     <Icon size={20} className="flex-shrink-0" strokeWidth={2.5} />
                     {isFeedback && unreadFeedbackCount > 0 && currentAdmin?.role !== 'Teacher' && (
                        <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-[#1C1C1E] animate-pulse"></div>
                     )}
                  </div>
                  
                  <span className={`text-sm font-bold whitespace-nowrap transition-all duration-300 flex-1 ${isCollapsed ? 'w-0 opacity-0 hidden' : 'w-auto opacity-100'}`}>
                    {item.label}
                  </span>
                  
                  {isFeedback && !isCollapsed && unreadFeedbackCount > 0 && currentAdmin?.role !== 'Teacher' && (
                     <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${isActive ? 'bg-white/20 text-white' : 'bg-red-100 text-red-600'}`}>
                        {unreadFeedbackCount}
                     </span>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="space-y-2 pt-4 border-t border-ios-divider/20 dark:border-white/10">
          <button
            onClick={toggleTheme}
            className={`w-full flex items-center gap-3 py-3 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors ${isCollapsed ? 'justify-center px-0' : 'px-4'}`}
          >
            {theme === Theme.LIGHT ? <Moon size={20} /> : <Sun size={20} />}
            <span className={`text-sm font-bold whitespace-nowrap transition-all duration-300 ${isCollapsed ? 'w-0 opacity-0 hidden' : 'w-auto opacity-100'}`}>Theme</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 h-full overflow-y-auto overflow-x-hidden relative no-scrollbar bg-ios-bg dark:bg-black transition-colors duration-500 flex flex-col">
        {/* TOP HEADER */}
        <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 bg-white/80 dark:bg-[#1C1C1E]/80 backdrop-blur-xl border-b border-ios-separator/10">
           
           <div className="flex items-center gap-3">
              {/* Back Button (Only if not dashboard) */}
              {!isDashboard && (
                <button
                  onClick={() => navigate(-1)}
                  className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400 transition-colors"
                  title="Go Back"
                >
                  <ChevronLeft size={20} />
                </button>
              )}

              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm font-medium">
                  <Link to="/admin/dashboard" className="hover:text-ios-blue transition-colors">Admin</Link>
                  <ChevronRight size={14} />
                  <span className="text-slate-900 dark:text-white capitalize truncate max-w-[120px]">{location.pathname.split('/').pop()}</span>
              </div>
           </div>

           <div className="flex items-center gap-3">
              <div className="relative" ref={notifRef}>
                 <button 
                   onClick={() => setShowNotifications(!showNotifications)}
                   className={`p-2.5 rounded-full transition-all relative ${showNotifications ? 'bg-slate-100 dark:bg-white/10' : 'hover:bg-slate-100 dark:hover:bg-white/5 text-slate-500 dark:text-slate-300'}`}
                 >
                    <Bell size={20} className={unreadCount > 0 ? "animate-pulse-slow" : ""} />
                    {unreadCount > 0 && (
                       <span className="absolute top-1.5 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-[#1C1C1E]"></span>
                    )}
                 </button>
                 <AnimatePresence>
                    {showNotifications && (
                       <motion.div 
                         initial={{ opacity: 0, y: 10, scale: 0.95 }}
                         animate={{ opacity: 1, y: 0, scale: 1 }}
                         exit={{ opacity: 0, y: 10, scale: 0.95 }}
                         className="absolute right-0 top-full mt-3 w-80 sm:w-96 bg-white/90 dark:bg-[#1C1C1E]/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-100 dark:border-white/10 overflow-hidden z-50"
                       >
                          <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5">
                             <h3 className="font-bold text-slate-900 dark:text-white">Notifications</h3>
                             {unreadCount > 0 && (
                                <button onClick={markAllAsRead} className="text-xs font-bold text-ios-blue flex items-center gap-1 hover:underline">
                                   <CheckCheck size={14} /> Mark all read
                                </button>
                             )}
                          </div>
                          <div className="max-h-[300px] overflow-y-auto no-scrollbar">
                             {notifications.length > 0 ? (
                                notifications.map((notif) => (
                                   <button 
                                     key={notif.id}
                                     onClick={() => handleNotificationClick(notif.link)}
                                     className={`w-full text-left p-4 flex items-start gap-4 border-b border-slate-50 dark:border-white/5 transition-colors hover:bg-slate-50 dark:hover:bg-white/5 ${notif.isRead ? 'opacity-60' : 'bg-blue-50/30 dark:bg-blue-500/5'}`}
                                   >
                                      <div className={`mt-1 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${notif.isRead ? 'bg-slate-100 dark:bg-white/5' : 'bg-white dark:bg-white/10 shadow-sm'}`}>
                                         {getNotifIcon(notif.type)}
                                      </div>
                                      <div className="flex-1 min-w-0">
                                         <p className={`text-sm leading-tight ${notif.isRead ? 'font-medium text-slate-600 dark:text-slate-400' : 'font-bold text-slate-900 dark:text-white'}`}>
                                            {notif.message}
                                         </p>
                                         <p className="text-[10px] text-slate-400 mt-1 font-medium">{timeAgo(notif.time)}</p>
                                      </div>
                                      {!notif.isRead && <div className="w-2 h-2 rounded-full bg-ios-blue mt-2"></div>}
                                   </button>
                                ))
                             ) : (
                                <div className="p-8 text-center text-slate-400">
                                   <Bell size={32} className="mx-auto mb-2 opacity-20" />
                                   <p className="text-sm">No notifications</p>
                                </div>
                             )}
                          </div>
                       </motion.div>
                    )}
                 </AnimatePresence>
              </div>

              <div className="relative" ref={profileRef}>
                 <button onClick={() => setShowProfileMenu(!showProfileMenu)} className="flex items-center gap-2 group outline-none">
                    <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden border border-slate-300 dark:border-white/20 transition-transform group-hover:scale-105">
                       <img src={currentAdmin?.photo || `https://ui-avatars.com/api/?name=${currentAdmin?.name || 'Admin'}`} alt="Admin" className="w-full h-full object-cover" />
                    </div>
                 </button>
                 <AnimatePresence>
                    {showProfileMenu && (
                       <motion.div 
                         initial={{ opacity: 0, y: 10, scale: 0.95 }}
                         animate={{ opacity: 1, y: 0, scale: 1 }}
                         exit={{ opacity: 0, y: 10, scale: 0.95 }}
                         className="absolute right-0 top-full mt-3 w-64 bg-white dark:bg-[#1C1C1E] rounded-2xl shadow-xl border border-slate-100 dark:border-white/10 overflow-hidden z-50 py-1"
                       >
                          <div className="px-4 py-3 border-b border-slate-100 dark:border-white/5 mb-1">
                             <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{currentAdmin?.name}</p>
                             <p className="text-xs text-slate-500 truncate">@{currentAdmin?.username}</p>
                          </div>
                          <button onClick={() => { setShowProfileMenu(false); setShowProfileModal(true); }} className="w-full text-left px-4 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 flex items-center gap-2"><User size={16} /> My Profile</button>
                          {currentAdmin?.role === 'Super Admin' && (
                             <button onClick={() => { setShowProfileMenu(false); navigate('/admin/users'); }} className="w-full text-left px-4 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 flex items-center gap-2"><UserCog size={16} /> Manage Staff</button>
                          )}
                          <div className="border-t border-slate-100 dark:border-white/5 mt-1 pt-1">
                             <button onClick={logout} className="w-full text-left px-4 py-2.5 text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 flex items-center gap-2"><LogOut size={16} /> Logout</button>
                          </div>
                       </motion.div>
                    )}
                 </AnimatePresence>
              </div>
           </div>
        </header>

        <div className="max-w-7xl mx-auto p-5 pb-32 md:pb-10 w-full flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* MOBILE FIXED BOTTOM TAB BAR */}
      <nav 
        className={`lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/85 dark:bg-[#1C1C1E]/85 backdrop-blur-xl border-t border-slate-200/50 dark:border-white/10 pb-safe-area-bottom transition-transform duration-300 ease-in-out ${isModalOpen ? 'translate-y-full' : 'translate-y-0'}`}
      >
        <div className="flex justify-between items-end px-2 pt-2 pb-5">
          {mobilePrimaryItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setShowMobileMenu(false)}
                className="flex-1 flex flex-col items-center justify-center gap-1 py-1 active:scale-90 transition-transform duration-200 group"
              >
                <div className={`relative ${isActive ? 'text-ios-blue dark:text-blue-400' : 'text-[#8E8E93] dark:text-[#98989D]'}`}>
                   <Icon 
                      size={26} 
                      strokeWidth={isActive ? 2.5 : 2} 
                      className={`transition-all duration-300 ${isActive ? 'scale-105' : 'scale-100'}`}
                   />
                </div>
                
                <span className={`text-[10px] font-medium tracking-tight transition-colors duration-200 leading-none ${isActive ? 'text-ios-blue dark:text-blue-400 font-semibold' : 'text-[#8E8E93] dark:text-[#98989D]'}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
          
          {/* Menu Button */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="flex-1 flex flex-col items-center justify-center gap-1 py-1 active:scale-90 transition-transform duration-200 group"
          >
             <div className={`relative ${showMobileMenu ? 'text-ios-blue dark:text-blue-400' : 'text-[#8E8E93] dark:text-[#98989D]'}`}>
                {showMobileMenu ? <X size={26} strokeWidth={2.5} /> : <Grid size={26} strokeWidth={2} />}
             </div>
             <span className={`text-[10px] font-medium tracking-tight transition-colors duration-200 leading-none ${showMobileMenu ? 'text-ios-blue dark:text-blue-400 font-semibold' : 'text-[#8E8E93] dark:text-[#98989D]'}`}>
                Menu
             </span>
          </button>
        </div>
      </nav>

      {/* MOBILE APP LIBRARY OVERLAY */}
      <AnimatePresence>
         {showMobileMenu && (
            <motion.div
               initial={{ opacity: 0, y: '100%' }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: '100%' }}
               transition={{ type: 'spring', damping: 25, stiffness: 200 }}
               className="fixed inset-0 z-40 bg-slate-50/95 dark:bg-black/95 backdrop-blur-xl pt-24 px-6 pb-32 overflow-y-auto"
            >
               <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight">App Library</h2>
               <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {mobileSecondaryItems.map((item) => (
                     <Link 
                        key={item.path} 
                        to={item.path} 
                        onClick={() => setShowMobileMenu(false)}
                        className="flex flex-col items-center gap-3 p-4 rounded-[1.5rem] bg-white dark:bg-[#1C1C1E] shadow-sm active:scale-95 transition-transform"
                     >
                        <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-white/10 flex items-center justify-center text-ios-blue">
                           <item.icon size={24} />
                        </div>
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{item.label}</span>
                     </Link>
                  ))}
                  
                  {/* Theme Toggle */}
                  <button 
                     onClick={toggleTheme}
                     className="flex flex-col items-center gap-3 p-4 rounded-[1.5rem] bg-white dark:bg-[#1C1C1E] shadow-sm active:scale-95 transition-transform"
                  >
                     <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-white/10 flex items-center justify-center text-slate-500">
                        {theme === Theme.LIGHT ? <Moon size={24} /> : <Sun size={24} />}
                     </div>
                     <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{theme === Theme.LIGHT ? 'Dark Mode' : 'Light Mode'}</span>
                  </button>
               </div>
            </motion.div>
         )}
      </AnimatePresence>

      <AnimatePresence>
         {showProfileModal && currentAdmin && (
            <MyProfileModal 
               admin={currentAdmin} 
               onClose={() => setShowProfileModal(false)} 
               onSave={(updated) => { updateAdminProfile(updated); setShowProfileModal(false); }} 
            />
         )}
      </AnimatePresence>
    </div>
  );
};

// ... MyProfileModal (Same as before)
const MyProfileModal: React.FC<{ admin: AdminUser, onClose: () => void, onSave: (admin: AdminUser) => void }> = ({ admin, onClose, onSave }) => {
   const [formData, setFormData] = useState({ name: admin.name, username: admin.username, mobile: admin.mobile, password: admin.password, newPassword: '', photo: admin.photo });
   const [isSaving, setIsSaving] = useState(false);
   const fileRef = useRef<HTMLInputElement>(null);
   const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
         const reader = new FileReader();
         reader.onloadend = () => { setFormData(prev => ({ ...prev, photo: reader.result as string })); };
         reader.readAsDataURL(file);
      }
   };
   const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); setIsSaving(true); setTimeout(() => { onSave({ ...admin, name: formData.name, photo: formData.photo, password: formData.newPassword ? formData.newPassword : formData.password }); setIsSaving(false); }, 800); };
   return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
         <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
         <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-white dark:bg-[#1C1C1E] w-full max-w-md rounded-[2rem] shadow-2xl p-6 md:p-8">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Edit Profile</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
               <div className="flex flex-col items-center">
                  <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-slate-100 dark:border-white/10 group cursor-pointer" onClick={() => fileRef.current?.click()}>
                     <img src={formData.photo || `https://ui-avatars.com/api/?name=${formData.name}`} className="w-full h-full object-cover" alt="Profile" />
                     <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><Camera className="text-white" size={24} /></div>
                  </div>
                  <input type="file" ref={fileRef} className="hidden" accept="image/*" onChange={handlePhotoChange} />
               </div>
               <div className="space-y-4">
                  <div><label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Full Name</label><input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full p-3 rounded-xl bg-slate-50 dark:bg-black/20 border-none outline-none focus:ring-2 focus:ring-ios-blue/50 text-slate-900 dark:text-white font-medium mt-1" required /></div>
                  <div className="pt-4 border-t border-slate-100 dark:border-white/5"><label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2"><Key size={14} /> Change Password</label><input type="password" placeholder="Leave blank to keep current" value={formData.newPassword} onChange={(e) => setFormData({...formData, newPassword: e.target.value})} className="w-full p-3 rounded-xl bg-slate-50 dark:bg-black/20 border-none outline-none focus:ring-2 focus:ring-ios-blue/50 text-slate-900 dark:text-white mt-2" /></div>
               </div>
               <div className="flex gap-3 pt-2">
                  <button type="button" onClick={onClose} className="flex-1 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-white/10">Cancel</button>
                  <button type="submit" disabled={isSaving} className="flex-1 py-3 bg-ios-blue text-white rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-transform disabled:opacity-70">{isSaving ? <Loader2 className="animate-spin" size={20} /> : <><Save size={18} /> Save Changes</>}</button>
               </div>
            </form>
         </motion.div>
      </div>
   );
};
