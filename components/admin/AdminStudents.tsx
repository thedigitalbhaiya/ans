
import React, { useContext, useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Save, ChevronDown, FileSpreadsheet, UploadCloud, AlertTriangle, CheckCircle2, Download, Loader2, Trash2, Phone, X, Lock } from 'lucide-react';
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
  religion: 'Islam',
  category: 'General',
  feeHistory: [],
};

export const AdminStudents: React.FC = () => {
  const { allStudents, setAllStudents, currentAdmin } = useContext(AuthContext);
  const [showModal, setShowModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Logic for Class Teacher View Locking
  const isTeacher = currentAdmin?.role === 'Teacher';
  const teacherClass = currentAdmin?.assignedClass || 'All';
  const teacherSection = currentAdmin?.assignedSection || 'All';

  const [selectedClass, setSelectedClass] = useState(isTeacher ? teacherClass : 'All');
  const [selectedSection, setSelectedSection] = useState(isTeacher ? teacherSection : 'All');

  // Enforce lock on mount and update if context changes
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
      setAllStudents(allStudents.map(s => s.admissionNo === studentData.admissionNo ? studentData : s));
    } else {
      // Check for duplicate ID manually before saving new
      if (allStudents.some(s => s.admissionNo === studentData.admissionNo)) {
        alert('Error: Admission Number already exists!');
        return;
      }
      setAllStudents([...allStudents, studentData]);
    }
    setShowModal(false);
  };

  const handleDeleteStudent = (e: React.MouseEvent, student: Student) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (window.confirm(`Are you sure you want to remove ${student.name} (${student.admissionNo})?\n\nThis action cannot be undone.`)) {
      setAllStudents(prev => prev.filter(s => s.admissionNo !== student.admissionNo));
    }
  };

  const handleBulkImport = (newStudents: Student[]) => {
    setAllStudents(prev => [...newStudents, ...prev]);
    setShowImportModal(false);
    alert(`Successfully imported ${newStudents.length} student records.`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Student Directory</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage student records and admissions</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setShowImportModal(true)}
            className="bg-white dark:bg-[#1C1C1E] text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 px-5 py-3 rounded-xl font-bold shadow-sm active:scale-95 transition-transform text-sm flex items-center gap-2">
             <FileSpreadsheet size={18} className="text-green-600" /> Import CSV
          </button>
          {!isTeacher && (
            <button 
              onClick={() => handleOpenModal(null)}
              className="bg-ios-blue text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-ios-blue/20 active:scale-95 transition-transform text-sm flex items-center gap-2">
              <Plus size={18} /> Add New
            </button>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-[#1C1C1E] p-4 rounded-[2rem] shadow-sm border border-slate-100 dark:border-white/5 flex flex-col md:flex-row gap-4 items-center">
         <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Search by name, Admission ID..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 dark:bg-black/20 border-none rounded-xl py-3 pl-12 pr-4 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-ios-blue/50 outline-none"
            />
         </div>
         
         {isTeacher ? (
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-500/10 rounded-xl text-blue-700 dark:text-blue-300 font-bold border border-blue-100 dark:border-blue-500/20 whitespace-nowrap">
               <Lock size={16} /> 
               <span>My Class: {teacherClass}-{teacherSection}</span>
            </div>
         ) : (
            <div className="flex gap-2">
                <FilterDropdown label="Class" options={uniqueClasses} selected={selectedClass} onSelect={setSelectedClass} />
                <FilterDropdown label="Section" options={uniqueSections} selected={selectedSection} onSelect={setSelectedSection} />
            </div>
         )}
      </div>

      <div className="space-y-4">
        {filteredStudents.map((student, index) => (
          <motion.div
            key={student.admissionNo}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white dark:bg-[#1C1C1E] p-4 rounded-[1.5rem] shadow-sm border border-slate-100 dark:border-white/5 flex items-center justify-between group relative overflow-hidden"
          >
             <Link to={`/admin/students/${encodeURIComponent(student.admissionNo)}`} className="flex items-center gap-4 flex-1 relative z-0">
               <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-slate-100 dark:border-white/10 flex items-center justify-center bg-slate-100 dark:bg-white/5">
                 {student.profilePic ? (
                    <img src={student.profilePic} alt={student.name} className="w-full h-full object-cover" />
                 ) : (
                    <img src={student.avatar} alt={student.name} className="w-full h-full object-cover" />
                 )}
               </div>
               <div>
                 <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-ios-blue transition-colors">{student.name}</h3>
                    <span className="text-[10px] bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400 px-1.5 py-0.5 rounded border border-slate-200 dark:border-white/10 font-mono font-medium">
                      #{student.admissionNo}
                    </span>
                 </div>
                 <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-0.5">
                   <span className="bg-slate-50 dark:bg-white/5 px-2 py-0.5 rounded-md">Class {student.class}-{student.section}</span>
                   <span>Roll: {student.rollNo}</span>
                 </p>
               </div>
             </Link>
             
             {/* Action Buttons */}
             <div className="flex items-center gap-2 relative z-10 flex-shrink-0">
                <a 
                  href={`tel:${student.mobile}`} 
                  onClick={(e) => e.stopPropagation()}
                  className="w-10 h-10 rounded-full bg-slate-50 dark:bg-white/5 flex items-center justify-center text-slate-400 hover:text-ios-green hover:bg-green-50 dark:hover:bg-green-500/20 transition-colors"
                >
                   <Phone size={18} />
                </a>
                {!isTeacher && (
                  <button 
                    onClick={(e) => handleDeleteStudent(e, student)}
                    className="w-10 h-10 rounded-full bg-slate-50 dark:bg-white/5 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/20 transition-colors cursor-pointer"
                    title="Remove Student"
                    type="button"
                  >
                     <Trash2 size={18} />
                  </button>
                )}
             </div>
          </motion.div>
        ))}
        {filteredStudents.length === 0 && (
           <div className="text-center py-20 text-slate-400">
              <p>No students found.</p>
           </div>
        )}
      </div>

      <AnimatePresence>
        {showModal && <StudentFormModal student={editingStudent} onSave={handleSaveStudent} onClose={() => setShowModal(false)} />}
        {showImportModal && <BulkImportModal existingStudents={allStudents} onImport={handleBulkImport} onClose={() => setShowImportModal(false)} />}
      </AnimatePresence>
    </div>
  );
};

// ... (Rest of the component remains the same: BulkImportModal, FilterDropdown, StudentFormModal)
// Including existing helper components to maintain file integrity

interface ImportedRow {
  admissionNo: string;
  name: string;
  class: string;
  section: string;
  rollNo: string;
  fatherName: string;
  mobile: string;
  dob: string;
  profilePic?: string;
  isValid: boolean;
  error?: string;
}

const BulkImportModal: React.FC<{ existingStudents: Student[], onImport: (data: Student[]) => void, onClose: () => void }> = ({ existingStudents, onImport, onClose }) => {
  const [step, setStep] = useState<'upload' | 'preview'>('upload');
  const [importedData, setImportedData] = useState<ImportedRow[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const downloadTemplate = () => {
    const headers = "admission_no,name,class,section,roll_no,father_name,mobile,dob,profile_url\n";
    const sample = "AD-2025-001,John Doe,X,A,101,Robert Doe,9876543210,2010-05-15,https://example.com/photo1.jpg\nAD-2025-002,Jane Smith,X,B,102,Will Smith,9123456789,2010-08-20,";
    const blob = new Blob([headers + sample], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'student_import_template.csv';
    a.click();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        processParsedData(results.data);
      },
      error: (error) => {
        console.error("CSV Error:", error);
        alert("Failed to parse CSV file.");
      }
    });
  };

  const processParsedData = (rows: any[]) => {
    const existingIds = new Set(existingStudents.map(s => s.admissionNo.toLowerCase()));
    const currentBatchIds = new Set<string>();

    const parsed: ImportedRow[] = rows.map((row: any) => {
      const normalizedRow: any = {};
      Object.keys(row).forEach(key => {
        const cleanKey = key.toLowerCase().replace(/[^a-z0-9]/g, '');
        normalizedRow[cleanKey] = row[key]?.trim();
      });

      const admissionNo = normalizedRow['admissionno'] || normalizedRow['id'] || '';
      const name = normalizedRow['name'] || normalizedRow['studentname'] || '';
      const className = normalizedRow['class'] || '';
      const section = normalizedRow['section'] || 'A';
      const rollNo = normalizedRow['rollno'] || '';
      const fatherName = normalizedRow['fathername'] || '';
      const mobile = normalizedRow['mobile']?.replace(/[^0-9]/g, '') || '';
      const dob = normalizedRow['dob'] || normalizedRow['dateofbirth'] || normalizedRow['birthdate'] || '';
      const profilePic = normalizedRow['profileurl'] || normalizedRow['photo'] || '';

      let isValid = true;
      let error = '';

      if (!admissionNo) {
        isValid = false;
        error = 'Missing Admission No';
      } else if (!name) {
        isValid = false;
        error = 'Missing Name';
      } else if (!className) {
        isValid = false;
        error = 'Missing Class';
      } else if (!mobile) {
        isValid = false;
        error = 'Missing Mobile';
      }

      if (isValid && existingIds.has(admissionNo.toLowerCase())) {
        isValid = false;
        error = 'ID Already Exists';
      }

      if (isValid && currentBatchIds.has(admissionNo.toLowerCase())) {
        isValid = false;
        error = 'Duplicate ID in File';
      }

      if (isValid) {
        currentBatchIds.add(admissionNo.toLowerCase());
      }

      return {
        admissionNo,
        name,
        class: className,
        section,
        rollNo,
        fatherName,
        mobile,
        dob,
        profilePic,
        isValid,
        error
      };
    });

    setImportedData(parsed);
    setStep('preview');
  };

  const confirmImport = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const validRows = importedData.filter(r => r.isValid);
      const newStudents: Student[] = validRows.map((row) => ({
        name: row.name,
        admissionNo: row.admissionNo,
        session: '2025-26',
        rollNo: row.rollNo || '-',
        class: row.class,
        section: row.section,
        dob: row.dob || '2010-01-01',
        gender: 'Male',
        bloodGroup: 'B+',
        fatherName: row.fatherName,
        motherName: 'Mrs. Parent',
        mobile: row.mobile,
        address: 'School Record',
        religion: 'General',
        category: 'General',
        avatar: `https://ui-avatars.com/api/?name=${row.name}&background=random`,
        profilePic: row.profilePic || undefined, // Set if imported
        stats: { attendance: '0%', grade: '-', rank: '-' },
        feeHistory: []
      }));

      onImport(newStudents);
      setIsProcessing(false);
    }, 800);
  };

  const validCount = importedData.filter(r => r.isValid).length;
  const invalidCount = importedData.length - validCount;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative bg-white dark:bg-[#1C1C1E] w-full max-w-5xl rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Modal content same as previous */}
        <div className="p-6 border-b border-slate-100 dark:border-white/5 flex justify-between items-center bg-slate-50 dark:bg-white/5">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <UploadCloud size={24} className="text-ios-blue" /> Bulk Import Students
          </h2>
          <button type="button" onClick={onClose} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-white/10"><X size={20} /></button>
        </div>
        {step === 'upload' ? (
          <div className="p-10 flex flex-col items-center justify-center text-center space-y-6">
             <div onClick={() => fileInputRef.current?.click()} className="w-full h-48 border-2 border-dashed border-slate-300 dark:border-white/20 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-ios-blue hover:bg-slate-50 dark:hover:bg-white/5 transition-all group">
                <div className="w-16 h-16 bg-slate-100 dark:bg-white/10 rounded-full flex items-center justify-center text-slate-400 group-hover:text-ios-blue group-hover:scale-110 transition-all mb-4">
                   <FileSpreadsheet size={32} />
                </div>
                <p className="text-lg font-bold text-slate-700 dark:text-slate-200">Click to upload CSV</p>
                <p className="text-sm text-slate-400">or drag and drop file here</p>
                <input ref={fileInputRef} type="file" accept=".csv" className="hidden" onChange={handleFileUpload} />
             </div>
             <div className="flex flex-col gap-2 w-full max-w-xs">
                <button type="button" onClick={downloadTemplate} className="text-ios-blue text-sm font-bold flex items-center justify-center gap-2 hover:underline">
                   <Download size={16} /> Download CSV Template
                </button>
             </div>
          </div>
        ) : (
          <div className="flex flex-col h-full overflow-hidden">
             <div className="p-4 bg-slate-50 dark:bg-black/20 flex gap-4 text-sm font-bold border-b border-slate-100 dark:border-white/5">
                <div className="flex items-center gap-2 text-green-600 bg-green-100 dark:bg-green-500/20 px-3 py-1 rounded-lg">
                   <CheckCircle2 size={16} /> {validCount} Valid
                </div>
                {invalidCount > 0 && (
                  <div className="flex items-center gap-2 text-red-600 bg-red-100 dark:bg-red-500/20 px-3 py-1 rounded-lg">
                     <AlertTriangle size={16} /> {invalidCount} Issues
                  </div>
                )}
             </div>
             <div className="overflow-y-auto flex-1 p-0">
                <table className="w-full text-left border-collapse">
                   <thead className="bg-slate-50 dark:bg-white/5 sticky top-0 z-10 shadow-sm">
                      <tr>
                         <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                         <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Adm. No</th>
                         <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Name</th>
                         <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Class</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                      {importedData.slice(0, 100).map((row, i) => (
                         <tr key={i} className={row.isValid ? '' : 'bg-red-50 dark:bg-red-900/10'}>
                            <td className="p-4">{row.isValid ? <CheckCircle2 size={18} className="text-green-500" /> : <div className="flex items-center gap-2 text-red-500" title={row.error}><AlertTriangle size={18} /></div>}</td>
                            <td className="p-4 font-mono text-sm font-bold">{row.admissionNo}</td>
                            <td className="p-4">{row.name}</td>
                            <td className="p-4">{row.class}-{row.section}</td>
                         </tr>
                      ))}
                   </tbody>
                </table>
             </div>
             <div className="p-6 border-t border-slate-100 dark:border-white/5 bg-white dark:bg-[#1C1C1E] flex justify-end gap-3">
                <button type="button" onClick={() => setStep('upload')} className="px-6 py-3 rounded-xl font-bold bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300">Back</button>
                <button type="button" onClick={confirmImport} disabled={validCount === 0 || isProcessing} className="px-8 py-3 rounded-xl font-bold bg-ios-blue text-white shadow-lg flex items-center gap-2 disabled:opacity-50">
                   {isProcessing ? <Loader2 className="animate-spin" /> : `Import ${validCount} Students`}
                </button>
             </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

const FilterDropdown: React.FC<{ label: string, options: string[], selected: string, onSelect: (value: string) => void }> = ({ label, options, selected, onSelect }) => (
    <div className="relative">
        <select value={selected} onChange={e => onSelect(e.target.value)} className="appearance-none w-full md:w-32 bg-slate-50 dark:bg-black/20 border-none rounded-xl py-3 px-4 text-slate-900 dark:text-white font-bold text-sm focus:ring-2 focus:ring-ios-blue/50 outline-none cursor-pointer">
            {options.map(opt => <option key={opt} value={opt}>{opt === 'All' ? `All ${label}s` : opt}</option>)}
        </select>
        <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
    </div>
);

export const StudentFormModal: React.FC<{ student: Student | null, onSave: (student: Student) => void, onClose: () => void }> = ({ student, onSave, onClose }) => {
  const [formData, setFormData] = useState<Partial<Student>>(
    student || { ...emptyStudent, admissionNo: '', session: "2025-26", stats: { attendance: '100%', grade: 'N/A', rank: 'N/A' }, avatar: 'https://ui-avatars.com/api/?name=New+Student&background=random' }
  );
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); onSave(formData as Student); };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-white dark:bg-[#1C1C1E] w-full max-w-lg rounded-[2rem] shadow-xl">
        <div className="p-6 border-b border-slate-100 dark:border-white/10 flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">{student ? 'Edit Student' : 'Add New Student'}</h2>
          <button type="button" onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 max-h-[70vh] overflow-y-auto space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2"><InputField label="Admission No" name="admissionNo" value={formData.admissionNo || ''} onChange={handleChange} /></div>
            <InputField label="Name" name="name" value={formData.name || ''} onChange={handleChange} />
            <InputField label="Class" name="class" value={formData.class || ''} onChange={handleChange} />
            <InputField label="Section" name="section" value={formData.section || ''} onChange={handleChange} />
            <InputField label="Roll No" name="rollNo" value={formData.rollNo || ''} onChange={handleChange} />
            <InputField label="Mobile" name="mobile" value={formData.mobile || ''} onChange={handleChange} />
            <InputField label="Father" name="fatherName" value={formData.fatherName || ''} onChange={handleChange} />
            <InputField label="Mother" name="motherName" value={formData.motherName || ''} onChange={handleChange} />
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-6 py-2 rounded-xl font-bold bg-slate-100 dark:bg-white/10">Cancel</button>
            <button type="submit" className="px-6 py-2 rounded-xl font-bold bg-ios-blue text-white flex items-center gap-2"><Save size={16} /> Save</button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

const InputField: React.FC<{ label: string, name: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }> = ({ label, name, value, onChange }) => (
  <div className="space-y-1">
    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{label}</label>
    <input type="text" name={name} value={value} onChange={onChange} required className="w-full p-3 rounded-lg bg-slate-50 dark:bg-black/20 border-none outline-none focus:ring-2 focus:ring-ios-blue/50 text-slate-900 dark:text-white font-medium" />
  </div>
);
