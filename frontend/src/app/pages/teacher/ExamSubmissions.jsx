import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import {
  ArrowLeft, Search, CheckCircle, Clock,
  BarChart, Loader2, Send, ChevronDown, ChevronUp, FileText, Eye
} from 'lucide-react';
import { toast } from 'sonner';

const API = "https://localhost:7179/api";

export function ExamSubmissions() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [submissions, setSubmissions] = useState([]);
  const [stats, setStats] = useState({ total: 0, graded: 0, pending: 0 });
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [grades, setGrades] = useState({});         // { submissionId: { score, remarks } }
  const [submitting, setSubmitting] = useState({});  // { submissionId: bool }

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      // 1️⃣ بيانات الامتحان
      const examRes = await fetch(`${API}/Exams/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const examData = await examRes.json();
      setExam(examData.data);

      // 2️⃣ GET /api/Exams/{oid}/submissions — كل الطلاب اللي بعتوا
      const subRes = await fetch(`${API}/Exams/${id}/submissions`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const subData = await subRes.json();

      const list = subData.data?.submissions || subData.data || [];
      setSubmissions(list);
      setStats({
        total: subData.data?.total ?? list.length,
        graded: subData.data?.graded ?? list.filter(s => s.status === 'Graded').length,
        pending: subData.data?.pending ?? list.filter(s => s.status !== 'Graded').length,
      });

      // تهيئة grades الموجودة
      const initGrades = {};
      list.forEach(s => {
        initGrades[s.submissionId] = {
          score: s.score?.toString() || '',
          remarks: s.feedback || ''
        };
      });
      setGrades(initGrades);

    } catch (error) {
      console.error(error);
      toast.error('Failed to load submissions');
    } finally {
      setLoading(false);
    }
  };

  const handleGradeChange = (submissionId, field, value) => {
    setGrades(prev => ({
      ...prev,
      [submissionId]: { ...prev[submissionId], [field]: value }
    }));
  };

  const handleSubmitGrade = async (submission) => {
    const sid = submission.submissionId;
    const scoreVal = grades[sid]?.score;
    const remarks = grades[sid]?.remarks || '';
    const maxScore = exam?.maxScore || exam?.totalMarks || 100;

    if (!scoreVal && scoreVal !== 0) {
      toast.error('Please enter a score');
      return;
    }
    const scoreNum = parseFloat(scoreVal);
    if (isNaN(scoreNum) || scoreNum < 0 || scoreNum > maxScore) {
      toast.error(`Score must be between 0 and ${maxScore}`);
      return;
    }

    setSubmitting(prev => ({ ...prev, [sid]: true }));
    try {
      const token = localStorage.getItem("token");

      // POST /api/Exams/{oid}/results
      // body: { examOid, studentOid, score, remarks }
      const res = await fetch(`${API}/Exams/${id}/results`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          examOid: id,
          studentOid: submission.studentId,  // من الـ submissions response
          score: scoreNum,
          remarks: remarks.trim() || null
        })
      });

      if (res.ok) {
        toast.success(`Grade saved for ${submission.studentName}`);
        setSubmissions(prev =>
          prev.map(s =>
            s.submissionId === sid
              ? { ...s, status: 'Graded', score: scoreNum, feedback: remarks }
              : s
          )
        );
        setStats(prev => ({
          ...prev,
          graded: prev.graded + (submission.status !== 'Graded' ? 1 : 0),
          pending: Math.max(0, prev.pending - (submission.status !== 'Graded' ? 1 : 0)),
        }));
        setExpandedId(null);
      } else {
        const err = await res.json();
        toast.error(err?.messages?.EN || err?.message || 'Failed to save grade');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to save grade');
    } finally {
      setSubmitting(prev => ({ ...prev, [sid]: false }));
    }
  };

  const handleViewAttachment = (url) => {
    if (!url) { toast.error('No attachment'); return; }
    window.open(url.startsWith('http') ? url : `https://localhost:7179${url}`, '_blank');
  };

  const filteredSubmissions = submissions.filter(s =>
    s.studentName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const avgScore = stats.graded > 0
    ? submissions.filter(s => s.score !== null && s.score !== undefined)
        .reduce((acc, s) => acc + s.score, 0) / stats.graded
    : 0;

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
      <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
      <p className="text-slate-500">Loading submissions...</p>
    </div>
  );

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate(`/teacher/exams/${id}`)}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">Submissions: {exam?.name}</h1>
          <p className="text-gray-500 mt-1">{exam?.className}</p>
        </div>
        <Button
          className="bg-indigo-600 hover:bg-indigo-700"
          onClick={() => navigate(`/teacher/exams/${id}/grades`)}
        >
          <BarChart className="h-4 w-4 mr-2" /> Grades Report
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total', val: stats.total, color: 'text-slate-700' },
          { label: 'Graded', val: stats.graded, color: 'text-green-600' },
          { label: 'Pending', val: stats.pending, color: 'text-orange-500' },
          { label: 'Avg. Score', val: avgScore.toFixed(1), color: 'text-blue-600' },
        ].map((s, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <p className="text-sm text-slate-400 font-medium">{s.label}</p>
              <p className={`text-2xl font-black mt-1 ${s.color}`}>{s.val}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Search students..."
          className="pl-10"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Submissions List */}
      {filteredSubmissions.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center text-slate-400">
            No submissions yet
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredSubmissions.map(submission => {
            const sid = submission.submissionId;
            const isExpanded = expandedId === sid;
            const isGraded = submission.status === 'Graded';
            const currentGrade = grades[sid] || { score: '', remarks: '' };
            const maxScore = exam?.maxScore || exam?.totalMarks || 100;

            return (
              <Card key={sid} className={`transition-all duration-200 ${isExpanded ? 'ring-2 ring-indigo-400' : ''}`}>
                {/* Row */}
                <div
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg select-none"
                  onClick={() => setExpandedId(prev => prev === sid ? null : sid)}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-700">
                      {(submission.studentName || 'S')[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">{submission.studentName}</p>
                      <p className="text-xs text-slate-500">
                        Submitted: {submission.submittedAt ? new Date(submission.submittedAt).toLocaleString() : 'N/A'}
                        {isGraded && submission.score !== null &&
                          <span className="ml-2 font-bold text-indigo-600">· Score: {submission.score}/{maxScore}</span>
                        }
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {isGraded
                      ? <Badge className="bg-green-100 text-green-800 border-0"><CheckCircle className="h-3 w-3 mr-1" />Graded</Badge>
                      : <Badge className="bg-orange-100 text-orange-800 border-0"><Clock className="h-3 w-3 mr-1" />Pending</Badge>
                    }
                    {isExpanded ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
                  </div>
                </div>

                {/* Grading Panel */}
                {isExpanded && (
                  <CardContent className="border-t dark:border-slate-700 pt-4 space-y-4">

                    {/* Answer */}
                    {submission.answerText && (
                      <div>
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Student's Answer</p>
                        <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg text-sm whitespace-pre-wrap">
                          {submission.answerText}
                        </div>
                      </div>
                    )}

                    {/* Attachment */}
                    {submission.attachmentUrl && (
                      <div>
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Attached File</p>
                        <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-indigo-500" />
                            <span className="text-sm">{submission.fileName || submission.attachmentUrl.split('/').pop()}</span>
                          </div>
                          <Button size="sm" variant="outline" onClick={() => handleViewAttachment(submission.attachmentUrl)}>
                            <Eye className="h-3 w-3 mr-1" /> View
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Score & Remarks */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <Label className="text-sm font-medium">
                          Score <span className="text-red-500">*</span>
                          <span className="text-slate-400 font-normal"> / {maxScore}</span>
                        </Label>
                        <Input
                          type="number"
                          min="0"
                          max={maxScore}
                          step="0.5"
                          value={currentGrade.score}
                          onChange={e => handleGradeChange(sid, 'score', e.target.value)}
                          placeholder={`0 – ${maxScore}`}
                          className="text-center font-bold text-lg"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-sm font-medium">
                          Remarks <span className="text-slate-400 font-normal">(optional)</span>
                        </Label>
                        <Input
                          value={currentGrade.remarks}
                          onChange={e => handleGradeChange(sid, 'remarks', e.target.value)}
                          placeholder="e.g. Pass / Fail / Excellent"
                        />
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => setExpandedId(null)}>
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleSubmitGrade(submission)}
                        disabled={submitting[sid] || !currentGrade.score}
                        className="bg-indigo-600 hover:bg-indigo-700 gap-1"
                      >
                        {submitting[sid]
                          ? <Loader2 className="h-3 w-3 animate-spin" />
                          : <Send className="h-3 w-3" />
                        }
                        {isGraded ? 'Update Grade' : 'Save Grade'}
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