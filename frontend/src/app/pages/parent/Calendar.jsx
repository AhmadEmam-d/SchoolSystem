import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, MapPin, User, Filter } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';

export function ParentCalendar() {
  const { t } = useTranslation();
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 2, 1));
  const [selectedFilter, setSelectedFilter] = useState('all');

  const events = [
    { id: '1', title: 'Math Mid-Term Exam', date: '2026-03-15', time: '09:00 AM', type: 'exam', student: 'Bart Simpson', location: 'Room 204', description: 'Algebra and Geometry' },
    { id: '2', title: 'Science Project Due', date: '2026-03-18', time: '11:30 AM', type: 'assignment', student: 'Bart Simpson', location: 'Science Lab', description: 'Renewable Energy Project' },
    { id: '3', title: 'Parent-Teacher Meeting', date: '2026-03-22', time: '02:00 PM', type: 'meeting', student: 'Bart Simpson', location: 'Main Office', description: 'Quarterly Progress Review' },
    { id: '4', title: 'Science Fair Competition', date: '2026-03-12', time: '10:00 AM', type: 'event', student: 'Lisa Simpson', location: 'Auditorium', description: 'Regional Science Fair' },
    { id: '5', title: 'Advanced Math Exam', date: '2026-03-20', time: '09:00 AM', type: 'exam', student: 'Lisa Simpson', location: 'Room 301', description: 'Calculus Final' },
    { id: '6', title: 'Spring Break', date: '2026-03-25', time: 'All Day', type: 'holiday', student: 'All Students', description: 'School Holiday - No Classes' },
    { id: '7', title: 'English Essay Due', date: '2026-03-10', time: '03:00 PM', type: 'assignment', student: 'Lisa Simpson', location: 'Submit Online', description: 'Shakespeare Analysis' },
    { id: '8', title: 'History Quiz', date: '2026-03-08', time: '10:30 AM', type: 'exam', student: 'Bart Simpson', location: 'Room 105', description: 'World War II' },
  ];

  const getEventTypeColor = (type) => {
    switch (type) {
      case 'exam': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'assignment': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'meeting': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      case 'event': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'holiday': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getCalendarDotColor = (type) => {
    switch (type) {
      case 'exam': return 'bg-red-500';
      case 'assignment': return 'bg-blue-500';
      case 'meeting': return 'bg-purple-500';
      case 'event': return 'bg-green-500';
      case 'holiday': return 'bg-orange-500';
      default: return 'bg-muted-foreground';
    }
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    return { daysInMonth, startingDayOfWeek };
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth);

  const monthNames = [
    t('january'), t('february'), t('march'), t('april'), t('may'), t('june'),
    t('july'), t('august'), t('september'), t('october'), t('november'), t('december')
  ];

  const dayNames = [
    t('sunday').substring(0,3), t('monday').substring(0,3), t('tuesday').substring(0,3),
    t('wednesday').substring(0,3), t('thursday').substring(0,3), t('friday').substring(0,3),
    t('saturday').substring(0,3)
  ];

  const getEventsForDay = (day) => {
    const dateString = `2026-03-${day.toString().padStart(2, '0')}`;
    return events.filter(event => event.date === dateString);
  };

  const navigateMonth = (direction) => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const filteredEvents = selectedFilter === 'all'
    ? events
    : events.filter(e => e.student === selectedFilter);

  const upcomingEvents = filteredEvents
    .filter(e => new Date(e.date) >= new Date('2026-03-01'))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-foreground">{t('academicCalendar')}</h1>
          <p className="text-muted-foreground">{t('academicCalendarDesc')}</p>
        </div>
        <div className="flex items-center gap-3">
          <Filter className="h-5 w-5 text-muted-foreground" />
          <Select value={selectedFilter} onValueChange={setSelectedFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t('filterByChild')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('allChildren')}</SelectItem>
              <SelectItem value="Bart Simpson">Bart Simpson</SelectItem>
              <SelectItem value="Lisa Simpson">Lisa Simpson</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar View */}
        <div className="lg:col-span-2">
          <Card className="border-none shadow-md">
            <CardHeader className="border-b border-border bg-muted/50">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">
                  {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => navigateMonth('next')}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {/* Day Names */}
              <div className="grid grid-cols-7 gap-2 mb-4">
                {dayNames.map(day => (
                  <div key={day} className="text-center text-sm font-semibold text-muted-foreground py-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: startingDayOfWeek }).map((_, idx) => (
                  <div key={`empty-${idx}`} className="aspect-square" />
                ))}

                {Array.from({ length: daysInMonth }).map((_, idx) => {
                  const day = idx + 1;
                  const dayEvents = getEventsForDay(day);
                  const isToday = day === 18;

                  return (
                    <div
                      key={day}
                      className={`aspect-square border rounded-lg p-1.5 transition-colors ${
                        isToday
                          ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                          : 'border-border hover:bg-muted/50'
                      }`}
                    >
                      <div className={`text-sm font-medium mb-1 ${
                        isToday ? 'text-indigo-600 dark:text-indigo-400' : 'text-foreground'
                      }`}>
                        {day}
                      </div>
                      <div className="space-y-0.5">
                        {dayEvents.slice(0, 2).map(event => (
                          <div
                            key={event.id}
                            className={`text-xs px-1 py-0.5 rounded truncate ${getEventTypeColor(event.type)}`}
                            title={event.title}
                          >
                            {event.title}
                          </div>
                        ))}
                        {dayEvents.length > 2 && (
                          <div className="text-xs text-muted-foreground px-1">
                            +{dayEvents.length - 2} {t('moreEvents')}
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

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Upcoming Events */}
          <Card className="border-none shadow-md">
            <CardHeader className="border-b border-border bg-muted/50">
              <CardTitle>{t('upcomingEventsTitle')}</CardTitle>
              <CardDescription>{t('next5Events')}</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {upcomingEvents.map(event => (
                  <div key={event.id} className="space-y-2 pb-4 border-b border-border last:border-b-0 last:pb-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-medium text-foreground text-sm">{event.title}</h4>
                      <Badge className={getEventTypeColor(event.type)} variant="outline">
                        {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                      </Badge>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CalendarIcon className="h-4 w-4 flex-shrink-0" />
                        <span>{new Date(event.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}</span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4 flex-shrink-0" />
                        <span>{event.time}</span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <User className="h-4 w-4 flex-shrink-0" />
                        <span>{event.student}</span>
                      </div>

                      {event.location && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4 flex-shrink-0" />
                          <span>{event.location}</span>
                        </div>
                      )}
                    </div>

                    {event.description && (
                      <p className="text-sm text-muted-foreground">{event.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Event Type Legend */}
          <Card className="border-none shadow-md">
            <CardHeader className="border-b border-border bg-muted/50">
              <CardTitle className="text-base">{t('eventTypesLegend')}</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                {[
                  { color: 'bg-red-500', label: 'Exams' },
                  { color: 'bg-blue-500', label: 'Assignments' },
                  { color: 'bg-purple-500', label: 'Meetings' },
                  { color: 'bg-green-500', label: 'Events' },
                  { color: 'bg-orange-500', label: 'Holidays' },
                ].map(({ color, label }) => (
                  <div key={label} className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded ${color} flex-shrink-0`}></div>
                    <span className="text-sm text-foreground">{label}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}