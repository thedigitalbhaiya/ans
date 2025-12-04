
export interface Student {
  name: string;
  admissionNo: string;
  session: string;
  rollNo: string;
  class: string;
  dob: string;
  gender: string;
  bloodGroup: string;
  fatherName: string;
  motherName: string;
  mobile: string;
  address: string;
  religion: string;
  category: string;
  avatar: string;
  stats: {
    attendance: string;
    grade: string;
    rank: string;
  };
}

export interface Homework {
  id: number;
  subject: string;
  title: string;
  due: string;
  status: 'pending' | 'completed';
  color: string;
  icon: any; // Lucide icon component
}

export interface Notice {
  id: number;
  title: string;
  date: string;
  category: 'Academic' | 'Event' | 'Holiday' | 'General';
  content: string;
  icon: any;
  color: string;
  bg: string;
}

export interface TimetableEntry {
  time: string;
  endTime: string;
  subject: string;
  room: string;
  teacher: string;
  type: 'lecture' | 'lab' | 'break' | 'active';
}

export interface WeeklySchedule {
  [key: string]: TimetableEntry[];
}

export interface AttendanceRecord {
  date: string;
  status: 'Present' | 'Absent' | 'Late' | 'Holiday';
}

export interface FeeRecord {
  id: number;
  month: string;
  amount: string;
  status: 'Paid' | 'Pending';
  date: string;
  invoice: string;
}

export interface ExamResult {
  name: string;
  score: number;
  grade: string;
  color: string;
}

export interface GalleryItem {
  id: number;
  title: string;
  category: string;
  url: string;
}

export interface ApplicationRecord {
  id: number;
  type: string;
  from: string;
  to: string;
  status: 'Approved' | 'Rejected' | 'Pending';
  color: string;
}

export enum Theme {
  LIGHT = 'light',
  DARK = 'dark',
}
