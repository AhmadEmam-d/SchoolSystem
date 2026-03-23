import React from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Button } from '../../components/ui/button';
import { Calendar as CalendarIcon, Filter, Download, Plus, Edit2 } from 'lucide-react';

export function AdminTimetable() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
  const days = [
    { en: 'Sunday', ar: 'الأحد', key: 'sunday' },
    { en: 'Monday', ar: 'الاثنين', key: 'monday' },
    { en: 'Tuesday', ar: 'الثلاثاء', key: 'tuesday' },
    { en: 'Wednesday', ar: 'الأربعاء', key: 'wednesday' },
    { en: 'Thursday', ar: 'الخميس', key: 'thursday' },
  ];
  
  const times = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00'];

  // Mock schedule data
  const schedule = [
    { day: 'Sunday', time: '09:00', subject: 'Math', class: '10-A', teacher: 'Mr. Nash', color: 'bg-blue-100 border-blue-200 text-blue-700' },
    { day: 'Sunday', time: '11:00', subject: 'History', class: '10-A', teacher: 'Mr. Hero', color: 'bg-orange-100 border-orange-200 text-orange-700' },
    { day: 'Monday', time: '10:00', subject: 'Science', class: '10-B', teacher: 'Mrs. Curie', color: 'bg-green-100 border-green-200 text-green-700' },
    { day: 'Tuesday', time: '14:00', subject: 'English', class: '8-A', teacher: 'Mr. Shake', color: 'bg-purple-100 border-purple-200 text-purple-700' },
    { day: 'Wednesday', time: '09:00', subject: 'Art', class: '10-A', teacher: 'Mr. Leo', color: 'bg-pink-100 border-pink-200 text-pink-700' },
  ];

  const getScheduleItem = (dayKey, time) => {
    const dayName = days.find(d => d.key === dayKey)?.en;
    return schedule.find(s => s.day === dayName && s.time === time);
  };

  const exportTimetable = () => {
    // Create CSV content
    const headers = ['Day', 'Time', 'Subject', 'Class', 'Teacher'];
    const csvRows = [headers.join(',')];

    // Add schedule data
    schedule.forEach(item => {
      const row = [
        item.day,
        item.time,
        item.subject,
        item.class,
        item.teacher
      ];
      csvRows.push(row.join(','));
    });

    const csvContent = csvRows.join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `timetable_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Timetable</h1>
          <p className="text-gray-500 mt-1">Manage class schedules and teacher assignments</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportTimetable}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => navigate('/admin/timetable/edit?type=class')}>
            <Edit2 className="h-4 w-4 mr-2" />
            تعديل الجدول
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <CardTitle>Master Schedule</CardTitle>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Select defaultValue="10-A">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10-A">Class 10-A</SelectItem>
                  <SelectItem value="10-B">Class 10-B</SelectItem>
                  <SelectItem value="8-A">Class 8-A</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              <div className="grid grid-cols-6 border-b border-gray-200">
                <div className="p-4 font-medium text-gray-500 bg-gray-50">Time</div>
                {days.map(day => (
                  <div key={day.key} className="p-4 font-medium text-center text-gray-900 bg-gray-50 border-l border-gray-200">
                    {isRTL ? day.ar : day.en}
                  </div>
                ))}
              </div>
              
              {times.map(time => (
                <div key={time} className="grid grid-cols-6 border-b border-gray-200 last:border-0">
                  <div className="p-4 text-sm font-medium text-gray-500 bg-white">
                    {time}
                  </div>
                  {days.map(day => {
                    const item = getScheduleItem(day.key, time);
                    return (
                      <div key={`${day.key}-${time}`} className="p-2 border-l border-gray-200 min-h-[100px] relative">
                        {item ? (
                          <div className={`h-full w-full p-2 rounded-lg border ${item.color} shadow-sm`}>
                            <div className="font-bold text-sm mb-1">{item.subject}</div>
                            <div className="text-xs mt-1">{item.class}</div>
                            <div className="text-xs opacity-80">{item.teacher}</div>
                          </div>
                        ) : (
                          <div className="h-full w-full"></div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
