import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { FileText, Calendar, Clock, CheckCircle, Upload, Loader2, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '../../components/ui/dialog';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { toast } from 'sonner';
import { api } from '../../lib/api';

export function StudentHomework() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [homeworkList, setHomeworkList] = useState([]);
  const [apiStats, setApiStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedHomework, setSelectedHomework] = useState(null);
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);
  const [submissionText, setSubmissionText] = useState('');
  const [attachmentUrl, setAttachmentUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  // ── Fetch homeworks ──────────────────────────────────────────────────────
  const fetchHomeworks = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.studentHomework.getAll();
      if (!result.ok || !result.data) {
        setError('Failed to load homeworks.');
        return;
      }
      // API returns { homeworks: [...], stats: {...}, ... }
      const list = result.data?.homeworks ?? (Array.isArray(result.data) ? result.data : []);
      setHomeworkList(list);
      if (result.data?.stats) setApiStats(result.data.stats);
    } catch (err) {
      setError('An unexpected error occurred.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchHomeworks(); }, []);

  // ── Normalize status from API ────────────────────────────────────────────
  // API returns: "Pending" | "Submitted" | "Late" | "Graded"
  const normalizeStatus = (s) => s?.toLowerCase() ?? 'pending';

  const pendingHomework  = homeworkList.filter(h => ['pending', 'late'].includes(normalizeStatus(h.status)));
  const submittedHomework = homeworkList.filter(h => normalizeStatus(h.status) === 'submitted');
  const gradedHomework   = homeworkList.filter(h => normalizeStatus(h.status) === 'graded');

  // ── Helpers ──────────────────────────────────────────────────────────────
  const getDaysUntilDue = (dueDate) => {
    if (!dueDate) return null;
    const diff = new Date(dueDate) - new Date();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const getStatusIcon = (status) => {
    const s = normalizeStatus(status);
    if (s === 'pending' || s === 'late') return <Clock className="h-4 w-4 text-orange-600" />;
    if (s === 'submitted') return <CheckCircle className="h-4 w-4 text-blue-600" />;
    if (s === 'graded')    return <CheckCircle className="h-4 w-4 text-green-600" />;
    return null;
  };

  const getStatusLabel = (status) => {
    const s = normalizeStatus(status);
    if (s === 'pending')   return t('pending');
    if (s === 'late')      return t('overdueText') ?? 'Late';
    if (s === 'submitted') return t('submittedCount');
    if (s === 'graded')    return t('gradedCount');
    return status;
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':   return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low':    return 'bg-green-100 text-green-800';
      default:       return 'bg-gray-100 text-gray-800';
    }
  };

  // ── File upload ──────────────────────────────────────────────────────────
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !selectedHomework) return;
    setUploading(true);
    try {
      const result = await api.studentHomework.uploadAttachment(
        selectedHomework.homeworkId ?? selectedHomework.id,
        file
      );
      if (!result.ok) { toast.error('File upload failed'); return; }
      setAttachmentUrl(result.data?.attachmentUrl ?? '');
      toast.success('File uploaded successfully');
    } catch (err) {
      toast.error('File upload failed');
    } finally {
      setUploading(false);
    }
  };

  // ── Submit homework ──────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!selectedHomework) return;
    setSubmitting(true);
    try {
      const result = await api.studentHomework.submit(
        selectedHomework.homeworkId ?? selectedHomework.id,
        { submissionText, attachmentUrl }
      );
      if (!result.ok) { toast.error('Submission failed'); return; }
      toast.success(t('homeworkSubmittedSuccess'));
      setIsSubmitDialogOpen(false);
      setSubmissionText('');
      setAttachmentUrl('');
      fetchHomeworks(); // refresh list
    } catch (err) {
      toast.error('Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  const openSubmitDialog = (homework) => {
    setSelectedHomework(homework);
    setSubmissionText('');
    setAttachmentUrl('');
    setIsSubmitDialogOpen(true);
  };

  // ── Card ─────────────────────────────────────────────────────────────────
  const HomeworkCard = ({ homework }) => {
    const status = normalizeStatus(homework.status);
    const daysUntilDue = getDaysUntilDue(homework.dueDate);
    const isOverdue = homework.isOverdue ?? (daysUntilDue !== null && daysUntilDue < 0 && status === 'pending');

    return (
      <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">{homework.title}</h3>
              {homework.subjectName && (
                <Badge variant="outline" className="text-xs">{homework.subjectName}</Badge>
              )}
            </div>
            {homework.priority && (
              <Badge className={getPriorityColor(homework.priority)}>
                {homework.priority}
              </Badge>
            )}
          </div>

          {homework.description && (
            <p className="text-sm text-gray-600 mb-4 line-clamp-2">{homework.description}</p>
          )}

          <div className="space-y-2 mb-4">
            {homework.dueDate && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>{t('dueDate')}: {new Date(homework.dueDate).toLocaleDateString()}</span>
                {isOverdue && <Badge className="bg-red-100 text-red-800 text-xs">{t('overdueText')}</Badge>}
                {!isOverdue && daysUntilDue !== null && daysUntilDue <= 3 && status === 'pending' && (
                  <Badge className="bg-orange-100 text-orange-800 text-xs">
                    {t('dueInText')} {daysUntilDue} {daysUntilDue !== 1 ? t('daysText') : t('dayText')}
                  </Badge>
                )}
              </div>
            )}
            <div className="flex items-center gap-2 text-sm text-gray-600">
              {getStatusIcon(homework.status)}
              <span>{getStatusLabel(homework.status)}</span>
              {status === 'graded' && homework.grade != null && (
                <Badge className="bg-green-100 text-green-800">
                  {homework.grade}{homework.maxGrade != null ? `/${homework.maxGrade}` : '%'}
                </Badge>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {(status === 'pending' || status === 'late') && (
              <>
                <Button size="sm" className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                  onClick={() => openSubmitDialog(homework)}>
                  <Upload className="h-4 w-4 mr-2" />{t('submitHomeworkBtn')}
                </Button>
                <Button size="sm" variant="outline" className="flex-1"
                  onClick={() => navigate(`/student/homework/${homework.homeworkId ?? homework.id}`)}>
                  {t('viewDetails')}
                </Button>
              </>
            )}
            {status === 'submitted' && (
              <Button size="sm" variant="outline" className="w-full"
                onClick={() => navigate(`/student/homework/${homework.homeworkId ?? homework.id}`)}>
                {t('viewSubmissionBtn')}
              </Button>
            )}
            {status === 'graded' && (
              <Button size="sm" variant="outline" className="w-full"
                onClick={() => navigate(`/student/homework/${homework.homeworkId ?? homework.id}`)}>
                {t('viewFeedbackBtn')}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  // ── Loading / Error ──────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50 dark:bg-red-900/20">
        <CardContent className="p-6 flex items-center gap-3 text-red-700 dark:text-red-400">
          <AlertCircle className="h-5 w-5" /><p>{error}</p>
        </CardContent>
      </Card>
    );
  }

  // ── Main ─────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{t('homework')}</h1>
        <p className="text-gray-500 mt-1">{t('trackSubmitAssignments')}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-none shadow-md"><CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-gray-500">{t('pending')}</div>
              <div className="text-2xl font-bold text-orange-600 mt-1">{apiStats?.pending ?? pendingHomework.length}</div>
            </div>
            <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </CardContent></Card>

        <Card className="border-none shadow-md"><CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-gray-500">{t('submittedCount')}</div>
              <div className="text-2xl font-bold text-blue-600 mt-1">{apiStats?.submitted ?? submittedHomework.length}</div>
            </div>
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </CardContent></Card>

        <Card className="border-none shadow-md"><CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-gray-500">{t('gradedCount')}</div>
              <div className="text-2xl font-bold text-green-600 mt-1">{apiStats?.graded ?? gradedHomework.length}</div>
            </div>
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </CardContent></Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="pending" className="space-y-6">
        <TabsList>
          <TabsTrigger value="pending">{t('pending')} ({pendingHomework.length})</TabsTrigger>
          <TabsTrigger value="submitted">{t('submittedCount')} ({submittedHomework.length})</TabsTrigger>
          <TabsTrigger value="graded">{t('gradedCount')} ({gradedHomework.length})</TabsTrigger>
        </TabsList>

        {[
          { key: 'pending', list: pendingHomework, emptyKey: 'noPendingHomework', EmptyIcon: CheckCircle, emptyColor: 'text-green-500' },
          { key: 'submitted', list: submittedHomework, emptyKey: 'noSubmittedHomework', EmptyIcon: FileText, emptyColor: 'text-gray-300' },
          { key: 'graded', list: gradedHomework, emptyKey: 'noGradedHomework', EmptyIcon: FileText, emptyColor: 'text-gray-300' },
        ].map(({ key, list, emptyKey, EmptyIcon, emptyColor }) => (
          <TabsContent key={key} value={key} className="space-y-4">
            {list.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {list.map(hw => <HomeworkCard key={hw.homeworkId ?? hw.id} homework={hw} />)}
              </div>
            ) : (
              <Card className="border-none shadow-md">
                <CardContent className="p-12 text-center">
                  <EmptyIcon className={`h-12 w-12 mx-auto mb-3 ${emptyColor}`} />
                  <p className="text-gray-500">{t(emptyKey)}</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        ))}
      </Tabs>

      {/* Submit Dialog */}
      <Dialog open={isSubmitDialogOpen} onOpenChange={setIsSubmitDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('submitHomeworkDialogTitle')}</DialogTitle>
            <DialogDescription>
              {selectedHomework?.title}
              {selectedHomework?.subjectName && ` - ${selectedHomework.subjectName}`}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="submission">{t('yourAnswerNotesLabel')}</Label>
              <Textarea
                id="submission"
                placeholder={t('enterAnswerPlaceholder')}
                rows={6}
                value={submissionText}
                onChange={(e) => setSubmissionText(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>{t('attachFilesOptional')}</Label>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                className="hidden"
                onChange={handleFileChange}
              />
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-500 transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                {uploading ? (
                  <Loader2 className="h-8 w-8 mx-auto text-indigo-500 animate-spin mb-2" />
                ) : (
                  <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                )}
                <p className="text-sm text-gray-600">
                  {attachmentUrl ? '✅ File uploaded' : t('clickToUpload')}
                </p>
                <p className="text-xs text-gray-400 mt-1">{t('pdfDocUpTo10MB')}</p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSubmitDialogOpen(false)} disabled={submitting}>
              {t('cancel')}
            </Button>
            <Button
              className="bg-indigo-600 hover:bg-indigo-700"
              onClick={handleSubmit}
              disabled={submitting || uploading}
            >
              {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              {t('submitHomeworkDialogTitle')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}