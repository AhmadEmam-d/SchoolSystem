import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { api } from "../../lib/api";

import {
  BookOpen,
  Calendar,
  Clock,
  Trash2,
  Edit,
  Eye,
  Plus
} from "lucide-react";

const TeacherLessons = () => {
  const navigate = useNavigate();

  const [lessons, setLessons] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ================= LOAD =================
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const lessonsRes = await api.lessons.getAll();
        setLessons(lessonsRes?.data || []);

        const statsRes = await api.lessons.getStats();
        setStats(statsRes?.data || statsRes);

      } catch (err) {
        setError("فشل تحميل البيانات");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // ================= DELETE =================
  const handleDelete = async (id) => {
    if (!window.confirm("متأكد من حذف الدرس؟")) return;

    try {
      await api.lessons.delete(id);
      setLessons(prev => prev.filter(l => l.oid !== id));
    } catch {
      alert("فشل الحذف");
    }
  };

  if (loading) return <div className="p-10 text-center">⏳ جاري التحميل...</div>;
  if (error) return <div className="p-10 text-red-500">{error}</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">📚 Teacher Lessons</h1>

        <button
          onClick={() => navigate("/teacher/add-lesson")}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          <Plus size={16} />
          Add Lesson
        </button>
      </div>

      {/* ================= STATS ================= */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <StatCard title="Total" value={stats.totalLessons} />
          <StatCard title="Completed" value={stats.completedLessons} green />
          <StatCard title="Upcoming" value={stats.upcomingLessons} blue />
          <StatCard title="Month" value={stats.thisMonthLessons} purple />
          <StatCard title="Week" value={stats.thisWeekLessons} orange />
          <StatCard title="Materials" value={stats.totalMaterials} />
        </div>
      )}

      {/* ================= LIST ================= */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {lessons.map((lesson) => (
          <div
            key={lesson.oid}
            className="bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition"
          >
            {/* TITLE */}
            <h2 className="text-lg font-semibold mb-1">
              {lesson.title}
            </h2>

            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {lesson.description}
            </p>

            {/* META */}
            <div className="text-xs text-gray-500 space-y-1 mb-3">
              <div className="flex items-center gap-2">
                <Calendar size={14} />
                {new Date(lesson.date).toLocaleDateString()}
              </div>

              <div className="flex items-center gap-2">
                <Clock size={14} />
                {lesson.startTime?.slice(11, 16)}
              </div>

              <div className="flex items-center gap-2">
                <BookOpen size={14} />
                {lesson.subjectName}
              </div>
            </div>

            {/* STATUS */}
            <span className={`inline-block text-xs px-2 py-1 rounded-full mb-3
              ${lesson.status === "Completed"
                ? "bg-green-100 text-green-700"
                : "bg-blue-100 text-blue-700"}
            `}>
              {lesson.status}
            </span>

            {/* ACTIONS */}
            <div className="flex justify-between mt-3">

              <button
                onClick={() => navigate(`/teacher/lessons/${lesson.oid}`)}
                className="flex items-center gap-1 text-indigo-600 hover:underline text-sm"
              >
                <Eye size={16} /> Details
              </button>

              <button
                onClick={() => navigate(`/teacher/lessons/edit/${lesson.oid}`)}
                className="flex items-center gap-1 text-yellow-600 hover:underline text-sm"
              >
                <Edit size={16} /> Edit
              </button>

              <button
                onClick={() => handleDelete(lesson.oid)}
                className="flex items-center gap-1 text-red-600 hover:underline text-sm"
              >
                <Trash2 size={16} /> Delete
              </button>

            </div>
          </div>
        ))}
      </div>

      {/* EMPTY */}
      {lessons.length === 0 && (
        <div className="text-center text-gray-500 mt-10">
          مفيش دروس لسه 😅
        </div>
      )}
    </div>
  );
};

// ================= STAT CARD =================
const StatCard = ({ title, value, green, blue, purple, orange }) => {
  let color = "text-gray-800";

  if (green) color = "text-green-600";
  if (blue) color = "text-blue-600";
  if (purple) color = "text-purple-600";
  if (orange) color = "text-orange-500";

  return (
    <div className="bg-white border rounded-xl p-4 text-center shadow-sm">
      <p className="text-xs text-gray-500">{title}</p>
      <p className={`text-xl font-bold ${color}`}>{value || 0}</p>
    </div>
  );
};

export default TeacherLessons;