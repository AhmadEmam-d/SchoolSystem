import React from 'react';
import { useNavigate, useParams } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Progress } from '../../components/ui/progress';
import { 
  ArrowLeft, 
  User, 
  Calendar, 
  Clock, 
  BookOpen,
  FileText,
  TrendingUp,
  Award,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

export function StudentSubjectDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  // Mock subject data
  const subject = {
    id: 'sub1',
    name: 'Mathematics',
    teacher: 'John Nash',
    grade: 85,
    attendance: 92,
    nextClass: 'Monday, 8:00 AM',
    totalClasses: 45,
    completedClasses: 38,
    assignments: 12,
    completedAssignments: 10,
    pendingAssignments: 2,
    averageGrade: 85,
    highestGrade: 98,
    lowestGrade: 72
  };

  // Grade history data
  const gradeHistory = [
    { month: 'Sep', grade: 78 },
    { month: 'Oct', grade: 82 },
    { month: 'Nov', grade: 85 },
    { month: 'Dec', grade: 88 },
    { month: 'Jan', grade: 85 },
    { month: 'Feb', grade: 87 },
  ];

  // Assignment data
  const assignmentData = [
    { name: 'Completed', value: subject.completedAssignments },
    { name: 'Pending', value: subject.pendingAssignments },
  ];

  // Recent assignments
  const recentAssignments = [
    { id: 'a1', title: 'Quadratic Equations Worksheet', dueDate: '2026-03-10', grade: 95, status: 'graded' },
    { id: 'a2', title: 'Calculus Problem Set', dueDate: '2026-03-08', grade: 88, status: 'graded' },
    { id: 'a3', title: 'Geometry Project', dueDate: '2026-03-15', status: 'pending' },
    { id: 'a4', title: 'Algebra Quiz Preparation', dueDate: '2026-03-12', status: 'pending' },
  ];

  // Upcoming classes
  const upcomingClasses = [
    { id: 'c1', topic: 'Advanced Calculus', date: 'Monday, 8:00 AM', duration: '1 hour' },
    { id: 'c2', topic: 'Linear Algebra Review', date: 'Wednesday, 8:00 AM', duration: '1.5 hours' },
    { id: 'c3', topic: 'Trigonometry Applications', date: 'Friday, 8:00 AM', duration: '1 hour' },
  ];

  const getGradeBadgeColor = (grade) => {
    if (grade >= 90) return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
    if (grade >= 80) return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
    if (grade >= 70) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
    return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
  };

  const progressPercentage = (subject.completedClasses / subject.totalClasses) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Button
          variant="ghost"
          onClick={() => navigate('/student/subjects')}
          className="mb-2 -ml-2"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Subjects
        </Button>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-foreground">{subject.name}</h1>
              <Badge className={getGradeBadgeColor(subject.grade)}>
                Grade: {subject.grade}%
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <User className="h-4 w-4" />
              <span>{subject.teacher}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate(`/student/subjects/${id}/materials`)}>
              <BookOpen className="h-4 w-4 mr-2" />
              View Materials
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">Current Grade</div>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">
                  {subject.grade}%
                </div>
              </div>
              <Award className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">Attendance</div>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">
                  {subject.attendance}%
                </div>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">Completed</div>
                <div className="text-2xl font-bold text-primary mt-1">
                  {subject.completedClasses}/{subject.totalClasses}
                </div>
              </div>
              <BookOpen className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">Pending Work</div>
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400 mt-1">
                  {subject.pendingAssignments}
                </div>
              </div>
              <AlertCircle className="h-8 w-8 text-orange-600 dark:text-orange-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - 2/3 width */}
        <div className="lg:col-span-2 space-y-6">
          {/* Course Progress */}
          <Card>
            <CardHeader>
              <CardTitle>Course Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Classes Completed</span>
                  <span className="font-medium text-foreground">
                    {subject.completedClasses}/{subject.totalClasses} ({progressPercentage.toFixed(0)}%)
                  </span>
                </div>
                <Progress value={progressPercentage} className="h-3" />
              </div>
            </CardContent>
          </Card>

          {/* Grade Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Grade Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={gradeHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="month" tick={{ fill: 'var(--muted-foreground)' }} />
                  <YAxis domain={[0, 100]} tick={{ fill: 'var(--muted-foreground)' }} />
                  <Tooltip contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--foreground)' }} />
                  <Line type="monotone" dataKey="grade" stroke="var(--primary)" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Recent Assignments */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Assignments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentAssignments.map((assignment) => (
                  <div
                    key={assignment.id}
                    className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground">{assignment.title}</h4>
                      <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>Due: {assignment.dueDate}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {assignment.status === 'graded' && assignment.grade && (
                        <Badge className={getGradeBadgeColor(assignment.grade)}>
                          {assignment.grade}%
                        </Badge>
                      )}
                      {assignment.status === 'pending' && (
                        <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400">
                          Pending
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - 1/3 width */}
        <div className="space-y-6">
          {/* Next Class */}
          <Card className="bg-gradient-to-br from-primary/5 to-purple-500/5 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Next Class
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-semibold text-foreground">
                {subject.nextClass}
              </div>
            </CardContent>
          </Card>

          {/* Pending Assignments Alert */}
          {subject.pendingAssignments > 0 && (
            <Card className="border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/20">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <FileText className="h-5 w-5 text-orange-600 dark:text-orange-400 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-orange-900 dark:text-orange-300">
                      {subject.pendingAssignments} pending assignment{subject.pendingAssignments > 1 ? 's' : ''}
                    </h4>
                    <p className="text-sm text-orange-700 dark:text-orange-400 mt-1">
                      Complete your assignments before the deadline
                    </p>
                    <Button
                      size="sm"
                      className="mt-3 bg-orange-600 hover:bg-orange-700 text-white"
                      onClick={() => navigate('/student/homework')}
                    >
                      View Assignments
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Upcoming Classes */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Classes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingClasses.map((classItem) => (
                  <div
                    key={classItem.id}
                    className="p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <h4 className="font-medium text-foreground text-sm">{classItem.topic}</h4>
                    <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>{classItem.date}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{classItem.duration}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Performance Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Performance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Average Grade</span>
                <span className="font-semibold text-blue-600 dark:text-blue-400">{subject.averageGrade}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Highest Grade</span>
                <span className="font-semibold text-green-600 dark:text-green-400">{subject.highestGrade}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Lowest Grade</span>
                <span className="font-semibold text-orange-600 dark:text-orange-400">{subject.lowestGrade}%</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}