import React, { useState } from 'react';
import { Calendar, Check, X, Save, Download } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { STUDENTS, CLASSES } from '../../lib/mockData';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';

export function TeacherAttendance() {
  const { t } = useTranslation();
  const [selectedClass, setSelectedClass] = useState('c1');
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [attendance, setAttendance] = useState({});

  const selectedClassData = CLASSES.find(c => c.id === selectedClass);
  const classStudents = STUDENTS.filter(s => selectedClassData?.students.includes(s.id));

  const handleAttendanceMark = (studentId, status) => {
    setAttendance(prev => ({ ...prev, [studentId]: status }));
  };

  const handleSave = () => {
    toast.success(t('attendanceSavedSuccess'));
  };

  const handleExportPDF = () => {
    const csvData = [];
    
    // Add headers
    csvData.push(`\"Class\",\"${selectedClassData?.name || ''}\"`);
    csvData.push(`\"Date\",\"${selectedDate}\"`);
    csvData.push(''); // Empty row
    csvData.push(`\"${t('rollNo')}\",\"${t('studentName')}\",\"${t('email')}\",\"${t('overallAttendance')}\",\"${t('status')}\"`);
    
    // Add student data
    classStudents.forEach((student, index) => {
      const rollNo = `#${(index + 1).toString().padStart(2, '0')}`;
      const status = attendance[student.id] ? t(attendance[student.id]) : t('notMarked');
      csvData.push(`\"${rollNo}\",\"${student.name}\",\"${student.email}\",\"${student.attendance}%\",\"${status}\"`);
    });
    
    // Add summary
    csvData.push(''); // Empty row
    csvData.push(`\"${t('summary')}\"`);
    csvData.push(`\"${t('totalStudents')}\",\"${stats.total}\"`);
    csvData.push(`\"${t('present')}\",\"${stats.present}\"`);
    csvData.push(`\"${t('absent')}\",\"${stats.absent}\"`);
    csvData.push(`\"${t('late')}\",\"${stats.late}\"`);
    
    // Create blob and download
    const csvContent = csvData.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `attendance_${selectedClassData?.name}_${selectedDate}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success(t('exportSuccess'));
  };

  const getAttendanceStats = () => {
    const total = classStudents.length;
    const present = Object.values(attendance).filter(v => v === 'present').length;
    const absent = Object.values(attendance).filter(v => v === 'absent').length;
    const late = Object.values(attendance).filter(v => v === 'late').length;
    return { total, present, absent, late };
  };

  const stats = getAttendanceStats();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('attendance')}</h1>
          <p className="text-gray-500 mt-1">{t('markAndTrackAttendance')}</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={handleExportPDF}>
            <Download className="h-4 w-4 mr-2" />
            {t('exportPDF')}
          </Button>
          <Button onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-700">
            <Save className="h-4 w-4 mr-2" />
            {t('saveAttendance')}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-none shadow-md">
          <CardContent className="p-6">
            <div className="text-sm font-medium text-gray-500">{t('totalStudents')}</div>
            <div className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-md">
          <CardContent className="p-6">
            <div className="text-sm font-medium text-gray-500">{t('present')}</div>
            <div className="text-2xl font-bold text-green-600 mt-1">{stats.present}</div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-md">
          <CardContent className="p-6">
            <div className="text-sm font-medium text-gray-500">{t('absent')}</div>
            <div className="text-2xl font-bold text-red-600 mt-1">{stats.absent}</div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-md">
          <CardContent className="p-6">
            <div className="text-sm font-medium text-gray-500">{t('late')}</div>
            <div className="text-2xl font-bold text-yellow-600 mt-1">{stats.late}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-md">
        <CardHeader className="border-b bg-gray-50">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{t('markAttendance')}</CardTitle>
              <CardDescription className="mt-1">{t('selectClassAndDate')}</CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CLASSES.map(cls => (
                    <SelectItem key={cls.id} value={cls.id}>{cls.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('rollNo')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('studentName')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('overallAttendance')}</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">{t('markAttendance')}</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {classStudents.map((student, index) => (
                  <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{(index + 1).toString().padStart(2, '0')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold">
                          {student.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{student.name}</div>
                          <div className="text-sm text-gray-500">{student.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={
                        student.attendance >= 95 ? 'bg-green-100 text-green-800' :
                        student.attendance >= 85 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }>
                        {student.attendance}%
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          size="sm"
                          variant={attendance[student.id] === 'present' ? 'default' : 'outline'}
                          onClick={() => handleAttendanceMark(student.id, 'present')}
                          className={attendance[student.id] === 'present' ? 'bg-green-600 hover:bg-green-700' : ''}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant={attendance[student.id] === 'late' ? 'default' : 'outline'}
                          onClick={() => handleAttendanceMark(student.id, 'late')}
                          className={attendance[student.id] === 'late' ? 'bg-yellow-600 hover:bg-yellow-700' : ''}
                        >
                          L
                        </Button>
                        <Button
                          size="sm"
                          variant={attendance[student.id] === 'absent' ? 'default' : 'outline'}
                          onClick={() => handleAttendanceMark(student.id, 'absent')}
                          className={attendance[student.id] === 'absent' ? 'bg-red-600 hover:bg-red-700' : ''}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
