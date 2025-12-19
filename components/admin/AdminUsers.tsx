
import React, { useContext, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  Plus, 
  Trash2, 
  Edit, 
  User, 
  Key, 
  Smartphone,
  Search,
  CheckCircle,
  X,
  UserCog,
  GraduationCap,
  Eye,
  Lock
} from 'lucide-react';
import { AuthContext } from '../../App';
import { AdminUser } from '../../types';

const CLASSES = ["Nursery", "LKG", "UKG", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];
const SECTIONS = ["A", "B", "C", "D"];

const emptyAdmin: Omit<AdminUser, 'id'> = {
  name: '',
  username: '',
  password: '',
  role: 'Staff',
  mobile: '',
  photo: '',
  assignedClass: '',
  assignedSection: ''
};

export const AdminUsers: React.FC = () => {
  const { adminUsers, setAdminUsers, currentAdmin } = useContext(AuthContext);
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [viewingUser, setViewingUser] = useState<AdminUser | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Permission Check
  if (currentAdmin?.role !== 'Super Admin') {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <Shield size={64} className="text-slate-300 mb-4" />
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Access Denied</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Only Super Admins can manage staff accounts.</p>
      </div>
    );
  }

  const filteredUsers = adminUsers.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenModal = (user: AdminUser | null) => {
    setEditingUser(user);
    setShowModal(true);
  };

  const handleViewDetails = (user: AdminUser) => {
    setViewingUser(user);
    setShowDetailModal(true);
  };

  const handleDelete = (id: number) => {
    if (id === currentAdmin.id) {
      alert("You cannot delete your own account.");
      return;
    }
    if (window.confirm("Are you sure you want to remove this account?")) {
      setAdminUsers(prev => prev.filter(u => u.id !== id));
    }
  };

  const handleSave = (userData: Omit<AdminUser, 'id'>) => {
    if (editingUser) {
      // Edit Mode
      setAdminUsers(prev => prev.map(u => u.id === editingUser.id ? { ...userData, id: u.id } : u));
    } else {
      // Add Mode
      if (adminUsers.some(u => u.username === userData.username)) {
        alert("Username already exists!");
        return;
      }
      const newUser = {
        ...userData,
        id: Date.now(),
        photo: `https://ui-avatars.com/api/?name=${userData.name}&background=random`
      };
      setAdminUsers(prev => [...prev, newUser]);
    }
    setShowModal(false);
  };

  return (
    <div className="space-y-8 pb-20 md:pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
             <UserCog className="text-ios-blue" size={32} /> Staff Directory
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage Teachers, Admins, and Roles.</p>
        </div>
        
        <button 
          onClick={() => handleOpenModal(null)}
          className="bg-ios-blue text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-ios-blue/30 active:scale-95 transition-transform flex items-center gap-2 w-full md:w-auto justify-center"
        >
          <Plus size={20} /> Add New User
        </button>
      </div>

      {/* List Container */}
      <div className="bg-white dark:bg-[#1C1C1E] rounded-[2rem] border border-slate-100 dark:border-white/5 shadow-sm overflow-hidden">
         {/* Toolbar */}
         <div className="p-4 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5">
            <div className="relative max-w-md">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
               <input 
                 type="text" 
                 placeholder="Search staff..." 
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="w-full bg-white dark:bg-black/20 pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 outline-none focus:ring-2 focus:ring-ios-blue/50 text-slate-900 dark:text-white"
               />
            </div>
         </div>

         {/* Responsive List / Table */}
         <div className="md:block hidden">
            <table className="w-full text-left">
               <thead className="bg-slate-50 dark:bg-white/5 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <tr>
                     <th className="p-5">User</th>
                     <th className="p-5">Role</th>
                     <th className="p-5">Assignment</th>
                     <th className="p-5">Mobile</th>
                     <th className="p-5 text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                  {filteredUsers.map(user => (
                     <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group">
                        <td className="p-5 cursor-pointer" onClick={() => handleViewDetails(user)}>
                           <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden">
                                 <img src={user.photo} alt="" className="w-full h-full object-cover" />
                              </div>
                              <div>
                                 <p className="font-bold text-slate-900 dark:text-white group-hover:text-ios-blue transition-colors">{user.name}</p>
                                 <p className="text-xs text-slate-500">@{user.username}</p>
                              </div>
                           </div>
                        </td>
                        <td className="p-5">
                           <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                             user.role === 'Super Admin' ? 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400' : 
                             user.role === 'Teacher' ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400' :
                             'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400'
                           }`}>
                              {user.role}
                           </span>
                        </td>
                        <td className="p-5">
                           {user.role === 'Teacher' && user.assignedClass ? (
                              <span className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 dark:text-slate-300">
                                 <GraduationCap size={16} className="text-ios-blue" />
                                 Class {user.assignedClass}-{user.assignedSection}
                              </span>
                           ) : (
                              <span className="text-xs text-slate-400">Full Access</span>
                           )}
                        </td>
                        <td className="p-5 text-sm font-mono text-slate-600 dark:text-slate-400">
                           {user.mobile}
                        </td>
                        <td className="p-5">
                           <div className="flex justify-end gap-2">
                              <button 
                                onClick={() => handleViewDetails(user)}
                                className="p-2 rounded-lg bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-slate-600 dark:text-slate-300 transition-colors"
                                title="View Details"
                              >
                                 <Eye size={16} />
                              </button>
                              <button 
                                onClick={() => handleOpenModal(user)}
                                className="p-2 rounded-lg bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-slate-600 dark:text-slate-300 transition-colors"
                                title="Edit"
                              >
                                 <Edit size={16} />
                              </button>
                              {user.id !== currentAdmin.id && (
                                <button 
                                  onClick={() => handleDelete(user.id)}
                                  className="p-2 rounded-lg bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 text-red-500 transition-colors"
                                  title="Remove"
                                >
                                   <Trash2 size={16} />
                                </button>
                              )}
                           </div>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>

         {/* Mobile Card View */}
         <div className="md:hidden p-4 space-y-4">
            {filteredUsers.map(user => (
               <div key={user.id} className="bg-slate-50 dark:bg-white/5 rounded-2xl p-4 flex flex-col gap-4 border border-slate-100 dark:border-white/5">
                  <div className="flex justify-between items-start">
                     <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-slate-200 overflow-hidden">
                           <img src={user.photo} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div>
                           <p className="font-bold text-slate-900 dark:text-white">{user.name}</p>
                           <p className="text-xs text-slate-500">@{user.username}</p>
                        </div>
                     </div>
                     <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        user.role === 'Super Admin' ? 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400' : 
                        user.role === 'Teacher' ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400' :
                        'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400'
                     }`}>
                        {user.role}
                     </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm">
                     <div className="text-slate-500">Assignment:</div>
                     <div className="text-slate-900 dark:text-white font-medium text-right">
                        {user.role === 'Teacher' && user.assignedClass ? (
                           <span className="flex items-center justify-end gap-1">
                              <GraduationCap size={14} className="text-ios-blue" />
                              {user.assignedClass}-{user.assignedSection}
                           </span>
                        ) : 'Full Access'}
                     </div>
                     <div className="text-slate-500">Mobile:</div>
                     <div className="text-slate-900 dark:text-white font-medium font-mono text-right">{user.mobile}</div>
                  </div>

                  <div className="flex gap-2 pt-2 border-t border-slate-200 dark:border-white/10">
                     <button 
                        onClick={() => handleViewDetails(user)}
                        className="flex-1 py-2 rounded-xl bg-white dark:bg-white/10 text-slate-700 dark:text-slate-200 font-bold text-sm shadow-sm flex items-center justify-center gap-2"
                     >
                        <Eye size={16} /> Details
                     </button>
                     <button 
                        onClick={() => handleOpenModal(user)}
                        className="flex-1 py-2 rounded-xl bg-white dark:bg-white/10 text-slate-700 dark:text-slate-200 font-bold text-sm shadow-sm flex items-center justify-center gap-2"
                     >
                        <Edit size={16} /> Edit
                     </button>
                     {user.id !== currentAdmin.id && (
                        <button 
                           onClick={() => handleDelete(user.id)}
                           className="flex-1 py-2 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 font-bold text-sm flex items-center justify-center gap-2"
                        >
                           <Trash2 size={16} />
                        </button>
                     )}
                  </div>
               </div>
            ))}
         </div>
      </div>

      <AnimatePresence>
         {showModal && (
            <AdminUserForm 
               user={editingUser} 
               onSave={handleSave} 
               onClose={() => setShowModal(false)} 
            />
         )}
         {showDetailModal && viewingUser && (
            <ViewUserModal 
               user={viewingUser}
               onClose={() => setShowDetailModal(false)}
            />
         )}
      </AnimatePresence>
    </div>
  );
};

