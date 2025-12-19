
import React, { useContext, useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, ChevronDown, FileSpreadsheet, UploadCloud, AlertTriangle, CheckCircle2, Download, Loader2, Trash2, Phone, X, Lock, Camera, ChevronRight } from 'lucide-react';
import { AuthContext } from '../../App';
import { Student } from '../../types';
import { Link } from 'react-router-dom';
import Papa from 'papaparse';

const emptyStudent: Omit<Student, 'admissionNo' | 'session' | 'stats' | 'avatar'> = {
  name: '',
  rollNo: '',
  class: '',
  section: '',
  dob: '',
  gender: 'Male',
  bloodGroup: 'B+',
  fatherName: '',
  motherName: '',
  mobile: '',
  address: '',
  religion: 'General',
  category: 'General',
  feeHistory: [],
};

export const AdminStudents: React.FC = () => {
  const { allStudents, setAllStudents, currentAdmin } = useContext(AuthContext);
  const [showModal, setShowModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const isTeacher = currentAdmin?.role === 'Teacher';
  const teacherClass = currentAdmin?.assignedClass || 'All';
  const teacherSection = currentAdmin?.assignedSection || 'All';

  const [selectedClass, setSelectedClass] = useState(isTeacher ? teacherClass : 'All');
  const [selectedSection, setSelectedSection] = useState(isTeacher ? teacherSection : 'All');

  useEffect(() => {
    if (isTeacher) {
      setSelectedClass(teacherClass);
      setSelectedSection(teacherSection);
    }
  }, [isTeacher, teacherClass, teacherSection]);

  const uniqueClasses = useMemo(() => ['All', ...Array.from(new Set(allStudents.map(s => s.class)))], [allStudents]);
  const uniqueSections = useMemo(() => ['All', ...Array.from(new Set(allStudents.map(s => s.section)))], [allStudents]);

  const filteredStudents = useMemo(() => {
    return allStudents.filter(student => {
      const searchMatch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          student.admissionNo.toLowerCase().includes(searchQuery.toLowerCase());
      const classMatch = selectedClass === 'All' || student.class === selectedClass;
      const sectionMatch = selectedSection === 'All' || student.section === selectedSection;
      return searchMatch && classMatch && sectionMatch;
    });
  }, [allStudents, searchQuery, selectedClass, selectedSection]);

  const handleOpenModal = (student: Student | null) => {
    setEditingStudent(student);
    setShowModal(true);
  };

  const handleSaveStudent = (studentData: Student) => {
    if (editingStudent) {
      // Use editingStudent.admissionNo to find the original record, 
      // ensuring updates work even if the Admission No is changed in the form.
      setAllStudents(prev => prev.map(s => s.admissionNo === editingStudent.admissionNo ? studentData : s));
    } else {
      if (allStudents.some(s => s.admissionNo === studentData.admissionNo)) {
        alert('Error: Admission Number already exists!');
        return;
      }
      setAllStudents(prev => [...prev, studentData]);
    }
    setShowModal(false);
    setEditingStudent(null);
  };

  const handleDeleteStudent = (e: React.MouseEvent, student: Student) => {
    e.stopPropagation();
    e.preventDefault();
    if (window.confirm(`Are you sure you want to remove ${student.name} (${student.admissionNo})?\n\nThis action cannot be undone.`)) {
      setAllStudents(prev => prev.filter(s => s.admissionNo !== student.admissionNo));
    }
  };

  const handleBulkImport = (newStudents: Student[]) => {
    const uniqueNew = newStudents.filter(ns => !allStudents.some(es => es.admissionNo === ns.admissionNo));
    if (uniqueNew.length < newStudents.length) {
       alert(`Skipped ${newStudents.length - uniqueNew.length} duplicates. Importing ${uniqueNew.length} new records.`);
    }
    setAllStudents(prev => [...uniqueNew, ...prev]);
    setShowImportModal(false);
  };

  return (
    <div className="space-y-6 pb-24 md:pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Student Directory</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage student records and admissions</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <button onClick={() => setShowImportModal(true)} className="flex-1 md:flex-none justify-center bg-white dark:bg-[#1C1C1E] text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 px-4 py-3 rounded-xl font-bold shadow-sm active:scale-95 transition-transform text-xs flex items-center gap-2">
             <FileSpreadsheet size={16} className="text-green-600" /> Import
          </button>
          {!isTeacher && (
            <button onClick={() => handleOpenModal(null)} className="flex-1 md:flex-none justify-center bg-ios-blue text-white px-5 py-3 rounded-xl font-bold shadow-lg shadow-ios-blue/20 active:scale-95 transition-transform text-xs flex items-center gap-2">
              <Plus size={16} /> Add New
            </button>
          )}
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-[#1C1C1E] p-4 rounded-[2rem] shadow-sm border border-slate-100 dark:border-white/5 flex flex-col md:flex-row gap-3 items-center">
         <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input type="text" placeholder="Search by name, ID..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full bg-slate-50 dark:bg-black/20 border-none rounded-xl py-3 pl-10 pr-4 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-ios-blue/50 outline-none text-sm" />
         </div>
         <div className="flex gap-2 w-full md:w-auto">
            {isTeacher ? (
               <div className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-50 dark:bg-blue-500/10 rounded-xl text-blue-700 dark:text-blue-300 font-bold border border-blue-100 dark:border-blue-500/20 text-xs">
                  <Lock size={14} /> <span>{teacherClass}-{teacherSection}</span>
               </div>
            ) : (
               <>
                  <FilterDropdown label="Class" options={uniqueClasses} selected={selectedClass} onSelect={setSelectedClass} />
                  <FilterDropdown label="Sec" options={uniqueSections} selected={selectedSection} onSelect={setSelectedSection} />
               </>
            )}
         </div>
      </div>

      {/* List */}
      <div className="space-y-3">
        {filteredStudents.map((student, index) => (
          <motion.div
            key={student.admissionNo}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white dark:bg-[#1C1C1E] p-4 rounded-[1.5rem] shadow-sm border border-slate-100 dark:border-white/5 flex items-center justify-between group relative overflow-hidden active:scale-[0.99] transition-transform"
          >
             <Link to={`/admin/students/${encodeURIComponent(student.admissionNo)}`} className="flex items-center gap-3 flex-1 relative z-0 min-w-0">
               <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-100 dark:border-white/10 flex-shrink-0 bg-slate-100 dark:bg-white/5">
                 <img src={student.profilePic || student.avatar} alt={student.name} className="w-full h-full object-cover" />
               </div>
               <div className="min-w-0">
                 <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm truncate">{student.name}</h3>
                 </div>
                 <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-0.5">
                   <span className="bg-slate-50 dark:bg-white/5 px-1.5 py-0.5 rounded text-[10px] font-bold">{student.class}-{student.section}</span>
                   <span>Roll: {student.rollNo}</span>
                 </p>
               </div>
             </Link>
             
             <div className="flex items-center gap-2 relative z-10 flex-shrink-0">
                <button onClick={() => handleOpenModal(student)} className="w-9 h-9 rounded-full bg-slate-50 dark:bg-white/5 flex items-center justify-center text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/20 transition-colors"><ChevronRight size={18} /></button>
             </div>
          </motion.div>
        ))}
        {filteredStudents.length === 0 && <div className="text-center py-20 text-slate-400"><p>No students found.</p></div>}
      </div>

      <AnimatePresence>
        {showModal && <StudentFormModal student={editingStudent} onSave={handleSaveStudent} onClose={() => setShowModal(false)} />}
        {showImportModal && <BulkImportModal onImport={handleBulkImport} onClose={() => setShowImportModal(false)} />}
      </AnimatePresence>
    </div>
  );
};

const FilterDropdown: React.FC<{ label: string, options: string[], selected: string, onSelect: (value: string) => void }> = ({ label, options, selected, onSelect }) => (
    <div className="relative flex-1">
        <select value={selected} onChange={e => onSelect(e.target.value)} className="appearance-none w-full bg-slate-50 dark:bg-black/20 border-none rounded-xl py-3 px-4 text-slate-900 dark:text-white font-bold text-xs focus:ring-2 focus:ring-ios-blue/50 outline-none cursor-pointer">
            {options.map(opt => <option key={opt} value={opt}>{opt === 'All' ? label : opt}</option>)}
        </select>
        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
    </div>
);

// --- NEW IOS-STYLE EDIT LAYOUT ---

export const StudentFormModal: React.FC<{ student: Student | null, onSave: (student: Student) => void, onClose: () => void }> = ({ student, onSave, onClose }) => {
  const [formData, setFormData] = useState<Partial<Student>>(student || { 
      ...emptyStudent, 
      admissionNo: '', 
      session: "2025-26", 
      stats: { attendance: '100%', grade: 'N/A', rank: 'N/A' }, 
      avatar: 'https://ui-avatars.com/api/?name=New+Student&background=random' 
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => { 
      const { name, value } = e.target; 
      setFormData(prev => ({ ...prev, [name]: value })); 
  };

  const handleSubmit = (e: React.FormEvent) => { 
      e.preventDefault(); 
      onSave(formData as Student); 
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        if (file.size > 500000) return alert("Image too large. Max 500KB.");
        const reader = new FileReader();
        reader.onloadend = () => {
            setFormData(prev => ({ ...prev, profilePic: reader.result as string }));
        };
        reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <motion.div 
        initial={{ y: "100%" }} 
        animate={{ y: 0 }} 
        exit={{ y: "100%" }} 
        className="relative bg-[#F2F2F7] dark:bg-black w-full max-w-lg h-[100dvh] sm:h-[90vh] rounded-none sm:rounded-[2rem] flex flex-col overflow-hidden shadow-2xl"
      >
        {/* Fixed Header */}
        <div className="px-4 py-3 bg-white dark:bg-[#1C1C1E] border-b border-slate-200 dark:border-white/10 flex justify-between items-center shrink-0 z-20">
          <button onClick={onClose} className="text-ios-blue text-base font-normal hover:opacity-70 transition-opacity px-2">Cancel</button>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">{student ? 'Edit Student' : 'New Student'}</h2>
          <button onClick={handleSubmit} className="text-ios-blue text-base font-bold hover:opacity-70 transition-opacity px-2">Done</button>
        </div>
        
        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          
          {/* Photo Section */}
          <div className="flex flex-col items-center gap-3 pt-2">
             <div onClick={() => fileInputRef.current?.click()} className="relative w-24 h-24 rounded-full overflow-hidden shadow-md cursor-pointer group bg-slate-200 dark:bg-white/10">
                <img src={formData.profilePic || formData.avatar} className="w-full h-full object-cover" alt="" />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                   <Camera className="text-white" size={24} />
                </div>
             </div>
             <button onClick={() => fileInputRef.current?.click()} className="text-ios-blue text-sm font-semibold">
                {formData.profilePic ? 'Change Photo' : 'Add Photo'}
             </button>
             <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handlePhotoUpload} />
          </div>

          {/* Form Sections */}
          <div className="space-y-6 pb-20">
             
             <Section title="ACADEMIC IDENTITY">
                <FormInput label="Full Name" name="name" value={formData.name} onChange={handleChange} placeholder="Required" />
                <FormInput label="Admission No" name="admissionNo" value={formData.admissionNo} onChange={handleChange} placeholder="Required" />
                <FormInput label="Roll No" name="rollNo" value={formData.rollNo} onChange={handleChange} placeholder="Required" />
                <div className="flex divide-x divide-slate-100 dark:divide-white/5">
                   <FormInput label="Class" name="class" value={formData.class} onChange={handleChange} placeholder="X" className="w-1/2" />
                   <FormInput label="Section" name="section" value={formData.section} onChange={handleChange} placeholder="A" className="w-1/2" />
                </div>
             </Section>

             <Section title="PERSONAL INFO">
                <div className="flex items-center justify-between p-3 pl-4 pr-3">
                   <label className="text-sm font-medium text-slate-900 dark:text-white">Gender</label>
                   <select name="gender" value={formData.gender} onChange={handleChange} className="bg-transparent text-slate-600 dark:text-slate-300 text-sm outline-none text-right appearance-none pr-4">
                      <option>Male</option><option>Female</option><option>Other</option>
                   </select>
                </div>
                <FormInput label="Date of Birth" name="dob" type="date" value={formData.dob} onChange={handleChange} />
                <FormInput label="Blood Group" name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} placeholder="e.g. O+" />
                <FormInput label="Religion" name="religion" value={formData.religion} onChange={handleChange} placeholder="General" />
                <FormInput label="Category" name="category" value={formData.category} onChange={handleChange} placeholder="General" />
             </Section>

             <Section title="FAMILY & CONTACT">
                <FormInput label="Father" name="fatherName" value={formData.fatherName} onChange={handleChange} />
                <FormInput label="Mother" name="motherName" value={formData.motherName} onChange={handleChange} />
                <FormInput label="Mobile" name="mobile" type="tel" value={formData.mobile} onChange={handleChange} />
             </Section>

             <Section title="ADDRESS">
                <div className="p-3">
                   <textarea 
                      name="address" 
                      value={formData.address} 
                      onChange={handleChange} 
                      rows={3} 
                      placeholder="Street address, City, State..." 
                      className="w-full bg-transparent outline-none text-sm text-slate-700 dark:text-slate-300 placeholder-slate-400 resize-none"
                   />
                </div>
             </Section>

          </div>
        </div>
      </motion.div>
    </div>
  );
};

const Section: React.FC<{ title?: string, children: React.ReactNode }> = ({ title, children }) => (
  <div>
    {title && <h3 className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2 ml-4">{title}</h3>}
    <div className="bg-white dark:bg-[#1C1C1E] rounded-xl overflow-hidden border border-slate-200 dark:border-white/5 shadow-sm divide-y divide-slate-100 dark:divide-white/5">
      {children}
    </div>
  </div>
);

const FormInput: React.FC<{ label: string, value: any, onChange: any, name: string, type?: string, placeholder?: string, className?: string }> = ({ label, value, onChange, name, type = "text", placeholder, className }) => (
  <div className={`flex items-center p-3 pl-4 ${className || ''}`}>
    <label className="w-28 text-sm font-medium text-slate-900 dark:text-white shrink-0">{label}</label>
    <input 
      type={type}
      name={name}
      value={value || ''}
      onChange={onChange}
      placeholder={placeholder}
      className="flex-1 bg-transparent border-none outline-none text-right sm:text-left text-sm text-slate-600 dark:text-slate-300 placeholder-slate-300 min-w-0"
    />
  </div>
);

const BulkImportModal: React.FC<{ onImport: (data: Student[]) => void, onClose: () => void }> = ({ onImport, onClose }) => {
    const fileRef = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<any[]>([]);

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
               setPreview(results.data);
            }
        });
    };

    const processImport = () => {
        if (preview.length === 0) return;
        const newStudents: Student[] = preview.map((row: any, i) => {
            const getVal = (key: string) => {
               const foundKey = Object.keys(row).find(k => k.toLowerCase() === key.toLowerCase());
               return foundKey ? row[foundKey] : '';
            };

            return {
               ...emptyStudent,
               admissionNo: getVal('admissionNo') || getVal('id') || `BULK-${Date.now()}-${i}`,
               name: getVal('name') || 'Unknown',
               class: getVal('class') || 'N/A',
               section: getVal('section') || 'A',
               rollNo: getVal('rollNo') || String(i+1),
               dob: getVal('dob') || '',
               gender: getVal('gender') || 'Male',
               bloodGroup: getVal('bloodGroup') || 'B+',
               fatherName: getVal('fatherName') || getVal('father') || '',
               motherName: getVal('motherName') || getVal('mother') || '',
               mobile: getVal('mobile') || '',
               address: getVal('address') || '',
               religion: getVal('religion') || 'General',
               category: getVal('category') || 'General',
               session: "2025-26",
               stats: { attendance: '0%', grade: 'N/A', rank: 'N/A' },
               avatar: `https://ui-avatars.com/api/?name=${getVal('name') || 'User'}&background=random`,
               feeHistory: []
            };
        });
        
        onImport(newStudents.filter(s => s.name !== 'Unknown' && s.admissionNo));
    };

    const downloadTemplate = () => {
        const headers = [ "admissionNo", "name", "class", "section", "rollNo", "dob", "gender", "bloodGroup", "fatherName", "motherName", "mobile", "address", "religion", "category" ];
        const csvContent = headers.join(',');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = "student_import_template.csv";
        a.click();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative bg-white dark:bg-[#1C1C1E] w-full max-w-lg rounded-[2rem] shadow-xl p-6 md:p-8 flex flex-col gap-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2"><UploadCloud size={24} className="text-blue-500" /> Bulk Import</h2>
                    <button onClick={onClose}><X size={24} className="text-slate-400" /></button>
                </div>

                <div className="flex gap-4">
                    <button onClick={downloadTemplate} className="flex-1 py-3 border-2 border-dashed border-slate-300 dark:border-white/10 rounded-xl font-bold text-slate-500 hover:border-blue-500 hover:text-blue-500 transition-colors flex flex-col items-center justify-center gap-2">
                        <Download size={20} />
                        <span className="text-xs">Download Template</span>
                    </button>
                    <div className="flex-1 relative">
                        <input type="file" accept=".csv" className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={handleFile} ref={fileRef} />
                        <div className={`h-full border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-2 transition-colors ${preview.length > 0 ? 'border-green-500 bg-green-50 dark:bg-green-500/10 text-green-600' : 'border-slate-300 dark:border-white/10 hover:border-blue-500 text-slate-500'}`}>
                            {preview.length > 0 ? <CheckCircle2 size={24} /> : <FileSpreadsheet size={24} />}
                            <span className="text-xs font-bold">{preview.length > 0 ? `${preview.length} Rows Ready` : 'Select CSV File'}</span>
                        </div>
                    </div>
                </div>

                <button onClick={processImport} disabled={preview.length === 0} className="w-full py-4 bg-ios-blue text-white font-bold rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">
                    Import Students
                </button>
            </div>
        </div>
    );
};
