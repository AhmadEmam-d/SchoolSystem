import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { api } from "../../lib/api";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { toast } from "sonner";
import { 
  FileText, ChevronLeft, Trash2, Settings2, Info, 
  Loader2, Upload, Save, AlertCircle, BookOpen, Users
} from "lucide-react";

const API_BASE_URL = "https://localhost:7179/api";

export const EditHomework = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingFile, setDeletingFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    oid: "",               // مهم جداً
    title: "",
    description: "",
    instructions: "",
    dueDate: "",
    totalMarks: 0,
    submissionType: "Online",
    allowLateSubmissions: true,
    notifyParents: true,
    classId: "",
    subjectId: "",
    className: "",
    subjectName: ""
  });
  
  const [existingAttachments, setExistingAttachments] = useState([]);

  // جلب البيانات
  useEffect(() => {
    const fetchHomework = async () => {
      try {
        setLoading(true);
        const res = await api.homeworks.getById(id);
        
        if (res.success && res.data) {
          const data = res.data;
          setFormData({
            oid: data.oid || data.id || id,   // أخذ oid
            title: data.title || "",
            description: data.description || "",
            instructions: data.instructions || "",
            dueDate: data.dueDate ? data.dueDate.split("T")[0] : "",
            totalMarks: data.totalMarks || 0,
            submissionType: data.submissionType || "Online",
            allowLateSubmissions: data.allowLateSubmissions ?? true,
            notifyParents: data.notifyParents ?? true,
            classId: data.classId || "",
            subjectId: data.subjectId || "",
            className: data.className || data.class?.name || "",
            subjectName: data.subjectName || data.subject?.name || ""
          });
        }
        await fetchAttachments();
      } catch (err) {
        console.error(err);
        toast.error("Failed to load homework data");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchHomework();
  }, [id]);

  const fetchAttachments = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/Files/Homework/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await response.json();
      if (data.success && data.data) {
        setExistingAttachments(data.data);
      }
    } catch (error) {
      console.error("Error fetching attachments:", error);
    }
  };

  const handleDeleteAttachment = async (file) => {
    setDeletingFile(file.name);
    try {
      const response = await fetch(`${API_BASE_URL}/Files/delete/homework/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fileName: file.name })
      });
      if (response.ok) {
        setExistingAttachments(prev => prev.filter(f => f.name !== file.name));
        toast.success("File deleted successfully");
      } else {
        throw new Error("Delete failed");
      }
    } catch (error) {
      toast.error("Could not delete file");
    } finally {
      setDeletingFile(null);
    }
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    setUploading(true);
    const formData = new FormData();
    files.forEach(file => formData.append("files", file));
    try {
      const response = await fetch(`${API_BASE_URL}/Files/upload-multiple/homework/${id}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: formData,
      });
      if (response.ok) {
        toast.success(`${files.length} file(s) uploaded successfully`);
        await fetchAttachments();
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      toast.error("Failed to upload files");
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // التحقق من الحقول الأساسية
    if (!formData.title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!formData.classId) {
      toast.error("Class ID is missing");
      return;
    }
    if (!formData.subjectId) {
      toast.error("Subject ID is missing");
      return;
    }
    if (!formData.dueDate) {
      toast.error("Due date is required");
      return;
    }

    try {
      setSaving(true);

      // بناء البيانات وفقاً لـ DTO المطلوب
      const updateData = {
        oid: formData.oid,                 // مهم جداً: نفس الـ id في الـ URL
        title: formData.title.trim(),
        description: formData.description?.trim() || "",
        instructions: formData.instructions?.trim() || "",
        dueDate: new Date(formData.dueDate).toISOString(),
        totalMarks: Number(formData.totalMarks) || 0,
        submissionType: "Online",          // حسب الـ DTO يجب أن تكون "Online" بحرف O كبير
        allowLateSubmissions: formData.allowLateSubmissions,
        notifyParents: formData.notifyParents,
        classId: formData.classId,
        subjectId: formData.subjectId,
        attachments: existingAttachments.map(att => ({
          fileName: att.name,
          fileUrl: att.fileUrl,
          fileType: att.fileType,
          fileSize: att.fileSize,
        }))
      };

      console.log("Sending update data:", JSON.stringify(updateData, null, 2));

      const response = await fetch(`${API_BASE_URL}/Homeworks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(updateData)
      });

      if (response.ok) {
        toast.success("Homework updated successfully");
        navigate("/teacher/homework");
      } else {
        const errorData = await response.json();
        console.error("Error response:", errorData);
        if (errorData.errors) {
          const errors = Object.values(errorData.errors).flat();
          toast.error(errors[0] || "Validation failed");
        } else {
          toast.error(errorData.title || "Failed to update homework");
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Connection error occurred");
    } finally {
      setSaving(false);
    }
  };

  const getFileIcon = (fileName) => {
    const ext = fileName?.split('.').pop()?.toLowerCase();
    const icons = { 'pdf': '📄', 'doc': '📝', 'docx': '📝', 'xls': '📊', 'xlsx': '📊', 'ppt': '📽️', 'pptx': '📽️', 'jpg': '🖼️', 'jpeg': '🖼️', 'png': '🖼️', 'mp4': '🎥', 'zip': '📦' };
    return icons[ext] || '📎';
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 KB';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <Loader2 className="h-10 w-10 animate-spin text-indigo-600 mb-4" />
      <p className="text-slate-500">Loading...</p>
    </div>
  );

  return (
    <div className="space-y-6 p-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/teacher/homework')}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-black text-gray-900">Edit Homework</h1>
            <p className="text-gray-500 mt-1">Update assignment details</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => navigate('/teacher/homework')}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={saving} className="bg-indigo-600 hover:bg-indigo-700">
            {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-none shadow-lg rounded-[2rem]">
            <CardHeader className="bg-slate-50/50 border-b">
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5 pt-6">
              {/* عرض اسم الكلاس والمادة (وليس الـ ID) */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-4 rounded-xl border border-indigo-100">
                  <div className="flex items-center gap-2 text-indigo-600 mb-2">
                    <Users className="h-4 w-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">Class</span>
                  </div>
                  <p className="font-bold text-gray-900">{formData.className || "Not specified"}</p>
                  <p className="text-xs text-gray-500 mt-1">ID: {formData.classId?.substring(0, 8)}...</p>
                </div>
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-4 rounded-xl border border-emerald-100">
                  <div className="flex items-center gap-2 text-emerald-600 mb-2">
                    <BookOpen className="h-4 w-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">Subject</span>
                  </div>
                  <p className="font-bold text-gray-900">{formData.subjectName || "Not specified"}</p>
                  <p className="text-xs text-gray-500 mt-1">ID: {formData.subjectId?.substring(0, 8)}...</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Title *</label>
                <input
                  className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                <textarea
                  className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 min-h-[100px]"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Instructions</label>
                <textarea
                  className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 min-h-[120px]"
                  value={formData.instructions}
                  onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Submission Type</label>
                <select
                  className="w-full px-4 py-3 border rounded-xl"
                  value={formData.submissionType}
                  onChange={(e) => setFormData({ ...formData, submissionType: e.target.value })}
                >
                  <option value="Online">Online</option>
                  <option value="Physical">Physical</option>
                  <option value="Both">Both</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Attachments */}
          <Card className="border-none shadow-lg rounded-[2rem]">
            <CardHeader className="bg-slate-50/50 border-b">
              <div className="flex items-center justify-between">
                <CardTitle>Attachments</CardTitle>
                <div className="relative">
                  <input type="file" multiple onChange={handleFileUpload} disabled={uploading} className="absolute inset-0 opacity-0 cursor-pointer" />
                  <Button variant="outline" size="sm" disabled={uploading}>
                    {uploading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Upload className="h-4 w-4 mr-2" />}
                    {uploading ? "Uploading..." : "Upload Files"}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              {existingAttachments.length > 0 ? (
                <div className="space-y-2">
                  {existingAttachments.map((file, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-white border rounded-xl hover:shadow-md">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{getFileIcon(file.name)}</span>
                        <div>
                          <p className="font-bold text-sm">{file.name}</p>
                          <p className="text-xs text-gray-500">{formatFileSize(file.fileSize)}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteAttachment(file)} disabled={deletingFile === file.name} className="text-red-500">
                        {deletingFile === file.name ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-400">No attachments yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="border-none shadow-lg rounded-[2rem] bg-gradient-to-br from-slate-900 to-slate-800 text-white">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Settings2 className="h-5 w-5" />
                Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div>
                <label className="text-sm text-slate-300 mb-2 block">Due Date *</label>
                <input type="date" className="w-full px-4 py-3 rounded-xl bg-white text-gray-900" value={formData.dueDate} onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })} />
              </div>
              <div>
                <label className="text-sm text-slate-300 mb-2 block">Total Marks</label>
                <input type="number" min="0" step="0.5" className="w-full px-4 py-3 rounded-xl bg-white text-gray-900" value={formData.totalMarks} onChange={(e) => setFormData({ ...formData, totalMarks: parseFloat(e.target.value) || 0 })} />
              </div>
              <div className="space-y-3 pt-3 border-t border-slate-700">
                <ToggleItem label="Allow Late Submissions" checked={formData.allowLateSubmissions} onChange={(val) => setFormData({ ...formData, allowLateSubmissions: val })} />
                <ToggleItem label="Notify Parents" checked={formData.notifyParents} onChange={(val) => setFormData({ ...formData, notifyParents: val })} />
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-lg rounded-[2rem] bg-blue-50">
            <CardContent className="pt-6">
              <div className="flex gap-3">
                <AlertCircle className="h-5 w-5 text-blue-600" />
                <div className="text-xs text-blue-800">
                  <p className="font-bold mb-1">ملاحظات:</p>
                  <ul className="space-y-1">
                    <li>• التعديلات تظهر للطلاب فوراً</li>
                    <li>• تغيير درجة الواجب يؤثر على التقييمات</li>
                    <li>• الملفات المرفقة الجديدة تُضاف تلقائياً</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

const ToggleItem = ({ label, checked, onChange }) => (
  <div className="flex justify-between items-center cursor-pointer" onClick={() => onChange(!checked)}>
    <span className="text-sm text-slate-300">{label}</span>
    <div className={`relative w-11 h-6 rounded-full transition-colors ${checked ? "bg-indigo-500" : "bg-slate-600"}`}>
      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${checked ? "translate-x-6" : "translate-x-1"}`} />
    </div>
  </div>
);