const ViewUserModal: React.FC<{ user: AdminUser, onClose: () => void }> = ({ user, onClose }) => {
   return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
         <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
         />
         <motion.div 
            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
            className="relative bg-white dark:bg-[#1C1C1E] w-full max-w-sm rounded-[2rem] shadow-2xl p-8 overflow-hidden"
         >
            <div className="absolute top-0 right-0 p-4">
               <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10"><X size={20} /></button>
            </div>
            
            <div className="flex flex-col items-center text-center">
               <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-4 border-slate-100 dark:border-white/10 shadow-lg">
                  <img src={user.photo} className="w-full h-full object-cover" alt="" />
               </div>
               <h2 className="text-xl font-bold text-slate-900 dark:text-white">{user.name}</h2>
               <span className={`mt-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  user.role === 'Super Admin' ? 'bg-purple-100 text-purple-700' : 
                  user.role === 'Teacher' ? 'bg-green-100 text-green-700' :
                  'bg-blue-100 text-blue-700'
               }`}>
                  {user.role}
               </span>
            </div>

            <div className="mt-8 space-y-4">
               <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Username</p>
                  <p className="font-mono font-bold text-slate-800 dark:text-slate-200">{user.username}</p>
               </div>
               <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-xl border border-slate-100 dark:border-white/5 flex justify-between items-center">
                  <div>
                     <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Password</p>
                     <p className="font-mono font-bold text-slate-800 dark:text-slate-200">{user.password}</p>
                  </div>
                  <Lock size={16} className="text-slate-400" />
               </div>
               <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Contact</p>
                  <p className="font-bold text-slate-800 dark:text-slate-200">{user.mobile}</p>
               </div>
               {user.role === 'Teacher' && (
                  <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-xl border border-slate-100 dark:border-white/5">
                     <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Assigned To</p>
                     <p className="font-bold text-slate-800 dark:text-slate-200">Class {user.assignedClass} - {user.assignedSection}</p>
                  </div>
               )}
            </div>
         </motion.div>
      </div>
   );
};

