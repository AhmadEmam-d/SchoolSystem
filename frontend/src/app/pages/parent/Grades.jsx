import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TrendingUp, Award, Download, FileText, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Progress } from '../../components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { api } from '../../lib/api';

export function ParentGrades() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        setLoading(true);
        const data = await api.parents.getGrades();
        // data is the array directly: [ { studentOid, studentName, summary, gradeTrend, subjectPerformance }, ... ]
        const list = Array.isArray(data) ? data : [];
        setChildren(list);
      } catch (err) {
        console.error('Failed to fetch grades:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGrades();
  }, []);

  const getGradeColor = (pct) => {
    if (pct >= 90) return 'text-green-600 dark:text-green-400';
    if (pct >= 80) return 'text-blue-600 dark:text-blue-400';
    if (pct >= 70) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getGradeBadgeColor = (pct) => {
    if (pct >= 90) return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
    if (pct >= 80) return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
    if (pct >= 70) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
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
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t('gradesPageTitle')}</h1>
          <p className="text-muted-foreground mt-1">{t('monitorChildrenAcademicPerformance')}</p>
        </div>
        <Button variant="outline">
          <Download className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
          {t('downloadReportCards')}
        </Button>
      </div>

      <Tabs defaultValue={children[0].studentOid} className="space-y-6">
        <TabsList>
          {children.map((child, index) => (
            <TabsTrigger key={`tab-${child.studentOid}-${index}`} value={child.studentOid}>
              {child.studentName}
            </TabsTrigger>
          ))}
        </TabsList>

        {children.map((child, index) => {
          const summary   = child.summary ?? {};
          const gpa       = summary.gpa ?? 0;
          const overall   = summary.overallGrade ?? 0;
          const letter    = summary.letterGrade ?? 'N/A';
          const rank      = summary.classRank ?? '-';
          const total     = summary.totalStudentsInClass ?? '-';

          const trendData = (child.gradeTrend ?? []).map(m => ({
            month: m.month ?? '',
            grade: Math.round(m.averageScore ?? 0),
          }));

          const subjects = child.subjectPerformance ?? [];

          return (
            <TabsContent key={`content-${child.studentOid}-${index}`} value={child.studentOid} className="space-y-6">

              {/* Overview Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  {
                    label: t('gpa'),
                    value: gpa.toFixed(1),
                    color: getGradeColor(gpa * 25),
                    icon: <Award className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />,
                    bg: 'bg-indigo-100 dark:bg-indigo-900/40',
                  },
                  {
                    label: t('overallGradeLabel'),
                    value: overall > 0 ? `${overall}%` : '—',
                    color: getGradeColor(overall),
                    icon: <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />,
                    bg: 'bg-green-100 dark:bg-green-900/40',
                  },
                  {
                    label: t('letterGradeLabel'),
                    value: letter,
                    color: 'text-foreground',
                    icon: <FileText className="h-6 w-6 text-purple-600 dark:text-purple-400" />,
                    bg: 'bg-purple-100 dark:bg-purple-900/40',
                  },
                  {
                    label: t('classRankLabel'),
                    value: `#${rank}`,
                    color: 'text-foreground',
                    sub: `${t('outOf', 'out of')} ${total}`,
                    icon: <Award className="h-6 w-6 text-orange-600 dark:text-orange-400" />,
                    bg: 'bg-orange-100 dark:bg-orange-900/40',
                  },
                ].map(({ label, value, color, sub, icon, bg }) => (
                  <Card key={label} className="border-none shadow-md">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium text-muted-foreground">{label}</div>
                          <div className={`text-2xl font-bold mt-1 ${color}`}>{value}</div>
                          {sub && <div className="text-xs text-muted-foreground">{sub}</div>}
                        </div>
                        <div className={`h-12 w-12 rounded-full ${bg} flex items-center justify-center`}>{icon}</div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Grade Trend */}
              {trendData.length > 0 ? (
                <Card className="border-none shadow-md">
                  <CardHeader className="border-b border-border bg-muted/50">
                    <CardTitle>{t('gradeTrendTitle')}</CardTitle>
                    <CardDescription>{t('academicProgressOverTime')}</CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={trendData}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                          <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'var(--muted-foreground)' }} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--muted-foreground)' }} domain={[0, 100]} />
                          <Tooltip contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--foreground)' }} />
                          <Line type="monotone" dataKey="grade" stroke="var(--primary)" strokeWidth={3} dot={{ fill: 'var(--primary)', r: 4 }} name={t('gradesPageTitle')} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="border-none shadow-md">
                  <CardHeader className="border-b border-border bg-muted/50">
                    <CardTitle>{t('gradeTrendTitle')}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 flex items-center justify-center h-32">
                    <p className="text-muted-foreground text-sm">{t('noTrendData', 'No trend data available yet.')}</p>
                  </CardContent>
                </Card>
              )}

              {/* Subject Breakdown */}
              <Card className="border-none shadow-md">
                <CardHeader className="border-b border-border bg-muted/50">
                  <CardTitle>{t('subjectPerformanceTitle')}</CardTitle>
                  <CardDescription>{t('detailedGradesBySubject')}</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  {subjects.length === 0 ? (
                    <p className="text-muted-foreground text-sm">{t('noSubjectsFound', 'No subject data available.')}</p>
                  ) : (
                    <div className="space-y-6">
                      {subjects.map((subject, idx) => (
                        <div key={`subj-${child.studentOid}-${idx}`} className="p-4 bg-muted/50 rounded-lg">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-semibold text-foreground capitalize">{subject.subjectName}</h4>
                            <Badge className={getGradeBadgeColor(subject.subjectAverage)}>
                              {subject.subjectAverage > 0
                                ? `${Math.round(subject.subjectAverage)}%`
                                : '—'}{' '}
                              ({subject.letterGrade})
                            </Badge>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {subject.exams?.length > 0 && (
                              <div>
                                <h5 className="text-sm font-medium text-foreground mb-2">{t('examsTab')}</h5>
                                <div className="space-y-2">
                                  {subject.exams.map((exam, examIdx) => (
                                    <div key={`exam-${child.studentOid}-${idx}-${examIdx}`} className="flex items-center justify-between text-sm p-2 bg-card rounded">
                                      <span className="text-muted-foreground truncate max-w-[60%]">{exam.examName}</span>
                                      <Badge className={getGradeBadgeColor((exam.score / exam.maxScore) * 100)}>
                                        {exam.score}/{exam.maxScore}
                                      </Badge>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {subject.assignments?.length > 0 && (
                              <div>
                                <h5 className="text-sm font-medium text-foreground mb-2">{t('assignmentsTab')}</h5>
                                <div className="space-y-2">
                                  {subject.assignments.map((assignment, assignIdx) => (
                                    <div key={`assign-${child.studentOid}-${idx}-${assignIdx}`} className="flex items-center justify-between text-sm p-2 bg-card rounded">
                                      <span className="text-muted-foreground truncate max-w-[60%]">{assignment.assignmentName}</span>
                                      <Badge className={getGradeBadgeColor((assignment.score / assignment.maxScore) * 100)}>
                                        {assignment.score}/{assignment.maxScore}
                                      </Badge>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>

                          {subject.subjectAverage > 0 && (
                            <div className="mt-3">
                              <Progress value={subject.subjectAverage} className="h-2" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}