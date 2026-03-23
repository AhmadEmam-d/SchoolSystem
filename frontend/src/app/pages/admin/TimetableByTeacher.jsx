import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Download, Printer, User, Clock, BookOpen, Calendar, Edit, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// Mock data for teachers
const teachersData = {
  en: [
    {
      id: 'TCH-001',
      name: 'Mr. Mohamed Ali',
      subject: 'Mathematics',
      email: 'mohamed@edusmart.com',
      phone: '+20 123 456 7890',
    },
    {
      id: 'TCH-002',
      name: 'Ms. Fatma Hassan',
      subject: 'Arabic Language',
      email: 'fatma@edusmart.com',
      phone: '+20 123 456 7891',
    },
    {
      id: 'TCH-003',
      name: 'Mr. Ahmed Said',
      subject: 'Science',
      email: 'ahmed@edusmart.com',
      phone: '+20 123 456 7892',
    },
    {
      id: 'TCH-004',
      name: 'Ms. Sara Ibrahim',
      subject: 'English Language',
      email: 'sara@edusmart.com',
      phone: '+20 123 456 7893',
    },
  ],
  ar: [
    {
      id: 'TCH-001',
      name: 'أ. محمد علي',
      subject: 'الرياضيات',
      email: 'mohamed@edusmart.com',
      phone: '+20 123 456 7890',
    },
    {
      id: 'TCH-002',
      name: 'أ. فاطمة حسن',
      subject: 'اللغة العربية',
      email: 'fatma@edusmart.com',
      phone: '+20 123 456 7891',
    },
    {
      id: 'TCH-003',
      name: 'أ. أحمد سعيد',
      subject: 'العلوم',
      email: 'ahmed@edusmart.com',
      phone: '+20 123 456 7892',
    },
    {
      id: 'TCH-004',
      name: 'أ. سارة إبراهيم',
      subject: 'اللغة الإنجليزية',
      email: 'sara@edusmart.com',
      phone: '+20 123 456 7893',
    },
  ],
};

