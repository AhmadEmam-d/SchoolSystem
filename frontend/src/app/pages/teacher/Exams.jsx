import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { 
  Plus, Search, Calendar, CheckCircle, FileText, 
  Users, Edit, Trash2, Eye, Loader2, Clock, TrendingUp 
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { api } from '../../lib/api';
import { toast } from 'sonner';

export function TeacherExams() {
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // جلب البيانات عند تحميل الصفحة
  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      setLoading(true);
      const data = await api.exams.getTeacherExams();
      setExams(data || []);
    } catch (error) {
      console.error("Error fetching exams:", error);
      toast.error("Failed to fetch exams");
    } finally {
      setLoading(false);
    }
  };

  // منطق الحذف
  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        const result = await api.exams.delete(id);
        if (result.success) {
          toast.success("Exam deleted successfully");
          setExams(exams.filter(exam => exam.oid !== id));
        } else {
          toast.error("Failed to delete exam");
        }
      } catch (error) {
        toast.error("Error connecting to server");
      }
    }
  };

  // حساب الإحصائيات
  const stats = {
    total: exams.length,
    upcoming: exams.filter(e => new Date(e.date) >= new Date().setHours(0,0,0,0)).length,
    completed: exams.filter(e => new Date(e.date) < new Date().setHours(0,0,0,0)).length
  };

  // تصفية البحث
  const filteredExams = exams.filter(exam =>
    exam.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Exams & Assessments</h1>
          <p className="text-muted-foreground">Manage and track your student assessments</p>
        </div>
        <Button 
          onClick={() => navigate('/teacher/exams/add')} 
          className="bg-indigo-600 hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Exam
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatSummaryCard 
          title="Total Exams" 
          value={stats.total} 
          icon={<FileText className="h-6 w-6 text-blue-600" />} 
          bgColor="bg-blue-100" 
        />
        <StatSummaryCard 
          title="Upcoming" 
          value={stats.upcoming} 
          icon={<Calendar className="h-6 w-6 text-purple-600" />} 
          bgColor="bg-purple-100" 
        />
        <StatSummaryCard 
          title="Completed" 
          value={stats.completed} 
          icon={<CheckCircle className="h-6 w-6 text-green-600" />} 
          bgColor="bg-green-100" 
        />
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search exams by name..." 
          className="pl-10 h-11"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Exams Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="animate-spin h-10 w-10 text-indigo-600 mb-2" />
          <p className="text-muted-foreground">Loading exams...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExams.map((exam) => {
            const isCompleted = new Date(exam.date) < new Date().setHours(0,0,0,0);
            
            return (
              <Card key={exam.oid} className="overflow-hidden hover:shadow-lg transition-all border-l-4 border-l-indigo-500">
                <CardHeader className="pb-3 flex flex-row items-start justify-between space-y-0">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="font-semibold">{exam.className || 'General'}</Badge>
                      <Badge className={!isCompleted ? "bg-blue-100 text-blue-700 hover:bg-blue-100" : "bg-gray-100 text-gray-700 hover:bg-gray-100"}>
                        {!isCompleted ? "Upcoming" : "Completed"}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl mt-2 line-clamp-1">{exam.name}</CardTitle>
                  </div>
                  <div className="flex gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-muted-foreground hover:text-indigo-600"
                      onClick={() => navigate(`/teacher/exams/edit/${exam.oid}`)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-red-500 hover:bg-red-50"
                      onClick={() => handleDelete(exam.oid, exam.name)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="pb-4">
                  <div className="grid grid-cols-2 gap-y-4 text-sm text-muted-foreground mb-6">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-indigo-500" />
                      {new Date(exam.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-indigo-500" />
                      {exam.startTime?.substring(0, 5) || "00:00"}
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-indigo-500" />
                      {exam.studentCount || 0} Students
                    </div>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-indigo-500" />
                      {exam.maxScore} Marks
                    </div>
                  </div>

                <div className="flex flex-col gap-2">
  {/* الصف الأول */}
  <div className="flex gap-2">
    <Button 
      className="flex-1" 
      variant="outline"
      onClick={() => navigate(`/teacher/exams/${exam.oid}`)}
    >
      <Eye className="h-4 w-4 mr-2" />
      Details
    </Button>

      {isCompleted && (
    <Button 
      className="w-full bg-green-600 hover:bg-green-700 text-white"
      onClick={() => navigate(`/teacher/exams/${exam.oid}/submissions`)}
    >
      <TrendingUp className="h-4 w-4 mr-2" />
      Submissions
    </Button>
  )}
  </div>

  {/* الصف التاني */}
  {isCompleted && (
    <Button 
      className="w-full bg-green-600 hover:bg-green-700 text-white"
      onClick={() => navigate(`/teacher/exams/${exam.oid}/grades`)}
    >
      <TrendingUp className="h-4 w-4 mr-2" />
      Grades
    </Button>
  )}
</div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {!loading && filteredExams.length === 0 && (
        <div className="text-center py-20 bg-gray-50 rounded-xl border-2 border-dashed">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
          <h3 className="text-lg font-medium">No exams found</h3>
          <p className="text-muted-foreground">Try adjusting your search or create a new exam.</p>
        </div>
      )}
    </div>
  );
}

// مكون فرعي لكروت الإحصائيات لجعل الكود أنظف
function StatSummaryCard({ title, value, icon, bgColor }) {
  return (
    <Card>
      <CardContent className="pt-6 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-bold">{value}</h3>
        </div>
        <div className={`h-12 w-12 ${bgColor} rounded-full flex items-center justify-center`}>
          {icon}
        </div>
      </CardContent>
    </Card>
  );
}