import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { ArrowLeft, TrendingUp, TrendingDown, Minus, Loader2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { toast } from 'sonner';
import { getGradeColors, getChartColors } from '../../lib/uiConstants';

const API = "http://edusmarrt.runasp.net/api";

export function HomeworkGrades() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const gradeColors = getGradeColors();
  const chartColors = getChartColors();

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        setLoading(true);

        const res = await fetch(`${API}/Homeworks/${id}/grade-report`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!res.ok) throw new Error("API Error");

        const data = await res.json();

        if (data.success) {
          setReportData(data.data);
        } else {
          toast.error("Failed to load grade report");
        }

      } catch (error) {
        console.error(error);
        toast.error("Connection error with server ❌");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchGrades();
  }, [id]);

  const stats = {
    avgGrade: reportData?.averageGrade || 0,
    highest: reportData?.highestGrade || 0,
    lowest: reportData?.lowestGrade || 0,
    passRate: reportData?.passRate || 0
  };

  const studentGrades = reportData?.studentGrades || [];

  const scoreDistribution = reportData?.gradeDistribution
    ? Object.entries(reportData.gradeDistribution).map(([range, count]) => ({
        range,
        count
      }))
    : [];

  const gradePieData = [
    { name: 'A (90-100)', value: reportData?.gradeDistribution?.["90-100"] || 0, color: gradeColors.A },
    { name: 'B (80-89)', value: reportData?.gradeDistribution?.["80-89"] || 0, color: gradeColors.B },
    { name: 'C (70-79)', value: reportData?.gradeDistribution?.["70-79"] || 0, color: gradeColors.C },
    { name: 'D (0-69)', value: (reportData?.gradeDistribution?.["60-69"] || 0) + (reportData?.gradeDistribution?.["0-59"] || 0), color: gradeColors.D },
  ];

  if (loading) {
    return (
      <div className="h-96 flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
        <p className="text-gray-500 font-medium">Fetching analysis report...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">Homework Analysis</h1>
          <p className="text-gray-500">Detailed performance insights</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Average Grade" value={`${stats.avgGrade}%`} icon={<Minus className="text-blue-600" />} color="text-blue-600" />
        <StatCard title="Highest Grade" value={`${stats.highest}%`} icon={<TrendingUp className="text-green-600" />} color="text-green-600" />
        <StatCard title="Lowest Grade" value={`${stats.lowest}%`} icon={<TrendingDown className="text-red-600" />} color="text-red-600" />
        <StatCard title="Pass Rate" value={`${stats.passRate}%`} icon={<TrendingUp className="text-indigo-600" />} color="text-indigo-600" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <Card>
          <CardHeader>
            <CardTitle>Score Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={scoreDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill={chartColors.primary} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Grade Overview</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={gradePieData} dataKey="value">
                  {gradePieData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

      </div>

      {/* Table */}
   <Card className="shadow-sm rounded-2xl overflow-hidden">
  <CardHeader>
    <CardTitle className="text-lg font-bold">Student Rankings</CardTitle>
  </CardHeader>

  <CardContent className="p-0">
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">

        {/* HEADER */}
        <thead className="bg-gray-50 border-b">
          <tr className="text-gray-500 uppercase text-xs tracking-wider">
            <th className="p-4 text-center">Rank</th>
            <th className="p-4">Student</th>
            <th className="p-4 text-center">Grade</th>
            <th className="p-4 text-center">Performance</th>
          </tr>
        </thead>

        {/* BODY */}
        <tbody className="divide-y">
          {studentGrades.length > 0 ? studentGrades.map((s, index) => (
            <tr key={s.rank || index} className="hover:bg-gray-50 transition">

              {/* Rank */}
              <td className="p-4 text-center font-bold text-indigo-600">
                #{s.rank}
              </td>

              {/* Student */}
              <td className="p-4 font-semibold text-gray-900">
                {s.studentName}
              </td>

              {/* Grade */}
              <td className="p-4 text-center">
                <span className="font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg">
                  {s.grade}%
                </span>
              </td>

              {/* Performance */}
              <td className="p-4 text-center">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    s.grade >= stats.avgGrade
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {s.grade >= stats.avgGrade ? "Above Avg" : "Below Avg"}
                </span>
              </td>

            </tr>
          )) : (
            <tr>
              <td colSpan="4" className="text-center py-10 text-gray-400">
                No data available
              </td>
            </tr>
          )}
        </tbody>

      </table>
    </div>
  </CardContent>
</Card>
    </div>
  );
}

function StatCard({ title, value, icon, color }) {
  return (
    <Card>
      <CardContent className="p-6 flex justify-between">
        <div>
          <p>{title}</p>
          <h3 className={color}>{value}</h3>
        </div>
        {icon}
      </CardContent>
    </Card>
  );
}