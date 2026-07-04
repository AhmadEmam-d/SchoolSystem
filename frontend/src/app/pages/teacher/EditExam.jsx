import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { ArrowLeft, Loader2, Paperclip, Upload, FileText, X, Download } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '../../lib/api';

const API_BASE_URL = "http://edusmarrt.runasp.net/api";

const formatFileSize = (bytes) => {
  if (!bytes) return '';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

export function EditExam() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const fileInputRef = useRef(null);

  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(false);
  const [uploading, setUploading] = useState(false);

  const [classes, setClasses]   = useState([]);
  const [subjects, setSubjects] = useState([]);

  const [existingMaterials, setExistingMaterials] = useState([]);
  const [newFiles, setNewFiles] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'Final',
    classOid: '',
    subjectOid: '',
    date: '',
    startTime: '',
    duration: '',
    maxScore: '',
    passingScore: '',
    room: '',
    instructions: '',
    status: '',
  });

  // ================= LOAD =================
  useEffect(() => {
    const load = async () => {
      try {
        const [examData, classRes, subjectRes] = await Promise.all([
          api.exams.getById(id),
          fetch(`${API_BASE_URL}/Classes`,  { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
          fetch(`${API_BASE_URL}/Subjects`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
        ]);

        setClasses(classRes.data   || classRes   || []);
        setSubjects(subjectRes.data || subjectRes || []);

        if (examData) {
          setExistingMaterials(examData.materials || []);
          setFormData({
            name:         examData.name         || '',
            description:  examData.description  || '',
            type:         examData.type         || 'Final',
            classOid:     examData.classOid     || '',
            subjectOid:   examData.subjectOid   || '',
            date:         examData.date ? examData.date.split('T')[0] : '',
            startTime:    examData.startTime?.substring(0, 5) || '',
            duration:     examData.duration?.substring(0, 5)  || '',
            maxScore:     examData.maxScore     ?? '',
            passingScore: examData.passingScore ?? '',
            room:         examData.room         || '',
            instructions: examData.instructions || '',
            status:       examData.status       || 'Pending',
          });
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to load exam data");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  // ================= FILE HANDLERS =================
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setNewFiles(prev => {
      const existingNames = new Set(prev.map(f => f.name));
      return [...prev, ...files.filter(f => !existingNames.has(f.name))];
    });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeNewFile = (index) => {
    setNewFiles(prev => prev.filter((_, i) => i !== index));
  };

  // ================= DELETE FILE (local only — isDeleted flag) =================
  const deleteExistingMaterial = (materialOid) => {
    setExistingMaterials(prev =>
      prev.map(m => m.oid === materialOid ? { ...m, isDeleted: true } : m)
    );
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = {
        oid:          id,
        name:         formData.name,
        description:  formData.description,
        type:         formData.type,
        date:         new Date(formData.date).toISOString(),
        startTime:    formData.startTime.length === 5 ? `${formData.startTime}:00` : formData.startTime,
        duration:     formData.duration.length  === 5 ? `${formData.duration}:00`  : formData.duration,
        maxScore:     Number(formData.maxScore),
        passingScore: Number(formData.passingScore),
        status:       formData.status || "Pending",
        room:         formData.room,
        instructions: formData.instructions,
        // ✅ ابعت الـ materials مع isDeleted
        materials: existingMaterials.map(m => ({
          oid:       m.oid,
          name:      m.name,
          fileUrl:   m.fileUrl,
          fileType:  m.fileType,
          fileSize:  m.fileSize,
          isDeleted: m.isDeleted || false,
        })),
      };

      const result = await api.exams.update(id, payload);

      if (!result.success) {
        toast.error(result.messages?.EN || result.messages?.AR || "Update failed");
        return;
      }

      if (newFiles.length > 0) {
        setUploading(true);
        const fd = new FormData();
        newFiles.forEach(file => fd.append("Files", file));

        await fetch(`${API_BASE_URL}/Files/upload-multiple/Exam/${id}`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: fd,
        });
        setUploading(false);
      }

      toast.success("Exam updated successfully ✅");
      navigate('/teacher/exams');

    } catch (error) {
      console.error(error);
      toast.error("Connection error with server");
    } finally {
      setSaving(false);
      setUploading(false);
    }
  };

  // ================= LOADING =================
  if (loading) return (
    <div className="flex justify-center items-center min-h-[400px]">
      <Loader2 className="animate-spin h-8 w-8 text-indigo-600" />
    </div>
  );

  const isBusy = saving || uploading;

  // ================= UI =================
  return (
    <div className="space-y-6 pb-12">

      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate('/teacher/exams')}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Edit Exam</h1>
          <p className="text-muted-foreground">{formData.name}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* ── Basic Info ── */}
        <Card>
          <CardHeader><CardTitle>Basic Information</CardTitle></CardHeader>
          <CardContent className="space-y-4">

            <div className="space-y-2">
              <Label>Exam Name *</Label>
              <Input
                required
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Class *</Label>
                <Select value={formData.classOid} onValueChange={val => setFormData({...formData, classOid: val})}>
                  <SelectTrigger><SelectValue placeholder="Select Class" /></SelectTrigger>
                  <SelectContent>
                    {classes.map(c => (
                      <SelectItem key={c.oid || c.id} value={c.oid || c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Subject *</Label>
                <Select value={formData.subjectOid} onValueChange={val => setFormData({...formData, subjectOid: val})}>
                  <SelectTrigger><SelectValue placeholder="Select Subject" /></SelectTrigger>
                  <SelectContent>
                    {subjects.map(s => (
                      <SelectItem key={s.oid || s.id} value={s.oid || s.id}>{s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Exam Type</Label>
              <Select value={formData.type} onValueChange={val => setFormData({...formData, type: val})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Final">Final</SelectItem>
                  <SelectItem value="Midterm">Midterm</SelectItem>
                  <SelectItem value="Quiz">Quiz</SelectItem>
                </SelectContent>
              </Select>
            </div>

          </CardContent>
        </Card>

        {/* ── Time & Scores ── */}
        <Card>
          <CardHeader><CardTitle>Time and Scores</CardTitle></CardHeader>
          <CardContent className="space-y-4">

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Exam Date *</Label>
                <Input type="date" required value={formData.date}
                  onChange={e => setFormData({...formData, date: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Start Time *</Label>
                <Input type="time" required value={formData.startTime}
                  onChange={e => setFormData({...formData, startTime: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Duration (HH:mm) *</Label>
                <Input placeholder="02:00" required value={formData.duration}
                  onChange={e => setFormData({...formData, duration: e.target.value})} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Maximum Score *</Label>
                <Input type="number" required value={formData.maxScore}
                  onChange={e => setFormData({...formData, maxScore: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Passing Score *</Label>
                <Input type="number" required value={formData.passingScore}
                  onChange={e => setFormData({...formData, passingScore: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Room / Location</Label>
                <Input placeholder="e.g., Room 301" value={formData.room}
                  onChange={e => setFormData({...formData, room: e.target.value})} />
              </div>
            </div>

          </CardContent>
        </Card>

        {/* ── Materials ── */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Paperclip className="h-5 w-5" /> Exam Materials
            </CardTitle>
            <CardDescription>
              Manage attached files for this exam.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">

            {/* ✅ فلتر اللي isDeleted = true متعرضش */}
            {existingMaterials.filter(m => !m.isDeleted).length > 0 && (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Current Files</p>
                {existingMaterials.filter(m => !m.isDeleted).map(material => (
                  <div key={material.oid} className="flex items-center gap-3 p-3 rounded-lg border bg-muted/30">
                    <FileText className="h-5 w-5 text-muted-foreground shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{material.name}</p>
                      <p className="text-xs text-muted-foreground">{formatFileSize(material.fileSize)}</p>
                    </div>
                    <a href={`${API_BASE_URL}${material.fileUrl}`} target="_blank" rel="noopener noreferrer" download={material.name}>
                      <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-indigo-600">
                        <Download className="h-4 w-4" />
                      </Button>
                    </a>
                    <Button type="button" variant="ghost" size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => deleteExistingMaterial(material.oid)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {newFiles.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">New Files (will upload on save)</p>
                {newFiles.map((file, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg border border-dashed border-indigo-300 bg-indigo-50/30">
                    <FileText className="h-5 w-5 text-indigo-500 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{file.name}</p>
                      <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                    </div>
                    <Button type="button" variant="ghost" size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => removeNewFile(i)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <div>
              <input ref={fileInputRef} type="file" multiple className="hidden"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg" />
              <Button type="button" variant="outline" className="w-full border-dashed"
                onClick={() => fileInputRef.current?.click()}>
                <Upload className="h-4 w-4 mr-2" />
                {newFiles.length > 0 ? `${newFiles.length} new file(s) — Add more` : 'Attach New Files'}
              </Button>
              <p className="text-xs text-muted-foreground mt-1.5 text-center">
                PDF, Word, images, or text files.
              </p>
            </div>

          </CardContent>
        </Card>

        {/* ── Details & Instructions ── */}
        <Card>
          <CardHeader><CardTitle>Details and Instructions</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea placeholder="What this exam covers..."
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Instructions for Students *</Label>
              <Textarea required rows={4}
                placeholder="Exam rules, allowed tools..."
                value={formData.instructions}
                onChange={e => setFormData({...formData, instructions: e.target.value})} />
            </div>
          </CardContent>
        </Card>

        {/* ── Actions ── */}
        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => navigate('/teacher/exams')}>
            Cancel
          </Button>
          <Button type="submit" disabled={isBusy} className="bg-indigo-600 hover:bg-indigo-700 min-w-[140px]">
            {isBusy
              ? <><Loader2 className="animate-spin mr-2 h-4 w-4" />{uploading ? 'Uploading...' : 'Saving...'}</>
              : "Save Changes"
            }
          </Button>
        </div>

      </form>
    </div>
  );
}