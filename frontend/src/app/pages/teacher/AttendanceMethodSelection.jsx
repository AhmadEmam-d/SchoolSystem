import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { Card, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import {
  ArrowLeft, ClipboardCheck, QrCode, ListOrdered,
  CheckCircle2, Loader2, AlertCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import { api } from '../../lib/api';
import { format } from 'date-fns';

const METHOD_MAP = { manual: 1, qr: 2, number: 3 };

export function AttendanceMethodSelection() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const classOid  = searchParams.get('classOid');
  const className = searchParams.get('className') || 'Class';
  const date      = searchParams.get('date') || format(new Date(), 'yyyy-MM-dd');

  const [selectedMethod, setSelectedMethod]     = useState(null);
  const [generatedNumbers, setGeneratedNumbers] = useState([]);
  const [correctNumber, setCorrectNumber]       = useState(null);
  const [loading, setLoading]                   = useState(false);

  // ─── Lesson ───────────────────────────────────────────────────────────────
  const [lessonOid, setLessonOid]         = useState(null);
  const [lessonTitle, setLessonTitle]     = useState('');
  const [lessonLoading, setLessonLoading] = useState(true);
  const [lessonError, setLessonError]     = useState(null);

  // ─── Existing Session ─────────────────────────────────────────────────────
  const [existingSession, setExistingSession] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);

  // 1️⃣ تحقق من session نشطة
  useEffect(() => {
    const checkExistingSession = async () => {
      if (!classOid) { setCheckingSession(false); return; }
      try {
        const res = await api.attendance.getSessions(classOid);
        if (res.ok && res.data?.data?.sessions) {
          const active = res.data.data.sessions.find(s => !s.isCompleted && !s.isExpired);
          if (active) setExistingSession(active);
        }
      } catch (err) {
        console.error('Error checking sessions:', err);
      } finally {
        setCheckingSession(false);
      }
    };
    checkExistingSession();
  }, [classOid]);

  // 2️⃣ جيب الـ lesson بتاع النهارده
  useEffect(() => {
    const fetchLesson = async () => {
      if (!classOid) return;
      setLessonLoading(true);
      setLessonError(null);
      try {
        const res = await api.lessons.getAll({ classOid });
        const lessons = res?.data?.data || res?.data || [];
        const today = format(new Date(), 'yyyy-MM-dd');

        const todayLesson = lessons.find(
          l => l.date && format(new Date(l.date), 'yyyy-MM-dd') === today
        );

        if (todayLesson) {
          setLessonOid(todayLesson.oid);
          setLessonTitle(todayLesson.title);
        } else {
          setLessonError('No lesson scheduled for today. Using nearest upcoming lesson.');
          const upcoming = lessons
            .filter(l => l.date >= today)
            .sort((a, b) => new Date(a.date) - new Date(b.date));
          if (upcoming.length > 0) {
            setLessonOid(upcoming[0].oid);
            setLessonTitle(upcoming[0].title);
          } else {
            setLessonError('No lessons found for this class.');
          }
        }
      } catch {
        setLessonError('Failed to load lesson info');
      } finally {
        setLessonLoading(false);
      }
    };
    fetchLesson();
  }, [classOid]);

  // 3️⃣ توليد أرقام عشوائية
  useEffect(() => {
    if (selectedMethod === 'number') {
      const nums = Array.from({ length: 3 }, () => Math.floor(Math.random() * 90) + 10);
      setGeneratedNumbers(nums);
      setCorrectNumber(null);
    }
  }, [selectedMethod]);

  const attendanceMethods = [
    { id: 'manual', title: 'Take Attendance Manually', description: 'Mark each student manually',       icon: ClipboardCheck, color: 'bg-blue-500' },
    { id: 'qr',     title: 'Generate QR Code',         description: 'Students scan QR code',            icon: QrCode,         color: 'bg-green-500' },
    { id: 'number', title: 'Number Selection',          description: 'Choose one number for attendance', icon: ListOrdered,    color: 'bg-amber-500' },
  ];

  // ─── Resume existing session ───────────────────────────────────────────────
  const handleResumeSession = async () => {
    if (!existingSession) return;
    setLoading(true);
    try {
      const res = await api.attendance.getSessionAttendance(existingSession.sessionId);
      if (!res.ok || !res.data?.data) {
        toast.error('Failed to load session details');
        return;
      }

      const sd = res.data.data;
      const methodNum =
        existingSession.method === 'QRCode'          ? 2 :
        existingSession.method === 'NumberSelection'  ? 3 : 1;

      const expiresAt = existingSession.expiresAt.endsWith('Z')
        ? existingSession.expiresAt
        : existingSession.expiresAt + 'Z';

      const sessionData = {
        sessionId:        existingSession.sessionId,
        classOid:         sd.classOid,
        lessonOid,
        lessonName:       lessonTitle,
        className,
        method:           methodNum,
        qrCodeBase64:     null,
        randomNumbers:    null,
        students:         sd.students?.map(s => ({
                            studentOid:  s.studentOid,
                            studentName: s.studentName,
                          })) || [],
        expiresAt,
        attendanceStatus: sd.students || [],
      };

      toast.info('Resuming existing session...');

      if (methodNum === 2) {
        navigate(
          `/teacher/attendance/qrcode?classOid=${classOid}&className=${encodeURIComponent(className)}&date=${date}`,
          { state: { sessionData } }
        );
      } else if (methodNum === 3) {
        // ✅ جيب correctNumber من localStorage
        const saved = localStorage.getItem(`session_correct_${existingSession.sessionId}`);
        const savedCorrect = saved ? parseInt(saved) : null;
        navigate(
          `/teacher/attendance/code?classOid=${classOid}&className=${encodeURIComponent(className)}&date=${date}`,
          { state: { sessionData: { ...sessionData, correctNumber: savedCorrect }, correctNumber: savedCorrect, numberOptions: [] } }
        );
      } else {
        navigate(
          `/teacher/attendance/manual?classOid=${classOid}&className=${encodeURIComponent(className)}&date=${date}`,
          { state: { sessionData } }
        );
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to resume session');
    } finally {
      setLoading(false);
    }
  };

  // ─── Start new session ─────────────────────────────────────────────────────
  const handleStartSession = async () => {
    if (!classOid)       { toast.error('Invalid class selected'); return; }
    if (!lessonOid)      { toast.error('No lesson found for today'); return; }
    if (!selectedMethod) { toast.error('Please select a method'); return; }
    if (selectedMethod === 'number' && correctNumber === null) {
      toast.error('Please select the correct number'); return;
    }

    setLoading(true);
    try {
      const res = await api.attendance.startSession({
        classOid,
        lessonOid,
        method:        METHOD_MAP[selectedMethod],
        correctNumber: selectedMethod === 'number' ? correctNumber : null,
      });

      if (!res.ok || !res.data?.data) {
        toast.error(res.data?.errors?.[0] || 'Failed to start session');
        return;
      }

      const sessionData = res.data.data;
      toast.success('Attendance session started!');

      if (selectedMethod === 'manual') {
        navigate(
          `/teacher/attendance/manual?classOid=${classOid}&className=${encodeURIComponent(className)}&date=${date}`,
          { state: { sessionData } }
        );
      } else if (selectedMethod === 'qr') {
        navigate(
          `/teacher/attendance/qrcode?classOid=${classOid}&className=${encodeURIComponent(className)}&date=${date}`,
          { state: { sessionData } }
        );
      } else {
        // ✅ حفظ correctNumber في localStorage + sessionData
        localStorage.setItem(`session_correct_${sessionData.sessionId}`, String(correctNumber));
        const sessionDataWithCorrect = { ...sessionData, correctNumber };
        navigate(
          `/teacher/attendance/code?classOid=${classOid}&className=${encodeURIComponent(className)}&date=${date}`,
          { state: { sessionData: sessionDataWithCorrect, correctNumber, numberOptions: generatedNumbers } }
        );
      }
    } catch {
      toast.error('Connection error');
    } finally {
      setLoading(false);
    }
  };

  if (checkingSession) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">

      {/* HEADER */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate('/teacher/dashboard')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Take Attendance</h1>
          <p className="text-muted-foreground mt-1">{className}</p>
        </div>
      </div>

      {/* Active session banner */}
      {existingSession && (
        <div className="flex items-center justify-between gap-4 px-5 py-4 rounded-xl border-2 border-indigo-200 bg-indigo-50">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse shrink-0" />
            <div>
              <p className="font-semibold text-indigo-800">Active session found</p>
              <p className="text-sm text-indigo-600">
                Method: <strong>{existingSession.method}</strong>
                {' '}— Expires: {new Date(
                  existingSession.expiresAt.endsWith('Z')
                    ? existingSession.expiresAt
                    : existingSession.expiresAt + 'Z'
                ).toLocaleTimeString()}
              </p>
            </div>
          </div>
          <Button
            onClick={handleResumeSession}
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 shrink-0"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Go to Session →'}
          </Button>
        </div>
      )}

      {/* Lesson info bar */}
      <div className={`flex items-center gap-3 px-4 py-3 rounded-lg border text-sm ${
        lessonLoading ? 'bg-gray-50 border-gray-200 text-gray-500'
          : lessonError ? 'bg-amber-50 border-amber-200 text-amber-700'
          : 'bg-green-50 border-green-200 text-green-700'
      }`}>
        {lessonLoading ? (
          <><Loader2 className="h-4 w-4 animate-spin shrink-0" /> Loading today's lesson...</>
        ) : lessonError ? (
          <><AlertCircle className="h-4 w-4 shrink-0" /><span>{lessonError}</span>{lessonTitle && <span className="font-medium ml-1">— {lessonTitle}</span>}</>
        ) : (
          <><CheckCircle2 className="h-4 w-4 shrink-0" /> Today's lesson: <span className="font-medium ml-1">{lessonTitle}</span></>
        )}
      </div>

      {/* METHODS */}
      <div className="bg-card p-6 rounded-xl shadow-sm border">
        {existingSession && (
          <p className="mb-4 text-sm text-amber-600 font-medium">
            ⚠️ Starting a new session will create a separate session alongside the existing one.
          </p>
        )}
        <p className="mb-6 text-muted-foreground font-medium">Select attendance method:</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-8">
          {attendanceMethods.map((method) => {
            const Icon = method.icon;
            const isSelected = selectedMethod === method.id;
            return (
              <Card
                key={method.id}
                className={`border-2 cursor-pointer transition-all ${isSelected ? 'border-primary bg-primary/5' : 'border-border'}`}
                onClick={() => setSelectedMethod(method.id)}
              >
                <CardHeader className="relative">
                  {isSelected && <div className="absolute top-4 right-4 text-primary"><CheckCircle2 className="h-6 w-6" /></div>}
                  <div className={`w-12 h-12 rounded-lg ${method.color} flex items-center justify-center mb-4`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle>{method.title}</CardTitle>
                  <CardDescription>{method.description}</CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>

        {/* Number Method */}
        {selectedMethod === 'number' && (
          <div className="mb-8 p-4 rounded-xl border bg-amber-50">
            <h3 className="font-semibold mb-4">Select the correct number to show students:</h3>
            <div className="grid grid-cols-3 gap-4">
              {generatedNumbers.map((num, idx) => (
                <button
                  key={idx}
                  onClick={() => setCorrectNumber(num)}
                  className={`py-4 rounded-lg border-2 text-xl font-bold transition-all ${
                    correctNumber === num
                      ? 'bg-amber-500 text-white border-amber-600'
                      : 'bg-white border-gray-200 hover:border-amber-300'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
            {correctNumber !== null && (
              <p className="mt-3 text-sm text-amber-700 font-medium">
                ✓ Students must select: <strong>{correctNumber}</strong>
              </p>
            )}
          </div>
        )}

        <div className="flex justify-end pt-6 border-t">
          <Button
            size="lg"
            onClick={handleStartSession}
            disabled={!selectedMethod || loading || lessonLoading || !lessonOid}
          >
            {loading
              ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Starting...</>
              : 'Start New Session'
            }
          </Button>
        </div>
      </div>
    </div>
  );
}