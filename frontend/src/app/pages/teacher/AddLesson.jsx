import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { ArrowLeft, Plus, X, Upload } from 'lucide-react';

const API_BASE_URL = "https://localhost:7179/api";

export function AddLesson() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [links, setLinks] = useState(['']);

  const [formData, setFormData] = useState({
    classId: '',
    subjectId: '',
    lessonTitle: '',
    description: '',
    date: '',
    startTime: '',
    endTime: '',
    objectives: [''],
    notes: '',
  });

  // ================= LOAD (نفس طريقة Homework) =================
  useEffect(() => {
    const load = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const classRes = await fetch(`${API_BASE_URL}/Classes`, { headers }).then(r => r.json());
        const subjectRes = await fetch(`${API_BASE_URL}/Subjects`, { headers }).then(r => r.json());

        setClasses(classRes.data || classRes || []);
        setSubjects(subjectRes.data || subjectRes || []);
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, []);

  // ================= HANDLERS =================
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleFileChange = (e) => setFiles([...files, ...Array.from(e.target.files)]);
  const removeFile = (i) => setFiles(files.filter((_, index) => index !== i));

  // ================= SUBMIT (نفس طريقة الربط في Homework) =================
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.classId || !formData.subjectId) {
      alert("اختار Class و Subject");
      return;
    }

    try {
      setLoading(true);

      // 1. CREATE LESSON
      const createRes = await fetch(`${API_BASE_URL}/Lessons`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.lessonTitle,
          description: formData.description,
          date: new Date(formData.date).toISOString(),
          startTime: new Date(`${formData.date}T${formData.startTime}`).toISOString(),
          endTime: new Date(`${formData.date}T${formData.endTime}`).toISOString(),
          classOid: formData.classId,
          subjectOid: formData.subjectId,
          type: 1,
          objectives: formData.objectives.filter(x => x.trim()),
          resourceLinks: links.filter(x => x.trim()),
          teacherNotes: formData.notes,
          materials: [] // بيبدأ فاضي
        }),
      });

      const created = await createRes.json();
      const lessonId = created.data?.oid || created.oid || created.data;

      // 2. UPLOAD FILES (نفس الـ Loop اللي في Homework)
      const uploadedMaterials = [];
      for (let file of files) {
        const fd = new FormData();
        fd.append("File", file); // ⚠️ نفس الـ Key

        const res = await fetch(`${API_BASE_URL}/Files/upload/lesson/${lessonId}`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: fd,
        });

        const data = await res.json();
        uploadedMaterials.push({
          name: file.name,
          fileUrl: data.url,
          fileType: file.type,
          fileSize: file.size,
        });
      }

      // 3. UPDATE LESSON (لو محتاج تربط الـ Materials اللي اترفعت)
      if (uploadedMaterials.length > 0) {
        await fetch(`${API_BASE_URL}/Lessons/${lessonId}`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData, // باقي الداتا
            materials: uploadedMaterials
          }),
        });
      }

      alert("تم إنشاء الدرس ورفع الملفات ✅");
      navigate("/teacher/lessons");

    } catch (err) {
      console.error(err);
      alert("حصل مشكلة ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate(-1)}><ArrowLeft className="mr-2 h-4 w-4" /> Back</Button>
        <h2 className="text-2xl font-bold">Add Lesson</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <select name="classId" onChange={handleChange} className="border p-2 rounded-lg">
                <option value="">Select Class</option>
                {classes.map(c => <option key={c.oid || c.id} value={c.oid || c.id}>{c.name}</option>)}
              </select>
              <select name="subjectId" onChange={handleChange} className="border p-2 rounded-lg">
                <option value="">Select Subject</option>
                {subjects.map(s => <option key={s.oid || s.id} value={s.oid || s.id}>{s.name}</option>)}
              </select>
            </div>

            <Input name="lessonTitle" placeholder="Lesson Title" onChange={handleChange} />
            <Textarea name="description" placeholder="Lesson Description" onChange={handleChange} />

            <div className="grid grid-cols-3 gap-3">
              <Input type="date" name="date" onChange={handleChange} />
              <Input type="time" name="startTime" onChange={handleChange} />
              <Input type="time" name="endTime" onChange={handleChange} />
            </div>
          </CardContent>
        </Card>

        {/* File Section (Copy from Homework) */}
        <Card>
          <CardHeader><CardTitle>Materials</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed p-6 text-center rounded-xl">
              <input type="file" multiple onChange={handleFileChange} className="mb-2" />
              {files.map((file, i) => (
                <div key={i} className="flex justify-between bg-slate-50 p-2 mt-1 rounded text-sm">
                  {file.name}
                  <button type="button" onClick={() => removeFile(i)} className="text-red-500">حذف</button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Button type="submit" disabled={loading} className="w-full h-12 bg-blue-600 hover:bg-blue-700">
          {loading ? "Saving..." : "Create Lesson"}
        </Button>
      </form>
    </div>
  );
}