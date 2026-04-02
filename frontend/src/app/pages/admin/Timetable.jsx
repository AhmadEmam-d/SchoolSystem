import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Button } from '../../components/ui/button';
import { Download, Edit2 } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '../../../app/lib/api';

export function AdminTimetable() {
  console.log('🔥🔥🔥 AdminTimetable is rendering! 🔥🔥🔥');
  
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [timetableEntries, setTimetableEntries] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [loading, setLoading] = useState(true);

  const days = [
    { en: 'Sunday', ar: 'الأحد', key: 'Sunday' },
    { en: 'Monday', ar: 'الاثنين', key: 'Monday' },
    { en: 'Tuesday', ar: 'الثلاثاء', key: 'Tuesday' },
    { en: 'Wednesday', ar: 'الأربعاء', key: 'Wednesday' },
    { en: 'Thursday', ar: 'الخميس', key: 'Thursday' },
  ];

  const times = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00'];

  const fetchData = async () => {
    setLoading(true);
    try {
      console.log('1. Fetching classes...');
      const classesData = await api.classes.getAll();
      console.log('2. Classes data:', classesData);
      
      if (classesData && classesData.length > 0) {
        setClasses(classesData);
        
        const firstClassOid = classesData[0].oid;
        console.log('3. First class OID:', firstClassOid);
        setSelectedClass(firstClassOid);
        
        console.log('4. Fetching timetable for class:', firstClassOid);
        const timetableData = await api.timetable.getByClass(firstClassOid);
        console.log('5. Timetable data:', timetableData);
        
        if (timetableData && timetableData.weeklySchedule) {
          console.log('6. Weekly schedule:', timetableData.weeklySchedule);
          const entries = [];
          Object.entries(timetableData.weeklySchedule).forEach(([day, slots]) => {
            if (slots && slots.length > 0) {
              slots.forEach(slot => {
                entries.push({
                  day: day,
                  startTime: slot.time.split('-')[0],
                  endTime: slot.time.split('-')[1],
                  subjectName: slot.subjectName,
                  className: timetableData.className,
                  teacherName: slot.teacherName,
                  room: slot.room
                });
              });
            }
          });
          console.log('7. Entries:', entries);
          setTimetableEntries(entries);
        } else {
          console.log('No weeklySchedule in response');
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error(t('errorFetchingData'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleClassChange = async (classOid) => {
    setSelectedClass(classOid);
    setLoading(true);
    try {
      const timetableData = await api.timetable.getByClass(classOid);
      if (timetableData && timetableData.weeklySchedule) {
        const entries = [];
        Object.entries(timetableData.weeklySchedule).forEach(([day, slots]) => {
          if (slots && slots.length > 0) {
            slots.forEach(slot => {
              entries.push({
                day: day,
                startTime: slot.time.split('-')[0],
                endTime: slot.time.split('-')[1],
                subjectName: slot.subjectName,
                className: timetableData.className,
                teacherName: slot.teacherName,
                room: slot.room
              });
            });
          }
        });
        setTimetableEntries(entries);
      }
    } catch (error) {
      console.error('Error fetching timetable:', error);
    } finally {
      setLoading(false);
    }
  };

  const getScheduleItem = (day, time) => {
    return timetableEntries.find(s => s.day === day && s.startTime === time);
  };

  const exportTimetable = () => {
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

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `timetable.csv`;
    link.click();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">{t('loading')}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('timetablePage')}</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">{t('timetablePageDesc')}</p>
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
            <div className="grid grid-cols-6 border-b dark:border-gray-700">
              <div className="p-4 font-medium text-gray-900 dark:text-white">{t('time')}</div>
              {days.map(day => (
                <div key={day.key} className="p-4 text-center font-medium text-gray-900 dark:text-white">
                  {isRTL ? day.ar : day.en}
                </div>
              ))}
            </div>

            {times.map(time => (
              <div key={time} className="grid grid-cols-6 border-b dark:border-gray-700">
                <div className="p-4 text-gray-700 dark:text-gray-300">{time}</div>
                {days.map(day => {
                  const item = getScheduleItem(day.key, time);
                  return (
                    <div key={`${day.key}-${time}`} className="p-2 min-h-[80px] border-l dark:border-gray-700">
                      {item && (
                        <div className="p-2 rounded border shadow-sm bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700">
                          <div className="font-bold text-sm text-blue-700 dark:text-blue-300">
                            {item.subjectName}
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">
                            {item.teacherName}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-500">
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