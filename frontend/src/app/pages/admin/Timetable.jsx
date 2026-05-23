import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Button } from '../../components/ui/button';
import { Download, Edit2, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '../../../app/lib/api';

export function AdminTimetable() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const [classes,          setClasses]          = useState([]);
  const [selectedClass,    setSelectedClass]    = useState('');
  const [timetableEntries, setTimetableEntries] = useState([]);
  const [loading,          setLoading]          = useState(true);

  const days = useMemo(() => ([
    { en: 'Sunday',    ar: 'الأحد',     key: 'Sunday'    },
    { en: 'Monday',    ar: 'الاثنين',   key: 'Monday'    },
    { en: 'Tuesday',   ar: 'الثلاثاء',  key: 'Tuesday'   },
    { en: 'Wednesday', ar: 'الأربعاء',  key: 'Wednesday' },
    { en: 'Thursday',  ar: 'الخميس',   key: 'Thursday'  },
  ]), []);

  // ─── Build entries from API response ─────────────────────────────────────
  const formatTimetable = (timetableData) => {
    if (!timetableData?.weeklySchedule) return [];
    const entries = [];
    Object.entries(timetableData.weeklySchedule).forEach(([day, slots]) => {
      (slots ?? []).forEach(slot => {
        // time field: "08:00-09:00" OR use startTime/endTime directly
        const startTime = slot.startTime ?? slot.time?.split('-')[0] ?? '';
        const endTime   = slot.endTime   ?? slot.time?.split('-')[1] ?? '';
        entries.push({
          day,
          startTime,
          endTime,
          subjectName: slot.subjectName ?? '—',
          className:   timetableData.className ?? slot.className ?? '—',
          teacherName: slot.teacherName ?? '—',
          room:        slot.room ?? '—',
        });
      });
    });
    return entries;
  };

  // ─── Derive unique sorted times from actual data ──────────────────────────
  const times = useMemo(() => {
    const set = new Set(timetableEntries.map(e => e.startTime).filter(Boolean));
    return Array.from(set).sort();
  }, [timetableEntries]);

  // ─── Lookup map ───────────────────────────────────────────────────────────
  const scheduleMap = useMemo(() => {
    const map = {};
    timetableEntries.forEach(item => {
      map[`${item.day}-${item.startTime}`] = item;
    });
    return map;
  }, [timetableEntries]);

  const getScheduleItem = (day, time) => scheduleMap[`${day}-${time}`] ?? null;

  // ─── Fetch ────────────────────────────────────────────────────────────────
  const loadTimetable = async (classOid) => {
    setLoading(true);
    try {
      const data = await api.timetable.getByClass(classOid);
      setTimetableEntries(formatTimetable(data));
    } catch (err) {
      console.error(err);
      toast.error('Error loading timetable');
      setTimetableEntries([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        const classList = await api.classes.getAll();
        setClasses(classList ?? []);
        if (classList?.length) {
          const firstOid = classList[0].oid;
          setSelectedClass(firstOid);
          await loadTimetable(firstOid);
        }
      } catch (err) {
        console.error(err);
        toast.error(t('errorFetchingData'));
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const handleClassChange = async (classOid) => {
    setSelectedClass(classOid);
    await loadTimetable(classOid);
  };

  // ─── Export CSV ───────────────────────────────────────────────────────────
  const exportTimetable = () => {
    if (!timetableEntries.length) { toast.error('No data to export'); return; }
    const headers = ['Day', 'StartTime', 'EndTime', 'Subject', 'Class', 'Teacher', 'Room'];
    const rows = timetableEntries.map(i => [i.day, i.startTime, i.endTime, i.subjectName, i.className, i.teacherName, i.room]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'timetable.csv';
    link.click();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="text-muted-foreground">{t('loading')}</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t('timetablePage')}</h1>
          <p className="text-muted-foreground">{t('timetablePageDesc')}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportTimetable}>
            <Download className="h-4 w-4 mr-2" />
            {t('export')}
          </Button>
          <Button variant="outline" onClick={() => navigate('/admin/timetable/by-teacher')}>
            <Edit2 className="h-4 w-4 mr-2" />
            {t('editTimetable')}
          </Button>
          <Button onClick={() => navigate('/admin/timetable/add')}>
            <Plus className="h-4 w-4 mr-2" />
            Add Entry
          </Button>
        </div>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center flex-wrap gap-4">
            <CardTitle>{t('masterSchedule')}</CardTitle>
            <Select value={selectedClass} onValueChange={handleClassChange}>
              <SelectTrigger className="w-[220px]">
                <SelectValue placeholder={t('selectClass')} />
              </SelectTrigger>
              <SelectContent>
                {classes.map(cls => (
                  <SelectItem key={cls.oid} value={cls.oid}>
                    {cls.name} {cls.level ? `- ${cls.level}` : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent>
          {times.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-lg font-medium">No timetable entries found</p>
              <p className="text-sm mt-1">Add entries using the button above</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              {/* Header Row */}
              <div className="grid border-b" style={{ gridTemplateColumns: `140px repeat(${days.length}, 1fr)` }}>
                <div className="p-4 font-medium text-foreground">{t('time')}</div>
                {days.map(day => (
                  <div key={day.key} className="p-4 text-center font-medium text-foreground">
                    {isRTL ? day.ar : day.en}
                  </div>
                ))}
              </div>

              {/* Rows */}
              {times.map(time => (
                <div
                  key={time}
                  className="grid border-b hover:bg-muted/20 transition-colors"
                  style={{ gridTemplateColumns: `140px repeat(${days.length}, 1fr)` }}
                >
                  <div className="p-4 text-sm font-medium text-foreground">{time}</div>
                  {days.map(day => {
                    const item = getScheduleItem(day.key, time);
                    return (
                      <div key={day.key + time} className="p-2 min-h-[80px] border-l border-border">
                        {item && (
                          <div className="p-2 rounded-lg border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-900/20 h-full">
                            <div className="font-semibold text-sm text-indigo-700 dark:text-indigo-300 capitalize">
                              {item.subjectName}
                            </div>
                            <div className="text-xs text-muted-foreground mt-0.5">
                              {item.teacherName}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {item.room}
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {item.startTime} – {item.endTime}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}