import React from 'react';
import { useNavigate } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { 
  ArrowLeft, 
  BookOpen, 
  Calendar, 
  Clock,
  Users,
  FileText,
  Download,
  CheckCircle,
  XCircle,
  AlertCircle,
  Edit,
  Trash2,
  Eye
} from 'lucide-react';

export function HomeworkDetailsPage() {
  const navigate = useNavigate();

  // Mock homework data
  const homeworkData = {
    id: 'hw1',
    title: 'Quadratic Equations Practice Problems',
    class: 'Grade 10-A',
    subject: 'Mathematics',
    assignedDate: '2026-03-02',
    dueDate: '2026-03-09',
    status: 'Active',
    description: 'Complete the following exercises from your textbook. Show all working steps and verify your answers. Focus on both factoring methods and using the quadratic formula.',
    instructions: [
      'Read through the theory on pages 240-244',
      'Complete exercises 1-10 on page 245',
      'Show all your working steps',
      'Verify your answers by substituting back',
      'Submit your work before the deadline',
    ],
    attachments: [
      { name: 'Homework_Questions.pdf', size: '1.2 MB', type: 'PDF' },
      { name: 'Answer_Template.docx', size: '245 KB', type: 'Word Document' },
    ],
    totalStudents: 28,
    submissions: {
      submitted: 22,
      pending: 6,
      late: 0,
    },
    students: [
      { id: 's1', name: 'Ahmed Ali', status: 'Submitted', submittedDate: '2026-03-07', grade: 95, onTime: true },
      { id: 's2', name: 'Fatima Hassan', status: 'Submitted', submittedDate: '2026-03-08', grade: 98, onTime: true },
      { id: 's3', name: 'Omar Mohammed', status: 'Submitted', submittedDate: '2026-03-06', grade: 88, onTime: true },
      { id: 's4', name: 'Sarah Ahmed', status: 'Submitted', submittedDate: '2026-03-07', grade: 92, onTime: true },
      { id: 's5', name: 'Youssef Ibrahim', status: 'Pending', submittedDate: null, grade: null, onTime: false },
      { id: 's6', name: 'Noor Khalid', status: 'Submitted', submittedDate: '2026-03-08', grade: 97, onTime: true },
      { id: 's7', name: 'Hassan Ali', status: 'Pending', submittedDate: null, grade: null, onTime: false },
      { id: 's8', name: 'Maryam Salem', status: 'Submitted', submittedDate: '2026-03-07', grade: 94, onTime: true },
    ],
  };

  const submissionRate = Math.round((homeworkData.submissions.submitted / homeworkData.totalStudents) * 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-2 -ml-2"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900">{homeworkData.title}</h1>
              <Badge 
                variant="outline" 
                className="bg-green-50 text-green-700 border-green-200"
              >
                {homeworkData.status}
              </Badge>
            </div>
            <p className="text-gray-500">{homeworkData.class} • {homeworkData.subject}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate('/teacher/homework/add')}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button variant="outline" className="text-red-600 hover:text-red-700">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-8 w-8 text-indigo-600" />
              <div>
                <p className="text-xs text-gray-600">Assigned Date</p>
                <p className="font-semibold text-gray-900">
                  {new Date(homeworkData.assignedDate).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 text-red-600" />
              <div>
                <p className="text-xs text-gray-600">Due Date</p>
                <p className="font-semibold text-gray-900">
                  {new Date(homeworkData.dueDate).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-xs text-gray-600">Total Students</p>
                <p className="font-semibold text-gray-900">{homeworkData.totalStudents}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-xs text-gray-600">Submission Rate</p>
                <p className="font-semibold text-gray-900">{submissionRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Submission Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Submission Statistics</CardTitle>
          <CardDescription>Overview of homework submissions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">Submitted</p>
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <p className="text-3xl font-bold text-green-600">{homeworkData.submissions.submitted}</p>
              <p className="text-xs text-gray-500 mt-1">
                {submissionRate}% of total students
              </p>
            </div>

            <div className="p-6 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">Pending</p>
                <AlertCircle className="h-5 w-5 text-yellow-600" />
              </div>
              <p className="text-3xl font-bold text-yellow-600">{homeworkData.submissions.pending}</p>
              <p className="text-xs text-gray-500 mt-1">
                Awaiting submission
              </p>
            </div>

            <div className="p-6 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">Late Submissions</p>
                <XCircle className="h-5 w-5 text-red-600" />
              </div>
              <p className="text-3xl font-bold text-red-600">{homeworkData.submissions.late}</p>
              <p className="text-xs text-gray-500 mt-1">
                Submitted after deadline
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-indigo-600" />
                Assignment Description
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed mb-4">{homeworkData.description}</p>
              
              <div className="mt-4">
                <p className="font-semibold text-gray-900 mb-2">Instructions:</p>
                <ol className="list-decimal list-inside space-y-2">
                  {homeworkData.instructions.map((instruction, idx) => (
                    <li key={idx} className="text-gray-700">{instruction}</li>
                  ))}
                </ol>
              </div>
            </CardContent>
          </Card>

          {/* Student Submissions */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-indigo-600" />
                    Student Submissions
                  </CardTitle>
                  <CardDescription>Track student progress and grades</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  Export Data
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">#</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Student Name</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Submitted</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Grade</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {homeworkData.students.map((student, idx) => (
                      <tr key={student.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-600">{idx + 1}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 bg-indigo-100 rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium text-indigo-600">
                                {student.name.charAt(0)}
                              </span>
                            </div>
                            <span className="text-sm font-medium text-gray-900">{student.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <Badge 
                            variant="outline"
                            className={
                              student.status === 'Submitted' 
                                ? 'bg-green-50 text-green-700 border-green-200'
                                : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                            }
                          >
                            {student.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {student.submittedDate 
                            ? new Date(student.submittedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                            : '-'
                          }
                        </td>
                        <td className="px-4 py-3">
                          {student.grade ? (
                            <Badge 
                              variant="outline"
                              className={
                                student.grade >= 90 ? 'bg-green-50 text-green-700 border-green-200' :
                                student.grade >= 80 ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                'bg-yellow-50 text-yellow-700 border-yellow-200'
                              }
                            >
                              {student.grade}%
                            </Badge>
                          ) : (
                            <span className="text-sm text-gray-400">Not graded</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {student.status === 'Submitted' ? (
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          ) : (
                            <span className="text-sm text-gray-400">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Attachments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-indigo-600" />
                Attachments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {homeworkData.attachments.map((file, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 bg-indigo-50 border border-indigo-200 rounded-lg"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="h-10 w-10 bg-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FileText className="h-5 w-5 text-white" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                        <p className="text-xs text-gray-500">{file.size}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="flex-shrink-0">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <CheckCircle className="h-4 w-4 mr-2" />
                Grade All Submissions
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Users className="h-4 w-4 mr-2" />
                Send Reminder
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Download className="h-4 w-4 mr-2" />
                Download All
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
