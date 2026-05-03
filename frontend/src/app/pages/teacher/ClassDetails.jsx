import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';

import { api } from '../../../app/lib/api';
import { useAuth } from '../../context/AuthContext';

import {
  ArrowLeft,
  Calendar,
  Clock,
  BarChart3,
  Award,
  TrendingUp
} from 'lucide-react';

export function TeacherClassDetails() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { classOid } = useParams(); // ✅ ID instead of name
  const { user } = useAuth();

  const [schedule, setSchedule] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user?.teacherId || !classOid) return;

        // =========================
        // 1️⃣ TIMETABLE
        // =========================
        const timetableRes = await api.timetable.getByTeacher(user.teacherId);

        console.log("📥 timetable:", timetableRes);

        const weekly = timetableRes?.data?.data?.weeklySchedule || {};

        let filtered = [];

        Object.keys(weekly).forEach(day => {
          weekly[day].forEach(item => {
            if (item.classOid === classOid) {
              filtered.push({
                day,
                time: item.time,
                subject: item.subjectName,
                room: item.room
              });
            }
          });
        });

        setSchedule(filtered);

        // =========================
        // 2️⃣ STATS
        // =========================
        const statsRes = await api.classes.getStats(classOid);

        console.log("📊 stats:", statsRes);

        setStats(statsRes?.data || null);

      } catch (err) {
        console.error("❌ Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [classOid, user]);

  if (loading) return <p className="p-6">Loading...</p>;

  if (!classOid) {
    return <p className="p-6 text-red-500">Invalid class</p>;
  }

  return (
    <div className="space-y-6">

      {/* ================= HEADER ================= */}
      <div>
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-3 -ml-2 gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('back')}
        </Button>

        <h1 className="text-3xl font-bold">Class Details</h1>
        <p className="text-gray-500 text-sm">{classOid}</p>
      </div>

      {/* ================= STATS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <Card>
          <CardContent className="p-6">
            <p>{t('averageAttendance')}</p>
            <h2 className="text-2xl font-bold text-green-600 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              {stats?.averageAttendance ?? 0}%
            </h2>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <p>{t('averageGrade')}</p>
            <h2 className="text-2xl font-bold text-blue-600 flex items-center gap-2">
              <Award className="h-4 w-4" />
              {stats?.averageGrade ?? 0}%
            </h2>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <p>{t('lessons')}</p>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              {stats?.completedLessons ?? 0}/{stats?.totalLessons ?? 0}
            </h2>
          </CardContent>
        </Card>

      </div>

      {/* ================= SCHEDULE ================= */}
      <Card>
        <CardHeader>
          <CardTitle>{t('weeklyScheduleLabel')}</CardTitle>
          <CardDescription>{t('classTimings')}</CardDescription>
        </CardHeader>

        <CardContent>
          {schedule.length === 0 ? (
            <p className="text-gray-500">No schedule found</p>
          ) : (
            <div className="space-y-3">
              {schedule.map((item, idx) => (
                <div
                  key={idx}
                  className="flex justify-between p-3 bg-indigo-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium">{item.day}</p>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {item.time}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-medium">{item.subject}</p>
                    <p className="text-xs text-gray-500">{item.room}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

    </div>
  );
}