import React from 'react';
import { useNavigate, useParams } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { ArrowLeft, Calendar, Clock, FileText, Users, Download, Edit } from 'lucide-react';

export function HomeworkDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const handleDownloadAttachment = (fileName) => {
    // Simulate file download
    const link = document.createElement('a');
    link.href = '#'; // In a real app, this would be the actual file URL
    link.download = fileName;
    link.click();
    
    // Show a toast or alert (optional)
    alert(`Downloading ${fileName}...`);
  };

  // Mock homework details
  const homework = {
    id: id || 'h1',
    title: 'Calculus Worksheet - Chapter 3',
    class: 'Class 10-A',
    subject: 'Mathematics',
    dueDate: '2026-03-15',
    assignedDate: '2026-03-01',
    totalMarks: 100,
    status: 'Active',
    submitted: 18,
    total: 20,
    description: 'Complete exercises 1-15 from Chapter 3 of the textbook. Focus on derivative rules and chain rule applications.',
    instructions: '1. Show all your work\n2. Write clearly and neatly\n3. Submit before the deadline\n4. Use proper mathematical notation',
    submissionType: 'Online Submission',
    allowLateSubmissions: true,
    attachments: [
      { name: 'Chapter_3_Worksheet.pdf', size: '2.3 MB' },
      { name: 'Reference_Material.pdf', size: '1.8 MB' }
    ]
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/teacher/homework')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {homework.title}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Assignment details and information
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => navigate(`/teacher/homework/${id}/edit`)}
        >
          <Edit className="h-4 w-4 mr-2" />
          Edit
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Assignment Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Status and Class Info */}
              <div className="flex items-center gap-3">
                <Badge className="bg-blue-100 text-blue-800 px-3 py-1">
                  {homework.status}
                </Badge>
                <Badge variant="outline">{homework.class}</Badge>
                <Badge variant="outline">{homework.subject}</Badge>
              </div>

              {/* Description */}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Description
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {homework.description}
                </p>
              </div>

              {/* Instructions */}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Instructions
                </h3>
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <pre className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap font-sans">
                    {homework.instructions}
                  </pre>
                </div>
              </div>

              {/* Attachments */}
              {homework.attachments.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                    Attachments
                  </h3>
                  <div className="space-y-2">
                    {homework.attachments.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-blue-600" />
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {file.name}
                            </p>
                            <p className="text-sm text-gray-500">{file.size}</p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDownloadAttachment(file.name)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b dark:border-gray-700">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">Assigned</span>
                </div>
                <span className="font-medium text-gray-900 dark:text-white">
                  {new Date(homework.assignedDate).toLocaleDateString()}
                </span>
              </div>

              <div className="flex items-center justify-between py-2 border-b dark:border-gray-700">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">Due Date</span>
                </div>
                <span className="font-medium text-gray-900 dark:text-white">
                  {new Date(homework.dueDate).toLocaleDateString()}
                </span>
              </div>

              <div className="flex items-center justify-between py-2 border-b dark:border-gray-700">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <FileText className="h-4 w-4" />
                  <span className="text-sm">Total Marks</span>
                </div>
                <span className="font-medium text-gray-900 dark:text-white">
                  {homework.totalMarks}
                </span>
              </div>

              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Users className="h-4 w-4" />
                  <span className="text-sm">Students</span>
                </div>
                <span className="font-medium text-gray-900 dark:text-white">
                  {homework.total}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Submission Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Submissions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {homework.submitted}/{homework.total}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Submitted
                </p>
              </div>

              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div
                  className="bg-green-600 h-3 rounded-full transition-all"
                  style={{ width: `${(homework.submitted / homework.total) * 100}%` }}
                />
              </div>

              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
                    {homework.submitted}
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Submitted</p>
                </div>
                <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <div className="text-xl font-bold text-orange-600 dark:text-orange-400">
                    {homework.total - homework.submitted}
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Pending</p>
                </div>
              </div>

              <Button
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={() => navigate(`/teacher/homework/${id}/submissions`)}
              >
                View All Submissions
              </Button>
              <Button
                className="w-full bg-indigo-600 hover:bg-indigo-700"
                onClick={() => navigate(`/teacher/homework/${id}/grades`)}
              >
                View Grades Report
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}