import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { ArrowLeft, Download } from 'lucide-react';
import { toast } from 'sonner';
import { getGradeColors, getChartColors } from '../../lib/uiConstants';

const API = "http://edusmarrt.runasp.net/api";

export function ExamGrades() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [exam, setExam] = useState(null);
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchResults(); }, [id]);

  const fetchResults = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      // جلب بيانات الامتحان
      const examRes = await fetch(`${API}/Exams/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const examData = await examRes.json();
      setExam(examData.data);

      // جلب النتائج
      const res = await fetch(`${API}/Exams/${id}/results`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Request failed");
      const data = await res.json();

      const allResults = data.data || [];

      // ✅ خد آخر result لكل طالب بس (dedup by studentOid)
      const latestByStudent = Object.values(
        allResults.reduce((acc, result) => {
          const key = result.studentOid || result.studentId || result.studentName;
          // لو مفيش أو الحالي أحدث، احتفظ بيه
          if (!acc[key] || new Date(result.createdAt || 0) > new Date(acc[key].createdAt || 0)) {
            acc[key] = result;
          }
          return acc;
        }, {})
      );

      setGrades(latestByStudent);

    } catch (err) {
      console.error(err);
      toast.error("Failed to load results");
    } finally {
      setLoading(false);
    }
  };

  const gradeColors = getGradeColors();
  const totalMarks = exam?.maxScore || exam?.totalMarks || 100;

  const avgGrade = grades.length ? grades.reduce((acc, g) => acc + g.score, 0) / grades.length : 0;
  const highestGrade = grades.length ? Math.max(...grades.map(g => g.score)) : 0;
  const lowestGrade = grades.length ? Math.min(...grades.map(g => g.score)) : 0;
  const passScore = totalMarks * 0.6;
  const passRate = grades.length ? (grades.filter(g => g.score >= passScore).length / grades.length) * 100 : 0;

  const getLetterGrade = (score) => {
    const pct = (score / totalMarks) * 100;
    if (pct >= 90) return 'A';
    if (pct >= 75) return 'B';
    if (pct >= 60) return 'C';
    return 'F';
  };

  const handleExportReport = () => {
    const csvData = [];
    csvData.push(`"Exam","${exam?.name || ''}"`);
    csvData.push(`"Total Marks","${totalMarks}"`);
    csvData.push('');
    csvData.push(`"Average","${avgGrade.toFixed(1)}"`);
    csvData.push(`"Highest","${highestGrade}"`);
    csvData.push(`"Lowest","${lowestGrade}"`);
    csvData.push(`"Pass Rate","${passRate.toFixed(0)}%"`);
    csvData.push('');
    csvData.push('"Rank","Student Name","Score","Letter Grade"');
    [...grades]
      .sort((a, b) => b.score - a.score)
      .forEach((s, i) => {
        csvData.push(`"${i + 1}","${s.studentName}","${s.score}","${getLetterGrade(s.score)}"`);
      });

    const blob = new Blob([csvData.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.setAttribute('href', URL.createObjectURL(blob));
    link.setAttribute('download', `exam_grades.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Grades report exported successfully!');
  };

  if (loading) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate(`/teacher/exams/${id}`)}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Grade Report: {exam?.name}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">{exam?.className}</p>
        </div>
        <Button variant="outline" onClick={handleExportReport}>
          <Download className="h-4 w-4 mr-2" /> Export Report
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card><CardContent className="p-6"><div className="text-sm text-gray-500">Average</div><div className="text-2xl font-bold">{avgGrade.toFixed(1)}</div></CardContent></Card>
        <Card><CardContent className="p-6"><div className="text-sm text-gray-500">Highest</div><div className="text-2xl font-bold text-green-600">{highestGrade}</div></CardContent></Card>
        <Card><CardContent className="p-6"><div className="text-sm text-gray-500">Lowest</div><div className="text-2xl font-bold text-red-600">{lowestGrade}</div></CardContent></Card>
        <Card><CardContent className="p-6"><div className="text-sm text-gray-500">Pass Rate</div><div className="text-2xl font-bold text-blue-600">{passRate.toFixed(0)}%</div></CardContent></Card>
      </div>

      {/* جدول الطلبة */}
      <Card>
        <CardHeader><CardTitle>Student Grades</CardTitle></CardHeader>
        <CardContent>
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rank</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Score</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Letter Grade</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Performance</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y">
              {[...grades]
                .sort((a, b) => b.score - a.score)
                .map((student, index) => {
                  const letterGrade = getLetterGrade(student.score);
                  const performance = student.score > avgGrade ? 'above' : student.score < avgGrade ? 'below' : 'average';
                  return (
                    <tr key={student.oid || student.studentOid || index} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="px-6 py-4"><span className="font-bold">#{index + 1}</span></td>
                      <td className="px-6 py-4"><div className="font-medium">{student.studentName}</div></td>
                      <td className="px-6 py-4 font-bold">{student.score} / {totalMarks}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          letterGrade === 'A' ? 'bg-green-100 text-green-800' :
                          letterGrade === 'B' ? 'bg-blue-100 text-blue-800' :
                          letterGrade === 'C' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>{letterGrade}</span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {performance === 'above' && <span className="text-green-600">Above Average</span>}
                        {performance === 'below' && <span className="text-red-600">Below Average</span>}
                        {performance === 'average' && <span className="text-gray-600">Average</span>}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </CardContent>
      </Card>

    </div>
  );
}