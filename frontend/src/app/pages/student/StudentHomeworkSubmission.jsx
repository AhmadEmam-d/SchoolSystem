// pages/student/StudentHomeworkSubmission.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeft,
  FileText,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Download,
  Eye,
  User,
  File,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Separator } from '../../components/ui/separator';
import { toast } from 'sonner';
import { api } from '../../lib/api';

export function StudentHomeworkSubmission() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { homeworkId } = useParams();

  const [submission, setSubmission] = useState(null);
  const [homework, setHomework] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadSubmission();
  }, [homeworkId]);

  const loadSubmission = async () => {
    setLoading(true);
    setError(null);
    try {
      // جلب تقديم الطالب
      const submissionResult = await api.studentHomework.getMySubmission(homeworkId);
      
      if (!submissionResult.ok || !submissionResult.data) {
        setError('No submission found for this homework');
        setLoading(false);
        return;
      }

      setSubmission(submissionResult.data);

      // جلب تفاصيل الواجب
      const homeworkResult = await api.studentHomework.getById(homeworkId);
      if (homeworkResult.ok && homeworkResult.data) {
        setHomework(homeworkResult.data);
      }
    } catch (err) {
      console.error('Error loading submission:', err);
      setError('Failed to load submission details');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'submitted':
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
          <CheckCircle className="h-3 w-3 mr-1" /> Submitted
        </Badge>;
      case 'late':
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
          <AlertCircle className="h-3 w-3 mr-1" /> Late
        </Badge>;
      case 'graded':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
          <CheckCircle className="h-3 w-3 mr-1" /> Graded
        </Badge>;
      default:
        return <Badge variant="outline">{status || 'Pending'}</Badge>;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getFileIcon = (fileUrl) => {
    if (!fileUrl) return <File className="h-5 w-5 text-gray-500" />;
    const ext = fileUrl.split('.').pop()?.toLowerCase();
    if (ext === 'pdf') return <FileText className="h-5 w-5 text-red-500" />;
    if (['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(ext)) return <File className="h-5 w-5 text-green-500" />;
    if (['mp4', 'webm', 'mov'].includes(ext)) return <File className="h-5 w-5 text-purple-500" />;
    return <File className="h-5 w-5 text-gray-500" />;
  };

  const handleViewAttachment = () => {
    if (!submission?.attachmentUrl) return;
    const baseUrl = 'https://localhost:7179';
    const fileUrl = submission.attachmentUrl.startsWith('http') 
      ? submission.attachmentUrl 
      : `${baseUrl}${submission.attachmentUrl}`;
    window.open(fileUrl, '_blank');
  };

  const handleDownloadAttachment = () => {
    if (!submission?.attachmentUrl) return;
    const baseUrl = 'https://localhost:7179';
    const fileUrl = submission.attachmentUrl.startsWith('http') 
      ? submission.attachmentUrl 
      : `${baseUrl}${submission.attachmentUrl}`;
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = submission.attachmentUrl.split('/').pop() || 'attachment';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Downloading file...');
  };

  const handleResubmit = () => {
    navigate(`/student/homework/${homeworkId}/edit`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-12rem)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading submission...</p>
        </div>
      </div>
    );
  }

  if (error || !submission) {
    return (
      <div className="space-y-6 max-w-3xl mx-auto">
        <Button variant="ghost" onClick={() => navigate('/student/homework')} className="mb-4 -ml-2">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Homework
        </Button>
        <Card>
          <CardContent className="p-12 text-center">
            <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-gray-500">{error || 'No submission found'}</p>
            <Button onClick={() => navigate('/student/homework')} className="mt-4">
              Go to Homework
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/student/homework')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap mb-2">
            {getStatusBadge(submission.status)}
            {submission.isGraded && (
              <Badge className="bg-green-100 text-green-800">
                <CheckCircle className="h-3 w-3 mr-1" />
                Graded
              </Badge>
            )}
            {!submission.canResubmit && submission.status !== 'Graded' && (
              <Badge variant="outline" className="text-gray-500">
                Cannot Resubmit
              </Badge>
            )}
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {homework?.title || 'Homework Submission'}
          </h1>
          {homework?.subjectName && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {homework.subjectName} • {homework.teacherName || 'Teacher'}
            </p>
          )}
        </div>
      </div>

      {/* Submission Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileText className="h-5 w-5" />
            Submission Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500">Submitted At</p>
              <p className="text-sm font-medium flex items-center gap-1 mt-1">
                <Clock className="h-4 w-4 text-gray-400" />
                {formatDate(submission.submittedAt)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Status</p>
              <p className="text-sm font-medium mt-1">
                {submission.status}
              </p>
            </div>
            {submission.gradedAt && (
              <div>
                <p className="text-xs text-gray-500">Graded At</p>
                <p className="text-sm font-medium flex items-center gap-1 mt-1">
                  <Clock className="h-4 w-4 text-gray-400" />
                  {formatDate(submission.gradedAt)}
                </p>
              </div>
            )}
            {submission.grade !== null && (
              <div>
                <p className="text-xs text-gray-500">Grade</p>
                <p className="text-sm font-bold text-green-600 mt-1">
                  {submission.grade} / {homework?.maxGrade || 100}
                </p>
              </div>
            )}
          </div>

          <Separator />

          {/* Answer Content */}
          <div>
            <p className="text-sm font-medium mb-2">Your Answer:</p>
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              {submission.content ? (
                <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {submission.content}
                </p>
              ) : (
                <p className="text-sm text-gray-400 italic">No text answer provided</p>
              )}
            </div>
          </div>

          {/* Attachment */}
          {submission.attachmentUrl && (
            <div>
              <p className="text-sm font-medium mb-2">Attached File:</p>
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-3">
                  {getFileIcon(submission.attachmentUrl)}
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {submission.attachmentUrl.split('/').pop()}
                    </p>
                    <p className="text-xs text-gray-500">
                      {submission.fileSize ? formatFileSize(submission.fileSize) : 'Attachment'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" onClick={handleViewAttachment}>
                    <Eye className="h-4 w-4 mr-1" /> View
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleDownloadAttachment}>
                    <Download className="h-4 w-4 mr-1" /> Download
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Feedback Card (if graded) */}
      {submission.feedback && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Teacher's Feedback
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {submission.feedback}
              </p>
            </div>
            {submission.gradedAt && (
              <p className="text-xs text-gray-400 mt-2 text-right">
                  Reviewed on: {new Date(submission.gradedAt).toLocaleDateString()}
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Resubmit Button (if allowed) */}
      {submission.canResubmit && submission.status !== 'Graded' && (
        <div className="flex justify-end">
          <Button onClick={handleResubmit} className="bg-indigo-600 hover:bg-indigo-700 gap-2">
            <Upload className="h-4 w-4" />
            Resubmit Homework
          </Button>
        </div>
      )}

      {/* Info Box */}
      {!submission.canResubmit && submission.status !== 'Graded' && (
        <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 text-yellow-700 dark:text-yellow-400">
              <AlertCircle className="h-5 w-5" />
              <p className="text-sm">
                You cannot resubmit this homework. Please contact your teacher if you need to make changes.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}