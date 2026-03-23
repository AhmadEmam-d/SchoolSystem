import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { ArrowLeft, Check, X, Save, Download } from 'lucide-react';
import { STUDENTS, CLASSES } from '../../lib/mockData';
import { toast } from 'sonner';
import { useAttendance } from '../../context/AttendanceContext';

export function ManualAttendance() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const { endSession, completeStudentAttendance } = useAttendance();

  const classId = searchParams.get('classId') || 'c1';
  const className = searchParams.get('className') || 'Class 10-A';
  const date = searchParams.get('date') || new Date().toISOString().split('T')[0];

  const [attendance, setAttendance] = useState({});

  const selectedClassData = CLASSES.find(c => c.id === classId);
  const classStudents = STUDENTS.filter(s => selectedClassData?.students.includes(s.id));

  const handleAttendanceMark = (studentId, status) => {
    setAttendance(prev => ({ ...prev, [studentId]: status }));
  };

  const handleSave = () => {
    endSession(classId);
    const demoStudentId = classStudents[0]?.id;
    const status = attendance[demoStudentId];
    if (status === 'present') {
      completeStudentAttendance(classId, 'manual');
    }
    toast.success('Attendance saved successfully');
    navigate('/teacher/dashboard');
  };

  const handleExportPDF = () => {
    const csvData = [];
    csvData.push(`"Class","${className}"`);
    csvData.push(`"Date","${date}"`);
    csvData.push('');
    csvData.push(`"${t('rollNo')}","${t('studentName')}","${t('email')}","${t('overallAttendance')}","${t('status')}"`);
    classStudents.forEach((student, index) => {
      const rollNo = `#${(index + 1).toString().padStart(2, '0')}`;
      const status = attendance[student.id] ? t(attendance[student.id]) : t('notMarked');
      csvData.push(`"${rollNo}","${student.name}","${student.email}","${student.attendance}%","${status}"`);
    });
    csvData.push('');
    csvData.push(`"${t('summary')}"`);
    csvData.push(`"${t('totalStudents')}","${stats.total}"`);
    csvData.push(`"${t('present')}","${stats.present}"`);
    csvData.push(`"${t('absent')}","${stats.absent}"`);
    csvData.push(`"${t('late')}","${stats.late}"`);
    const csvContent = csvData.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `attendance_${className}_${date}.csv`);
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate(`/teacher/attendance/method-selection?classId=${classId}&className=${encodeURIComponent(className)}&date=${date}`)}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="space-y-0.5">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{t('manualAttendance')}</h1>
            <p className="text-muted-foreground">
              {className} - {new Date(date).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <Button variant="outline" onClick={handleExportPDF}>
            <Download className="h-4 w-4 mr-2" />
            {t('exportReport')}
          </Button>
          <Button onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-700 text-white">
            <Save className="h-4 w-4 mr-2" />
            {t('saveAttendance')}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-none shadow-md">
          <CardContent className="p-6 space-y-1">
            <div className="text-sm font-medium text-muted-foreground">{t('totalStudents')}</div>
            <div className="text-2xl font-bold text-foreground">{stats.total}</div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-md">
          <CardContent className="p-6 space-y-1">
            <div className="text-sm font-medium text-muted-foreground">{t('present')}</div>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.present}</div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-md">
          <CardContent className="p-6 space-y-1">
            <div className="text-sm font-medium text-muted-foreground">{t('absent')}</div>
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.absent}</div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-md">
          <CardContent className="p-6 space-y-1">
            <div className="text-sm font-medium text-muted-foreground">{t('late')}</div>
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.late}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-md">
        <CardHeader className="border-b border-border bg-muted/40">
          <CardTitle>{t('markAttendance')}</CardTitle>
          <CardDescription className="mt-1">{t('selectClassAndDate')}</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">{t('rollNo')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">{t('studentName')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">{t('overallAttendance')}</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">{t('markAttendance')}</th>
                </tr>
              </thead>
              <tbody className="bg-card divide-y divide-border">
                {classStudents.map((student, index) => (
                  <tr key={student.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                      #{(index + 1).toString().padStart(2, '0')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-indigo-600 dark:text-indigo-300 font-semibold">
                          {student.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="space-y-0.5">
                          <div className="text-sm font-medium text-foreground">{student.name}</div>
                          <div className="text-sm text-muted-foreground">{student.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={
                        student.attendance >= 95 ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800' :
                        student.attendance >= 85 ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800' :
                        'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800'
                      }>
                        {student.attendance}%
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center justify-center gap-2 flex-wrap">
                        <Button
                          size="sm"
                          variant={attendance[student.id] === 'present' ? 'default' : 'outline'}
                          onClick={() => handleAttendanceMark(student.id, 'present')}
                          className={`gap-1 ${attendance[student.id] === 'present' ? 'bg-green-600 hover:bg-green-700 text-white' : ''}`}
                        >
                          <Check className="h-3.5 w-3.5" />
                          {t('present')}
                        </Button>
                        <Button
                          size="sm"
                          variant={attendance[student.id] === 'late' ? 'default' : 'outline'}
                          onClick={() => handleAttendanceMark(student.id, 'late')}
                          className={`gap-1 ${attendance[student.id] === 'late' ? 'bg-yellow-600 hover:bg-yellow-700 text-white' : ''}`}
                        >
                          {t('lateLabel')}
                        </Button>
                        <Button
                          size="sm"
                          variant={attendance[student.id] === 'absent' ? 'default' : 'outline'}
                          onClick={() => handleAttendanceMark(student.id, 'absent')}
                          className={`gap-1 ${attendance[student.id] === 'absent' ? 'bg-red-600 hover:bg-red-700 text-white' : ''}`}
                        >
                          <X className="h-3.5 w-3.5" />
                          {t('absent')}
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
