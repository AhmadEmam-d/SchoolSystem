import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { api } from "../../lib/api";

const EditLesson = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [lesson, setLesson] = useState(null);
  const [files, setFiles] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    startTime: "",
    endTime: "",
    objectives: [{ oid: null, description: "", order: 0 }],
    homework: "",
    homeworkOid: null,
    notes: "",
  });

  // ================= LOAD =================
  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.lessons.getById(id);
        const d = res?.data || res;
        if (!d) return;

        setLesson(d);

        const toTime = (iso) => {
          if (!iso) return "";
          const dt = new Date(iso);
          return dt.toTimeString().substring(0, 5);
        };

        setForm({
          title: d.title || "",
          description: d.description || "",
          date: d.date?.split("T")[0] || "",
          startTime: toTime(d.startTime),
          endTime: toTime(d.endTime),
          objectives: d.objectives?.length
            ? d.objectives.map((o) => ({
                oid: o.oid || null,
                description: o.description || "",
                order: o.order ?? 0,
              }))
            : [{ oid: null, description: "", order: 0 }],
          homework: d.homework?.description || "",
          homeworkOid: d.homework?.oid || null,
          notes: d.teacherNotes || "",
        });

        const filesRes = await api.files.getEntityFiles("lesson", id);
        setFiles(filesRes?.data || filesRes || []);
      } catch (err) {
        console.error("LOAD ERROR:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  // ================= HANDLERS =================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleObjectiveChange = (i, val) => {
    const arr = [...form.objectives];
    arr[i] = { ...arr[i], description: val };
    setForm({ ...form, objectives: arr });
  };

  const addObjective = () => {
    setForm({
      ...form,
      objectives: [
        ...form.objectives,
        { oid: null, description: "", order: form.objectives.length },
      ],
    });
  };

  const removeObjective = (index) => {
    setForm({
      ...form,
      objectives: form.objectives
        .filter((_, i) => i !== index)
        .map((o, i) => ({ ...o, order: i })),
    });
  };

  // ================= DELETE FILE =================
  const deleteFile = async (fileUrl) => {
    try {
      await api.files.deleteFile("lesson", id, fileUrl);
      setFiles((prev) => prev.filter((f) => f.fileUrl !== fileUrl));
    } catch (err) {
      alert("فشل حذف الملف");
    }
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        oid: id,
        title: form.title,
        description: form.description,
        date: new Date(form.date).toISOString(),
        startTime: new Date(`${form.date}T${form.startTime}`).toISOString(),
        endTime: new Date(`${form.date}T${form.endTime}`).toISOString(),

        classOid: lesson.classOid,
        subjectOid: lesson.subjectOid,
        type: lesson.type ?? 1,
        status: typeof lesson.status === "number" ? lesson.status : 1,

        objectives: form.objectives.map((o, i) => ({
          ...(o.oid ? { oid: o.oid } : {}),
          description: o.description,
          order: i,
        })),

        materials: lesson.materials || [],
        resourceLinks: lesson.resourceLinks || [],

        homework: form.homework
          ? {
              ...(form.homeworkOid ? { oid: form.homeworkOid } : {}),
              title: lesson.homework?.title || "Homework",
              description: form.homework,
              dueDate: new Date(form.date).toISOString(),
            }
          : null,

        teacherNotes: form.notes,
      };

      console.log("UPDATE PAYLOAD:", payload);
      await api.lessons.update(id, payload);

      if (newFiles.length > 0) {
        await api.files.uploadMultiple("lesson", id, newFiles);
      }

      navigate("/teacher/lessons");
    } catch (err) {
      console.error("UPDATE ERROR:", err);
      alert("فشل التعديل");
    }
  };

  // ================= UI =================
  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ padding: "20px", maxWidth: "700px" }}>
      <h2>Edit Lesson</h2>

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "10px" }}
      >
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Title"
        />

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
        />

        <input type="date" name="date" value={form.date} onChange={handleChange} />
        <input type="time" name="startTime" value={form.startTime} onChange={handleChange} />
        <input type="time" name="endTime" value={form.endTime} onChange={handleChange} />

        {/* OBJECTIVES */}
        <h4>Objectives</h4>
        {form.objectives.map((obj, i) => (
          <div key={i} style={{ display: "flex", gap: "5px" }}>
            <input
              value={obj.description}
              onChange={(e) => handleObjectiveChange(i, e.target.value)}
            />
            <button type="button" onClick={() => removeObjective(i)}>❌</button>
          </div>
        ))}
        <button type="button" onClick={addObjective}>+ Add Objective</button>

        {/* HOMEWORK */}
        <h4>Homework</h4>
        <textarea
          value={form.homework}
          onChange={(e) => setForm({ ...form, homework: e.target.value })}
        />

        {/* NOTES */}
        <h4>Notes</h4>
        <textarea
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
        />

        {/* EXISTING FILES */}
        <h4>Existing Files</h4>
        {files.length === 0 ? (
          <p>No files</p>
        ) : (
          files.map((f) => (
            <div
              key={f.fileUrl}
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <span>{f.fileName || f.name}</span>
              <button type="button" onClick={() => deleteFile(f.fileUrl)}>
                Delete
              </button>
            </div>
          ))
        )}

        {/* NEW FILES */}
        <h4>Add Files</h4>
        <input
          type="file"
          multiple
          onChange={(e) => setNewFiles([...e.target.files])}
        />

        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default EditLesson;