import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Button } from '../../components/ui/button';
import { Download, Edit2 } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '../../../app/lib/api';

export function AdminTimetable() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [timetableEntries, setTimetableEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  const days = useMemo(() => ([
    { en: 'Sunday', ar: 'الأحد', key: 'Sunday' },
    { en: 'Monday', ar: 'الاثنين', key: 'Monday' },
    { en: 'Tuesday', ar: 'الثلاثاء', key: 'Tuesday' },
    { en: 'Wednesday', ar: 'الأربعاء', key: 'Wednesday' },
    { en: 'Thursday', ar: 'الخميس', key: 'Thursday' },
  ]), []);

  const times = useMemo(() => (
    ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00']
  ), []);

  // 🔥 تحويل الداتا مرة واحدة
  const formatTimetable = (timetableData) => {
    if (!timetableData?.weeklySchedule) return [];

    const entries = [];

    Object.entries(timetableData.weeklySchedule).forEach(([day, slots]) => {
      slots?.forEach(slot => {
        const [start, end] = slot.time.split('-');

        entries.push({
          day,
          startTime: start,
          endTime: end,
          subjectName: slot.subjectName,
          className: timetableData.className,
          teacherName: slot.teacherName,
          room: slot.room
        });
      });
    });

    return entries;
  };

  // 🔥 تحميل الداتا أول مرة
  const fetchInitialData = async () => {
    try {
      setLoading(true);

      const classesData = await api.classes.getAll();
      setClasses(classesData || []);

      if (classesData?.length) {
        const firstClass = classesData[0].oid;
        setSelectedClass(firstClass);

        const timetableData = await api.timetable.getByClass(firstClass);
        setTimetableEntries(formatTimetable(timetableData));
      }

    } catch (error) {
      console.error(error);
      toast.error(t('errorFetchingData'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  // 🔥 تغيير الكلاس
  const handleClassChange = async (classOid) => {
    try {
      setSelectedClass(classOid);
      setLoading(true);

      const timetableData = await api.timetable.getByClass(classOid);
      setTimetableEntries(formatTimetable(timetableData));

    } catch (error) {
      console.error(error);
      toast.error('Error loading timetable');
    } finally {
      setLoading(false);
    }
  };

  // 🔥 أسرع lookup (بدل find كل مرة)
  const scheduleMap = useMemo(() => {
    const map = {};
    timetableEntries.forEach(item => {
      map[`${item.day}-${item.startTime}`] = item;
    });
    return map;
  }, [timetableEntries]);

  const getScheduleItem = (day, time) => {
    return scheduleMap[`${day}-${time}`];
  };

  // 🔥 export
  const exportTimetable = () => {
    if (!timetableEntries.length) {
      toast.error('No data to export');
      return;
    }

    const headers = ['Day', 'StartTime', 'EndTime', 'Subject', 'Class', 'Teacher', 'Room'];

    const rows = timetableEntries.map(item => [
      item.day,
      item.startTime,
      item.endTime,
      item.subjectName,
      item.className,
      item.teacherName,
      item.room
    ]);

    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'timetable.csv';
    link.click();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="text-gray-500">{t('loading')}</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold">{t('timetablePage')}</h1>
          <p className="text-gray-500">{t('timetablePageDesc')}</p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={exportTimetable}>
            <Download className="h-4 w-4 mr-2" />
            {t('export')}
          </Button>

          <Button onClick={() => navigate('/admin/timetable/edit')}>
            <Edit2 className="h-4 w-4 mr-2" />
            {t('editTimetable')}
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
                    {cls.name} - {cls.level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">

            {/* Header Row */}
            <div className="grid grid-cols-6 border-b">
              <div className="p-4 font-medium">{t('time')}</div>

              {days.map(day => (
                <div key={day.key} className="p-4 text-center font-medium">
                  {isRTL ? day.ar : day.en}
                </div>
              ))}
            </div>

            {/* Rows */}
            {times.map(time => (
              <div key={time} className="grid grid-cols-6 border-b">

                <div className="p-4">{time}</div>

                {days.map(day => {
                  const item = getScheduleItem(day.key, time);

                  return (
                    <div key={day.key + time} className="p-2 min-h-[80px] border-l">
                      {item && (
                        <div className="p-2 rounded border bg-blue-50 dark:bg-blue-900/30">

                          <div className="font-bold text-sm text-blue-700 dark:text-blue-300">
                            {item.subjectName}
                          </div>

                          <div className="text-xs text-gray-600">
                            {item.teacherName}
                          </div>

                          <div className="text-xs text-gray-500">
                            {item.room}
                          </div>

                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}

          </div>
        </CardContent>
      </Card>
    </div>
  );
}