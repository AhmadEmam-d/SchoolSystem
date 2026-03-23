import React from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Users, Clock, BookOpen, Calendar, ClipboardCheck, Eye, FileText, BookOpenCheck } from 'lucide-react';

export function TeacherClasses() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const weeklySchedule = [
    { day: 'Sunday', slots: [
      { time: '08:00 - 09:00', classId: 'c1', class: 'Grade 10-A', subject: 'Mathematics', room: '301' },
      { time: '10:00 - 11:00', classId: 'c2', class: 'Grade 10-B', subject: 'Mathematics', room: '302' },
    ]},
    { day: 'Monday', slots: [
      { time: '09:00 - 10:00', classId: 'c1', class: 'Grade 10-A', subject: 'Mathematics', room: '301' },
      { time: '11:00 - 12:00', classId: 'c3', class: 'Grade 11-A', subject: 'Mathematics', room: '303' },
    ]},
    { day: 'Tuesday', slots: [
      { time: '08:00 - 09:00', classId: 'c3', class: 'Grade 11-A', subject: 'Mathematics', room: '303' },
      { time: '10:00 - 11:00', classId: 'c2', class: 'Grade 10-B', subject: 'Mathematics', room: '302' },
    ]},
    { day: 'Wednesday', slots: [
      { time: '09:00 - 10:00', classId: 'c1', class: 'Grade 10-A', subject: 'Mathematics', room: '301' },
      { time: '11:00 - 12:00', classId: 'c2', class: 'Grade 10-B', subject: 'Mathematics', room: '302' },
    ]},
    { day: 'Thursday', slots: [
      { time: '08:00 - 09:00', classId: 'c1', class: 'Grade 10-A', subject: 'Mathematics', room: '301' },
      { time: '10:00 - 11:00', classId: 'c3', class: 'Grade 11-A', subject: 'Mathematics', room: '303' },
      { time: '01:00 - 02:00', classId: 'c2', class: 'Grade 10-B', subject: 'Mathematics', room: '302' },
    ]},
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-foreground">{t('myClasses')}</h1>
          <p className="text-muted-foreground">{t('myClassesDesc')}</p>
        </div>
      </div>

      {/* Weekly Schedule */}
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
              {weeklySchedule.reduce((acc, day) => acc + (day?.slots?.length || 0), 0)} {t('classesThisWeek')}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.isArray(weeklySchedule) && weeklySchedule.map((daySchedule, idx) => (
              <div key={idx} className="border border-border rounded-lg overflow-hidden">
                <div className="bg-indigo-50 dark:bg-indigo-900/20 px-4 py-3 border-b border-border">
                  <h3 className="font-semibold text-foreground">{t(daySchedule?.day?.toLowerCase() || 'day')}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {daySchedule?.slots?.length || 0} {(daySchedule?.slots?.length || 0) === 1 ? t('classScheduled') : t('classesScheduled')}
                  </p>
                </div>
                <div className="p-4 bg-card">
                  {Array.isArray(daySchedule?.slots) && daySchedule.slots.length > 0 ? (
                    <div className="space-y-3">
                      {daySchedule.slots.map((slot, slotIdx) => (
                        <div
                          key={slotIdx}
                          className="p-4 bg-muted/30 border border-border rounded-lg hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-center gap-4 mb-3 flex-wrap">
                            <div className="flex items-center gap-2 min-w-[120px]">
                              <Clock className="h-4 w-4 text-indigo-500" />
                              <span className="text-sm font-medium text-foreground">{slot.time}</span>
                            </div>
                            <div className="flex items-center gap-2 flex-1">
                              <Users className="h-4 w-4 text-blue-500" />
                              <span className="text-sm font-semibold text-foreground">{slot.class}</span>
                            </div>
                            <div className="flex items-center gap-2 min-w-[140px]">
                              <BookOpen className="h-4 w-4 text-green-500" />
                              <span className="text-sm text-muted-foreground">{slot.subject}</span>
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
                              onClick={() => navigate(`/teacher/class-details?classId=${slot.classId}`)}
                            >
                              <Eye className="h-3.5 w-3.5" />
                              {t('viewClassDetails')}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex items-center gap-1.5"
                              onClick={() => navigate(`/teacher/lessons/add?classId=${slot.classId}&className=${encodeURIComponent(slot.class)}`)}
                            >
                              <BookOpenCheck className="h-3.5 w-3.5" />
                              {t('addLesson')}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex items-center gap-1.5"
                              onClick={() => navigate(`/teacher/homework/add?classId=${slot.classId}&className=${encodeURIComponent(slot.class)}`)}
                            >
                              <FileText className="h-3.5 w-3.5" />
                              {t('assignHomework')}
                            </Button>
                            <Button
                              size="sm"
                              variant="default"
                              className="flex items-center gap-1.5"
                              onClick={() => navigate(`/teacher/attendance/method-selection?classId=${slot.classId}&className=${encodeURIComponent(slot.class)}&date=${new Date().toISOString().split('T')[0]}`)}
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
