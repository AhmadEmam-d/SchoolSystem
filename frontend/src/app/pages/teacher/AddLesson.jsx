import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { ArrowLeft } from 'lucide-react';

const API_BASE_URL = "http://edusmarrt.runasp.net/api";

export function AddLesson() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const token = localStorage.getItem("token");

  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [links, setLinks] = useState(['']);
  const [formData, setFormData] = useState({
    classId: '', subjectId: '', lessonTitle: '', description: '',
    date: '', startTime: '', endTime: '', objectives: [''], notes: '',
  });

useEffect(() => {
  if (!user?.teacherId) return;
  const load = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const [allSubjectsRes, classRes] = await Promise.all([
        fetch(`${API_BASE_URL}/Subjects`, { headers }).then(r => r.json()),
        fetch(`${API_BASE_URL}/Classes/teacher`, { headers }).then(r => r.json()),
      ]);
      const mySubjects = (allSubjectsRes.data || []).filter(s => s.teachers?.some(t => t?.oid === user.teacherId));
      setSubjects(mySubjects);
      setClasses(classRes.data || classRes || []);
    } catch (err) { console.error(err); }
  };
  load();
}, [user]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleFileChange = (e) => setFiles([...files, ...Array.from(e.target.files)]);
  const removeFile = (i) => setFiles(files.filter((_, index) => index !== i));
  const addObjective = () => setFormData({ ...formData, objectives: [...formData.objectives, ''] });
  const updateObjective = (i, val) => { const updated = [...formData.objectives]; updated[i] = val; setFormData({ ...formData, objectives: updated }); };
  const removeObjective = (i) => setFormData({ ...formData, objectives: formData.objectives.filter((_, idx) => idx !== i) });
  const addLink = () => setLinks([...links, '']);
  const updateLink = (i, val) => { const updated = [...links]; updated[i] = val; setLinks(updated); };
  const removeLink = (i) => setLinks(links.filter((_, idx) => idx !== i));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.classId || !formData.subjectId) { alert("اختار Class و Subject"); return; }
    try {
      setLoading(true);
      const body = {
        title: formData.lessonTitle, description: formData.description,
        date: new Date(formData.date).toISOString(),
        startTime: new Date(`${formData.date}T${formData.startTime}`).toISOString(),
        endTime: new Date(`${formData.date}T${formData.endTime}`).toISOString(),
        classOid: formData.classId, subjectOid: formData.subjectId,
        type: 1, objectives: formData.objectives.filter(x => x.trim()),
        resourceLinks: links.filter(x => x.trim()), teacherNotes: formData.notes, materials: []
      };
      const createRes = await fetch(`${API_BASE_URL}/Lessons`, {
        method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const created = await createRes.json();
      if (!created.success) { alert("فشل: " + (created.errors?.[0] || "خطأ")); return; }
      const lessonId = created.data?.oid || created.data;
      const uploadedMaterials = [];
      for (let file of files) {
        const fd = new FormData(); fd.append("File", file);
        const res = await fetch(`${API_BASE_URL}/Files/upload/lesson/${lessonId}`, { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: fd });
        const data = await res.json();
        uploadedMaterials.push({ name: file.name, fileUrl: data.url, fileType: file.type, fileSize: file.size });
      }
      if (uploadedMaterials.length > 0) {
        await fetch(`${API_BASE_URL}/Lessons/${lessonId}`, { method: "PUT", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }, body: JSON.stringify({ materials: uploadedMaterials }) });
      }
      alert("تم إنشاء الدرس ✅");
      navigate("/teacher/lessons");
    } catch (err) { console.error(err); alert("حصل مشكلة ❌"); }
    finally { setLoading(false); }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate(-1)}><ArrowLeft className="mr-2 h-4 w-4" /> Back</Button>
        <h2 className="text-2xl font-bold">Add Lesson</h2>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Card>
          <CardHeader><CardTitle>Basic Information</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm text-gray-600">Subject</label>
                <select name="subjectId" onChange={handleChange} className="w-full border border-gray-300 p-2 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Select Subject</option>
                  {subjects.map(s => <option key={s.oid} value={s.oid}>{s.name}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-sm text-gray-600">Class</label>
                <select name="classId" onChange={handleChange} className="w-full border border-gray-300 p-2 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Select Class</option>
                  {classes.map(c => <option key={c.oid || c.id} value={c.oid || c.id}>{c.name}</option>)}
                </select>
              </div>
            </div>
            <Input name="lessonTitle" placeholder="Lesson Title" onChange={handleChange} required />
            <Textarea name="description" placeholder="Lesson Description" onChange={handleChange} />
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1"><label className="text-sm text-gray-600">Date</label><Input type="date" name="date" onChange={handleChange} required /></div>
              <div className="space-y-1"><label className="text-sm text-gray-600">Start Time</label><Input type="time" name="startTime" onChange={handleChange} required /></div>
              <div className="space-y-1"><label className="text-sm text-gray-600">End Time</label><Input type="time" name="endTime" onChange={handleChange} required /></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><div className="flex justify-between items-center"><CardTitle>Objectives</CardTitle><Button type="button" variant="outline" size="sm" onClick={addObjective}>+ Add</Button></div></CardHeader>
          <CardContent className="space-y-2">
            {formData.objectives.map((obj, i) => (
              <div key={i} className="flex gap-2">
                <Input value={obj} placeholder={`Objective ${i + 1}`} onChange={(e) => updateObjective(i, e.target.value)} />
                {formData.objectives.length > 1 && <Button type="button" variant="ghost" size="sm" onClick={() => removeObjective(i)} className="text-red-500">✕</Button>}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Materials</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="border-2 border-dashed border-gray-200 p-6 rounded-xl text-center">
              <input type="file" multiple onChange={handleFileChange} className="mb-2" />
              <p className="text-sm text-gray-400">Upload files (PDF, images, etc.)</p>
            </div>
            {files.map((file, i) => (
              <div key={i} className="flex justify-between items-center bg-slate-50 p-2 rounded text-sm">
                <span>{file.name}</span>
                <button type="button" onClick={() => removeFile(i)} className="text-red-500 text-xs">Remove</button>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><div className="flex justify-between items-center"><CardTitle>Resource Links</CardTitle><Button type="button" variant="outline" size="sm" onClick={addLink}>+ Add</Button></div></CardHeader>
          <CardContent className="space-y-2">
            {links.map((link, i) => (
              <div key={i} className="flex gap-2">
                <Input value={link} placeholder="https://..." onChange={(e) => updateLink(i, e.target.value)} />
                {links.length > 1 && <Button type="button" variant="ghost" size="sm" onClick={() => removeLink(i)} className="text-red-500">✕</Button>}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Teacher Notes</CardTitle></CardHeader>
          <CardContent><Textarea name="notes" placeholder="Private notes..." onChange={handleChange} /></CardContent>
        </Card>

        <Button type="submit" disabled={loading} className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white">
          {loading ? "Saving..." : "Create Lesson"}
        </Button>
      </form>
    </div>
  );
}