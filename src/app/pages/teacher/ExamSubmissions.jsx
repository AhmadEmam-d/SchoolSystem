import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { ArrowLeft, Search, CheckCircle, XCircle, Clock, FileText, BarChart } from 'lucide-react';

export function ExamSubmissions() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchTerm, setSearchTerm] = useState('');

  // Mock exam and submissions data
  const exam = {
    title: 'Mathematics Mid-Term Exam',
    class: 'Class 10-A',
    date: '2026-03-15',
    totalMarks: 100
  };

  const submissions = [
    {
      studentId: 's1',
      studentName: 'Ahmed Hassan',
      status: 'completed',
      completedDate: '2026-03-15',
      grade: 95,
      totalMarks: 100,
      timeSpent: '1h 45m'
    },
    {
      studentId: 's2',
      studentName: 'Fatima Ali',
      status: 'completed',
      completedDate: '2026-03-15',
      grade: 88,
      totalMarks: 100,
      timeSpent: '1h 50m'
    },
    {
      studentId: 's3',
      studentName: 'Omar Khalil',
      status: 'completed',
      completedDate: '2026-03-15',
      totalMarks: 100,
      timeSpent: '1h 55m'
    },
    {
      studentId: 's4',
      studentName: 'Sara Mahmoud',
      status: 'absent',
      totalMarks: 100
    },
    {
      studentId: 's5',
      studentName: 'Youssef Ibrahim',
      status: 'completed',
      completedDate: '2026-03-15',
      grade: 92,
      totalMarks: 100,
      timeSpent: '1h 40m'
    }
  ];

  const filteredSubmissions = submissions.filter(sub =>
    sub.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.studentId.toLowerCase().includes(searchTerm.toLowerCase())
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
      case 'pending':
        return (
          <Badge className="bg-orange-100 text-orange-800">
            <Clock className="h-3 w-3 mr-1" />
            In Progress
          </Badge>
        );
      default:
        return null;
    }
  };

  const completedCount = submissions.filter(s => s.status === 'completed').length;
  const absentCount = submissions.filter(s => s.status === 'absent').length;
  const gradedCount = submissions.filter(s => s.grade !== undefined).length;
  const avgGrade = submissions
    .filter(s => s.grade !== undefined)
    .reduce((acc, s) => acc + (s.grade || 0), 0) / gradedCount || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(`/teacher/exams/${id}`)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Exam Submissions: {exam.title}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {exam.class} • Exam Date: {new Date(exam.date).toLocaleDateString()}
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
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Total Students</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {submissions.length}
                </div>
              </div>
              <FileText className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Completed</div>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">
                  {completedCount}
                </div>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Absent</div>
                <div className="text-2xl font-bold text-red-600 dark:text-red-400 mt-1">
                  {absentCount}
                </div>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Avg. Grade</div>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">
                  {avgGrade.toFixed(1)}%
                </div>
              </div>
              <BarChart className="h-8 w-8 text-blue-600" />
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

      {/* Submissions List */}
      <Card>
        <CardHeader>
          <CardTitle>Student Exam Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Completed Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Time Spent
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Grade
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                {filteredSubmissions.map((submission) => (
                  <tr key={submission.studentId} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {submission.studentName}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {submission.studentId}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(submission.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {submission.completedDate
                        ? new Date(submission.completedDate).toLocaleDateString()
                        : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {submission.timeSpent || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {submission.grade !== undefined ? (
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {submission.grade}/{submission.totalMarks}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded ${
                            submission.grade >= 90 ? 'bg-green-100 text-green-800' :
                            submission.grade >= 75 ? 'bg-blue-100 text-blue-800' :
                            submission.grade >= 60 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {submission.grade >= 90 ? 'A' :
                             submission.grade >= 75 ? 'B' :
                             submission.grade >= 60 ? 'C' : 'D'}
                          </span>
                        </div>
                      ) : submission.status === 'completed' ? (
                        <span className="text-sm text-gray-400">Not graded</span>
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-2">
                        {submission.status === 'completed' && (
                          <Button variant="outline" size="sm">
                            {submission.grade !== undefined ? 'Edit Grade' : 'Grade'}
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
