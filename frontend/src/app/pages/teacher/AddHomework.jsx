import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { toast } from "sonner";
import { Loader2, Upload, X, FileText, Calendar } from "lucide-react";

const API_BASE_URL = "https://localhost:7179/api";

export function AddHomework() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const token = localStorage.getItem("token");

  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
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
  });

  // ================= LOAD =================
 useEffect(() => {
  if (!user?.teacherId) return;

  const load = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };

      const [allSubjectsRes, classRes] = await Promise.all([
        fetch(`${API_BASE_URL}/Subjects`, { headers }).then(r => r.json()),
        fetch(`${API_BASE_URL}/Classes/teacher`, { headers }).then(r => r.json()),
      ]);

      const allSubjects = allSubjectsRes.data || [];

      // فلتر المواد الخاصة بالمدرس بس
      const mySubjects = allSubjects.filter(s =>
        s.teachers?.some(t => t?.oid === user.teacherId)
      );

      setSubjects(mySubjects);
      setClasses(classRes.data || classRes || []);
    } catch (err) {
      console.error(err);
      toast.error("Error loading data");
    }
  };
  load();
}, [user]);

  // ================= FILES =================
  const handleFileChange = (e) => setFiles([...files, ...Array.from(e.target.files)]);
  const removeFile = (index) => setFiles(files.filter((_, i) => i !== index));
  const formatFileSize = (bytes) => {
    if (!bytes) return "0 KB";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.classId) { toast.error("Please select a class"); return; }
    if (!formData.subjectId) { toast.error("Please select a subject"); return; }
    if (!formData.title.trim()) { toast.error("Title is required"); return; }
    if (!formData.dueDate) { toast.error("Due date is required"); return; }

    try {
      setLoading(true);

      const homeworkData = {
        title: formData.title.trim(),
        description: formData.description?.trim() || "",
        instructions: formData.instructions?.trim() || "",
        dueDate: new Date(formData.dueDate).toISOString(),
        totalMarks: Number(formData.totalMarks) || 0,
        submissionType: "Online",
        allowLateSubmissions: formData.allowLateSubmissions,
        notifyParents: formData.notifyParents,
        classId: formData.classId,
        subjectId: formData.subjectId,
        attachments: [],
      };

      const createResponse = await fetch(`${API_BASE_URL}/Homeworks`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(homeworkData),
      });

      const createResult = await createResponse.json();

      if (!createResponse.ok) {
        throw new Error(createResult.errors?.[0] || "Failed to create homework");
      }

      const homeworkId = createResult.data?.id || createResult.data || createResult;

      if (!homeworkId) throw new Error("No homework ID returned");

      // UPLOAD FILES
      if (files.length > 0) {
        const formDataFile = new FormData();
        files.forEach(file => formDataFile.append("files", file));

        const uploadResponse = await fetch(
          `${API_BASE_URL}/Files/upload-multiple/homework/${homeworkId}`,
          {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: formDataFile,
          }
        );

        if (!uploadResponse.ok) {
          toast.warning("Homework created but files failed to upload");
        }
      }

      toast.success("Homework created successfully!");
      navigate("/teacher/homework");

    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to create homework");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-6 max-w-[1400px] mx-auto">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate("/teacher/homework")}>
            ← Back
          </Button>
          <div>
            <h1 className="text-3xl font-black text-gray-900">Add New Homework</h1>
            <p className="text-gray-500 mt-1">Create a new assignment for your students</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => navigate("/teacher/homework")}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={loading} className="bg-indigo-600 hover:bg-indigo-700">
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            {loading ? "Creating..." : "Create Homework"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* MAIN */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-none shadow-lg rounded-[2rem]">
            <CardHeader className="bg-slate-50/50 border-b">
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5 pt-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter assignment title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                <textarea
                  className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 min-h-[100px]"
                  placeholder="Describe the assignment..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Instructions</label>
                <textarea
                  className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 min-h-[120px]"
                  placeholder="Provide detailed instructions..."
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

          {/* ATTACHMENTS */}
          <Card className="border-none shadow-lg rounded-[2rem]">
            <CardHeader className="bg-slate-50/50 border-b">
              <div className="flex items-center justify-between">
                <CardTitle>Attachments</CardTitle>
                <div className="relative">
                  <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Files
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              {files.length > 0 ? (
                <div className="space-y-2">
                  {files.map((file, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-white border rounded-xl hover:shadow-md">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-indigo-600" />
                        <div>
                          <p className="font-bold text-sm">{file.name}</p>
                          <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => removeFile(idx)} className="text-red-500">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-400">No files selected</p>
                  <p className="text-xs text-slate-400 mt-1">Click "Upload Files" to add materials</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* SIDEBAR */}
        <div className="space-y-6">
          <Card className="border-none shadow-lg rounded-[2rem] bg-gradient-to-br from-slate-900 to-slate-800 text-white">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">

              <div>
                <label className="text-sm text-slate-300 mb-2 block">
                  Class <span className="text-red-400">*</span>
                </label>
               <select
  className="w-full px-4 py-3 rounded-xl bg-white text-gray-900"
  value={formData.classId}
  onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
>
  <option value="">Select a class</option>
  {classes.map((c) => (
    <option key={c.oid || c.id} value={c.oid || c.id}>{c.name}</option>
  ))}
</select>
              </div>

              <div>
                <label className="text-sm text-slate-300 mb-2 block">
                  Subject <span className="text-red-400">*</span>
                </label>
                <select
                  className="w-full px-4 py-3 rounded-xl bg-white text-gray-900"
                  value={formData.subjectId}
                  onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
                >
                  <option value="">Select a subject</option>
                  {subjects.map((s) => (
                    <option key={s.oid || s.id} value={s.oid || s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm text-slate-300 mb-2 block">Due Date *</label>
                <input
                  type="date"
                  className="w-full px-4 py-3 rounded-xl bg-white text-gray-900"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                />
              </div>

              <div>
                <label className="text-sm text-slate-300 mb-2 block">Total Marks</label>
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  className="w-full px-4 py-3 rounded-xl bg-white text-gray-900"
                  value={formData.totalMarks}
                  onChange={(e) => setFormData({ ...formData, totalMarks: parseFloat(e.target.value) || 0 })}
                />
              </div>

              <div className="space-y-3 pt-3 border-t border-slate-700">
                <ToggleItem
                  label="Allow Late Submissions"
                  checked={formData.allowLateSubmissions}
                  onChange={(val) => setFormData({ ...formData, allowLateSubmissions: val })}
                />
                <ToggleItem
                  label="Notify Parents"
                  checked={formData.notifyParents}
                  onChange={(val) => setFormData({ ...formData, notifyParents: val })}
                />
              </div>

            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

const ToggleItem = ({ label, checked, onChange }) => (
  <div className="flex justify-between items-center cursor-pointer" onClick={() => onChange(!checked)}>
    <span className="text-sm text-slate-300">{label}</span>
    <div className={`relative w-11 h-6 rounded-full transition-colors ${checked ? "bg-indigo-500" : "bg-slate-600"}`}>
      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${checked ? "translate-x-6" : "translate-x-1"}`} />
    </div>
  </div>
);