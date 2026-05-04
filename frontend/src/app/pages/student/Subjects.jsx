import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { BookOpen, User, Clock, TrendingUp, FileText, Calendar, Loader2, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Progress } from '../../components/ui/progress';
import { api } from '../../lib/api';

export function StudentSubjects() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubjects = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await api.subjects.getMySubjects();
        if (!result.ok || !result.data) {
          setError('Failed to load subjects.');
          return;
        }
        setSubjects(result.data);
      } catch (err) {
        setError('An unexpected error occurred.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, []);

  const getGradeColor = (grade) => {
    if (grade == null) return 'text-gray-400';
    if (grade >= 90) return 'text-green-600';
    if (grade >= 80) return 'text-blue-600';
    if (grade >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getGradeBadgeColor = (grade) => {
    if (grade == null) return 'bg-gray-100 text-gray-500';
    if (grade >= 90) return 'bg-green-100 text-green-800';
    if (grade >= 80) return 'bg-blue-100 text-blue-800';
    if (grade >= 70) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  // Get next upcoming lesson sorted by startTime
  const getNextLesson = (lessons = []) => {
    return lessons
      .filter((l) => l.status?.toLowerCase() === 'upcoming')
      .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))[0] ?? null;
  };

  const formatNextClass = (lesson) => {
    if (!lesson) return '—';
    return new Date(lesson.startTime).toLocaleString(undefined, {
      weekday: 'long',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Overview stats
  const totalSubjects = subjects.length;
  const gradesWithValues = subjects.filter((s) => s.averageGrade != null);
  const overallGrade =
    gradesWithValues.length > 0
      ? Math.round(gradesWithValues.reduce((sum, s) => sum + s.averageGrade, 0) / gradesWithValues.length)
      : null;
  const totalPending = subjects.reduce((sum, s) => sum + (s.homeworksCount ?? 0), 0);

  // ── Loading ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // ── Error ────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <Card className="border-red-200 bg-red-50 dark:bg-red-900/20">
        <CardContent className="p-6 flex items-center gap-3 text-red-700 dark:text-red-400">
          <AlertCircle className="h-5 w-5" />
          <p>{error}</p>
        </CardContent>
      </Card>
    );
  }

  // ── Empty ────────────────────────────────────────────────────────────────
  if (subjects.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">{t('mySubjects')}</h1>
        <Card>
          <CardContent className="p-10 text-center text-muted-foreground">
            <BookOpen className="h-10 w-10 mx-auto mb-3 opacity-40" />
            <p>No subjects found.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ── Main ─────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('mySubjects')}</h1>
          <p className="text-gray-500 mt-1">{t('trackPerformanceSubjects')}</p>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-none shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-500">{t('totalSubjectsCard')}</div>
                <div className="text-2xl font-bold text-gray-900 mt-1">{totalSubjects}</div>
              </div>
              <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-500">{t('overallGradeLabel')}</div>
                <div className={`text-2xl font-bold mt-1 ${getGradeColor(overallGrade)}`}>
                  {overallGrade != null ? `${overallGrade}%` : '—'}
                </div>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-500">{t('pendingWork')}</div>
                <div className="text-2xl font-bold text-orange-600 mt-1">{totalPending}</div>
              </div>
              <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
                <FileText className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Subjects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {subjects.map((subject) => {
          const nextLesson = getNextLesson(subject.lessons);
          const totalLessons = subject.lessonsCount ?? subject.lessons?.length ?? 0;
          const completedLessons = (subject.lessons || []).filter(
            (l) => l.status?.toLowerCase() === 'completed'
          ).length;
          const progressPct = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;
          const pendingHomeworks = subject.homeworksCount ?? 0;

          return (
            <Card key={subject.subjectId} className="border-none shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="border-b bg-gradient-to-r from-indigo-50 to-purple-50">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">{subject.subjectName}</CardTitle>
                    {subject.teacherName && (
                      <CardDescription className="flex items-center gap-2 mt-2">
                        <User className="h-4 w-4" />
                        {subject.teacherName}
                      </CardDescription>
                    )}
                  </div>
                  <Badge className={getGradeBadgeColor(subject.averageGrade)}>
                    {subject.averageGrade != null
                      ? `${t('gradeColLabel')} ${subject.averageGrade}%`
                      : (t('noGradeYet') ?? 'No grade yet')}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="p-6 space-y-4">
                {/* Progress */}
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-600">{t('courseProgress')}</span>
                    <span className="font-medium">
                      {completedLessons}/{totalLessons} {t('classesCountLabel')}
                    </span>
                  </div>
                  <Progress value={progressPct} className="h-2" />
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <div className="text-sm text-gray-500">{t('assignmentsLabel')}</div>
                    <div className="text-lg font-semibold text-gray-900 mt-1">
                      {subject.homeworksCount ?? 0}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">{t('exams') ?? 'Exams'}</div>
                    <div className="text-lg font-semibold text-gray-900 mt-1">
                      {subject.examsCount ?? 0}
                    </div>
                  </div>
                </div>

                {/* Next Class */}
                <div className="flex items-center gap-2 p-3 bg-indigo-50 rounded-lg">
                  <Calendar className="h-4 w-4 text-indigo-600" />
                  <div>
                    <div className="text-xs text-gray-600">{t('nextClass')}</div>
                    <div className="text-sm font-medium text-gray-900">
                      {formatNextClass(nextLesson)}
                    </div>
                  </div>
                </div>

                {/* Pending Homework Alert */}
                {pendingHomeworks > 0 && (
                  <div className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-orange-600" />
                      <span className="text-sm font-medium text-orange-900">
                        {pendingHomeworks}{' '}
                        {pendingHomeworks > 1
                          ? t('pendingAssignmentPlural')
                          : t('pendingAssignmentSingular')}
                      </span>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-orange-600 border-orange-600 hover:bg-orange-100"
                      onClick={() => navigate('/student/homework')}
                    >
                      {t('view')}
                    </Button>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => navigate(`/student/subjects/${subject.subjectId}/materials`)}
                  >
                    {t('viewMaterials')}
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                    onClick={() => navigate(`/student/subjects/${subject.subjectId}`)}
                  >
                    {t('viewDetails')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}