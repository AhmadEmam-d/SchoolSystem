import React, { createContext, useContext, useState, useEffect } from 'react';

const MockDataContext = createContext(undefined);

// User Role types
export const UserRole = {
  ADMIN: 'admin',
  TEACHER: 'teacher',
  STUDENT: 'student',
  PARENT: 'parent'
};

// Initial Mock Data
const INITIAL_USERS = [
  { id: 'admin1', name: 'Principal Skinner', email: 'admin@edusmart.com', role: 'admin' },
  { id: 'teach1', name: 'Edna Krabappel', email: 'edna@edusmart.com', role: 'teacher', subjectId: 'math' },
  { id: 'teach2', name: 'Elizabeth Hoover', email: 'liz@edusmart.com', role: 'teacher', subjectId: 'history' },
  { id: 'stud1', name: 'Bart Simpson', email: 'bart@edusmart.com', role: 'student', grade: '4' },
  { id: 'stud2', name: 'Lisa Simpson', email: 'lisa@edusmart.com', role: 'student', grade: '2' },
  { id: 'parent1', name: 'Homer Simpson', email: 'homer@edusmart.com', role: 'parent', studentIds: ['stud1', 'stud2'] },
];

const INITIAL_SUBJECTS = [
  { id: 'math', name: 'Mathematics', code: 'MATH101', teacherId: 'teach1' },
  { id: 'history', name: 'History', code: 'HIST101', teacherId: 'teach2' },
  { id: 'science', name: 'Science', code: 'SCI101' },
  { id: 'english', name: 'English', code: 'ENG101' },
];

const INITIAL_CLASSES = [
  { id: 'class4a', name: '4-A', gradeLevel: '4', teacherIds: ['teach1'], studentIds: ['stud1'] },
  { id: 'class2a', name: '2-A', gradeLevel: '2', teacherIds: ['teach2'], studentIds: ['stud2'] },
];

const INITIAL_ANNOUNCEMENTS = [
  { id: 'ann1', title: 'Science Fair Next Week', content: 'Prepare your projects!', date: '2023-10-15', authorId: 'admin1', targetRoles: ['student', 'teacher', 'parent'] },
  { id: 'ann2', title: 'Staff Meeting', content: 'Friday at 3pm.', date: '2023-10-16', authorId: 'admin1', targetRoles: ['teacher'] },
];

const INITIAL_GRADES = [
  { id: 'g1', studentId: 'stud1', subjectId: 'math', score: 45, maxScore: 100, type: 'exam', date: '2023-10-01', title: 'Midterm' },
  { id: 'g2', studentId: 'stud2', subjectId: 'history', score: 98, maxScore: 100, type: 'quiz', date: '2023-10-05', title: 'Quiz 1' },
];

const INITIAL_ATTENDANCE = [
  { id: 'att1', studentId: 'stud1', classId: 'class4a', date: new Date().toISOString().split('T')[0], status: 'present' },
];

export function MockDataProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState(INITIAL_USERS);
  const [subjects, setSubjects] = useState(INITIAL_SUBJECTS);
  const [classes, setClasses] = useState(INITIAL_CLASSES);
  const [attendance, setAttendance] = useState(INITIAL_ATTENDANCE);
  const [grades, setGrades] = useState(INITIAL_GRADES);
  const [announcements, setAnnouncements] = useState(INITIAL_ANNOUNCEMENTS);

  // Persistence (optional - can be added later if needed, keeping it simple in memory for now)
  
  const addUser = (user) => setUsers([...users, user]);
  const updateUser = (id, data) => {
    setUsers(users.map(u => u.id === id ? { ...u, ...data } : u));
  };
  const deleteUser = (id) => setUsers(users.filter(u => u.id !== id));
  
  const addClass = (cls) => setClasses([...classes, cls]);
  const addSubject = (subj) => setSubjects([...subjects, subj]);
  const addAttendance = (att) => setAttendance([...attendance, att]);
  const addGrade = (grade) => setGrades([...grades, grade]);
  const addAnnouncement = (ann) => setAnnouncements([...announcements, ann]);

  const login = (role) => {
    // Auto-login as first user of that role for demo purposes
    const user = users.find(u => u.role === role);
    if (user) setCurrentUser(user);
  };

  const logout = () => setCurrentUser(null);

  return (
    <MockDataContext.Provider value={{
      currentUser,
      setCurrentUser,
      users,
      subjects,
      classes,
      attendance,
      grades,
      announcements,
      addUser,
      updateUser,
      deleteUser,
      addClass,
      addSubject,
      addAttendance,
      addGrade,
      addAnnouncement,
      login,
      logout
    }}>
      {children}
    </MockDataContext.Provider>
  );
}

export function useMockData() {
  const context = useContext(MockDataContext);
  if (context === undefined) {
    throw new Error('useMockData must be used within a MockDataProvider');
  }
  return context;
}