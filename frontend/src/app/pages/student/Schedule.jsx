import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Clock, MapPin, User, ChevronLeft, ChevronRight, QrCode, X, CheckCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { format, addDays, startOfWeek } from 'date-fns';
import { api } from '../../lib/api';

// ─── helper: هل الرسالة معناها "سبق تسجيل الحضور"؟ ──────────────────────────
function isAlreadySubmitted(text = '') {
  const t = text.toLowerCase();
  return (
    t.includes('already') ||
    t.includes('submitted') ||
    t.includes('سبق') ||
    t.includes('مسجل')
  );
}

// ─── Attendance Modal ──────────────────────────────────────────────────────────
function AttendanceModal({ session, onClose, onSuccess }) {
  const [selectedNumber, setSelectedNumber] = useState(null);
  const [submitting, setSubmitting]         = useState(false);
  const [result, setResult]                 = useState(null);

  const isQR     = session?.method === 2;
  const isNumber = session?.method === 3;

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const payload = {
        sessionId:      session.sessionId,
        selectedNumber: isNumber ? selectedNumber : null,
        remarks:        null,
      };

      const res   = await api.attendance.studentSubmit(payload);
      const inner = res.data?.data; // StudentSubmitAttendanceResponseDto

      if (res.ok && inner?.success) {
        setResult({ success: true, message: inner?.message || 'Attendance recorded!' });
        setTimeout(() => { onSuccess(); onClose(); }, 1800);
      } else {
        const errMsg =
          res.data?.errors?.[0] ||
          inner?.message ||
          res.data?.messages?.EN ||
          'Failed to record attendance.';

        // لو السبب إنه سجل قبل كده → close وعلّم كـ attended
        if (isAlreadySubmitted(errMsg)) {
          onSuccess();
          onClose();
          return;
        }

        setResult({ success: false, message: errMsg });
      }
    } catch (e) {
      setResult({ success: false, message: e.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 50,
        background: 'rgba(0,0,0,0.45)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div style={{
        background: 'var(--color-background-primary)',
        borderRadius: '12px', padding: '1.5rem',
        width: '100%', maxWidth: 400,
        boxShadow: '0 8px 40px rgba(0,0,0,0.18)',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <p style={{ fontSize: 18, fontWeight: 500, color: 'var(--color-text-primary)', margin: 0 }}>
              Mark Attendance
            </p>
            <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', margin: '2px 0 0' }}>
              {session?.className}
            </p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-secondary)' }}>
            <X size={18} />
          </button>
        </div>

        {/* Result */}
        {result ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, padding: '1.5rem 0' }}>
            {result.success ? <CheckCircle size={48} color="green" /> : <AlertCircle size={48} color="red" />}
            <p style={{ textAlign: 'center', color: result.success ? 'green' : 'red', fontWeight: 500 }}>
              {result.message}
            </p>
          </div>
        ) : (
          <>
            {/* QR */}
            {isQR && session?.qrCodeBase64 && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, marginBottom: '1rem' }}>
                <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', margin: 0 }}>
                  Scan this QR code to confirm your attendance
                </p>
                <img
                  src={`data:image/png;base64,${session.qrCodeBase64}`}
                  alt="QR Code"
                  style={{ width: 180, height: 180, borderRadius: 8, border: '1px solid #e5e7eb' }}
                />
              </div>
            )}

            {/* Number */}
            {isNumber && session?.randomNumbers?.length > 0 && (
              <div style={{ marginBottom: '1rem' }}>
                <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginBottom: 10 }}>
                  Select the number shown by your teacher
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {session.randomNumbers.map((num) => (
                    <button
                      key={num}
                      onClick={() => setSelectedNumber(num)}
                      style={{
                        width: 52, height: 52, borderRadius: 8,
                        border: selectedNumber === num ? '2px solid #4f46e5' : '1px solid #e5e7eb',
                        background: selectedNumber === num ? '#eef2ff' : '#f9fafb',
                        color: selectedNumber === num ? '#4f46e5' : '#111',
                        fontWeight: selectedNumber === num ? 500 : 400,
                        fontSize: 16, cursor: 'pointer',
                      }}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Expiry */}
            {session?.expiresAt && (
              <p style={{ fontSize: 12, color: '#9ca3af', marginBottom: '1rem' }}>
                Expires at {format(new Date(
                  session.expiresAt.endsWith('Z') ? session.expiresAt : session.expiresAt + 'Z'
                ), 'hh:mm a')}
              </p>
            )}

            {/* Confirm */}
            <button
              onClick={handleSubmit}
              disabled={submitting || (isNumber && selectedNumber === null)}
              style={{
                width: '100%', padding: '10px 0',
                borderRadius: 8, border: 'none',
                background: (submitting || (isNumber && selectedNumber === null)) ? '#e5e7eb' : '#4f46e5',
                color: '#fff', fontWeight: 500, fontSize: 14,
                cursor: submitting || (isNumber && selectedNumber === null) ? 'not-allowed' : 'pointer',
              }}
            >
              {submitting ? 'Submitting...' : 'Confirm Attendance'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Attendance Button ─────────────────────────────────────────────────────────
function AttendanceButton({ lesson, isToday }) {
  const [checking, setChecking]         = useState(false);
  const [showModal, setShowModal]       = useState(false);
  const [attended, setAttended]         = useState(false);
  const [activeSession, setActiveSession] = useState(null);

  if (!isToday) return null;

  const handleClick = async () => {
    setChecking(true);
    try {
      const response = await api.attendance.getStudentActiveSession();

      if (response.ok && response.data) {
        // ✅ في session نشطة → افتح الـ modal
        setActiveSession(response.data);
        setShowModal(true);
      } else {
        // مفيش session أو error — نجمع كل رسائل الـ error من أي مكان
        const raw = response.data;
        const msgs = [
          raw?.errors?.[0],
          raw?.data?.message,
          raw?.messages?.EN,
          raw?.message,
        ].filter(Boolean);

        const combined = msgs.join(' ');

        if (isAlreadySubmitted(combined)) {
          // ✅ سجل حضوره قبل كده
          setAttended(true);
        } else if (msgs.length > 0) {
          // رسالة error تانية
          alert(msgs[0]);
        } else {
          alert('لا توجد جلسة حضور نشطة لهذه الحصة');
        }
      }
    } catch (error) {
      alert('حدث خطأ في الاتصال بالخادم');
    } finally {
      setChecking(false);
    }
  };

  if (attended) {
    return (
      <div style={{
        marginTop: 8,
        display: 'flex', alignItems: 'center', gap: 5,
        padding: '5px 10px', borderRadius: 6,
        border: '1px solid #16a34a',
        background: '#f0fdf4',
        color: '#16a34a',
        fontSize: 11, fontWeight: 500,
      }}>
        <CheckCircle size={12} />
        Attendance Recorded ✓
      </div>
    );
  }

  return (
    <>
      <button
        onClick={handleClick}
        disabled={checking}
        style={{
          marginTop: 8,
          display: 'flex', alignItems: 'center', gap: 5,
          padding: '5px 10px', borderRadius: 6,
          border: '1px solid #4f46e5',
          background: '#eef2ff', color: '#4f46e5',
          fontSize: 11, fontWeight: 500,
          cursor: checking ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s',
        }}
        onMouseEnter={(e) => { if (!checking) e.currentTarget.style.background = '#e0e7ff'; }}
        onMouseLeave={(e) => { if (!checking) e.currentTarget.style.background = '#eef2ff'; }}
      >
        {checking ? (
          <span style={{
            width: 12, height: 12,
            border: '2px solid #4f46e5',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            display: 'inline-block',
            animation: 'spin .6s linear infinite',
          }} />
        ) : (
          <QrCode size={12} />
        )}
        {checking ? 'Checking...' : 'Mark Attendance'}
      </button>

      {showModal && activeSession && (
        <AttendanceModal
          session={activeSession}
          onClose={() => setShowModal(false)}
          onSuccess={() => setAttended(true)}
        />
      )}
    </>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export function StudentSchedule() {
  const { t } = useTranslation();
  const [currentWeek, setCurrentWeek]       = useState(new Date());
  const [weeklyTimetable, setWeeklyTimetable] = useState([]);
  const [loading, setLoading]               = useState(false);
  const [error, setError]                   = useState(null);

  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 0 });
  const weekDays  = Array.from({ length: 5 }, (_, i) => addDays(weekStart, i));

  useEffect(() => {
    const fetchSchedule = async () => {
      setLoading(true);
      setError(null);
      try {
        const localDate = weekStart.toLocaleDateString('en-CA');
        const result    = await api.timetable.getStudentWeeklySchedule(localDate);

        if (result.ok && result.data) {
          const allDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];
          const timetable = result.data.weeklyTimetable || [];
          const completeTimetable = allDays.map(dayName => {
            const existingDay = timetable.find(d => d.dayName === dayName);
            if (existingDay) return existingDay;
            return {
              dayName,
              date: format(weekDays[allDays.indexOf(dayName)], 'yyyy-MM-dd'),
              lessons: [],
            };
          });
          setWeeklyTimetable(completeTimetable);
        } else {
          setError('Failed to load schedule');
          setWeeklyTimetable([]);
        }
      } catch (err) {
        setError(err.message);
        setWeeklyTimetable([]);
      } finally {
        setLoading(false);
      }
    };
    fetchSchedule();
  }, [currentWeek]);

  const getSubjectColor = (subject) => {
    const colors = {
      'Mathematics':        'bg-blue-100 text-blue-800 border-blue-200',
      'math':               'bg-blue-100 text-blue-800 border-blue-200',
      'Science':            'bg-green-100 text-green-800 border-green-200',
      'English':            'bg-purple-100 text-purple-800 border-purple-200',
      'History':            'bg-orange-100 text-orange-800 border-orange-200',
      'Art':                'bg-pink-100 text-pink-800 border-pink-200',
      'Physical Education': 'bg-red-100 text-red-800 border-red-200',
      'Chemistry':          'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Biology':            'bg-teal-100 text-teal-800 border-teal-200',
      'arabic':             'bg-rose-100 text-rose-800 border-rose-200',
    };
    return colors[subject] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getLessonsForDay = (dayName) =>
    weeklyTimetable.find(d => d.dayName?.toLowerCase() === dayName.toLowerCase())?.lessons || [];

  const getDayData = (dayName) =>
    weeklyTimetable.find(d => d.dayName?.toLowerCase() === dayName.toLowerCase());

  const todayStr = format(new Date(), 'yyyy-MM-dd');

  return (
    <>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t('myScheduleTitle')}</h1>
            <p className="text-gray-500 mt-1">{t('viewWeeklyTimetable')}</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={() => setCurrentWeek(addDays(currentWeek, -7))}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="text-sm font-medium text-gray-700 min-w-[200px] text-center">
              {format(weekDays[0], 'MMM d')} – {format(weekDays[4], 'MMM d, yyyy')}
            </div>
            <Button variant="outline" size="sm" onClick={() => setCurrentWeek(addDays(currentWeek, 7))}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Weekly Summary */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {weekDays.map((date, index) => {
            const dayName = format(date, 'EEEE');
            const lessons = getLessonsForDay(dayName);
            const isToday = format(date, 'yyyy-MM-dd') === todayStr;
            return (
              <Card key={index} className={`border-none shadow-md ${isToday ? 'ring-2 ring-indigo-600' : ''}`}>
                <CardContent className="p-4 text-center">
                  <div className={`text-sm font-medium ${isToday ? 'text-indigo-600' : 'text-gray-500'}`}>
                    {format(date, 'EEE')}
                  </div>
                  <div className={`text-2xl font-bold mt-1 ${isToday ? 'text-indigo-600' : 'text-gray-900'}`}>
                    {format(date, 'd')}
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    {loading ? '...' : `${lessons.length} ${t('classesCountLabel')}`}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Detailed Schedule */}
        <Card className="border-none shadow-md">
          <CardHeader className="border-b bg-gray-50">
            <CardTitle>{t('weeklyTimetable')}</CardTitle>
            <CardDescription>{t('completeScheduleDesc')}</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center py-20 text-gray-400">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-5 divide-x">
                {weekDays.map((date, index) => {
                  const dayName = format(date, 'EEEE');
                  const dayData = getDayData(dayName);
                  const lessons = dayData?.lessons || [];
                  const isToday = format(date, 'yyyy-MM-dd') === todayStr;

                  return (
                    <div key={index} className={`p-4 ${isToday ? 'bg-indigo-50' : ''}`}>
                      <div className="mb-4 pb-3 border-b">
                        <h3 className={`font-semibold ${isToday ? 'text-indigo-600' : 'text-gray-900'}`}>
                          {dayName}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {dayData?.date || format(date, 'MMM d')}
                        </p>
                      </div>

                      <div className="space-y-3">
                        {lessons.map((lesson, i) => (
                          <div
                            key={i}
                            className={`p-3 rounded-lg border-l-4 ${getSubjectColor(lesson.subjectName)}`}
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <Clock className="h-3 w-3" />
                              <span className="text-xs font-medium">{lesson.time}</span>
                            </div>
                            <h4 className="font-medium text-sm mb-2">{lesson.subjectName}</h4>
                            <div className="space-y-1 text-xs">
                              <div className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                <span>{lesson.teacherName}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                <span>{lesson.room}</span>
                              </div>
                            </div>
                            <AttendanceButton lesson={lesson} isToday={isToday} />
                          </div>
                        ))}
                        {lessons.length === 0 && (
                          <div className="text-center py-8 text-gray-400 text-sm">
                            {t('noClassesScheduledShort')}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}