import { addDays, format, startOfWeek } from 'date-fns';

// Mock Data

// User Role types
export const UserRole = {
  ADMIN: 'admin',
  TEACHER: 'teacher',
  STUDENT: 'student',
  PARENT: 'parent'
};

export const CURRENT_USER = {
  id: 'u1',
  name: 'Admin User',
  email: 'admin@edusmart.edu',
  role: 'admin',
};

export const SUBJECTS = [
  { id: 'sub1', name: 'Mathematics', teacherId: 't1' },
  { id: 'sub2', name: 'Science', teacherId: 't2' },
  { id: 'sub3', name: 'History', teacherId: 't3' },
  { id: 'sub4', name: 'English', teacherId: 't4' },
  { id: 'sub5', name: 'Art', teacherId: 't5' },
];

export const TEACHERS = [
  { id: 't1', name: 'John Nash', email: 'nash@edusmart.edu', role: 'teacher', subject: 'Mathematics', classes: ['c1', 'c2'] },
  { id: 't2', name: 'Marie Curie', email: 'curie@edusmart.edu', role: 'teacher', subject: 'Science', classes: ['c1', 'c3'] },
  { id: 't3', name: 'Herodotus', email: 'hero@edusmart.edu', role: 'teacher', subject: 'History', classes: ['c2', 'c3'] },
  { id: 't4', name: 'Shakespeare', email: 'will@edusmart.edu', role: 'teacher', subject: 'English', classes: ['c1', 'c2', 'c3'] },
  { id: 't5', name: 'Da Vinci', email: 'leo@edusmart.edu', role: 'teacher', subject: 'Art', classes: ['c1'] },
];

export const PARENTS = [
  { id: 'p1', name: 'Homer Simpson', email: 'homer@springfield.com', role: 'parent', children: ['s1'], phone: '555-0123' },
  { id: 'p2', name: 'Randy Marsh', email: 'randy@southpark.com', role: 'parent', children: ['s2'], phone: '555-0456' },
];

export const STUDENTS = [
  { id: 's1', name: 'Bart Simpson', email: 'bart@edusmart.edu', role: 'student', grade: '10th', parentId: 'p1', attendance: 85, gpa: 2.8 },
  { id: 's2', name: 'Stan Marsh', email: 'stan@edusmart.edu', role: 'student', grade: '10th', parentId: 'p2', attendance: 98, gpa: 3.8 },
  { id: 's3', name: 'Lisa Simpson', email: 'lisa@edusmart.edu', role: 'student', grade: '8th', parentId: 'p1', attendance: 100, gpa: 4.0 },
  { id: 's4', name: 'Eric Cartman', email: 'eric@edusmart.edu', role: 'student', grade: '10th', parentId: 'p2', attendance: 70, gpa: 2.0 },
];

export const CLASSES = [
  { id: 'c1', name: 'Class 10-A', grade: '10th', teacherId: 't1', students: ['s1', 's2'], schedule: [] },
  { id: 'c2', name: 'Class 10-B', grade: '10th', teacherId: 't3', students: ['s4'], schedule: [] },
  { id: 'c3', name: 'Class 8-A', grade: '8th', teacherId: 't2', students: ['s3'], schedule: [] },
];

export const ANNOUNCEMENTS = [
  { id: 'a1', title: 'School Closed for Snow Day', content: 'Due to heavy snowfall, school will be closed tomorrow.', date: format(new Date(), 'yyyy-MM-dd'), author: 'Principal', role: 'all' },
  { id: 'a2', title: 'Exam Schedule Released', content: 'The final exam schedule has been posted.', date: format(addDays(new Date(), -2), 'yyyy-MM-dd'), author: 'Admin', role: 'all' },
];

export const RECENT_ACTIVITY = [
  { id: 1, user: 'Bart Simpson', action: 'submitted homework', target: 'Math 101', time: '2 hours ago' },
  { id: 2, user: 'John Nash', action: 'graded', target: 'Science Quiz', time: '3 hours ago' },
  { id: 3, user: 'Lisa Simpson', action: 'scored 100%', target: 'History Essay', time: '5 hours ago' },
  { id: 4, user: 'Homer Simpson', action: 'paid fees', target: 'Tuition', time: '1 day ago' },
];

export const MOCK_CHATS = [
  { id: 'm1', fromId: 't1', toId: 's1', content: 'Don\'t forget your homework!', timestamp: '10:00 AM', read: false },
  { id: 'm2', fromId: 's1', toId: 't1', content: 'I won\'t!', timestamp: '10:05 AM', read: true },
];