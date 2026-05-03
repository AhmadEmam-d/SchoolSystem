import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { Calendar, Clock, Users, BookOpen, Eye, ClipboardCheck } from "lucide-react";
import { toast } from "sonner";
import { api } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';

export function TeacherClasses() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useAuth();

  const [schedule, setSchedule] = useState({});
  const [loading, setLoading] = useState(true);

  // كل أيام الأسبوع (حتى الفاضي)
  const weekDays = ["Saturday","Sunday","Monday","Tuesday","Wednesday","Thursday"];

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const teacherId = user?.teacherId || localStorage.getItem("teacherId");

        if (!teacherId) return;

        setLoading(true);

        const res = await api.timetable.getByTeacher(teacherId);

        console.log("API RAW:", res);

        // ✅ الحل هنا
        const weekly = res?.data?.data?.weeklySchedule || {};

        console.log("FINAL SCHEDULE:", weekly);

        setSchedule(weekly);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load schedule");
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, [user?.teacherId]);

  const totalClasses = weekDays.reduce(
    (acc, day) => acc + (schedule[day]?.length || 0),
    0
  );

  if (loading) {
    return (
      <div className="h-96 flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">{t('myClasses')}</h1>
        <p className="text-gray-500">{t('myClassesDesc')}</p>
      </div>

      {/* Schedule Card */}
      <div className="bg-white rounded-xl shadow p-6">

        {/* Top */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="text-indigo-600" />
            <h2 className="text-xl font-semibold">
              {t('myWeeklySchedule')}
            </h2>
          </div>

          <Badge variant="outline">
            {totalClasses} classes this week
          </Badge>
        </div>

        {/* Days */}
        <div className="space-y-4">

          {weekDays.map((day) => {
            const dayClasses = schedule[day] || [];

            return (
              <div key={day} className="border rounded-lg overflow-hidden">

                {/* Day Header */}
                <div className="bg-gray-100 px-4 py-2 flex justify-between">
                  <span className="font-semibold">{day}</span>
                  <span className="text-sm text-gray-500">
                    {dayClasses.length} classes
                  </span>
                </div>

                {/* Content */}
                <div className="p-4">

                  {dayClasses.length > 0 ? (
                    <div className="space-y-3">

                      {dayClasses.map((cls, i) => (
                        <div
                          key={i}
                          className="border rounded-lg p-4 bg-gray-50"
                        >

                          {/* Info */}
                          <div className="flex flex-wrap gap-4 mb-3">

                            <div className="flex items-center gap-2">
                              <Clock size={16} />
                              {cls.time}
                            </div>

                            <div className="flex items-center gap-2">
                              <Users size={16} />
                              {cls.className}
                            </div>

                            <div className="flex items-center gap-2">
                              <BookOpen size={16} />
                              {cls.subjectName}
                            </div>

                            <div className="text-sm text-gray-500">
                              {cls.room}
                            </div>

                          </div>

                          {/* Buttons */}
                          <div className="flex gap-2">

                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                              navigate(`/teacher/class-details/${cls.classOid}`)
                              }
                            >
                              <Eye size={14} /> Details
                            </Button>

                            <Button
                              size="sm"
                              onClick={() =>
                     navigate(
  `/teacher/attendance/method-selection?classOid=${cls.classOid}&className=${cls.className}`
)
                              }
                            >
                              <ClipboardCheck size={14} /> TakeAttendance
                            </Button>

                          </div>

                        </div>
                      ))}

                    </div>
                  ) : (
                    <div className="text-center text-gray-400">
                      No classes
                    </div>
                  )}

                </div>
              </div>
            );
          })}

        </div>

      </div>
    </div>
  );
}