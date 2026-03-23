import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Clock, MapPin, User, BookOpen } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';

export function ParentSchedule() {
  const { t } = useTranslation();
  const [selectedDay, setSelectedDay] = useState('Monday');

  const studentSchedules = [
    {
      id: 's1',
      name: 'Bart Simpson',
      grade: '10th Grade',
      schedule: {
        Monday: [
          { time: '08:00 - 08:50', subject: 'Mathematics', teacher: 'Mr. Anderson', room: 'Room 204' },
          { time: '09:00 - 09:50', subject: 'English', teacher: 'Mrs. Johnson', room: 'Room 112' },
          { time: '10:00 - 10:50', subject: 'Physical Education', teacher: 'Coach Smith', room: 'Gymnasium', type: 'activity' },
          { time: '11:00 - 11:50', subject: 'Science', teacher: 'Dr. Brown', room: 'Lab 301' },
          { time: '12:00 - 12:50', subject: 'Lunch Break', teacher: '-', room: 'Cafeteria', type: 'break' },
          { time: '13:00 - 13:50', subject: 'History', teacher: 'Mr. Williams', room: 'Room 105' },
          { time: '14:00 - 14:50', subject: 'Art', teacher: 'Ms. Davis', room: 'Art Studio', type: 'activity' },
        ],
        Tuesday: [
          { time: '08:00 - 08:50', subject: 'Science', teacher: 'Dr. Brown', room: 'Lab 301' },
          { time: '09:00 - 09:50', subject: 'Mathematics', teacher: 'Mr. Anderson', room: 'Room 204' },
          { time: '10:00 - 10:50', subject: 'English', teacher: 'Mrs. Johnson', room: 'Room 112' },
          { time: '11:00 - 11:50', subject: 'Computer Science', teacher: 'Mr. Garcia', room: 'Computer Lab' },
          { time: '12:00 - 12:50', subject: 'Lunch Break', teacher: '-', room: 'Cafeteria', type: 'break' },
          { time: '13:00 - 13:50', subject: 'Geography', teacher: 'Mrs. Martinez', room: 'Room 208' },
          { time: '14:00 - 14:50', subject: 'Music', teacher: 'Mr. Thompson', room: 'Music Room', type: 'activity' },
        ],
        Wednesday: [
          { time: '08:00 - 08:50', subject: 'English', teacher: 'Mrs. Johnson', room: 'Room 112' },
          { time: '09:00 - 09:50', subject: 'History', teacher: 'Mr. Williams', room: 'Room 105' },
          { time: '10:00 - 10:50', subject: 'Mathematics', teacher: 'Mr. Anderson', room: 'Room 204' },
          { time: '11:00 - 11:50', subject: 'Chemistry', teacher: 'Dr. Lee', room: 'Lab 302' },
          { time: '12:00 - 12:50', subject: 'Lunch Break', teacher: '-', room: 'Cafeteria', type: 'break' },
          { time: '13:00 - 13:50', subject: 'Physical Education', teacher: 'Coach Smith', room: 'Gymnasium', type: 'activity' },
          { time: '14:00 - 14:50', subject: 'Study Hall', teacher: 'Various', room: 'Library', type: 'activity' },
        ],
        Thursday: [
          { time: '08:00 - 08:50', subject: 'Mathematics', teacher: 'Mr. Anderson', room: 'Room 204' },
          { time: '09:00 - 09:50', subject: 'Science', teacher: 'Dr. Brown', room: 'Lab 301' },
          { time: '10:00 - 10:50', subject: 'Computer Science', teacher: 'Mr. Garcia', room: 'Computer Lab' },
          { time: '11:00 - 11:50', subject: 'English', teacher: 'Mrs. Johnson', room: 'Room 112' },
          { time: '12:00 - 12:50', subject: 'Lunch Break', teacher: '-', room: 'Cafeteria', type: 'break' },
          { time: '13:00 - 13:50', subject: 'Art', teacher: 'Ms. Davis', room: 'Art Studio', type: 'activity' },
          { time: '14:00 - 14:50', subject: 'Geography', teacher: 'Mrs. Martinez', room: 'Room 208' },
        ],
        Friday: [
          { time: '08:00 - 08:50', subject: 'English', teacher: 'Mrs. Johnson', room: 'Room 112' },
          { time: '09:00 - 09:50', subject: 'Mathematics', teacher: 'Mr. Anderson', room: 'Room 204' },
          { time: '10:00 - 10:50', subject: 'History', teacher: 'Mr. Williams', room: 'Room 105' },
          { time: '11:00 - 11:50', subject: 'Science', teacher: 'Dr. Brown', room: 'Lab 301' },
          { time: '12:00 - 12:50', subject: 'Lunch Break', teacher: '-', room: 'Cafeteria', type: 'break' },
          { time: '13:00 - 13:50', subject: 'Physical Education', teacher: 'Coach Smith', room: 'Gymnasium', type: 'activity' },
          { time: '14:00 - 14:50', subject: 'Assembly', teacher: 'All Staff', room: 'Auditorium', type: 'activity' },
        ],
      },
    },
    {
      id: 's3',
      name: 'Lisa Simpson',
      grade: '8th Grade',
      schedule: {
        Monday: [
          { time: '08:00 - 08:50', subject: 'Advanced Mathematics', teacher: 'Dr. Peterson', room: 'Room 301' },
          { time: '09:00 - 09:50', subject: 'English Literature', teacher: 'Mrs. Clarke', room: 'Room 215' },
          { time: '10:00 - 10:50', subject: 'Science Honors', teacher: 'Dr. Wilson', room: 'Lab 401' },
          { time: '11:00 - 11:50', subject: 'French', teacher: 'Mme. Dubois', room: 'Room 118' },
          { time: '12:00 - 12:50', subject: 'Lunch Break', teacher: '-', room: 'Cafeteria', type: 'break' },
          { time: '13:00 - 13:50', subject: 'Music Theory', teacher: 'Mr. Thompson', room: 'Music Room', type: 'activity' },
          { time: '14:00 - 14:50', subject: 'Social Studies', teacher: 'Mr. Harris', room: 'Room 203' },
        ],
        Tuesday: [
          { time: '08:00 - 08:50', subject: 'Science Honors', teacher: 'Dr. Wilson', room: 'Lab 401' },
          { time: '09:00 - 09:50', subject: 'Advanced Mathematics', teacher: 'Dr. Peterson', room: 'Room 301' },
          { time: '10:00 - 10:50', subject: 'Physical Education', teacher: 'Coach Martinez', room: 'Gymnasium', type: 'activity' },
          { time: '11:00 - 11:50', subject: 'English Literature', teacher: 'Mrs. Clarke', room: 'Room 215' },
          { time: '12:00 - 12:50', subject: 'Lunch Break', teacher: '-', room: 'Cafeteria', type: 'break' },
          { time: '13:00 - 13:50', subject: 'Art', teacher: 'Ms. Davis', room: 'Art Studio', type: 'activity' },
          { time: '14:00 - 14:50', subject: 'Computer Programming', teacher: 'Mr. Chen', room: 'Computer Lab' },
        ],
        Wednesday: [
          { time: '08:00 - 08:50', subject: 'English Literature', teacher: 'Mrs. Clarke', room: 'Room 215' },
          { time: '09:00 - 09:50', subject: 'French', teacher: 'Mme. Dubois', room: 'Room 118' },
          { time: '10:00 - 10:50', subject: 'Advanced Mathematics', teacher: 'Dr. Peterson', room: 'Room 301' },
          { time: '11:00 - 11:50', subject: 'Biology', teacher: 'Dr. Green', room: 'Lab 402' },
          { time: '12:00 - 12:50', subject: 'Lunch Break', teacher: '-', room: 'Cafeteria', type: 'break' },
          { time: '13:00 - 13:50', subject: 'Music Performance', teacher: 'Mr. Thompson', room: 'Music Room', type: 'activity' },
          { time: '14:00 - 14:50', subject: 'Study Hall', teacher: 'Various', room: 'Library', type: 'activity' },
        ],
        Thursday: [
          { time: '08:00 - 08:50', subject: 'Advanced Mathematics', teacher: 'Dr. Peterson', room: 'Room 301' },
          { time: '09:00 - 09:50', subject: 'Science Honors', teacher: 'Dr. Wilson', room: 'Lab 401' },
          { time: '10:00 - 10:50', subject: 'Social Studies', teacher: 'Mr. Harris', room: 'Room 203' },
          { time: '11:00 - 11:50', subject: 'English Literature', teacher: 'Mrs. Clarke', room: 'Room 215' },
          { time: '12:00 - 12:50', subject: 'Lunch Break', teacher: '-', room: 'Cafeteria', type: 'break' },
          { time: '13:00 - 13:50', subject: 'Computer Programming', teacher: 'Mr. Chen', room: 'Computer Lab' },
          { time: '14:00 - 14:50', subject: 'Chess Club', teacher: 'Mr. Rodriguez', room: 'Room 110', type: 'activity' },
        ],
        Friday: [
          { time: '08:00 - 08:50', subject: 'English Literature', teacher: 'Mrs. Clarke', room: 'Room 215' },
          { time: '09:00 - 09:50', subject: 'Advanced Mathematics', teacher: 'Dr. Peterson', room: 'Room 301' },
          { time: '10:00 - 10:50', subject: 'French', teacher: 'Mme. Dubois', room: 'Room 118' },
          { time: '11:00 - 11:50', subject: 'Science Honors', teacher: 'Dr. Wilson', room: 'Lab 401' },
          { time: '12:00 - 12:50', subject: 'Lunch Break', teacher: '-', room: 'Cafeteria', type: 'break' },
          { time: '13:00 - 13:50', subject: 'Physical Education', teacher: 'Coach Martinez', room: 'Gymnasium', type: 'activity' },
          { time: '14:00 - 14:50', subject: 'Assembly', teacher: 'All Staff', room: 'Auditorium', type: 'activity' },
        ],
      },
    },
  ];

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  const getClassTypeColor = (type) => {
    switch (type) {
      case 'activity': return 'border-l-4 border-l-green-500 bg-green-50 dark:bg-green-900/10';
      case 'break': return 'border-l-4 border-l-orange-500 bg-orange-50 dark:bg-orange-900/10';
      default: return 'border-l-4 border-l-indigo-500 bg-card';
    }
  };

  const getClassBadgeColor = (type) => {
    switch (type) {
      case 'activity': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'break': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
      default: return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-foreground">{t('classSchedules')}</h1>
          <p className="text-muted-foreground">{t('viewWeeklyTimetablesChildren')}</p>
        </div>
      </div>

      <Tabs defaultValue={studentSchedules[0].id} className="space-y-6">
        <TabsList>
          {studentSchedules.map(student => (
            <TabsTrigger key={student.id} value={student.id}>
              {student.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {studentSchedules.map(student => (
          <TabsContent key={student.id} value={student.id} className="space-y-6">
            {/* Student Info Banner */}
            <Card className="border-none shadow-md bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-full bg-white/20 flex items-center justify-center">
                    <User className="h-8 w-8 text-white" />
                  </div>
                  <div className="space-y-1">
                    <h2 className="text-2xl font-bold">{student.name}</h2>
                    <p className="text-indigo-100">{student.grade}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Day Selector */}
              <Card className="border-none shadow-md lg:col-span-1">
                <CardHeader className="border-b border-border bg-muted/50">
                  <CardTitle className="text-base">{t('schedule')}</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    {daysOfWeek.map(day => (
                      <button
                        key={day}
                        onClick={() => setSelectedDay(day)}
                        className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                          selectedDay === day
                            ? 'bg-indigo-600 text-white shadow-md'
                            : 'bg-muted/50 text-foreground hover:bg-muted'
                        }`}
                      >
                        <div className="font-medium">{t(day.toLowerCase())}</div>
                        <div className={`text-xs mt-0.5 ${
                          selectedDay === day ? 'text-indigo-100' : 'text-muted-foreground'
                        }`}>
                          {student.schedule[day].length} {t('classesCountLabel')}
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
                    <CardTitle>{t(selectedDay.toLowerCase())}</CardTitle>
                    <CardDescription>
                      {student.schedule[selectedDay].length} {t('classesCountLabel')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      {student.schedule[selectedDay].map((classItem, idx) => (
                        <div
                          key={idx}
                          className={`p-4 rounded-lg ${getClassTypeColor(classItem.type)} shadow-sm hover:shadow-md transition-shadow`}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 space-y-3">
                              <div className="flex items-start justify-between">
                                <h3 className="font-semibold text-foreground">
                                  {classItem.subject}
                                </h3>
                                {classItem.type && (
                                  <Badge className={getClassBadgeColor(classItem.type)}>
                                    {classItem.type === 'activity' ? t('activityType') : classItem.type === 'break' ? t('breakType') : classItem.type}
                                  </Badge>
                                )}
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Clock className="h-4 w-4 flex-shrink-0" />
                                  <span>{classItem.time}</span>
                                </div>

                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <User className="h-4 w-4 flex-shrink-0" />
                                  <span>{classItem.teacher}</span>
                                </div>

                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <MapPin className="h-4 w-4 flex-shrink-0" />
                                  <span>{classItem.room}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
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
                      {daysOfWeek.map(day => (
                        <div key={day} className="text-center space-y-2">
                          <div className={`font-medium text-sm ${
                            selectedDay === day ? 'text-indigo-600 dark:text-indigo-400' : 'text-muted-foreground'
                          }`}>
                            {t(day.toLowerCase()).substring(0, 3)}
                          </div>
                          <div className="space-y-1">
                            {student.schedule[day].filter(c => !c.type).slice(0, 5).map((classItem, idx) => (
                              <div
                                key={idx}
                                className="text-xs p-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 rounded truncate"
                                title={classItem.subject}
                              >
                                {classItem.subject.length > 10
                                  ? classItem.subject.substring(0, 10) + '...'
                                  : classItem.subject}
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
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
