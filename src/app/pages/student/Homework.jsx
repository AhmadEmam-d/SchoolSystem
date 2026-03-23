import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { FileText, Calendar, Clock, CheckCircle, AlertCircle, Upload, Download } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '../../components/ui/dialog';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { toast } from 'sonner';

export function StudentHomework() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [selectedHomework, setSelectedHomework] = useState(null);
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);

  const homeworkList = [
    {
      id: '1',
      title: 'Quadratic Equations Worksheet',
      subject: 'Mathematics',
      description: 'Complete problems 1-20 from Chapter 5. Show all work.',
      dueDate: '2026-03-10',
      assignedDate: '2026-03-01',
      status: 'pending',
      priority: 'high'
    },
    {
      id: '2',
      title: 'Chemical Reactions Lab Report',
      subject: 'Science',
      description: 'Write a detailed report on the chemical reactions experiment conducted in class.',
      dueDate: '2026-03-12',
      assignedDate: '2026-03-02',
      status: 'pending',
      priority: 'medium'
    },
    {
      id: '3',
      title: 'Essay: World War II Impact',
      subject: 'History',
      description: 'Write a 5-page essay analyzing the impact of World War II on modern society.',
      dueDate: '2026-03-15',
      assignedDate: '2026-02-28',
      status: 'submitted',
      priority: 'high'
    },
    {
      id: '4',
      title: 'Shakespeare Analysis',
      subject: 'English',
      description: 'Analyze the themes in Romeo and Juliet Act 3.',
      dueDate: '2026-03-05',
      assignedDate: '2026-02-25',
      status: 'graded',
      grade: 92,
      maxGrade: 100,
      priority: 'medium'
    },
    {
      id: '5',
      title: 'Portrait Drawing',
      subject: 'Art',
      description: 'Create a self-portrait using charcoal or pencil.',
      dueDate: '2026-03-20',
      assignedDate: '2026-03-01',
      status: 'pending',
      priority: 'low'
    },
  ];

  const pendingHomework = homeworkList.filter(h => h.status === 'pending');
  const submittedHomework = homeworkList.filter(h => h.status === 'submitted');
  const gradedHomework = homeworkList.filter(h => h.status === 'graded');

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityLabel = (priority) => {
    switch (priority) {
      case 'high': return t('high');
      case 'medium': return t('normal');
      case 'low': return t('low');
      default: return priority;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4 text-orange-600" />;
      case 'submitted': return <CheckCircle className="h-4 w-4 text-blue-600" />;
      case 'graded': return <CheckCircle className="h-4 w-4 text-green-600" />;
      default: return null;
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'pending': return t('pending');
      case 'submitted': return t('submittedCount');
      case 'graded': return t('gradedCount');
      default: return status;
    }
  };

  const getDaysUntilDue = (dueDate) => {
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const HomeworkCard = ({ homework }) => {
    const daysUntilDue = getDaysUntilDue(homework.dueDate);
    const isOverdue = daysUntilDue < 0 && homework.status === 'pending';

    return (
      <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">{homework.title}</h3>
              <Badge variant="outline" className="text-xs">{homework.subject}</Badge>
            </div>
            <Badge className={getPriorityColor(homework.priority)}>
              {getPriorityLabel(homework.priority)}
            </Badge>
          </div>

          <p className="text-sm text-gray-600 mb-4 line-clamp-2">{homework.description}</p>

          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="h-4 w-4" />
              <span>{t('dueDate')}: {new Date(homework.dueDate).toLocaleDateString()}</span>
              {isOverdue && (
                <Badge className="bg-red-100 text-red-800 text-xs">{t('overdueText')}</Badge>
              )}
              {!isOverdue && daysUntilDue <= 3 && homework.status === 'pending' && (
                <Badge className="bg-orange-100 text-orange-800 text-xs">
                  {t('dueInText')} {daysUntilDue} {daysUntilDue !== 1 ? t('daysText') : t('dayText')}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              {getStatusIcon(homework.status)}
              <span>{getStatusLabel(homework.status)}</span>
              {homework.status === 'graded' && homework.grade && (
                <Badge className="bg-green-100 text-green-800">
                  {homework.grade}/{homework.maxGrade}
                </Badge>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {homework.status === 'pending' && (
              <>
                <Button
                  size="sm"
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                  onClick={() => {
                    setSelectedHomework(homework);
                    setIsSubmitDialogOpen(true);
                  }}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {t('submitHomeworkBtn')}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={() => navigate(`/student/homework/${homework.id}`)}
                >
                  {t('viewDetails')}
                </Button>
              </>
            )}
            {homework.status === 'submitted' && (
              <Button
                size="sm"
                variant="outline"
                className="w-full"
                onClick={() => navigate(`/student/homework/${homework.id}`)}
              >
                {t('viewSubmissionBtn')}
              </Button>
            )}
            {homework.status === 'graded' && (
              <Button
                size="sm"
                variant="outline"
                className="w-full"
                onClick={() => navigate(`/student/homework/${homework.id}`)}
              >
                <Download className="h-4 w-4 mr-2" />
                {t('viewFeedbackBtn')}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('homework')}</h1>
          <p className="text-gray-500 mt-1">{t('trackSubmitAssignments')}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-none shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-500">{t('pending')}</div>
                <div className="text-2xl font-bold text-orange-600 mt-1">{pendingHomework.length}</div>
              </div>
              <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-500">{t('submittedCount')}</div>
                <div className="text-2xl font-bold text-blue-600 mt-1">{submittedHomework.length}</div>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-500">{t('gradedCount')}</div>
                <div className="text-2xl font-bold text-green-600 mt-1">{gradedHomework.length}</div>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Homework Tabs */}
      <Tabs defaultValue="pending" className="space-y-6">
        <TabsList>
          <TabsTrigger value="pending">
            {t('pending')} ({pendingHomework.length})
          </TabsTrigger>
          <TabsTrigger value="submitted">
            {t('submittedCount')} ({submittedHomework.length})
          </TabsTrigger>
          <TabsTrigger value="graded">
            {t('gradedCount')} ({gradedHomework.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {pendingHomework.map(homework => (
              <HomeworkCard key={homework.id} homework={homework} />
            ))}
          </div>
          {pendingHomework.length === 0 && (
            <Card className="border-none shadow-md">
              <CardContent className="p-12 text-center">
                <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-3" />
                <p className="text-gray-500">{t('noPendingHomework')}</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="submitted" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {submittedHomework.map(homework => (
              <HomeworkCard key={homework.id} homework={homework} />
            ))}
          </div>
          {submittedHomework.length === 0 && (
            <Card className="border-none shadow-md">
              <CardContent className="p-12 text-center">
                <FileText className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500">{t('noSubmittedHomework')}</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="graded" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {gradedHomework.map(homework => (
              <HomeworkCard key={homework.id} homework={homework} />
            ))}
          </div>
          {gradedHomework.length === 0 && (
            <Card className="border-none shadow-md">
              <CardContent className="p-12 text-center">
                <FileText className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500">{t('noGradedHomework')}</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Submit Dialog */}
      <Dialog open={isSubmitDialogOpen} onOpenChange={setIsSubmitDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('submitHomeworkDialogTitle')}</DialogTitle>
            <DialogDescription>
              {selectedHomework?.title} - {selectedHomework?.subject}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="submission">{t('yourAnswerNotesLabel')}</Label>
              <Textarea
                id="submission"
                placeholder={t('enterAnswerPlaceholder')}
                rows={6}
              />
            </div>
            <div className="space-y-2">
              <Label>{t('attachFilesOptional')}</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-500 transition-colors cursor-pointer">
                <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-600">{t('clickToUpload')}</p>
                <p className="text-xs text-gray-400 mt-1">{t('pdfDocUpTo10MB')}</p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSubmitDialogOpen(false)}>
              {t('cancel')}
            </Button>
            <Button
              className="bg-indigo-600 hover:bg-indigo-700"
              onClick={() => {
                toast.success(t('homeworkSubmittedSuccess'));
                setIsSubmitDialogOpen(false);
              }}
            >
              {t('submitHomeworkDialogTitle')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
