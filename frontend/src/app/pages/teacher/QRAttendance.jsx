import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { ArrowLeft, QrCode, Users, CheckCircle } from 'lucide-react';
import { STUDENTS, CLASSES } from '../../lib/mockData';
import { toast } from 'sonner';
import { QRCodeSVG } from 'qrcode.react';
import { useAttendance } from '../../context/AttendanceContext';

export function QRAttendance() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const { sessions, studentStatus, endSession } = useAttendance();

  const classId = searchParams.get('classId') || '0';
  const className = searchParams.get('className') || 'Mathematics';
  const date = searchParams.get('date') || new Date().toISOString().split('T')[0];

  const session = sessions[classId];
  const sessionActive = session?.attendanceEnabled && session?.status === 'active';
  const sessionCode = session?.sessionId || 'waiting...';

  const [attendedStudents, setAttendedStudents] = useState([]);
  const [timeRemaining, setTimeRemaining] = useState(300);

  const selectedClassData = CLASSES.find(c => c.id === classId);
  const classStudents = STUDENTS.slice(0, 15);

  useEffect(() => {
    let interval;
    if (sessionActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleEndSession();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [sessionActive, timeRemaining]);

  useEffect(() => {
    if (studentStatus[classId]?.status === 'completed') {
      const studentId = classStudents[0]?.id || 's1';
      if (!attendedStudents.includes(studentId)) {
        setAttendedStudents(prev => [...prev, studentId]);
      }
    }
  }, [studentStatus, classId, classStudents, attendedStudents]);

  const handleEndSession = () => {
    endSession(classId);
    toast.info('Session ended');
    navigate('/teacher/dashboard');
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate('/teacher/dashboard')}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="space-y-0.5">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{t('qrCodeAttendance')}</h1>
            <p className="text-muted-foreground">
              {className}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {sessionActive && (
            <Button onClick={handleEndSession} variant="destructive">
              {t('endSession')}
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-none shadow-md">
          <CardContent className="p-6 space-y-1">
            <div className="text-sm font-medium text-muted-foreground">{t('totalStudents')}</div>
            <div className="text-2xl font-bold text-foreground">{classStudents.length}</div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-md">
          <CardContent className="p-6 space-y-1">
            <div className="text-sm font-medium text-muted-foreground">{t('studentsAttended')}</div>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{attendedStudents.length}</div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-md">
          <CardContent className="p-6 space-y-1">
            <div className="text-sm font-medium text-muted-foreground">{t('timeRemaining')}</div>
            <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{formatTime(timeRemaining)}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* QR Code Display */}
        <Card className="border-none shadow-md">
          <CardHeader className="border-b border-border bg-muted/40">
            <CardTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5 text-green-600 dark:text-green-400" />
              Scan to Attend
            </CardTitle>
            <CardDescription>Students can scan this code using their app</CardDescription>
          </CardHeader>
          <CardContent className="p-8 flex flex-col items-center justify-center min-h-[400px]">
            {sessionActive ? (
              <div className="flex flex-col items-center space-y-4">
                <div className="bg-white p-6 rounded-2xl shadow-sm border-2 border-green-100">
                  <QRCodeSVG
                    value={sessionCode}
                    size={250}
                    level="H"
                    includeMargin={true}
                  />
                </div>
                <p className="text-sm text-muted-foreground">Session ID: {sessionCode}</p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center space-y-3">
                <QrCode className="h-20 w-20 text-muted-foreground/30" />
                <p className="text-muted-foreground">Session has ended.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Student List */}
        <Card className="border-none shadow-md">
          <CardHeader className="border-b border-border bg-muted/40">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-green-600 dark:text-green-400" />
              Students
            </CardTitle>
            <CardDescription>Live attendance feed</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-[400px] overflow-y-auto">
              {classStudents.map((student, index) => {
                const hasAttended = attendedStudents.includes(student.id);
                return (
                  <div
                    key={student.id}
                    className={`flex items-center justify-between p-4 border-b border-border last:border-b-0 transition-colors ${
                      hasAttended ? 'bg-green-50 dark:bg-green-900/10' : 'bg-card'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-sm font-medium text-muted-foreground">
                        #{(index + 1).toString().padStart(2, '0')}
                      </div>
                      <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 font-semibold text-sm">
                        {student.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="text-sm font-medium text-foreground">{student.name}</div>
                    </div>
                    {hasAttended && (
                      <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