// Mock timetable data with translations
const timetableData = {
  'TCH-001': {
    'Sunday': [
      { time: '08:00-09:00', class: { en: 'Grade 1 - A', ar: 'الصف الأول - أ' }, subject: { en: 'Mathematics', ar: 'الرياضيات' }, room: '101' },
      { time: '09:00-10:00', class: { en: 'Grade 2 - B', ar: 'الصف الثاني - ب' }, subject: { en: 'Mathematics', ar: 'الرياضيات' }, room: '102' },
      { time: '10:00-11:00', isBreak: true },
      { time: '11:00-12:00', class: { en: 'Grade 3 - A', ar: 'الصف الثالث - أ' }, subject: { en: 'Mathematics', ar: 'الرياضيات' }, room: '103' },
      { time: '12:00-13:00', class: { en: 'Grade 1 - B', ar: 'الصف الأول - ب' }, subject: { en: 'Mathematics', ar: 'الرياضيات' }, room: '101' },
    ],
    'Monday': [
      { time: '08:00-09:00', class: { en: 'Grade 2 - A', ar: 'الصف الثاني - أ' }, subject: { en: 'Mathematics', ar: 'الرياضيات' }, room: '102' },
      { time: '09:00-10:00', class: { en: 'Grade 3 - B', ar: 'الصف الثالث - ب' }, subject: { en: 'Mathematics', ar: 'الرياضيات' }, room: '103' },
      { time: '10:00-11:00', isBreak: true },
      { time: '11:00-12:00', class: { en: 'Grade 1 - A', ar: 'الصف الأول - أ' }, subject: { en: 'Mathematics', ar: 'الرياضيات' }, room: '101' },
      { time: '12:00-13:00', isFree: true },
    ],
    'Tuesday': [
      { time: '08:00-09:00', class: { en: 'Grade 1 - B', ar: 'الصف الأول - ب' }, subject: { en: 'Mathematics', ar: 'الرياضيات' }, room: '101' },
      { time: '09:00-10:00', class: { en: 'Grade 2 - A', ar: 'الصف الثاني - أ' }, subject: { en: 'Mathematics', ar: 'الرياضيات' }, room: '102' },
      { time: '10:00-11:00', isBreak: true },
      { time: '11:00-12:00', class: { en: 'Grade 3 - A', ar: 'الصف الثالث - أ' }, subject: { en: 'Mathematics', ar: 'الرياضيات' }, room: '103' },
      { time: '12:00-13:00', class: { en: 'Grade 2 - B', ar: 'الصف الثاني - ب' }, subject: { en: 'Mathematics', ar: 'الرياضيات' }, room: '102' },
    ],
    'Wednesday': [
      { time: '08:00-09:00', class: { en: 'Grade 3 - B', ar: 'الصف الثالث - ب' }, subject: { en: 'Mathematics', ar: 'الرياضيات' }, room: '103' },
      { time: '09:00-10:00', class: { en: 'Grade 1 - A', ar: 'الصف الأول - أ' }, subject: { en: 'Mathematics', ar: 'الرياضيات' }, room: '101' },
      { time: '10:00-11:00', isBreak: true },
      { time: '11:00-12:00', class: { en: 'Grade 2 - B', ar: 'الصف الثاني - ب' }, subject: { en: 'Mathematics', ar: 'الرياضيات' }, room: '102' },
      { time: '12:00-13:00', class: { en: 'Grade 3 - A', ar: 'الصف الثالث - أ' }, subject: { en: 'Mathematics', ar: 'الرياضيات' }, room: '103' },
    ],
    'Thursday': [
      { time: '08:00-09:00', class: { en: 'Grade 1 - B', ar: 'الصف الأول - ب' }, subject: { en: 'Mathematics', ar: 'الرياضيات' }, room: '101' },
      { time: '09:00-10:00', class: { en: 'Grade 2 - A', ar: 'الصف الثاني - أ' }, subject: { en: 'Mathematics', ar: 'الرياضيات' }, room: '102' },
      { time: '10:00-11:00', isBreak: true },
      { time: '11:00-12:00', isFree: true },
      { time: '12:00-13:00', isFree: true },
    ],
  },
  'TCH-002': {
    'Sunday': [
      { time: '08:00-09:00', class: { en: 'Grade 1 - A', ar: 'الصف الأول - أ' }, subject: { en: 'Arabic Language', ar: 'اللغة العربية' }, room: '201' },
      { time: '09:00-10:00', class: { en: 'Grade 2 - A', ar: 'الصف الثاني - أ' }, subject: { en: 'Arabic Language', ar: 'اللغة العربية' }, room: '202' },
      { time: '10:00-11:00', isBreak: true },
      { time: '11:00-12:00', class: { en: 'Grade 3 - A', ar: 'الصف الثالث - أ' }, subject: { en: 'Arabic Language', ar: 'اللغة العربية' }, room: '203' },
      { time: '12:00-13:00', class: { en: 'Grade 1 - B', ar: 'الصف الأول - ب' }, subject: { en: 'Arabic Language', ar: 'اللغة العربية' }, room: '201' },
    ],
    'Monday': [
      { time: '08:00-09:00', class: { en: 'Grade 2 - B', ar: 'الصف الثاني - ب' }, subject: { en: 'Arabic Language', ar: 'اللغة العربية' }, room: '202' },
      { time: '09:00-10:00', class: { en: 'Grade 3 - B', ar: 'الصف الثالث - ب' }, subject: { en: 'Arabic Language', ar: 'اللغة العربية' }, room: '203' },
      { time: '10:00-11:00', isBreak: true },
      { time: '11:00-12:00', class: { en: 'Grade 1 - A', ar: 'الصف الأول - أ' }, subject: { en: 'Arabic Language', ar: 'اللغة العربية' }, room: '201' },
      { time: '12:00-13:00', class: { en: 'Grade 2 - A', ar: 'الصف الثاني - أ' }, subject: { en: 'Arabic Language', ar: 'اللغة العربية' }, room: '202' },
    ],
    'Tuesday': [
      { time: '08:00-09:00', class: { en: 'Grade 1 - B', ar: 'الصف الأول - ب' }, subject: { en: 'Arabic Language', ar: 'اللغة العربية' }, room: '201' },
      { time: '09:00-10:00', class: { en: 'Grade 2 - B', ar: 'الصف الثاني - ب' }, subject: { en: 'Arabic Language', ar: 'اللغة العربية' }, room: '202' },
      { time: '10:00-11:00', isBreak: true },
      { time: '11:00-12:00', class: { en: 'Grade 3 - A', ar: 'الصف الثالث - أ' }, subject: { en: 'Arabic Language', ar: 'اللغة العربية' }, room: '203' },
      { time: '12:00-13:00', isFree: true },
    ],
    'Wednesday': [
      { time: '08:00-09:00', class: { en: 'Grade 3 - B', ar: 'الصف الثالث - ب' }, subject: { en: 'Arabic Language', ar: 'اللغة العربية' }, room: '203' },
      { time: '09:00-10:00', class: { en: 'Grade 1 - A', ar: 'الصف الأول - أ' }, subject: { en: 'Arabic Language', ar: 'اللغة العربية' }, room: '201' },
      { time: '10:00-11:00', isBreak: true },
      { time: '11:00-12:00', class: { en: 'Grade 2 - B', ar: 'الصف الثاني - ب' }, subject: { en: 'Arabic Language', ar: 'اللغة العربية' }, room: '202' },
      { time: '12:00-13:00', class: { en: 'Grade 3 - A', ar: 'الصف الثالث - أ' }, subject: { en: 'Arabic Language', ar: 'اللغة العربية' }, room: '203' },
    ],
    'Thursday': [
      { time: '08:00-09:00', class: { en: 'Grade 1 - B', ar: 'الصف الأول - ب' }, subject: { en: 'Arabic Language', ar: 'اللغة العربية' }, room: '201' },
      { time: '09:00-10:00', class: { en: 'Grade 2 - A', ar: 'الصف الثاني - أ' }, subject: { en: 'Arabic Language', ar: 'اللغة العربية' }, room: '202' },
      { time: '10:00-11:00', isBreak: true },
      { time: '11:00-12:00', class: { en: 'Grade 3 - B', ar: 'الصف الثالث - ب' }, subject: { en: 'Arabic Language', ar: 'اللغة العربية' }, room: '203' },
      { time: '12:00-13:00', isFree: true },
    ],
  },
};

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];

