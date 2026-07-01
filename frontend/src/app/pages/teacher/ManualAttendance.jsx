import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { ArrowLeft, Check, X, Save, Clock, Users } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '../../lib/api';

export function ManualAttendance() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();

  const classOid  = searchParams.get('classOid');
  const className = searchParams.get('className') || 'Class';
  const date      = searchParams.get('date') || new Date().toISOString().split('T')[0];

  // ✅ الـ sessionData جاي من navigation state
  const sessionData = location.state?.sessionData;
  const sessionId   = sessionData?.sessionId;

  const [students,   setStudents]   = useState([]);
  const [attendance, setAttendance] = useState({});
  const [loading,    setLoading]    = useState(false);
  const [saving,     setSaving]     = useState(false);

  // ─── الطلاب من الـ sessionData أو من الـ API ──────────────────────────────
  useEffect(() => {
    if (sessionData?.students?.length > 0) {
      // ✅ جيبهم من الـ sessionData مباشرة
      setStudents(sessionData.students.map(s => ({
        oid:      s.studentOid,
        fullName: s.studentName,
      })));
      return;
    }

    // fallback: جيبهم من الـ API
    const fetchStudents = async () => {
      if (!classOid) return;
      setLoading(true);
      try {
        const res = await api.students.getAll();
        const allStudents = res.data || [];
        setStudents(allStudents.filter(s => s.classOid === classOid));
      } catch {
        toast.error('Failed to load students');
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, [classOid, sessionData]);

  const handleAttendanceMark = (studentId, status) => {
    setAttendance(prev => ({ ...prev, [studentId]: status }));
  };

  const stats = {
    total:   students.length,
    present: Object.values(attendance).filter(v => v === 'present').length,
    absent:  Object.values(attendance).filter(v => v === 'absent').length,
    late:    Object.values(attendance).filter(v => v === 'late').length,
  };

  // ─── Save باستخدام submitSession ─────────────────────────────────────────
  const handleSave = async () => {
    if (!sessionId) {
      toast.error('No active session found — please go back and start a session');
      return;
    }

    setSaving(true);
    try {
      const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

      const payload = {
        sessionId,
        selectedNumber: null,
        attendances: students.map(s => ({
          studentOid: s.oid,
          status:     capitalize(attendance[s.oid] || 'absent'),
          remarks:    '',
          checkInTime: new Date().toISOString().split('T')[1].split('.')[0],
        })),
      };

      console.log('📤 submitSession payload:', payload);

      const res = await api.attendance.submitSession(payload);

      console.log('📥 submitSession response:', res);

      if (res.ok) {
        toast.success('Attendance saved!');
        navigate('/teacher/dashboard');
      } else {
        toast.error(
          res.data?.errors?.[0] ||
          res.data?.messages?.Error ||
          'Failed to save attendance'
        );
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to save');
    } finally {
      setSaving(false);
    }
  };

  if (!classOid) {
    return <p className="p-6 text-red-500">Invalid class ❌</p>;
  }

  return (
    <div className="space-y-6 p-4 max-w-3xl mx-auto">

      {/* HEADER */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Manual Attendance</h1>
          <p className="text-gray-500">{className} — {date}</p>
        </div>
      </div>

      {/* Session Warning */}
      {!sessionId && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          ⚠️ No active session found. Please go back and start a session first.
        </div>
      )}

      {/* STATS */}
      <div className="grid grid-cols-4 gap-4">
        <Card><CardContent className="p-4 text-center"><p className="text-xs text-gray-500">Total</p><p className="text-2xl font-bold">{stats.total}</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-xs text-green-600">Present</p><p className="text-2xl font-bold text-green-600">{stats.present}</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-xs text-red-500">Absent</p><p className="text-2xl font-bold text-red-500">{stats.absent}</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-xs text-yellow-600">Late</p><p className="text-2xl font-bold text-yellow-600">{stats.late}</p></CardContent></Card>
      </div>

      {/* TABLE */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Students ({students.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-gray-400">Loading...</div>
          ) : students.length === 0 ? (
            <div className="text-center py-8 text-gray-400">No students found</div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="text-left border-b">
                  <th className="pb-3 text-sm font-medium text-gray-500">#</th>
                  <th className="pb-3 text-sm font-medium text-gray-500">Name</th>
                  <th className="pb-3 text-sm font-medium text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s, i) => {
                  const id     = s.oid;
                  const status = attendance[id];
                  return (
                    <tr key={id} className={`border-b transition-colors ${
                      status === 'present' ? 'bg-green-50' :
                      status === 'absent'  ? 'bg-red-50'   :
                      status === 'late'    ? 'bg-yellow-50' : ''
                    }`}>
                      <td className="py-3 text-sm text-gray-500">{i + 1}</td>
                      <td className="py-3 font-medium">{s.fullName || s.name}</td>
                      <td className="py-3">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant={status === 'present' ? 'default' : 'outline'}
                            className={status === 'present' ? 'bg-green-600 hover:bg-green-700' : ''}
                            onClick={() => handleAttendanceMark(id, 'present')}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant={status === 'late' ? 'default' : 'outline'}
                            className={status === 'late' ? 'bg-yellow-500 hover:bg-yellow-600' : ''}
                            onClick={() => handleAttendanceMark(id, 'late')}
                          >
                            <Clock className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant={status === 'absent' ? 'default' : 'outline'}
                            className={status === 'absent' ? 'bg-red-600 hover:bg-red-700' : ''}
                            onClick={() => handleAttendanceMark(id, 'absent')}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      {/* SAVE */}
      <Button
        onClick={handleSave}
        disabled={saving || !sessionId}
        className="bg-indigo-600 hover:bg-indigo-700 text-white w-full sm:w-auto"
      >
        <Save className="h-4 w-4 mr-2" />
        {saving ? 'Saving...' : 'Save Attendance'}
      </Button>
    </div>
  );
}