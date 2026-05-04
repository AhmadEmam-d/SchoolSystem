// pages/student/StudentExams.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
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
  Link as LinkIcon
} from 'lucide-react';
import { toast } from 'sonner';
import { api } from '../../lib/api';

export function StudentExams() {
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedExam, setSelectedExam] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [answerText, setAnswerText] = useState('');
  const [attachmentFile, setAttachmentFile] = useState(null);
  const [attachmentUrl, setAttachmentUrl] = useState('');
  const [activeTab, setActiveTab] = useState('upcoming');

  useEffect(() => {
    loadExams();
  }, []);

  const loadExams = async () => {
    setLoading(true);
    try {
      const data = await api.studentExams.getMyExams();
      setExams(data || []);
      console.log('📋 Exams loaded:', data);
    } catch (error) {
      console.error('Error loading exams:', error);
      toast.error('Failed to load exams');
    } finally {
      setLoading(false);
    }
  };

  const getExamStatusBadge = (status, examDate, examTime, duration) => {
    const now = new Date();
    const examDateTime = new Date(examDate);
    const [hours, minutes] = (examTime || '00:00').split(':');
    examDateTime.setHours(parseInt(hours), parseInt(minutes), 0);
    
    const examEndTime = new Date(examDateTime);
    examEndTime.setMinutes(examEndTime.getMinutes() + parseInt(duration?.split(':')[0] || 0) * 60 + parseInt(duration?.split(':')[1] || 0));

    if (status === 'Published') {
      if (now < examDateTime) {
        return { label: 'Upcoming', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400', icon: <Clock className="h-3 w-3 mr-1" /> };
      } else if (now >= examDateTime && now <= examEndTime) {
        return { label: 'Ongoing', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400', icon: <AlertCircle className="h-3 w-3 mr-1" /> };
      } else {
        return { label: 'Past', color: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400', icon: <CheckCircle2 className="h-3 w-3 mr-1" /> };
      }
    }
    return { label: status, color: 'bg-gray-100 text-gray-600', icon: null };
  };

  const getSubmissionStatusBadge = (status) => {
    switch (status) {
      case 'Submitted':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"><CheckCircle2 className="h-3 w-3 mr-1" /> Submitted</Badge>;
      case 'Late':
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"><AlertCircle className="h-3 w-3 mr-1" /> Late</Badge>;
      case 'Graded':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"><CheckCircle2 className="h-3 w-3 mr-1" /> Graded</Badge>;
      default:
        return <Badge variant="outline">Not Submitted</Badge>;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getFileIcon = (fileType) => {
    if (!fileType) return <File className="h-5 w-5 text-gray-500" />;
    if (fileType.includes('pdf')) return <FileText className="h-5 w-5 text-red-500" />;
    if (fileType.includes('image')) return <FileImage className="h-5 w-5 text-green-500" />;
    return <File className="h-5 w-5 text-gray-500" />;
  };

  const handleViewMaterial = (material) => {
    const baseUrl = 'https://localhost:7179';
    const fileUrl = material.fileUrl?.startsWith('http') ? material.fileUrl : `${baseUrl}${material.fileUrl}`;
    window.open(fileUrl, '_blank');
  };

  const handleFileUpload = async (file) => {
    if (!selectedExam) return;
    
    setUploading(true);
    try {
      const result = await api.studentExams.uploadSolution(selectedExam.examId, file);
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
    if (!selectedExam) return;
    
    if (!answerText.trim() && !attachmentUrl) {
      toast.error('Please provide an answer or upload a file');
      return;
    }

    setSubmitting(true);
    try {
      const result = await api.studentExams.submitExam(selectedExam.examId, {
        answerText: answerText.trim(),
        attachmentUrl: attachmentUrl,
        fileName: attachmentFile?.name || null
      });

      if (result) {
        toast.success('Exam submitted successfully!');
        loadExams(); // Refresh exams list
        setSelectedExam(null);
        setAnswerText('');
        setAttachmentFile(null);
        setAttachmentUrl('');
      }
    } catch (error) {
      console.error('Error submitting exam:', error);
      toast.error('Failed to submit exam');
    } finally {
      setSubmitting(false);
    }
  };

  const upcomingExams = exams.filter(e => {
    const examDateTime = new Date(e.date);
    const [hours, minutes] = (e.startTime || '00:00').split(':');
    examDateTime.setHours(parseInt(hours), parseInt(minutes), 0);
    return new Date() < examDateTime && e.status !== 'Completed';
  });

  const ongoingExams = exams.filter(e => {
    const now = new Date();
    const examDateTime = new Date(e.date);
    const [hours, minutes] = (e.startTime || '00:00').split(':');
    examDateTime.setHours(parseInt(hours), parseInt(minutes), 0);
    const examEndTime = new Date(examDateTime);
    examEndTime.setMinutes(examEndTime.getMinutes() + parseInt(e.duration?.split(':')[0] || 0) * 60 + parseInt(e.duration?.split(':')[1] || 0));
    return now >= examDateTime && now <= examEndTime;
  });

  const pastExams = exams.filter(e => {
    const examDateTime = new Date(e.date);
    const [hours, minutes] = (e.startTime || '00:00').split(':');
    examDateTime.setHours(parseInt(hours), parseInt(minutes), 0);
    const examEndTime = new Date(examDateTime);
    examEndTime.setMinutes(examEndTime.getMinutes() + parseInt(e.duration?.split(':')[0] || 0) * 60 + parseInt(e.duration?.split(':')[1] || 0));
    return new Date() > examEndTime;
  });

  const filteredExams = {
    upcoming: upcomingExams,
    ongoing: ongoingExams,
    past: pastExams
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-12rem)]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-500">Loading exams...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Button variant="ghost" onClick={() => navigate('/student/dashboard')} className="mb-2 -ml-2">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        <div className="flex items-center gap-3 mb-2">
          <FileText className="h-7 w-7 text-indigo-600" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Exams</h1>
        </div>
        <p className="text-gray-500 dark:text-gray-400">View and submit your exams</p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="upcoming" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="upcoming">Upcoming ({upcomingExams.length})</TabsTrigger>
          <TabsTrigger value="ongoing">Ongoing ({ongoingExams.length})</TabsTrigger>
          <TabsTrigger value="past">Past ({pastExams.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          {renderExamList(filteredExams.upcoming)}
        </TabsContent>
        <TabsContent value="ongoing" className="space-y-4">
          {renderExamList(filteredExams.ongoing)}
        </TabsContent>
        <TabsContent value="past" className="space-y-4">
          {renderExamList(filteredExams.past)}
        </TabsContent>
      </Tabs>

      {/* Exam Details Modal */}
      {selectedExam && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <CardHeader className="sticky top-0 bg-white dark:bg-gray-800 z-10">
              <div className="flex items-center justify-between">
                <CardTitle>{selectedExam.name}</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setSelectedExam(null)}>✕</Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Exam Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <p className="text-xs text-gray-500">Subject</p>
                  <p className="text-sm font-medium">{selectedExam.subjectName}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Teacher</p>
                  <p className="text-sm font-medium">{selectedExam.teacherName}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Date & Time</p>
                  <p className="text-sm font-medium">{formatDate(selectedExam.date)} at {selectedExam.startTime}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Duration</p>
                  <p className="text-sm font-medium">{selectedExam.duration} hours</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Max Score</p>
                  <p className="text-sm font-medium">{selectedExam.maxScore}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Passing Score</p>
                  <p className="text-sm font-medium">{selectedExam.passingScore}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Room</p>
                  <p className="text-sm font-medium">{selectedExam.room || 'Not specified'}</p>
                </div>
              </div>

              {/* Instructions */}
              {selectedExam.instructions && (
                <div>
                  <h3 className="font-semibold mb-2">Instructions</h3>
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-sm whitespace-pre-wrap">{selectedExam.instructions}</p>
                  </div>
                </div>
              )}

              {/* Materials */}
              {selectedExam.materials?.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Exam Materials</h3>
                  <div className="space-y-2">
                    {selectedExam.materials.map((material, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="flex items-center gap-3">
                          {getFileIcon(material.fileType)}
                          <span className="text-sm">{material.name}</span>
                        </div>
                        <Button size="sm" variant="outline" onClick={() => handleViewMaterial(material)}>
                          <Eye className="h-4 w-4 mr-1" /> View
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* My Submission (if already submitted) */}
              {selectedExam.mySubmission && (
                <div>
                  <h3 className="font-semibold mb-2">My Submission</h3>
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      {getSubmissionStatusBadge(selectedExam.mySubmission.status)}
                      <span className="text-sm text-gray-500">Submitted: {new Date(selectedExam.mySubmission.submittedAt).toLocaleString()}</span>
                    </div>
                    {selectedExam.mySubmission.score && (
                      <p className="text-sm">Score: <span className="font-bold">{selectedExam.mySubmission.score} / {selectedExam.maxScore}</span></p>
                    )}
                    {selectedExam.mySubmission.feedback && (
                      <p className="text-sm mt-2">Feedback: {selectedExam.mySubmission.feedback}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Submit Section (if not submitted and exam is ongoing/upcoming) */}
              {!selectedExam.mySubmission && (
                <div className="space-y-4">
                  <h3 className="font-semibold">Submit Your Answer</h3>
                  
                  {/* Answer Text */}
                  <div>
                    <label className="block text-sm font-medium mb-1">Answer (Optional if uploading file)</label>
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
                      />
                      {uploading && <Loader2 className="h-5 w-5 animate-spin" />}
                    </div>
                    {attachmentUrl && (
                      <p className="text-sm text-green-600 mt-1">✓ File uploaded successfully</p>
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
      )}
    </div>
  );

  function renderExamList(examsList) {
    if (examsList.length === 0) {
      return (
        <Card>
          <CardContent className="p-12 text-center text-gray-500">
            <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No exams found</p>
          </CardContent>
        </Card>
      );
    }

    return examsList.map((exam) => {
      const status = getExamStatusBadge(exam.status, exam.date, exam.startTime, exam.duration);
      return (
        <Card key={exam.examId} className="hover:shadow-md transition-shadow">
          <CardContent className="p-5">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <Badge className={status.color}>
                    {status.icon}
                    {status.label}
                  </Badge>
                  {exam.mySubmission && getSubmissionStatusBadge(exam.mySubmission.status)}
                </div>
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-1">{exam.name}</h3>
                <p className="text-sm text-gray-500 mb-2">{exam.subjectName} • {exam.teacherName}</p>
                <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1"><Calendar className="h-3 w-3" />{formatDate(exam.date)}</div>
                  <div className="flex items-center gap-1"><Clock className="h-3 w-3" />{exam.startTime} ({exam.duration})</div>
                  <div className="flex items-center gap-1"><FileText className="h-3 w-3" />Score: {exam.maxScore}</div>
                </div>
              </div>
           
           <Button onClick={() => navigate(`/student/exams/${exam.examId}`)} variant={exam.mySubmission ? 'outline' : 'default'}>
                   {exam.mySubmission ? 'View Submission' : (status.label === 'Ongoing' ? 'Take Exam' : 'View Details')}
        </Button>
            </div>
          </CardContent>
        </Card>
      );
    });
  }
}