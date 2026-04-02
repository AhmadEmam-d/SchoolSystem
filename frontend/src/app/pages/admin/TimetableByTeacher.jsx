import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Download, Printer, User, Clock, BookOpen, Calendar, Edit } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { api } from '../../../app/lib/api';

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];

export function TimetableByTeacher() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [timetableData, setTimetableData] = useState({});
  const [loading, setLoading] = useState(false);
  const [currentTeacher, setCurrentTeacher] = useState(null);

  // Fetch teachers
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const data = await api.teachers.getAll();
        console.log('Teachers loaded:', data);
        if (data && data.length > 0) {
          setTeachers(data);
          // ✅ اختر المدرس "ahmed" إذا وجد، وإلا اختر أول واحد
          const ahmedTeacher = data.find(t => t.fullName === 'ahmed');
          const teacherToSelect = ahmedTeacher || data[0];
          console.log('Selected teacher:', teacherToSelect);
          setSelectedTeacher(teacherToSelect.oid);
          setCurrentTeacher(teacherToSelect);
        }
      } catch (error) {
        console.error('Error fetching teachers:', error);
        toast.error(t('errorFetchingData'));
      }
    };
    fetchTeachers();
  }, []);

  // Fetch timetable when teacher changes
  useEffect(() => {
    const fetchTimetable = async () => {
      if (selectedTeacher) {
        setLoading(true);
        try {
          console.log('Fetching timetable for teacher OID:', selectedTeacher);
          const data = await api.timetable.getByTeacher(selectedTeacher);
          console.log('Timetable API response:', data);
          
          const teacher = teachers.find(t => t.oid === selectedTeacher);
          setCurrentTeacher(teacher);
          
          if (data && data.weeklySchedule) {
            // Organize by time
            const organized = {};
            days.forEach(day => { organized[day] = {}; });
            
            Object.entries(data.weeklySchedule).forEach(([day, slots]) => {
              console.log(`Processing ${day}:`, slots);
              if (slots && slots.length > 0) {
                slots.forEach(slot => {
                  const startTime = slot.time.split('-')[0];
                  organized[day][startTime] = {
                    subjectName: slot.subjectName,
                    teacherName: slot.teacherName,
                    className: slot.className,
                    room: slot.room,
                    fullTime: slot.time
                  };
                });
              }
            });
            console.log('Organized timetable:', organized);
            setTimetableData(organized);
          } else {
            console.log('No weeklySchedule in response');
            setTimetableData({});
          }
        } catch (error) {
          console.error('Error fetching timetable:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchTimetable();
  }, [selectedTeacher, teachers]);

  const getScheduleItem = (day, time) => {
    return timetableData[day]?.[time] || null;
  };

  const totalHours = Object.values(timetableData).flatMap(day => Object.values(day)).length;

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    const headers = ['Day', 'Time', 'Subject', 'Class', 'Room'];
    const rows = [];

    Object.entries(timetableData).forEach(([day, slots]) => {
      Object.entries(slots).forEach(([time, slot]) => {
        rows.push([
          day,
          time,
          `"${slot.subjectName}"`,
          `"${slot.className}"`,
          slot.room
        ].join(','));
      });
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `teacher_timetable_${selectedTeacher}_${new Date().toISOString().split('T')[0]}.csv`);
    link.click();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">{t('loading')}</div>
      </div>
    );
  }

  const times = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00'];

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
            {t('print')}
          </button>
          <button
            onClick={() => navigate('/admin/timetable/edit?type=teacher')}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Edit className="h-5 w-5" />
            {t('editTimetable')}
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
            <option key={teacher.oid} value={teacher.oid}>
              {teacher.fullName} - {teacher.subjects?.[0]?.name || 'General'}
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
                <h2 className="text-2xl font-bold mb-1">{currentTeacher.fullName}</h2>
                <p className="text-purple-100 flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  {currentTeacher.subjects?.map(s => s.name).join(', ') || 'General'}
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
                <p className="text-2xl font-bold">{totalHours}</p>
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
          <table className="w-full min-w-[800px] border-collapse">
            <thead>
              <tr className="bg-purple-50 dark:bg-purple-900/20">
                <th className="px-4 py-3 text-left text-sm font-semibold text-purple-900 dark:text-purple-400 border border-gray-200 dark:border-gray-700">
                  {t('time')}
                </th>
                {days.map((day) => (
                  <th key={day} className="px-4 py-3 text-center text-sm font-semibold text-purple-900 dark:text-purple-400 border border-gray-200 dark:border-gray-700">
                    {t(`timetableByTeacher.${day.toLowerCase()}`)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {times.map(time => (
                <tr key={time} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap border border-gray-200 dark:border-gray-700">
                    {time}
                  </td>
                  {days.map(day => {
                    const item = getScheduleItem(day, time);
                    return (
                      <td key={`${day}-${time}`} className="px-4 py-3 border border-gray-200 dark:border-gray-700">
                        {item ? (
                          <div className="bg-purple-50 dark:bg-purple-900/30 rounded-lg p-3 border border-purple-200 dark:border-purple-700">
                            <p className="font-semibold text-gray-900 dark:text-white text-sm mb-1">
                              {item.className}
                            </p>
                            <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                              <span className="flex items-center gap-1">
                                <BookOpen className="h-3 w-3" />
                                {item.subjectName}
                              </span>
                              <span className="px-2 py-0.5 bg-white dark:bg-gray-700 rounded text-xs font-medium">
                                {item.room}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center text-gray-400">-</div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}