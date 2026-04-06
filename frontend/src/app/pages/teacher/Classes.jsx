import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { useAuth } from '../../context/AuthContext';
import {
  Users, Clock, BookOpen, Calendar, ClipboardCheck,
  Eye, FileText, BookOpenCheck, Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import { api } from '../../lib/api';

export function TeacherClasses() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(true);
  const isRTL = i18n.language === 'ar';

  useEffect(() => {
    const fetchTimetable = async () => {
      const effectiveTeacherId = user?.teacherId || localStorage.getItem('teacherId');

      if (!effectiveTeacherId) {
        console.log("No teacherId found yet...");
        return;
      }

      try {
        setLoading(true);
        const result = await api.timetable.getByTeacher(effectiveTeacherId);
        console.log("API Result in Component:", result);

        if (result && result.data && result.data.weeklySchedule) {
          setSchedule(result.data.weeklySchedule);
        } else {
          setSchedule({}); 
        }
      } catch (error) {
        toast.error("Failed to load schedule");
      } finally {
        setLoading(false);
      }
    };

    fetchTimetable();
  }, [user?.teacherId]);

  const days = schedule ? Object.keys(schedule) : [];
  const totalClasses = days.reduce((acc, day) => acc + (schedule[day]?.length || 0), 0);

  if (loading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-foreground">{t('myClasses')}</h1>
          <p className="text-muted-foreground">{t('myClassesDesc')}</p>
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
              {totalClasses} {t('classesThisWeek')}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {days.map((day) => (
              <div key={day} className="border border-border rounded-lg overflow-hidden">
                <div className="bg-indigo-50 dark:bg-indigo-900/20 px-4 py-3 border-b border-border">
                  <h3 className="font-semibold text-foreground">{t(day.toLowerCase())}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {schedule[day]?.length || 0} {(schedule[day]?.length || 0) === 1 ? t('classScheduled') : t('classesScheduled')}
                  </p>
                </div>
                <div className="p-4 bg-card">
                  {schedule[day] && schedule[day].length > 0 ? (
                    <div className="space-y-3">
                      {schedule[day].map((slot, slotIdx) => (
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
                              <span className="text-sm font-semibold text-foreground">{slot.className}</span>
                            </div>
                            <div className="flex items-center gap-2 min-w-[140px]">
                              <BookOpen className="h-4 w-4 text-green-500" />
                              <span className="text-sm text-muted-foreground">{slot.subjectName}</span>
                            </div>
                            <div className="flex items-center gap-2 min-w-[100px]">
                              <div className="h-3 w-3 bg-purple-500 rounded"></div>
                              <span className="text-sm text-muted-foreground">{slot.room}</span>
                            </div>
                          </div>

                          <div className="flex gap-2 flex-wrap">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => navigate(`/teacher/class-details?className=${slot.className}`)}
                            >
                              <Eye className="h-3.5 w-3.5 mr-1" /> {t('viewClassDetails')}
                            </Button>
                            <Button
                              size="sm"
                              variant="default"
                              onClick={() => navigate(`/teacher/attendance/method-selection?className=${slot.className}`)}
                            >
                              <ClipboardCheck className="h-3.5 w-3.5 mr-1" /> {t('takeAttendance')}
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