import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { ArrowLeft, Upload, X, FileText } from "lucide-react";

const API_BASE_URL = "https://localhost:7179/api";

export function AddExam() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const token = localStorage.getItem("token");

  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    instructions: "",
    type: "Final",
    classOid: "",
    subjectOid: "",
    date: "",
    startTime: "09:00",
    duration: "02:00",
    maxScore: 100,
    passingScore: 60,
    room: "",
  });

  // ================= LOAD =================
  useEffect(() => {
    if (!user?.teacherId) return;

    const load = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };

        const [allSubjectsRes, classRes] = await Promise.all([
          fetch(`${API_BASE_URL}/Subjects`, { headers }).then(r => r.json()),
          fetch(`${API_BASE_URL}/Classes`, { headers }).then(r => r.json()),
        ]);

        const allSubjects = allSubjectsRes.data || [];
        const mySubjects = allSubjects.filter(s =>
          s.teachers?.some(t => t?.oid === user.teacherId)
        );

        setSubjects(mySubjects);
        setClasses(classRes.data || classRes || []);
      } catch (err) {
        console.error(err);
        alert("Error loading data");
      }
    };

    load();
  }, [user]);

  const handleFileChange = (e) => setFiles([...files, ...Array.from(e.target.files)]);
  const removeFile = (i) => setFiles(files.filter((_, index) => index !== i));
  const formatFileSize = (bytes) => {
    if (!bytes) return "0 KB";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.classOid || !formData.subjectOid) {
      alert("اختار Class و Subject");
      return;
    }

    try {
      setLoading(true);

      const formatTime = (timeStr) => {
        if (!timeStr) return "00:00:00";
        return timeStr.split(":").length === 2 ? `${timeStr}:00` : timeStr;
      };

      const createRes = await fetch(`${API_BASE_URL}/Exams`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          date: new Date(formData.date).toISOString(),
          startTime: formatTime(formData.startTime),
          duration: formatTime(formData.duration),
          maxScore: Number(formData.maxScore),
          passingScore: Number(formData.passingScore),
          materials: [],
        }),
      });

      const created = await createRes.json();
      const examId = created.data;

      if (!examId) {
        alert("فشل إنشاء الامتحان ❌");
        return;
      }

      if (files.length > 0) {
        const fd = new FormData();
        files.forEach((file) => fd.append("Files", file));

        await fetch(`${API_BASE_URL}/Files/upload-multiple/Exam/${examId}`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: fd,
        });
      }

      alert("تم إنشاء الامتحان + رفع الملفات ✅");
      navigate("/teacher/exams");

    } catch (err) {
      console.error(err);
      alert("في مشكلة ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">

      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <h2 className="text-2xl font-bold">Add Exam</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* BASIC INFO */}
        <Card>
          <CardHeader><CardTitle>Basic Information</CardTitle></CardHeader>
          <CardContent className="space-y-4">

            <Input
              placeholder="Exam Name"
              required
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm text-gray-600">Subject</label>
                <select
                  className="w-full border border-gray-300 p-2 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => setFormData({ ...formData, subjectOid: e.target.value })}
                >
                  <option value="">Select Subject</option>
                  {subjects.map((s) => (
                    <option key={s.oid} value={s.oid}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-sm text-gray-600">Class</label>
                <select
                  className="w-full border border-gray-300 p-2 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => setFormData({ ...formData, classOid: e.target.value })}
                >
                  <option value="">Select Class</option>
                  {classes.map((c) => (
                    <option key={c.oid || c.id} value={c.oid || c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm text-gray-600">Exam Type</label>
              <select
                className="w-full border border-gray-300 p-2 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                defaultValue="Final"
              >
                <option value="Final">Final</option>
                <option value="Midterm">Midterm</option>
                <option value="Quiz">Quiz</option>
              </select>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-sm text-gray-600">Date</label>
                <Input
                  type="date"
                  required
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm text-gray-600">Start Time</label>
                <Input
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm text-gray-600">Duration (HH:mm)</label>
                <Input
                  placeholder="02:00"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                />
              </div>
            </div>

          </CardContent>
        </Card>

        {/* GRADING */}
        <Card>
          <CardHeader><CardTitle>Grading</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm text-gray-600">Max Score</label>
                <Input
                  type="number"
                  value={formData.maxScore}
                  onChange={(e) => setFormData({ ...formData, maxScore: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm text-gray-600">Passing Score</label>
                <Input
                  type="number"
                  value={formData.passingScore}
                  onChange={(e) => setFormData({ ...formData, passingScore: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm text-gray-600">Room</label>
              <Input
                placeholder="Room 301"
                onChange={(e) => setFormData({ ...formData, room: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        {/* DESCRIPTION */}
        <Card>
          <CardHeader><CardTitle>Description & Instructions</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Description"
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            <Textarea
              placeholder="Instructions for students"
              required
              onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
            />
          </CardContent>
        </Card>

        {/* ATTACHMENTS */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Attachments</CardTitle>
              <div className="relative">
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <Button variant="outline" size="sm" type="button">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Files
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {files.length > 0 ? (
              files.map((file, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-slate-50 border rounded-xl">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-indigo-600" />
                    <div>
                      <p className="font-medium text-sm">{file.name}</p>
                      <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                    </div>
                  </div>
                  <button type="button" onClick={() => removeFile(i)} className="text-red-500">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-400 text-center py-6">No files selected</p>
            )}
          </CardContent>
        </Card>

        <Button type="submit" disabled={loading} className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white">
          {loading ? "Saving..." : "Create Exam"}
        </Button>

      </form>
    </div>
  );
}