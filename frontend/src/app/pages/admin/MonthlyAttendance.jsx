import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Download, Filter, Calendar } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { toast } from 'sonner';
import { api } from '../../../app/lib/api';

export function MonthlyAttendance() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedClass, setSelectedClass] = useState('');
  const [classes, setClasses] = useState([]);
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch classes
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const data = await api.classes.getAll();
        if (data && data.length > 0) {
          setClasses(data);
          setSelectedClass(data[0].oid);
        }
      } catch (error) {
        console.error('Error fetching classes:', error);
        toast.error(t('errorFetchingData'));
      }
    };
    fetchClasses();
  }, []);

  // Fetch monthly report when filters change
  useEffect(() => {
    const fetchMonthlyReport = async () => {
      if (selectedClass) {
        setLoading(true);
        try {
          const data = await api.attendance.getMonthlyReport(selectedYear, selectedMonth, selectedClass);
          if (data && data.success) {
            setReportData(data.data);
          } else {
            setReportData(null);
          }
        } catch (error) {
          console.error('Error fetching monthly report:', error);
          toast.error(t('errorFetchingData'));
        } finally {
          setLoading(false);
        }
      }
    };
    fetchMonthlyReport();
  }, [selectedYear, selectedMonth, selectedClass]);

  const handleExport = () => {
    if (!reportData) return;

    const headers = ['Day', 'Date', 'Present', 'Absent', 'Late', 'Total', 'Attendance Rate'];
    const rows = reportData.dailyData.map(day => [
      day.day,
      day.date,
      day.present,
      day.absent,
      day.late,
      day.total,
      `${day.attendanceRate?.toFixed(1)}%`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `monthly_attendance_${selectedYear}_${selectedMonth}.csv`);
    link.click();
  };

  const getDayName = (index) => {
    const days = [t('sunday'), t('monday'), t('tuesday'), t('wednesday'), t('thursday')];
    return days[index % 5];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">{t('loading')}</div>
      </div>
    );
  }

  const chartData = reportData?.dailyData?.map(day => ({
    day: day.day,
    present: day.present,
    absent: day.absent,
    late: day.late
  })) || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/attendance')}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-muted-foreground" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-purple-600 dark:text-purple-400">{t('monthlyAttendanceReport')}</h1>
            <p className="text-muted-foreground mt-1">{t('monthlyAttendanceReportDesc')}</p>
          </div>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Download className="h-5 w-5" />
          {t('exportPDF')}
        </button>
      </div>

      <div className="bg-card rounded-xl p-6 border border-border">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">{t('year')}:</span>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary bg-input-background text-foreground"
            >
              <option value={2026}>2026</option>
              <option value={2025}>2025</option>
              <option value={2024}>2024</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">{t('month')}:</span>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              className="px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary bg-input-background text-foreground"
            >
              <option value={1}>{t('january')}</option>
              <option value={2}>{t('february')}</option>
              <option value={3}>{t('march')}</option>
              <option value={4}>{t('april')}</option>
              <option value={5}>{t('may')}</option>
              <option value={6}>{t('june')}</option>
              <option value={7}>{t('july')}</option>
              <option value={8}>{t('august')}</option>
              <option value={9}>{t('september')}</option>
              <option value={10}>{t('october')}</option>
              <option value={11}>{t('november')}</option>
              <option value={12}>{t('december')}</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">{t('class')}:</span>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary bg-input-background text-foreground"
            >
              {classes.map(cls => (
                <option key={cls.oid} value={cls.oid}>
                  {cls.name} - {cls.level}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {reportData && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-card rounded-xl p-6 border border-border">
              <p className="text-sm text-muted-foreground">{t('attendanceRate')}</p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-1">
                {reportData.attendanceRate?.toFixed(1)}%
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {t('fromTotal')} {reportData.totalStudents} {t('students')}
              </p>
            </div>

            <div className="bg-card rounded-xl p-6 border border-border">
              <p className="text-sm text-muted-foreground">{t('totalAttendance')}</p>
              <p className="text-3xl font-bold text-purple-600 dark:text-purple-400 mt-1">
                {reportData.totalAttendance}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {t('during')} {reportData.schoolDays} {t('schoolDays')}
              </p>
            </div>

            <div className="bg-card rounded-xl p-6 border border-border">
              <p className="text-sm text-muted-foreground">{t('totalAbsences')}</p>
              <p className="text-3xl font-bold text-red-600 dark:text-red-400 mt-1">
                {reportData.totalAbsences}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {((reportData.totalAbsences / (reportData.totalAttendance + reportData.totalAbsences)) * 100).toFixed(1)}% {t('fromTotal')}
              </p>
            </div>

            <div className="bg-card rounded-xl p-6 border border-border">
              <p className="text-sm text-muted-foreground">{t('lateArrivals')}</p>
              <p className="text-3xl font-bold text-orange-600 dark:text-orange-400 mt-1">
                {reportData.lateArrivals}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {((reportData.lateArrivals / (reportData.totalAttendance + reportData.totalAbsences)) * 100).toFixed(1)}% {t('fromTotal')}
              </p>
            </div>
          </div>

          <div className="bg-card rounded-xl p-6 border border-border">
            <h2 className="text-xl font-bold text-foreground mb-6">{t('dailyAttendanceTrend')}</h2>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="day" tick={{ fill: 'var(--muted-foreground)' }} />
                <YAxis tick={{ fill: 'var(--muted-foreground)' }} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--foreground)' }} />
                <Legend />
                <Bar dataKey="present" fill="#10b981" name={t('present')} />
                <Bar dataKey="absent" fill="#ef4444" name={t('absent')} />
                <Bar dataKey="late" fill="#f59e0b" name={t('late')} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="p-6 border-b border-border">
              <h2 className="text-xl font-bold text-foreground">{t('dailyAttendanceDetails')}</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">{t('day')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">{t('date')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">{t('present')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">{t('absent')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">{t('late')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">{t('percentage')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {reportData.dailyData.map((day, index) => (
                    <tr key={index} className="hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                        {getDayName(index)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                        {day.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 rounded-full">
                          {day.present}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 rounded-full">
                          {day.absent}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-400 rounded-full">
                          {day.late}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-foreground">
                        {day.attendanceRate?.toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}