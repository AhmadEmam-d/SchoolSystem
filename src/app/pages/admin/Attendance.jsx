import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Calendar as CalendarIcon, Download, Users, CheckCircle, XCircle, X } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { STUDENTS } from '../../lib/mockData';

export function AdminAttendance() {
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const datePickerRef = useRef(null);
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const attendanceData = [
    { name: t('monday').slice(0, 3), present: 95, absent: 5 },
    { name: t('tuesday').slice(0, 3), present: 92, absent: 8 },
    { name: t('wednesday').slice(0, 3), present: 96, absent: 4 },
    { name: t('thursday').slice(0, 3), present: 88, absent: 12 },
    { name: t('friday').slice(0, 3), present: 94, absent: 6 },
  ];

  const absentees = STUDENTS.slice(0, 3);

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
    const csvContent = [
      [t('attendancePage')],
      [t('date'), formatDate(date)],
      [''],
      [t('summary')],
      [t('status'), t('studentsCount'), t('percentage')],
      [t('present'), '412', '94%'],
      [t('absent'), '18', '6%'],
      [t('lateArrivalsToday'), '12', '-'],
      [''],
      [t('weeklyAttendanceTrend')],
      [t('day'), t('present'), t('absent')],
      ...attendanceData.map(day => [day.name, day.present.toString(), day.absent.toString()]),
      [''],
      [t('recentAbsentees')],
      [t('studentName'), t('grade')],
      ...absentees.map(student => [student.name, student.grade]),
    ];
    const csvString = csvContent.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.setAttribute('href', URL.createObjectURL(blob));
    link.setAttribute('download', `attendance_report_${date.toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
            <div className="text-2xl font-bold text-foreground">412</div>
            <p className="text-xs text-muted-foreground">94% {t('ofTotalStudents')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('absentToday')}</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">18</div>
            <p className="text-xs text-muted-foreground">6% {t('ofTotalStudents')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('lateArrivalsToday')}</CardTitle>
            <Users className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">12</div>
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
                <AreaChart data={attendanceData}>
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
                  <Area type="monotone" dataKey="present" stroke="#10b981" fillOpacity={1} fill="url(#colorPresent)" strokeWidth={2} name={t('present')} />
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
              {absentees.map(student => (
                <div key={student.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400 font-bold text-xs">
                      {student.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{student.name}</p>
                      <p className="text-xs text-muted-foreground">{student.grade}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="text-xs h-8">{t('contactBtn')}</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}