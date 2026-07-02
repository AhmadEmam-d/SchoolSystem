import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Send } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '../../lib/api';

export function TeacherAddAnnouncement() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    title: '',
    contentEn: '',
    contentAr: '',
    target: 'Student',
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
        target: formData.target,
        priority: formData.priority,
        publishDate: new Date(formData.publishDate).toISOString(),
        expiryDate: formData.expiryDate
          ? new Date(formData.expiryDate).toISOString()
          : null
      };

      const res = await api.announcements.create(payload);

      if (res.success) {
        toast.success(t('announcementPublishedSuccess'));
        navigate('/teacher/announcements');
      } else {
        toast.error(res.messages?.EN || 'Error');
      }
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong');
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">

      {/* Header */}
      <div className="mb-6 flex items-center gap-4">
        <button
          onClick={() => navigate('/teacher/announcements')}
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

        {/* Content */}
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

        {/* Settings */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border">

          <h2 className="text-xl font-bold mb-4">
            {t('publishSettings')}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            <select
              name="target"
              value={formData.target}
              onChange={handleChange}
              className="input"
            >
              <option value="Student">Student</option>
              <option value="Parent">Parent</option>
              <option value="Teacher">Teacher</option>
              <option value="All">All</option>
            </select>

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

            <input
              type="date"
              name="publishDate"
              value={formData.publishDate}
              onChange={handleChange}
              className="input"
              required
            />

            <input
              type="date"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleChange}
              className="input"
            />

          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4">

          <button
            type="button"
            onClick={() => navigate('/teacher/announcements')}
            className="px-6 py-3 border rounded-lg"
          >
            {t('cancel', 'Cancel')}
          </button>

          <button
            type="submit"
            className="px-6 py-3 bg-purple-600 text-white rounded-lg flex items-center gap-2"
          >
            <Send className="h-5 w-5" />
            {t('publish', 'Publish')}
          </button>

        </div>

      </form>
    </div>
  );
}