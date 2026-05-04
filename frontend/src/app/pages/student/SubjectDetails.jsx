import React, { useEffect, useState } from 'react';
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
  Award,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { api } from '../../lib/api';

export function StudentSubjectDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [subject, setSubject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubject = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await api.subjects.getSubjectDetails(id);
        if (!result.ok || !result.data || result.data.length === 0) {
  setError('Failed to load subject details.');
  return;
}

setSubject(result.data[0]);
      } catch (err) {
        setError('An unexpected error occurred.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSubject();
  }, [id]);

  const getGradeBadgeColor = (grade) => {
    if (grade == null) return 'bg-gray-100 text-gray-500';
    if (grade >= 90) return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
    if (grade >= 80) return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
    if (grade >= 70) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
    return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
  };

  const formatDateTime = (iso) => {
    if (!iso) return '—';
    return new Date(iso).toLocaleString(undefined, {
      weekday: 'long', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  const formatDate = (iso) => {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString(undefined, {
      month: 'short', day: 'numeric', year: 'numeric',
    });
  };

  const getDuration = (start, end) => {
    if (!start || !end) return '—';
    const diff = (new Date(end) - new Date(start)) / 60000;
    return diff < 60 ? `${diff} min` : `${(diff / 60).toFixed(1)} hr`;
  };

  const getLessonStatusBadge = (status) => {
    const s = status?.toLowerCase();
    if (s === 'upcoming') return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">Upcoming</Badge>;
    if (s === 'completed') return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">Completed</Badge>;
    if (s === 'cancelled') return <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">Cancelled</Badge>;
    return <Badge>{status}</Badge>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !subject) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={() => navigate('/student/subjects')} className="-ml-2">
          <ArrowLeft className="h-4 w-4 mr-2" />Back to Subjects
        </Button>
        <Card className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
          <CardContent className="p-6 flex items-center gap-3 text-red-700 dark:text-red-400">
            <AlertCircle className="h-5 w-5" />
            <p>{error || 'Subject not found.'}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const lessons = subject.lessons || [];
  const homeworks = subject.homeworks || [];
  const exams = subject.exams || [];
  const upcomingLessons = lessons
    .filter((l) => l.status?.toLowerCase() === 'upcoming')
    .sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
  const completedLessons = lessons.filter((l) => l.status?.toLowerCase() === 'completed');
  const totalLessons = subject.lessonsCount ?? lessons.length ?? 0;
  const progressPercentage = totalLessons > 0 ? (completedLessons.length / totalLessons) * 100 : 0;
  const nextLesson = upcomingLessons[0] ?? null;
  

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Button variant="ghost" onClick={() => navigate('/student/subjects')} className="mb-2 -ml-2">
          <ArrowLeft className="h-4 w-4 mr-2" />Back to Subjects
        </Button>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-foreground">{subject.subjectName}</h1>
              <Badge className={getGradeBadgeColor(subject.averageGrade)}>
                {subject.averageGrade != null ? `Grade: ${subject.averageGrade}%` : 'No grade yet'}
              </Badge>
            </div>
            {subject.teacherName && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <User className="h-4 w-4" /><span>{subject.teacherName}</span>
              </div>
            )}
          </div>
          <Button variant="outline" onClick={() => navigate(`/student/subjects/${id}/materials`)}>
            <BookOpen className="h-4 w-4 mr-2" />View Materials
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card><CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-muted-foreground">Average Grade</div>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">
                {subject.averageGrade != null ? `${subject.averageGrade}%` : '—'}
              </div>
            </div>
            <Award className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
        </CardContent></Card>

        <Card><CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-muted-foreground">Lessons Done</div>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">
                {completedLessons.length}/{totalLessons}
              </div>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
        </CardContent></Card>

        <Card><CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-muted-foreground">Homeworks</div>
              <div className="text-2xl font-bold text-primary mt-1">{subject.homeworksCount ?? 0}</div>
            </div>
            <BookOpen className="h-8 w-8 text-primary" />
          </div>
        </CardContent></Card>

        <Card><CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-muted-foreground">Exams</div>
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400 mt-1">
                {subject.examsCount ?? 0}
              </div>
            </div>
            <AlertCircle className="h-8 w-8 text-orange-600 dark:text-orange-400" />
          </div>
        </CardContent></Card>
      </div>

      {/* Main */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Progress */}
          <Card>
            <CardHeader><CardTitle>Course Progress</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Lessons Completed</span>
                  <span className="font-medium text-foreground">
                    {completedLessons.length}/{totalLessons} ({progressPercentage.toFixed(0)}%)
                  </span>
                </div>
                <Progress value={progressPercentage} className="h-3" />
              </div>
            </CardContent>
          </Card>

          {/* Lessons */}
          {lessons.length > 0 && (
            <Card>
              <CardHeader><CardTitle>Lessons</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {lessons.map((lesson) => (
                    <div key={lesson.lessonId} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground">{lesson.title}</h4>
                        <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" /><span>{formatDateTime(lesson.startTime)}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                          <Clock className="h-3 w-3" /><span>{getDuration(lesson.startTime, lesson.endTime)}</span>
                          {lesson.materialsCount > 0 && (
                            <span className="ml-2 text-xs text-primary">{lesson.materialsCount} material{lesson.materialsCount > 1 ? 's' : ''}</span>
                          )}
                        </div>
                      </div>
                      {getLessonStatusBadge(lesson.status)}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Homeworks */}
          {homeworks.length > 0 && (
            <Card>
              <CardHeader><CardTitle>Homeworks</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {homeworks.map((hw) => (
                    <div key={hw.homeworkId ?? hw.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground">{hw.title}</h4>
                        {hw.dueDate && (
                          <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                            <Calendar className="h-3 w-3" /><span>Due: {formatDate(hw.dueDate)}</span>
                          </div>
                        )}
                      </div>
                      {hw.grade != null && <Badge className={getGradeBadgeColor(hw.grade)}>{hw.grade}%</Badge>}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Exams */}
          {exams.length > 0 && (
            <Card>
              <CardHeader><CardTitle>Exams</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {exams.map((exam) => (
                    <div key={exam.examId ?? exam.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground">{exam.title}</h4>
                        {exam.date && (
                          <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                            <Calendar className="h-3 w-3" /><span>{formatDate(exam.date)}</span>
                          </div>
                        )}
                      </div>
                      {exam.grade != null && <Badge className={getGradeBadgeColor(exam.grade)}>{exam.grade}%</Badge>}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Next Class */}
          <Card className="bg-gradient-to-br from-primary/5 to-purple-500/5 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />Next Class
              </CardTitle>
            </CardHeader>
            <CardContent>
              {nextLesson ? (
                <div>
                  <div className="text-lg font-semibold text-foreground">{nextLesson.title}</div>
                  <div className="text-sm text-muted-foreground mt-1">{formatDateTime(nextLesson.startTime)}</div>
                </div>
              ) : (
                <div className="text-muted-foreground text-sm">No upcoming classes</div>
              )}
            </CardContent>
          </Card>

          {/* Pending Homework Alert */}
          {(subject.homeworksCount ?? 0) > 0 && (
            <Card className="border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/20">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <FileText className="h-5 w-5 text-orange-600 dark:text-orange-400 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-orange-900 dark:text-orange-300">
                      {subject.homeworksCount} homework{subject.homeworksCount > 1 ? 's' : ''}
                    </h4>
                    <p className="text-sm text-orange-700 dark:text-orange-400 mt-1">
                      Complete your assignments before the deadline
                    </p>
                    <Button size="sm" className="mt-3 bg-orange-600 hover:bg-orange-700 text-white"
                      onClick={() => navigate('/student/homework')}>
                      View Assignments
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Upcoming Lessons */}
          {upcomingLessons.length > 0 && (
            <Card>
              <CardHeader><CardTitle>Upcoming Classes</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {upcomingLessons.map((lesson) => (
                    <div key={lesson.lessonId} className="p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                      <h4 className="font-medium text-foreground text-sm">{lesson.title}</h4>
                      <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" /><span>{formatDateTime(lesson.startTime)}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" /><span>{getDuration(lesson.startTime, lesson.endTime)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Performance */}
          <Card>
            <CardHeader><CardTitle>Performance</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Average Grade</span>
                <span className="font-semibold text-blue-600 dark:text-blue-400">
                  {subject.averageGrade != null ? `${subject.averageGrade}%` : '—'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Lessons</span>
                <span className="font-semibold text-foreground">{totalLessons}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Homeworks</span>
                <span className="font-semibold text-foreground">{subject.homeworksCount ?? 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Exams</span>
                <span className="font-semibold text-foreground">{subject.examsCount ?? 0}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}