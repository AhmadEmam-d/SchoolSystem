import React from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { 
  ArrowLeft, 
  Users, 
  BookOpen, 
  Calendar, 
  Clock,
  MapPin,
  ClipboardCheck,
  FileText,
  MessageSquare,
  BarChart3,
  TrendingUp,
  Award,
  Target
} from 'lucide-react';

export function ClassDetails() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Mock class data
  const classData = {
    name: 'Grade 10-A',
    grade: '10',
    subject: 'Mathematics',
    room: '301',
    teacher: 'Mr. Ahmed Hassan',
    totalStudents: 28,
    schedule: [
      { day: 'Sunday', time: '08:00 – 09:00' },
      { day: 'Monday', time: '09:00 – 10:00' },
      { day: 'Wednesday', time: '09:00 – 10:00' },
    ],
    students: [
      { id: 's1', name: 'Ahmed Ali', attendance: 95, grade: 88, status: 'Active' },
      { id: 's2', name: 'Fatima Hassan', attendance: 98, grade: 92, status: 'Active' },
      { id: 's3', name: 'Omar Mohammed', attendance: 87, grade: 85, status: 'Active' },
      { id: 's4', name: 'Sarah Ahmed', attendance: 93, grade: 90, status: 'Active' },
      { id: 's5', name: 'Youssef Ibrahim', attendance: 91, grade: 87, status: 'Active' },
      { id: 's6', name: 'Noor Khalid', attendance: 96, grade: 94, status: 'Active' },
      { id: 's7', name: 'Hassan Ali', attendance: 89, grade: 82, status: 'Active' },
      { id: 's8', name: 'Maryam Salem', attendance: 97, grade: 91, status: 'Active' },
      { id: 's9', name: 'Khalid Omar', attendance: 85, grade: 80, status: 'Active' },
      { id: 's10', name: 'Layla Ahmed', attendance: 94, grade: 89, status: 'Active' },
    ],
  };

  const stats = {
    averageAttendance: 92,
    averageGrade: 87,
    totalLessons: 24,
    completedLessons: 18,
    pendingHomework: 5,
    upcomingExams: 2,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-3 -ml-2 gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('backToMyClasses')}
        </Button>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{classData.name}</h1>
            <p className="text-gray-500 mt-1">{t('classInfoDesc')}</p>
          </div>
          <Badge variant="outline" className="text-sm px-4 py-2 gap-1">
            <Users className="h-3.5 w-3.5" />
            {classData.totalStudents} {t('students')}
          </Badge>
        </div>
      </div>

      {/* Class Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 bg-indigo-100 rounded-lg flex items-center justify-center shrink-0">
                <BookOpen className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">{t('subjectLabel')}</p>
                <p className="text-base font-bold text-gray-900 mt-0.5">{classData.subject}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center shrink-0">
                <MapPin className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">{t('roomLabel')}</p>
                <p className="text-base font-bold text-gray-900 mt-0.5">{t('room')} {classData.room}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                <Award className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">{t('gradeLevelLabel')}</p>
                <p className="text-base font-bold text-gray-900 mt-0.5">{t('grade')} {classData.grade}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                <Target className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">{t('lessonsLabel')}</p>
                <p className="text-base font-bold text-gray-900 mt-0.5">{stats.completedLessons}/{stats.totalLessons}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-indigo-600" />
            {t('classPerformanceOverview')}
          </CardTitle>
          <CardDescription>{t('keyMetricsDesc')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-green-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">{t('averageAttendance')}</p>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </div>
              <p className="text-3xl font-bold text-green-600">{stats.averageAttendance}%</p>
              <p className="text-xs text-gray-500 mt-1">{t('basedOnLast30Days')}</p>
            </div>

            <div className="p-6 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">{t('averageGrade')}</p>
                <Award className="h-4 w-4 text-blue-600" />
              </div>
              <p className="text-3xl font-bold text-blue-600">{stats.averageGrade}%</p>
              <p className="text-xs text-gray-500 mt-1">{t('overallPerformance')}</p>
            </div>

            <div className="p-6 bg-purple-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">{t('upcomingExams')}</p>
                <FileText className="h-4 w-4 text-purple-600" />
              </div>
              <p className="text-3xl font-bold text-purple-600">{stats.upcomingExams}</p>
              <p className="text-xs text-gray-500 mt-1">{stats.pendingHomework} {t('pendingHomeworkLabel')}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Schedule */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-indigo-600" />
              {t('weeklyScheduleLabel')}
            </CardTitle>
            <CardDescription>{t('classTimings')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {classData.schedule.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 bg-indigo-50 rounded-lg border border-indigo-100"
                >
                  <div>
                    <p className="font-medium text-gray-900">{item.day}</p>
                    <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                      <Clock className="h-3 w-3" />
                      {item.time}
                    </p>
                  </div>
                  <Badge variant="outline" className="bg-white text-green-700 border-green-200 text-xs">
                    {t('ongoing')}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Student Roster */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-indigo-600" />
                  {t('studentListLabel')}
                </CardTitle>
                <CardDescription>{t('allStudentsEnrolled')}</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                {t('exportList')}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">#</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">{t('studentNameCol')}</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">{t('attendanceCol')}</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">{t('gradeCol')}</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">{t('statusCol')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {classData.students.map((student, idx) => (
                    <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-sm text-gray-500">{idx + 1}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 bg-indigo-100 rounded-full flex items-center justify-center shrink-0">
                            <span className="text-xs font-medium text-indigo-600">
                              {student.name.charAt(0)}
                            </span>
                          </div>
                          <span className="text-sm font-medium text-gray-900">{student.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-1.5 max-w-[80px]">
                            <div
                              className="bg-green-500 h-1.5 rounded-full"
                              style={{ width: `${student.attendance}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium text-gray-700">{student.attendance}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          variant="outline"
                          className={
                            student.grade >= 90 ? 'bg-green-50 text-green-700 border-green-200' :
                            student.grade >= 80 ? 'bg-blue-50 text-blue-700 border-blue-200' :
                            'bg-yellow-50 text-yellow-700 border-yellow-200'
                          }
                        >
                          {student.grade}%
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          {student.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>{t('quickActionsLabel')}</CardTitle>
          <CardDescription>{t('commonTasksDesc')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button
              variant="outline"
              className="h-auto py-4 flex flex-col gap-2"
              onClick={() => navigate('/teacher/attendance')}
            >
              <ClipboardCheck className="h-5 w-5 text-indigo-600" />
              <span className="text-sm">{t('takeAttendanceBtn')}</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-4 flex flex-col gap-2"
              onClick={() => navigate('/teacher/lessons/add')}
            >
              <BookOpen className="h-5 w-5 text-blue-600" />
              <span className="text-sm">{t('addLessonBtn')}</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-4 flex flex-col gap-2"
              onClick={() => navigate('/teacher/homework/add')}
            >
              <FileText className="h-5 w-5 text-green-600" />
              <span className="text-sm">{t('assignHomeworkBtn')}</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-4 flex flex-col gap-2"
              onClick={() => navigate('/teacher/messages')}
            >
              <MessageSquare className="h-5 w-5 text-purple-600" />
              <span className="text-sm">{t('messageStudents')}</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}