import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Clock, MapPin, User, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { format, addDays, startOfWeek } from 'date-fns';
import { api } from '../../lib/api';

// ─── Main Component ────────────────────────────────────────────────────────────
export function StudentSchedule() {
  const { t } = useTranslation();
  const [currentWeek, setCurrentWeek]       = useState(new Date());
  const [weeklyTimetable, setWeeklyTimetable] = useState([]);
  const [loading, setLoading]               = useState(false);
  const [error, setError]                   = useState(null);

  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 0 });
  const weekDays  = Array.from({ length: 5 }, (_, i) => addDays(weekStart, i));

  useEffect(() => {
    const fetchSchedule = async () => {
      setLoading(true);
      setError(null);
      try {
        const localDate = weekStart.toLocaleDateString('en-CA');
        const result    = await api.timetable.getStudentWeeklySchedule(localDate);

        if (result.ok && result.data) {
          const allDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];
          const timetable = result.data.weeklyTimetable || [];
          const completeTimetable = allDays.map(dayName => {
            const existingDay = timetable.find(d => d.dayName === dayName);
            if (existingDay) return existingDay;
            return {
              dayName,
              date: format(weekDays[allDays.indexOf(dayName)], 'yyyy-MM-dd'),
              lessons: [],
            };
          });
          setWeeklyTimetable(completeTimetable);
        } else {
          setError('Failed to load schedule');
          setWeeklyTimetable([]);
        }
      } catch (err) {
        setError(err.message);
        setWeeklyTimetable([]);
      } finally {
        setLoading(false);
      }
    };
    fetchSchedule();
  }, [currentWeek]);

  const getSubjectColor = (subject) => {
    const colors = {
      'Mathematics':        'bg-blue-100 text-blue-800 border-blue-200',
      'math':               'bg-blue-100 text-blue-800 border-blue-200',
      'Science':            'bg-green-100 text-green-800 border-green-200',
      'English':            'bg-purple-100 text-purple-800 border-purple-200',
      'History':            'bg-orange-100 text-orange-800 border-orange-200',
      'Art':                'bg-pink-100 text-pink-800 border-pink-200',
      'Physical Education': 'bg-red-100 text-red-800 border-red-200',
      'Chemistry':          'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Biology':            'bg-teal-100 text-teal-800 border-teal-200',
      'arabic':             'bg-rose-100 text-rose-800 border-rose-200',
    };
    return colors[subject] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getLessonsForDay = (dayName) =>
    weeklyTimetable.find(d => d.dayName?.toLowerCase() === dayName.toLowerCase())?.lessons || [];

  const getDayData = (dayName) =>
    weeklyTimetable.find(d => d.dayName?.toLowerCase() === dayName.toLowerCase());

  const todayStr = format(new Date(), 'yyyy-MM-dd');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('MyScheduleTitle')}</h1>
          <p className="text-gray-500 mt-1">{t('ViewWeeklyTimetable')}</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => setCurrentWeek(addDays(currentWeek, -7))}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="text-sm font-medium text-gray-700 min-w-[200px] text-center">
            {format(weekDays[0], 'MMM d')} – {format(weekDays[4], 'MMM d, yyyy')}
          </div>
          <Button variant="outline" size="sm" onClick={() => setCurrentWeek(addDays(currentWeek, 7))}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Weekly Summary */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {weekDays.map((date, index) => {
          const dayName = format(date, 'EEEE');
          const lessons = getLessonsForDay(dayName);
          const isToday = format(date, 'yyyy-MM-dd') === todayStr;
          return (
            <Card key={index} className={`border-none shadow-md ${isToday ? 'ring-2 ring-indigo-600' : ''}`}>
              <CardContent className="p-4 text-center">
                <div className={`text-sm font-medium ${isToday ? 'text-indigo-600' : 'text-gray-500'}`}>
                  {format(date, 'EEE')}
                </div>
                <div className={`text-2xl font-bold mt-1 ${isToday ? 'text-indigo-600' : 'text-gray-900'}`}>
                  {format(date, 'd')}
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  {loading ? '...' : `${lessons.length} ${t('classesCountLabel')}`}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Detailed Schedule */}
      <Card className="border-none shadow-md">
        <CardHeader className="border-b bg-gray-50">
          <CardTitle>{t('WeeklyTimetable')}</CardTitle>
          <CardDescription>{t('completeScheduleDesc')}</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-20 text-gray-400">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-5 divide-x">
              {weekDays.map((date, index) => {
                const dayName = format(date, 'EEEE');
                const dayData = getDayData(dayName);
                const lessons = dayData?.lessons || [];
                const isToday = format(date, 'yyyy-MM-dd') === todayStr;

                return (
                  <div key={index} className={`p-4 ${isToday ? 'bg-indigo-50' : ''}`}>
                    <div className="mb-4 pb-3 border-b">
                      <h3 className={`font-semibold ${isToday ? 'text-indigo-600' : 'text-gray-900'}`}>
                        {dayName}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {dayData?.date || format(date, 'MMM d')}
                      </p>
                    </div>

                    <div className="space-y-3">
                      {lessons.map((lesson, i) => (
                        <div
                          key={i}
                          className={`p-3 rounded-lg border-l-4 ${getSubjectColor(lesson.subjectName)}`}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <Clock className="h-3 w-3" />
                            <span className="text-xs font-medium">{lesson.time}</span>
                          </div>
                          <h4 className="font-medium text-sm mb-2">{lesson.subjectName}</h4>
                          <div className="space-y-1 text-xs">
                            <div className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              <span>{lesson.teacherName}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              <span>{lesson.room}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                      {lessons.length === 0 && (
                        <div className="text-center py-8 text-gray-400 text-sm">
                          {t('noClassesScheduledShort')}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}