import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router';
import { Button } from '../../components/ui/button';
import { ArrowLeft, Clock, Users, CheckCircle2, XCircle, RefreshCw } from 'lucide-react';
import { api } from '../../lib/api';
import { toast } from 'sonner';

export function CodeAttendance() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();

  const className     = searchParams.get('className') || 'Class';
  const sessionData   = location.state?.sessionData;

  // الأرقام من الـ Backend (randomNumbers) أو من navigation state
  const numberOptions = sessionData?.randomNumbers || location.state?.numberOptions || [];
  // الرقم الصح: جاي من الـ navigation state (اللي اختاره المدرس في صفحة الاختيار)
  const correctNumber = location.state?.correctNumber ?? null;

  const [timeLeft, setTimeLeft] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [attendanceList, setAttendanceList] = useState([]);
  const [loadingAttendance, setLoadingAttendance] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // ─── جيب حالة الحضور الحالية ─────────────────────────────────────────────
  const fetchAttendance = useCallback(async () => {
    if (!sessionData?.sessionId) return;
    setLoadingAttendance(true);
    try {
      const res = await api.attendance.getSessionAttendance(sessionData.sessionId);
      if (res.ok && res.data?.data?.students) {
        setAttendanceList(res.data.data.students);
      }
    } catch (err) {
      console.error('Error fetching attendance:', err);
    } finally {
      setLoadingAttendance(false);
    }
  }, [sessionData?.sessionId]);

  useEffect(() => {
    fetchAttendance();
    const interval = setInterval(fetchAttendance, 15000);
    return () => clearInterval(interval);
  }, [fetchAttendance]);

  // ─── Timer ────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!sessionData?.expiresAt) return;
    const interval = setInterval(() => {
     // ✅ لو الـ expiresAt مش فيه Z في الآخر نضيفه عشان يتعامل معاه كـ UTC
const expiresAtUTC = sessionData.expiresAt.endsWith('Z')
  ? sessionData.expiresAt
  : sessionData.expiresAt + 'Z';
const diff = Math.max(0, Math.floor((new Date(expiresAtUTC) - new Date()) / 1000));
      setTimeLeft(diff);
      if (diff === 0) clearInterval(interval);
    }, 1000);
    return () => clearInterval(interval);
  }, [sessionData]);

  if (!sessionData) {
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
  const presentCount = attendanceList.filter(s => s.status === 'Present').length;
  const absentCount  = attendanceList.filter(s => s.status === 'Absent' || s.status === 'NotRecorded').length;

  // ─── Submit Session ───────────────────────────────────────────────────────
  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const attendances = sessionData.students?.map(s => {
        const record = attendanceList.find(a => a.studentOid === s.studentOid);
        return {
          studentOid: s.studentOid,
          status: record?.status === 'Present' ? 'Present' : 'Absent',
          remarks: record?.remarks || '',
          checkInTime: record?.checkInTime || new Date().toISOString().split('T')[1].split('.')[0],
        };
      }) || [];

      const res = await api.attendance.submitSession({
        sessionId: sessionData.sessionId,
        selectedNumber: null,
        attendances,
      });

      if (res.ok) {
        toast.success('Session submitted successfully!');
        navigate('/teacher/dashboard');
      } else {
        toast.error(res.data?.errors?.[0] || 'Failed to submit');
      }
    } catch (e) {
      toast.error('Connection error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">

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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* LEFT: Numbers + Timer */}
        <div className="bg-card border rounded-xl shadow-sm p-6 flex flex-col items-center gap-5">

          {/* Timer */}
          <div className={`flex items-center gap-2 text-lg font-semibold px-4 py-2 rounded-full w-full justify-center ${
            isExpired ? 'bg-red-100 text-red-600'
              : timeLeft !== null && timeLeft < 60 ? 'bg-orange-100 text-orange-600'
              : 'bg-amber-100 text-amber-600'
          }`}>
            <Clock className="h-5 w-5" />
            {isExpired ? 'Session Expired' : `Expires in ${formatTime(timeLeft)}`}
          </div>

          <p className="text-sm text-muted-foreground text-center">
            Show these numbers to students. They must select the <strong>correct one</strong>.
          </p>

          {/* Numbers */}
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
                        ? 'bg-gray-50 text-gray-300 border-gray-200'
                        : 'bg-white border-gray-200'
                  }`}
                >
                  {num}
                </div>
              );
            })}
          </div>

          {/* Reveal Button */}
          <Button
            variant={revealed ? 'outline' : 'default'}
            className="w-full"
            onClick={() => setRevealed(!revealed)}
            disabled={isExpired}
          >
            {revealed ? 'Hide Correct Answer' : 'Reveal Correct Answer'}
          </Button>

          {revealed && correctNumber !== null && (
            <p className="text-amber-700 font-semibold text-center">
              ✓ Correct number: <span className="text-2xl">{correctNumber}</span>
            </p>
          )}

          {/* Stats */}
          <div className="w-full grid grid-cols-3 gap-3 pt-3 border-t">
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Total</p>
              <p className="font-bold text-lg">{sessionData.students?.length ?? 0}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-green-600">Present</p>
              <p className="font-bold text-lg text-green-600">{presentCount}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-red-500">Absent</p>
              <p className="font-bold text-lg text-red-500">{absentCount}</p>
            </div>
          </div>
        </div>

        {/* RIGHT: Students Live Status */}
        <div className="bg-card border rounded-xl shadow-sm flex flex-col">
          <div className="flex items-center justify-between px-5 py-4 border-b">
            <h3 className="font-semibold flex items-center gap-2">
              <Users className="h-4 w-4" />
              Live Attendance
            </h3>
            <button
              onClick={fetchAttendance}
              disabled={loadingAttendance}
              className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              <RefreshCw className={`h-3 w-3 ${loadingAttendance ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>

          <div className="overflow-y-auto max-h-80 divide-y">
            {sessionData.students?.map((s) => {
              const record = attendanceList.find(a => a.studentOid === s.studentOid);
              const isPresent = record?.status === 'Present';
              const isAbsent  = record?.status === 'Absent';

              return (
                <div key={s.studentOid} className={`flex items-center justify-between px-5 py-3 transition-colors ${isPresent ? 'bg-green-50' : ''}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                      isPresent ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {s.studentName.charAt(0)}
                    </div>
                    <span className={`text-sm font-medium ${isPresent ? 'text-green-800' : 'text-gray-700'}`}>
                      {s.studentName}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    {isPresent ? (
                      <span className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full">
                        <CheckCircle2 className="h-3 w-3" /> Present
                      </span>
                    ) : isAbsent ? (
                      <span className="flex items-center gap-1 text-xs font-bold text-red-500 bg-red-50 px-2 py-1 rounded-full">
                        <XCircle className="h-3 w-3" /> Absent
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400">Waiting...</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button variant="outline" className="flex-1" onClick={() => navigate('/teacher/dashboard')}>
          Back to Dashboard
        </Button>
        <Button
          className="flex-1"
          variant="destructive"
          disabled={submitting || isExpired}
          onClick={handleSubmit}
        >
          {submitting ? 'Submitting...' : 'End & Submit Session'}
        </Button>
      </div>
    </div>
  );
}