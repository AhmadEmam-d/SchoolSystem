import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router';
import { Button } from '../../components/ui/button';
import { ArrowLeft, Clock, Users } from 'lucide-react';
import { api } from '../../lib/api';
import { toast } from 'sonner';

export function CodeAttendance() {
  const navigate   = useNavigate();
  const [searchParams] = useSearchParams();
  const location   = useLocation();

  const className     = searchParams.get('className') || 'Class';

  // ✅ بنجيب الـ sessionData + correctNumber + numberOptions من navigation state
  const sessionData   = location.state?.sessionData;
 // const correctNumber = location.state?.correctNumber;
 const correctNumber = location.state?.sessionData?.correctNumber || location.state?.correctNumber;
  //const numberOptions = location.state?.numberOptions || [];
  const numberOptions = location.state?.sessionData?.randomNumbers || location.state?.numberOptions || [];

  const [timeLeft, setTimeLeft] = useState(null);
  const [revealed, setRevealed] = useState(false);
 // console.log("🔢 correctNumber:", correctNumber);

  // حساب الوقت المتبقي
  useEffect(() => {
    if (!sessionData?.expiresAt) return;

    const interval = setInterval(() => {
      const diff = Math.max(0, Math.floor((new Date(sessionData.expiresAt) - new Date()) / 1000));
      setTimeLeft(diff);
      if (diff === 0) clearInterval(interval);
    }, 1000);

    return () => clearInterval(interval);
  }, [sessionData]);

  // لو جه للصفحة من غير state → redirect
  if (!sessionData || correctNumber == null) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <p className="text-muted-foreground">No active session found.</p>
        <Button variant="outline" onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );
  }

  const formatTime = (secs) => {
    if (secs === null) return '--:--';
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const isExpired = timeLeft === 0;

  return (
    <div className="space-y-6 max-w-2xl mx-auto">

      {/* HEADER */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Number Attendance</h1>
          <p className="text-muted-foreground mt-1">{sessionData.className || className}</p>
        </div>
      </div>

      {/* MAIN CARD */}
      <div className="bg-card border rounded-xl shadow-sm p-8 flex flex-col items-center gap-6">

        {/* Timer */}
        <div className={`flex items-center gap-2 text-lg font-semibold px-4 py-2 rounded-full ${
          isExpired
            ? 'bg-red-100 text-red-600'
            : timeLeft !== null && timeLeft < 60
              ? 'bg-orange-100 text-orange-600'
              : 'bg-amber-100 text-amber-600'
        }`}>
          <Clock className="h-5 w-5" />
          {isExpired ? 'Session Expired' : `Expires in ${formatTime(timeLeft)}`}
        </div>

        {/* Instructions */}
        <p className="text-center text-muted-foreground text-sm">
          Show these numbers to your students. They must select the <strong>correct one</strong> to mark attendance.
        </p>

        {/* Numbers Display */}
        <div className="grid grid-cols-3 gap-4 w-full">
          {numberOptions.map((num, idx) => {
            const isCorrect = num === correctNumber;
            return (
              <div
                key={idx}
                className={`py-8 rounded-xl border-2 text-4xl font-bold text-center transition-all ${
                  revealed && isCorrect
                    ? 'bg-amber-500 text-white border-amber-600 scale-105 shadow-lg'
                    : revealed && !isCorrect
                      ? 'bg-gray-50 text-gray-400 border-gray-200'
                      : 'bg-white border-gray-200'
                }`}
              >
                {num}
              </div>
            );
          })}
        </div>

        {/* Reveal / Hide Button */}
        <Button
          variant={revealed ? 'outline' : 'default'}
          className="w-full"
          onClick={() => setRevealed(!revealed)}
          disabled={isExpired}
        >
          {revealed ? 'Hide Correct Answer' : 'Reveal Correct Answer'}
        </Button>

        {revealed && (
          <p className="text-amber-700 font-semibold text-center">
            ✓ Correct number: <span className="text-2xl">{correctNumber}</span>
          </p>
        )}

        {/* Session Info */}
        <div className="w-full grid grid-cols-2 gap-4 pt-4 border-t">
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Lesson</p>
            <p className="font-medium text-sm">{sessionData.lessonName}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Students</p>
            <div className="flex items-center justify-center gap-1">
              <Users className="h-4 w-4 text-muted-foreground" />
              <p className="font-medium text-sm">{sessionData.students?.length ?? 0}</p>
            </div>
          </div>
        </div>

        {/* Students List */}
        {sessionData.students?.length > 0 && (
          <div className="w-full">
            <h3 className="font-semibold mb-3 text-sm">Students ({sessionData.students.length})</h3>
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
              {sessionData.students.map((s) => (
                <div
                  key={s.studentOid}
                  className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg text-sm"
                >
                  <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-xs font-bold">
                    {s.studentName.charAt(0)}
                  </div>
                  <span className="truncate">{s.studentName}</span>
                </div>
              ))}
            </div>
          </div>
        )}

       {/* Actions */}
<div className="flex gap-3 w-full pt-2">
  <Button
    variant="outline"
    className="flex-1"
    onClick={() => navigate('/teacher/dashboard')}
  >
    Back to Dashboard
  </Button>
  <Button
    className="flex-1"
    variant="destructive"
    disabled={isExpired}
    onClick={async () => {
  try {
  const res = await api.attendance.submitSession({
  sessionId: sessionData.sessionId,
  selectedNumber: null,
  attendances: sessionData.students?.map(s => ({
    studentOid: s.studentOid,
    status: 'Absent',
    remarks: '',
    checkInTime: new Date().toISOString().split('T')[1].split('.')[0],
  })) || [],
});
    console.log("❌ error:", JSON.stringify(res.data, null, 2));
    console.log("📥 submit session:", res);
    if (res.ok) {
      toast.success('Session submitted!');
      navigate('/teacher/dashboard');
    } else {
      toast.error(res.data?.errors?.[0] || 'Failed to submit');
    }
  } catch (e) {
    console.error(e);
    toast.error('Connection error');
  }
}}
  >
    Submit Session
  </Button>
</div>
      </div>
    </div>
  );
}