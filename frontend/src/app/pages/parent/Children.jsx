import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { User, TrendingUp, Clock, BookOpen, Award, Calendar, FileText, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Progress } from '../../components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { useNavigate } from 'react-router';
import { api } from '../../lib/api';

export function ParentChildren() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChildren = async () => {
      try {
        setLoading(true);
        const data = await api.parents.getMyChildren();
        // data is the array from { success: true, data: { children: [...] } }
        const list = data?.children ?? (Array.isArray(data) ? data : []);
        setChildren(list);
      } catch (err) {
        console.error('Failed to fetch children:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchChildren();
  }, []);

  const getGradeColor = (gpa) => {
    if (gpa >= 3.7) return 'text-green-600 dark:text-green-400';
    if (gpa >= 3.0) return 'text-blue-600 dark:text-blue-400';
    if (gpa >= 2.0) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getAttendanceBadgeColor = (att) => {
    if (att >= 90) return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
    if (att >= 70) return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
    if (att >= 50) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
    return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-destructive">{error}</p>
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
          <h1 className="text-3xl font-bold text-foreground">{t('myChildrenTitle')}</h1>
          <p className="text-muted-foreground">{t('monitorChildrenProgress')}</p>
        </div>
      </div>

      <Tabs defaultValue={children[0].childId} className="space-y-6">
        <TabsList>
          {children.map(child => (
            <TabsTrigger key={child.childId} value={child.childId}>
              {child.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {children.map(child => (
          <TabsContent key={child.childId} value={child.childId} className="space-y-6">

            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="border-none shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="text-sm font-medium text-muted-foreground">{t('gradeLevelLabel')}</div>
                      <div className="text-2xl font-bold text-foreground">{child.gradeLevel}</div>
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
                      <div className={`text-2xl font-bold ${getGradeColor(child.gpa)}`}>
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
                      <div className={`text-2xl font-bold`} style={{ color: child.attendance >= 70 ? undefined : 'rgb(220 38 38)' }}>
                        {child.attendance}%
                      </div>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
                      <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                  <Progress value={child.attendance} className="h-1.5 mt-3" />
                </CardContent>
              </Card>

              <Card className="border-none shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="text-sm font-medium text-muted-foreground">{t('subjects')}</div>
                      <div className="text-2xl font-bold text-foreground">{child.subjectsCount}</div>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center">
                      <BookOpen className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Attendance + Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Attendance Card */}
              <Card className="border-none shadow-md">
                <CardHeader className="border-b border-border bg-muted/50">
                  <CardTitle>{t('attendance')}</CardTitle>
                  <CardDescription>{t('attendanceOverview', 'Attendance rate this term')}</CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">{t('attendanceRate', 'Attendance Rate')}</span>
                    <Badge className={getAttendanceBadgeColor(child.attendance)}>
                      {child.attendance}%
                    </Badge>
                  </div>
                  <Progress value={child.attendance} className="h-3" />
                  <p className="text-xs text-muted-foreground">
                    {child.attendance >= 90
                      ? t('excellentAttendance', 'Excellent attendance!')
                      : child.attendance >= 70
                      ? t('goodAttendance', 'Good attendance, keep it up.')
                      : t('lowAttendance', 'Attendance is below recommended level.')}
                  </p>
                  <div className="pt-2 border-t border-border">
                    <Button onClick={() => navigate('/parent/attendance')} variant="outline" className="w-full">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      {t('viewAttendanceDetails', 'View Attendance Details')}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* GPA Card */}
              <Card className="border-none shadow-md">
                <CardHeader className="border-b border-border bg-muted/50">
                  <CardTitle>{t('academicPerformance', 'Academic Performance')}</CardTitle>
                  <CardDescription>{t('gradeLevel', 'Grade level and GPA summary')}</CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">{t('gpa')}</span>
                    <span className={`text-2xl font-bold ${getGradeColor(child.gpa)}`}>{child.gpa.toFixed(1)}</span>
                  </div>
                  <Progress value={(child.gpa / 4) * 100} className="h-3" />
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>0.0</span>
                    <span>4.0</span>
                  </div>
                  <div className="pt-2 border-t border-border">
                    <Button onClick={() => navigate('/parent/grades')} variant="outline" className="w-full">
                      <FileText className="h-4 w-4 mr-2" />
                      {t('viewDetailedReport')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

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