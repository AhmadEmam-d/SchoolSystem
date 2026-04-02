import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Calendar as CalendarIcon, Download, Users, CheckCircle, XCircle, X, AlertCircle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { toast } from 'sonner';
import { api } from '../../../app/lib/api';

export function AdminAttendance() {
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [todayStats, setTodayStats] = useState(null);
  const [weeklyData, setWeeklyData] = useState([]);
  const [absentees, setAbsentees] = useState([]);
  const [loading, setLoading] = useState(true);
  const datePickerRef = React.useRef(null);
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  // Fetch today's attendance
  useEffect(() => {
    const fetchTodayAttendance = async () => {
      setLoading(true);
      try {
        const data = await api.attendance.getToday();
        if (data && data.success) {
          setTodayStats(data.data);
          setAbsentees(data.data?.recentAbsentees || []);
        }
      } catch (error) {
        console.error('Error fetching today attendance:', error);
        toast.error(t('errorFetchingData'));
      } finally {
        setLoading(false);
      }
    };
    fetchTodayAttendance();
  }, [date]);

  // Fetch weekly attendance
  useEffect(() => {
    const fetchWeeklyAttendance = async () => {
      try {
        const data = await api.attendance.getWeekly();
        if (data && data.success && data.data?.dailyData) {
          const formattedData = data.data.dailyData.map(day => ({
            name: day.day,
            present: day.present,
            absent: day.absent,
            attendanceRate: day.attendanceRate
          }));
          setWeeklyData(formattedData);
        }
      } catch (error) {
        console.error('Error fetching weekly attendance:', error);
      }
    };
    fetchWeeklyAttendance();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
        setShowDatePicker(false);
      }
    };
    if (showDatePicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDatePicker]);

  const formatDate = (date) => {
    return date.toLocaleDateString(isRTL ? 'ar-EG' : 'en-US', {
      weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
    });
  };

  const handleDateChange = (e) => {
    const newDate = new Date(e.target.value);
    setDate(newDate);
    setShowDatePicker(false);
  };

  const setToday = () => { setDate(new Date()); setShowDatePicker(false); };
  const setYesterday = () => { const d = new Date(); d.setDate(d.getDate() - 1); setDate(d); setShowDatePicker(false); };
  const setLastWeek = () => { const d = new Date(); d.setDate(d.getDate() - 7); setDate(d); setShowDatePicker(false); };

  const exportAttendanceReport = () => {
    const totalStudents = todayStats?.totalStudents || 0;
    const present = todayStats?.presentCount || 0;
    const absent = todayStats?.absentCount || 0;
    const late = todayStats?.lateCount || 0;

    const csvContent = [
      [t('attendancePage')],
      [t('date'), formatDate(date)],
      [''],
      [t('summary')],
      [t('status'), t('studentsCount'), t('percentage')],
      [t('present'), present, `${((present / totalStudents) * 100).toFixed(1)}%`],
      [t('absent'), absent, `${((absent / totalStudents) * 100).toFixed(1)}%`],
      [t('late'), late, '-'],
      [''],
      [t('weeklyAttendanceTrend')],
      [t('day'), t('present'), t('absent'), t('attendanceRate')],
      ...weeklyData.map(day => [day.name, day.present, day.absent, `${day.attendanceRate?.toFixed(1)}%`]),
      [''],
      [t('recentAbsentees')],
      [t('studentName'), t('grade')],
      ...absentees.map(student => [student.studentName, student.className]),
    ];
    const csvString = csvContent.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.setAttribute('href', URL.createObjectURL(blob));
    link.setAttribute('download', `attendance_report_${date.toISOString().split('T')[0]}.csv`);
    link.click();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">{t('loading')}</div>
      </div>
    );
  }

  const totalStudents = todayStats?.totalStudents || 0;
  const presentCount = todayStats?.presentCount || 0;
  const absentCount = todayStats?.absentCount || 0;
  const lateCount = todayStats?.lateCount || 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t('attendancePage')}</h1>
          <p className="text-muted-foreground mt-1">{formatDate(date)}</p>
        </div>
        <div className="flex gap-2 relative">
          <Button variant="outline" onClick={exportAttendanceReport}>
            <Download className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
            {t('exportReport')}
          </Button>
          <Button onClick={() => setShowDatePicker(!showDatePicker)}>
            <CalendarIcon className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
            {t('selectDate')}
          </Button>
          {showDatePicker && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowDatePicker(false)} />
              <div
                className={`absolute ${isRTL ? 'left-0' : 'right-0'} top-12 z-50 bg-card rounded-lg shadow-xl border border-border p-4 min-w-[280px]`}
                ref={datePickerRef}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-foreground">{t('selectDate')}</h3>
                  <button onClick={() => setShowDatePicker(false)} className="text-muted-foreground hover:text-foreground">
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="space-y-2 mb-3">
                  {[
                    { label: t('today'), fn: setToday },
                    { label: t('yesterday'), fn: setYesterday },
                    { label: t('lastWeek'), fn: setLastWeek },
                  ].map(({ label, fn }) => (
                    <button
                      key={label}
                      onClick={fn}
                      className={`w-full ${isRTL ? 'text-right' : 'text-left'} px-3 py-2 text-sm rounded-md hover:bg-muted text-foreground transition-colors`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <div className="border-t border-border pt-3">
                  <label className="block text-xs font-medium text-foreground mb-2">
                    {t('customDate')}
                  </label>
                  <input
                    type="date"
                    value={date.toISOString().split('T')[0]}
                    onChange={handleDateChange}
                    className="w-full px-3 py-2 text-sm border border-border rounded-md focus:ring-2 focus:ring-primary bg-input-background text-foreground"
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('presentToday')}</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{presentCount}</div>
            <p className="text-xs text-muted-foreground">
              {totalStudents > 0 ? ((presentCount / totalStudents) * 100).toFixed(1) : 0}% {t('ofTotalStudents')}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('absentToday')}</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{absentCount}</div>
            <p className="text-xs text-muted-foreground">
              {totalStudents > 0 ? ((absentCount / totalStudents) * 100).toFixed(1) : 0}% {t('ofTotalStudents')}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('lateArrivalsToday')}</CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{lateCount}</div>
            <p className="text-xs text-muted-foreground">{t('arrivedAfter830')}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{t('weeklyAttendanceTrend')}</CardTitle>
            <CardDescription>{t('attendanceLast5Days')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyData}>
                  <defs>
                    <linearGradient id="colorPresent" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--muted-foreground)' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--muted-foreground)' }} domain={[80, 100]} />
                  <Tooltip contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--foreground)' }} />
                  <Area type="monotone" dataKey="attendanceRate" stroke="#10b981" fillOpacity={1} fill="url(#colorPresent)" strokeWidth={2} name={t('attendanceRate')} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('recentAbsentees')}</CardTitle>
            <CardDescription>{t('studentsAbsentToday')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {absentees.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  {t('noAbsenteesToday')}
                </div>
              ) : (
                absentees.map((student, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400 font-bold text-xs">
                        {student.studentName?.substring(0, 2).toUpperCase() || 'ST'}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{student.studentName}</p>
                        <p className="text-xs text-muted-foreground">{student.className}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-xs h-8">{t('contactBtn')}</Button>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}