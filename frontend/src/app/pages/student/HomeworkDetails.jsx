import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import {
  ArrowLeft, Calendar, Clock, FileText, Download,
  Upload, Eye, CheckCircle, User, Loader2, AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { api } from '../../lib/api';

export function StudentHomeworkDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [homework, setHomework] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [submissionText, setSubmissionText] = useState('');
  const [attachmentUrl, setAttachmentUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  // ── Fetch ────────────────────────────────────────────────────────────────
  useEffect(() => {
    const fetch_ = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await api.studentHomework.getById(id);
        if (!result.ok || !result.data) { setError('Failed to load homework.'); return; }
        setHomework(result.data);
        // Pre-fill if already submitted
        if (result.data.mySubmission?.content) {
          setSubmissionText(result.data.mySubmission.content);
        }
      } catch (err) {
        setError('An unexpected error occurred.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch_();
  }, [id]);

  // ── Helpers ──────────────────────────────────────────────────────────────
  const normalizeStatus = (s) => s?.toLowerCase() ?? 'pending';

  const getStatusBadge = (status) => {
    const s = normalizeStatus(status);
    if (s === 'pending')   return <Badge className="bg-orange-100 text-orange-800">Pending</Badge>;
    if (s === 'submitted') return <Badge className="bg-blue-100 text-blue-800">Submitted</Badge>;
    if (s === 'grading')   return <Badge className="bg-purple-100 text-purple-800">Grading</Badge>;
    if (s === 'graded')    return <Badge className="bg-green-100 text-green-800">Graded</Badge>;
    if (s === 'late')      return <Badge className="bg-red-100 text-red-800">Late</Badge>;
    return <Badge>{status}</Badge>;
  };

  const getPriorityColor = (p) => {
    switch (p?.toLowerCase()) {
      case 'high':   return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low':    return 'bg-green-100 text-green-800';
      default:       return 'bg-gray-100 text-gray-800';
    }
  };

  const getDaysUntilDue = (dueDate) => {
    if (!dueDate) return null;
    return Math.ceil((new Date(dueDate) - new Date()) / (1000 * 60 * 60 * 24));
  };

  // Parse instructions — API returns newline-separated string
  const parseInstructions = (raw) => {
    if (!raw) return [];
    if (Array.isArray(raw)) return raw;
    return raw.split('\n').map(s => s.replace(/^\d+\.\s*/, '').trim()).filter(Boolean);
  };

  // ── File upload ──────────────────────────────────────────────────────────
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const result = await api.studentHomework.uploadAttachment(id, file);
      if (!result.ok) { toast.error('File upload failed'); return; }
      setAttachmentUrl(result.data?.attachmentUrl ?? '');
      toast.success('File uploaded successfully');
    } catch { toast.error('File upload failed'); }
    finally { setUploading(false); }
  };

  // ── Submit ───────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!submissionText.trim() && !attachmentUrl) {
      toast.error('Please enter your answer or upload a file');
      return;
    }
    setSubmitting(true);
    try {
      const result = await api.studentHomework.submit(id, { submissionText, attachmentUrl });
      if (!result.ok) { toast.error('Submission failed'); return; }
      toast.success('Homework submitted successfully!');
      navigate('/student/homework');
    } catch { toast.error('Submission failed'); }
    finally { setSubmitting(false); }
  };

  // ── Download / View ──────────────────────────────────────────────────────
  const handleDownload = (file) => {
    const a = document.createElement('a');
    a.href = file.fileUrl;
    a.download = file.fileName;
    a.target = '_blank';
    a.click();
    toast.success(`Downloading ${file.fileName}...`);
  };

  const handleView = (file) => {
    window.open(file.fileUrl, '_blank');
  };

  // ── Loading / Error ──────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !homework) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={() => navigate('/student/homework')} className="-ml-2">
          <ArrowLeft className="h-4 w-4 mr-2" />Back to Homework
        </Button>
        <Card className="border-red-200 bg-red-50 dark:bg-red-900/20">
          <CardContent className="p-6 flex items-center gap-3 text-red-700">
            <AlertCircle className="h-5 w-5" /><p>{error || 'Homework not found.'}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ── Derived ──────────────────────────────────────────────────────────────
  const status = normalizeStatus(homework.status);
  const daysUntilDue = getDaysUntilDue(homework.dueDate);
  const isOverdue = homework.isOverdue ?? (daysUntilDue !== null && daysUntilDue < 0);
  const instructions = parseInstructions(homework.instructions);
  const attachments = homework.attachments ?? [];
  const isPending = status === 'pending' || status === 'late';
  const mySubmission = homework.mySubmission;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Button variant="ghost" onClick={() => navigate('/student/homework')} className="mb-2 -ml-2">
          <ArrowLeft className="h-4 w-4 mr-2" />Back to Homework
        </Button>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <h1 className="text-3xl font-bold text-gray-900">{homework.title}</h1>
              {getStatusBadge(homework.status)}
              {homework.priority && (
                <Badge className={getPriorityColor(homework.priority)}>{homework.priority}</Badge>
              )}
            </div>
            <div className="flex items-center gap-4 text-gray-500 flex-wrap">
              {homework.subjectName && <Badge variant="outline">{homework.subjectName}</Badge>}
              {homework.teacherName && (
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" /><span>{homework.teacherName}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          {homework.description && (
            <Card>
              <CardHeader><CardTitle>Description</CardTitle></CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{homework.description}</p>
              </CardContent>
            </Card>
          )}

          {/* Instructions */}
          {instructions.length > 0 && (
            <Card>
              <CardHeader><CardTitle>Instructions</CardTitle></CardHeader>
              <CardContent>
                <ol className="space-y-2">
                  {instructions.map((instruction, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-indigo-100 text-indigo-600 text-sm font-medium">
                        {index + 1}
                      </span>
                      <span className="text-gray-700 pt-0.5">{instruction}</span>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          )}

          {/* Attachments */}
          {attachments.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-indigo-600" />
                <h2 className="text-2xl font-bold text-gray-900">Attachments</h2>
              </div>
              <div className="space-y-4">
                {attachments.map((file, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 sm:p-5 bg-white border border-gray-200 rounded-2xl hover:shadow-lg transition-shadow gap-4">
                    <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                      <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl bg-indigo-100 flex items-center justify-center flex-shrink-0">
                        <FileText className="h-8 w-8 sm:h-10 sm:w-10 text-indigo-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2 truncate">{file.fileName}</h4>
                        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                          <Badge variant="outline" className="text-xs font-medium">
                            {file.fileType?.split('/')[1]?.toUpperCase() ?? 'FILE'}
                          </Badge>
                          <span className="text-xs sm:text-sm text-gray-500">{file.sizeText}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 w-full sm:w-auto">
                      <Button variant="ghost" size="default"
                        className="flex-1 sm:flex-initial gap-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                        onClick={() => handleView(file)}>
                        <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
                        <span className="font-medium text-sm sm:text-base">View</span>
                      </Button>
                      <Button size="default"
                        className="flex-1 sm:flex-initial bg-indigo-600 hover:bg-indigo-700 gap-2 px-4 sm:px-8 rounded-full"
                        onClick={() => handleDownload(file)}>
                        <Download className="h-4 w-4 sm:h-5 sm:w-5" />
                        <span className="font-medium text-sm sm:text-base">Download</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* My previous submission (read-only) */}
          {mySubmission && !isPending && (
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                  My Submission
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {mySubmission.content && (
                  <p className="text-gray-700 whitespace-pre-wrap">{mySubmission.content}</p>
                )}
                {mySubmission.attachmentUrl && (
                  <a href={mySubmission.attachmentUrl} target="_blank" rel="noreferrer"
                    className="inline-flex items-center gap-2 text-indigo-600 hover:underline text-sm">
                    <FileText className="h-4 w-4" />View submitted file
                  </a>
                )}
                {mySubmission.submittedAt && (
                  <p className="text-xs text-gray-500">
                    Submitted: {new Date(mySubmission.submittedAt).toLocaleString()}
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Submission area */}
          {isPending && (
            <Card>
              <CardHeader><CardTitle>Your Submission</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="submission">Your Answer / Notes</Label>
                  <Textarea
                    id="submission"
                    placeholder="Enter your answer or notes here..."
                    rows={8}
                    value={submissionText}
                    onChange={(e) => setSubmissionText(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Attach File (Optional)</Label>
                  <input ref={fileInputRef} type="file"
                    accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                    className="hidden" onChange={handleFileChange} />
                  <div
                    className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-indigo-500 transition-colors cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {uploading
                      ? <Loader2 className="h-10 w-10 mx-auto text-indigo-500 animate-spin mb-3" />
                      : <Upload className="h-10 w-10 mx-auto text-gray-400 mb-3" />
                    }
                    <p className="text-sm text-gray-600 font-medium">
                      {attachmentUrl ? '✅ File uploaded — click to replace' : 'Click to upload or drag and drop'}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">PDF, DOC, DOCX, Images up to 10MB</p>
                  </div>
                </div>

                <Button className="w-full bg-indigo-600 hover:bg-indigo-700" size="lg"
                  onClick={handleSubmit} disabled={submitting || uploading}>
                  {submitting
                    ? <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    : <Upload className="h-4 w-4 mr-2" />
                  }
                  Submit Homework
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Teacher feedback */}
          {(status === 'graded' || status === 'grading') && mySubmission?.feedback && (
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Teacher Feedback
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{mySubmission.feedback}</p>
                {mySubmission.gradedAt && (
                  <p className="text-xs text-gray-500 mt-2">
                    Graded: {new Date(mySubmission.gradedAt).toLocaleString()}
                  </p>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Due date */}
          <Card className={isOverdue ? 'border-red-200 bg-red-50' : 'bg-gradient-to-br from-indigo-50 to-purple-50'}>
            <CardContent className="p-6">
              <div className="text-sm text-gray-600 mb-1">Due Date</div>
              <div className="text-lg font-semibold text-gray-900 mb-3">
                {homework.dueDate
                  ? new Date(homework.dueDate).toLocaleDateString('en-US', {
                      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                    })
                  : '—'}
              </div>
              {isOverdue ? (
                <Badge className="bg-red-100 text-red-800">
                  Overdue by {Math.abs(daysUntilDue)} day{Math.abs(daysUntilDue) !== 1 ? 's' : ''}
                </Badge>
              ) : daysUntilDue !== null && daysUntilDue <= 3 ? (
                <Badge className="bg-orange-100 text-orange-800">
                  Due in {daysUntilDue} day{daysUntilDue !== 1 ? 's' : ''}
                </Badge>
              ) : daysUntilDue !== null ? (
                <Badge className="bg-blue-100 text-blue-800">{daysUntilDue} days remaining</Badge>
              ) : null}
            </CardContent>
          </Card>

          {/* Assignment Info */}
          <Card>
            <CardHeader><CardTitle>Assignment Info</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {homework.assignedDate && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Assigned Date</span>
                  <span className="font-medium text-gray-900">
                    {new Date(homework.assignedDate).toLocaleDateString()}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Max Grade</span>
                <span className="font-medium text-gray-900">{homework.totalMarks ?? '—'} points</span>
              </div>
              {mySubmission?.grade != null && (
                <div className="flex items-center justify-between pt-3 border-t">
                  <span className="text-sm text-gray-600">Your Grade</span>
                  <Badge className="bg-green-100 text-green-800 text-base">
                    {mySubmission.grade}/{homework.totalMarks}
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader><CardTitle>Quick Actions</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start"
                onClick={() => navigate('/student/subjects')}>
                <FileText className="h-4 w-4 mr-2" />View Subject Materials
              </Button>
              <Button variant="outline" className="w-full justify-start"
                onClick={() => navigate('/student/schedule')}>
                <Calendar className="h-4 w-4 mr-2" />View Schedule
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}