import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Calendar, Users, BookOpen, Clock, Activity, TrendingUp, CheckCircle, ArrowRight, ArrowLeft, Bell, ClipboardCheck, MapPin, FileText } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useLanguage } from '../context/LanguageContext';
import { useAttendance } from '../context/AttendanceContext';

export function TeacherDashboard() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();
  const isRTL = currentLanguage === 'ar';
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;
  const { sessions, endSession } = useAttendance();

  const todayClasses = [
    { time: '09:00 AM - 09:45 AM', subject: 'Mathematics', class: '10-A', room: 'Room 301', status: 'completed' },
    { time: '10:00 AM - 10:45 AM', subject: 'Mathematics', class: '10-B', room: 'Room 301', status: 'completed' },
    { time: '11:00 AM - 11:45 AM', subject: 'Mathematics', class: '9-A', room: 'Room 301', status: 'ongoing' },
    { time: '01:00 PM - 01:45 PM', subject: 'Mathematics', class: '8-A', room: 'Room 301', status: 'upcoming' },
  ];

  const pendingHomework = [
    { class: '10-A', assignment: 'Algebra Problem Set', submissions: 28, total: 30, dueDate: 'Today' },
    { class: '10-B', assignment: 'Geometry Worksheet', submissions: 25, total: 32, dueDate: 'Today' },
    { class: '9-A', assignment: 'Trigonometry Quiz', submissions: 20, total: 28, dueDate: 'Tomorrow' },
  ];

  const upcomingExams = [
    { subject: 'Mathematics', class: '10-A', type: 'Final Exam', date: 'Friday, Mar 3', time: '09:00 AM' },
    { subject: 'Mathematics', class: '10-B', type: 'Mid-term Test', date: 'Monday, Mar 6', time: '10:00 AM' },
  ];

  const recentAnnouncements = [
    { title: 'Parent-Teacher Meeting', date: 'March 5, 2026', priority: 'high' },
    { title: 'Math Department Meeting', date: 'March 10, 2026', priority: 'normal' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t('teacherDashboard')}</h1>
          <p className="text-muted-foreground mt-1">{t('teacherDashboardDesc')}</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Link to="/teacher/classes">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('todaysClasses')}</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4</div>
              <p className="text-xs text-muted-foreground">1 {t('ongoing')}, 1 {t('upcoming')}</p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/teacher/homework">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('pendingHomework')}</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">{t('submissionsToGrade')}</p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/teacher/exams">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('upcomingExams')}</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2</div>
              <p className="text-xs text-muted-foreground">Next: Math Final - Friday</p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/teacher/messages">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('newMessages')}</CardTitle>
              <Bell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
              <p className="text-xs text-muted-foreground">3 from parents, 2 admin</p>
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Schedule */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{t('todaysSchedule')}</CardTitle>
            <Link to="/teacher/classes" className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
              {t('viewAll')} <ArrowIcon className="h-4 w-4" />
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {todayClasses.map((cls, i) => {
                const session = sessions[i];
                const isActive = session?.attendanceStatus === 'active';
                const isCompleted = session?.attendanceStatus === 'completed';

                return (
                  <div key={i} className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border gap-3 ${
                    isCompleted || cls.status === 'completed' ? 'bg-muted/50 dark:bg-muted/30 border-border' :
                    isActive || cls.status === 'ongoing' ? 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800' :
                    'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800'
                  }`}>
                    <div className="flex items-center gap-4">
                      <Clock className={`h-5 w-5 ${
                        isCompleted || cls.status === 'completed' ? 'text-muted-foreground' :
                        isActive || cls.status === 'ongoing' ? 'text-green-600 dark:text-green-400' :
                        'text-blue-600 dark:text-blue-400'
                      }`} />
                      <div className="space-y-0.5">
                        <div className="font-semibold text-foreground">{cls.subject} - {cls.class}</div>
                        <div className="text-sm text-muted-foreground">{cls.time} • {cls.room}</div>
                        {isActive && (
                          <div className="text-xs font-medium text-green-700 dark:text-green-400 mt-1 flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-green-500 dark:bg-green-400 animate-pulse"></span>
                            Active Session: {session.attendanceMethod}
                            {session.correctNumber && session.attendanceMethod === 'number' && ` (Target: ${session.correctNumber})`}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 justify-end">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        isCompleted || cls.status === 'completed' ? 'bg-muted text-muted-foreground' :
                        isActive || cls.status === 'ongoing' ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300' :
                        'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300'
                      }`}>
                        {isActive ? 'Session Live' : isCompleted ? 'Attendance Completed' : t(cls.status)}
                      </span>
                      {(!isCompleted && cls.status !== 'completed' && !isActive) && (
                        <Button
                          size="sm"
                          className="bg-primary hover:bg-primary/90 text-primary-foreground"
                          onClick={() => navigate(`/teacher/attendance/method-selection?classId=${i}&className=${encodeURIComponent(cls.class)}`)}
                        >
                          Take Attendance
                        </Button>
                      )}
                      {isActive && (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => endSession(i)}
                        >
                          End Session
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>{t('quickActions')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Link
                to="/teacher/lessons/add"
                className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
              >
                <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-foreground">{t('addLesson')}</div>
                  <div className="text-xs text-muted-foreground">{t('createLessonPlan')}</div>
                </div>
              </Link>

              <Link
                to="/teacher/homework"
                className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-green-50 dark:hover:bg-green-950/30 hover:border-green-300 dark:hover:border-green-700 transition-colors"
              >
                <div className="h-10 w-10 rounded-lg bg-green-100 dark:bg-green-900/40 flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-foreground">{t('assignHomework')}</div>
                  <div className="text-xs text-muted-foreground">{t('createAssignment')}</div>
                </div>
              </Link>

              <Link
                to="/teacher/exams"
                className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-amber-50 dark:hover:bg-amber-950/30 hover:border-amber-300 dark:hover:border-amber-700 transition-colors"
              >
                <div className="h-10 w-10 rounded-lg bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-foreground">{t('scheduleExam')}</div>
                  <div className="text-xs text-muted-foreground">{t('setupExam')}</div>
                </div>
              </Link>

              <Link
                to="/teacher/messages"
                className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-purple-50 dark:hover:bg-purple-950/30 hover:border-purple-300 dark:hover:border-purple-700 transition-colors"
              >
                <div className="h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center">
                  <Bell className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-foreground">{t('sendMessage')}</div>
                  <div className="text-xs text-muted-foreground">{t('contactParentsStudents')}</div>
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Homework Overview */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{t('homeworkOverview')}</CardTitle>
            <Link to="/teacher/homework" className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
              {t('viewAll')} <ArrowIcon className="h-4 w-4" />
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingHomework.map((hw, i) => (
                <div key={i} className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="space-y-0.5">
                    <div className="font-semibold text-foreground">{hw.class}: {hw.assignment}</div>
                    <div className="text-sm text-muted-foreground">
                      {hw.submissions}/{hw.total} {t('submitted')} • {t('due')} {hw.dueDate}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-indigo-600">
                      {Math.round((hw.submissions / hw.total) * 100)}%
                    </div>
                    <div className="text-xs text-muted-foreground">{t('completed')}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Exams */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{t('upcomingExams')}</CardTitle>
            <Link to="/teacher/exams" className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
              {t('viewAll')} <ArrowIcon className="h-4 w-4" />
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingExams.map((exam, i) => (
                <div key={i} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-lg bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center">
                      <Calendar className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div className="space-y-0.5">
                      <div className="font-semibold text-foreground">{exam.class} - {exam.type}</div>
                      <div className="text-sm text-muted-foreground">{exam.date} at {exam.time}</div>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 text-xs rounded-full">
                    {t('upcoming')}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Announcements */}
      <Card>
        <CardHeader>
          <CardTitle>{t('recentAnnouncements')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentAnnouncements.map((announcement, index) => (
              <div key={index} className="flex items-start justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-start gap-3">
                  <Bell className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mt-0.5" />
                  <div className="space-y-0.5">
                    <div className="font-semibold text-foreground">{announcement.title}</div>
                    <div className="text-sm text-muted-foreground">{announcement.date}</div>
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  announcement.priority === 'high' ? 'bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-300' :
                  announcement.priority === 'normal' ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-300' :
                  'bg-muted text-muted-foreground'
                }`}>
                  {t(announcement.priority)}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function StudentDashboard() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();
  const isRTL = currentLanguage === 'ar';
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;
  const { sessions, studentStatus, completeStudentAttendance } = useAttendance();

  const todayClasses = [
    { time: '09:00 AM', subject: 'Mathematics', teacher: 'Mr. Nash', room: 'Room 302' },
    { time: '10:00 AM', subject: 'English', teacher: 'Ms. Smith', room: 'Room 205' },
    { time: '11:00 AM', subject: 'Science', teacher: 'Dr. Brown', room: 'Lab 101' },
    { time: '02:00 PM', subject: 'History', teacher: 'Mr. Wilson', room: 'Room 310' },
  ];

  // ── Modal state: null = closed, object = open for a specific class ──
  const [activeModal, setActiveModal] = useState(null);

  // Student: open method-specific attendance modal
  const handleStudentJoin = (index) => {
    const session = sessions[index];
    if (!session || !session.attendanceEnabled) return;
    
    // STRICT: In manual method, student doesn't join themselves
    if (session.attendanceMethod === 'manual') return;
    
    setActiveModal({
      classIndex: index,
      method: session.attendanceMethod, // STRICT: Single method only
      numberOptions: session.numberOptions,
      correctNumber: session.correctNumber,
      subject: todayClasses[index].subject,
      time: todayClasses[index].time,
    });
  };

  // Student: attendance successfully verified
  const handleAttendanceSuccess = (methodUsed) => {
    if (!activeModal) return;
    completeStudentAttendance(activeModal.classIndex, methodUsed);
    setActiveModal(null);
  };

  const assignments = [
    { subject: 'History', title: 'Essay on World War II', due: 'Tomorrow', status: 'pending', priority: 'high' },
    { subject: 'Science', title: 'Lab Report - Chemistry', due: 'In 3 days', status: 'pending', priority: 'medium' },
    { subject: 'English', title: 'Book Report', due: 'Friday', status: 'pending', priority: 'medium' },
    { subject: 'Mathematics', title: 'Algebra Problem Set', due: 'Submitted', status: 'completed', priority: 'low' },
  ];

  const upcomingExams = [
    { subject: 'Mathematics', type: 'Final Exam', date: 'March 5, 2026', time: '09:00 AM' },
    { subject: 'Science', type: 'Mid-term Test', date: 'March 8, 2026', time: '10:00 AM' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t('studentDashboard')}</h1>
          <p className="text-muted-foreground mt-1">{t('studentDashboardDesc')}</p>
        </div>
        <Link
          to="/student/schedule"
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Calendar className="h-4 w-4" />
          {t('viewFullSchedule')}
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Link to="/student/schedule">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('todaysClasses')}</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">4</div>
              <p className="text-xs text-muted-foreground mt-1">{t('nextMathClass')}</p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/student/homework">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('pendingHomework')}</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">3</div>
              <p className="text-xs text-muted-foreground mt-1">{t('pending1DueTomorrow')}</p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/student/grades">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('averageGrade')}</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">87%</div>
              <p className="text-xs text-muted-foreground mt-1">{t('averageGradeVal')}</p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/student/messages">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('newMessages')}</CardTitle>
              <Bell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">2</div>
              <p className="text-xs text-muted-foreground mt-1">{t('fromTeachers')}</p>
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Next Class */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{t('nextClass')}</CardTitle>
            <CardDescription>{t('nextClassDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-6 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg text-white">
              <div className="text-3xl font-bold mb-2">Mathematics</div>
              <div className="flex flex-wrap items-center gap-4 text-indigo-100">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>Mr. Nash</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>Room 302</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>09:00 AM - 09:45 AM</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>{t('quickActions')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Link
                to="/student/homework"
                className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors"
              >
                <div className="h-10 w-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center shrink-0">
                  <BookOpen className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div className="flex-1 space-y-0.5">
                  <div className="font-semibold text-foreground">{t('submitHomework')}</div>
                  <div className="text-xs text-muted-foreground">{t('submitHomeworkDesc')}</div>
                </div>
              </Link>

              <Link
                to="/student/grades"
                className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-green-50 dark:hover:bg-green-900/20 hover:border-green-300 dark:hover:border-green-700 transition-colors"
              >
                <div className="h-10 w-10 rounded-lg bg-green-100 dark:bg-green-900/40 flex items-center justify-center shrink-0">
                  <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div className="flex-1 space-y-0.5">
                  <div className="font-semibold text-foreground">{t('viewGrades')}</div>
                  <div className="text-xs text-muted-foreground">{t('viewGradesDesc')}</div>
                </div>
              </Link>

              <Link
                to="/student/ai"
                className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:border-purple-300 dark:hover:border-purple-700 transition-colors"
              >
                <div className="h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center shrink-0">
                  <Activity className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="flex-1 space-y-0.5">
                  <div className="font-semibold text-foreground">{t('aiTutor')}</div>
                  <div className="text-xs text-muted-foreground">{t('aiTutorDesc')}</div>
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Today's Schedule */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{t('todaysSchedule')}</CardTitle>
          <Link to="/student/schedule" className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 flex items-center gap-1">
            {t('viewFullSchedule')} <ArrowIcon className="h-4 w-4" />
          </Link>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {todayClasses.map((cls, i) => {
              const session = sessions[i];
              const attStatus = studentStatus[i]?.status || 'pending';
              const isEnabled = session?.attendanceEnabled && attStatus !== 'completed';
              
              let statusLabel = 'Waiting for teacher...';
              let dotColor = 'bg-muted-foreground/50';
              let textColor = 'text-muted-foreground';
              let borderColor = 'border-border';
              let bgColor = 'bg-muted/40';

              if (attStatus === 'completed') {
                statusLabel = 'Attendance recorded';
                dotColor = 'bg-green-500';
                textColor = 'text-green-600 dark:text-green-400';
                borderColor = 'border-green-200 dark:border-green-800';
                bgColor = 'bg-green-50 dark:bg-green-900/10';
              } else if (attStatus === 'absent' || (!session?.attendanceEnabled && session?.attendanceStatus === 'completed')) {
                statusLabel = 'Session ended — Absent';
                dotColor = 'bg-red-500';
                textColor = 'text-red-500 dark:text-red-400';
                borderColor = 'border-red-200 dark:border-red-800';
                bgColor = 'bg-red-50 dark:bg-red-900/10';
              } else if (isEnabled) {
                statusLabel = 'Session active';
                dotColor = 'bg-indigo-500 animate-pulse';
                textColor = 'text-indigo-600 dark:text-indigo-400';
                borderColor = 'border-indigo-200 dark:border-indigo-700';
                bgColor = 'bg-indigo-50 dark:bg-indigo-900/10';
              }

              return (
                <div key={i} className={`rounded-xl border overflow-hidden transition-all duration-300 ${borderColor}`}>
                  {/* ── STUDENT VIEW ── */}
                  <div className={`p-4 ${bgColor}`}>
                    {/* Class info */}
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <Clock className={`h-5 w-5 shrink-0 ${textColor}`} />
                        <div className="min-w-0">
                          <div className="font-semibold text-foreground">{cls.subject}</div>
                          <div className="text-sm text-muted-foreground">{cls.teacher} • {cls.room}</div>
                        </div>
                      </div>
                      <span className="text-sm font-medium text-muted-foreground shrink-0">{cls.time}</span>
                    </div>

                    {/* Status + button row */}
                    <div className="mt-3 pt-3 border-t border-border flex items-center justify-between gap-2">
                      <span className={`text-xs flex items-center gap-1.5 ${textColor}`}>
                        <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${dotColor}`} />
                        {statusLabel}
                      </span>

                      <AttendanceButton
                        attendanceEnabled={isEnabled}
                        attendanceStatus={attStatus}
                        onJoin={() => handleStudentJoin(i)}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Attendance verification modal */}
          {activeModal && (
            <AttendanceModal
              isOpen={true}
              method={activeModal.method}
              numberOptions={activeModal.numberOptions}
              correctNumber={activeModal.correctNumber}
              subject={activeModal.subject}
              time={activeModal.time}
              onComplete={handleAttendanceSuccess}
              onClose={() => setActiveModal(null)}
            />
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Assignments Due */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{t('assignmentsDue')}</CardTitle>
            <Link to="/student/homework" className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 flex items-center gap-1">
              {t('viewAll')} <ArrowIcon className="h-4 w-4" />
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {assignments.map((assignment, i) => (
                <div key={i} className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div className="space-y-0.5">
                    <div className="font-semibold text-foreground">{assignment.subject}</div>
                    <div className="text-sm text-muted-foreground">{assignment.title}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    {assignment.status === 'completed' ? (
                      <span className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400">
                        <CheckCircle className="h-4 w-4" />
                        {assignment.due}
                      </span>
                    ) : (
                      <span className={`text-sm ${
                        assignment.priority === 'high' ? 'text-red-500 dark:text-red-400 font-medium' : 'text-muted-foreground'
                      }`}>
                        {assignment.due}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Exams */}
        <Card>
          <CardHeader>
            <CardTitle>{t('upcomingExams')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingExams.map((exam, i) => (
                <div key={i} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shrink-0">
                      <Calendar className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div className="space-y-0.5">
                      <div className="font-semibold text-foreground">{exam.subject} - {exam.type}</div>
                      <div className="text-sm text-muted-foreground">{exam.date} at {exam.time}</div>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs rounded-full">
                    {t('upcoming')}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Access */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => navigate('/student/grades')}
          className="flex flex-col items-center justify-center h-auto py-6 px-4 border border-border rounded-lg hover:bg-muted/50 hover:border-primary/50 transition-colors cursor-pointer"
        >
          <FileText className="h-8 w-8 mb-3 text-indigo-600 dark:text-indigo-400" />
          <div className="font-semibold text-foreground text-base mb-1">{t('viewGrades')}</div>
          <div className="text-sm text-muted-foreground">{t('detailedGradeReport')}</div>
        </button>

        <button
          onClick={() => navigate('/student/schedule')}
          className="flex flex-col items-center justify-center h-auto py-6 px-4 border border-border rounded-lg hover:bg-muted/50 hover:border-primary/50 transition-colors cursor-pointer"
        >
          <Calendar className="h-8 w-8 mb-3 text-indigo-600 dark:text-indigo-400" />
          <div className="font-semibold text-foreground text-base mb-1">{t('viewFullSchedule')}</div>
          <div className="text-sm text-muted-foreground">{t('classTimetable')}</div>
        </button>

        <button
          onClick={() => navigate('/student/messages')}
          className="flex flex-col items-center justify-center h-auto py-6 px-4 border border-border rounded-lg hover:bg-muted/50 hover:border-primary/50 transition-colors cursor-pointer"
        >
          <Users className="h-8 w-8 mb-3 text-indigo-600 dark:text-indigo-400" />
          <div className="font-semibold text-foreground text-base mb-1">{t('contactTeachers')}</div>
          <div className="text-sm text-muted-foreground">{t('sendMessages')}</div>
        </button>
      </div>
    </div>
  );
}

export function ParentDashboard() {
  const [selectedChild, setSelectedChild] = React.useState('bart');
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();
  const isRTL = currentLanguage === 'ar';

  const children = [
    { id: 'bart', name: 'Bart Simpson', grade: 'Grade 10', class: '10-A', avatar: 'B' },
    { id: 'lisa', name: 'Lisa Simpson', grade: 'Grade 8', class: '8-B', avatar: 'L' },
    { id: 'maggie', name: 'Maggie Simpson', grade: 'Kindergarten', class: 'KG-1', avatar: 'M' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t('parentDashboard')}</h1>
          <p className="text-muted-foreground mt-1">{t('parentDashboardDesc')}</p>
        </div>
        <Link
          to="/parent/messages"
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Bell className="h-4 w-4" />
          {t('contactTeachers')}
        </Link>
      </div>

      {/* Child Selector */}
      <Card>
        <CardHeader>
          <CardTitle>{t('selectChild')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 flex-wrap">
            {children.map((child) => (
              <div
                key={child.id}
                onClick={() => setSelectedChild(child.id)}
                className={`flex-1 min-w-[140px] p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedChild === child.id
                    ? 'border-primary bg-primary/10'
                    : 'border-transparent bg-muted/50 hover:bg-muted'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`h-12 w-12 rounded-full flex items-center justify-center text-xl font-bold shrink-0 ${
                    selectedChild === child.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {child.avatar}
                  </div>
                  <div className="flex-1 min-w-0 space-y-0.5">
                    <div className="font-semibold text-foreground truncate">{child.name}</div>
                    <div className="text-sm text-muted-foreground">{child.grade} • {child.class}</div>
                  </div>
                  {selectedChild === child.id && (
                    <CheckCircle className={`h-5 w-5 text-primary shrink-0 ${isRTL ? 'mr-auto' : 'ms-auto'}`} />
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Child Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('attendance')}</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">98%</div>
            <p className="text-xs text-muted-foreground mt-1">{t('presentThisMonth')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('assignmentsLabel')}</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">12/14</div>
            <p className="text-xs text-muted-foreground mt-1">{t('completedTasksLabel')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('averageGrade')}</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">A-</div>
            <p className="text-xs text-muted-foreground mt-1">{t('excellentProgress')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('behaviorLabel')}</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{t('goodBehavior')}</div>
            <p className="text-xs text-muted-foreground mt-1">{t('noIncidentsReported')}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>{t('recentActivity')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div className="space-y-0.5">
                  <p className="font-medium text-foreground">{t('homeworkSubmittedLabel')}</p>
                  <p className="text-sm text-muted-foreground">Math - Algebra Set 3</p>
                  <p className="text-xs text-muted-foreground">Today at 2:30 PM</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                  <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="space-y-0.5">
                  <p className="font-medium text-foreground">{t('newGradePostedLabel')}</p>
                  <p className="text-sm text-muted-foreground">Science - Lab Report</p>
                  <p className="text-xs text-muted-foreground">Yesterday</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card>
          <CardHeader>
            <CardTitle>{t('upcomingEventsLabel')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/30 transition-colors">
                <div className="flex gap-3 items-center">
                  <Calendar className="h-5 w-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                  <div className="space-y-0.5">
                    <p className="font-medium text-foreground">Math Final Exam</p>
                    <p className="text-sm text-muted-foreground">Friday, March 3</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/30 transition-colors">
                <div className="flex gap-3 items-center">
                  <Users className="h-5 w-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                  <div className="space-y-0.5">
                    <p className="font-medium text-foreground">Parent Teacher Meeting</p>
                    <p className="text-sm text-muted-foreground">Thursday, March 9</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ─── AttendanceButton ────────────────────��──────────────────────────────────
function AttendanceButton({ attendanceEnabled, attendanceStatus, onJoin }) {
  if (attendanceStatus === 'completed') {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900/40 rounded-full border border-green-200 dark:border-green-700">
        <CheckCircle className="h-3.5 w-3.5 shrink-0" />
        Attendance Completed
      </span>
    );
  }
  if (attendanceStatus === 'absent') {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/40 rounded-full border border-red-200 dark:border-red-700">
        <span className="h-2 w-2 rounded-full bg-red-500 dark:bg-red-400 shrink-0" />
        Absent
      </span>
    );
  }
  return (
    <button
      onClick={attendanceEnabled ? onJoin : undefined}
      disabled={!attendanceEnabled}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full border transition-all duration-200 ${
        !attendanceEnabled
          ? 'text-muted-foreground bg-muted border-border cursor-not-allowed opacity-60'
          : 'text-indigo-700 dark:text-indigo-300 bg-indigo-100 dark:bg-indigo-900/40 border-indigo-300 dark:border-indigo-600 hover:bg-indigo-200 dark:hover:bg-indigo-800/60 hover:shadow-sm cursor-pointer active:scale-95'
      }`}
    >
      <ClipboardCheck className="h-3.5 w-3.5 shrink-0" />
      Join Attendance
    </button>
  );
}

// ─── AttendanceModal ─────────────────────────────────────────────────────────
function AttendanceModal({ isOpen, method, numberOptions, correctNumber, subject, time, onComplete, onClose }) {
  const [selectedNum, setSelectedNum] = useState(null);
  const [scanning, setScanning]       = useState(false);
  const [error, setError]             = useState('');
  const [done, setDone]               = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSelectedNum(null);
      setScanning(false);
      setError('');
      setDone(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const triggerComplete = () => {
    setDone(true);
    setTimeout(() => onComplete(method), 700);
  };

  // QR
  const handleQRScan = async () => {
    if (scanning || done) return;
    setScanning(true);
    await new Promise((r) => setTimeout(r, 1800));
    triggerComplete();
  };

  // Number Select
  const handleNumberPick = (num) => {
    if (selectedNum !== null || done) return;
    setSelectedNum(num);
    if (num === correctNumber) {
      triggerComplete();
    } else {
      setError('Wrong number! Try again.');
      setTimeout(() => { setSelectedNum(null); setError(''); }, 1200);
    }
  };

  const metaDict = {
    qr:     { title: 'Scan QR Code',            icon: '📷', hint: 'Point your camera at the QR code your teacher is displaying.' },
    number: { title: 'Select the Right Number', icon: '🔢', hint: 'Tap the number your teacher has highlighted on screen.' }
  };

  const currentMeta = metaDict[method] || { title: 'Select Attendance Method', icon: '📋', hint: 'Choose a method to join attendance.' };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-card rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-sm overflow-hidden border border-border">

        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-border">
          <div className="flex items-center gap-3">
            <span className="text-2xl leading-none">{currentMeta.icon}</span>
            <div className="space-y-0.5">
              <p className="font-bold text-foreground text-base leading-tight">{currentMeta.title}</p>
              <p className="text-xs text-muted-foreground">{subject} · {time}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-accent text-muted-foreground transition-colors text-lg"
          >
            ✕
          </button>
        </div>

        <p className="text-xs text-muted-foreground text-center px-5 pt-4 pb-0">{currentMeta.hint}</p>

        <div className="p-5 pt-4">

          {/* ── QR Scanner ── */}
          {method === 'qr' && (
            <div className="flex flex-col items-center gap-4">
              <div className={`relative w-52 h-52 rounded-xl overflow-hidden flex items-center justify-center transition-colors duration-500 ${done ? 'bg-green-900' : 'bg-gray-900'}`}>
                {[
                  'top-3 left-3 border-t-2 border-l-2',
                  'top-3 right-3 border-t-2 border-r-2',
                  'bottom-3 left-3 border-b-2 border-l-2',
                  'bottom-3 right-3 border-b-2 border-r-2',
                ].map((cls, pi) => (
                  <span key={pi} className={`absolute ${cls} h-6 w-6 rounded ${done ? 'border-green-400' : 'border-indigo-400'} transition-colors duration-500`} />
                ))}
                {done ? (
                  <div className="flex flex-col items-center gap-2">
                    <CheckCircle className="h-14 w-14 text-green-400" />
                    <span className="text-green-300 text-sm font-medium">Verified!</span>
                  </div>
                ) : scanning ? (
                  <div className="flex flex-col items-center gap-3">
                    <div className="h-9 w-9 border-[3px] border-indigo-400 border-t-transparent rounded-full animate-spin" />
                    <span className="text-gray-400 text-xs">Scanning…</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3 opacity-40">
                    <div className="grid grid-cols-5 gap-0.5 w-24 h-24">
                      {[1,1,1,1,1,1,0,0,0,1,1,0,1,0,1,1,0,0,0,1,1,1,1,1,1].map((v, k) => (
                        <div key={k} className={`rounded-sm ${v ? 'bg-white' : 'bg-transparent'}`} />
                      ))}
                    </div>
                    <span className="text-gray-400 text-xs">Ready to scan</span>
                  </div>
                )}
              </div>
              {!scanning && !done && (
                <button
                  onClick={handleQRScan}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-xl font-medium transition-colors"
                >
                  Simulate QR Scan
                </button>
              )}
            </div>
          )}

          {/* ── Number Method ── */}
          {method === 'number' && (
            <div className="flex flex-col gap-4">
              <div className="flex gap-3">
                {numberOptions?.map((num, idx) => {
                  const picked  = selectedNum === num;
                  const correct = picked && num === correctNumber;
                  const wrong   = picked && num !== correctNumber;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleNumberPick(num)}
                      disabled={selectedNum !== null}
                      className={`flex-1 h-20 rounded-xl text-3xl font-bold border-2 transition-all duration-300 ${
                        correct            ? 'border-green-500 bg-green-50 dark:bg-green-900/30 text-green-600 scale-105 shadow-md'  :
                        wrong              ? 'border-red-400 bg-red-50 dark:bg-red-900/20 text-red-500 animate-bounce'              :
                        selectedNum!==null ? 'border-border text-muted-foreground opacity-40'     :
                        'border-border text-foreground hover:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:scale-105 active:scale-95'
                      }`}
                    >
                      {num}
                    </button>
                  );
                })}
              </div>
              {error && <p className="text-red-500 text-sm text-center">{error}</p>}
              {done && (
                <div className="flex items-center justify-center gap-2 py-1 text-green-600 dark:text-green-400">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">Correct! Attendance recorded.</span>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
// ─────────────────────────────────────────────────────────────────────────────