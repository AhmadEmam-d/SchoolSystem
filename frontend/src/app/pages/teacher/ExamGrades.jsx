import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { ArrowLeft, Download, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { toast } from 'sonner';
import { getGradeColors, getChartColors } from '../../lib/uiConstants';

const API = "https://localhost:7179/api";

export function ExamGrades() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [exam, setExam] = useState(null);
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResults();
  }, [id]);

const fetchResults = async () => {
  try {
    setLoading(true);

    const token = localStorage.getItem("token");

    const res = await fetch(`${API}/Exams/${id}/results`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!res.ok) throw new Error("Request failed");

    const data = await res.json();

    // ✅ الصح
    setGrades(data.data || []);

    // اختياري
    if (data.data?.length > 0) {
      setExam({
        title: data.data[0].examName,
        totalMarks: 100
      });
    }

  } catch (err) {
    console.error(err);
    toast.error("Failed to load results");
  } finally {
    setLoading(false);
  }
};

  // 👇 نفس الديزاين - بس بدل grade استخدمنا score
  const gradeColors = getGradeColors();
  const chartColors = getChartColors();

  const avgGrade = grades.length
    ? grades.reduce((acc, g) => acc + g.score, 0) / grades.length
    : 0;

  const highestGrade = grades.length
    ? Math.max(...grades.map(g => g.score))
    : 0;

  const lowestGrade = grades.length
    ? Math.min(...grades.map(g => g.score))
    : 0;

  const passRate = grades.length
    ? (grades.filter(g => g.score >= 60).length / grades.length) * 100
    : 0;

  const gradeDistribution = [
    { grade: 'A (90-100)', count: grades.filter(g => g.score >= 90).length, color: gradeColors.A },
    { grade: 'B (75-89)', count: grades.filter(g => g.score >= 75 && g.score < 90).length, color: gradeColors.B },
    { grade: 'C (60-74)', count: grades.filter(g => g.score >= 60 && g.score < 75).length, color: gradeColors.C },
    { grade: 'D (0-59)', count: grades.filter(g => g.score < 60).length, color: gradeColors.D },
  ];

  const scoreDistribution = [
    { range: '0-59', count: grades.filter(g => g.score < 60).length },
    { range: '60-69', count: grades.filter(g => g.score >= 60 && g.score < 70).length },
    { range: '70-79', count: grades.filter(g => g.score >= 70 && g.score < 80).length },
    { range: '80-89', count: grades.filter(g => g.score >= 80 && g.score < 90).length },
    { range: '90-100', count: grades.filter(g => g.score >= 90).length },
  ];

  const handleExportReport = () => {
    const csvData = [];

    csvData.push(`"Exam","${exam?.title || ''}"`);
    csvData.push(`"Class","${exam?.class || ''}"`);
    csvData.push(`"Exam Date","${exam?.date || ''}"`);
    csvData.push(`"Total Marks","${exam?.totalMarks || 100}"`);
    csvData.push('');
    csvData.push(`"Average Grade","${avgGrade.toFixed(1)}%"`);
    csvData.push(`"Highest Grade","${highestGrade}%"`);
    csvData.push(`"Lowest Grade","${lowestGrade}%"`);
    csvData.push(`"Pass Rate","${passRate.toFixed(0)}%"`);
    csvData.push('');
    csvData.push('"Rank","Student Name","Grade"');

    grades.forEach((student, index) => {
      csvData.push(`"${index + 1}","${student.studentName}","${student.score}"`);
    });

    const csvContent = csvData.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `exam_grades.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success('Grades report exported successfully!');
  };

  if (loading) {
    return <div className="text-center py-20">Loading...</div>;
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate(`/teacher/exams/${id}`)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Grade Report: {exam?.title}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {exam?.class} • Exam Date: {exam?.date}
          </p>
        </div>
        <Button variant="outline" onClick={handleExportReport}>
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card><CardContent className="p-6"><div>Average: {avgGrade.toFixed(1)}%</div></CardContent></Card>
        <Card><CardContent className="p-6"><div>Highest: {highestGrade}%</div></CardContent></Card>
        <Card><CardContent className="p-6"><div>Lowest: {lowestGrade}%</div></CardContent></Card>
        <Card><CardContent className="p-6"><div>Pass Rate: {passRate.toFixed(0)}%</div></CardContent></Card>
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
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Grade</th>
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Letter Grade</th>
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Performance</th>
    </tr>
  </thead>

  <tbody className="bg-white dark:bg-gray-900 divide-y">
    {grades
      .sort((a, b) => b.score - a.score) // 🔥 ترتيب حسب الدرجة
      .map((student, index) => {

        const letterGrade = student.grade; // جاي من API

        const performance =
          student.score >= avgGrade ? 'above' :
          student.score < avgGrade ? 'below' : 'average';

        return (
          <tr key={student.oid} className="hover:bg-gray-50 dark:hover:bg-gray-800">

            {/* Rank */}
            <td className="px-6 py-4">
              <span className="font-bold">#{index + 1}</span>
            </td>

            {/* Student */}
            <td className="px-6 py-4">
              <div className="font-medium">{student.studentName}</div>
            </td>

            {/* Grade */}
            <td className="px-6 py-4 font-bold">
              {student.score}
            </td>

            {/* Letter Grade */}
            <td className="px-6 py-4">
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                letterGrade === 'A' ? 'bg-green-100 text-green-800' :
                letterGrade === 'B' ? 'bg-blue-100 text-blue-800' :
                letterGrade === 'C' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {letterGrade}
              </span>
            </td>

            {/* Performance */}
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