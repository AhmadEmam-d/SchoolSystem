import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TrendingUp, Award, BarChart3, Download, Loader2, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { toast } from 'sonner';
import { api } from '../../lib/api';

export function StudentGrades() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const [dashData, setDashData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGrades = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await api.studentGrades.getDashboard();
        if (!result.ok || !result.data) { setError('Failed to load grades.'); return; }
        setDashData(result.data);
      } catch (err) {
        setError('An unexpected error occurred.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchGrades();
  }, []);

  // ── Helpers ──────────────────────────────────────────────────────────────
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

  const getLetterGrade = (grade) => {
    if (grade >= 93) return 'A';
    if (grade >= 90) return 'A-';
    if (grade >= 87) return 'B+';
    if (grade >= 83) return 'B';
    if (grade >= 80) return 'B-';
    if (grade >= 77) return 'C+';
    if (grade >= 73) return 'C';
    if (grade >= 70) return 'C-';
    return 'F';
  };

  // ── Loading / Error ──────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !dashData) {
    return (
      <Card className="border-red-200 bg-red-50 dark:bg-red-900/20">
        <CardContent className="p-6 flex items-center gap-3 text-red-700 dark:text-red-400">
          <AlertCircle className="h-5 w-5" /><p>{error || 'Failed to load grades.'}</p>
        </CardContent>
      </Card>
    );
  }

  // ── Map API data ─────────────────────────────────────────────────────────
  const overallGPA    = dashData.overallGPA?.gpa ?? 0;
  const overallGrade  = dashData.overallGPA?.overallGrade ?? 0;
  const classRank     = dashData.classRank;
  const subjectGrades = dashData.subjectDetailedGrades ?? [];

  // Grade trend — zip months + values
  const trendData = (dashData.gradeTrend?.months ?? []).map((month, i) => ({
    month,
    grade: dashData.gradeTrend.values?.[i] ?? 0,
  }));

  // Radar data — zip subjects + grades
  const radarData = (dashData.subjectPerformance?.subjects ?? []).map((subject, i) => ({
    subject: subject.substring(0, 4),
    grade: dashData.subjectPerformance.grades?.[i] ?? 0,
  }));

  // ── Export ───────────────────────────────────────────────────────────────
  const handleExport = () => {
    toast.success(t('exportSuccess'));
    const reportData = [
      'Grade Report',
      `Generated on: ${new Date().toLocaleDateString()}`,
      `Overall GPA: ${overallGPA}`,
      `Overall Grade: ${overallGrade}%`,
      '',
      'Subjects:',
      ...subjectGrades.map(sg =>
        `${sg.subjectName}: assignments ${sg.components?.assignments ?? '—'}% | attendance ${sg.components?.attendance ?? '—'}%`
      ),
    ].join('\n');
    const blob = new Blob([reportData], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Grade_Report_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ── Main ─────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t('myGradesTitle')}</h1>
          <p className="text-muted-foreground mt-1">{t('myGradesDesc')}</p>
        </div>
        <Button variant="outline" onClick={handleExport}>
          <Download className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
          {t('downloadTranscript')}
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-none shadow-md"><CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-muted-foreground">{t('overallGPA')}</div>
              <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">
                {overallGPA.toFixed(2)}
              </div>
            </div>
            <div className="h-12 w-12 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center">
              <Award className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            </div>
          </div>
        </CardContent></Card>

        <Card className="border-none shadow-md"><CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-muted-foreground">{t('overallGradeLabel')}</div>
              <div className={`text-2xl font-bold mt-1 ${getGradeColor(overallGrade)}`}>{overallGrade}%</div>
            </div>
            <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </CardContent></Card>

        <Card className="border-none shadow-md"><CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-muted-foreground">{t('letterGradeLabel')}</div>
              <div className="text-2xl font-bold text-foreground mt-1">{getLetterGrade(overallGrade)}</div>
            </div>
            <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </CardContent></Card>

        <Card className="border-none shadow-md"><CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-muted-foreground">{t('classRankLabel')}</div>
              <div className="text-2xl font-bold text-foreground mt-1">
                {classRank?.rank ?? '—'}
              </div>
              {classRank && (
                <div className="text-xs text-muted-foreground mt-1">
                  out of {classRank.totalStudents}
                </div>
              )}
            </div>
            <div className="h-12 w-12 rounded-full bg-orange-100 dark:bg-orange-900/40 flex items-center justify-center">
              <Award className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </CardContent></Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-none shadow-md">
          <CardHeader>
            <CardTitle className="text-foreground">{t('gradeTrendTitle')}</CardTitle>
            <CardDescription className="text-muted-foreground">{t('academicProgressOverTime')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} className="fill-muted-foreground" />
                  <YAxis axisLine={false} tickLine={false} className="fill-muted-foreground" domain={[0, 100]} />
                  <Tooltip contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--foreground)' }} />
                  <Line type="monotone" dataKey="grade" stroke="#4f46e5" strokeWidth={3}
                    dot={{ fill: '#4f46e5', r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md">
          <CardHeader>
            <CardTitle className="text-foreground">{t('subjectPerformanceTitle')}</CardTitle>
            <CardDescription className="text-muted-foreground">{t('detailedGradesBySubject')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid className="stroke-muted" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: 'var(--muted-foreground)' }} />
                  <Radar name={t('gradesPageTitle')} dataKey="grade" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.5} />
                  <Tooltip contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--foreground)' }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Subject Breakdown */}
      {subjectGrades.length > 0 && (
        <Tabs defaultValue={subjectGrades[0].subjectName} className="space-y-6">
          <TabsList className={`grid w-full`} style={{ gridTemplateColumns: `repeat(${subjectGrades.length}, 1fr)` }}>
            {subjectGrades.map(sg => (
              <TabsTrigger key={sg.subjectName} value={sg.subjectName}>
                {sg.subjectName}
              </TabsTrigger>
            ))}
          </TabsList>

          {subjectGrades.map(sg => {
            const comp = sg.components ?? {};
            const exams = sg.exams ?? [];
            const assignments = sg.assignments ?? [];
            // overall for this subject — use assignments grade or average
            const subjectGrade = comp.assignments ?? comp.exams ?? 0;

            return (
              <TabsContent key={sg.subjectName} value={sg.subjectName} className="space-y-4">
                <Card className="border-none shadow-md">
                  <CardHeader className="border-b bg-muted/50">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-foreground">{sg.subjectName}</CardTitle>
                        {sg.teacherName && (
                          <CardDescription className="mt-1">{sg.teacherName}</CardDescription>
                        )}
                      </div>
                      <Badge className={getGradeBadgeColor(subjectGrade)}>
                        {subjectGrade}% ({getLetterGrade(subjectGrade)})
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    {/* Metrics */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        { label: t('examsTab'),         value: comp.exams         != null ? `${comp.exams}%`         : 'N/A' },
                        { label: t('assignmentsTab'),   value: comp.assignments   != null ? `${comp.assignments}%`   : 'N/A' },
                        { label: t('participationLabel'),value: comp.participation != null ? `${comp.participation}%` : 'N/A' },
                        { label: t('attendance'),        value: comp.attendance    != null ? `${comp.attendance}%`    : 'N/A' },
                      ].map(({ label, value }) => (
                        <div key={label}>
                          <div className="text-sm text-muted-foreground mb-2">{label}</div>
                          <div className="text-2xl font-bold text-foreground">{value}</div>
                        </div>
                      ))}
                    </div>

                    {/* Exams */}
                    {exams.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-foreground mb-3">{t('examsTab')}</h4>
                        <div className="space-y-3">
                          {exams.map((exam, idx) => (
                            <div key={idx} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                              <div>
                                <div className="font-medium text-foreground">{exam.title ?? exam.name}</div>
                                {exam.dueDate && (
                                  <div className="text-sm text-muted-foreground">
                                    {new Date(exam.dueDate).toLocaleDateString(isRTL ? 'ar-EG' : 'en-US')}
                                  </div>
                                )}
                              </div>
                              <div className={isRTL ? 'text-left' : 'text-right'}>
                                <Badge className={getGradeBadgeColor(exam.percentage ?? (exam.grade / exam.totalMarks * 100))}>
                                  {exam.grade}/{exam.totalMarks}
                                </Badge>
                                <div className="text-sm text-muted-foreground mt-1">
                                  {exam.percentage ?? Math.round(exam.grade / exam.totalMarks * 100)}%
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Assignments */}
                    {assignments.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-foreground mb-3">{t('assignmentsTab')}</h4>
                        <div className="space-y-3">
                          {assignments.map((assignment, idx) => (
                            <div key={idx} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                              <div>
                                <div className="font-medium text-foreground">{assignment.title ?? assignment.name}</div>
                                {assignment.dueDate && (
                                  <div className="text-sm text-muted-foreground">
                                    {new Date(assignment.dueDate).toLocaleDateString(isRTL ? 'ar-EG' : 'en-US')}
                                  </div>
                                )}
                              </div>
                              <div className={isRTL ? 'text-left' : 'text-right'}>
                                <Badge className={getGradeBadgeColor(assignment.percentage ?? (assignment.grade / assignment.totalMarks * 100))}>
                                  {assignment.grade}/{assignment.totalMarks}
                                </Badge>
                                <div className="text-sm text-muted-foreground mt-1">
                                  {assignment.percentage ?? Math.round(assignment.grade / assignment.totalMarks * 100)}%
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {exams.length === 0 && assignments.length === 0 && (
                      <p className="text-muted-foreground text-sm text-center py-4">No grades recorded yet.</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            );
          })}
        </Tabs>
      )}
    </div>
  );
}