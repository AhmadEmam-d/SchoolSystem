import React from 'react';
import { useNavigate, useParams } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { ArrowLeft, Calendar, Clock, FileText, Users, Edit, BarChart } from 'lucide-react';

export function ExamDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  // Mock exam details
  const exam = {
    id: id || '1',
    title: 'Mathematics Mid-Term Exam',
    class: 'Class 10-A',
    subject: 'Mathematics',
    date: '2026-03-15',
    time: '10:00 AM',
    duration: '2 hours',
    totalMarks: 100,
    status: 'upcoming',
    totalStudents: 30,
    completedStudents: 0,
    description: 'Comprehensive exam covering chapters 1-5 including calculus, algebra, and trigonometry.',
    instructions: '1. Read all questions carefully\n2. Answer all questions\n3. Show your work for full credit\n4. No calculators allowed\n5. Use blue or black pen only',
    topics: [
      'Differential Calculus',
      'Integral Calculus',
      'Quadratic Equations',
      'Trigonometric Functions',
      'Logarithms'
    ]
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/teacher/exams')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {exam.title}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Exam details and information
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => navigate(`/teacher/exams/${id}/edit`)}
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
              <CardTitle>Exam Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Status and Class Info */}
              <div className="flex items-center gap-3">
                <Badge className="bg-blue-100 text-blue-800 px-3 py-1">
                  {exam.status.charAt(0).toUpperCase() + exam.status.slice(1)}
                </Badge>
                <Badge variant="outline">{exam.class}</Badge>
                <Badge variant="outline">{exam.subject}</Badge>
              </div>

              {/* Description */}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Description
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {exam.description}
                </p>
              </div>

              {/* Topics Covered */}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                  Topics Covered
                </h3>
                <div className="flex flex-wrap gap-2">
                  {exam.topics.map((topic, index) => (
                    <Badge key={index} variant="outline" className="px-3 py-1">
                      {topic}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Instructions */}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Instructions
                </h3>
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <pre className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap font-sans">
                    {exam.instructions}
                  </pre>
                </div>
              </div>
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
                  <span className="text-sm">Date</span>
                </div>
                <span className="font-medium text-gray-900 dark:text-white">
                  {new Date(exam.date).toLocaleDateString()}
                </span>
              </div>

              <div className="flex items-center justify-between py-2 border-b dark:border-gray-700">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">Time</span>
                </div>
                <span className="font-medium text-gray-900 dark:text-white">
                  {exam.time}
                </span>
              </div>

              <div className="flex items-center justify-between py-2 border-b dark:border-gray-700">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">Duration</span>
                </div>
                <span className="font-medium text-gray-900 dark:text-white">
                  {exam.duration}
                </span>
              </div>

              <div className="flex items-center justify-between py-2 border-b dark:border-gray-700">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <FileText className="h-4 w-4" />
                  <span className="text-sm">Total Marks</span>
                </div>
                <span className="font-medium text-gray-900 dark:text-white">
                  {exam.totalMarks}
                </span>
              </div>

              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Users className="h-4 w-4" />
                  <span className="text-sm">Students</span>
                </div>
                <span className="font-medium text-gray-900 dark:text-white">
                  {exam.totalStudents}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {exam.status === 'completed' && (
                <>
                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    onClick={() => navigate(`/teacher/exams/${id}/submissions`)}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    View Submissions
                  </Button>
                  <Button
                    className="w-full bg-indigo-600 hover:bg-indigo-700"
                    onClick={() => navigate(`/teacher/exams/${id}/grades`)}
                  >
                    <BarChart className="h-4 w-4 mr-2" />
                    View Grades
                  </Button>
                </>
              )}
              {exam.status === 'upcoming' && (
                <Button className="w-full" variant="outline">
                  <Calendar className="h-4 w-4 mr-2" />
                  Reschedule Exam
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Completion Stats (for completed exams) */}
          {exam.status === 'completed' && (
            <Card>
              <CardHeader>
                <CardTitle>Completion</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                    28/30
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Students Completed
                  </p>
                </div>

                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div
                    className="bg-green-600 h-3 rounded-full transition-all"
                    style={{ width: '93%' }}
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}