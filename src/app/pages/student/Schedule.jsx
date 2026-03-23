import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, Clock, MapPin, User, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { format, addDays, startOfWeek } from 'date-fns';

export function StudentSchedule() {
  const { t } = useTranslation();
  const [currentWeek, setCurrentWeek] = useState(new Date());

  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 5 }, (_, i) => addDays(weekStart, i));

  const schedule = [
    { id: '1', day: 'Monday', time: '8:00 AM', subject: 'Mathematics', teacher: 'John Nash', room: 'Room 101', duration: '1 hour' },
    { id: '2', day: 'Monday', time: '9:30 AM', subject: 'Science', teacher: 'Marie Curie', room: 'Lab 1', duration: '1.5 hours' },
    { id: '3', day: 'Monday', time: '12:00 PM', subject: 'English', teacher: 'Shakespeare', room: 'Room 205', duration: '1 hour' },
    { id: '4', day: 'Monday', time: '2:00 PM', subject: 'History', teacher: 'Herodotus', room: 'Room 303', duration: '1 hour' },
    
    { id: '5', day: 'Tuesday', time: '8:00 AM', subject: 'Science', teacher: 'Marie Curie', room: 'Lab 1', duration: '1.5 hours' },
    { id: '6', day: 'Tuesday', time: '10:00 AM', subject: 'Mathematics', teacher: 'John Nash', room: 'Room 101', duration: '1 hour' },
    { id: '7', day: 'Tuesday', time: '1:00 PM', subject: 'Art', teacher: 'Da Vinci', room: 'Art Studio', duration: '2 hours' },
    
    { id: '8', day: 'Wednesday', time: '8:00 AM', subject: 'English', teacher: 'Shakespeare', room: 'Room 205', duration: '1 hour' },
    { id: '9', day: 'Wednesday', time: '9:30 AM', subject: 'History', teacher: 'Herodotus', room: 'Room 303', duration: '1 hour' },
    { id: '10', day: 'Wednesday', time: '11:00 AM', subject: 'Mathematics', teacher: 'John Nash', room: 'Room 101', duration: '1 hour' },
    { id: '11', day: 'Wednesday', time: '2:00 PM', subject: 'Physical Education', teacher: 'Coach Smith', room: 'Gym', duration: '1 hour' },
    
    { id: '12', day: 'Thursday', time: '8:00 AM', subject: 'Science', teacher: 'Marie Curie', room: 'Lab 1', duration: '1.5 hours' },
    { id: '13', day: 'Thursday', time: '10:00 AM', subject: 'English', teacher: 'Shakespeare', room: 'Room 205', duration: '1 hour' },
    { id: '14', day: 'Thursday', time: '1:00 PM', subject: 'Mathematics', teacher: 'John Nash', room: 'Room 101', duration: '1 hour' },
    
    { id: '15', day: 'Friday', time: '8:00 AM', subject: 'History', teacher: 'Herodotus', room: 'Room 303', duration: '1 hour' },
    { id: '16', day: 'Friday', time: '10:00 AM', subject: 'Art', teacher: 'Da Vinci', room: 'Art Studio', duration: '2 hours' },
    { id: '17', day: 'Friday', time: '1:00 PM', subject: 'Science', teacher: 'Marie Curie', room: 'Lab 1', duration: '1 hour' },
  ];

  const getSubjectColor = (subject) => {
    const colors = {
      'Mathematics': 'bg-blue-100 text-blue-800 border-blue-200',
      'Science': 'bg-green-100 text-green-800 border-green-200',
      'English': 'bg-purple-100 text-purple-800 border-purple-200',
      'History': 'bg-orange-100 text-orange-800 border-orange-200',
      'Art': 'bg-pink-100 text-pink-800 border-pink-200',
      'Physical Education': 'bg-red-100 text-red-800 border-red-200',
    };
    return colors[subject] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getScheduleForDay = (day) => {
    return schedule.filter(item => item.day === day).sort((a, b) => 
      a.time.localeCompare(b.time)
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('myScheduleTitle')}</h1>
          <p className="text-gray-500 mt-1">{t('viewWeeklyTimetable')}</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentWeek(addDays(currentWeek, -7))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="text-sm font-medium text-gray-700 min-w-[200px] text-center">
            {format(weekDays[0], 'MMM d')} - {format(weekDays[4], 'MMM d, yyyy')}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentWeek(addDays(currentWeek, 7))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Weekly Summary */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {weekDays.map((date, index) => {
          const dayName = format(date, 'EEEE');
          const daySchedule = getScheduleForDay(dayName);
          const isToday = format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
          
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
                  {daySchedule.length} {t('classesCountLabel')}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Detailed Schedule */}
      <Card className="border-none shadow-md">
        <CardHeader className="border-b bg-gray-50">
          <CardTitle>{t('weeklyTimetable')}</CardTitle>
          <CardDescription>{t('completeScheduleDesc')}</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="grid grid-cols-1 lg:grid-cols-5 divide-x">
            {weekDays.map((date, index) => {
              const dayName = format(date, 'EEEE');
              const daySchedule = getScheduleForDay(dayName);
              const isToday = format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
              
              return (
                <div key={index} className={`p-4 ${isToday ? 'bg-indigo-50' : ''}`}>
                  <div className="mb-4 pb-3 border-b">
                    <h3 className={`font-semibold ${isToday ? 'text-indigo-600' : 'text-gray-900'}`}>
                      {format(date, 'EEEE')}
                    </h3>
                    <p className="text-sm text-gray-500">{format(date, 'MMM d')}</p>
                  </div>
                  
                  <div className="space-y-3">
                    {daySchedule.map((item) => (
                      <div
                        key={item.id}
                        className={`p-3 rounded-lg border-l-4 ${getSubjectColor(item.subject)}`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="h-3 w-3" />
                          <span className="text-xs font-medium">{item.time}</span>
                        </div>
                        <h4 className="font-medium text-sm mb-2">{item.subject}</h4>
                        <div className="space-y-1 text-xs">
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            <span>{item.teacher}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            <span>{item.room}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                    {daySchedule.length === 0 && (
                      <div className="text-center py-8 text-gray-400 text-sm">
                        {t('noClassesScheduledShort')}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
