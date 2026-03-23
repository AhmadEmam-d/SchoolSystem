import React from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, Clock, Check, X, TrendingUp, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function ParentAttendance() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const childrenAttendance = [
    {
      childId: 's1',
      childName: 'Bart Simpson',
      overallAttendance: 85,
      monthlyData: [
        { month: 'Sep', attendance: 78 },
        { month: 'Oct', attendance: 82 },
        { month: 'Nov', attendance: 80 },
        { month: 'Dec', attendance: 85 },
        { month: 'Jan', attendance: 88 },
        { month: 'Feb', attendance: 87 },
      ],
      recentRecords: [
        { date: '2026-03-01', status: 'present' },
        { date: '2026-03-02', status: 'present' },
        { date: '2026-03-03', status: 'late' },
        { date: '2026-03-04', status: 'absent', subject: 'History' },
        { date: '2026-03-05', status: 'present' },
      ],
      subjectWise: [
        { subject: 'Mathematics', attendance: 88, present: 22, total: 25 },
        { subject: 'Science', attendance: 84, present: 21, total: 25 },
        { subject: 'History', attendance: 80, present: 20, total: 25 },
        { subject: 'English', attendance: 92, present: 23, total: 25 },
      ]
    },
    {
      childId: 's3',
      childName: 'Lisa Simpson',
      overallAttendance: 100,
      monthlyData: [
        { month: 'Sep', attendance: 100 },
        { month: 'Oct', attendance: 100 },
        { month: 'Nov', attendance: 100 },
        { month: 'Dec', attendance: 100 },
        { month: 'Jan', attendance: 100 },
        { month: 'Feb', attendance: 100 },
      ],
      recentRecords: [
        { date: '2026-03-01', status: 'present' },
        { date: '2026-03-02', status: 'present' },
        { date: '2026-03-03', status: 'present' },
        { date: '2026-03-04', status: 'present' },
        { date: '2026-03-05', status: 'present' },
      ],
      subjectWise: [
        { subject: 'Mathematics', attendance: 100, present: 25, total: 25 },
        { subject: 'Science', attendance: 100, present: 25, total: 25 },
        { subject: 'History', attendance: 100, present: 25, total: 25 },
        { subject: 'English', attendance: 100, present: 25, total: 25 },
      ]
    },
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'present': return <Check className="h-4 w-4 text-green-600 dark:text-green-400" />;
      case 'absent': return <X className="h-4 w-4 text-red-600 dark:text-red-400" />;
      case 'late': return <Clock className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />;
      default: return null;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'present': return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">{t('statusPresent')}</Badge>;
      case 'absent': return <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">{t('statusAbsent')}</Badge>;
      case 'late': return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">{t('statusLate')}</Badge>;
      default: return null;
    }
  };

  const getAttendanceColor = (attendance) => {
    if (attendance >= 95) return 'text-green-600 dark:text-green-400';
    if (attendance >= 85) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t('attendancePageParent')}</h1>
          <p className="text-muted-foreground mt-1">{t('monitorChildrenAttendance')}</p>
        </div>
      </div>

      <Tabs defaultValue={childrenAttendance[0].childId} className="space-y-6">
        <TabsList>
          {childrenAttendance.map(child => (
            <TabsTrigger key={child.childId} value={child.childId}>
              {child.childName}
            </TabsTrigger>
          ))}
        </TabsList>

        {childrenAttendance.map(child => (
          <TabsContent key={child.childId} value={child.childId} className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { label: t('overallAttendanceLabel'), value: `${child.overallAttendance}%`, color: getAttendanceColor(child.overallAttendance), icon: <TrendingUp className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />, bg: 'bg-indigo-100 dark:bg-indigo-900/40' },
                { label: t('daysPresentLabel'), value: child.recentRecords.filter(r => r.status === 'present').length, color: 'text-green-600 dark:text-green-400', icon: <Check className="h-6 w-6 text-green-600 dark:text-green-400" />, bg: 'bg-green-100 dark:bg-green-900/40' },
                { label: t('daysAbsentLabel'), value: child.recentRecords.filter(r => r.status === 'absent').length, color: 'text-red-600 dark:text-red-400', icon: <X className="h-6 w-6 text-red-600 dark:text-red-400" />, bg: 'bg-red-100 dark:bg-red-900/40' },
                { label: t('timesLateLabel'), value: child.recentRecords.filter(r => r.status === 'late').length, color: 'text-yellow-600 dark:text-yellow-400', icon: <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />, bg: 'bg-yellow-100 dark:bg-yellow-900/40' },
              ].map(({ label, value, color, icon, bg }) => (
                <Card key={label} className="border-none shadow-md">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium text-muted-foreground">{label}</div>
                        <div className={`text-2xl font-bold mt-1 ${color}`}>{value}</div>
                      </div>
                      <div className={`h-12 w-12 rounded-full ${bg} flex items-center justify-center`}>{icon}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Attendance Trend */}
            <Card className="border-none shadow-md">
              <CardHeader className="border-b border-border bg-muted/50">
                <CardTitle>{t('attendanceTrendTitle')}</CardTitle>
                <CardDescription>{t('monthlyAttendancePercentage')}</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={child.monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'var(--muted-foreground)' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--muted-foreground)' }} domain={[0, 100]} />
                      <Tooltip contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--foreground)' }} />
                      <Line type="monotone" dataKey="attendance" stroke="var(--primary)" strokeWidth={3} dot={{ fill: 'var(--primary)', r: 4 }} name={t('attendance')} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Attendance */}
              <Card className="border-none shadow-md">
                <CardHeader className="border-b border-border bg-muted/50">
                  <CardTitle>{t('recentAttendanceTitle')}</CardTitle>
                  <CardDescription>{t('last5SchoolDays')}</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    {child.recentRecords.map((record, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(record.status)}
                          <div>
                            <div className="font-medium text-foreground">
                              {new Date(record.date).toLocaleDateString(isRTL ? 'ar-EG' : 'en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                            </div>
                            {record.subject && (
                              <div className="text-sm text-muted-foreground">
                                {t('missedLabel')}: {record.subject}
                              </div>
                            )}
                          </div>
                        </div>
                        {getStatusBadge(record.status)}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Subject-wise Attendance */}
              <Card className="border-none shadow-md">
                <CardHeader className="border-b border-border bg-muted/50">
                  <CardTitle>{t('subjectWiseAttendanceTitle')}</CardTitle>
                  <CardDescription>{t('attendanceBreakdownBySubject')}</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {child.subjectWise.map((subject, idx) => (
                      <div key={idx}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-foreground">{subject.subject}</span>
                          <div className="text-sm text-muted-foreground">
                            <span className={`font-semibold ${getAttendanceColor(subject.attendance)}`}>
                              {subject.attendance}%
                            </span>
                            <span className="text-muted-foreground/70 ml-2">
                              ({subject.present}/{subject.total})
                            </span>
                          </div>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              subject.attendance >= 95 ? 'bg-green-600' :
                              subject.attendance >= 85 ? 'bg-yellow-600' :
                              'bg-red-600'
                            }`}
                            style={{ width: `${subject.attendance}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Attendance Alert */}
            {child.overallAttendance < 90 && (
              <Card className="border-none shadow-md bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-orange-600 dark:text-orange-400 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-orange-900 dark:text-orange-300">{t('attendanceAlert')}</h4>
                      <p className="text-sm text-orange-800 dark:text-orange-400 mt-1">
                        {child.childName} - {t('attendanceBelowAlert')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}