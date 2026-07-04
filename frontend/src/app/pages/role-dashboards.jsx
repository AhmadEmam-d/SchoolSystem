import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Calendar, Users, BookOpen, Clock, Activity, TrendingUp, CheckCircle, ArrowRight, ArrowLeft, Bell, ClipboardCheck, MapPin, FileText, Loader2, QrCode, X, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useLanguage } from '../context/LanguageContext';
import { useAttendance } from '../context/AttendanceContext';
import { api } from '../lib/api';
import { format } from 'date-fns';

// ─── helper ───────────────────────────────────────────────────────────────────
function toUTC(dateStr) {
  if (!dateStr) return null;
  return dateStr.endsWith('Z') ? dateStr : dateStr + 'Z';
}

// ─────────────────────────────────────────────────────────────────────────────
export function TeacherDashboard() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();
  const isRTL = currentLanguage === 'ar';
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;
  const { sessions, endSession } = useAttendance();

  const [lessons, setLessons]               = useState([]);
  const [lessonsLoading, setLessonsLoading] = useState(true);
  const [lessonsError, setLessonsError]     = useState(null);
  const [homework, setHomework]             = useState([]);
  const [hwLoading, setHwLoading]           = useState(true);
  const [hwError, setHwError]               = useState(null);
  const [exams, setExams]                   = useState([]);
  const [examsLoading, setExamsLoading]     = useState(true);
  const [examsError, setExamsError]         = useState(null);

  useEffect(() => {
    const loadLessons = async () => {
      try {
        setLessonsError(null); setLessonsLoading(true);
        const res = await api.lessons.getAll();
        setLessons(Array.isArray(res) ? res : res?.data || []);
      } catch (err) { setLessonsError('Failed to load schedule'); }
      finally { setLessonsLoading(false); }
    };
    const loadExams = async () => {
      try {
        setExamsLoading(true); setExamsError(null);
        const res = await api.exams.getAll();
        const data = Array.isArray(res) ? res : res?.data || [];
        setExams(data.filter(e => e.date && new Date(e.date) >= new Date()).sort((a, b) => new Date(a.date) - new Date(b.date)));
      } catch { setExamsError('Failed to load exams'); }
      finally { setExamsLoading(false); }
    };
    loadLessons(); loadExams();
  }, []);

  useEffect(() => {
    const loadHomework = async () => {
      try {
        setHwError(null); setHwLoading(true);
        const res = await api.homeworks.getTeacherHomeworks();
        const data = Array.isArray(res) ? res : res?.data || [];
        setHomework(data.filter(hw => hw.status === 'Active' || hw.status === 'Grading').slice(0, 3));
      } catch { setHwError('Failed to load homework'); }
      finally { setHwLoading(false); }
    };
    loadHomework();
  }, []);

  const getLessonStatus = (lesson) => {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const lessonDate = lesson.date ? new Date(lesson.date).toISOString().split('T')[0] : null;
    if (lessonDate && lessonDate < today) return 'completed';
    if (!lessonDate || lessonDate > today) return 'upcoming';
    if (lesson.startTime) {
      const [h, m] = lesson.startTime.split(':').map(Number);
      const start = new Date(now); start.setHours(h, m, 0, 0);
      const end = new Date(start.getTime() + 45 * 60 * 1000);
      if (now >= start && now <= end) return 'ongoing';
      if (now > end) return 'completed';
    }
    return 'upcoming';
  };

  const today = new Date().toISOString().split('T')[0];
  const todayLessons = lessons.filter(l => l.date && new Date(l.date).toISOString().split('T')[0] === today && getLessonStatus(l) !== 'completed');
  const upcomingExams = exams.slice(0, 3);
  const hwSubmissionPercent = (hw) => {
    if (!hw.totalStudents || hw.totalStudents === 0) return 0;
    return Math.round(((hw.submissions ?? hw.submissionsCount ?? 0) / hw.totalStudents) * 100);
  };
  const ongoingCount  = todayLessons.filter(l => getLessonStatus(l) === 'ongoing').length;
  const upcomingCount = todayLessons.filter(l => getLessonStatus(l) === 'upcoming').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t('teacherDashboard')}</h1>
          <p className="text-muted-foreground mt-1">{t('teacherDashboardDesc')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Link to="/teacher/classes"><Card className="hover:shadow-lg transition-shadow cursor-pointer"><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">{t('todaysClasses')}</CardTitle><BookOpen className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{lessonsLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : todayLessons.length}</div><p className="text-xs text-muted-foreground">{ongoingCount} {t('ongoing')}, {upcomingCount} {t('upcoming')}</p></CardContent></Card></Link>
        <Link to="/teacher/homework"><Card className="hover:shadow-lg transition-shadow cursor-pointer"><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">{t('pendingHomework')}</CardTitle><Activity className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{hwLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : homework.length}</div><p className="text-xs text-muted-foreground">{t('submissionsToGrade')}</p></CardContent></Card></Link>
        <Link to="/teacher/exams"><Card className="hover:shadow-lg transition-shadow cursor-pointer"><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">{t('upcomingExams')}</CardTitle><Calendar className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{examsLoading ? '...' : exams.length}</div><p className="text-xs text-muted-foreground">{exams.length > 0 ? `Next: ${exams[0].className || ''} - ${exams[0].type || ''}` : 'No upcoming exams'}</p></CardContent></Card></Link>
        <Link to="/teacher/messages"><Card className="hover:shadow-lg transition-shadow cursor-pointer"><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">{t('newMessages')}</CardTitle><Bell className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">5</div><p className="text-xs text-muted-foreground">3 from parents, 2 admin</p></CardContent></Card></Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{t('todaysSchedule')}</CardTitle>
            <Link to="/teacher/classes" className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center gap-1">{t('viewAll')} <ArrowIcon className="h-4 w-4" /></Link>
          </CardHeader>
          <CardContent>
            {lessonsLoading ? <div className="flex items-center justify-center py-16"><Loader2 className="h-8 w-8 text-indigo-500 animate-spin" /></div>
              : lessonsError ? <div className="text-center py-10 text-red-500 text-sm">{lessonsError}</div>
              : todayLessons.length === 0 ? <div className="text-center py-10 text-muted-foreground text-sm">No lessons for today.</div>
              : <div className="space-y-3">{todayLessons.map((lesson, i) => {
                const status = getLessonStatus(lesson);
                const session = sessions[i];
                const isActive = session?.attendanceStatus === 'active';
                const isDone = session?.attendanceStatus === 'completed' || status === 'completed';
                const timeLabel = lesson.startTime ? `${lesson.startTime}${lesson.endTime ? ' - ' + lesson.endTime : ''}` : lesson.date ? new Date(lesson.date).toLocaleDateString('en-GB') : '—';
                return (
                  <div key={lesson.id || lesson.oid || i} className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border gap-3 ${isDone ? 'bg-muted/50 border-border' : isActive || status === 'ongoing' ? 'bg-green-50 border-green-200' : 'bg-blue-50 border-blue-200'}`}>
                    <div className="flex items-center gap-4">
                      <Clock className={`h-5 w-5 ${isDone ? 'text-muted-foreground' : isActive || status === 'ongoing' ? 'text-green-600' : 'text-blue-600'}`} />
                      <div className="space-y-0.5">
                        <div className="font-semibold text-foreground">{lesson.title || lesson.subject || 'Untitled Lesson'}{lesson.className ? ` — ${lesson.className}` : ''}</div>
                        <div className="text-sm text-muted-foreground">{timeLabel}{lesson.room ? ` • ${lesson.room}` : ''}</div>
                        {isActive && <div className="text-xs font-medium text-green-700 mt-1 flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />Active Session: {session.attendanceMethod}</div>}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 justify-end">
                      <span className={`text-xs px-2 py-1 rounded-full ${isDone ? 'bg-muted text-muted-foreground' : isActive || status === 'ongoing' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>{isActive ? 'Session Live' : isDone ? 'Attendance Completed' : t(status)}</span>
                      {isActive && <Button size="sm" variant="destructive" onClick={() => endSession(i)}>End Session</Button>}
                    </div>
                  </div>
                );
              })}</div>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>{t('quickActions')}</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { to: '/teacher/lessons/add', color: 'blue',   icon: <FileText className="h-5 w-5 text-blue-600" />,   title: t('addLesson'),       desc: t('createLessonPlan') },
                { to: '/teacher/homework',    color: 'green',  icon: <BookOpen className="h-5 w-5 text-green-600" />,  title: t('assignHomework'),  desc: t('createAssignment') },
                { to: '/teacher/exams',       color: 'amber',  icon: <Calendar className="h-5 w-5 text-amber-600" />,  title: t('scheduleExam'),    desc: t('setupExam') },
                { to: '/teacher/messages',    color: 'purple', icon: <Bell className="h-5 w-5 text-purple-600" />,     title: t('sendMessage'),     desc: t('contactParentsStudents') },
              ].map(({ to, color, icon, title, desc }) => (
                <Link key={to} to={to} className={`flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-${color}-50 hover:border-${color}-300 transition-colors`}>
                  <div className={`h-10 w-10 rounded-lg bg-${color}-100 flex items-center justify-center`}>{icon}</div>
                  <div className="flex-1"><div className="font-semibold text-foreground">{title}</div><div className="text-xs text-muted-foreground">{desc}</div></div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{t('homeworkOverview')}</CardTitle>
            <Link to="/teacher/homework" className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center gap-1">{t('viewAll')} <ArrowIcon className="h-4 w-4" /></Link>
          </CardHeader>
          <CardContent>
            {hwLoading ? <div className="flex items-center justify-center py-10"><Loader2 className="h-7 w-7 text-indigo-500 animate-spin" /></div>
              : hwError ? <div className="text-center py-8 text-red-500 text-sm">{hwError}</div>
              : homework.length === 0 ? <div className="text-center py-8 text-muted-foreground text-sm">No pending homework.</div>
              : <div className="space-y-3">{homework.map((hw, i) => {
                const submitted = hw.submissions ?? hw.submissionsCount ?? 0;
                const total = hw.totalStudents ?? 0;
                const percent = hwSubmissionPercent(hw);
                const dueLabel = hw.dueDate ? new Date(hw.dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : '—';
                return (
                  <div key={hw.oid || hw.id || i} className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => navigate(`/teacher/homework/${hw.oid || hw.id}`)}>
                    <div className="space-y-0.5 flex-1 min-w-0">
                      <div className="font-semibold text-foreground truncate">{hw.className ? `${hw.className}: ` : ''}{hw.title}</div>
                      <div className="text-sm text-muted-foreground">{total > 0 ? `${submitted}/${total} ${t('submitted')} • ` : ''}{t('due')} {dueLabel}</div>
                      {total > 0 && <div className="mt-1.5 h-1.5 w-full bg-muted rounded-full overflow-hidden"><div className={`h-full rounded-full ${percent === 100 ? 'bg-green-500' : percent >= 60 ? 'bg-indigo-500' : 'bg-amber-500'}`} style={{ width: `${percent}%` }} /></div>}
                    </div>
                    <div className="text-right ml-4 shrink-0">
                      {total > 0 && <><div className="text-sm font-semibold text-indigo-600">{percent}%</div><div className="text-xs text-muted-foreground">{t('completed')}</div></>}
                      <span className={`mt-1 inline-block text-[10px] px-2 py-0.5 rounded-full font-bold ${hw.status === 'Active' ? 'bg-indigo-100 text-indigo-700' : 'bg-amber-100 text-amber-700'}`}>{hw.status}</span>
                    </div>
                  </div>
                );
              })}</div>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{t('upcomingExams')}</CardTitle>
            <Link to="/teacher/exams" className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center gap-1">{t('viewAll')} <ArrowIcon className="h-4 w-4" /></Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingExams.map((exam, i) => (
                <div key={i} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-lg bg-indigo-100 flex items-center justify-center"><Calendar className="h-6 w-6 text-indigo-600" /></div>
                    <div className="space-y-0.5">
                      <div className="font-semibold text-foreground">{exam.className} - {exam.title}</div>
                      <div className="text-sm text-muted-foreground">{new Date(exam.date).toLocaleDateString('en-GB')}{exam.time && ` at ${exam.time}`}</div>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs rounded-full">{t('upcoming')}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ─── Student Attendance Modal ─────────────────────────────────────────────────
function StudentAttendanceModal({ session, onClose, onSuccess }) {
  const [selectedNumber, setSelectedNumber] = useState(null);
  const [submitting, setSubmitting]         = useState(false);
  const [result, setResult]                 = useState(null);

  const isQR     = session?.method === 2;
  const isNumber = session?.method === 3;

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res   = await api.attendance.studentSubmit({
        sessionId:      session.sessionId,
        selectedNumber: isNumber ? selectedNumber : null,
        remarks:        null,
      });
      const inner = res.data?.data;
      if (res.ok && inner?.success) {
        setResult({ success: true, message: inner?.message || 'Attendance recorded!' });
        setTimeout(() => { onSuccess(session.sessionId); onClose(); }, 1800);
      } else {
        const errMsg = res.data?.errors?.[0] || inner?.message || 'Failed.';
        if (errMsg.toLowerCase().includes('already')) { onSuccess(session.sessionId); onClose(); return; }
        setResult({ success: false, message: errMsg });
      }
    } catch (e) {
      setResult({ success: false, message: e.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ position:'fixed', inset:0, zIndex:50, background:'rgba(0,0,0,0.45)', backdropFilter:'blur(8px)', WebkitBackdropFilter:'blur(8px)', display:'flex', alignItems:'center', justifyContent:'center' }} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={{ background:'var(--color-background-primary)', borderRadius:12, padding:'1.5rem', width:'100%', maxWidth:400, boxShadow:'0 8px 40px rgba(0,0,0,0.18)' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1rem' }}>
          <div>
            <p style={{ fontSize:18, fontWeight:500, margin:0 }}>Mark Attendance</p>
            <p style={{ fontSize:13, color:'var(--color-text-secondary)', margin:'2px 0 0' }}>{session?.className}</p>
          </div>
          <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer' }}><X size={18} /></button>
        </div>

        {result ? (
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:12, padding:'1.5rem 0' }}>
            {result.success ? <CheckCircle size={48} color="green" /> : <AlertCircle size={48} color="red" />}
            <p style={{ textAlign:'center', color: result.success ? 'green' : 'red', fontWeight:500 }}>{result.message}</p>
          </div>
        ) : (
          <>
            {isQR && session?.qrCodeBase64 && (
              <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:12, marginBottom:'1rem' }}>
                <p style={{ fontSize:13, color:'var(--color-text-secondary)', margin:0 }}>Scan this QR code</p>
                <img src={`data:image/png;base64,${session.qrCodeBase64}`} alt="QR" style={{ width:180, height:180, borderRadius:8, border:'1px solid #e5e7eb' }} />
              </div>
            )}
            {isNumber && session?.randomNumbers?.length > 0 && (
              <div style={{ marginBottom:'1rem' }}>
                <p style={{ fontSize:13, color:'var(--color-text-secondary)', marginBottom:10 }}>Select the number shown by your teacher</p>
                <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                  {session.randomNumbers.map((num) => (
                    <button key={num} onClick={() => setSelectedNumber(num)} style={{ width:52, height:52, borderRadius:8, border: selectedNumber === num ? '2px solid #4f46e5' : '1px solid #e5e7eb', background: selectedNumber === num ? '#eef2ff' : '#f9fafb', color: selectedNumber === num ? '#4f46e5' : '#111', fontSize:16, cursor:'pointer' }}>{num}</button>
                  ))}
                </div>
              </div>
            )}
            {session?.expiresAt && (
              <p style={{ fontSize:12, color:'#9ca3af', marginBottom:'1rem' }}>
                Expires at {format(new Date(toUTC(session.expiresAt)), 'hh:mm a')}
              </p>
            )}
            <button onClick={handleSubmit} disabled={submitting || (isNumber && selectedNumber === null)} style={{ width:'100%', padding:'10px 0', borderRadius:8, border:'none', background: (submitting || (isNumber && selectedNumber === null)) ? '#e5e7eb' : '#4f46e5', color:'#fff', fontWeight:500, fontSize:14, cursor: submitting || (isNumber && selectedNumber === null) ? 'not-allowed' : 'pointer' }}>
              {submitting ? 'Submitting...' : 'Confirm Attendance'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
export function StudentDashboard() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();
  const isRTL = currentLanguage === 'ar';
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  const [exams, setExams]               = useState([]);
  const [examsLoading, setExamsLoading] = useState(true);

  // ─── Active Session State ──────────────────────────────────────────────────
  const [activeSession, setActiveSession]   = useState(null);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [showModal, setShowModal]           = useState(false);
  const [attended, setAttended]             = useState(false);

  // ─── Poll الـ session كل 15 ثانية ─────────────────────────────────────────
  const fetchActiveSession = useCallback(async () => {
    try {
      const res = await api.attendance.getStudentActiveSession();
     if (res.ok && res.data) {
  setActiveSession(res.data);
  const key = `attended_${res.data.sessionId}`;
  // ✅ لو سجل قبل كده يفضل recorded
  if (localStorage.getItem(key) === 'true') {
    setAttended(true);
  } else {
    setAttended(false);
  }
} else {
          setActiveSession(null);
  setSessionLoading(false);
      }
    } catch {
      setActiveSession(null);
    } finally {
      setSessionLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchActiveSession();
    const interval = setInterval(fetchActiveSession, 15000);
    return () => clearInterval(interval);
  }, [fetchActiveSession]);

  useEffect(() => {
    const loadExams = async () => {
      try {
        setExamsLoading(true);
        const res = await api.exams.getAll();
        const data = Array.isArray(res) ? res : res?.data || [];
        setExams(data.filter(e => e.date && new Date(e.date) >= new Date()).sort((a, b) => new Date(a.date) - new Date(b.date)));
      } catch { setExams([]); }
      finally { setExamsLoading(false); }
    };
    loadExams();
  }, []);

  const handleAttendanceSuccess = (sessionId) => {
    localStorage.setItem(`attended_${sessionId}`, 'true');
    setAttended(true);
    setShowModal(false);
  };

  const assignments = [
    { subject: 'History',     title: 'Essay on World War II',  due: 'Tomorrow',  status: 'pending',   priority: 'high'   },
    { subject: 'Science',     title: 'Lab Report - Chemistry', due: 'In 3 days', status: 'pending',   priority: 'medium' },
    { subject: 'English',     title: 'Book Report',            due: 'Friday',    status: 'pending',   priority: 'medium' },
    { subject: 'Mathematics', title: 'Algebra Problem Set',    due: 'Submitted', status: 'completed', priority: 'low'    },
  ];

  // ─── Attendance Banner ─────────────────────────────────────────────────────
  const renderAttendanceBanner = () => {
    if (sessionLoading || !activeSession) return null;

    const expiresAt = new Date(toUTC(activeSession.expiresAt));
    const timeLeft  = Math.max(0, Math.floor((expiresAt - new Date()) / 1000));
    const mins      = Math.floor(timeLeft / 60);
    const secs      = timeLeft % 60;

    if (attended) {
      return (
        <div className="flex items-center gap-3 px-5 py-4 rounded-xl border-2 border-green-200 bg-green-50">
          <CheckCircle className="h-5 w-5 text-green-600 shrink-0" />
          <div className="flex-1">
            <p className="font-semibold text-green-800">Attendance Recorded ✓</p>
            <p className="text-sm text-green-600">{activeSession.className}</p>
          </div>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-between gap-4 px-5 py-4 rounded-xl border-2 border-indigo-200 bg-indigo-50">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse shrink-0" />
          <div>
            <p className="font-semibold text-indigo-800">Active Attendance Session — {activeSession.className}</p>
            <p className="text-sm text-indigo-600">Expires in {mins}:{secs.toString().padStart(2, '0')}</p>
          </div>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors shrink-0">
          <QrCode className="h-4 w-4" />
          Mark Attendance
        </button>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t('studentDashboard')}</h1>
          <p className="text-muted-foreground mt-1">{t('studentDashboardDesc')}</p>
        </div>
        <Link to="/student/schedule" className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
          <Calendar className="h-4 w-4" />{t('viewFullSchedule')}
        </Link>
      </div>

      {/* ✅ Attendance Banner */}
      {renderAttendanceBanner()}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Link to="/student/schedule"><Card className="hover:shadow-lg transition-shadow cursor-pointer"><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">{t('todaysClasses')}</CardTitle><BookOpen className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold text-foreground">4</div><p className="text-xs text-muted-foreground mt-1">{t('nextMathClass')}</p></CardContent></Card></Link>
        <Link to="/student/homework"><Card className="hover:shadow-lg transition-shadow cursor-pointer"><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">{t('pendingHomework')}</CardTitle><Activity className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold text-foreground">3</div><p className="text-xs text-muted-foreground mt-1">{t('pending1DueTomorrow')}</p></CardContent></Card></Link>
        <Link to="/student/grades"><Card className="hover:shadow-lg transition-shadow cursor-pointer"><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">{t('averageGrade')}</CardTitle><TrendingUp className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold text-foreground">87%</div><p className="text-xs text-muted-foreground mt-1">{t('averageGradeVal')}</p></CardContent></Card></Link>
        <Link to="/student/messages"><Card className="hover:shadow-lg transition-shadow cursor-pointer"><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">{t('newMessages')}</CardTitle><Bell className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold text-foreground">2</div><p className="text-xs text-muted-foreground mt-1">{t('fromTeachers')}</p></CardContent></Card></Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>{t('nextClass')}</CardTitle><CardDescription>{t('nextClassDesc')}</CardDescription></CardHeader>
          <CardContent>
            <div className="p-6 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg text-white">
              <div className="text-3xl font-bold mb-2">Mathematics</div>
              <div className="flex flex-wrap items-center gap-4 text-indigo-100">
                <div className="flex items-center gap-2"><Users className="h-4 w-4" /><span>Mr. Nash</span></div>
                <div className="flex items-center gap-2"><MapPin className="h-4 w-4" /><span>Room 302</span></div>
                <div className="flex items-center gap-2"><Clock className="h-4 w-4" /><span>09:00 AM - 09:45 AM</span></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>{t('quickActions')}</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Link to="/student/homework" className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-indigo-50 hover:border-indigo-300 transition-colors"><div className="h-10 w-10 rounded-lg bg-indigo-100 flex items-center justify-center shrink-0"><BookOpen className="h-5 w-5 text-indigo-600" /></div><div className="flex-1 space-y-0.5"><div className="font-semibold text-foreground">{t('submitHomework')}</div><div className="text-xs text-muted-foreground">{t('submitHomeworkDesc')}</div></div></Link>
              <Link to="/student/grades" className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-green-50 hover:border-green-300 transition-colors"><div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center shrink-0"><TrendingUp className="h-5 w-5 text-green-600" /></div><div className="flex-1 space-y-0.5"><div className="font-semibold text-foreground">{t('viewGrades')}</div><div className="text-xs text-muted-foreground">{t('viewGradesDesc')}</div></div></Link>
              <Link to="/student/ai" className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-purple-50 hover:border-purple-300 transition-colors"><div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center shrink-0"><Activity className="h-5 w-5 text-purple-600" /></div><div className="flex-1 space-y-0.5"><div className="font-semibold text-foreground">{t('aiTutor')}</div><div className="text-xs text-muted-foreground">{t('aiTutorDesc')}</div></div></Link>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between"><CardTitle>{t('assignmentsDue')}</CardTitle><Link to="/student/homework" className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center gap-1">{t('viewAll')} <ArrowIcon className="h-4 w-4" /></Link></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {assignments.map((assignment, i) => (
                <div key={i} className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div className="space-y-0.5"><div className="font-semibold text-foreground">{assignment.subject}</div><div className="text-sm text-muted-foreground">{assignment.title}</div></div>
                  <div className="flex items-center gap-2">
                    {assignment.status === 'completed'
                      ? <span className="flex items-center gap-1 text-sm text-green-600"><CheckCircle className="h-4 w-4" />{assignment.due}</span>
                      : <span className={`text-sm ${assignment.priority === 'high' ? 'text-red-500 font-medium' : 'text-muted-foreground'}`}>{assignment.due}</span>}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>{t('upcomingExams')}</CardTitle></CardHeader>
          <CardContent>
            {examsLoading ? <div className="text-center py-6"><Loader2 className="h-6 w-6 animate-spin mx-auto text-indigo-500" /></div>
              : exams.length === 0 ? <div className="text-center py-6 text-muted-foreground">No upcoming exams</div>
              : <div className="space-y-3">{exams.map((exam, i) => (
                <div key={exam.id || i} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-lg bg-amber-100 flex items-center justify-center shrink-0"><Calendar className="h-6 w-6 text-amber-600" /></div>
                    <div className="space-y-0.5"><div className="font-semibold text-foreground">{exam.className} - {exam.type}</div><div className="text-sm text-muted-foreground">{new Date(exam.date).toLocaleDateString()}{exam.time && ` at ${exam.time}`}</div></div>
                  </div>
                  <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs rounded-full">{t('upcoming')}</span>
                </div>
              ))}</div>}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button onClick={() => navigate('/student/grades')} className="flex flex-col items-center justify-center h-auto py-6 px-4 border border-border rounded-lg hover:bg-muted/50 hover:border-primary/50 transition-colors cursor-pointer"><FileText className="h-8 w-8 mb-3 text-indigo-600" /><div className="font-semibold text-foreground text-base mb-1">{t('viewGrades')}</div><div className="text-sm text-muted-foreground">{t('detailedGradeReport')}</div></button>
        <button onClick={() => navigate('/student/schedule')} className="flex flex-col items-center justify-center h-auto py-6 px-4 border border-border rounded-lg hover:bg-muted/50 hover:border-primary/50 transition-colors cursor-pointer"><Calendar className="h-8 w-8 mb-3 text-indigo-600" /><div className="font-semibold text-foreground text-base mb-1">{t('viewFullSchedule')}</div><div className="text-sm text-muted-foreground">{t('classTimetable')}</div></button>
        <button onClick={() => navigate('/student/messages')} className="flex flex-col items-center justify-center h-auto py-6 px-4 border border-border rounded-lg hover:bg-muted/50 hover:border-primary/50 transition-colors cursor-pointer"><Users className="h-8 w-8 mb-3 text-indigo-600" /><div className="font-semibold text-foreground text-base mb-1">{t('contactTeachers')}</div><div className="text-sm text-muted-foreground">{t('sendMessages')}</div></button>
      </div>

      {/* ✅ Attendance Modal */}
      {showModal && activeSession && (
        <StudentAttendanceModal
          session={activeSession}
          onClose={() => setShowModal(false)}
          onSuccess={handleAttendanceSuccess}
        />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
export function ParentDashboard() {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();
  const isRTL = currentLanguage === 'ar';

  const [dashboardData, setDashboardData]         = useState(null);
  const [loading, setLoading]                     = useState(true);
  const [error, setError]                         = useState(null);
  const [selectedChildIdx, setSelectedChildIdx]   = useState(0);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const data = await api.parents.getDashboard();
        setDashboardData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>;
  if (error)   return <div className="flex items-center justify-center h-64"><p className="text-destructive">{error}</p></div>;

  const children         = dashboardData?.children          ?? [];
  const upcomingEvents   = dashboardData?.upcomingEvents    ?? [];
  const recentActivities = dashboardData?.recentActivities  ?? [];
  const subjectPerf      = dashboardData?.subjectPerformance?.subjects ?? [];
  const parentName       = dashboardData?.parentName        ?? '';
  const selectedChild    = children[selectedChildIdx]       ?? null;

  const getGpaColor = (gpa) => gpa >= 3.7 ? 'text-green-600' : gpa >= 3.0 ? 'text-blue-600' : gpa >= 2.0 ? 'text-yellow-600' : 'text-red-600';
  const getAttendanceColor = (pct) => pct >= 90 ? 'text-green-600' : pct >= 70 ? 'text-yellow-600' : 'text-red-600';
  const getEventIcon = (type) => {
    const cls = "h-5 w-5 text-indigo-600 shrink-0";
    return type?.toLowerCase() === 'homework' ? <BookOpen className={cls} /> : type?.toLowerCase() === 'meeting' ? <Users className={cls} /> : <Calendar className={cls} />;
  };
  const getEventTypeBadge = (type) => {
    switch (type?.toLowerCase()) {
      case 'exams':    return 'bg-red-100 text-red-700';
      case 'homework': return 'bg-blue-100 text-blue-700';
      case 'meeting':  return 'bg-purple-100 text-purple-700';
      default:         return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t('parentDashboard')}</h1>
          <p className="text-muted-foreground mt-1">{parentName ? `${t('welcome')}, ${parentName}` : t('parentDashboardDesc')}</p>
        </div>
        <Link to="/parent/messages" className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"><Bell className="h-4 w-4" />{t('contactTeachers')}</Link>
      </div>

      {children.length > 0 && (
        <Card>
          <CardHeader><CardTitle>{t('selectChild')}</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {children.map((child, index) => (
                <div key={`${child.studentOid ?? child.name}-${index}`} onClick={() => setSelectedChildIdx(index)} className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${selectedChildIdx === index ? 'border-primary bg-primary/10' : 'border-transparent bg-muted/50 hover:bg-muted'}`}>
                  <div className="flex flex-col items-center gap-2 text-center">
                    <div className={`h-11 w-11 rounded-full flex items-center justify-center text-lg font-bold shrink-0 relative ${selectedChildIdx === index ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                      {child.name?.[0]?.toUpperCase() ?? '?'}
                      {selectedChildIdx === index && <span className="absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full bg-background flex items-center justify-center"><CheckCircle className="h-3.5 w-3.5 text-primary" /></span>}
                    </div>
                    <div className="min-w-0 w-full"><div className="font-medium text-foreground text-sm truncate">{child.name}</div><div className="text-xs text-muted-foreground">{child.gradeLevel}</div></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {selectedChild && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">{t('attendance')}</CardTitle><Clock className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className={`text-2xl font-bold ${getAttendanceColor(selectedChild.attendance)}`}>{selectedChild.attendance}%</div><p className="text-xs text-muted-foreground mt-1">{t('presentThisMonth')}</p></CardContent></Card>
          <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">{t('subjects')}</CardTitle><BookOpen className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold text-foreground">{selectedChild.subjectsCount}</div><p className="text-xs text-muted-foreground mt-1">{t('enrolledSubjects', 'Enrolled subjects')}</p></CardContent></Card>
          <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">{t('gpa')}</CardTitle><TrendingUp className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className={`text-2xl font-bold ${getGpaColor(selectedChild.gpa)}`}>{selectedChild.gpa?.toFixed(1)}</div><p className="text-xs text-muted-foreground mt-1">{t('outOf', 'out of')} 4.0</p></CardContent></Card>
          <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">{t('gradeLevelLabel')}</CardTitle><Activity className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold text-foreground">{selectedChild.gradeLevel}</div><p className="text-xs text-muted-foreground mt-1">{t('currentGrade', 'Current grade level')}</p></CardContent></Card>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>{t('recentActivity')}</CardTitle></CardHeader>
          <CardContent>
            {recentActivities.length === 0 || recentActivities[0]?.status === 'N/A'
              ? <div className="flex items-center justify-center h-24 text-muted-foreground text-sm">{t('noRecentActivity', 'No recent activity.')}</div>
              : <div className="space-y-4">{recentActivities.map((item, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center shrink-0"><CheckCircle className="h-5 w-5 text-green-600" /></div>
                  <div className="space-y-0.5"><p className="font-medium text-foreground">{item.activity}</p>{item.timeAgo && <p className="text-xs text-muted-foreground">{item.timeAgo}</p>}</div>
                </div>
              ))}</div>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>{t('upcomingEventsLabel')}</CardTitle></CardHeader>
          <CardContent>
            {upcomingEvents.length === 0
              ? <div className="flex items-center justify-center h-24 text-muted-foreground text-sm">{t('noUpcomingEvents', 'No upcoming events.')}</div>
              : <div className="space-y-3">{upcomingEvents.map((event, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/30 transition-colors">
                  <div className="flex gap-3 items-center">{getEventIcon(event.type)}<div className="space-y-0.5"><p className="font-medium text-foreground">{event.title}</p><p className="text-sm text-muted-foreground">{event.date}</p></div></div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${getEventTypeBadge(event.type)}`}>{event.type}</span>
                </div>
              ))}</div>}
          </CardContent>
        </Card>
      </div>

      {subjectPerf.length > 0 && (
        <Card>
          <CardHeader><CardTitle>{t('subjectPerformanceTitle')}</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              {subjectPerf.map((subj, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm"><span className="font-medium text-foreground capitalize">{subj.name}</span><span className="text-muted-foreground">{subj.percentage}%</span></div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden"><div className={`h-full rounded-full ${subj.percentage >= 90 ? 'bg-green-500' : subj.percentage >= 70 ? 'bg-blue-500' : subj.percentage >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${subj.percentage}%` }} /></div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// ─── AttendanceButton (للـ StudentDashboard القديم — مش بتستخدم دلوقتي) ──────
function AttendanceButton({ attendanceEnabled, attendanceStatus, onJoin }) {
  if (attendanceStatus === 'completed') return <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-green-700 bg-green-100 rounded-full border border-green-200"><CheckCircle className="h-3.5 w-3.5 shrink-0" />Attendance Completed</span>;
  if (attendanceStatus === 'absent')    return <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-700 bg-red-100 rounded-full border border-red-200"><span className="h-2 w-2 rounded-full bg-red-500 shrink-0" />Absent</span>;
  return (
    <button onClick={attendanceEnabled ? onJoin : undefined} disabled={!attendanceEnabled} className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full border transition-all duration-200 ${!attendanceEnabled ? 'text-muted-foreground bg-muted border-border cursor-not-allowed opacity-60' : 'text-indigo-700 bg-indigo-100 border-indigo-300 hover:bg-indigo-200 cursor-pointer active:scale-95'}`}>
      <ClipboardCheck className="h-3.5 w-3.5 shrink-0" />Join Attendance
    </button>
  );
}