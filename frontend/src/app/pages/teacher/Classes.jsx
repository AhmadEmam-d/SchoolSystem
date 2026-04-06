import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Users, Clock, BookOpen, Calendar, ClipboardCheck, Eye, FileText, BookOpenCheck } from 'lucide-react';

const API_BASE_URL = 'https://localhost:7179/api';

export function TeacherClasses() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const [loading, setLoading] = useState(true);
  const [weeklySchedule, setWeeklySchedule] = useState([]);
  const [teacherName, setTeacherName] = useState('');
  const [totalClasses, setTotalClasses] = useState(0);

  const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];

  useEffect(() => {
    fetchTeacherSchedule();
  }, []);

  const fetchTeacherSchedule = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const teacherId = localStorage.getItem('userId');
      
      console.log('Teacher ID:', teacherId);
      
      if (!teacherId || teacherId === 'null') {
        console.error('No valid teacher ID found');
        setWeeklySchedule(defaultSchedule);
        setTotalClasses(12);
        setLoading(false);
        return;
      }
      
      const response = await fetch(`${API_BASE_URL}/Timetable/teacher/${teacherId}`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('Timetable API Response:', result);
      
      if (result.success && result.data) {
        const { teacherName, weeklySchedule: scheduleData } = result.data;
        setTeacherName(teacherName || '');
        
        // تحويل البيانات إلى المصفوفة المطلوبة
        const scheduleArray = weekDays.map(day => ({
          day: day,
          slots: scheduleData?.[day] || []
        }));
        
        setWeeklySchedule(scheduleArray);
        
        const total = Object.values(scheduleData || {}).reduce((acc, slots) => acc + (slots?.length || 0), 0);
        setTotalClasses(total);
      } else {
        setWeeklySchedule(defaultSchedule);
        setTotalClasses(12);
      }
    } catch (error) {
      console.error('Error fetching schedule:', error);
      setWeeklySchedule(defaultSchedule);
      setTotalClasses(12);
    } finally {
      setLoading(false);
    }
  };

  // بيانات تجريبية (احتياطية)
  const defaultSchedule = [
    { day: 'Sunday', slots: [
      { time: '08:00-09:00', className: 'Grade 10-A', subjectName: 'Mathematics', room: '301' },
      { time: '10:00-11:00', className: 'Grade 10-B', subjectName: 'Mathematics', room: '302' },
    ]},
    { day: 'Monday', slots: [
      { time: '09:00-10:00', className: 'Grade 10-A', subjectName: 'Mathematics', room: '301' },
      { time: '11:00-12:00', className: 'Grade 11-A', subjectName: 'Mathematics', room: '303' },
    ]},
    { day: 'Tuesday', slots: [
      { time: '08:00-09:00', className: 'Grade 11-A', subjectName: 'Mathematics', room: '303' },
      { time: '10:00-11:00', className: 'Grade 10-B', subjectName: 'Mathematics', room: '302' },
    ]},
    { day: 'Wednesday', slots: [
      { time: '09:00-10:00', className: 'Grade 10-A', subjectName: 'Mathematics', room: '301' },
      { time: '11:00-12:00', className: 'Grade 10-B', subjectName: 'Mathematics', room: '302' },
    ]},
    { day: 'Thursday', slots: [
      { time: '08:00-09:00', className: 'Grade 10-A', subjectName: 'Mathematics', room: '301' },
      { time: '10:00-11:00', className: 'Grade 11-A', subjectName: 'Mathematics', room: '303' },
      { time: '13:00-14:00', className: 'Grade 10-B', subjectName: 'Mathematics', room: '302' },
    ]},
  ];

  const getDayTranslation = (day) => {
    const dayMap = {
      'Sunday': t('sunday'),
      'Monday': t('monday'),
      'Tuesday': t('tuesday'),
      'Wednesday': t('wednesday'),
      'Thursday': t('thursday'),
    };
    return dayMap[day] || day;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const displaySchedule = weeklySchedule.length > 0 ? weeklySchedule : defaultSchedule;
  const displayTotal = weeklySchedule.length > 0 ? totalClasses : 12;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-foreground">{t('myClasses')}</h1>
          <p className="text-muted-foreground">
            {teacherName ? `${teacherName} - ` : ''}{t('myClassesDesc')}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                {t('myWeeklySchedule')}
              </CardTitle>
              <CardDescription>{t('yourTeachingSchedule')}</CardDescription>
            </div>
            <Badge variant="outline" className="text-sm">
              {displayTotal} {t('classesThisWeek')}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {displaySchedule.map((daySchedule, idx) => (
              <div key={idx} className="border border-border rounded-lg overflow-hidden">
                <div className="bg-indigo-50 dark:bg-indigo-900/20 px-4 py-3 border-b border-border">
                  <h3 className="font-semibold text-foreground">{getDayTranslation(daySchedule.day)}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {daySchedule.slots.length} {daySchedule.slots.length === 1 ? t('classScheduled') : t('classesScheduled')}
                  </p>
                </div>
                <div className="p-4 bg-card">
                  {daySchedule.slots.length > 0 ? (
                    <div className="space-y-3">
                      {daySchedule.slots.map((slot, slotIdx) => (
                        <div key={slotIdx} className="p-4 bg-muted/30 border border-border rounded-lg hover:shadow-md transition-shadow">
                          <div className="flex items-center gap-4 mb-3 flex-wrap">
                            <div className="flex items-center gap-2 min-w-[100px]">
                              <Clock className="h-4 w-4 text-indigo-500" />
                              <span className="text-sm font-medium text-foreground">{slot.time}</span>
                            </div>
                            <div className="flex items-center gap-2 flex-1">
                              <Users className="h-4 w-4 text-blue-500" />
                              <span className="text-sm font-semibold text-foreground">{slot.className}</span>
                            </div>
                            <div className="flex items-center gap-2 min-w-[120px]">
                              <BookOpen className="h-4 w-4 text-green-500" />
                              <span className="text-sm text-muted-foreground">{slot.subjectName}</span>
                            </div>
                            <div className="flex items-center gap-2 min-w-[100px]">
                              <div className="h-4 w-4 flex items-center justify-center">
                                <div className="h-3 w-3 bg-purple-500 rounded"></div>
                              </div>
                              <span className="text-sm text-muted-foreground">{t('room')} {slot.room}</span>
                            </div>
                          </div>
                          <div className="flex gap-2 flex-wrap">
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex items-center gap-1.5"
                              onClick={() => navigate(`/teacher/class-details?className=${encodeURIComponent(slot.className)}`)}
                            >
                              <Eye className="h-3.5 w-3.5" />
                              {t('viewClassDetails')}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex items-center gap-1.5"
                              onClick={() => navigate(`/teacher/lessons/add?className=${encodeURIComponent(slot.className)}&subject=${encodeURIComponent(slot.subjectName)}`)}
                            >
                              <BookOpenCheck className="h-3.5 w-3.5" />
                              {t('addLesson')}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex items-center gap-1.5"
                              onClick={() => navigate(`/teacher/homework/add?className=${encodeURIComponent(slot.className)}&subject=${encodeURIComponent(slot.subjectName)}`)}
                            >
                              <FileText className="h-3.5 w-3.5" />
                              {t('assignHomework')}
                            </Button>
                            <Button
                              size="sm"
                              variant="default"
                              className="flex items-center gap-1.5"
                              onClick={() => navigate(`/teacher/attendance/method-selection?className=${encodeURIComponent(slot.className)}&date=${new Date().toISOString().split('T')[0]}`)}
                            >
                              <ClipboardCheck className="h-3.5 w-3.5" />
                              {t('takeAttendance')}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-muted-foreground text-sm">
                      {t('noClassesScheduled')}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}