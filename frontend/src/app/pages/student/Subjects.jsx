import React from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { BookOpen, User, Clock, TrendingUp, FileText, Calendar } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Progress } from '../../components/ui/progress';

export function StudentSubjects() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const subjectDetails = [
    {
      id: 'sub1',
      name: 'Mathematics',
      teacher: 'John Nash',
      grade: 85,
      attendance: 92,
      nextClass: 'Monday, 8:00 AM',
      totalClasses: 45,
      completedClasses: 38,
      assignments: 12,
      pendingAssignments: 2
    },
    {
      id: 'sub2',
      name: 'Science',
      teacher: 'Marie Curie',
      grade: 92,
      attendance: 95,
      nextClass: 'Tuesday, 8:00 AM',
      totalClasses: 50,
      completedClasses: 42,
      assignments: 15,
      pendingAssignments: 1
    },
    {
      id: 'sub3',
      name: 'History',
      teacher: 'Herodotus',
      grade: 88,
      attendance: 97,
      nextClass: 'Wednesday, 9:30 AM',
      totalClasses: 40,
      completedClasses: 35,
      assignments: 10,
      pendingAssignments: 0
    },
    {
      id: 'sub4',
      name: 'English',
      teacher: 'Shakespeare',
      grade: 90,
      attendance: 94,
      nextClass: 'Monday, 12:00 PM',
      totalClasses: 42,
      completedClasses: 36,
      assignments: 14,
      pendingAssignments: 3
    },
    {
      id: 'sub5',
      name: 'Art',
      teacher: 'Da Vinci',
      grade: 95,
      attendance: 100,
      nextClass: 'Tuesday, 1:00 PM',
      totalClasses: 30,
      completedClasses: 27,
      assignments: 8,
      pendingAssignments: 1
    },
  ];

  const getGradeColor = (grade) => {
    if (grade >= 90) return 'text-green-600';
    if (grade >= 80) return 'text-blue-600';
    if (grade >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getGradeBadgeColor = (grade) => {
    if (grade >= 90) return 'bg-green-100 text-green-800';
    if (grade >= 80) return 'bg-blue-100 text-blue-800';
    if (grade >= 70) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const overallGrade = Math.round(subjectDetails.reduce((sum, s) => sum + s.grade, 0) / subjectDetails.length);
  const overallAttendance = Math.round(subjectDetails.reduce((sum, s) => sum + s.attendance, 0) / subjectDetails.length);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('mySubjects')}</h1>
          <p className="text-gray-500 mt-1">{t('trackPerformanceSubjects')}</p>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-none shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-500">{t('totalSubjectsCard')}</div>
                <div className="text-2xl font-bold text-gray-900 mt-1">{subjectDetails.length}</div>
              </div>
              <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-500">{t('overallGradeLabel')}</div>
                <div className={`text-2xl font-bold mt-1 ${getGradeColor(overallGrade)}`}>
                  {overallGrade}%
                </div>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-500">{t('attendance')}</div>
                <div className="text-2xl font-bold text-blue-600 mt-1">{overallAttendance}%</div>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-500">{t('pendingWork')}</div>
                <div className="text-2xl font-bold text-orange-600 mt-1">
                  {subjectDetails.reduce((sum, s) => sum + s.pendingAssignments, 0)}
                </div>
              </div>
              <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
                <FileText className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Subjects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {subjectDetails.map((subject) => (
          <Card key={subject.id} className="border-none shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="border-b bg-gradient-to-r from-indigo-50 to-purple-50">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl">{subject.name}</CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-2">
                    <User className="h-4 w-4" />
                    {subject.teacher}
                  </CardDescription>
                </div>
                <Badge className={getGradeBadgeColor(subject.grade)}>
                  {t('gradeColLabel')} {subject.grade}%
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {/* Progress */}
              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-600">{t('courseProgress')}</span>
                  <span className="font-medium">
                    {subject.completedClasses}/{subject.totalClasses} {t('classesCountLabel')}
                  </span>
                </div>
                <Progress value={(subject.completedClasses / subject.totalClasses) * 100} className="h-2" />
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <div className="text-sm text-gray-500">{t('attendance')}</div>
                  <div className="text-lg font-semibold text-gray-900 mt-1">{subject.attendance}%</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">{t('assignmentsLabel')}</div>
                  <div className="text-lg font-semibold text-gray-900 mt-1">
                    {subject.assignments - subject.pendingAssignments}/{subject.assignments}
                  </div>
                </div>
              </div>

              {/* Next Class */}
              <div className="flex items-center gap-2 p-3 bg-indigo-50 rounded-lg">
                <Calendar className="h-4 w-4 text-indigo-600" />
                <div>
                  <div className="text-xs text-gray-600">{t('nextClass')}</div>
                  <div className="text-sm font-medium text-gray-900">{subject.nextClass}</div>
                </div>
              </div>

              {/* Pending Assignments Alert */}
              {subject.pendingAssignments > 0 && (
                <div className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-orange-600" />
                    <span className="text-sm font-medium text-orange-900">
                      {subject.pendingAssignments} {subject.pendingAssignments > 1 ? t('pendingAssignmentPlural') : t('pendingAssignmentSingular')}
                    </span>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="text-orange-600 border-orange-600 hover:bg-orange-100"
                    onClick={() => navigate('/student/homework')}
                  >
                    {t('view')}
                  </Button>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => navigate(`/student/subjects/${subject.id}/materials`)}
                >
                  {t('viewMaterials')}
                </Button>
                <Button 
                  size="sm" 
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                  onClick={() => navigate(`/student/subjects/${subject.id}`)}
                >
                  {t('viewDetails')}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
