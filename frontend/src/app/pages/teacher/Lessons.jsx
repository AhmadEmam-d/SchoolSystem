import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Search, Plus, BookOpen, Calendar, Clock, Eye, Edit, Trash2, FileText, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function TeacherLessons() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [lessonToDelete, setLessonToDelete] = useState(null);

  // Mock lessons data
  const [lessons, setLessons] = useState([
    {
      id: 'l1',
      title: 'Introduction to Calculus',
      subject: 'Mathematics',
      classId: 'c1',
      className: 'Class 10-A',
      date: '2026-03-05',
      duration: '45 min',
      status: 'completed',
      materials: 3,
      description: 'Basic concepts of derivatives and limits'
    },
    {
      id: 'l2',
      title: 'Quadratic Equations',
      subject: 'Mathematics',
      classId: 'c1',
      className: 'Class 10-A',
      date: '2026-03-06',
      duration: '45 min',
      status: 'upcoming',
      materials: 2,
      description: 'Solving quadratic equations using different methods'
    },
    {
      id: 'l3',
      title: 'Trigonometry Basics',
      subject: 'Mathematics',
      classId: 'c2',
      className: 'Class 10-B',
      date: '2026-03-04',
      duration: '60 min',
      status: 'completed',
      materials: 4,
      description: 'Introduction to sine, cosine, and tangent'
    },
  ]);

  const filteredLessons = lessons.filter(lesson =>
    lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lesson.className.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lesson.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDeleteLesson = (id) => {
    setLessonToDelete(id);
    setShowDeleteDialog(true);
  };

  const confirmDeleteLesson = () => {
    if (lessonToDelete) {
      setLessons(lessons.filter(lesson => lesson.id !== lessonToDelete));
      setShowDeleteDialog(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t('lessons')}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {t('manageLessonsDesc')}
          </p>
        </div>
        <Button
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => navigate('/teacher/lessons/add')}
        >
          <Plus className="h-4 w-4 mr-2" />
          {t('addNewLesson')}
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('totalLessons')}</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lessons.length}</div>
            <p className="text-xs text-muted-foreground">{t('thisSemester')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('upcoming')}</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {lessons.filter(l => l.status === 'upcoming').length}
            </div>
            <p className="text-xs text-muted-foreground">{t('nextWeek')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('completed')}</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {lessons.filter(l => l.status === 'completed').length}
            </div>
            <p className="text-xs text-muted-foreground">{t('thisMonth')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('materials')}</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {lessons.reduce((acc, l) => acc + l.materials, 0)}
            </div>
            <p className="text-xs text-muted-foreground">{t('totalFiles')}</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder={t('searchLessons')}
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Lessons List */}
      <div className="grid gap-4">
        {filteredLessons.map((lesson) => (
          <Card key={lesson.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  {/* Icon */}
                  <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400">
                    <BookOpen className="h-6 w-6" />
                  </div>

                  {/* Lesson Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {lesson.title}
                      </h3>
                      <Badge className={getStatusColor(lesson.status)}>
                        {t(lesson.status)}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {lesson.description}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4" />
                        <span>{lesson.subject}</span>
                      </div>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(lesson.date).toLocaleDateString()}</span>
                      </div>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{lesson.duration}</span>
                      </div>
                      <span>•</span>
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        {lesson.className}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/teacher/lessons/${lesson.id}`)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    {t('viewDetails')}
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => navigate(`/teacher/lessons/edit/${lesson.id}`)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteLesson(lesson.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </div>
              </div>

              {/* Materials Badge */}
              <div className="mt-4 pt-4 border-t dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <FileText className="h-4 w-4" />
                    <span>{lesson.materials} {t('studyMaterialsAttached')}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredLessons.length === 0 && (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-700">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">{t('noLessonsFound')}</h3>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {searchTerm ? t('tryDifferentSearch') : t('createFirstLesson')}
          </p>
        </div>
      )}

      {/* Delete Dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="flex items-start gap-4 mb-4">
              <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  {t('deleteLesson')}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {t('deleteLessonConfirm')}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 mt-6">
              <Button
                variant="outline"
                onClick={() => setShowDeleteDialog(false)}
              >
                {t('cancel')}
              </Button>
              <Button
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={confirmDeleteLesson}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {t('delete')}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
