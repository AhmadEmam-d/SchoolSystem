import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router';
import { Button } from '../../components/ui/button';
import { ArrowLeft, Clock, Users, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';

export function QRAttendance() {
  const navigate   = useNavigate();
  const [searchParams] = useSearchParams();
  const location   = useLocation();

  const className  = searchParams.get('className') || 'Class';

  // ✅ بنجيب الـ sessionData من navigation state
  const sessionData = location.state?.sessionData;
 // console.log("sessionData:", sessionData);

  const [timeLeft, setTimeLeft] = useState(null);

  // حساب الوقت المتبقي من expiresAt
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

  return (
    <div className="space-y-6 max-w-2xl mx-auto">

      {/* HEADER */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">QR Code Attendance</h1>
          <p className="text-muted-foreground mt-1">{sessionData.className || className}</p>
        </div>
      </div>

      {/* QR CARD */}
      <div className="bg-card border rounded-xl shadow-sm p-8 flex flex-col items-center gap-6">

        {/* Timer */}
        <div className={`flex items-center gap-2 text-lg font-semibold px-4 py-2 rounded-full ${
          isExpired
            ? 'bg-red-100 text-red-600'
            : timeLeft !== null && timeLeft < 60
              ? 'bg-orange-100 text-orange-600'
              : 'bg-green-100 text-green-600'
        }`}>
          <Clock className="h-5 w-5" />
          {isExpired ? 'Session Expired' : `Expires in ${formatTime(timeLeft)}`}
        </div>

        {/* QR Image */}
        {sessionData.qrCodeBase64 ? (
          <div className="p-4 bg-white rounded-xl border shadow-inner">
            <img
              src={`data:image/png;base64,${sessionData.qrCodeBase64}`}
              alt="Attendance QR Code"
              className="w-64 h-64 object-contain"
            />
          </div>
        ) : (
          <div className="w-64 h-64 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
            QR not available
          </div>
        )}

        <p className="text-sm text-muted-foreground text-center">
          Ask students to scan this QR code to mark their attendance
        </p>

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
                  <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold">
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
            onClick={() => navigate(
             `/teacher/attendance/manual?classOid=${sessionData.classOid}&className=${encodeURIComponent(sessionData.className)}&lessonOid=${sessionData.lessonOid}&date=${format(new Date(), 'yyyy-MM-dd')}`,
              { state: { sessionData } }
            )}
          >
            <CheckCircle2 className="h-4 w-4 mr-2" />
            View Manual List
          </Button>
        </div>
      </div>
    </div>
  );
}