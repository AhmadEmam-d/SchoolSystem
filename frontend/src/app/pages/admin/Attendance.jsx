import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Calendar as CalendarIcon, Download, CheckCircle, XCircle, X, AlertCircle } from 'lucide-react';
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

  // ✅ FIXED
  useEffect(() => {
    const fetchTodayAttendance = async () => {
      setLoading(true);
      try {
        const data = await api.attendance.getToday();

        console.log("TODAY API:", data);

        if (data) {
          setTodayStats(data);
          setAbsentees(data.recentAbsentees || []);
        }

      } catch (error) {
        console.error(error);
        toast.error(t('errorFetchingData'));
      } finally {
        setLoading(false);
      }
    };

    fetchTodayAttendance();
  }, [date]);

  // ✅ FIXED
  useEffect(() => {
    const fetchWeeklyAttendance = async () => {
      try {
        const data = await api.attendance.getWeekly();

        console.log("WEEKLY API:", data);

        if (data && data.dailyData) {
          const formatted = data.dailyData.map(day => ({
            name: day.day,
            present: day.present,
            absent: day.absent,
            attendanceRate: day.attendanceRate
          }));

          setWeeklyData(formatted);
        }

      } catch (error) {
        console.error(error);
      }
    };

    fetchWeeklyAttendance();
  }, []);

  // UI helpers
  const formatDate = (date) => {
    return date.toLocaleDateString(isRTL ? 'ar-EG' : 'en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const totalStudents = todayStats?.totalStudents || 0;
  const presentCount = todayStats?.presentCount || 0;
  const absentCount = todayStats?.absentCount || 0;
  const lateCount = todayStats?.lateCount || 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div>{t('loading')}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t('attendancePage')}</h1>
          <p>{formatDate(date)}</p>
        </div>
      </div>

      {/* CARDS */}
      <div className="grid grid-cols-3 gap-6">

        <Card>
          <CardHeader>
            <CardTitle>{t('presentToday')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{presentCount}</div>
            <p>{totalStudents > 0 ? ((presentCount / totalStudents) * 100).toFixed(1) : 0}%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('absentToday')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{absentCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('late')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lateCount}</div>
          </CardContent>
        </Card>

      </div>

      {/* CHART */}
      <Card>
        <CardHeader>
          <CardTitle>{t('weeklyAttendanceTrend')}</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="attendanceRate" stroke="#22c55e" fill="#22c55e" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* ABSENTEES */}
      <Card>
        <CardHeader>
          <CardTitle>{t('recentAbsentees')}</CardTitle>
        </CardHeader>

        <CardContent>
          {absentees.length === 0 ? (
            <p>No absentees</p>
          ) : (
            absentees.map((s, i) => (
              <div key={i} className="flex justify-between py-2">
                <span>{s.studentName}</span>
                <span>{s.className}</span>
              </div>
            ))
          )}
        </CardContent>
      </Card>

    </div>
  );
}