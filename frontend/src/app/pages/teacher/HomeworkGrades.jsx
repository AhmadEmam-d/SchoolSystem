import React from 'react';
import { useNavigate, useParams } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { ArrowLeft, Download, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { toast } from 'sonner';
import { getGradeColors, getChartColors } from '../../lib/uiConstants';

export function HomeworkGrades() {
  const navigate = useNavigate();
  const { id } = useParams();

  // Mock homework and grades data
  const homework = {
    title: 'Calculus Worksheet - Chapter 3',
    class: 'Class 10-A',
    dueDate: '2026-03-15',
    totalMarks: 100
  };

  const grades = [
    { studentId: 's1', studentName: 'Ahmed Hassan', grade: 95, rank: 1 },
    { studentId: 's5', studentName: 'Youssef Ibrahim', grade: 92, rank: 2 },
    { studentId: 's2', studentName: 'Fatima Ali', grade: 88, rank: 3 },
    { studentId: 's6', studentName: 'Layla Omar', grade: 85, rank: 4 },
    { studentId: 's7', studentName: 'Khaled Nasser', grade: 82, rank: 5 },
    { studentId: 's8', studentName: 'Nour Ahmed', grade: 78, rank: 6 },
    { studentId: 's9', studentName: 'Zain Mohamed', grade: 75, rank: 7 },
    { studentId: 's3', studentName: 'Omar Khalil', grade: 72, rank: 8 },
  ];

  // Get theme-aware colors
  const gradeColors = getGradeColors();
  const chartColors = getChartColors();

  // Grade distribution data
  const gradeDistribution = [
    { grade: 'A (90-100)', count: 2, color: gradeColors.A },
    { grade: 'B (75-89)', count: 4, color: gradeColors.B },
    { grade: 'C (60-74)', count: 2, color: gradeColors.C },
    { grade: 'D (0-59)', count: 0, color: gradeColors.D },
  ];

  // Score distribution data for bar chart
  const scoreDistribution = [
    { range: '0-59', count: 0 },
    { range: '60-69', count: 0 },
    { range: '70-79', count: 3 },
    { range: '80-89', count: 3 },
    { range: '90-100', count: 2 },
  ];

  const avgGrade = grades.reduce((acc, g) => acc + g.grade, 0) / grades.length;
  const highestGrade = Math.max(...grades.map(g => g.grade));
  const lowestGrade = Math.min(...grades.map(g => g.grade));
  const passRate = (grades.filter(g => g.grade >= 60).length / grades.length) * 100;

  const handleExportReport = () => {
    const csvData = [];
    
    // Add headers
    csvData.push(`"Homework","${homework.title}"`);
    csvData.push(`"Class","${homework.class}"`);
    csvData.push(`"Due Date","${homework.dueDate}"`);
    csvData.push(`"Total Marks","${homework.totalMarks}"`);
    csvData.push(''); // Empty row
    csvData.push(`"Average Grade","${avgGrade.toFixed(1)}%"`);
    csvData.push(`"Highest Grade","${highestGrade}%"`);
    csvData.push(`"Lowest Grade","${lowestGrade}%"`);
    csvData.push(`"Pass Rate","${passRate.toFixed(0)}%"`);
    csvData.push(''); // Empty row
    csvData.push('"Rank","Student ID","Student Name","Grade","Letter Grade","Performance"');
    
    // Add student grades
    grades.forEach((student) => {
      const letterGrade = student.grade >= 90 ? 'A' :
                         student.grade >= 75 ? 'B' :
                         student.grade >= 60 ? 'C' : 'D';
      const performance = student.grade >= avgGrade ? 'Above Average' :
                         student.grade < avgGrade ? 'Below Average' : 'Average';
      
      csvData.push(`"${student.rank}","${student.studentId}","${student.studentName}","${student.grade}/${homework.totalMarks}","${letterGrade}","${performance}"`);
    });
    
    // Create blob and download
    const csvContent = csvData.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `homework_grades_${homework.class}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Grades report exported successfully!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(`/teacher/homework/${id}`)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Grade Report: {homework.title}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {homework.class} • Due Date: {new Date(homework.dueDate).toLocaleDateString()}
          </p>
        </div>
        <Button variant="outline" onClick={handleExportReport}>
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Average Grade</div>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">
                  {avgGrade.toFixed(1)}%
                </div>
              </div>
              <Minus className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Highest Grade</div>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">
                  {highestGrade}%
                </div>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Lowest Grade</div>
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400 mt-1">
                  {lowestGrade}%
                </div>
              </div>
              <TrendingDown className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Pass Rate</div>
                <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">
                  {passRate.toFixed(0)}%
                </div>
              </div>
              <TrendingUp className="h-8 w-8 text-indigo-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Score Distribution Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Score Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={scoreDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                <XAxis dataKey="range" tick={{ fill: chartColors.axis }} />
                <YAxis tick={{ fill: chartColors.axis }} />
                <Tooltip contentStyle={{ backgroundColor: chartColors.tooltip, border: `1px solid ${chartColors.tooltipBorder}` }} />
                <Legend />
                <Bar dataKey="count" fill={chartColors.primary} name="Number of Students" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Grade Distribution Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Grade Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={gradeDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ grade, count }) => `${grade}: ${count}`}
                  outerRadius={100}
                  dataKey="count"
                >
                  {gradeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: chartColors.tooltip, border: `1px solid ${chartColors.tooltipBorder}` }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Student Grades Table */}
      <Card>
        <CardHeader>
          <CardTitle>Student Grades</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Rank
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Grade
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Letter Grade
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Performance
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                {grades.map((student) => {
                  const letterGrade = student.grade >= 90 ? 'A' :
                                     student.grade >= 75 ? 'B' :
                                     student.grade >= 60 ? 'C' : 'D';
                  const performance = student.grade >= avgGrade ? 'above' :
                                     student.grade < avgGrade ? 'below' : 'average';
                  
                  return (
                    <tr key={student.studentId} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className={`text-sm font-bold ${
                            student.rank === 1 ? 'text-yellow-600' :
                            student.rank === 2 ? 'text-gray-400' :
                            student.rank === 3 ? 'text-orange-600' :
                            'text-gray-900 dark:text-white'
                          }`}>
                            #{student.rank}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {student.studentName}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {student.studentId}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-gray-900 dark:text-white">
                          {student.grade}/{homework.totalMarks}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-sm font-semibold rounded-full ${
                          letterGrade === 'A' ? 'bg-green-100 text-green-800' :
                          letterGrade === 'B' ? 'bg-blue-100 text-blue-800' :
                          letterGrade === 'C' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {letterGrade}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1 text-sm">
                          {performance === 'above' && (
                            <>
                              <TrendingUp className="h-4 w-4 text-green-600" />
                              <span className="text-green-600">Above Average</span>
                            </>
                          )}
                          {performance === 'below' && (
                            <>
                              <TrendingDown className="h-4 w-4 text-red-600" />
                              <span className="text-red-600">Below Average</span>
                            </>
                          )}
                          {performance === 'average' && (
                            <>
                              <Minus className="h-4 w-4 text-gray-600" />
                              <span className="text-gray-600">Average</span>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}