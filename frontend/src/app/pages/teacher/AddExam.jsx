import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";

const API_BASE_URL = "https://localhost:7179/api";

export function AddExam() {
  const navigate = useNavigate();
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
    const load = async () => {
      try {
        const classRes = await fetch(`${API_BASE_URL}/Classes`, {
          headers: { Authorization: `Bearer ${token}` },
        }).then((r) => r.json());

        const subjectRes = await fetch(`${API_BASE_URL}/Subjects`, {
          headers: { Authorization: `Bearer ${token}` },
        }).then((r) => r.json());

        setClasses(classRes.data || classRes || []);
        setSubjects(subjectRes.data || subjectRes || []);
      } catch (err) {
        console.error(err);
        alert("Error loading data");
      }
    };

    load();
  }, []);

  // ================= FILE =================
  const handleFileChange = (e) => {
    setFiles([...files, ...Array.from(e.target.files)]);
  };

  const removeFile = (i) => {
    setFiles(files.filter((_, index) => index !== i));
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

      // ================= 1. CREATE EXAM =================
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
          materials: [], // فاضي الأول
        }),
      });

      const created = await createRes.json();
      console.log("Created Exam:", created);

      const examId = created.data; // الـ backend بيرجع Guid في created.data
      console.log("Created Exam ID:", examId);

      if (!examId) {
        alert("فشل إنشاء الامتحان ❌");
        return;
      }

      // ================= 2. UPLOAD FILES =================
      if (files.length > 0) {
        const fd = new FormData();
        files.forEach((file) => fd.append("Files", file)); // ⚠️ مهم: "Files" جمع

        const uploadRes = await fetch(
          `${API_BASE_URL}/Files/upload-multiple/Exam/${examId}`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: fd,
          }
        );

        const uploadData = await uploadRes.json();
        console.log("Uploaded Files:", uploadData);
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

  // ================= UI =================
  return (
    <div style={{ padding: 20 }}>
      <h2>Add Exam</h2>

      <form onSubmit={handleSubmit}>

        <input
          placeholder="Exam Name"
          required
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />

        <br /><br />

        <select onChange={(e) => setFormData({ ...formData, classOid: e.target.value })}>
          <option value="">Class</option>
          {classes.map((c) => (
            <option key={c.id || c.oid} value={c.id || c.oid}>{c.name}</option>
          ))}
        </select>

        <br /><br />

        <select onChange={(e) => setFormData({ ...formData, subjectOid: e.target.value })}>
          <option value="">Subject</option>
          {subjects.map((s) => (
            <option key={s.id || s.oid} value={s.id || s.oid}>{s.name}</option>
          ))}
        </select>

        <br /><br />

        <select onChange={(e) => setFormData({ ...formData, type: e.target.value })} defaultValue="Final">
          <option value="Final">Final</option>
          <option value="Midterm">Midterm</option>
          <option value="Quiz">Quiz</option>
        </select>

        <br /><br />

        <input
          type="date"
          required
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
        />

        <br /><br />

        <input
          type="time"
          value={formData.startTime}
          onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
        />

        <br /><br />

        <input
          placeholder="Duration (HH:mm)"
          value={formData.duration}
          onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
        />

        <br /><br />

        <input
          type="number"
          placeholder="Max Score"
          value={formData.maxScore}
          onChange={(e) => setFormData({ ...formData, maxScore: e.target.value })}
        />

        <br /><br />

        <input
          type="number"
          placeholder="Passing Score"
          value={formData.passingScore}
          onChange={(e) => setFormData({ ...formData, passingScore: e.target.value })}
        />

        <br /><br />

        <input
          placeholder="Room (e.g. Room 301)"
          onChange={(e) => setFormData({ ...formData, room: e.target.value })}
        />

        <br /><br />

        <textarea
          placeholder="Description"
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />

        <br /><br />

        <textarea
          placeholder="Instructions for students"
          required
          onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
        />

        <br /><br />

        <input type="file" multiple onChange={handleFileChange} />

        {files.map((file, i) => (
          <div key={i}>
            {file.name}
            <button type="button" onClick={() => removeFile(i)}>حذف</button>
          </div>
        ))}

        <br /><br />

        <button type="submit" disabled={loading}>
          {loading ? "Loading..." : "Create Exam"}
        </button>

      </form>
    </div>
  );
}