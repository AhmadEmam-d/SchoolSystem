import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { ArrowLeft, Check, X, Save, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '../../lib/api';

export function ManualAttendance() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // ✅ FIX: استخدم classOid مش classId
  const classOid = searchParams.get('classOid');
  const className = searchParams.get('className') || 'Class';
  const date =
    searchParams.get('date') ||
    new Date().toISOString().split('T')[0];

  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // 🔥 Fetch Students
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        if (!classOid) {
          console.warn("❌ No classOid");
          return;
        }

        setLoading(true);

        const res = await api.students.getAll();

        console.log("👨‍🎓 API:", res);

        // ✅ حسب شكل API بتاعك
        const allStudents = res.data || [];

        console.log("📦 allStudents:", allStudents);

        // ✅ فلترة حسب الكلاس
        const filtered = allStudents.filter(
          (s) => s.classOid === classOid
        );

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

  // 🎯 تغيير الحالة
  const handleAttendanceMark = (studentId, status) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  // 📊 احصائيات
  const stats = {
    total: students.length,
    present: Object.values(attendance).filter(v => v === 'present').length,
    absent: Object.values(attendance).filter(v => v === 'absent').length,
    late: Object.values(attendance).filter(v => v === 'late').length,
  };

  // 💾 حفظ
  const handleSave = async () => {
    if (!classOid) return;

    setSaving(true);

    try {
      const payload = {
        classOid,
        date,
        attendances: students.map((s) => ({
          studentOid: s.oid || s.id,
          status: attendance[s.oid || s.id] || 'absent',
        })),
      };

      console.log("📤 payload:", payload);

      await api.attendance.create(payload);

      toast.success("Attendance saved!");
      navigate('/teacher/dashboard');

    } catch (err) {
      console.error(err);
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  // ❌ لو مفيش class
  if (!classOid) {
    return (
      <p className="p-6 text-red-500">
        Invalid class ❌
      </p>
    );
  }

  return (
    <div className="space-y-6 p-4">

      {/* HEADER */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>

        <div>
          <h1 className="text-2xl font-bold">
            Manual Attendance
          </h1>
          <p className="text-gray-500">
            {className} - {date}
          </p>
        </div>
      </div>

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
            <p>No students found ❌</p>
          ) : (

            <table className="w-full">
              <thead>
                <tr className="text-left border-b">
                  <th>#</th>
                  <th>Name</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {students.map((s, i) => {
                  const id = s.oid || s.id;

                  return (
                    <tr key={id} className="border-b">
                      <td>{i + 1}</td>

                      <td>{s.name || s.fullName}</td>

                      <td>
                        <div className="flex gap-2">

                          <Button
                            size="sm"
                            variant={attendance[id] === 'present' ? 'default' : 'outline'}
                            onClick={() => handleAttendanceMark(id, 'present')}
                          >
                            <Check className="h-4 w-4" />
                          </Button>

                          <Button
                            size="sm"
                            variant={attendance[id] === 'late' ? 'default' : 'outline'}
                            onClick={() => handleAttendanceMark(id, 'late')}
                          >
                            <Clock className="h-4 w-4" />
                          </Button>

                          <Button
                            size="sm"
                            variant={attendance[id] === 'absent' ? 'default' : 'outline'}
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
        disabled={saving}
        className="bg-indigo-600 text-white"
      >
        <Save className="h-4 w-4 mr-2" />
        {saving ? "Saving..." : "Save"}
      </Button>
    </div>
  );
}