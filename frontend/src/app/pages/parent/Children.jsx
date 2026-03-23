import React from 'react';
import { useTranslation } from 'react-i18next';
import { User, TrendingUp, Clock, BookOpen, Award, Calendar, FileText } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Progress } from '../../components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { useNavigate } from 'react-router';

export function ParentChildren() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const childrenDetails = [
    {
      id: 's1',
      name: 'Bart Simpson',
      grade: '10th',
      gpa: 2.8,
      attendance: 85,
      subjects: [
        { name: 'Mathematics', grade: 78 },
        { name: 'Science', grade: 82 },
        { name: 'History', grade: 75 },
        { name: 'English', grade: 80 },
      ],
      recentActivities: [
        { activity: 'Submitted Math Homework', date: '2 days ago' },
        { activity: 'Scored 82% on Science Quiz', date: '4 days ago' },
        { activity: 'Absent from History class', date: '5 days ago' },
      ],
      upcomingEvents: [
        { event: 'Math Mid-Term Exam', date: 'March 15', type: 'exam' },
        { event: 'Science Project Due', date: 'March 18', type: 'assignment' },
        { event: 'Parent-Teacher Meeting', date: 'March 22', type: 'meeting' },
      ]
    },
    {
      id: 's3',
      name: 'Lisa Simpson',
      grade: '8th',
      gpa: 4.0,
      attendance: 100,
      subjects: [
        { name: 'Mathematics', grade: 98 },
        { name: 'Science', grade: 100 },
        { name: 'History', grade: 97 },
        { name: 'English', grade: 99 },
      ],
      recentActivities: [
        { activity: 'Scored 100% on Science Exam', date: '1 day ago' },
        { activity: 'Won Math Olympiad', date: '3 days ago' },
        { activity: 'Submitted Essay Early', date: '6 days ago' },
      ],
      upcomingEvents: [
        { event: 'Science Fair Competition', date: 'March 12', type: 'event' },
        { event: 'Advanced Math Exam', date: 'March 20', type: 'exam' },
      ]
    },
  ];

  const getGradeColor = (grade) => {
    if (grade >= 90) return 'text-green-600 dark:text-green-400';
    if (grade >= 80) return 'text-blue-600 dark:text-blue-400';
    if (grade >= 70) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getGradeBadgeColor = (grade) => {
    if (grade >= 90) return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
    if (grade >= 80) return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
    if (grade >= 70) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
    return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
  };

  const getEventTypeColor = (type) => {
    switch (type) {
      case 'exam': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'assignment': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'meeting': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      case 'event': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getEventTypeLabel = (type) => {
    switch (type) {
      case 'exam': return t('exams');
      case 'assignment': return t('homework');
      case 'meeting': return 'Meeting';
      case 'event': return 'Event';
      default: return type;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-foreground">{t('myChildrenTitle')}</h1>
          <p className="text-muted-foreground">{t('monitorChildrenProgress')}</p>
        </div>
      </div>

      <Tabs defaultValue={childrenDetails[0].id} className="space-y-6">
        <TabsList>
          {childrenDetails.map(child => (
            <TabsTrigger key={child.id} value={child.id}>
              {child.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {childrenDetails.map(child => (
          <TabsContent key={child.id} value={child.id} className="space-y-6">
            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="border-none shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="text-sm font-medium text-muted-foreground">{t('gradeLevelLabel')}</div>
                      <div className="text-2xl font-bold text-foreground">{child.grade}</div>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center">
                      <User className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-none shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="text-sm font-medium text-muted-foreground">{t('gpa')}</div>
                      <div className={`text-2xl font-bold ${getGradeColor(child.gpa * 25)}`}>
                        {child.gpa.toFixed(1)}
                      </div>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center">
                      <Award className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-none shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="text-sm font-medium text-muted-foreground">{t('attendance')}</div>
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{child.attendance}%</div>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
                      <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-none shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="text-sm font-medium text-muted-foreground">{t('subjects')}</div>
                      <div className="text-2xl font-bold text-foreground">{child.subjects.length}</div>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center">
                      <BookOpen className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Subject Performance */}
              <Card className="border-none shadow-md">
                <CardHeader className="border-b border-border bg-muted/50">
                  <CardTitle>{t('subjectPerformanceTitle')}</CardTitle>
                  <CardDescription>{t('subjectPerformanceDesc')}</CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  {child.subjects.map((subject, idx) => (
                    <div key={idx} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-foreground">{subject.name}</span>
                        <Badge className={getGradeBadgeColor(subject.grade)}>
                          {subject.grade}%
                        </Badge>
                      </div>
                      <Progress value={subject.grade} className="h-2" />
                    </div>
                  ))}
                  <div className="pt-4 border-t border-border">
                    <Button onClick={() => navigate('/parent/grades')} variant="outline" className="w-full">
                      <FileText className="h-4 w-4 mr-2" />
                      {t('viewDetailedReport')}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Upcoming Events */}
              <Card className="border-none shadow-md">
                <CardHeader className="border-b border-border bg-muted/50">
                  <CardTitle>{t('upcomingEventsLabel')}</CardTitle>
                  <CardDescription>{t('importantDatesDeadlines')}</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    {child.upcomingEvents.map((event, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                        <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center flex-shrink-0">
                          <Calendar className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-medium text-foreground text-sm">{event.event}</h4>
                            <Badge className={getEventTypeColor(event.type)} variant="outline">
                              {getEventTypeLabel(event.type)}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{event.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="pt-4 border-t border-border mt-4">
                    <Button onClick={() => navigate('/parent/calendar')} variant="outline" className="w-full">
                      <Calendar className="h-4 w-4 mr-2" />
                      {t('viewFullCalendar')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activities */}
            <Card className="border-none shadow-md">
              <CardHeader className="border-b border-border bg-muted/50">
                <CardTitle>{t('recentActivitiesTitle')}</CardTitle>
                <CardDescription>{t('latestUpdatesAchievements')}</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  {child.recentActivities.map((activity, idx) => (
                    <div key={idx} className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
                      <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <TrendingUp className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium text-foreground">{activity.activity}</p>
                        <p className="text-xs text-muted-foreground">{activity.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button onClick={() => navigate('/parent/grades')} variant="outline" className="h-auto py-4">
                <div className="text-center w-full space-y-1">
                  <FileText className="h-6 w-6 mx-auto" />
                  <div className="font-medium">{t('viewGrades')}</div>
                  <div className="text-xs text-muted-foreground">{t('detailedGradeReport')}</div>
                </div>
              </Button>
              <Button onClick={() => navigate('/parent/schedule')} variant="outline" className="h-auto py-4">
                <div className="text-center w-full space-y-1">
                  <Calendar className="h-6 w-6 mx-auto" />
                  <div className="font-medium">{t('viewScheduleBtn')}</div>
                  <div className="text-xs text-muted-foreground">{t('classTimetableLabel')}</div>
                </div>
              </Button>
              <Button onClick={() => navigate('/parent/messages')} variant="outline" className="h-auto py-4">
                <div className="text-center w-full space-y-1">
                  <User className="h-6 w-6 mx-auto" />
                  <div className="font-medium">{t('contactTeachers')}</div>
                  <div className="text-xs text-muted-foreground">{t('sendMessages')}</div>
                </div>
              </Button>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
