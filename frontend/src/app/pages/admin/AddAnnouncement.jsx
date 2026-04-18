import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Send } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '../../lib/api';

export function AddAnnouncement() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    title: '',
    contentEn: '',
    contentAr: '',
    target: 'All',
    priority: 'Normal',
    publishDate: '',
    expiryDate: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        title: formData.title,
        contentEn: formData.contentEn,
        contentAr: formData.contentAr,
        target: formData.target,        // All / Teacher / Parent / Student
        priority: formData.priority,    // Low / Normal / High / Urgent
        publishDate: new Date(formData.publishDate).toISOString(),
        expiryDate: formData.expiryDate
          ? new Date(formData.expiryDate).toISOString()
          : null
      };

      const res = await api.announcements.create(payload);

      if (res.success) {
        toast.success(t('announcementPublishedSuccess'));
        navigate('/admin/announcements');
      } else {
        toast.error(res.messages?.EN || 'Error');
      }

    } catch (err) {
      console.error(err);
      toast.error('Something went wrong');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">

      {/* Header */}
      <div className="mb-6 flex items-center gap-4">
        <button
          onClick={() => navigate('/admin/announcements')}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>

        <div>
          <h1 className="text-3xl font-bold text-purple-600">
            {t('addAnnouncementPage')}
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* ================= CONTENT ================= */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border">

          <h2 className="text-xl font-bold mb-4">
            {t('announcementContent')}
          </h2>

          <div className="space-y-4">

            <input
              type="text"
              name="title"
              placeholder="Title"
              value={formData.title}
              onChange={handleChange}
              className="w-full input"
              required
            />

            <textarea
              name="contentEn"
              placeholder="Content EN"
              value={formData.contentEn}
              onChange={handleChange}
              className="w-full input"
              rows={4}
              required
            />

            <textarea
              name="contentAr"
              placeholder="Content AR"
              value={formData.contentAr}
              onChange={handleChange}
              className="w-full input"
              rows={4}
              dir="rtl"
              required
            />

          </div>
        </div>

        {/* ================= SETTINGS ================= */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border">

          <h2 className="text-xl font-bold mb-4">
            {t('publishSettings')}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            {/* TARGET */}
            <select
              name="target"
              value={formData.target}
              onChange={handleChange}
              className="input"
            >
              <option value="All">All</option>
              <option value="Student">Student</option>
              <option value="Teacher">Teacher</option>
              <option value="Parent">Parent</option>
            </select>

            {/* PRIORITY */}
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="input"
            >
              <option value="Low">Low</option>
              <option value="Normal">Normal</option>
              <option value="High">High</option>
              <option value="Urgent">Urgent</option>
            </select>

            {/* PUBLISH DATE */}
            <input
              type="date"
              name="publishDate"
              value={formData.publishDate}
              onChange={handleChange}
              className="input"
              required
            />

            {/* EXPIRY */}
            <input
              type="date"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleChange}
              className="input"
            />

          </div>
        </div>

        {/* ================= ACTIONS ================= */}
        <div className="flex justify-end gap-4">

          <button
            type="button"
            onClick={() => navigate('/admin/announcements')}
            className="px-6 py-3 border rounded-lg"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="px-6 py-3 bg-purple-600 text-white rounded-lg flex gap-2"
          >
            <Send className="h-5 w-5" />
            Publish
          </button>

        </div>

      </form>
    </div>
  );
}