export function TimetableByTeacher() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [selectedTeacher, setSelectedTeacher] = useState('TCH-001');

  const currentLang = i18n.language;
  const teachers = teachersData[currentLang];
  const currentTeacher = teachers.find(t => t.id === selectedTeacher);
  const currentTimetable = timetableData[selectedTeacher] || {};

  // Calculate total teaching hours
  const totalHours = Object.values(currentTimetable).flat().filter((period) => !period.isBreak && !period.isFree).length;
  const freeHours = Object.values(currentTimetable).flat().filter((period) => period.isFree).length;

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];
    
    // Prepare CSV content
    const headers = ['Day', 'Time', 'Class', 'Subject', 'Room'];
    const rows = [];
    
    dayNames.forEach(day => {
      const periods = currentTimetable[day] || [];
      periods.forEach((period) => {
        if (period.isBreak) {
          rows.push([day, period.time, 'Break', '', ''].join(','));
        } else if (period.isFree) {
          rows.push([day, period.time, 'Free Period', '', ''].join(','));
        } else {
          rows.push([
            day,
            period.time,
            `"${period.class[currentLang]}"`,
            `"${period.subject[currentLang]}"`,
            period.room
          ].join(','));
        }
      });
    });

    const csvContent = [headers.join(','), ...rows].join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `teacher_timetable_${selectedTeacher}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/timetable')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-purple-600 dark:text-purple-400">{t('timetableByTeacher.title')}</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">{t('timetableByTeacher.subtitle')}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <Printer className="h-5 w-5" />
            {t('timetableByTeacher.print')}
          </button>
          <button
            onClick={() => navigate('/admin/timetable/edit?type=teacher')}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Edit className="h-5 w-5" />
            تعديل الجدول
          </button>
        </div>
      </div>

      {/* Teacher Selection */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          {t('timetableByTeacher.selectTeacher')}
        </label>
        <select
          value={selectedTeacher}
          onChange={(e) => setSelectedTeacher(e.target.value)}
          className="w-full md:w-auto px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white text-lg"
        >
          {teachers.map((teacher) => (
            <option key={teacher.id} value={teacher.id}>
              {teacher.name} - {teacher.subject}
            </option>
          ))}
        </select>
      </div>

      {/* Teacher Info Card */}
      {currentTeacher && (
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <User className="h-8 w-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-1">{currentTeacher.name}</h2>
                <p className="text-purple-100 flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  {currentTeacher.subject}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
                <Clock className="h-5 w-5 mx-auto mb-1" />
                <p className="text-sm text-purple-100">{t('timetableByTeacher.totalClasses')}</p>
                <p className="text-2xl font-bold">{totalHours}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
                <Calendar className="h-5 w-5 mx-auto mb-1" />
                <p className="text-sm text-purple-100">{t('timetableByTeacher.teachingDays')}</p>
                <p className="text-2xl font-bold">5</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
                <BookOpen className="h-5 w-5 mx-auto mb-1" />
                <p className="text-sm text-purple-100">{t('timetableByTeacher.classesCount')}</p>
                <p className="text-2xl font-bold">6</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Timetable */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t('timetableByTeacher.weeklySchedule')}</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="bg-purple-50 dark:bg-purple-900/20">
                <th className="px-4 py-3 text-right text-sm font-semibold text-purple-900 dark:text-purple-400 border-b border-gray-200 dark:border-gray-700 sticky right-0 bg-purple-50 dark:bg-purple-900/20">
                  {t('timetableByTeacher.time')}
                </th>
                {days.map((day) => (
                  <th
                    key={day}
                    className="px-4 py-3 text-center text-sm font-semibold text-purple-900 dark:text-purple-400 border-b border-gray-200 dark:border-gray-700"
                  >
                    {t(`timetableByTeacher.${day.toLowerCase()}`)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {/* Generate rows based on time slots */}
              {currentTimetable['Sunday']?.map((_, timeIndex) => (
                <tr key={timeIndex} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap sticky right-0 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700">
                    {currentTimetable['Sunday'][timeIndex]?.time}
                  </td>
                  {days.map((day) => {
                    const period = currentTimetable[day]?.[timeIndex];
                    if (!period) return <td key={day} className="px-4 py-3"></td>;

                    if (period.isBreak) {
                      return (
                        <td key={day} className="px-4 py-3">
                          <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 text-center">
                            <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                              {t('timetableByTeacher.break')}
                            </p>
                          </div>
                        </td>
                      );
                    }

                    if (period.isFree) {
                      return (
                        <td key={day} className="px-4 py-3">
                          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 text-center border border-green-200 dark:border-green-800">
                            <p className="text-sm font-semibold text-green-700 dark:text-green-400">
                              {t('timetableByTeacher.freePeriod')}
                            </p>
                          </div>
                        </td>
                      );
                    }

                    return (
                      <td key={day} className="px-4 py-3">
                        <div className="bg-purple-50 dark:bg-purple-900/30 rounded-lg p-3 border border-purple-200 dark:border-purple-700">
                          <p className="font-semibold text-gray-900 dark:text-white text-sm mb-1">
                            {period.class[currentLang]}
                          </p>
                          <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                            <span className="flex items-center gap-1">
                              <BookOpen className="h-3 w-3" />
                              {period.subject[currentLang]}
                            </span>
                            <span className="px-2 py-0.5 bg-white dark:bg-gray-700 rounded text-xs font-medium">
                              {period.room}
                            </span>
                          </div>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Legend */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{t('timetableByTeacher.legend')}</h3>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-purple-50 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-700 rounded"></div>
            <span className="text-sm text-gray-700 dark:text-gray-300">{t('timetableByTeacher.teachingClass')}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded"></div>
            <span className="text-sm text-gray-700 dark:text-gray-300">{t('timetableByTeacher.freePeriod')}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-gray-100 dark:bg-gray-700 rounded"></div>
            <span className="text-sm text-gray-700 dark:text-gray-300">{t('timetableByTeacher.break')}</span>
          </div>
        </div>
      </div>

      {/* Weekly Summary */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{t('timetableByTeacher.weekSummary')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{t('timetableByTeacher.totalHours')}</p>
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {totalHours} {t('timetableByTeacher.classes')}
            </p>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{t('timetableByTeacher.freeHours')}</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {freeHours} {t('timetableByTeacher.classes')}
            </p>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{t('timetableByTeacher.workload')}</p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {((totalHours / 25) * 100).toFixed(0)}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
