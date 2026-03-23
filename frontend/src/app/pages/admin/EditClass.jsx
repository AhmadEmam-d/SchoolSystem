import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Save } from 'lucide-react';
import { useMockData } from "@/context/MockDataContext";
import { toast } from 'sonner';

export function EditClass() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { classes } = useMockData();

  const classData = classes.find(c => c.id === id);

  const [formData, setFormData] = useState({
    className: '',
    classNameAr: '',
    grade: '',
    section: '',
    academicYear: '2024-2025',
    capacity: '',
    room: '',
  });

  useEffect(() => {
    if (classData) {
      // Parse class name to extract grade and section
      // Assuming format like "4-A" or "Grade 4-A"
      const nameParts = classData.name.split('-');
      const grade = classData.gradeLevel?.toString() || '';
      const section = nameParts[1]?.trim() || '';

      setFormData({
        className: classData.name,
        classNameAr: classData.name, // In real app, this should be stored separately
        grade: grade,
        section: section,
        academicYear: '2024-2025',
        capacity: '30', // Default value, should be stored in class data
        room: '101', // Default value, should be stored in class data
      });
    }
  }, [classData]);

  if (!classData) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900">Class not found</h2>
          <button
            onClick={() => navigate('/admin/classes')}
            className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Back to Classes
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success(t('classUpdatedSuccess') || 'Class updated successfully!');
    navigate('/admin/classes');
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6 flex items-center gap-4">
        <button
          onClick={() => navigate('/admin/classes')}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-300" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-purple-600 dark:text-purple-400">
            {t('editClass') || 'Edit Class'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Update class information
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            {t('classInformation')}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('className')} *
              </label>
              <input
                type="text"
                name="className"
                value={formData.className}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                placeholder="Grade 1 - A"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('classNameAr')} *
              </label>
              <input
                type="text"
                name="classNameAr"
                value={formData.classNameAr}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                placeholder="الصف الأول - أ"
                dir="rtl"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('grade')} *
              </label>
              <select
                name="grade"
                value={formData.grade}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">{t('selectClass')}</option>
                <option value="1">{t('grade1')}</option>
                <option value="2">{t('grade2')}</option>
                <option value="3">{t('grade3')}</option>
                <option value="4">{t('grade4')}</option>
                <option value="5">{t('grade5')}</option>
                <option value="6">{t('grade6')}</option>
                <option value="7">{t('grade7')}</option>
                <option value="8">{t('grade8')}</option>
                <option value="9">{t('grade9')}</option>
                <option value="10">{t('grade10')}</option>
                <option value="11">{t('grade11')}</option>
                <option value="12">{t('grade12')}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('section')} *
              </label>
              <select
                name="section"
                value={formData.section}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">{t('selectClass')}</option>
                <option value="A">أ (A)</option>
                <option value="B">ب (B)</option>
                <option value="C">ج (C)</option>
                <option value="D">د (D)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('academicYear')} *
              </label>
              <input
                type="text"
                name="academicYear"
                value={formData.academicYear}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                placeholder="2024-2025"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('capacity')} *
              </label>
              <input
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                required
                min="1"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                placeholder="30"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('room')}
              </label>
              <input
                type="text"
                name="room"
                value={formData.room}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                placeholder="101"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate('/admin/classes')}
            className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            {t('cancel')}
          </button>
          <button
            type="submit"
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center gap-2"
          >
            <Save className="h-5 w-5" />
            {t('saveChanges') || 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}