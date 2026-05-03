import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { ArrowLeft, Calendar, Clock, FileText, Users, Download, Edit, Loader2, AlertCircle, Eye } from 'lucide-react';
import { api } from '../../lib/api';
import { toast } from 'sonner';

const API_BASE_URL = "https://localhost:7179";

export function HomeworkDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [homework, setHomework] = useState(null);
  const [attachments, setAttachments] = useState([]);
  const [downloading, setDownloading] = useState(null);

  // ================= جلب البيانات والملفات =================
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);

        // 1. جلب بيانات الواجب الأساسية
        const res = await api.homeworks.getById(id);
        if (res.success) {
          setHomework(res.data);
        } else {
          toast.error(res.messages?.Error || "Failed to load details");
        }

        // 2. جلب قائمة الملفات المرفقة
        const fileRes = await fetch(`${API_BASE_URL}/api/Files/Homework/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const fileData = await fileRes.json();
        
        // التعامل مع هيكل البيانات الفعلي
        if (fileData.success && fileData.data) {
          setAttachments(fileData.data);
        } else if (Array.isArray(fileData)) {
          setAttachments(fileData);
        } else {
          setAttachments([]);
        }

      } catch (error) {
        console.error("Fetch error:", error);
        toast.error("Connection error to server");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  // ================= دالة فتح الملف في تاب جديد =================
  const handleOpenAttachment = async (file) => {
    // استخدام المفتاح المناسب للتحميل
    const fileName = file.name;
    const fileUrl = file.fileUrl;
    
    if (!fileName && !fileUrl) {
      console.error("Missing file info:", file);
      toast.error("File information not found");
      return;
    }

    setDownloading(fileName || fileUrl);
    
    try {
      // الطريقة 1: محاولة التحميل باستخدام الـ fileUrl الكامل
      let url = null;
      
      if (fileUrl) {
        // إذا كان fileUrl موجود، نستخدمه مباشرة
        const fullUrl = `${API_BASE_URL}${fileUrl}`;
        console.log("Attempting to open:", fullUrl);
        
        const response = await fetch(fullUrl, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        
        if (response.ok) {
          const blob = await response.blob();
          url = window.URL.createObjectURL(blob);
        } else {
          throw new Error(`Failed to fetch from URL: ${response.status}`);
        }
      }
      
      // إذا نجحنا في الحصول على URL، نفتح الملف
      if (url) {
        window.open(url, '_blank');
        setTimeout(() => window.URL.revokeObjectURL(url), 1000);
      } else {
        throw new Error("Could not generate file URL");
      }
      
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Could not open file. Please try again later.");
    } finally {
      setDownloading(null);
    }
  };

  // ================= الحصول على أيقونة الملف المناسبة =================
  const getFileIcon = (fileName) => {
    const extension = fileName?.split('.').pop()?.toLowerCase();
    switch(extension) {
      case 'pdf': return '📄';
      case 'doc':
      case 'docx': return '📝';
      case 'xls':
      case 'xlsx': return '📊';
      case 'ppt':
      case 'pptx': return '📽️';
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif': return '🖼️';
      case 'mp4':
      case 'mov': return '🎥';
      default: return '📎';
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <Loader2 className="h-10 w-10 animate-spin text-indigo-600 mb-4" />
      <p className="text-slate-500 animate-pulse">Loading assignment details...</p>
    </div>
  );

  if (!homework) return (
    <div className="text-center py-20">
      <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
      <h2 className="text-xl font-bold">Assignment not found</h2>
      <Button variant="link" onClick={() => navigate('/teacher/homework')}>Go back</Button>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate('/teacher/homework')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
            {homework.title}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Teacher: {homework.teacherName}
          </p>
        </div>
        <Button
          variant="outline"
          className="rounded-xl border-slate-200"
          onClick={() => navigate(`/teacher/homework/${id}/edit`)}
        >
          <Edit className="h-4 w-4 mr-2" />
          Edit
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-none shadow-lg rounded-[2rem] overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100">
              <CardTitle>Assignment Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="flex items-center gap-3">
                <Badge className={`${homework.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'} px-3 py-1 rounded-lg border-none`}>
                  {homework.status}
                </Badge>
                <Badge variant="secondary" className="rounded-lg">Class: {homework.className}</Badge>
                <Badge variant="outline" className="rounded-lg capitalize">{homework.subjectName}</Badge>
              </div>

              <div>
                <h3 className="font-bold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-600 leading-relaxed">{homework.description}</p>
              </div>

              <div>
                <h3 className="font-bold text-gray-900 mb-2">Instructions</h3>
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                  <pre className="text-sm text-gray-600 whitespace-pre-wrap font-sans">
                    {homework.instructions || "No specific instructions provided."}
                  </pre>
                </div>
              </div>

              {/* Attachments Section */}
              {attachments.length > 0 && (
                <div>
                  <h3 className="font-bold text-gray-900 mb-3">Attachments</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {attachments.map((file, index) => {
                      const fileName = file.name;
                      const fileSize = file.fileSize;
                      const fileType = file.fileType;
                      
                      return (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-xl hover:shadow-md transition-all group cursor-pointer"
                          onClick={() => handleOpenAttachment(file)}
                        >
                          <div className="flex items-center gap-3">
                            <div className="bg-indigo-50 p-2 rounded-lg group-hover:bg-indigo-600 transition-colors">
                              <span className="text-xl">
                                {getFileIcon(fileName)}
                              </span>
                            </div>
                            <div className="overflow-hidden">
                              <p className="font-bold text-sm text-gray-900 truncate max-w-[140px]">
                                {fileName}
                              </p>
                              <p className="text-xs text-gray-500">
                                {(fileSize / 1024).toFixed(1)} KB
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenAttachment(file);
                            }}
                            disabled={downloading === fileName}
                          >
                            {downloading === fileName ? (
                              <Loader2 className="h-4 w-4 animate-spin text-indigo-600" />
                            ) : (
                              <Eye className="h-4 w-4 text-slate-500 group-hover:text-indigo-600" />
                            )}
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Stats Card */}
          <Card className="border-none shadow-lg rounded-[2rem]">
            <CardHeader><CardTitle>Overview</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-slate-50">
                <div className="flex items-center gap-2 text-gray-500">
                  <Calendar className="h-4 w-4 text-indigo-500" />
                  <span className="text-sm font-medium">Assigned</span>
                </div>
                <span className="font-bold text-gray-900">{new Date(homework.assignedDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-slate-50">
                <div className="flex items-center gap-2 text-gray-500">
                  <Clock className="h-4 w-4 text-rose-500" />
                  <span className="text-sm font-medium">Due Date</span>
                </div>
                <span className="font-bold text-rose-600">{new Date(homework.dueDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-2 text-gray-500">
                  <Users className="h-4 w-4 text-emerald-500" />
                  <span className="text-sm font-medium">Class Size</span>
                </div>
                <span className="font-bold text-gray-900">{homework.totalStudents}</span>
              </div>
            </CardContent>
          </Card>

          {/* Submissions Section */}
          <Card className="border-none shadow-lg rounded-[2rem] bg-gradient-to-br from-white to-slate-50">
            <CardHeader><CardTitle>Submissions</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center p-6 bg-white rounded-3xl border border-slate-100 shadow-sm">
                <div className="text-4xl font-black text-indigo-600">
                  {homework.submittedCount || 0}/{homework.totalStudents}
                </div>
                <p className="text-sm font-bold text-slate-400 mt-2">Students Submitted</p>
              </div>

              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-indigo-600 h-3 rounded-full transition-all duration-1000"
                  style={{ width: `${((homework.submittedCount || 0) / homework.totalStudents) * 100}%` }}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 text-center">
                  <div className="text-xl font-black text-emerald-600">{homework.gradedCount || 0}</div>
                  <p className="text-[10px] uppercase tracking-wider font-bold text-emerald-700">Graded</p>
                </div>
                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 text-center">
                  <div className="text-xl font-black text-amber-600">{homework.lateCount || 0}</div>
                  <p className="text-[10px] uppercase tracking-wider font-bold text-amber-700">Late</p>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <Button
                  className="w-full bg-indigo-600 hover:bg-indigo-700 rounded-xl h-12 font-bold shadow-lg shadow-indigo-100"
                  onClick={() => navigate(`/teacher/homework/${id}/submissions`)}
                >
                  Manage Submissions
                </Button>
                <Button
                  variant="outline"
                  className="w-full rounded-xl h-12 font-bold border-slate-200 bg-white"
                  onClick={() => navigate(`/teacher/homework/${id}/grades`)}
                >
                  Grade Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}