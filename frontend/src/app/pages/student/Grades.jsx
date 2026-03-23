import React from 'react';
import { useTranslation } from 'react-i18next';
import { TrendingUp, Award, BarChart3, Download } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Progress } from '../../components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { toast } from 'sonner';

export function StudentGrades() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const subjectGrades = [
    {
      subject: 'Mathematics',
      currentGrade: 85,
      exams: [
        { name: 'Mid-Term Exam', score: 82, maxScore: 100, date: '2026-02-15' },
        { name: 'Quiz 1', score: 90, maxScore: 100, date: '2026-01-20' },
        { name: 'Quiz 2', score: 85, maxScore: 100, date: '2026-02-05' },
      ],
      assignments: [
        { name: 'Problem Set 1', score: 88, maxScore: 100, date: '2026-01-25' },
        { name: 'Problem Set 2', score: 92, maxScore: 100, date: '2026-02-10' },
      ],
      participation: 90,
      attendance: 92
    },
    {
      subject: 'Science',
      currentGrade: 92,
      exams: [
        { name: 'Lab Practical', score: 95, maxScore: 100, date: '2026-02-18' },
        { name: 'Theory Test', score: 88, maxScore: 100, date: '2026-01-28' },
      ],
      assignments: [
        { name: 'Lab Report 1', score: 94, maxScore: 100, date: '2026-01-30' },
        { name: 'Lab Report 2', score: 90, maxScore: 100, date: '2026-02-15' },
      ],
      participation: 95,
      attendance: 95
    },
    {
      subject: 'History',
      currentGrade: 88,
      exams: [
        { name: 'Essay Exam', score: 90, maxScore: 100, date: '2026-02-12' },
        { name: 'Quiz', score: 85, maxScore: 100, date: '2026-01-18' },
      ],
      assignments: [
        { name: 'Research Paper', score: 92, maxScore: 100, date: '2026-02-08' },
      ],
      participation: 85,
      attendance: 97
    },
    {
      subject: 'English',
      currentGrade: 90,
      exams: [
        { name: 'Literature Analysis', score: 92, maxScore: 100, date: '2026-02-20' },
      ],
      assignments: [
        { name: 'Essay 1', score: 88, maxScore: 100, date: '2026-01-22' },
        { name: 'Essay 2', score: 93, maxScore: 100, date: '2026-02-14' },
      ],
      participation: 92,
      attendance: 94
    },
    {
      subject: 'Art',
      currentGrade: 95,
      exams: [],
      assignments: [
        { name: 'Landscape Painting', score: 98, maxScore: 100, date: '2026-01-25' },
        { name: 'Still Life', score: 92, maxScore: 100, date: '2026-02-16' },
      ],
      participation: 100,
      attendance: 100
    },
  ];

  const trendData = [
    { month: 'Sep', grade: 78 },
    { month: 'Oct', grade: 82 },
    { month: 'Nov', grade: 85 },
    { month: 'Dec', grade: 87 },
    { month: 'Jan', grade: 89 },
    { month: 'Feb', grade: 90 },
  ];

  const radarData = subjectGrades.map(sg => ({
    subject: sg.subject.substring(0, 4),
    grade: sg.currentGrade,
  }));

  const overallGPA = (subjectGrades.reduce((sum, sg) => sum + sg.currentGrade, 0) / subjectGrades.length / 100 * 4).toFixed(2);
  const overallGrade = Math.round(subjectGrades.reduce((sum, sg) => sum + sg.currentGrade, 0) / subjectGrades.length);

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t('myGradesTitle')}</h1>
          <p className="text-muted-foreground mt-1">{t('myGradesDesc')}</p>
        </div>
        <Button variant="outline" onClick={() => {
          toast.success(t('exportSuccess'));
          const reportData = `Grade Report\nGenerated on: ${new Date().toLocaleDateString()}\nOverall GPA: ${overallGPA}\n\nSubjects:\n${subjectGrades.map(g => `${g.subject}: ${g.currentGrade}% (${getLetterGrade(g.currentGrade)})`).join('\n')}`;
          const blob = new Blob([reportData], { type: 'text/plain' });
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = `Grade_Report_${new Date().toISOString().split('T')[0]}.txt`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }}>
          <Download className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
          {t('downloadTranscript')}
        </Button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-none shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-muted-foreground">{t('overallGPA')}</div>
                <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">{overallGPA}</div>
              </div>
              <div className="h-12 w-12 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center">
                <Award className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-muted-foreground">{t('overallGradeLabel')}</div>
                <div className={`text-2xl font-bold mt-1 ${getGradeColor(overallGrade)}`}>{overallGrade}%</div>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-muted-foreground">{t('letterGradeLabel')}</div>
                <div className="text-2xl font-bold text-foreground mt-1">{getLetterGrade(overallGrade)}</div>
              </div>
              <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-muted-foreground">{t('classRankLabel')}</div>
                <div className="text-2xl font-bold text-foreground mt-1">5th</div>
                <div className="text-xs text-muted-foreground mt-1">out of 150</div>
              </div>
              <div className="h-12 w-12 rounded-full bg-orange-100 dark:bg-orange-900/40 flex items-center justify-center">
                <Award className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </CardContent>
        </Card>
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
                  <XAxis 
                    dataKey="month" 
                    axisLine={false} 
                    tickLine={false} 
                    className="fill-muted-foreground"
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    className="fill-muted-foreground" 
                    domain={[0, 100]} 
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'var(--card)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                      color: 'var(--foreground)'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="grade" 
                    stroke="#4f46e5" 
                    strokeWidth={3} 
                    dot={{ fill: '#4f46e5', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
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
                  <PolarAngleAxis 
                    dataKey="subject" 
                    tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} 
                  />
                  <PolarRadiusAxis 
                    angle={90} 
                    domain={[0, 100]} 
                    tick={{ fill: 'var(--muted-foreground)' }} 
                  />
                  <Radar 
                    name={t('gradesPageTitle')} 
                    dataKey="grade" 
                    stroke="#4f46e5" 
                    fill="#4f46e5" 
                    fillOpacity={0.5}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'var(--card)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                      color: 'var(--foreground)'
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Subject Breakdown */}
      <Tabs defaultValue={subjectGrades[0].subject} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          {subjectGrades.map(sg => (
            <TabsTrigger key={sg.subject} value={sg.subject}>
              {sg.subject}
            </TabsTrigger>
          ))}
        </TabsList>

        {subjectGrades.map(sg => (
          <TabsContent key={sg.subject} value={sg.subject} className="space-y-4">
            <Card className="border-none shadow-md">
              <CardHeader className="border-b bg-muted/50">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-foreground">{sg.subject}</CardTitle>
                    <CardDescription className="mt-2">{t('detailedGradesBySubject')}</CardDescription>
                  </div>
                  <Badge className={getGradeBadgeColor(sg.currentGrade)}>
                    {sg.currentGrade}% ({getLetterGrade(sg.currentGrade)})
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {/* Performance Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: t('examsTab'), value: sg.exams.length > 0 ? `${Math.round(sg.exams.reduce((sum, e) => sum + (e.score / e.maxScore * 100), 0) / sg.exams.length)}%` : 'N/A' },
                    { label: t('assignmentsTab'), value: sg.assignments.length > 0 ? `${Math.round(sg.assignments.reduce((sum, a) => sum + (a.score / a.maxScore * 100), 0) / sg.assignments.length)}%` : 'N/A' },
                    { label: t('participationLabel'), value: `${sg.participation}%` },
                    { label: t('attendance'), value: `${sg.attendance}%` },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <div className="text-sm text-muted-foreground mb-2">{label}</div>
                      <div className="text-2xl font-bold text-foreground">{value}</div>
                    </div>
                  ))}
                </div>

                {/* Exams */}
                {sg.exams.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-foreground mb-3">{t('examsTab')}</h4>
                    <div className="space-y-3">
                      {sg.exams.map((exam, idx) => (
                        <div key={`exam-${sg.subject}-${idx}`} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                          <div>
                            <div className="font-medium text-foreground">{exam.name}</div>
                            <div className="text-sm text-muted-foreground">{new Date(exam.date).toLocaleDateString(isRTL ? 'ar-EG' : 'en-US')}</div>
                          </div>
                          <div className={isRTL ? 'text-left' : 'text-right'}>
                            <Badge className={getGradeBadgeColor((exam.score / exam.maxScore) * 100)}>
                              {exam.score}/{exam.maxScore}
                            </Badge>
                            <div className="text-sm text-muted-foreground mt-1">
                              {Math.round((exam.score / exam.maxScore) * 100)}%
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Assignments */}
                {sg.assignments.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-foreground mb-3">{t('assignmentsTab')}</h4>
                    <div className="space-y-3">
                      {sg.assignments.map((assignment, idx) => (
                        <div key={`assignment-${sg.subject}-${idx}`} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                          <div>
                            <div className="font-medium text-foreground">{assignment.name}</div>
                            <div className="text-sm text-muted-foreground">{new Date(assignment.date).toLocaleDateString(isRTL ? 'ar-EG' : 'en-US')}</div>
                          </div>
                          <div className={isRTL ? 'text-left' : 'text-right'}>
                            <Badge className={getGradeBadgeColor((assignment.score / assignment.maxScore) * 100)}>
                              {assignment.score}/{assignment.maxScore}
                            </Badge>
                            <div className="text-sm text-muted-foreground mt-1">
                              {Math.round((assignment.score / assignment.maxScore) * 100)}%
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}