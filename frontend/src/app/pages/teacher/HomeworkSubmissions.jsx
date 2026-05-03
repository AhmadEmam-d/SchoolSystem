import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { ArrowLeft, Download, Search, CheckCircle, XCircle, Clock, FileText, Loader2, UserCheck, AlertCircle } from 'lucide-react';
import { api } from '../../lib/api';
import { toast } from 'sonner';

export function HomeworkSubmissions() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [submissions, setSubmissions] = useState([]);
  const [stats, setStats] = useState({ total: 0, submitted: 0, graded: 0, late: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await api.homeworks.getSubmissions(id);
        if (res.success) {
          const data = res.data || [];
          setSubmissions(data);
          
          // حساب الإحصائيات ديناميكياً من البيانات الراجعة
          setStats({
            total: data.length,
            submitted: data.filter(s => s.status !== 'Pending').length,
            graded: data.filter(s => s.status === 'Graded').length,
            late: data.filter(s => s.isLate).length
          });
        }
      } catch (error) {
        toast.error("Failed to load submissions");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleDownload = (url, studentName) => {
    if (!url) return toast.error("No file attached");
    window.open(url, '_blank');
    toast.success(`Opening submission for ${studentName}`);
  };

  const filteredSubmissions = submissions.filter(sub =>
    sub.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.studentEmail?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status, isLate) => {
    if (isLate) return <Badge className="bg-orange-100 text-orange-800 rounded-lg"><Clock className="h-3 w-3 mr-1" /> Late</Badge>;
    
    switch (status) {
      case 'Graded':
        return <Badge className="bg-blue-100 text-blue-800 rounded-lg"><CheckCircle className="h-3 w-3 mr-1" /> Graded</Badge>;
      case 'Submitted':
        return <Badge className="bg-green-100 text-green-800 rounded-lg"><UserCheck className="h-3 w-3 mr-1" /> Submitted</Badge>;
      default:
        return <Badge className="bg-slate-100 text-slate-500 rounded-lg"><XCircle className="h-3 w-3 mr-1" /> Pending</Badge>;
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <Loader2 className="h-10 w-10 animate-spin text-indigo-600 mb-4" />
      <p className="text-slate-500 animate-pulse">Fetching submissions...</p>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate(`/teacher/homework/${id}`)}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-black text-gray-900">Student Submissions</h1>
          <p className="text-gray-500 mt-1 uppercase text-xs font-bold tracking-widest">Assignment ID: {id.split('-')[0]}...</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Students', val: stats.total, icon: FileText, color: 'text-slate-600' },
          { label: 'Submitted', val: stats.submitted, icon: UserCheck, color: 'text-emerald-600' },
          { label: 'Late', val: stats.late, icon: Clock, color: 'text-orange-600' },
          { label: 'Graded', val: stats.graded, icon: CheckCircle, color: 'text-blue-600' }
        ].map((stat, i) => (
          <Card key={i} className="border-none shadow-sm rounded-2xl">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">{stat.label}</p>
                <p className={`text-2xl font-black mt-1 ${stat.color}`}>{stat.val}</p>
              </div>
              <stat.icon className={`h-8 w-8 opacity-20 ${stat.color}`} />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search & Actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search by name or email..."
            className="pl-10 h-11 rounded-xl border-slate-200 focus:ring-2 focus:ring-indigo-500 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" className="rounded-xl h-11 font-bold border-slate-200 w-full sm:w-auto">
          Export as Excel
        </Button>
      </div>

      {/* Submissions Table */}
      <Card className="border-none shadow-xl rounded-[2rem] overflow-hidden">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100">
          <CardTitle className="text-lg">Submissions Log</CardTitle>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50/30">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">Student</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">Date Submitted</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">Grade</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-slate-400 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredSubmissions.length > 0 ? (
                filteredSubmissions.map((submission) => (
                  <tr key={submission.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-700">
                          {submission.studentName[0]}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{submission.studentName}</p>
                          <p className="text-xs text-slate-500 font-medium">{submission.studentEmail}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(submission.status, submission.isLate)}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 font-medium">
                      {submission.submittedAt ? new Date(submission.submittedAt).toLocaleString() : '---'}
                    </td>
                    <td className="px-6 py-4">
                      {submission.grade !== null ? (
                        <span className="font-black text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">
                          {submission.grade}%
                        </span>
                      ) : (
                        <span className="text-slate-300 italic text-sm font-medium">Pending Grade</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {submission.attachmentUrl && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-indigo-600 hover:bg-indigo-50 rounded-lg"
                            onClick={() => handleDownload(submission.attachmentUrl, submission.studentName)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        )}
                        <Button 
                          className="bg-slate-900 hover:bg-black text-white rounded-lg h-8 px-4 text-xs font-bold"
                          onClick={() => navigate(`/teacher/homework/grade/${submission.id}`)}
                        >
                          Grade Now
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-20 text-center">
                    <AlertCircle className="h-10 w-10 text-slate-200 mx-auto mb-3" />
                    <p className="text-slate-400 font-bold italic">No submissions found matching your search.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}