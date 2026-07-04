// pages/teacher/HomeworkGradeSubmission.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import {
  ArrowLeft,
  Download,
  Eye,
  FileText,
  User,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
  Send,
  ChevronDown,
  ChevronUp,
  Users,
  Award
} from 'lucide-react';
import { toast } from 'sonner';
import { api } from '../../lib/api';

export function HomeworkGradeSubmission() {
  const navigate = useNavigate();
  const { homeworkId } = useParams();

  const [loading, setLoading] = useState(true);
  const [homework, setHomework] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [grades, setGrades] = useState({});       // { submissionId: { grade, feedback } }
  const [submitting, setSubmitting] = useState({}); // { submissionId: bool }

  useEffect(() => {
    loadData();
  }, [homeworkId]);

  const loadData = async () => {
    setLoading(true);
    try {
      // جلب تفاصيل الواجب
      const hwRes = await api.homeworks.getById(homeworkId);
      const hwData = hwRes?.data || hwRes;
      setHomework(hwData);

      // تحذير في الـ console لو الدرجة الكلية صفر أو مش موجودة
      if (!hwData?.totalMarks || hwData.totalMarks <= 0) {
        console.warn('⚠️ هذا الواجب ليس له Total Marks محددة بشكل صحيح:', hwData?.totalMarks);
      }

      // جلب كل التقديمات
      const subRes = await api.homeworks.getSubmissions(homeworkId);
      const list = subRes?.data || subRes || [];
      setSubmissions(Array.isArray(list) ? list : []);

      // تهيئة grades من البيانات الموجودة (لو الطالب اتصحح قبل كده)
      const initialGrades = {};
      (Array.isArray(list) ? list : []).forEach(s => {
        const sid = s.id || s.submissionId;
        initialGrades[sid] = {
          grade: s.grade?.toString() || '',
          feedback: s.feedback || ''
        };
      });
      setGrades(initialGrades);
    } catch (err) {
      console.error('Error loading data:', err);
      toast.error('Failed to load submissions');
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (sid) => {
    setExpandedId(prev => (prev === sid ? null : sid));
  };

  const handleGradeChange = (sid, field, value) => {
    setGrades(prev => ({
      ...prev,
      [sid]: { ...prev[sid], [field]: value }
    }));
  };

  // ✅ دالة موحّدة لحساب الدرجة القصوى الحقيقية (مش fallback وهمي زي 100)
  const getMaxMarks = (submission) => {
    if (homework?.totalMarks && homework.totalMarks > 0) {
      return homework.totalMarks;
    }
    if (submission?.maxGrade && submission.maxGrade > 0) {
      return submission.maxGrade;
    }
    return null; // مفيش درجة كلية محددة فعليًا
  };

  const handleSubmitGrade = async (submission) => {
    const sid = submission.id || submission.submissionId;
    const gradeVal = grades[sid]?.grade;
    const feedbackVal = grades[sid]?.feedback || '';
    const maxMarks = getMaxMarks(submission);

    // ✅ منع التصحيح لو مفيش Total Marks أصلاً (بدل ما السيرفر يرفض الطلب بـ 400)
    if (maxMarks === null) {
      toast.error('لا يمكن رصد الدرجة: لم يتم تحديد الدرجة الكلية لهذا الواجب. برجاء تعديل الواجب أولاً.');
      return;
    }

    if (!gradeVal && gradeVal !== 0) {
      toast.error('Please enter a grade');
      return;
    }
    const gradeNum = parseFloat(gradeVal);
    if (isNaN(gradeNum) || gradeNum < 0 || gradeNum > maxMarks) {
      toast.error(`Grade must be between 0 and ${maxMarks}`);
      return;
    }

    setSubmitting(prev => ({ ...prev, [sid]: true }));
    try {
      // POST /api/Homeworks/{homeworkId}/grade
      // body: { submissionId, grade, feedback }
      const result = await api.homeworks.gradeSubmission(homeworkId, {
        submissionId: sid,
        grade: gradeNum,
        feedback: feedbackVal.trim() || null
      });

      if (result.ok) {
        toast.success(`Grade saved for ${submission.studentName || submission.student?.name || 'student'}`);
        // تحديث الـ status في الـ list محلياً
        setSubmissions(prev =>
          prev.map(s =>
            (s.id || s.submissionId) === sid
              ? { ...s, grade: gradeNum, feedback: feedbackVal, status: 'graded' }
              : s
          )
        );
        setExpandedId(null);
      } else {
        // ✅ عرض رسالة الخطأ الحقيقية الراجعة من الباك إند (errors array)
        const serverMsg =
          result.data?.errors?.[0] ||
          result.data?.message ||
          result.data?.messages?.EN ||
          'Failed to submit grade';
        toast.error(serverMsg);
        console.error('Grade submission error details:', result.data);
      }
    } catch (err) {
      console.error('Error grading:', err);
      toast.error('Failed to submit grade');
    } finally {
      setSubmitting(prev => ({ ...prev, [sid]: false }));
    }
  };

  const handleViewAttachment = (url) => {
    if (!url) { toast.error('No attachment'); return; }
    const base = 'http://edusmarrt.runasp.net';
    window.open(url.startsWith('http') ? url : `${base}${url}`, '_blank');
  };

  const formatDate = (d) => {
    if (!d) return 'N/A';
    return new Date(d).toLocaleString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  const getStatusBadge = (status, isLate, grade) => {
    if (grade !== null && grade !== undefined && grade !== '') {
      return <Badge className="bg-blue-100 text-blue-800 border-0"><CheckCircle className="h-3 w-3 mr-1" />Graded ({grade})</Badge>;
    }
    if (isLate) {
      return <Badge className="bg-orange-100 text-orange-800 border-0"><Clock className="h-3 w-3 mr-1" />Late</Badge>;
    }
    switch (status?.toLowerCase()) {
      case 'submitted':
        return <Badge className="bg-green-100 text-green-800 border-0"><CheckCircle className="h-3 w-3 mr-1" />Submitted</Badge>;
      case 'graded':
        return <Badge className="bg-blue-100 text-blue-800 border-0"><CheckCircle className="h-3 w-3 mr-1" />Graded</Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  // Stats
  const gradedCount = submissions.filter(s => s.status === 'graded' || (s.grade !== null && s.grade !== undefined)).length;
  const pendingCount = submissions.length - gradedCount;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
        <p className="text-slate-500">Loading submissions...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      {/* Back */}
      <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
        <ArrowLeft className="h-4 w-4 mr-2" /> Back
      </Button>

      {/* ✅ تحذير لو الواجب مفيهوش Total Marks صحيحة */}
      {(!homework?.totalMarks || homework.totalMarks <= 0) && (
        <Card className="border-red-300 bg-red-50 dark:bg-red-950/30">
          <CardContent className="p-4 flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />
            <p className="text-sm text-red-700 dark:text-red-300">
              هذا الواجب ليس له "درجة كلية" محددة بشكل صحيح (Total Marks = 0). لن تتمكن من رصد أي درجة حتى يتم تعديل الواجب وتحديد الدرجة الكلية الصحيحة.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Homework Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {homework?.title || 'Homework'}
              </h1>
              <p className="text-gray-500 mt-1">
                {homework?.subjectName || ''} {homework?.dueDate ? `· Due ${new Date(homework.dueDate).toLocaleDateString()}` : ''}
              </p>
            </div>
            {/* Stats */}
            <div className="flex gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-indigo-600">{submissions.length}</p>
                <p className="text-xs text-gray-500 flex items-center gap-1"><Users className="h-3 w-3" />Total</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{gradedCount}</p>
                <p className="text-xs text-gray-500 flex items-center gap-1"><Award className="h-3 w-3" />Graded</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-500">{pendingCount}</p>
                <p className="text-xs text-gray-500 flex items-center gap-1"><Clock className="h-3 w-3" />Pending</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submissions List */}
      {submissions.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No submissions yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {submissions.map((submission) => {
            const sid = submission.id || submission.submissionId;
            const isExpanded = expandedId === sid;
            const maxMarks = getMaxMarks(submission);
            const currentGrade = grades[sid] || { grade: '', feedback: '' };
            const isGraded = submission.status === 'graded' || (submission.grade !== null && submission.grade !== undefined);

            return (
              <Card key={sid} className={`transition-all duration-200 ${isExpanded ? 'ring-2 ring-indigo-400' : ''}`}>
                {/* Student Row — clickable to expand */}
                <div
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 rounded-t-lg select-none"
                  onClick={() => toggleExpand(sid)}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center shrink-0">
                      <span className="font-bold text-indigo-600 dark:text-indigo-300 text-sm">
                        {(submission.studentName || submission.student?.name || 'S')[0].toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {submission.studentName || submission.student?.name || 'Student'}
                      </p>
                      <p className="text-xs text-gray-500">
                        Submitted: {formatDate(submission.submittedAt)}
                        {submission.isLate && <span className="ml-2 text-orange-500 font-medium">· Late</span>}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {getStatusBadge(submission.status, submission.isLate, isGraded ? submission.grade : null)}
                    {isExpanded
                      ? <ChevronUp className="h-4 w-4 text-gray-400" />
                      : <ChevronDown className="h-4 w-4 text-gray-400" />
                    }
                  </div>
                </div>

                {/* Expanded Grading Panel */}
                {isExpanded && (
                  <CardContent className="border-t dark:border-gray-700 pt-4 space-y-5">

                    {/* Student's Answer */}
                    {(submission.content || submission.answerText || submission.submissionText) && (
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Student's Answer</p>
                        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                          {submission.content || submission.answerText || submission.submissionText}
                        </div>
                      </div>
                    )}

                    {/* Attachment */}
                    {submission.attachmentUrl && (
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Attached File</p>
                        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-indigo-500" />
                            <span className="text-sm">{submission.attachmentUrl.split('/').pop()}</span>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => handleViewAttachment(submission.attachmentUrl)}>
                              <Eye className="h-3 w-3 mr-1" /> View
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Grade & Feedback */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <Label className="text-sm font-medium">
                          Grade <span className="text-red-500">*</span>
                          <span className="text-gray-400 font-normal"> / {maxMarks ?? '—'}</span>
                        </Label>
                        {maxMarks === null ? (
                          <p className="text-xs text-red-500 pt-1">
                            لم يتم تحديد الدرجة الكلية لهذا الواجب. عدّل الواجب أولاً.
                          </p>
                        ) : (
                          <Input
                            type="number"
                            min="0"
                            max={maxMarks}
                            step="0.5"
                            value={currentGrade.grade}
                            onChange={e => handleGradeChange(sid, 'grade', e.target.value)}
                            placeholder={`0 – ${maxMarks}`}
                            className="text-center font-bold text-lg w-full"
                          />
                        )}
                      </div>
                      <div className="space-y-1">
                        <Label className="text-sm font-medium">Feedback <span className="text-gray-400 font-normal">(optional)</span></Label>
                        <Textarea
                          value={currentGrade.feedback}
                          onChange={e => handleGradeChange(sid, 'feedback', e.target.value)}
                          placeholder="Write feedback..."
                          rows={3}
                          className="resize-none text-sm"
                        />
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-2 pt-1">
                      <Button variant="outline" size="sm" onClick={() => setExpandedId(null)}>
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleSubmitGrade(submission)}
                        disabled={submitting[sid] || !currentGrade.grade || maxMarks === null}
                        className="bg-indigo-600 hover:bg-indigo-700 gap-1"
                      >
                        {submitting[sid]
                          ? <Loader2 className="h-3 w-3 animate-spin" />
                          : <Send className="h-3 w-3" />
                        }
                        {isGraded ? 'Update Grade' : 'Submit Grade'}
                      </Button>
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}