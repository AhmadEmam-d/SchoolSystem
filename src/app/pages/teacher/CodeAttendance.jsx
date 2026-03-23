import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { ArrowLeft, Hash, Users, CheckCircle } from 'lucide-react';
import { STUDENTS, CLASSES } from '../../lib/mockData';
import { toast } from 'sonner';
import { useAttendance } from '../../context/AttendanceContext';

export function CodeAttendance() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const { sessions, studentStatus, endSession } = useAttendance();

  const classId = searchParams.get('classId') || '0';
  const className = searchParams.get('className') || 'Mathematics';
  const date = searchParams.get('date') || new Date().toISOString().split('T')[0];

  const session = sessions[classId];
  const sessionActive = session?.attendanceEnabled && session?.status === 'active';

  const [attendedStudents, setAttendedStudents] = useState([]);

  const classStudents = STUDENTS.slice(0, 15);

  useEffect(() => {
    if (studentStatus[classId]?.status === 'completed') {
      const studentId = classStudents[0]?.id;
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
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Number Selection</h1>
            <p className="text-muted-foreground">
              {className}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {sessionActive && (
            <Button onClick={handleEndSession} variant="destructive">
              End Session
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-none shadow-md">
          <CardContent className="p-6 space-y-1">
            <div className="text-sm font-medium text-muted-foreground">Total Students</div>
            <div className="text-2xl font-bold text-foreground">{classStudents.length}</div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-md">
          <CardContent className="p-6 space-y-1">
            <div className="text-sm font-medium text-muted-foreground">Students Attended</div>
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{attendedStudents.length}</div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-md">
          <CardContent className="p-6 space-y-1">
            <div className="text-sm font-medium text-muted-foreground">Status</div>
            <div className="text-2xl font-bold">
              {sessionActive ? (
                <Badge className="bg-purple-500 text-white">Active</Badge>
              ) : (
                <Badge variant="outline">Ended</Badge>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Number Display */}
        <Card className="border-none shadow-md">
          <CardHeader className="border-b border-border bg-muted/40">
            <CardTitle className="flex items-center gap-2">
              <Hash className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              Target Number
            </CardTitle>
            <CardDescription>Students will select from these 3 numbers</CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            {sessionActive ? (
              <div className="space-y-6">
                <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg border-2 border-purple-200 dark:border-purple-800">
                  <p className="text-sm font-medium text-purple-900 dark:text-purple-200 mb-3 text-center">Correct Number (Teacher Only)</p>
                  <div className="flex items-center justify-center">
                    <div className="bg-purple-600 text-white rounded-lg px-8 py-6 text-5xl font-bold shadow-lg">
                      {session?.correctNumber}
                    </div>
                  </div>
                </div>
                <div className="text-center space-y-3">
                  <p className="text-sm text-muted-foreground">Students see these numbers:</p>
                  <div className="flex gap-3 justify-center">
                    {session?.numberOptions?.map((num, idx) => (
                      <div key={idx} className="bg-muted text-foreground rounded-lg px-6 py-3 text-2xl font-bold border-2 border-border">
                        {num}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center space-y-3">
                <Hash className="h-16 w-16 text-muted-foreground/30" />
                <p className="text-muted-foreground">Session has ended.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Student List */}
        <Card className="border-none shadow-md">
          <CardHeader className="border-b border-border bg-muted/40">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              Students
            </CardTitle>
            <CardDescription>Live attendance feed</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-96 overflow-y-auto">
              {classStudents.map((student, index) => {
                const hasAttended = attendedStudents.includes(student.id);
                return (
                  <div
                    key={student.id}
                    className={`flex items-center justify-between p-4 border-b border-border last:border-b-0 transition-colors ${
                      hasAttended ? 'bg-purple-50 dark:bg-purple-900/10' : 'bg-card'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-sm font-medium text-muted-foreground">
                        #{(index + 1).toString().padStart(2, '0')}
                      </div>
                      <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 font-semibold text-sm">
                        {student.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="text-sm font-medium text-foreground">{student.name}</div>
                    </div>
                    {hasAttended && (
                      <CheckCircle className="h-5 w-5 text-purple-600 dark:text-purple-400" />
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
