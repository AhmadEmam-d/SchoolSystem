import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Download, FileText, TrendingUp, Users } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const ACADEMIC_PERFORMANCE_DATA = [
  { subject: 'Math', avg: 85, pass: 92 },
  { subject: 'Science', avg: 78, pass: 88 },
  { subject: 'History', avg: 82, pass: 95 },
  { subject: 'English', avg: 88, pass: 98 },
  { subject: 'Art', avg: 92, pass: 100 },
];

const ATTENDANCE_DISTRIBUTION_DATA = [
  { name: 'Present', value: 85, color: '#22c55e' },
  { name: 'Absent', value: 10, color: '#ef4444' },
  { name: 'Late', value: 5, color: '#eab308' },
];

export function AdminReports() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const attendanceData = [
    { name: t('present'), value: 85, color: '#22c55e' },
    { name: t('absent'), value: 10, color: '#ef4444' },
    { name: t('late'), value: 5, color: '#eab308' },
  ];

  const handleExportAll = () => {
    const academicHeaders = [t('subjectCol'), t('averageScore'), `${t('passRate')} (%)`];
    const academicRows = ACADEMIC_PERFORMANCE_DATA.map(item => [item.subject, item.avg, item.pass].join(','));
    const attendanceHeaders = [t('status'), t('percentage')];
    const attendanceRows = ATTENDANCE_DISTRIBUTION_DATA.map(item => [item.name, item.value].join(','));
    const csvContent = [
      t('academicPerformanceBySubject'),
      academicHeaders.join(','),
      ...academicRows,
      '',
      t('attendanceDistributionTitle'),
      attendanceHeaders.join(','),
      ...attendanceRows
    ].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.setAttribute('href', URL.createObjectURL(blob));
    link.setAttribute('download', `all_reports_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t('reportsPage')}</h1>
          <p className="text-muted-foreground mt-1">{t('reportsPageDesc')}</p>
        </div>
        <div className="flex gap-2">
          <Select defaultValue="current">
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder={t('academicYear')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="current">{t('currentYear')}</SelectItem>
              <SelectItem value="prev">{t('previousYear')}</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={handleExportAll}>
            <Download className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
            {t('exportAll')}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('academicPerformanceBySubject')}</CardTitle>
            <CardDescription>{t('averageScoresAndPassRates')}</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ACADEMIC_PERFORMANCE_DATA} key="academic-chart">
                <CartesianGrid key="grid" strokeDasharray="3 3" vertical={false} />
                <XAxis key="xaxis" dataKey="subject" />
                <YAxis key="yaxis" />
                <Tooltip key="tooltip" contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--foreground)' }} />
                <Legend key="legend" />
                <Bar key="bar-avg" dataKey="avg" name={t('averageScore')} fill="var(--chart-1)" radius={[4, 4, 0, 0]} />
                <Bar key="bar-pass" dataKey="pass" name={`${t('passRate')} (%)`} fill="var(--chart-2)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('attendanceDistributionTitle')}</CardTitle>
            <CardDescription>{t('overallAttendanceStatus')}</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart key="attendance-pie">
                <Pie
                  key="pie"
                  data={attendanceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {attendanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip key="tooltip" contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--foreground)' }} />
                <Legend key="legend" />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:bg-muted/50 cursor-pointer transition-colors border-l-4 border-l-blue-500">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/40 rounded-full text-blue-600 dark:text-blue-400">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{t('studentProgressReport')}</h3>
              <p className="text-sm text-muted-foreground">{t('generatePDFForAllStudents')}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:bg-muted/50 cursor-pointer transition-colors border-l-4 border-l-green-500">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-green-100 dark:bg-green-900/40 rounded-full text-green-600 dark:text-green-400">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{t('financialSummaryTitle')}</h3>
              <p className="text-sm text-muted-foreground">{t('incomeExpensesAndFees')}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:bg-muted/50 cursor-pointer transition-colors border-l-4 border-l-purple-500">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/40 rounded-full text-purple-600 dark:text-purple-400">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{t('teacherActivityLog')}</h3>
              <p className="text-sm text-muted-foreground">{t('loginHistoryAndActions')}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}