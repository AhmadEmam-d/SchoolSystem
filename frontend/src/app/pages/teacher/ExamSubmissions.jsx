import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { ArrowLeft, Search, CheckCircle, XCircle, Clock, FileText, BarChart } from 'lucide-react';

const API = "https://localhost:7179/api";

export function ExamSubmissions() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [submissions, setSubmissions] = useState([]);
  const [exam, setExam] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");

      // 1️⃣ هات بيانات الامتحان (عشان نعرف classId)
      const examRes = await fetch(`${API}/Exams/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const examData = await examRes.json();
      setExam(examData.data);

      const classId = examData.data.classOid;

      // 2️⃣ هات كل طلاب الكلاس
      const studentsRes = await fetch(`${API}/Classes/${classId}/students`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const studentsData = await studentsRes.json();

      // 3️⃣ هات اللي حلوا الامتحان
      const resultsRes = await fetch(`${API}/Exams/${id}/results`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const resultsData = await resultsRes.json();

      const results = resultsData.data || [];

      // 4️⃣ دمج البيانات
      const merged = studentsData.data.map(student => {
        const result = results.find(r => r.studentOid === student.oid);

        return {
          studentId: student.oid,
          studentName: student.name,
          status: result ? 'completed' : 'absent',
          completedDate: result?.submittedAt,
          grade: result?.score,
          totalMarks: examData.data.totalMarks,
          timeSpent: '-'
        };
      });

      setSubmissions(merged);

    } catch (error) {
      console.error(error);
    }
  };

  const filteredSubmissions = submissions.filter(sub =>
    sub.studentName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Completed
          </Badge>
        );
      case 'absent':
        return (
          <Badge className="bg-red-100 text-red-800">
            <XCircle className="h-3 w-3 mr-1" />
            Absent
          </Badge>
        );
      default:
        return null;
    }
  };

  const completedCount = submissions.filter(s => s.status === 'completed').length;
  const absentCount = submissions.filter(s => s.status === 'absent').length;
  const gradedCount = submissions.filter(s => s.grade !== undefined).length;

  const avgGrade =
    gradedCount > 0
      ? submissions
          .filter(s => s.grade !== undefined)
          .reduce((acc, s) => acc + s.grade, 0) / gradedCount
      : 0;

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate(`/teacher/exams/${id}`)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="flex-1">
          <h1 className="text-3xl font-bold">
            Exam Submissions: {exam?.name}
          </h1>
          <p className="text-gray-500 mt-1">
            {exam?.className}
          </p>
        </div>

        <Button
          className="bg-indigo-600 hover:bg-indigo-700"
          onClick={() => navigate(`/teacher/exams/${id}/grades`)}
        >
          <BarChart className="h-4 w-4 mr-2" />
          View Grades Report
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

        <Card>
          <CardContent className="p-6">
            <div>Total Students</div>
            <div className="text-2xl font-bold">{submissions.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div>Completed</div>
            <div className="text-2xl font-bold text-green-600">{completedCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div>Absent</div>
            <div className="text-2xl font-bold text-red-600">{absentCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div>Avg. Grade</div>
            <div className="text-2xl font-bold text-blue-600">
              {avgGrade.toFixed(1)}%
            </div>
          </CardContent>
        </Card>

      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
        <Input
          placeholder="Search students..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Student Exam Results</CardTitle>
        </CardHeader>

        <CardContent>
          <table className="w-full">
            <thead>
              <tr>
                <th>Student</th>
                <th>Status</th>
                <th>Grade</th>
              </tr>
            </thead>

            <tbody>
              {filteredSubmissions.map((s) => (
                <tr key={s.studentId}>
                  <td>{s.studentName}</td>
                  <td>{getStatusBadge(s.status)}</td>
                  <td>{s.grade ?? '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

    </div>
  );
}