
import React, { useContext, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SchoolContext, AuthContext } from '../../App';
import { 
  Settings, Save, Layout, Building2, UploadCloud, 
  ToggleLeft, ShieldAlert, Calendar, 
  Trash2, AlertTriangle, Download, RefreshCw, AlertOctagon, X, Image as ImageIcon,
  Lock
} from 'lucide-react';

// --- TYPES ---
type ModalType = 'promote' | 'attendance' | 'factory' | null;

interface ModalConfig {
  type: ModalType;
  title: string;
  message: string;
  confirmPhrase?: string;
  action: () => void;
}

export const AdminSettings: React.FC = () => {
  const { settings, updateSettings, setAttendance, attendance, examResults, feeStructure, notices, gallery } = useContext(SchoolContext);
  const { setAllStudents, allStudents, currentAdmin } = useContext(AuthContext);

  // Local state for forms
  const [formData, setFormData] = useState(settings);
  const [activeTab, setActiveTab] = useState<'General' | 'Modules' | 'Danger'>('General');
  const [modalConfig, setModalConfig] = useState<ModalConfig | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // PERMISSION CHECK
  if (currentAdmin?.role !== 'Super Admin') {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <div className="w-24 h-24 bg-red-50 dark:bg-red-500/10 rounded-full flex items-center justify-center mb-6">
           <ShieldAlert size={48} className="text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Access Denied</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-sm">
           System settings are restricted to Super Admins only. Please contact your administrator.
        </p>
      </div>
    );
  }

  // --- HANDLERS: GENERAL ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const saveGeneralSettings = () => {
    updateSettings(formData);
    alert('Settings Saved Successfully!');
  };

  // --- HANDLERS: LOGO ---
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 500000) { // 500KB limit for LocalStorage safety
        alert("File is too large. Please use an image under 500KB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        updateSettings({ logoUrl: base64String });
        setFormData(prev => ({ ...prev, logoUrl: base64String }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    const defaultLogo = 'https://cdn-icons-png.flaticon.com/512/2996/2996962.png';
    updateSettings({ logoUrl: defaultLogo });
    setFormData(prev => ({ ...prev, logoUrl: defaultLogo }));
  };

  // --- HANDLERS: TOGGLES ---
  const handleToggle = (key: keyof typeof settings) => {
    const newVal = !settings[key];
    updateSettings({ [key]: newVal });
    setFormData(prev => ({ ...prev, [key]: newVal }));
  };

  // --- DANGER ZONE LOGIC ---

  const triggerBackup = () => {
    const backupData = {
      timestamp: new Date().toISOString(),
      settings,
      students: allStudents,
      attendance,
      results: examResults,
      fees: feeStructure,
      notices,
      gallery
    };
    
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `school_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const executePromoteStudents = () => {
    const classMap: Record<string, string> = {
      "Nursery": "LKG", "LKG": "UKG", "UKG": "I",
      "I": "II", "II": "III", "III": "IV", "IV": "V", "V": "VI",
      "VI": "VII", "VII": "VIII", "VIII": "IX", "IX": "X",
      "X": "Alumni", "Alumni": "Alumni"
    };

    const promotedStudents = allStudents.map(student => ({
      ...student,
      class: classMap[student.class] || student.class,
      session: settings.currentSession // Update to new session tag
    }));

    setAllStudents(promotedStudents);
    alert(`Successfully promoted ${promotedStudents.length} students to the next class.`);
    setModalConfig(null);
  };

  const executeResetAttendance = () => {
    setAttendance({});
    setModalConfig(null);
    alert("Attendance database has been wiped clean.");
  };

  const executeFactoryReset = () => {
    localStorage.clear();
    window.location.reload();
  };

  // --- MODAL TRIGGERS ---
  const openPromoteModal = () => setModalConfig({
    type: 'promote',
    title: 'Promote All Students',
    message: 'This will move every student to the next class (e.g., IX → X). Class X students will become "Alumni".',
    confirmPhrase: 'PROMOTE 2025',
    action: executePromoteStudents
  });

  const openAttendanceModal = () => setModalConfig({
    type: 'attendance',
    title: 'Clear Attendance Data',
    message: 'You are about to delete ALL attendance history. This allows you to start a new academic year fresh.',
    confirmPhrase: 'CLEAR DATA',
    action: executeResetAttendance
  });

  const openFactoryModal = () => setModalConfig({
    type: 'factory',
    title: 'Factory Reset App',
    message: 'This will delete ALL students, results, fees, and settings. The app will return to its initial state. This cannot be undone.',
    confirmPhrase: 'DELETE EVERYTHING',
    action: executeFactoryReset
  });

  return (
    <div className="space-y-8 pb-20">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Master Control Panel</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Configure global application settings</p>
      </div>

      {/* Tabs */}
      <div className="flex p-1 bg-white dark:bg-[#1C1C1E] rounded-2xl shadow-sm border border-slate-100 dark:border-white/5 w-fit">
         {['General', 'Modules', 'Danger'].map((tab) => (
             <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                    activeTab === tab 
                    ? tab === 'Danger' ? 'bg-red-500 text-white shadow-md' : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
                }`}
             >
                {tab}
             </button>
         ))}
      </div>

      <div className="max-w-4xl">
        {/* GENERAL TAB */}
        {activeTab === 'General' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                
                {/* Branding Section */}
                <div className="bg-white dark:bg-[#1C1C1E] p-8 rounded-[2rem] shadow-sm border border-slate-100 dark:border-white/5">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                            <Building2 size={20} />
                        </div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Identity & Branding</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputGroup label="School Name" name="schoolName" value={formData.schoolName} onChange={handleChange} />
                        <InputGroup label="Contact Number" name="contactNumber" value={formData.contactNumber} onChange={handleChange} />
                        <InputGroup label="Email Address" name="email" value={formData.email} onChange={handleChange} />
                        <div className="md:col-span-2">
                            <InputGroup label="School Address" name="schoolAddress" value={formData.schoolAddress} onChange={handleChange} />
                        </div>
                    </div>

                    {/* Logo Uploader */}
                    <div className="mt-8 pt-8 border-t border-slate-100 dark:border-white/5">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">School Logo</label>
                        <div className="flex items-center gap-6">
                            <div className="relative w-24 h-24 bg-slate-50 dark:bg-white/5 rounded-2xl border-2 border-slate-100 dark:border-white/10 p-2 group">
                                <img src={formData.logoUrl} alt="Logo" className="w-full h-full object-contain" />
                                <button 
                                  onClick={handleRemoveLogo}
                                  className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                                  title="Reset to Default"
                                >
                                  <X size={12} />
                                </button>
                            </div>
                            
                            <div className="flex-1">
                                <input 
                                  type="file" 
                                  accept="image/*" 
                                  ref={fileInputRef} 
                                  className="hidden" 
                                  onChange={handleLogoUpload} 
                                />
                                <div 
                                  onClick={() => fileInputRef.current?.click()}
                                  className="border-2 border-dashed border-slate-300 dark:border-white/20 rounded-2xl h-24 flex flex-col items-center justify-center text-slate-400 cursor-pointer hover:border-ios-blue hover:text-ios-blue hover:bg-slate-50 dark:hover:bg-white/5 transition-all"
                                >
                                    <UploadCloud size={24} />
                                    <span className="text-sm font-bold mt-2">Click to Upload New Logo</span>
                                    <span className="text-[10px] opacity-70">Recommended: 512x512 PNG (Max 500KB)</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Session Management */}
                <div className="bg-white dark:bg-[#1C1C1E] p-8 rounded-[2rem] shadow-sm border border-slate-100 dark:border-white/5">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                            <Calendar size={20} />
                        </div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Academic Session</h2>
                    </div>
                    
                    <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-black/20 rounded-2xl border border-slate-100 dark:border-white/5">
                        <div className="flex-1">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Current Active Session</label>
                            <select 
                                name="currentSession"
                                value={formData.currentSession}
                                onChange={handleChange}
                                className="w-full bg-transparent font-bold text-lg text-slate-900 dark:text-white outline-none"
                            >
                                <option>2024-25</option>
                                <option>2025-26</option>
                                <option>2026-27</option>
                            </select>
                        </div>
                        <div className="text-xs text-slate-400 max-w-[200px] text-right">
                            Changing this will filter all student data globally.
                        </div>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button onClick={saveGeneralSettings} className="bg-ios-blue text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-ios-blue/30 active:scale-95 transition-transform flex items-center gap-2">
                        <Save size={18} /> Save Changes
                    </button>
                </div>
            </motion.div>
        )}

        {/* MODULES TAB */}
        {activeTab === 'Modules' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="bg-white dark:bg-[#1C1C1E] p-8 rounded-[2rem] shadow-sm border border-slate-100 dark:border-white/5">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400 flex items-center justify-center">
                            <Layout size={20} />
                        </div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Feature Toggles</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <ToggleSwitch label="Student Login" desc="Allow students to access the app" isOn={settings.enableStudentLogin} onToggle={() => handleToggle('enableStudentLogin')} />
                        <ToggleSwitch label="Exam Results" desc="Show 'Results' tab in student app" isOn={settings.showResults} onToggle={() => handleToggle('showResults')} />
                        <ToggleSwitch label="Online Fees" desc="Enable 'Pay Now' button" isOn={settings.enableOnlineFees} onToggle={() => handleToggle('enableOnlineFees')} />
                        <ToggleSwitch label="Admissions Open" desc="Show admission inquiry form" isOn={settings.admissionsOpen} onToggle={() => handleToggle('admissionsOpen')} />
                        <ToggleSwitch label="Sibling Login" desc="Allow multiple profiles per number" isOn={settings.siblingLoginEnabled} onToggle={() => handleToggle('siblingLoginEnabled')} />
                    </div>
                </div>
            </motion.div>
        )}

        {/* DANGER ZONE TAB */}
        {activeTab === 'Danger' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="bg-red-50 dark:bg-red-900/10 p-8 rounded-[2rem] border-2 border-red-100 dark:border-red-500/20 relative overflow-hidden">
                    <div className="flex items-center gap-3 mb-8 relative z-10">
                        <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 flex items-center justify-center">
                            <ShieldAlert size={24} />
                        </div>
                        <div>
                           <h2 className="text-2xl font-bold text-red-700 dark:text-red-400">Danger Zone</h2>
                           <p className="text-red-600/70 text-sm">Irreversible actions. Tread carefully.</p>
                        </div>
                    </div>

                    {/* Watermark Icon */}
                    <AlertOctagon className="absolute -right-10 -bottom-10 w-64 h-64 text-red-100 dark:text-red-900/20 opacity-50 rotate-12 pointer-events-none" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                        
                        {/* 1. Backup */}
                        <div className="bg-white dark:bg-black/40 p-5 rounded-2xl border border-red-100 dark:border-red-500/10 shadow-sm flex flex-col justify-between h-40">
                            <div>
                                <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                   <Download size={18} className="text-blue-500" /> Export Data
                                </h3>
                                <p className="text-xs text-slate-500 mt-2">Download a full JSON backup of students, marks, and fees.</p>
                            </div>
                            <button onClick={triggerBackup} className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg font-bold text-sm hover:bg-blue-100 transition-colors w-full">
                                Download Backup
                            </button>
                        </div>

                        {/* 2. Promote */}
                        <div className="bg-white dark:bg-black/40 p-5 rounded-2xl border border-red-100 dark:border-red-500/10 shadow-sm flex flex-col justify-between h-40">
                            <div>
                                <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                   <RefreshCw size={18} className="text-orange-500" /> End of Session
                                </h3>
                                <p className="text-xs text-slate-500 mt-2">Promote all students to the next class automatically.</p>
                            </div>
                            <button onClick={openPromoteModal} className="bg-orange-50 text-orange-600 px-4 py-2 rounded-lg font-bold text-sm hover:bg-orange-100 transition-colors w-full">
                                Promote Students
                            </button>
                        </div>

                        {/* 3. Reset Attendance */}
                        <div className="bg-white dark:bg-black/40 p-5 rounded-2xl border border-red-100 dark:border-red-500/10 shadow-sm flex flex-col justify-between h-40">
                            <div>
                                <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                   <Calendar size={18} className="text-red-500" /> Clear Attendance
                                </h3>
                                <p className="text-xs text-slate-500 mt-2">Wipe all daily attendance logs. Keeps student profiles.</p>
                            </div>
                            <button onClick={openAttendanceModal} className="bg-red-50 text-red-600 px-4 py-2 rounded-lg font-bold text-sm hover:bg-red-100 transition-colors w-full">
                                Reset History
                            </button>
                        </div>

                        {/* 4. Factory Reset */}
                        <div className="bg-white dark:bg-black/40 p-5 rounded-2xl border border-red-100 dark:border-red-500/10 shadow-sm flex flex-col justify-between h-40">
                            <div>
                                <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                   <Trash2 size={18} className="text-red-600" /> Factory Reset
                                </h3>
                                <p className="text-xs text-slate-500 mt-2">Delete EVERYTHING and restart app from scratch.</p>
                            </div>
                            <button onClick={openFactoryModal} className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-red-700 transition-colors w-full shadow-lg shadow-red-600/20">
                                Hard Reset App
                            </button>
                        </div>

                    </div>
                </div>
            </motion.div>
        )}
      </div>

      {/* CONFIRMATION MODAL SYSTEM */}
      <AnimatePresence>
        {modalConfig && (
          <ConfirmationModal 
             config={modalConfig} 
             onClose={() => setModalConfig(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// --- CONFIRMATION MODAL COMPONENT ---
const ConfirmationModal = ({ config, onClose }: { config: ModalConfig, onClose: () => void }) => {
  const [inputText, setInputText] = useState('');
  const isConfirmed = !config.confirmPhrase || inputText === config.confirmPhrase;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
        onClick={onClose}
      />
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
        className="relative bg-white dark:bg-[#1C1C1E] w-full max-w-md rounded-[2rem] shadow-2xl overflow-hidden border border-red-100 dark:border-red-500/20"
      >
        <div className="p-6 bg-red-50 dark:bg-red-500/10 border-b border-red-100 dark:border-red-500/20 flex items-center gap-3">
           <AlertTriangle className="text-red-600 dark:text-red-400" size={24} />
           <h3 className="text-xl font-bold text-red-700 dark:text-red-400">{config.title}</h3>
        </div>
        
        <div className="p-6 space-y-4">
           <p className="text-slate-600 dark:text-slate-300 text-sm font-medium leading-relaxed">
             {config.message}
           </p>

           {config.confirmPhrase && (
             <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                   Type <span className="text-red-600 select-all font-mono">"{config.confirmPhrase}"</span> to confirm:
                </label>
                <input 
                  type="text" 
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={config.confirmPhrase}
                  className="w-full p-3 border-2 border-slate-200 dark:border-white/10 rounded-xl outline-none focus:border-red-500 text-center font-bold text-slate-900 dark:text-white bg-transparent"
                  autoFocus
                />
             </div>
           )}
        </div>

        <div className="p-4 bg-slate-50 dark:bg-black/20 flex gap-3">
           <button onClick={onClose} className="flex-1 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors">
             Cancel
           </button>
           <button 
             onClick={config.action} 
             disabled={!isConfirmed}
             className="flex-1 py-3 rounded-xl font-bold text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-red-500/20 transition-all"
           >
             Confirm Action
           </button>
        </div>
      </motion.div>
    </div>
  );
};

// --- HELPER COMPONENTS ---

const InputGroup = ({ label, name, value, onChange }: any) => (
    <div className="space-y-1">
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">{label}</label>
        <input 
            type="text" 
            name={name}
            value={value} 
            onChange={onChange}
            className="w-full p-3 bg-slate-50 dark:bg-black/20 rounded-xl outline-none focus:ring-2 focus:ring-ios-blue/50 text-slate-900 dark:text-white font-medium border border-transparent focus:border-ios-blue/30 transition-all"
        />
    </div>
);

const ToggleSwitch = ({ label, desc, isOn, onToggle }: { label: string, desc: string, isOn: boolean, onToggle: () => void }) => (
    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-black/20 rounded-2xl border border-slate-100 dark:border-white/5 cursor-pointer" onClick={onToggle}>
        <div>
            <h3 className="font-bold text-slate-900 dark:text-white">{label}</h3>
            <p className="text-xs text-slate-500">{desc}</p>
        </div>
        <motion.div 
            className={`w-14 h-8 rounded-full flex items-center p-1 transition-colors ${isOn ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-600'}`}
        >
            <motion.div 
                layout
                className="w-6 h-6 bg-white rounded-full shadow-md"
                animate={{ x: isOn ? 24 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
        </motion.div>
    </div>
);
