import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { ArrowLeft, Check, X, Save, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '../../lib/api';

export function ManualAttendance() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const classOid  = searchParams.get('classOid');
  const className = searchParams.get('className') || 'Class';
  const lessonOid = searchParams.get('lessonOid');
  const date      = searchParams.get('date') || new Date().toISOString().split('T')[0];

  const [students,   setStudents]   = useState([]);
  const [attendance, setAttendance] = useState({});
  const [loading,    setLoading]    = useState(false);
  const [saving,     setSaving]     = useState(false);

  // ─── Fetch Students ───────────────────────────────────────────────────────
  useEffect(() => {
    const fetchStudents = async () => {
      if (!classOid) return;
      setLoading(true);
      try {
        const res = await api.students.getAll();
        console.log("👨‍🎓 API:", res);

        const allStudents = res.data || [];
        console.log("📦 allStudents:", allStudents);

        const filtered = allStudents.filter((s) => s.classOid === classOid);
        console.log("🎯 filtered:", filtered);

        setStudents(filtered);
      } catch (err) {
        console.error("❌ error fetching students:", err);
        toast.error("Failed to load students");
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [classOid]);

  // ─── Mark Attendance ──────────────────────────────────────────────────────
  const handleAttendanceMark = (studentId, status) => {
    setAttendance((prev) => ({ ...prev, [studentId]: status }));
  };

  // ─── Stats ────────────────────────────────────────────────────────────────
  const stats = {
    total:   students.length,
    present: Object.values(attendance).filter(v => v === 'present').length,
    absent:  Object.values(attendance).filter(v => v === 'absent').length,
    late:    Object.values(attendance).filter(v => v === 'late').length,
  };

  // ─── Save ─────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!classOid) return;


    if (!lessonOid) {
      toast.error("No lesson found — please go back and try again");
      return;
    }

    setSaving(true);
    try {
      const STATUS_MAP = { present: 1, late: 2, absent: 3 };

const payload = {
  classOid,
  date: new Date(date).toISOString(),
  attendances: students.map((s) => ({
    studentOid: s.oid || s.id,
   status: (attendance[s.oid || s.id] || 'Absent').charAt(0).toUpperCase() + (attendance[s.oid || s.id] || 'Absent').slice(1),
    remarks: '',
    checkInTime: new Date().toISOString().split('T')[1].split('.')[0],
  })),
};

      console.log("📤 payload:", payload);

      const res = await api.attendance.create(payload);
    //  console.log("❌ errors:", JSON.stringify(res.data?.errors, null, 2));
//console.log("❌ errors:", JSON.stringify(res.errors, null, 2));
      console.log("📥 response:", res);

      if (!res.success) {
        console.log("🔍 res:", JSON.stringify(res, null, 2));
       // console.error("❌ API error:", res.data);
        toast.error(
          res.data?.errors?.[0] ||
          res.data?.messages?.Error ||
          "Failed to save attendance"
        );
        return;
      }

      toast.success("Attendance saved!");
      navigate('/teacher/dashboard');

    } catch (err) {
      console.error(err);
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  // ─── Guard ────────────────────────────────────────────────────────────────
  if (!classOid) {
    return <p className="p-6 text-red-500">Invalid class ❌</p>;
  }

  // ─── UI ───────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6 p-4">

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

      {/* lessonOid warning */}
      {!lessonOid && (
        <div className="bg-amber-50 border border-amber-200 text-amber-700 px-4 py-3 rounded-lg text-sm">
          ⚠️ No lesson linked to this session. Saving will be blocked.
        </div>
      )}

      {/* STATS */}
      <div className="grid grid-cols-4 gap-4">
        <Card><CardContent className="p-4">Total {stats.total}</CardContent></Card>
        <Card><CardContent className="p-4 text-green-600">Present {stats.present}</CardContent></Card>
        <Card><CardContent className="p-4 text-red-600">Absent {stats.absent}</CardContent></Card>
        <Card><CardContent className="p-4 text-yellow-600">Late {stats.late}</CardContent></Card>
      </div>

      {/* TABLE */}
      <Card>
        <CardHeader>
          <CardTitle>Students</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading...</p>
          ) : students.length === 0 ? (
            <p className="text-gray-400">No students found ❌</p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="text-left border-b">
                  <th className="pb-2">#</th>
                  <th className="pb-2">Name</th>
                  <th className="pb-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s, i) => {
                  const id = s.oid || s.id;
                  const status = attendance[id];
                  return (
                    <tr key={id} className="border-b">
                      <td className="py-2">{i + 1}</td>
                      <td className="py-2">{s.name || s.fullName}</td>
                      <td className="py-2">
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
        disabled={saving || !lessonOid}
        className="bg-indigo-600 hover:bg-indigo-700 text-white"
      >
        <Save className="h-4 w-4 mr-2" />
        {saving ? "Saving..." : "Save Attendance"}
      </Button>

    </div>
  );
}