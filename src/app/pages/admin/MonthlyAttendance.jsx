import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Download, Filter, Calendar } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const monthlyData = [
  { day: '1', present: 445, absent: 5, late: 2 },
  { day: '2', present: 448, absent: 4, late: 0 },
  { day: '3', present: 442, absent: 8, late: 2 },
  { day: '4', present: 450, absent: 2, late: 0 },
  { day: '5', present: 446, absent: 6, late: 0 },
  { day: '6', present: 443, absent: 7, late: 2 },
  { day: '7', present: 449, absent: 3, late: 0 },
  { day: '8', present: 445, absent: 5, late: 2 },
  { day: '9', present: 447, absent: 5, late: 0 },
  { day: '10', present: 444, absent: 6, late: 2 },
];

const getDayName = (index, t) => {
  const days = [t('sunday'), t('monday'), t('tuesday'), t('wednesday'), t('thursday')];
  return days[index % 5];
};

export function MonthlyAttendance() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [selectedMonth, setSelectedMonth] = useState('2024-02');
  const [selectedClass, setSelectedClass] = useState('all');

  const handleExport = () => {
    // Prepare CSV content
    const headers = ['Day', 'Present', 'Absent', 'Late', 'Total'];
    const csvContent = [
      headers.join(','),
      ...monthlyData.map((data, index) => [
        `"Day ${data.day}"`,
        data.present,
        data.absent,
        data.late,
        data.present + data.absent + data.late
      ].join(','))
    ].join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `monthly_attendance_${selectedMonth}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
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

      {/* Filters */}
      <div className="bg-card rounded-xl p-6 border border-border">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">{t('month')}:</span>
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary bg-input-background text-foreground"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">{t('class')}:</span>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary bg-input-background text-foreground"
            >
              <option value="all">{t('allClasses')}</option>
              <option value="1">{t('grade1')}</option>
              <option value="2">{t('grade2')}</option>
              <option value="3">{t('grade3')}</option>
              <option value="4">{t('grade4')}</option>
              <option value="5">{t('grade5')}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-card rounded-xl p-6 border border-border">
          <div>
            <p className="text-sm text-muted-foreground">{t('attendanceRate')}</p>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-1">98.5%</p>
            <p className="text-sm text-muted-foreground mt-1">{t('fromTotal')} 452 {t('students')}</p>
          </div>
        </div>

        <div className="bg-card rounded-xl p-6 border border-border">
          <div>
            <p className="text-sm text-muted-foreground">{t('totalAttendance')}</p>
            <p className="text-3xl font-bold text-purple-600 dark:text-purple-400 mt-1">4,458</p>
            <p className="text-sm text-muted-foreground mt-1">{t('during')} 10 {t('schoolDays')}</p>
          </div>
        </div>

        <div className="bg-card rounded-xl p-6 border border-border">
          <div>
            <p className="text-sm text-muted-foreground">{t('totalAbsences')}</p>
            <p className="text-3xl font-bold text-red-600 dark:text-red-400 mt-1">51</p>
            <p className="text-sm text-muted-foreground mt-1">1.1% {t('fromTotalAbsences')}</p>
          </div>
        </div>

        <div className="bg-card rounded-xl p-6 border border-border">
          <div>
            <p className="text-sm text-muted-foreground">{t('lateArrivals')}</p>
            <p className="text-3xl font-bold text-orange-600 dark:text-orange-400 mt-1">10</p>
            <p className="text-sm text-muted-foreground mt-1">0.2% {t('fromTotalAbsences')}</p>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-card rounded-xl p-6 border border-border">
        <h2 className="text-xl font-bold text-foreground mb-6">{t('dailyAttendanceTrend')}</h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="day" tick={{ fill: 'var(--muted-foreground)' }} label={{ value: t('day'), position: 'insideBottom', offset: -5, fill: 'var(--muted-foreground)' }} />
            <YAxis tick={{ fill: 'var(--muted-foreground)' }} label={{ value: t('numberOfStudents'), angle: -90, position: 'insideLeft', fill: 'var(--muted-foreground)' }} />
            <Tooltip contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--foreground)' }} />
            <Legend />
            <Bar dataKey="present" fill="var(--chart-2)" name={t('present')} />
            <Bar dataKey="absent" fill="var(--chart-5)" name={t('absent')} />
            <Bar dataKey="late" fill="var(--chart-3)" name={t('late')} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Detailed Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-bold text-foreground">{t('dailyAttendanceDetails')}</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase">{t('day')}</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase">{t('date')}</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase">{t('present')}</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase">{t('absent')}</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase">{t('late')}</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase">{t('percentage')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {monthlyData.map((row, index) => (
                <tr key={index} className="hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                    {getDayName(index, t)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                    2024-02-{row.day.padStart(2, '0')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 rounded-full">
                      {row.present}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 rounded-full">
                      {row.absent}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-400 rounded-full">
                      {row.late}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-foreground">
                    {((row.present / (row.present + row.absent + row.late)) * 100).toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}