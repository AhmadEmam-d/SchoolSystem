import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { ArrowLeft, Hash, Users, CheckCircle, Clock } from 'lucide-react';
import { api } from '../../lib/api'; // افترضنا وجود API لجلب الطلاب الحقيقيين
import { toast } from 'sonner';
import { useAttendance } from '../../context/AttendanceContext';

export function CodeAttendance() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { sessions, startSession, endSession } = useAttendance();

  // جلب البيانات من الرابط
  const classId = searchParams.get('classId') || searchParams.get('classOid');
  const className = searchParams.get('className') || 'Class';

  const [students, setStudents] = useState([]);
  const [timeLeft, setTimeLeft] = useState(5); // 5 دقائق
  const hasEndedRef = useRef(false);

  const session = sessions[classId];
  const sessionActive = session?.status === 'active';

  // 1️⃣ تحميل الطلاب المسجلين في هذا الفصل
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await api.students.getAll();
        const filtered = res.data.filter(s => s.classOid === classId);
        setStudents(filtered);
      } catch (err) {
        console.error("Error loading students", err);
      }
    };
    if (classId) fetchStudents();
  }, [classId]);

  // 2️⃣ بدء الجلسة تلقائياً بنمط "Number Selection"
  useEffect(() => {
    if (classId && !session) {
      startSession(classId, 'code').catch(() => toast.error("Failed to start session"));
    }
  }, [classId, session, startSession]);

  // 3️⃣ منطق الإنهاء والتوجه للـ Dashboard
  const handleEndSession = async () => {
    if (hasEndedRef.current) return;
    hasEndedRef.current = true;

    try {
      await endSession(classId, students);
      toast.success('Attendance session completed ✅');
      navigate('/teacher/dashboard');
    } catch (err) {
      navigate('/teacher/dashboard');
    }
  };

  // 4️⃣ العداد التنازلي
  useEffect(() => {
    let timer;
    if (sessionActive && timeLeft > 0 && !hasEndedRef.current) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && sessionActive) {
      handleEndSession();
    }
    return () => clearInterval(timer);
  }, [timeLeft, sessionActive]);

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen" dir="ltr">
      
      {/* HEADER */}
      <div className="flex flex-col sm:row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-slate-100"
            onClick={() => navigate('/teacher/dashboard')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Number Selection</h1>
            <p className="text-slate-400 text-sm font-medium">{className}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-purple-50 px-4 py-2 rounded-xl border border-purple-100">
            <Clock className="text-purple-600 h-4 w-4" />
            <span className="font-mono font-bold text-purple-700">{formatTime(timeLeft)}</span>
          </div>
          {sessionActive && (
            <Button onClick={handleEndSession} variant="destructive" className="rounded-xl px-6">
              End Session
            </Button>
          )}
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-none shadow-sm rounded-2xl">
          <CardContent className="p-6">
            <div className="text-sm font-medium text-slate-400 mb-1">Total Students</div>
            <div className="text-3xl font-black text-slate-800">{students.length}</div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm rounded-2xl">
          <CardContent className="p-6">
            <div className="text-sm font-medium text-slate-400 mb-1">Students Attended</div>
            <div className="text-3xl font-black text-purple-600">
              {session?.attendance?.length || 0}
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm rounded-2xl">
          <CardContent className="p-6">
            <div className="text-sm font-medium text-slate-400 mb-1">Live Status</div>
            <div>
              {sessionActive ? (
                <Badge className="bg-emerald-500 hover:bg-emerald-600 px-3 py-1">Active</Badge>
              ) : (
                <Badge variant="outline" className="text-slate-400">Ended</Badge>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        
        {/* NUMBER DISPLAY */}
        <Card className="lg:col-span-2 border-none shadow-lg rounded-3xl overflow-hidden bg-white">
          <CardHeader className="border-b border-slate-50 bg-purple-600 text-white py-6">
            <CardTitle className="flex items-center gap-2 text-lg justify-center">
              <Hash className="h-5 w-5" />
              Target Selection
            </CardTitle>
          </CardHeader>
          <CardContent className="p-10 flex flex-col items-center">
            {sessionActive ? (
              <div className="space-y-10 w-full text-center">
                <div className="bg-purple-50 p-8 rounded-[2.5rem] border-2 border-purple-100 shadow-inner">
                  <p className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-4">Correct Choice (Teacher)</p>
                  <div className="bg-purple-600 text-white rounded-2xl px-10 py-8 text-6xl font-black shadow-2xl inline-block">
                    {session?.correctNumber}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <p className="text-sm text-slate-400 font-medium italic">Student Screen Options:</p>
                  <div className="flex gap-4 justify-center">
                    {session?.numberOptions?.map((num, idx) => (
                      <div key={idx} className="bg-white text-slate-700 rounded-2xl px-6 py-4 text-2xl font-bold border-2 border-slate-100 shadow-sm">
                        {num}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 opacity-30">
                <Hash className="h-20 w-20 text-slate-400" />
                <p className="text-xl font-bold">Session Finished</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* STUDENT FEED */}
        <Card className="lg:col-span-3 border-none shadow-lg rounded-3xl overflow-hidden flex flex-col bg-white">
          <CardHeader className="border-b border-slate-50 bg-white py-6 px-8">
            <CardTitle className="flex items-center gap-2 text-slate-700">
              <Users className="h-5 w-5 text-purple-600" />
              Live Attendance Feed
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 flex-1 max-h-[450px] overflow-y-auto">
            {students.length > 0 ? (
              students.map((student, index) => {
                const isPresent = session?.attendance?.includes(student.oid);
                return (
                  <div
                    key={student.oid}
                    className={`flex items-center justify-between p-5 border-b border-slate-50 transition-all ${
                      isPresent ? 'bg-purple-50/50' : 'bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-xs font-mono text-slate-300">#{String(index + 1).padStart(2, '0')}</span>
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm ${
                        isPresent ? 'bg-purple-600 text-white shadow-md shadow-purple-100' : 'bg-slate-100 text-slate-400'
                      }`}>
                        {student.fullName.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className={`font-semibold ${isPresent ? 'text-purple-900' : 'text-slate-600'}`}>
                        {student.fullName}
                      </div>
                    </div>
                    {isPresent ? (
                      <div className="flex items-center gap-2 text-purple-600 bg-purple-100 px-3 py-1 rounded-full text-xs font-black">
                        <CheckCircle className="h-4 w-4" />
                        PRESENT
                      </div>
                    ) : (
                      <span className="text-[10px] text-slate-300 italic uppercase font-bold">Waiting...</span>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="py-20 text-center text-slate-300 italic">No students registered in this class</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}