const AdminUserForm: React.FC<{ user: AdminUser | null, onSave: (data: any) => void, onClose: () => void }> = ({ user, onSave, onClose }) => {
   const [formData, setFormData] = useState(user ? { ...user } : { ...emptyAdmin });

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSave(formData);
   };

   return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
         <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
         />
         <motion.div 
            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
            className="relative bg-white dark:bg-[#1C1C1E] w-full max-w-md rounded-[2rem] shadow-2xl p-8 max-h-[90vh] overflow-y-auto"
         >
            <div className="flex justify-between items-center mb-6">
               <h2 className="text-xl font-bold text-slate-900 dark:text-white">{user ? 'Edit User' : 'New Staff Account'}</h2>
               <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10"><X size={20} /></button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
               <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Full Name</label>
                  <div className="relative mt-1">
                     <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                     <input 
                        type="text" 
                        required
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-black/20 rounded-xl border-none outline-none focus:ring-2 focus:ring-ios-blue/50 text-slate-900 dark:text-white"
                        placeholder="e.g. John Doe"
                     />
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div>
                     <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Username</label>
                     <input 
                        type="text" 
                        required
                        value={formData.username}
                        onChange={e => setFormData({...formData, username: e.target.value})}
                        className="w-full p-3 mt-1 bg-slate-50 dark:bg-black/20 rounded-xl border-none outline-none focus:ring-2 focus:ring-ios-blue/50 text-slate-900 dark:text-white"
                        placeholder="john.doe"
                     />
                  </div>
                  <div>
                     <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Mobile</label>
                     <div className="relative mt-1">
                        <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input 
                           type="text" 
                           required
                           value={formData.mobile}
                           onChange={e => setFormData({...formData, mobile: e.target.value})}
                           className="w-full pl-9 pr-3 py-3 bg-slate-50 dark:bg-black/20 rounded-xl border-none outline-none focus:ring-2 focus:ring-ios-blue/50 text-slate-900 dark:text-white"
                           placeholder="98765..."
                        />
                     </div>
                  </div>
               </div>

               <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Password</label>
                  <div className="relative mt-1">
                     <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                     <input 
                        type="text" 
                        required
                        value={formData.password}
                        onChange={e => setFormData({...formData, password: e.target.value})}
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-black/20 rounded-xl border-none outline-none focus:ring-2 focus:ring-ios-blue/50 text-slate-900 dark:text-white"
                        placeholder="Set password"
                     />
                  </div>
               </div>

               <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Role</label>
                  <div className="flex gap-2 mt-2">
                     <label className={`flex-1 p-2 rounded-xl border-2 cursor-pointer flex flex-col items-center justify-center gap-1 transition-all ${formData.role === 'Super Admin' ? 'border-purple-500 bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400' : 'border-slate-200 dark:border-white/10'}`}>
                        <input type="radio" name="role" className="hidden" checked={formData.role === 'Super Admin'} onChange={() => setFormData({...formData, role: 'Super Admin'})} />
                        <Shield size={18} /> <span className="text-xs font-bold">Admin</span>
                     </label>
                     <label className={`flex-1 p-2 rounded-xl border-2 cursor-pointer flex flex-col items-center justify-center gap-1 transition-all ${formData.role === 'Teacher' ? 'border-green-500 bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400' : 'border-slate-200 dark:border-white/10'}`}>
                        <input type="radio" name="role" className="hidden" checked={formData.role === 'Teacher'} onChange={() => setFormData({...formData, role: 'Teacher'})} />
                        <GraduationCap size={18} /> <span className="text-xs font-bold">Teacher</span>
                     </label>
                     <label className={`flex-1 p-2 rounded-xl border-2 cursor-pointer flex flex-col items-center justify-center gap-1 transition-all ${formData.role === 'Staff' ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400' : 'border-slate-200 dark:border-white/10'}`}>
                        <input type="radio" name="role" className="hidden" checked={formData.role === 'Staff'} onChange={() => setFormData({...formData, role: 'Staff'})} />
                        <User size={18} /> <span className="text-xs font-bold">Office</span>
                     </label>
                  </div>
               </div>

               {formData.role === 'Teacher' && (
                  <div className="bg-green-50 dark:bg-green-500/5 p-4 rounded-xl border border-green-200 dark:border-green-500/10 animate-fade-in">
                     <label className="text-xs font-bold text-green-700 dark:text-green-400 uppercase tracking-wider mb-2 block">Class Assignment</label>
                     <div className="grid grid-cols-2 gap-4">
                        <select 
                           value={formData.assignedClass} 
                           onChange={e => setFormData({...formData, assignedClass: e.target.value})}
                           className="w-full p-2 rounded-lg bg-white dark:bg-[#1C1C1E] border border-green-200 dark:border-green-500/20 text-slate-900 dark:text-white"
                        >
                           <option value="">Select Class</option>
                           {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <select 
                           value={formData.assignedSection} 
                           onChange={e => setFormData({...formData, assignedSection: e.target.value})}
                           className="w-full p-2 rounded-lg bg-white dark:bg-[#1C1C1E] border border-green-200 dark:border-green-500/20 text-slate-900 dark:text-white"
                        >
                           <option value="">Select Section</option>
                           {SECTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                     </div>
                  </div>
               )}

               <button type="submit" className="w-full py-4 bg-ios-blue text-white font-bold rounded-xl shadow-lg mt-4 active:scale-95 transition-transform">
                  Save User
               </button>
            </form>
         </motion.div>
      </div>
   );
};
