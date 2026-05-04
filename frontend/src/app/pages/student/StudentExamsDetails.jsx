// pages/student/StudentExamDetails.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import {
  ArrowLeft,
  FileText,
  Calendar,
  Clock,
  User,
  BookOpen,
  Download,
  Eye,
  Upload,
  Send,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  File,
  FileImage,
  FileVideo,
  Link as LinkIcon,
  DoorOpen,
  Target,
  Info
} from 'lucide-react';
import { toast } from 'sonner';
import { api } from '../../lib/api';

export function StudentExamDetails() {
  const navigate = useNavigate();
  const { examId } = useParams();
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [answerText, setAnswerText] = useState('');
  const [attachmentFile, setAttachmentFile] = useState(null);
  const [attachmentUrl, setAttachmentUrl] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    loadExamDetails();
  }, [examId]);

  const loadExamDetails = async () => {
    setLoading(true);
    try {
      const data = await api.studentExams.getExamDetails(examId);
      setExam(data);
      console.log('📖 Exam loaded:', data);
      
      // If already submitted, populate the fields
      if (data?.mySubmission) {
        setAnswerText(data.mySubmission.answerText || '');
        setAttachmentUrl(data.mySubmission.attachmentUrl || '');
        setSubmitted(true);
      }
    } catch (error) {
      console.error('Error loading exam:', error);
      toast.error('Failed to load exam details');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'submitted':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"><CheckCircle2 className="h-3 w-3 mr-1" /> Submitted</Badge>;
      case 'late':
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"><AlertCircle className="h-3 w-3 mr-1" /> Late</Badge>;
      case 'graded':
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"><CheckCircle2 className="h-3 w-3 mr-1" /> Graded</Badge>;
      case 'pending':
        return <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"><Clock className="h-3 w-3 mr-1" /> Pending</Badge>;
      default:
        return <Badge variant="outline">{status || 'Not Started'}</Badge>;
    }
  };

  const getExamTypeBadge = (type) => {
    switch (type?.toLowerCase()) {
      case 'midterm':
        return <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">Midterm</Badge>;
      case 'final':
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">Final</Badge>;
      case 'quiz':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">Quiz</Badge>;
      default:
        return <Badge variant="outline">{type || 'Exam'}</Badge>;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getFileIcon = (fileType) => {
    if (!fileType) return <File className="h-5 w-5 text-gray-500" />;
    if (fileType.includes('pdf')) return <FileText className="h-5 w-5 text-red-500" />;
    if (fileType.includes('image')) return <FileImage className="h-5 w-5 text-green-500" />;
    if (fileType.includes('video')) return <FileVideo className="h-5 w-5 text-purple-500" />;
    return <File className="h-5 w-5 text-gray-500" />;
  };

  const handleViewMaterial = (material) => {
    const baseUrl = 'https://localhost:7179';
    const fileUrl = material.fileUrl?.startsWith('http') 
      ? material.fileUrl 
      : `${baseUrl}${material.fileUrl}`;
    window.open(fileUrl, '_blank');
    toast.info(`Opening "${material.name}"...`);
  };

  const handleDownloadMaterial = (material) => {
    const baseUrl = 'https://localhost:7179';
    const fileUrl = material.fileUrl?.startsWith('http') 
      ? material.fileUrl 
      : `${baseUrl}${material.fileUrl}`;
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = material.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Downloading "${material.name}"...`);
  };

  const handleFileUpload = async (file) => {
    if (!exam) return;
    
    setUploading(true);
    try {
      const result = await api.studentExams.uploadSolution(exam.examId, file);
      if (result) {
        setAttachmentUrl(result.attachmentUrl);
        toast.success('File uploaded successfully');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmitExam = async () => {
    if (!exam) return;
    
    if (!answerText.trim() && !attachmentUrl) {
      toast.error('Please provide an answer or upload a file');
      return;
    }

    setSubmitting(true);
    try {
      const result = await api.studentExams.submitExam(exam.examId, {
        answerText: answerText.trim(),
        attachmentUrl: attachmentUrl,
        fileName: attachmentFile?.name || null
      });

      if (result) {
        toast.success('Exam submitted successfully!');
        setSubmitted(true);
        loadExamDetails(); // Refresh to get updated submission
      }
    } catch (error) {
      console.error('Error submitting exam:', error);
      toast.error('Failed to submit exam');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-12rem)]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-500">Loading exam details...</p>
        </div>
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="text-center py-12">
        <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
        <p className="text-gray-500">Exam not found</p>
        <Button onClick={() => navigate('/student/exams')} className="mt-4">Back to Exams</Button>
      </div>
    );
  }

  const isSubmitted = submitted || exam.mySubmission;
  const canSubmit = !isSubmitted;

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/student/exams')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap mb-2">
            {getExamTypeBadge(exam.type)}
            {getStatusBadge(exam.status)}
            {exam.mySubmission && getStatusBadge(exam.mySubmission.status)}
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {exam.name}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {exam.subjectName} • {exam.teacherName}
          </p>
        </div>
      </div>

      {/* Exam Info Card */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Date</p>
                <p className="text-sm font-medium">{formatDate(exam.date)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Time</p>
                <p className="text-sm font-medium">{exam.startTime} ({exam.duration} hours)</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Score</p>
                <p className="text-sm font-medium">Pass: {exam.passingScore} / {exam.maxScore}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <DoorOpen className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Room</p>
                <p className="text-sm font-medium">{exam.room || 'Not specified'}</p>
              </div>
            </div>
          </div>

          {exam.description && (
            <div className="pt-2 border-t dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-300">{exam.description}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Instructions Card */}
      {exam.instructions && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Info className="h-5 w-5" />
              Instructions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-sm whitespace-pre-wrap">{exam.instructions}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Materials Card */}
      {exam.materials && exam.materials.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText className="h-5 w-5" />
              Exam Materials
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {exam.materials.map((material, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {getFileIcon(material.fileType)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {material.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(material.fileSize)} • {material.fileType?.split('/').pop()?.toUpperCase()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleViewMaterial(material)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleDownloadMaterial(material)}>
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Submission Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            {isSubmitted ? <CheckCircle2 className="h-5 w-5 text-green-500" /> : <Send className="h-5 w-5" />}
            My Submission
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isSubmitted && exam.mySubmission ? (
            // View Submission
            <div className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  {getStatusBadge(exam.mySubmission.status)}
                  <span className="text-xs text-gray-500">
                    Submitted: {new Date(exam.mySubmission.submittedAt).toLocaleString()}
                  </span>
                </div>
                {exam.mySubmission.score && (
                  <Badge className="bg-blue-100 text-blue-800">
                    Score: {exam.mySubmission.score} / {exam.maxScore}
                  </Badge>
                )}
              </div>

              {exam.mySubmission.answerText && (
                <div>
                  <p className="text-sm font-medium mb-1">Your Answer:</p>
                  <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-sm whitespace-pre-wrap">{exam.mySubmission.answerText}</p>
                  </div>
                </div>
              )}

              {exam.mySubmission.attachmentUrl && (
                <div>
                  <p className="text-sm font-medium mb-1">Attachment:</p>
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-3">
                      <File className="h-5 w-5 text-gray-500" />
                      <span className="text-sm">{exam.mySubmission.fileName}</span>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => {
                        const baseUrl = 'https://localhost:7179';
                        const fileUrl = exam.mySubmission.attachmentUrl?.startsWith('http') 
                          ? exam.mySubmission.attachmentUrl 
                          : `${baseUrl}${exam.mySubmission.attachmentUrl}`;
                        window.open(fileUrl, '_blank');
                      }}
                    >
                      <Eye className="h-4 w-4 mr-1" /> View
                    </Button>
                  </div>
                </div>
              )}

              {exam.mySubmission.feedback && (
                <div>
                  <p className="text-sm font-medium mb-1">Feedback:</p>
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <p className="text-sm">{exam.mySubmission.feedback}</p>
                  </div>
                </div>
              )}

              {exam.mySubmission.gradedAt && (
                <p className="text-xs text-gray-500 text-right">
                  Graded on: {new Date(exam.mySubmission.gradedAt).toLocaleString()}
                </p>
              )}
            </div>
          ) : (
            // Submit Form
            <div className="space-y-4">
              <p className="text-sm text-amber-600 dark:text-amber-400 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                Please submit your answer before the deadline
              </p>

              {/* Answer Text */}
              <div>
                <label className="block text-sm font-medium mb-1">Your Answer</label>
                <Textarea
                  value={answerText}
                  onChange={(e) => setAnswerText(e.target.value)}
                  placeholder="Type your answer here..."
                  rows={6}
                  className="resize-none"
                />
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium mb-1">Attachment (Optional)</label>
                <div className="flex items-center gap-3">
                  <Input
                    type="file"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setAttachmentFile(file);
                        handleFileUpload(file);
                      }
                    }}
                    className="flex-1"
                    disabled={uploading}
                  />
                  {uploading && <Loader2 className="h-5 w-5 animate-spin" />}
                </div>
                {attachmentUrl && (
                  <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4" /> File uploaded successfully
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                onClick={handleSubmitExam}
                disabled={submitting || (!answerText.trim() && !attachmentUrl)}
                className="w-full bg-indigo-600 hover:bg-indigo-700"
              >
                {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
                Submit Exam
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}