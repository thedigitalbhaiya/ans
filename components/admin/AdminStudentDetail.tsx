
import React, { useContext, useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Phone, MessageCircle, Edit, Trash2, 
  MapPin, Calendar, Fingerprint, Droplets, User, 
  CreditCard, Trophy, TrendingUp, CheckCircle2, XCircle, Clock, Camera
} from 'lucide-react';
import { AuthContext, SchoolContext } from '../../App';
import { Student, FeeRecord } from '../../types';
import { StudentFormModal } from './AdminStudents'; // Reusing the modal

const ACADEMIC_MONTHS = ["April", "May", "June", "July", "August", "September", "October", "November", "December", "January", "February", "March"];

export const AdminStudentDetail: React.FC = () => {
    const { admissionNo } = useParams<{ admissionNo: string }>();
    const navigate = useNavigate();
    const { allStudents, setAllStudents, updateStudentData } = useContext(AuthContext);
    const { examResults, attendance, feeStructure } = useContext(SchoolContext);

    const [student, setStudent] = useState<Student | null>(null);
    const [notFound, setNotFound] = useState(false);
    const [activeTab, setActiveTab] = useState('Personal');
    const [showEditModal, setShowEditModal] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Sync student data
    useEffect(() => {
        if (!admissionNo) return;
        const decodedId = decodeURIComponent(admissionNo);
        const found = allStudents.find(s => s.admissionNo === admissionNo || s.admissionNo === decodedId);
        
        if (found) {
            setStudent(found);
            setNotFound(false);
        } else {
            // Short timeout to prevent flash if data is loading (though here data is synchronous context)
            const timer = setTimeout(() => setNotFound(true), 500);
            return () => clearTimeout(timer);
        }
    }, [admissionNo, allStudents]);

    const handleUpdateStudent = (updatedData: Student) => {
        updateStudentData(updatedData); // Uses Context helper to sync all states
        setShowEditModal(false);
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        
        if (!student) return;

        // Level 1 Warning
        if (window.confirm(`Are you sure you want to delete the student profile for "${student.name}"?`)) {
            // Level 2 Warning (Double Confirmation)
            if (window.confirm(`⚠️ FINAL WARNING ⚠️\n\nThis action is PERMANENT and CANNOT be undone.\n\nAre you absolutely sure you want to remove ${student.name} (${student.admissionNo}) from the database?`)) {
                
                // Perform deletion
                setAllStudents(prev => prev.filter(s => s.admissionNo !== student.admissionNo));
                
                // Redirect to list
                navigate('/admin/students', { replace: true });
            }
        }
    };

    // --- PHOTO MODERATION ---
    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && student) {
            if (file.size > 500000) {
                alert("Image too large (Max 500KB)");
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64 = reader.result as string;
                updateStudentData({ ...student, profilePic: base64 });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemovePhoto = () => {
        if (!student) return;
        if (window.confirm("Remove this student's profile photo? It will revert to initials.")) {
            updateStudentData({ ...student, profilePic: undefined }); // Remove field
        }
    };

    const handleWhatsApp = () => {
        if (student) window.open(`https://wa.me/91${student.mobile}`, '_blank');
    };

    const handleCall = () => {
        if (student) window.location.href = `tel:${student.mobile}`;
    };

    if (notFound) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                <div className="w-20 h-20 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center text-slate-400">
                    <User size={32} />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Student Not Found</h2>
                    <p className="text-slate-500 dark:text-slate-400">ID: {admissionNo}</p>
                </div>
                <button onClick={() => navigate('/admin/students')} className="text-ios-blue font-bold hover:underline">Back to Directory</button>
            </div>
        );
    }

    if (!student) return <div className="p-20 text-center text-slate-400">Loading profile...</div>;

    // --- DERIVED STATS ---
    const feeStatus = student.feeHistory.length >= 7 ? 'Clear' : 'Pending'; 
    const avgGrade = student.stats.grade;
    const hasProfilePic = !!student.profilePic;
    const initials = student.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    
    return (
        <div className="space-y-8 animate-fade-in pb-10">
            {/* 1. TOP BAR */}
            <div className="flex items-center gap-4">
                <button onClick={() => navigate('/admin/students')} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 transition-colors">
                    <ArrowLeft size={24} className="text-slate-600 dark:text-slate-300"/>
                </button>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Student Profile</h1>
            </div>

            {/* 2. IDENTITY HEADER CARD (Glassmorphism) */}
            <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-slate-900 to-slate-800 dark:from-[#1C1C1E] dark:to-black text-white p-8 shadow-2xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                
                <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8">
                    {/* Avatar with Controls */}
                    <div className="relative group">
                        <div className="w-32 h-32 rounded-full border-4 border-white/20 overflow-hidden shadow-lg bg-white/10 flex items-center justify-center">
                            {hasProfilePic ? (
                               <img src={student.profilePic} alt={student.name} className="w-full h-full object-cover" />
                            ) : (
                               <span className="text-3xl font-bold text-white">{initials}</span>
                            )}
                        </div>
                        
                        {/* Hover Overlay Controls */}
                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
                            <button 
                               onClick={() => fileInputRef.current?.click()}
                               className="p-2 bg-white text-slate-900 rounded-full shadow-lg hover:scale-110 transition-transform" 
                               title="Change Photo"
                            >
                               <Camera size={14} />
                            </button>
                            {hasProfilePic && (
                                <button 
                                   onClick={handleRemovePhoto}
                                   className="p-2 bg-red-500 text-white rounded-full shadow-lg hover:scale-110 transition-transform" 
                                   title="Remove Photo"
                                >
                                   <Trash2 size={14} />
                                </button>
                            )}
                        </div>
                        <input 
                           type="file" 
                           ref={fileInputRef} 
                           className="hidden" 
                           accept="image/*" 
                           onChange={handlePhotoChange} 
                        />
                    </div>

                    {/* Info */}
                    <div className="flex-1 text-center md:text-left space-y-2">
                        <h2 className="text-3xl font-bold tracking-tight">{student.name}</h2>
                        <div className="flex flex-wrap justify-center md:justify-start gap-3">
                            <span className="px-3 py-1 rounded-lg bg-white/10 border border-white/10 text-sm font-medium backdrop-blur-md">
                                Class {student.class} - {student.section}
                            </span>
                            <span className="px-3 py-1 rounded-lg bg-white/10 border border-white/10 text-sm font-medium backdrop-blur-md">
                                Roll No: {student.rollNo}
                            </span>
                            <span className="px-3 py-1 rounded-lg bg-blue-500/20 border border-blue-500/30 text-blue-200 text-sm font-medium backdrop-blur-md">
                                {student.admissionNo}
                            </span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                        <button onClick={handleCall} className="w-12 h-12 rounded-2xl bg-white/10 hover:bg-white/20 flex items-center justify-center backdrop-blur-md transition-colors" title="Call Parent">
                            <Phone size={20} className="text-green-400" />
                        </button>
                        <button onClick={handleWhatsApp} className="w-12 h-12 rounded-2xl bg-white/10 hover:bg-white/20 flex items-center justify-center backdrop-blur-md transition-colors" title="WhatsApp">
                            <MessageCircle size={20} className="text-green-400" />
                        </button>
                        <button onClick={() => setShowEditModal(true)} className="w-12 h-12 rounded-2xl bg-white/10 hover:bg-white/20 flex items-center justify-center backdrop-blur-md transition-colors" title="Edit Profile">
                            <Edit size={20} className="text-blue-400" />
                        </button>
                    </div>
                </div>
            </div>

            {/* 3. QUICK STATS ROW */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard label="Attendance" value={student.stats.attendance} icon={Calendar} color="text-purple-500" bg="bg-purple-500/10" />
                <StatCard label="Fee Status" value={feeStatus} icon={CreditCard} color={feeStatus === 'Clear' ? 'text-green-500' : 'text-red-500'} bg={feeStatus === 'Clear' ? 'bg-green-500/10' : 'bg-red-500/10'} />
                <StatCard label="Avg Grade" value={avgGrade} icon={Trophy} color="text-yellow-500" bg="bg-yellow-500/10" />
                <StatCard label="Rank" value={student.stats.rank} icon={TrendingUp} color="text-blue-500" bg="bg-blue-500/10" />
            </div>

            {/* 4. TABS NAVIGATION */}
            <div className="bg-white dark:bg-[#1C1C1E] p-1.5 rounded-2xl border border-slate-100 dark:border-white/5 flex flex-wrap gap-2 shadow-sm">
                {['Personal', 'Fee History', 'Exam Results', 'Attendance Log'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all ${
                            activeTab === tab 
                            ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md' 
                            : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-white/5'
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* 5. TAB CONTENT AREA */}
            <div className="min-h-[400px]">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        {activeTab === 'Personal' && <PersonalInfoTab student={student} />}
                        {activeTab === 'Fee History' && (
                            <FeeHistoryTab 
                                student={student} 
                                feeStructure={feeStructure} 
                                onUpdate={handleUpdateStudent} 
                            />
                        )}
                        {activeTab === 'Exam Results' && <ExamResultsTab admissionNo={student.admissionNo} examResults={examResults} />}
                        {activeTab === 'Attendance Log' && <AttendanceLogTab admissionNo={student.admissionNo} attendance={attendance} />}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* DELETE BUTTON */}
            <div className="flex justify-center pt-8 pb-4">
                <button 
                    type="button"
                    onClick={handleDelete}
                    className="flex items-center gap-2 text-red-500 font-bold bg-white dark:bg-[#1C1C1E] border border-red-100 dark:border-red-500/10 hover:bg-red-50 dark:hover:bg-red-900/20 px-8 py-4 rounded-2xl transition-all shadow-sm active:scale-95"
                >
                    <Trash2 size={18} /> Delete Student Permanently
                </button>
            </div>

            {/* EDIT MODAL */}
            <AnimatePresence>
                {showEditModal && (
                    <StudentFormModal 
                        student={student} 
                        onSave={handleUpdateStudent} 
                        onClose={() => setShowEditModal(false)} 
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

// --- SUB-COMPONENTS ---

const StatCard = ({ label, value, icon: Icon, color, bg }: any) => (
    <div className="bg-white dark:bg-[#1C1C1E] p-5 rounded-[1.5rem] border border-slate-100 dark:border-white/5 shadow-sm flex flex-col items-center justify-center text-center gap-2">
        <div className={`p-3 rounded-full ${bg} ${color}`}>
            <Icon size={20} />
        </div>
        <div>
            <div className="text-xl font-bold text-slate-900 dark:text-white">{value}</div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</div>
        </div>
    </div>
);

const PersonalInfoTab = ({ student }: { student: Student }) => (
    <div className="bg-white dark:bg-[#1C1C1E] p-8 rounded-[2rem] border border-slate-100 dark:border-white/5 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <User size={20} className="text-ios-blue"/> Personal Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-8 gap-x-6">
            <InfoField label="Father's Name" value={student.fatherName} />
            <InfoField label="Mother's Name" value={student.motherName} />
            <InfoField label="Date of Birth" value={student.dob} icon={<Calendar size={14}/>} />
            <InfoField label="Gender" value={student.gender} />
            <InfoField label="Blood Group" value={student.bloodGroup} icon={<Droplets size={14} className="text-red-500"/>} />
            <InfoField label="Religion" value={student.religion} />
            <InfoField label="Category" value={student.category} />
            <InfoField label="Address" value={student.address} fullWidth icon={<MapPin size={14}/>} />
        </div>
    </div>
);

const InfoField = ({ label, value, icon, fullWidth }: any) => (
    <div className={`${fullWidth ? 'md:col-span-2 lg:col-span-3' : ''} space-y-1.5`}>
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            {icon} {label}
        </span>
        <p className="text-base font-semibold text-slate-900 dark:text-white">{value || 'N/A'}</p>
    </div>
);

const FeeHistoryTab = ({ student, feeStructure, onUpdate }: { student: Student, feeStructure: any, onUpdate: (s: Student) => void }) => {
    const monthlyFee = feeStructure[student.class] || 1000;

    const toggleMonth = (month: string) => {
        const isPaid = student.feeHistory.some(r => r.month.startsWith(month));
        let newHistory = [...student.feeHistory];

        if (isPaid) {
            newHistory = newHistory.filter(r => !r.month.startsWith(month));
        } else {
            newHistory.push({
                id: Date.now(),
                month: `${month} 2025`,
                amount: `₹ ${monthlyFee}`,
                status: 'Paid',
                date: new Date().toLocaleDateString('en-GB'),
                invoice: `MANUAL-${Math.floor(Math.random() * 1000)}`,
                paymentMethod: 'Offline'
            });
        }
        onUpdate({ ...student, feeHistory: newHistory });
    };

    return (
        <div className="bg-white dark:bg-[#1C1C1E] p-8 rounded-[2rem] border border-slate-100 dark:border-white/5 shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <CreditCard size={20} className="text-ios-blue"/> Fee Status ({student.feeHistory.length}/12 Paid)
                </h3>
                <div className="text-sm font-bold text-slate-500">Monthly: ₹{monthlyFee}</div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {ACADEMIC_MONTHS.map(month => {
                    const isPaid = student.feeHistory.some(r => r.month.startsWith(month));
                    return (
                        <div 
                            key={month} 
                            onClick={() => toggleMonth(month)}
                            className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col items-center justify-center gap-2 h-24 ${
                                isPaid 
                                ? 'bg-green-50 dark:bg-green-500/10 border-green-500 text-green-700 dark:text-green-400' 
                                : 'bg-slate-50 dark:bg-white/5 border-transparent hover:border-slate-300 dark:hover:border-white/20 text-slate-400'
                            }`}
                        >
                            <span className="font-bold uppercase tracking-wider text-xs">{month}</span>
                            {isPaid ? <CheckCircle2 size={24} /> : <div className="w-6 h-6 rounded-full border-2 border-current opacity-30"></div>}
                            <span className="text-[10px] font-bold">{isPaid ? 'PAID' : 'PENDING'}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const ExamResultsTab = ({ admissionNo, examResults }: { admissionNo: string, examResults: any }) => {
    const studentResults = examResults[admissionNo] || {};
    const terms = Object.keys(studentResults);

    if (terms.length === 0) return <div className="p-8 text-center text-slate-400">No exam records found.</div>;

    return (
        <div className="space-y-6">
            {terms.map(term => (
                <div key={term} className="bg-white dark:bg-[#1C1C1E] p-6 rounded-[2rem] border border-slate-100 dark:border-white/5 shadow-sm">
                    <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-4 border-b border-slate-100 dark:border-white/5 pb-2">{term}</h4>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-slate-400 text-xs font-bold uppercase tracking-wider">
                                    <th className="pb-3 pl-2">Subject</th>
                                    <th className="pb-3 text-center">Marks</th>
                                    <th className="pb-3 text-center">Grade</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                {studentResults[term].map((sub: any, idx: number) => (
                                    <tr key={idx} className="border-b border-slate-50 dark:border-white/5 last:border-none">
                                        <td className="py-3 pl-2">{sub.name}</td>
                                        <td className="py-3 text-center">{sub.score} / 100</td>
                                        <td className="py-3 text-center">
                                            <span className={`px-2 py-1 rounded-md text-xs font-bold text-white ${getGradeColor(sub.grade)}`}>
                                                {sub.grade}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ))}
        </div>
    );
};

const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return 'bg-green-500';
    if (grade.startsWith('B')) return 'bg-blue-500';
    if (grade.startsWith('C')) return 'bg-yellow-500';
    return 'bg-red-500';
};

const AttendanceLogTab = ({ admissionNo, attendance }: { admissionNo: string, attendance: any }) => {
    // Generate simple grid for current month
    const today = new Date();
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    const getStatus = (day: number) => {
        const dateKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const record = attendance[dateKey];
        if (!record) return 'neutral';
        return record[admissionNo] || 'neutral';
    };

    return (
        <div className="bg-white dark:bg-[#1C1C1E] p-8 rounded-[2rem] border border-slate-100 dark:border-white/5 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <Calendar size={20} className="text-ios-blue"/> {today.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </h3>
            
            <div className="grid grid-cols-7 gap-2 md:gap-4">
                {['S','M','T','W','T','F','S'].map((d, i) => (
                    <div key={i} className="text-center text-xs font-bold text-slate-400 mb-2">{d}</div>
                ))}
                {days.map(day => {
                    const status = getStatus(day);
                    let bgClass = 'bg-slate-50 dark:bg-white/5 text-slate-400';
                    if (status === 'present') bgClass = 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400';
                    if (status === 'absent') bgClass = 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400';
                    if (status === 'late') bgClass = 'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400';

                    return (
                        <div key={day} className={`aspect-square rounded-xl flex items-center justify-center font-bold text-sm ${bgClass}`}>
                            {day}
                        </div>
                    );
                })}
            </div>
            
            <div className="flex gap-4 mt-6 justify-center text-xs font-bold text-slate-500">
                <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-green-500"></div> Present</div>
                <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-red-500"></div> Absent</div>
                <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-orange-500"></div> Late</div>
            </div>
        </div>
    );
};
