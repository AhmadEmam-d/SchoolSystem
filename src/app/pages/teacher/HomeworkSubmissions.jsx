import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { ArrowLeft, Download, Search, CheckCircle, XCircle, Clock, FileText } from 'lucide-react';

export function HomeworkSubmissions() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchTerm, setSearchTerm] = useState('');

  const handleDownloadSubmission = (studentName, fileName) => {
    // Simulate file download
    const link = document.createElement('a');
    link.href = '#'; // In a real app, this would be the actual file URL
    link.download = fileName;
    link.click();
    
    // Show notification
    alert(`Downloading ${fileName} from ${studentName}...`);
  };

  // Mock homework details
  const homework = {
    title: 'Calculus Worksheet - Chapter 3',
    class: 'Class 10-A',
    dueDate: '2026-03-15',
    totalMarks: 100
  };

  const submissions = [
    {
      studentId: 's1',
      studentName: 'Ahmed Hassan',
      status: 'submitted',
      submittedDate: '2026-03-14',
      grade: 95,
      totalMarks: 100,
      files: [{ name: 'homework_ahmed.pdf', size: '1.2 MB' }]
    },
    {
      studentId: 's2',
      studentName: 'Fatima Ali',
      status: 'submitted',
      submittedDate: '2026-03-13',
      grade: 88,
      totalMarks: 100,
      files: [{ name: 'homework_fatima.pdf', size: '1.5 MB' }]
    },
    {
      studentId: 's3',
      studentName: 'Omar Khalil',
      status: 'late',
      submittedDate: '2026-03-16',
      totalMarks: 100,
      files: [{ name: 'homework_omar.pdf', size: '1.1 MB' }]
    },
    {
      studentId: 's4',
      studentName: 'Sara Mahmoud',
      status: 'pending',
      totalMarks: 100
    },
    {
      studentId: 's5',
      studentName: 'Youssef Ibrahim',
      status: 'submitted',
      submittedDate: '2026-03-14',
      grade: 92,
      totalMarks: 100,
      files: [{ name: 'homework_youssef.pdf', size: '1.3 MB' }]
    }
  ];

  const filteredSubmissions = submissions.filter(sub =>
    sub.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.studentId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status) => {
    switch (status) {
      case 'submitted':
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Submitted
          </Badge>
        );
      case 'late':
        return (
          <Badge className="bg-orange-100 text-orange-800">
            <Clock className="h-3 w-3 mr-1" />
            Late
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-red-100 text-red-800">
            <XCircle className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      default:
        return null;
    }
  };

  const submittedCount = submissions.filter(s => s.status === 'submitted' || s.status === 'late').length;
  const pendingCount = submissions.filter(s => s.status === 'pending').length;
  const gradedCount = submissions.filter(s => s.grade !== undefined).length;

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
            Submissions: {homework.title}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {homework.class} • Due: {new Date(homework.dueDate).toLocaleDateString()}
          </p>
        </div>
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
                <div className="text-sm text-gray-500 dark:text-gray-400">Submitted</div>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">
                  {submittedCount}
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
                <div className="text-sm text-gray-500 dark:text-gray-400">Pending</div>
                <div className="text-2xl font-bold text-red-600 dark:text-red-400 mt-1">
                  {pendingCount}
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
                <div className="text-sm text-gray-500 dark:text-gray-400">Graded</div>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">
                  {gradedCount}
                </div>
              </div>
              <CheckCircle className="h-8 w-8 text-blue-600" />
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
          <CardTitle>Student Submissions</CardTitle>
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
                    Submitted Date
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
                      {submission.submittedDate
                        ? new Date(submission.submittedDate).toLocaleDateString()
                        : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {submission.grade !== undefined ? (
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {submission.grade}/{submission.totalMarks}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-400">Not graded</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-2">
                        {submission.files && submission.files.length > 0 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDownloadSubmission(submission.studentName, submission.files[0].name)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        )}
                        {submission.status !== 'pending' && (
                          <Button variant="outline" size="sm">
                            Grade
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
