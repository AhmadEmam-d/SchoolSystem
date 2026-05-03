import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Download, Filter, Calendar, AlertCircle } from 'lucide-react';
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
        let data = await api.classes?.getAll();
        
        console.log("📚 Classes API Response:", data);
        
        // Handle different response structures
        if (data?.success && data?.data) {
          data = data.data;
        }
        if (data?.data && Array.isArray(data.data)) {
          data = data.data;
        }
        if (!Array.isArray(data)) {
          data = [];
        }
        
        if (data && data.length > 0) {
          setClasses(data);
          setSelectedClass(data[0].oid);
        } else {
          // Demo classes if no data
          setClasses([]);
        }
      } catch (error) {
        console.error('Error fetching classes:', error);
        toast.error(t('errorFetchingData'));
        setClasses([]);
      }
    };
    fetchClasses();
  }, [t]);

  // Fetch monthly report when filters change
  useEffect(() => {
    const fetchMonthlyReport = async () => {
      if (!selectedClass) {
        setLoading(false);
        return;
      }
      
      setLoading(true);
      try {
        const response = await api.attendance.getMonthlyReport(selectedYear, selectedMonth, selectedClass);
        
        console.log("📊 Monthly Report API Response:", response);
        
        // Handle different response structures
        let report = response;
        
        if (response?.success && response?.data) {
          report = response.data;
        }
        if (response?.data) {
          report = response.data;
        }
        
        // Validate report structure
        if (report && (report.dailyData || report.attendanceRate !== undefined)) {
          setReportData({
            attendanceRate: report.attendanceRate || 0,
            totalAttendance: report.totalAttendance || 0,
            totalAbsences: report.totalAbsences || 0,
            lateArrivals: report.lateArrivals || 0,
            totalStudents: report.totalStudents || 0,
            schoolDays: report.schoolDays || 0,
            dailyData: report.dailyData || []
          });
        } else {
          // Set empty report data
          setReportData({
            attendanceRate: 0,
            totalAttendance: 0,
            totalAbsences: 0,
            lateArrivals: 0,
            totalStudents: 0,
            schoolDays: 0,
            dailyData: []
          });
          
          if (response && !response.success) {
            toast.error(response.message || t('noDataAvailable'));
          }
        }
      } catch (error) {
        console.error('Error fetching monthly report:', error);
        toast.error(t('errorFetchingData'));
        setReportData(null);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMonthlyReport();
  }, [selectedYear, selectedMonth, selectedClass, t]);

  const handleExport = () => {
    if (!reportData || !reportData.dailyData || reportData.dailyData.length === 0) {
      toast.error(t('noDataToExport'));
      return;
    }

    try {
      const headers = ['Day', 'Date', 'Present', 'Absent', 'Late', 'Total', 'Attendance Rate'];
      const rows = reportData.dailyData.map(day => [
        day.day || day.name || '-',
        day.date || '-',
        day.present || 0,
        day.absent || 0,
        day.late || 0,
        day.total || ((day.present || 0) + (day.absent || 0)),
        `${(day.attendanceRate || 0).toFixed(1)}%`
      ]);

      const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `monthly_attendance_${selectedYear}_${selectedMonth}_class_${selectedClass}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success(t('exportSuccess'));
    } catch (error) {
      console.error('Export error:', error);
      toast.error(t('exportFailed'));
    }
  };

  const getDayName = (index) => {
    const days = [t('sunday'), t('monday'), t('tuesday'), t('wednesday'), t('thursday')];
    return days[index % 5] || `Day ${index + 1}`;
  };

  // Loading state
  if (loading && !reportData) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-500">{t('loading') || 'Loading...'}</p>
        </div>
      </div>
    );
  }

  const chartData = reportData?.dailyData?.map((day, index) => ({
    day: day.day || getDayName(index),
    present: day.present || 0,
    absent: day.absent || 0,
    late: day.late || 0
  })) || [];

  const hasData = reportData && reportData.dailyData && reportData.dailyData.length > 0;

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/attendance')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-purple-600">
              {t('monthlyAttendanceReport') || 'Monthly Attendance Report'}
            </h1>
            <p className="text-gray-500 mt-1">
              {t('monthlyAttendanceReportDesc') || 'Track and analyze attendance patterns'}
            </p>
          </div>
        </div>
        
        {hasData && (
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Download className="h-5 w-5" />
            {t('exportCSV') || 'Export CSV'}
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <div className="flex items-center gap-6 flex-wrap">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">{t('year') || 'Year'}:</span>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white text-gray-700"
            >
              <option value={2026}>2026</option>
              <option value={2025}>2025</option>
              <option value={2024}>2024</option>
              <option value={2023}>2023</option>
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">{t('month') || 'Month'}:</span>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white text-gray-700"
            >
              <option value={1}>{t('january') || 'January'}</option>
              <option value={2}>{t('february') || 'February'}</option>
              <option value={3}>{t('march') || 'March'}</option>
              <option value={4}>{t('april') || 'April'}</option>
              <option value={5}>{t('may') || 'May'}</option>
              <option value={6}>{t('june') || 'June'}</option>
              <option value={7}>{t('july') || 'July'}</option>
              <option value={8}>{t('august') || 'August'}</option>
              <option value={9}>{t('september') || 'September'}</option>
              <option value={10}>{t('october') || 'October'}</option>
              <option value={11}>{t('november') || 'November'}</option>
              <option value={12}>{t('december') || 'December'}</option>
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">{t('class') || 'Class'}:</span>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white text-gray-700 min-w-[200px]"
            >
              {classes.length === 0 ? (
                <option value="">{t('noClassesAvailable') || 'No classes available'}</option>
              ) : (
                classes.map(cls => (
                  <option key={cls.oid} value={cls.oid}>
                    {cls.name || cls.className} {cls.level ? `- ${cls.level}` : ''}
                  </option>
                ))
              )}
            </select>
          </div>
        </div>
      </div>

      {/* No Data State */}
      {!hasData && !loading && (
        <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
          <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {t('noDataAvailable') || 'No Data Available'}
          </h3>
          <p className="text-gray-500">
            {t('noAttendanceDataForSelectedFilters') || 'No attendance records found for the selected filters'}
          </p>
        </div>
      )}

      {/* Report Content */}
      {hasData && (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
              <p className="text-sm text-green-100">{t('attendanceRate') || 'Attendance Rate'}</p>
              <p className="text-3xl font-bold mt-1">
                {reportData.attendanceRate?.toFixed(1) || 0}%
              </p>
              <p className="text-sm text-green-100 mt-1">
                {t('fromTotal') || 'From total'} {reportData.totalStudents || 0} {t('students') || 'students'}
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
              <p className="text-sm text-purple-100">{t('totalAttendance') || 'Total Attendance'}</p>
              <p className="text-3xl font-bold mt-1">
                {reportData.totalAttendance || 0}
              </p>
              <p className="text-sm text-purple-100 mt-1">
                {t('during') || 'During'} {reportData.schoolDays || 0} {t('schoolDays') || 'school days'}
              </p>
            </div>

            <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-6 text-white shadow-lg">
              <p className="text-sm text-red-100">{t('totalAbsences') || 'Total Absences'}</p>
              <p className="text-3xl font-bold mt-1">
                {reportData.totalAbsences || 0}
              </p>
              <p className="text-sm text-red-100 mt-1">
                {reportData.totalAttendance + reportData.totalAbsences > 0 
                  ? ((reportData.totalAbsences / (reportData.totalAttendance + reportData.totalAbsences)) * 100).toFixed(1) 
                  : 0}% {t('ofTotal') || 'of total'}
              </p>
            </div>

            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
              <p className="text-sm text-orange-100">{t('lateArrivals') || 'Late Arrivals'}</p>
              <p className="text-3xl font-bold mt-1">
                {reportData.lateArrivals || 0}
              </p>
              <p className="text-sm text-orange-100 mt-1">
                {reportData.totalAttendance + reportData.totalAbsences > 0 
                  ? ((reportData.lateArrivals / (reportData.totalAttendance + reportData.totalAbsences)) * 100).toFixed(1) 
                  : 0}% {t('ofTotal') || 'of total'}
              </p>
            </div>
          </div>

          {/* Chart */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              {t('dailyAttendanceTrend') || 'Daily Attendance Trend'}
            </h2>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="day" tick={{ fill: '#6b7280' }} />
                <YAxis tick={{ fill: '#6b7280' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb', 
                    borderRadius: '8px',
                    color: '#1f2937'
                  }} 
                />
                <Legend />
                <Bar dataKey="present" fill="#10b981" name={t('present') || 'Present'} radius={[4, 4, 0, 0]} />
                <Bar dataKey="absent" fill="#ef4444" name={t('absent') || 'Absent'} radius={[4, 4, 0, 0]} />
                <Bar dataKey="late" fill="#f59e0b" name={t('late') || 'Late'} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Details Table */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200 bg-gray-50">
              <h2 className="text-xl font-bold text-gray-800">
                {t('dailyAttendanceDetails') || 'Daily Attendance Details'}
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('day') || 'Day'}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('date') || 'Date'}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('present') || 'Present'}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('absent') || 'Absent'}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('late') || 'Late'}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('attendanceRate') || 'Rate'}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {reportData.dailyData.map((day, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {day.day || getDayName(index)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {day.date || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          {day.present || 0}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                          {day.absent || 0}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800">
                          {day.late || 0}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        {(day.attendanceRate || 0).toFixed(1)}%
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