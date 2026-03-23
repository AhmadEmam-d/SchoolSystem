import React from 'react';
import { useTranslation } from 'react-i18next';
import { TrendingUp, Award, Download, FileText } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Progress } from '../../components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function ParentGrades() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const childrenGrades = [
    {
      childId: 's1',
      childName: 'Bart Simpson',
      gpa: 2.8,
      overallGrade: 79,
      rank: '45th out of 150',
      trendData: [
        { month: 'Sep', grade: 72 },
        { month: 'Oct', grade: 75 },
        { month: 'Nov', grade: 76 },
        { month: 'Dec', grade: 78 },
        { month: 'Jan', grade: 77 },
        { month: 'Feb', grade: 79 },
      ],
      subjects: [
        {
          name: 'Mathematics',
          currentGrade: 78,
          exams: [
            { name: 'Mid-Term', score: 75, maxScore: 100, date: '2026-02-15' },
            { name: 'Quiz 1', score: 80, maxScore: 100, date: '2026-01-20' },
          ],
          assignments: [
            { name: 'Problem Set 1', score: 78, maxScore: 100, date: '2026-01-25' },
          ]
        },
        {
          name: 'Science',
          currentGrade: 82,
          exams: [
            { name: 'Lab Test', score: 85, maxScore: 100, date: '2026-02-18' },
          ],
          assignments: [
            { name: 'Lab Report', score: 80, maxScore: 100, date: '2026-02-10' },
          ]
        },
      ]
    },
    {
      childId: 's3',
      childName: 'Lisa Simpson',
      gpa: 4.0,
      overallGrade: 98,
      rank: '1st out of 120',
      trendData: [
        { month: 'Sep', grade: 97 },
        { month: 'Oct', grade: 98 },
        { month: 'Nov', grade: 97 },
        { month: 'Dec', grade: 98 },
        { month: 'Jan', grade: 99 },
        { month: 'Feb', grade: 98 },
      ],
      subjects: [
        {
          name: 'Mathematics',
          currentGrade: 98,
          exams: [
            { name: 'Mid-Term', score: 98, maxScore: 100, date: '2026-02-15' },
            { name: 'Quiz 1', score: 100, maxScore: 100, date: '2026-01-20' },
          ],
          assignments: [
            { name: 'Problem Set 1', score: 97, maxScore: 100, date: '2026-01-25' },
          ]
        },
        {
          name: 'Science',
          currentGrade: 100,
          exams: [
            { name: 'Lab Test', score: 100, maxScore: 100, date: '2026-02-18' },
          ],
          assignments: [
            { name: 'Lab Report', score: 100, maxScore: 100, date: '2026-02-10' },
          ]
        },
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
          <h1 className="text-3xl font-bold text-foreground">{t('gradesPageTitle')}</h1>
          <p className="text-muted-foreground mt-1">{t('monitorChildrenAcademicPerformance')}</p>
        </div>
        <Button variant="outline">
          <Download className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
          {t('downloadReportCards')}
        </Button>
      </div>

      <Tabs defaultValue={childrenGrades[0].childId} className="space-y-6">
        <TabsList>
          {childrenGrades.map(child => (
            <TabsTrigger key={child.childId} value={child.childId}>
              {child.childName}
            </TabsTrigger>
          ))}
        </TabsList>

        {childrenGrades.map(child => (
          <TabsContent key={child.childId} value={child.childId} className="space-y-6">
            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { label: t('gpa'), value: child.gpa.toFixed(1), color: getGradeColor(child.gpa * 25), icon: <Award className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />, bg: 'bg-indigo-100 dark:bg-indigo-900/40' },
                { label: t('overallGradeLabel'), value: `${child.overallGrade}%`, color: getGradeColor(child.overallGrade), icon: <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />, bg: 'bg-green-100 dark:bg-green-900/40' },
                { label: t('letterGradeLabel'), value: getLetterGrade(child.overallGrade), color: 'text-foreground', icon: <FileText className="h-6 w-6 text-purple-600 dark:text-purple-400" />, bg: 'bg-purple-100 dark:bg-purple-900/40' },
                { label: t('classRankLabel'), value: child.rank.split(' ')[0], color: 'text-foreground', sub: child.rank.substring(child.rank.indexOf(' ') + 1), icon: <Award className="h-6 w-6 text-orange-600 dark:text-orange-400" />, bg: 'bg-orange-100 dark:bg-orange-900/40' },
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
            <Card className="border-none shadow-md">
              <CardHeader className="border-b border-border bg-muted/50">
                <CardTitle>{t('gradeTrendTitle')}</CardTitle>
                <CardDescription>{t('academicProgressOverTime')}</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={child.trendData}>
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

            {/* Subject Breakdown */}
            <Card className="border-none shadow-md">
              <CardHeader className="border-b border-border bg-muted/50">
                <CardTitle>{t('subjectPerformanceTitle')}</CardTitle>
                <CardDescription>{t('detailedGradesBySubject')}</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {child.subjects.map((subject, idx) => (
                    <div key={idx} className="p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold text-foreground">{subject.name}</h4>
                        <Badge className={getGradeBadgeColor(subject.currentGrade)}>
                          {subject.currentGrade}% ({getLetterGrade(subject.currentGrade)})
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {subject.exams.length > 0 && (
                          <div>
                            <h5 className="text-sm font-medium text-foreground mb-2">{t('examsTab')}</h5>
                            <div className="space-y-2">
                              {subject.exams.map((exam, examIdx) => (
                                <div key={examIdx} className="flex items-center justify-between text-sm p-2 bg-card rounded">
                                  <span className="text-muted-foreground">{exam.name}</span>
                                  <Badge className={getGradeBadgeColor((exam.score / exam.maxScore) * 100)}>
                                    {exam.score}/{exam.maxScore}
                                  </Badge>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {subject.assignments.length > 0 && (
                          <div>
                            <h5 className="text-sm font-medium text-foreground mb-2">{t('assignmentsTab')}</h5>
                            <div className="space-y-2">
                              {subject.assignments.map((assignment, assignmentIdx) => (
                                <div key={assignmentIdx} className="flex items-center justify-between text-sm p-2 bg-card rounded">
                                  <span className="text-muted-foreground">{assignment.name}</span>
                                  <Badge className={getGradeBadgeColor((assignment.score / assignment.maxScore) * 100)}>
                                    {assignment.score}/{assignment.maxScore}
                                  </Badge>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="mt-3">
                        <Progress value={subject.currentGrade} className="h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}