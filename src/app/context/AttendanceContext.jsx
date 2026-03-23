import React, { createContext, useContext, useState } from 'react';

const AttendanceContext = createContext(null);

export function AttendanceProvider({ children }) {
  const [sessions, setSessions] = useState({});
  const [studentStatus, setStudentStatus] = useState({});

  const startSession = (classId, method, options = {}) => {
    setSessions(prev => ({
      ...prev,
      [classId]: {
        attendanceEnabled: true,
        attendanceMethod: method, // Single method only
        correctNumber: options.correctNumber || null,
        numberOptions: options.numberOptions || null,
        sessionId: `session_${Date.now()}`,
        status: "active"
      }
    }));
    setStudentStatus(prev => ({
      ...prev,
      [classId]: { status: 'pending' }
    }));
  };

  const endSession = (classId) => {
    setSessions(prev => {
      const next = { ...prev };
      if (next[classId]) {
        next[classId] = {
          ...next[classId],
          attendanceEnabled: false,
          status: "completed"
        };
      }
      return next;
    });
    
    setStudentStatus(prev => {
      const current = prev[classId] || { status: 'pending' };
      if (current.status === 'pending') {
        return { ...prev, [classId]: { status: 'absent' } };
      }
      return prev;
    });
  };

  const completeStudentAttendance = (classId, methodUsed) => {
    setStudentStatus(prev => ({
      ...prev,
      [classId]: {
        status: 'completed',
        methodUsed
      }
    }));
  };

  return (
    <AttendanceContext.Provider value={{
      sessions,
      studentStatus,
      startSession,
      endSession,
      completeStudentAttendance
    }}>
      {children}
    </AttendanceContext.Provider>
  );
}

export function useAttendance() {
  const context = useContext(AttendanceContext);
  if (!context) {
    throw new Error('useAttendance must be used within an AttendanceProvider');
  }
  return context;
}