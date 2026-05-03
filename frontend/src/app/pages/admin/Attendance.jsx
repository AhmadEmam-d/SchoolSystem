import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Calendar as CalendarIcon, Download, CheckCircle, XCircle, X, AlertCircle, Users, UserCheck, UserX, Clock } from 'lucide-react';
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
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const datePickerRef = React.useRef(null);

  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  // Fetch classes for filtering
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const classesData = await api.classes?.getAll() || [];
        setClasses(classesData);
        if (classesData.length > 0) {
          setSelectedClass(classesData[0].oid);
        }
      } catch (error) {
        console.error("Error fetching classes:", error);
      }
    };
    fetchClasses();
  }, []);

  // Fetch Today's Attendance
  useEffect(() => {
    const fetchTodayAttendance = async () => {
      setLoading(true);
      try {
        const data = await api.attendance.getToday(selectedClass);
        
        console.log("📊 TODAY API Response:", data);

        // Handle different response structures
        let attendanceData = data;
        
        // If data has a nested structure
        if (data?.data) {
          attendanceData = data.data;
        }
        
        // If data has a success wrapper
        if (data?.success && data?.data) {
          attendanceData = data.data;
        }

        if (attendanceData) {
          setTodayStats({
            totalStudents: attendanceData.totalStudents || attendanceData.total || 0,
            presentCount: attendanceData.presentCount || attendanceData.present || 0,
            absentCount: attendanceData.absentCount || attendanceData.absent || 0,
            lateCount: attendanceData.lateCount || attendanceData.late || 0
          });
          
          setAbsentees(attendanceData.recentAbsentees || attendanceData.absentees || []);
        } else {
          // Set default empty state
          setTodayStats({
            totalStudents: 0,
            presentCount: 0,
            absentCount: 0,
            lateCount: 0
          });
          setAbsentees([]);
        }

      } catch (error) {
        console.error("Error fetching today's attendance:", error);
        toast.error(t('errorFetchingData'));
        setTodayStats({
          totalStudents: 0,
          presentCount: 0,
          absentCount: 0,
          lateCount: 0
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTodayAttendance();
  }, [date, selectedClass, t]);

  // Fetch Weekly Attendance
  useEffect(() => {
    const fetchWeeklyAttendance = async () => {
      try {
        const data = await api.attendance.getWeekly(selectedClass);
        
        console.log("📈 WEEKLY API Response:", data);

        // Handle different response structures
        let weeklyAttendance = data;
        
        if (data?.data) {
          weeklyAttendance = data.data;
        }
        
        if (data?.success && data?.data) {
          weeklyAttendance = data.data;
        }

        // Check if we have dailyData or array directly
        let dailyData = [];
        if (weeklyAttendance?.dailyData) {
          dailyData = weeklyAttendance.dailyData;
        } else if (Array.isArray(weeklyAttendance)) {
          dailyData = weeklyAttendance;
        } else if (weeklyAttendance?.data && Array.isArray(weeklyAttendance.data)) {
          dailyData = weeklyAttendance.data;
        }

        if (dailyData && dailyData.length > 0) {
          const formatted = dailyData.map(day => ({
            name: day.day || day.date || day.name,
            present: day.present || day.presentCount || 0,
            absent: day.absent || day.absentCount || 0,
            attendanceRate: day.attendanceRate || (day.present && day.total ? (day.present / day.total * 100) : 0)
          }));
          
          setWeeklyData(formatted);
        } else {
          // Demo data for empty state
          setWeeklyData([
            { name: 'Monday', present: 0, absent: 0, attendanceRate: 0 },
            { name: 'Tuesday', present: 0, absent: 0, attendanceRate: 0 },
            { name: 'Wednesday', present: 0, absent: 0, attendanceRate: 0 },
            { name: 'Thursday', present: 0, absent: 0, attendanceRate: 0 },
            { name: 'Friday', present: 0, absent: 0, attendanceRate: 0 },
          ]);
        }

      } catch (error) {
        console.error("Error fetching weekly attendance:", error);
        // Set empty weekly data on error
        setWeeklyData([]);
      }
    };

    fetchWeeklyAttendance();
  }, [selectedClass]);

  // UI helpers
  const formatDate = (date) => {
    return date.toLocaleDateString(isRTL ? 'ar-EG' : 'en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const totalStudents = todayStats?.totalStudents || 0;
  const presentCount = todayStats?.presentCount || 0;
  const absentCount = todayStats?.absentCount || 0;
  const lateCount = todayStats?.lateCount || 0;
  
  const attendancePercentage = totalStudents > 0 
    ? ((presentCount + lateCount) / totalStudents * 100).toFixed(1)
    : 0;

  const handleRefresh = () => {
    setDate(new Date());
    toast.info(t('refreshingData'));
  };

  const handleExport = () => {
    toast.info(t('exportFeatureComingSoon'));
  };

  if (loading && !todayStats) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-500">{t('loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">{t('attendancePage') || 'Attendance Dashboard'}</h1>
          <p className="text-gray-500 mt-1">{formatDate(date)}</p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleRefresh}
            className="flex items-center gap-2"
          >
            <CalendarIcon className="w-4 h-4" />
            {t('refresh') || 'Refresh'}
          </Button>
          
          <Button 
            variant="outline" 
            onClick={handleExport}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            {t('export') || 'Export'}
          </Button>
        </div>
      </div>

      {/* Class Filter (Optional) */}
      {classes.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('selectClass') || 'Select Class'}
          </label>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="w-full md:w-96 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
          >
            <option value="">{t('allClasses') || 'All Classes'}</option>
            {classes.map(cls => (
              <option key={cls.oid} value={cls.oid}>
                {cls.name || cls.className}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              {t('totalStudents') || 'Total Students'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalStudents}</div>
            <p className="text-blue-100 text-sm mt-1">{t('enrolled') || 'Enrolled'}</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="w-5 h-5" />
              {t('presentToday') || 'Present Today'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{presentCount}</div>
            <p className="text-green-100 text-sm mt-1">{attendancePercentage}% {t('attendance') || 'Attendance'}</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserX className="w-5 h-5" />
              {t('absentToday') || 'Absent Today'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{absentCount}</div>
            <p className="text-red-100 text-sm mt-1">{totalStudents > 0 ? ((absentCount / totalStudents) * 100).toFixed(1) : 0}%</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              {t('late') || 'Late'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{lateCount}</div>
            <p className="text-yellow-100 text-sm mt-1">{t('arrivedLate') || 'Arrived late'}</p>
          </CardContent>
        </Card>
      </div>

      {/* WEEKLY ATTENDANCE CHART */}
      <Card>
        <CardHeader>
          <CardTitle>{t('weeklyAttendanceTrend') || 'Weekly Attendance Trend'}</CardTitle>
          <CardDescription>
            {t('attendanceTrendDescription') || 'Attendance rate over the last 5 days'}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {weeklyData.length > 0 ? (
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip 
                    formatter={(value) => [`${value.toFixed(1)}%`, 'Attendance Rate']}
                    labelFormatter={(label) => `${label}`}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="attendanceRate" 
                    stroke="#22c55e" 
                    fill="#22c55e" 
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <AlertCircle className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <p>{t('noDataAvailable') || 'No attendance data available for this week'}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* RECENT ABSENTEES */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <XCircle className="w-5 h-5 text-red-500" />
            {t('recentAbsentees') || 'Recent Absentees'}
          </CardTitle>
          <CardDescription>
            {t('studentsNotPresentToday') || 'Students who are not present today'}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {absentees.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-500" />
              <p>{t('noAbsentees') || 'No absentees today! 🎉'}</p>
            </div>
          ) : (
            <div className="space-y-2">
              {absentees.map((student, i) => (
                <div key={i} className="flex justify-between items-center py-3 border-b last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                      <UserX className="w-4 h-4 text-red-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">
                        {student.studentName || student.name || `Student ${i + 1}`}
                      </p>
                      <p className="text-sm text-gray-500">
                        {student.className || student.class || 'Class not specified'}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm text-red-600 bg-red-50 px-2 py-1 rounded">
                    {t('absent') || 'Absent'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}