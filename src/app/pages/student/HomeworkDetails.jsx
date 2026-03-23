import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import {
  ArrowLeft,
  Calendar,
  Clock,
  FileText,
  Download,
  Upload,
  Eye,
  CheckCircle,
  User
} from 'lucide-react';
import { toast } from 'sonner';

export function StudentHomeworkDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [submissionText, setSubmissionText] = useState('');

  // Mock homework data
  const homework = {
    id: '1',
    title: 'Quadratic Equations Worksheet',
    subject: 'Mathematics',
    teacher: 'John Nash',
    description: 'Complete problems 1-20 from Chapter 5. Show all work and explain your reasoning for each solution. This assignment will help you understand the fundamentals of quadratic equations and their applications in real-world scenarios.',
    instructions: [
      'Read Chapter 5 carefully before starting',
      'Show all work for each problem',
      'Box your final answers',
      'Submit your work before the due date'
    ],
    dueDate: '2026-03-10',
    assignedDate: '2026-03-01',
    status: 'pending',
    priority: 'high',
    maxGrade: 100,
    attachments: [
      { id: 'a1', name: 'Quadratic_Equations_Worksheet.pdf', size: '2.4 MB', type: 'PDF' },
      { id: 'a2', name: 'Chapter_5_Reference.pdf', size: '1.8 MB', type: 'PDF' },
    ],
    submittedFiles: [],
    feedback: null,
    grade: null
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-orange-100 text-orange-800">Pending</Badge>;
      case 'submitted':
        return <Badge className="bg-blue-100 text-blue-800">Submitted</Badge>;
      case 'graded':
        return <Badge className="bg-green-100 text-green-800">Graded</Badge>;
      default:
        return null;
    }
  };

  const handleDownload = (fileName) => {
    // Simulate file download
    const link = document.createElement('a');
    link.href = '#'; // In real app, this would be the actual file URL
    link.download = fileName;
    link.click();

    toast.success(`Downloading ${fileName}...`);
  };

  const handleViewFile = (fileName) => {
    toast.info(`Opening ${fileName}...`);
    // In real app, this would open the file in a new tab or viewer
  };

  const handleSubmit = () => {
    if (!submissionText.trim()) {
      toast.error('Please enter your submission or upload files');
      return;
    }

    toast.success('Homework submitted successfully!');
    navigate('/student/homework');
  };

  const getDaysUntilDue = (dueDate) => {
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntilDue = getDaysUntilDue(homework.dueDate);
  const isOverdue = daysUntilDue < 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Button
          variant="ghost"
          onClick={() => navigate('/student/homework')}
          className="mb-2 -ml-2"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Homework
        </Button>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900">{homework.title}</h1>
              {getStatusBadge(homework.status)}
              <Badge className={getPriorityColor(homework.priority)}>
                {homework.priority}
              </Badge>
            </div>
            <div className="flex items-center gap-4 text-gray-500">
              <Badge variant="outline">{homework.subject}</Badge>
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>{homework.teacher}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - 2/3 width */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">{homework.description}</p>
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card>
            <CardHeader>
              <CardTitle>Instructions</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-2">
                {homework.instructions.map((instruction, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-indigo-100 text-indigo-600 text-sm font-medium">
                      {index + 1}
                    </span>
                    <span className="text-gray-700 pt-0.5">{instruction}</span>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>

          {/* Attachments */}
          {homework.attachments.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-indigo-600" />
                <h2 className="text-3xl font-bold text-gray-900">Attachments</h2>
              </div>

              <div className="space-y-4">
                {homework.attachments.map((file) => (
                  <div
                    key={file.id}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 sm:p-5 bg-white border border-gray-200 rounded-2xl hover:shadow-lg transition-shadow gap-4"
                  >
                    <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                      <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl bg-indigo-100 flex items-center justify-center flex-shrink-0">
                        <FileText className="h-8 w-8 sm:h-10 sm:w-10 text-indigo-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2 truncate">{file.name}</h4>
                        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                          <Badge variant="outline" className="text-xs font-medium">
                            {file.type}
                          </Badge>
                          <span className="text-xs sm:text-sm text-gray-500">{file.size}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 w-full sm:w-auto">
                      <Button
                        variant="ghost"
                        size="default"
                        className="flex-1 sm:flex-initial gap-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                        onClick={() => handleViewFile(file.name)}
                      >
                        <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
                        <span className="font-medium text-sm sm:text-base">View</span>
                      </Button>
                      <Button
                        size="default"
                        className="flex-1 sm:flex-initial bg-indigo-600 hover:bg-indigo-700 gap-2 px-4 sm:px-8 rounded-full"
                        onClick={() => handleDownload(file.name)}
                      >
                        <Download className="h-4 w-4 sm:h-5 sm:w-5" />
                        <span className="font-medium text-sm sm:text-base">Download</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Submission Area - Only for pending homework */}
          {homework.status === 'pending' && (
            <Card>
              <CardHeader>
                <CardTitle>Your Submission</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="submission">Your Answer/Notes</Label>
                  <Textarea
                    id="submission"
                    placeholder="Enter your answer or notes here..."
                    rows={8}
                    value={submissionText}
                    onChange={(e) => setSubmissionText(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Attach Files (Optional)</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-indigo-500 transition-colors cursor-pointer">
                    <Upload className="h-10 w-10 mx-auto text-gray-400 mb-3" />
                    <p className="text-sm text-gray-600 font-medium">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-400 mt-1">PDF, DOC, DOCX, Images up to 10MB</p>
                  </div>
                </div>

                <Button
                  className="w-full bg-indigo-600 hover:bg-indigo-700"
                  size="lg"
                  onClick={handleSubmit}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Submit Homework
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Feedback - Only for graded homework */}
          {homework.status === 'graded' && homework.feedback && (
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Teacher Feedback
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{homework.feedback}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar - 1/3 width */}
        <div className="space-y-6">
          {/* Due Date Card */}
          <Card className={isOverdue ? 'border-red-200 bg-red-50' : 'bg-gradient-to-br from-indigo-50 to-purple-50'}>
            <CardContent className="p-6">
              <div className="text-sm text-gray-600 mb-1">Due Date</div>
              <div className="text-lg font-semibold text-gray-900 mb-3">
                {new Date(homework.dueDate).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
              {isOverdue ? (
                <Badge className="bg-red-100 text-red-800">
                  Overdue by {Math.abs(daysUntilDue)} day{Math.abs(daysUntilDue) !== 1 ? 's' : ''}
                </Badge>
              ) : daysUntilDue <= 3 ? (
                <Badge className="bg-orange-100 text-orange-800">
                  Due in {daysUntilDue} day{daysUntilDue !== 1 ? 's' : ''}
                </Badge>
              ) : (
                <Badge className="bg-blue-100 text-blue-800">
                  {daysUntilDue} days remaining
                </Badge>
              )}
            </CardContent>
          </Card>

          {/* Assignment Info */}
          <Card>
            <CardHeader>
              <CardTitle>Assignment Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Assigned Date</span>
                <span className="font-medium text-gray-900">
                  {new Date(homework.assignedDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Max Grade</span>
                <span className="font-medium text-gray-900">{homework.maxGrade} points</span>
              </div>
              {homework.grade && (
                <div className="flex items-center justify-between pt-3 border-t">
                  <span className="text-sm text-gray-600">Your Grade</span>
                  <Badge className="bg-green-100 text-green-800 text-base">
                    {homework.grade}/{homework.maxGrade}
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => navigate(`/student/subjects/${homework.subject.toLowerCase()}/materials`)}
              >
                <FileText className="h-4 w-4 mr-2" />
                View Subject Materials
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => navigate('/student/schedule')}
              >
                <Calendar className="h-4 w-4 mr-2" />
                View Schedule
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
