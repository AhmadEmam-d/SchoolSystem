import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Printer, User, Clock, BookOpen, Calendar, Edit } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { api } from '../../../app/lib/api';

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];
const times = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00'];

export function TimetableByTeacher() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [timetableData, setTimetableData] = useState({});
  const [loading, setLoading] = useState(false);
  const [currentTeacher, setCurrentTeacher] = useState(null);

  // ✅ Fetch Teachers
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const res = await api.teachers.getAll();

        const teachersList = res.success ? res.data : (Array.isArray(res) ? res : []);

        setTeachers(teachersList);

        if (teachersList.length > 0) {
          setSelectedTeacher(teachersList[0].oid);
          setCurrentTeacher(teachersList[0]);
        }

      } catch (error) {
        console.error(error);
        toast.error("Error loading teachers");
      }
    };

    fetchTeachers();
  }, []);

  // ✅ Fetch Timetable
  useEffect(() => {
    const fetchTimetable = async () => {
      if (!selectedTeacher) return;

      setLoading(true);

      try {
        const res = await api.timetable.getByTeacher(selectedTeacher);

        const data = res.data; // ✅ FIX هنا

        const teacher = teachers.find(t => t.oid === selectedTeacher);
        setCurrentTeacher(teacher);

        if (data && data.weeklySchedule) {
          const organized = {};

          days.forEach(day => {
            organized[day] = {};
          });

          Object.entries(data.weeklySchedule).forEach(([day, slots]) => {
            if (slots && slots.length > 0) {
              slots.forEach(slot => {

                // ✅ استخدم startTime مباشرة
                const startTime = slot.startTime;

                organized[day][startTime] = {
                  subjectName: slot.subjectName,
                  className: slot.className,
                  room: slot.room
                };
              });
            }
          });

          setTimetableData(organized);
        } else {
          setTimetableData({});
        }

      } catch (error) {
        console.error(error);
        toast.error("Failed to load timetable");
      } finally {
        setLoading(false);
      }
    };

    fetchTimetable();
  }, [selectedTeacher, teachers]);

  const getScheduleItem = (day, time) => {
    return timetableData[day]?.[time] || null;
  };

  const totalHours = Object.values(timetableData)
    .flatMap(day => Object.values(day)).length;

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/admin/timetable')}>
            <ArrowLeft />
          </button>

          <div>
            <h1 className="text-2xl font-bold">Teacher Timetable</h1>
          </div>
        </div>

        <div className="flex gap-2">
          <button onClick={handlePrint}>
            <Printer />
          </button>

          <button onClick={() => navigate('/admin/timetable/edit')}>
            <Edit />
          </button>
        </div>
      </div>

      {/* Select Teacher */}
      <select
        value={selectedTeacher}
        onChange={(e) => setSelectedTeacher(e.target.value)}
        className="border p-2 rounded"
      >
        {teachers.map(t => (
          <option key={t.oid} value={t.oid}>
            {t.fullName}
          </option>
        ))}
      </select>

      {/* Teacher Info */}
      {currentTeacher && (
        <div className="p-4 bg-purple-600 text-white rounded">
          <h2 className="text-xl font-bold">{currentTeacher.fullName}</h2>
          <p>{totalHours} Classes</p>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border">

          <thead>
            <tr>
              <th className="border p-2">Time</th>
              {days.map(day => (
                <th key={day} className="border p-2">{day}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {times.map(time => (
              <tr key={time}>
                <td className="border p-2">{time}</td>

                {days.map(day => {
                  const item = getScheduleItem(day, time);

                  return (
                    <td key={day} className="border p-2 text-center">
                      {item ? (
                        <>
                          <div className="font-bold">{item.className}</div>
                          <div className="text-sm">{item.subjectName}</div>
                          <div className="text-xs">{item.room}</div>
                        </>
                      ) : '-'}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>

        </table>
      </div>

    </div>
  );
}