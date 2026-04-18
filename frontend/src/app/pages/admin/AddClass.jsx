import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Save } from 'lucide-react';
import { toast } from 'sonner';

const API_BASE_URL = "https://localhost:7179/api";

export function AddClass() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    className: '',
    grade: '',
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.className || !formData.grade) {
      toast.error("All fields required");
      return;
    }

    setLoading(true);

    try {
      // ✅ IMPORTANT: mapping للـ API
      const payload = {
        name: formData.className,
        level: formData.grade
      };

      console.log("🚀 Sending:", payload);

      const res = await fetch(`${API_BASE_URL}/Classes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      console.log("📥 Response:", data);

      if (data.success) {
        toast.success("Class added successfully");
        navigate('/admin/classes');
      } else {
        toast.error(data.errors?.[0] || "Failed");
      }

    } catch (error) {
      console.error("❌ Error:", error);
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">

      {/* Header */}
      <div className="mb-6 flex items-center gap-4">
        <button
          onClick={() => navigate('/admin/classes')}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>

        <div>
          <h1 className="text-2xl font-bold text-purple-600">
            Add New Class
          </h1>
          <p className="text-gray-500">
            Create a new class
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-xl shadow">

        {/* Class Name */}
        <div>
          <label className="block mb-2 font-medium">
            Class Name *
          </label>
          <input
            type="text"
            name="className"
            value={formData.className}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-lg"
            placeholder="Ex: Class A"
          />
        </div>

        {/* Grade */}
        <div>
          <label className="block mb-2 font-medium">
            Grade *
          </label>
          <select
            name="grade"
            value={formData.grade}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-lg"
          >
            <option value="">Select Grade</option>
            <option value="1">Grade 1</option>
            <option value="2">Grade 2</option>
            <option value="3">Grade 3</option>
            <option value="4">Grade 4</option>
            <option value="5">Grade 5</option>
            <option value="6">Grade 6</option>
          </select>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate('/admin/classes')}
            className="px-4 py-2 border rounded-lg"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            {loading ? "Saving..." : "Save"}
          </button>
        </div>

      </form>
    </div>
  );
}