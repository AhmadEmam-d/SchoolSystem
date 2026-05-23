import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Printer, User, Clock, Edit } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { api } from '../../../app/lib/api';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];

export function TimetableByTeacher() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [teachers,        setTeachers]        = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [currentTeacher,  setCurrentTeacher]  = useState(null);
  const [weeklySchedule,  setWeeklySchedule]  = useState({});
  const [allTimes,        setAllTimes]        = useState([]);
  const [loading,         setLoading]         = useState(false);
  const [loadingTeachers, setLoadingTeachers] = useState(true);

  // ─── Load teachers ────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const list = await api.teachers.getAll();
        if (list?.length > 0) {
          setTeachers(list);
          setSelectedTeacher(list[0].oid);
          setCurrentTeacher(list[0]);
        } else {
          toast.error('No teachers found');
        }
      } catch (err) {
        console.error(err);
        toast.error('Error loading teachers');
      } finally {
        setLoadingTeachers(false);
      }
    };
    fetchTeachers();
  }, []);

  // ─── Load timetable when teacher changes ─────────────────────────────────
  useEffect(() => {
    if (!selectedTeacher) return;

    const fetchTimetable = async () => {
      setLoading(true);
      try {
        const response = await api.timetable.getByTeacher(selectedTeacher);
        if (!response.ok) {
          toast.error('Failed to load timetable');
          setWeeklySchedule({});
          setAllTimes([]);
          return;
        }

        const raw = response.data;
        // Support both: raw.data.weeklySchedule and raw.weeklySchedule
        const sched = raw?.data?.weeklySchedule ?? raw?.weeklySchedule ?? {};

        // Update teacher name from response if available
        const teacher = teachers.find(tc => tc.oid === selectedTeacher);
        setCurrentTeacher(prev => ({
          ...teacher,
          fullName: raw?.data?.teacherName ?? raw?.teacherName ?? teacher?.fullName,
        }));

        // Build a unique sorted times list from all slots
        const timesSet = new Set();
        Object.values(sched).forEach(slots => {
          (slots ?? []).forEach(slot => {
            if (slot.startTime) timesSet.add(slot.startTime);
          });
        });
        const sortedTimes = Array.from(timesSet).sort();
        setAllTimes(sortedTimes);
        setWeeklySchedule(sched);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load timetable');
        setWeeklySchedule({});
        setAllTimes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTimetable();
  }, [selectedTeacher, teachers]);

  const getSlot = (day, startTime) =>
    (weeklySchedule[day] ?? []).find(s => s.startTime === startTime) ?? null;

  const totalClasses = Object.values(weeklySchedule)
    .reduce((acc, slots) => acc + (slots?.length ?? 0), 0);

  const hasAnyData = allTimes.length > 0;

  if (loadingTeachers) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading teachers...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/timetable')}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Teacher Timetable</h1>
            <p className="text-muted-foreground text-sm mt-1">View and manage teacher schedules</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors text-foreground"
          >
            <Printer className="w-4 h-4" />
            Print
          </button>
          <button
            onClick={() => navigate('/admin/timetable/add')}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Edit className="w-4 h-4" />
            Add Entry
          </button>
        </div>
      </div>

      {/* Teacher Selector */}
      <div className="bg-card border border-border rounded-lg p-4">
        <label className="block text-sm font-medium text-foreground mb-2">Select Teacher</label>
        <select
          value={selectedTeacher}
          onChange={e => {
            setSelectedTeacher(e.target.value);
            setCurrentTeacher(teachers.find(tc => tc.oid === e.target.value));
          }}
          className="w-full md:w-96 border border-border rounded-lg p-2 bg-background text-foreground focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
        >
          {teachers.map(tc => (
            <option key={tc.oid} value={tc.oid}>
              {tc.fullName || tc.name || tc.email || 'Unnamed Teacher'}
            </option>
          ))}
        </select>
      </div>

      {/* Teacher Info Banner */}
      {currentTeacher && (
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg shadow-lg p-6">
          <div className="flex items-center gap-3">
            <User className="w-8 h-8" />
            <div>
              <h2 className="text-2xl font-bold">{currentTeacher.fullName || currentTeacher.name}</h2>
              <p className="text-purple-100 mt-1 flex items-center gap-1">
                <Clock className="w-4 h-4" />
                Total: {totalClasses} classes per week
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center h-64 bg-card rounded-lg border border-border">
          <div className="text-muted-foreground">Loading timetable...</div>
        </div>
      )}

      {/* Timetable Table */}
      {!loading && hasAnyData && (
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-muted/50">
                <tr>
                  <th className="border border-border p-3 text-left font-semibold text-foreground text-sm">
                    Time
                  </th>
                  {DAYS.map(day => (
                    <th key={day} className="border border-border p-3 text-left font-semibold text-foreground text-sm">
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {allTimes.map(time => (
                  <tr key={time} className="hover:bg-muted/30 transition-colors">
                    <td className="border border-border p-3 font-medium text-foreground text-sm whitespace-nowrap">
                      {time}
                    </td>
                    {DAYS.map(day => {
                      const slot = getSlot(day, time);
                      return (
                        <td key={day} className="border border-border p-3">
                          {slot ? (
                            <div className="space-y-1 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-2">
                              <div className="font-semibold text-indigo-800 dark:text-indigo-300 text-sm">
                                {slot.className}
                              </div>
                              <div className="text-sm text-foreground capitalize">{slot.subjectName}</div>
                              <div className="text-xs text-muted-foreground">
                                {slot.startTime} – {slot.endTime}
                              </div>
                              {slot.room && (
                                <div className="text-xs text-muted-foreground">Room: {slot.room}</div>
                              )}
                            </div>
                          ) : (
                            <div className="text-muted-foreground text-center text-sm">—</div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && !hasAnyData && (
        <div className="text-center py-12 bg-card rounded-lg border border-border">
          <h3 className="text-lg font-medium text-foreground">No timetable found</h3>
          <p className="text-muted-foreground mt-1">No schedule available for this teacher</p>
          <button
            onClick={() => navigate('/admin/timetable/add')}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Add Timetable Entry
          </button>
        </div>
      )}
    </div>
  );
}