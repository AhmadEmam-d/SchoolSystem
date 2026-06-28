import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Clock, MapPin, User } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { api } from '../../lib/api';

export function ParentSchedule() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const [selectedDay,   setSelectedDay]   = useState('');
  const [children,      setChildren]      = useState([]);
  const [schedules,     setSchedules]     = useState({});
  const [loading,       setLoading]       = useState(true);
  const [childLoading,  setChildLoading]  = useState({});

  // ─── 1. جلب الأولاد ───────────────────────────────────────────────────────
  useEffect(() => {
    const init = async () => {
      try {
        const data = await api.parents.getChildrenDashboard();
        const list = data?.children ?? [];
        setChildren(list);
        if (list.length > 0) {
          await loadSchedule(list[0].studentOid);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  // ─── 2. جلب جدول طالب ────────────────────────────────────────────────────
  const loadSchedule = async (studentOid) => {
    if (!studentOid || schedules[studentOid]) return;
    setChildLoading(prev => ({ ...prev, [studentOid]: true }));
    try {
      const sched = await api.parents.getChildSchedule(studentOid);
      setSchedules(prev => ({ ...prev, [studentOid]: sched }));
      if (sched?.weeklySchedule?.length > 0) {
        setSelectedDay(sched.weeklySchedule[0].dayName);
      }
    } catch (err) {
      console.error('Failed to load schedule for', studentOid, err);
    } finally {
      setChildLoading(prev => ({ ...prev, [studentOid]: false }));
    }
  };

  const formatTime = (time) => time?.substring(0, 5) ?? '—';

  const getClassTypeColor = () => 'border-l-4 border-l-indigo-500 bg-card';
  const getClassBadgeColor = () => 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400';

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );
  }

  if (children.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">{t('noChildrenFound', 'No children found.')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-foreground">{t('classSchedules')}</h1>
          <p className="text-muted-foreground">{t('viewWeeklyTimetablesChildren')}</p>
        </div>
      </div>

      <Tabs
        defaultValue={children[0]?.studentOid}
        className="space-y-6"
        onValueChange={(id) => loadSchedule(id)}
      >
        <TabsList>
          {children.map((child, idx) => (
            <TabsTrigger
              key={`tab-${child.studentOid}-${idx}`}
              value={child.studentOid}
            >
              {child.studentName}
            </TabsTrigger>
          ))}
        </TabsList>

        {children.map((child, idx) => {
          const sched      = schedules[child.studentOid];
          const isLoading  = childLoading[child.studentOid];
          const weekly     = sched?.weeklySchedule ?? [];
          const daysOfWeek = weekly.map(d => d.dayName);
          const activeDay  = daysOfWeek.includes(selectedDay) ? selectedDay : daysOfWeek[0] ?? '';
          const dayObj     = weekly.find(d => d.dayName === activeDay);
          const dayClasses = dayObj?.classes ?? [];

          return (
            <TabsContent
              key={`content-${child.studentOid}-${idx}`}
              value={child.studentOid}
              className="space-y-6"
            >
              {/* Student Info Banner */}
              <Card className="border-none shadow-md bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold">
                      {child.studentName?.[0]?.toUpperCase() ?? <User className="h-8 w-8 text-white" />}
                    </div>
                    <div className="space-y-1">
                      <h2 className="text-2xl font-bold">{child.studentName}</h2>
                      <p className="text-indigo-100">{child.gradeLevel}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {isLoading ? (
                <div className="flex items-center justify-center h-48">
                  <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-indigo-600" />
                </div>
              ) : !sched ? (
                <div className="flex items-center justify-center h-48">
                  <p className="text-muted-foreground">{t('noScheduleFound', 'No schedule available.')}</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

                  {/* Day Selector */}
                  <Card className="border-none shadow-md lg:col-span-1">
                    <CardHeader className="border-b border-border bg-muted/50">
                      <CardTitle className="text-base">{t('schedule')}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        {weekly.map(day => (
                          <button
                            key={day.dayName}
                            onClick={() => setSelectedDay(day.dayName)}
                            className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                              activeDay === day.dayName
                                ? 'bg-indigo-600 text-white shadow-md'
                                : 'bg-muted/50 text-foreground hover:bg-muted'
                            }`}
                          >
                            <div className="font-medium">
                              {isRTL ? day.dayNameAr : day.dayName}
                            </div>
                            <div className={`text-xs mt-0.5 ${
                              activeDay === day.dayName ? 'text-indigo-100' : 'text-muted-foreground'
                            }`}>
                              {day.classes.length} {t('classesCountLabel')}
                            </div>
                          </button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Schedule View */}
                  <div className="lg:col-span-3 space-y-4">
                    <Card className="border-none shadow-md">
                      <CardHeader className="border-b border-border bg-muted/50">
                        <CardTitle>{isRTL ? dayObj?.dayNameAr : activeDay}</CardTitle>
                        <CardDescription>
                          {dayClasses.length} {t('classesCountLabel')}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="space-y-3">
                          {dayClasses.length === 0 ? (
                            <p className="text-center py-8 text-muted-foreground text-sm">
                              {t('noClassesDay', 'No classes this day.')}
                            </p>
                          ) : (
                            dayClasses.map((cls, i) => (
                              <div
                                key={i}
                                className={`p-4 rounded-lg ${getClassTypeColor()} shadow-sm hover:shadow-md transition-shadow`}
                              >
                                <div className="flex items-start justify-between gap-4">
                                  <div className="flex-1 space-y-3">
                                    <div className="flex items-start justify-between">
                                      <h3 className="font-semibold text-foreground capitalize">
                                        {isRTL ? cls.subjectNameAr : cls.subjectName}
                                      </h3>
                                      <Badge className={getClassBadgeColor()}>
                                        {cls.period}
                                      </Badge>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Clock className="h-4 w-4 flex-shrink-0" />
                                        <span>{formatTime(cls.startTime)} – {formatTime(cls.endTime)}</span>
                                      </div>
                                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <User className="h-4 w-4 flex-shrink-0" />
                                        <span>{cls.teacherName}</span>
                                      </div>
                                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <MapPin className="h-4 w-4 flex-shrink-0" />
                                        <span>{cls.roomNumber}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Weekly Overview */}
                    <Card className="border-none shadow-md">
                      <CardHeader className="border-b border-border bg-muted/50">
                        <CardTitle className="text-base">{t('myWeeklySchedule')}</CardTitle>
                        <CardDescription>{t('yourTeachingSchedule')}</CardDescription>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="grid grid-cols-5 gap-4">
                          {weekly.map(day => (
                            <div key={day.dayName} className="text-center space-y-2">
                              <div
                                className={`font-medium text-sm cursor-pointer ${
                                  activeDay === day.dayName
                                    ? 'text-indigo-600 dark:text-indigo-400'
                                    : 'text-muted-foreground'
                                }`}
                                onClick={() => setSelectedDay(day.dayName)}
                              >
                                {(isRTL ? day.dayNameAr : day.dayName).substring(0, 3)}
                              </div>
                              <div className="space-y-1">
                                {day.classes.slice(0, 5).map((cls, i) => (
                                  <div
                                    key={i}
                                    className="text-xs p-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 rounded truncate"
                                    title={cls.subjectName}
                                  >
                                    {cls.subjectName.length > 10
                                      ? cls.subjectName.substring(0, 10) + '...'
                                      : cls.subjectName}
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}