import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Clock, Check, X, TrendingUp, AlertCircle, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { api } from '../../lib/api';

export function ParentAttendance() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
       const data = await api.parents.getChildrenAttendance();
        const list = data?.children ?? [];
        setChildren(list);
      } catch (err) {
        console.error('Failed to fetch dashboard:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const normalizeStatus = (status) => status?.toLowerCase();

  const getStatusIcon = (status) => {
    switch (normalizeStatus(status)) {
      case 'present': return <Check className="h-4 w-4 text-green-600 dark:text-green-400" />;
      case 'absent':  return <X className="h-4 w-4 text-red-600 dark:text-red-400" />;
      case 'late':    return <Clock className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />;
      default:        return null;
    }
  };

  const getStatusBadge = (status) => {
    switch (normalizeStatus(status)) {
      case 'present': return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">{t('statusPresent')}</Badge>;
      case 'absent':  return <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">{t('statusAbsent')}</Badge>;
      case 'late':    return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">{t('statusLate')}</Badge>;
      default:        return null;
    }
  };

  const getAttendanceColor = (pct) => {
    if (pct >= 90) return 'text-green-600 dark:text-green-400';
    if (pct >= 70) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
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
          <h1 className="text-3xl font-bold text-foreground">{t('attendancePageParent')}</h1>
          <p className="text-muted-foreground mt-1">{t('monitorChildrenAttendance')}</p>
        </div>
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
          const stats         = child.attendanceStats ?? {};
          const overallPct    = stats.overallAttendancePercentage ?? child.attendance ?? 0;
          const presentDays   = stats.totalPresentDays ?? 0;
          const absentDays    = stats.totalAbsentDays  ?? 0;
          const lateDays      = stats.totalLateDays    ?? 0;
          const recentRecords = stats.recentRecords    ?? [];
          const monthlyTrend  = (stats.monthlyTrend ?? []).map(m => ({
            month:      m.month ?? m.monthName ?? '',
            attendance: m.attendancePercentage ?? m.attendance ?? 0,
          }));

          return (
            <TabsContent key={`content-${child.studentOid}-${index}`} value={child.studentOid} className="space-y-6">

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  {
                    label: t('overallAttendanceLabel'),
                    value: `${overallPct.toFixed(1)}%`,
                    color: getAttendanceColor(overallPct),
                    icon: <TrendingUp className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />,
                    bg: 'bg-indigo-100 dark:bg-indigo-900/40',
                  },
                  {
                    label: t('daysPresentLabel'),
                    value: presentDays,
                    color: 'text-green-600 dark:text-green-400',
                    icon: <Check className="h-6 w-6 text-green-600 dark:text-green-400" />,
                    bg: 'bg-green-100 dark:bg-green-900/40',
                  },
                  {
                    label: t('daysAbsentLabel'),
                    value: absentDays,
                    color: 'text-red-600 dark:text-red-400',
                    icon: <X className="h-6 w-6 text-red-600 dark:text-red-400" />,
                    bg: 'bg-red-100 dark:bg-red-900/40',
                  },
                  {
                    label: t('timesLateLabel'),
                    value: lateDays,
                    color: 'text-yellow-600 dark:text-yellow-400',
                    icon: <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />,
                    bg: 'bg-yellow-100 dark:bg-yellow-900/40',
                  },
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
              {monthlyTrend.length > 0 ? (
                <Card className="border-none shadow-md">
                  <CardHeader className="border-b border-border bg-muted/50">
                    <CardTitle>{t('attendanceTrendTitle')}</CardTitle>
                    <CardDescription>{t('monthlyAttendancePercentage')}</CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={monthlyTrend}>
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
              ) : (
                <Card className="border-none shadow-md">
                  <CardHeader className="border-b border-border bg-muted/50">
                    <CardTitle>{t('attendanceTrendTitle')}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 flex items-center justify-center h-32">
                    <p className="text-muted-foreground text-sm">{t('noTrendData', 'No monthly trend data available yet.')}</p>
                  </CardContent>
                </Card>
              )}

              {/* Recent Records */}
              <Card className="border-none shadow-md">
                <CardHeader className="border-b border-border bg-muted/50">
                  <CardTitle>{t('recentAttendanceTitle')}</CardTitle>
                  <CardDescription>{t('last5SchoolDays')}</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  {recentRecords.length === 0 ? (
                    <p className="text-muted-foreground text-sm">{t('noRecords', 'No recent records.')}</p>
                  ) : (
                    <div className="space-y-3">
                      {recentRecords.map((record, idx) => (
                        <div key={`record-${child.studentOid}-${idx}`} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                          <div className="flex items-center gap-3">
                            {getStatusIcon(record.status)}
                            <div className="font-medium text-foreground">
                              {record.dayName} —{' '}
                              {new Date(record.date).toLocaleDateString(
                                isRTL ? 'ar-EG' : 'en-US',
                                { month: 'short', day: 'numeric', year: 'numeric' }
                              )}
                            </div>
                          </div>
                          {getStatusBadge(record.status)}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Warning from backend */}
              {stats.warningMessage && (
                <Card className="border-none shadow-md bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-orange-600 dark:text-orange-400 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-orange-900 dark:text-orange-300">{t('attendanceAlert')}</h4>
                        <p className="text-sm text-orange-800 dark:text-orange-400 mt-1">{stats.warningMessage}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Fallback alert if attendance low and no warningMessage */}
              {!stats.warningMessage && overallPct < 70 && (
                <Card className="border-none shadow-md bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-orange-600 dark:text-orange-400 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-orange-900 dark:text-orange-300">{t('attendanceAlert')}</h4>
                        <p className="text-sm text-orange-800 dark:text-orange-400 mt-1">
                          {child.studentName} — {t('attendanceBelowAlert')}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}