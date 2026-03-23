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
  Link as LinkIcon,
  CheckCircle,
  Target,
  Edit,
  Trash2
} from 'lucide-react';

export function LessonDetails() {
  const navigate = useNavigate();

  // Mock lesson data
  const lessonData = {
    id: 'l1',
    title: 'Introduction to Quadratic Equations',
    lessonNumber: 'Lesson 12',
    class: 'Grade 10-A',
    subject: 'Mathematics',
    date: '2026-03-02',
    startTime: '08:00',
    endTime: '09:00',
    room: '301',
    status: 'Completed',
    description: 'In this lesson, students will learn the fundamentals of quadratic equations, including standard form, solving methods, and real-world applications. We will explore both factoring and the quadratic formula.',
    objectives: [
      'Understand the standard form of a quadratic equation',
      'Learn how to solve quadratic equations using factoring',
      'Apply the quadratic formula to find solutions',
      'Identify real-world applications of quadratic equations',
    ],
    materials: [
      'Mathematics textbook (Chapter 8)',
      'Scientific calculator',
      'Graph paper',
      'Whiteboard and markers',
    ],
    attachments: [
      { name: 'Quadratic_Equations_Slides.pdf', size: '2.4 MB', type: 'PDF' },
      { name: 'Practice_Worksheet.docx', size: '156 KB', type: 'Word Document' },
      { name: 'Examples_Solutions.pdf', size: '890 KB', type: 'PDF' },
    ],
    links: [
      { title: 'Khan Academy - Quadratic Equations', url: 'https://khanacademy.org/math/quadratic' },
      { title: 'Interactive Graphing Tool', url: 'https://desmos.com/calculator' },
    ],
    homework: 'Complete exercises 1-10 from textbook page 245. Show all working steps.',
    notes: 'Students showed good understanding. May need extra time on factoring complex equations in next lesson.',
    attendance: {
      total: 28,
      present: 26,
      absent: 2,
      percentage: 93,
    },
  };

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
              <h1 className="text-3xl font-bold text-gray-900">{lessonData.title}</h1>
              <Badge 
                variant="outline" 
                className={
                  lessonData.status === 'Completed' 
                    ? 'bg-green-50 text-green-700 border-green-200' 
                    : 'bg-blue-50 text-blue-700 border-blue-200'
                }
              >
                {lessonData.status}
              </Badge>
            </div>
            <p className="text-gray-500">{lessonData.lessonNumber} • {lessonData.class} • {lessonData.subject}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate('/teacher/add-lesson')}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Lesson
            </Button>
            <Button variant="outline" className="text-red-600 hover:text-red-700">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>
      </div>

      {/* Lesson Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-8 w-8 text-indigo-600" />
              <div>
                <p className="text-xs text-gray-600">Date</p>
                <p className="font-semibold text-gray-900">
                  {new Date(lessonData.date).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-xs text-gray-600">Time</p>
                <p className="font-semibold text-gray-900">
                  {lessonData.startTime} - {lessonData.endTime}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-xs text-gray-600">Attendance</p>
                <p className="font-semibold text-gray-900">
                  {lessonData.attendance.present}/{lessonData.attendance.total} ({lessonData.attendance.percentage}%)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <BookOpen className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-xs text-gray-600">Room</p>
                <p className="font-semibold text-gray-900">Room {lessonData.room}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-indigo-600" />
                Lesson Description
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">{lessonData.description}</p>
            </CardContent>
          </Card>

          {/* Learning Objectives */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-indigo-600" />
                Learning Objectives
              </CardTitle>
              <CardDescription>What students should achieve in this lesson</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {lessonData.objectives.map((objective, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-700">{objective}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Attachments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-indigo-600" />
                Attachments
              </CardTitle>
              <CardDescription>Files and resources for this lesson</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {lessonData.attachments.map((file, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 bg-indigo-50 border border-indigo-200 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                        <FileText className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{file.name}</p>
                        <p className="text-xs text-gray-500">{file.size} • {file.type}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Resource Links */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LinkIcon className="h-5 w-5 text-indigo-600" />
                Resource Links
              </CardTitle>
              <CardDescription>External resources and references</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {lessonData.links.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <LinkIcon className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-gray-900">{link.title}</span>
                    </div>
                    <span className="text-xs text-blue-600">Open →</span>
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Required Materials */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-indigo-600" />
                Required Materials
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {lessonData.materials.map((material, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <div className="h-5 w-5 flex items-center justify-center flex-shrink-0">
                      <div className="h-2 w-2 bg-indigo-600 rounded-full"></div>
                    </div>
                    <span className="text-sm text-gray-700">{material}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Homework */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-indigo-600" />
                Homework Assignment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-700 mb-4">{lessonData.homework}</p>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => navigate('/teacher/homework-details')}
              >
                View Homework Details
              </Button>
            </CardContent>
          </Card>

          {/* Teacher Notes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-indigo-600" />
                Teacher Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-700 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                {lessonData.notes}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
