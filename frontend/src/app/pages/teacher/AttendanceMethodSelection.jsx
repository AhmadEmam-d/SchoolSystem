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

  const [selectedMethod,     setSelectedMethod]     = useState(null);
  const [generatedNumbers,   setGeneratedNumbers]   = useState([]);
  const [correctNumber,      setCorrectNumber]      = useState(null);
  const [loading,            setLoading]            = useState(false);
  const [pendingSessionData, setPendingSessionData] = useState(null);

  const [lessonOid,     setLessonOid]     = useState(null);
  const [lessonTitle,   setLessonTitle]   = useState('');
  const [lessonLoading, setLessonLoading] = useState(true);
  const [lessonError,   setLessonError]   = useState(null);

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
          (l) => l.date && format(new Date(l.date), 'yyyy-MM-dd') === today
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
      } catch (err) {
        console.error('Error fetching lessons:', err);
        setLessonError('Failed to load lesson info');
      } finally {
        setLessonLoading(false);
      }
    };
    fetchLesson();
  }, [classOid]);

  const handleMethodSelect = (methodId) => {
    setSelectedMethod(methodId);
    setPendingSessionData(null);
    setGeneratedNumbers([]);
    setCorrectNumber(null);
  };

  const attendanceMethods = [
    { id: 'manual', title: 'Take Attendance Manually', description: 'Mark each student manually',       icon: ClipboardCheck, color: 'bg-blue-500' },
    { id: 'qr',     title: 'Generate QR Code',         description: 'Students scan QR code',           icon: QrCode,         color: 'bg-green-500' },
    { id: 'number', title: 'Number Selection',          description: 'Choose one number for attendance', icon: ListOrdered,    color: 'bg-amber-500' },
  ];

  const handleStartSession = async () => {
    if (!classOid)       { toast.error('Invalid class selected');    return; }
    if (!lessonOid)      { toast.error('No lesson found for today'); return; }
    if (!selectedMethod) { toast.error('Please select a method');    return; }

    // لو number وعندنا أرقام من الـ backend → روح لصفحة الكود مباشرة
    if (selectedMethod === 'number' && pendingSessionData) {
      navigate(
        `/teacher/attendance/code?classOid=${classOid}&className=${encodeURIComponent(className)}&date=${date}`,
        {
          state: {
            sessionData: pendingSessionData,
            correctNumber: pendingSessionData.randomNumbers?.[0],
            numberOptions: pendingSessionData.randomNumbers,
          },
        }
      );
      return;
    }

    setLoading(true);
    try {
      const res = await api.attendance.startSession({
        classOid,
        lessonOid,
        method: METHOD_MAP[selectedMethod],
      });

      if (!res.ok || !res.data?.data) {
        toast.error(res.data?.errors?.[0] || res.data?.messages?.Error || 'Failed to start session');
        return;
      }

      const sessionData = res.data.data;
      toast.success('Attendance session started!');

      if (selectedMethod === 'manual') {
        navigate(
          `/teacher/attendance/manual?classOid=${classOid}&className=${encodeURIComponent(className)}&date=${date}&lessonOid=${lessonOid}`,
          { state: { sessionData } }
        );
      } else if (selectedMethod === 'qr') {
        navigate(
          `/teacher/attendance/qrcode?classOid=${classOid}&className=${encodeURIComponent(className)}&date=${date}`,
          { state: { sessionData } }
        );
      } else if (selectedMethod === 'number') {
        // ← حفظ الـ sessionData وعرض أرقام الـ backend
        // أول رقم هو الصح دايماً حسب الـ backend
        setPendingSessionData(sessionData);
        setGeneratedNumbers(sessionData.randomNumbers || []);
        setCorrectNumber(sessionData.randomNumbers?.[0] ?? null);
      }

    } catch (err) {
      console.error(err);
      toast.error('Connection error');
    } finally {
      setLoading(false);
    }
  };

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

      {/* LESSON INFO BAR */}
      <div className={`flex items-center gap-3 px-4 py-3 rounded-lg border text-sm ${
        lessonLoading ? 'bg-gray-50 border-gray-200 text-gray-500'
        : lessonError  ? 'bg-amber-50 border-amber-200 text-amber-700'
        : 'bg-green-50 border-green-200 text-green-700'
      }`}>
        {lessonLoading ? (
          <><Loader2 className="h-4 w-4 animate-spin shrink-0" />Loading today&apos;s lesson...</>
        ) : lessonError ? (
          <><AlertCircle className="h-4 w-4 shrink-0" /><span>{lessonError}</span>{lessonTitle && <span className="font-medium">— {lessonTitle}</span>}</>
        ) : (
          <><CheckCircle2 className="h-4 w-4 shrink-0" />Today&apos;s lesson: <span className="font-medium ml-1">{lessonTitle}</span></>
        )}
      </div>

      {/* METHODS */}
      <div className="bg-card p-6 rounded-xl shadow-sm border">
        <p className="mb-6 text-muted-foreground font-medium">Select attendance method:</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-8">
          {attendanceMethods.map((method) => {
            const Icon = method.icon;
            const isSelected = selectedMethod === method.id;
            return (
              <Card
                key={method.id}
                className={`border-2 cursor-pointer transition-all ${isSelected ? 'border-primary bg-primary/5' : 'border-border'}`}
                onClick={() => handleMethodSelect(method.id)}
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

        {/* NUMBER METHOD - أرقام الـ backend */}
        {selectedMethod === 'number' && generatedNumbers.length > 0 && (
          <div className="mb-8 p-4 rounded-xl border bg-amber-50">
            <h3 className="font-semibold mb-4">
              ✓ Session started — correct number is highlighted:
            </h3>
            <div className="grid grid-cols-3 gap-4">
              {generatedNumbers.map((num, idx) => (
                <div
                  key={idx}
                  className={`py-4 rounded-lg border-2 text-xl font-bold text-center ${
                    idx === 0
                      ? 'bg-amber-500 text-white border-amber-600'
                      : 'bg-white border-gray-200 text-gray-700'
                  }`}
                >
                  {num}
                </div>
              ))}
            </div>
            <p className="mt-3 text-sm text-amber-700 font-medium">
              ✓ Students must select: <strong>{generatedNumbers[0]}</strong>
            </p>
          </div>
        )}

        <div className="flex justify-end pt-6 border-t">
          <Button
            size="lg"
            onClick={handleStartSession}
            disabled={!selectedMethod || loading || lessonLoading || !lessonOid}
          >
            {loading ? (
              <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Starting...</>
            ) : pendingSessionData && selectedMethod === 'number' ? (
              'Confirm & Show Numbers'
            ) : (
              'Start Session'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}