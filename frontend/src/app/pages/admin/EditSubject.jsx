import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Save } from 'lucide-react';
import { SUBJECTS } from '../../lib/mockData';
import { toast } from 'sonner';

export function EditSubject() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const subject = SUBJECTS.find(s => s.id === id);

  const [formData, setFormData] = useState({
    subjectName: '',
    subjectNameAr: '',
    description: '',
    category: '',
    passingGrade: '50',
  });

  useEffect(() => {
    if (subject) {
      setFormData({
        subjectName: subject.name,
        subjectNameAr: subject.name, // In real app, this should be stored separately
        description: '',
        category: 'math', // Default category based on subject type
        passingGrade: '50',
      });
    }
  }, [subject]);

  if (!subject) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900">Subject not found</h2>
          <button
            onClick={() => navigate('/admin/subjects')}
            className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Back to Subjects
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success(t('subjectUpdatedSuccess') || 'Subject updated successfully!');
    navigate('/admin/subjects');
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6 flex items-center gap-4">
        <button
          onClick={() => navigate('/admin/subjects')}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-300" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-purple-600 dark:text-purple-400">
            {t('editSubject') || 'Edit Subject'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Update subject information
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            {t('subjectInformation')}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('subjectName')} *
              </label>
              <input
                type="text"
                name="subjectName"
                value={formData.subjectName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                placeholder="Mathematics"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('subjectNameAr')} *
              </label>
              <input
                type="text"
                name="subjectNameAr"
                value={formData.subjectNameAr}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                placeholder="الرياضيات"
                dir="rtl"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('category')} *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">{t('selectCategory')}</option>
                <option value="science">{t('scienceCategory')}</option>
                <option value="math">{t('mathCategory')}</option>
                <option value="language">{t('languageCategory')}</option>
                <option value="social">{t('socialCategory')}</option>
                <option value="arts">{t('artsCategory')}</option>
                <option value="sports">{t('sportsCategory')}</option>
                <option value="technology">{t('technologyCategory')}</option>
                <option value="religion">{t('religionCategory')}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('passingGrade')} *
              </label>
              <input
                type="number"
                name="passingGrade"
                value={formData.passingGrade}
                onChange={handleChange}
                required
                min="0"
                max="100"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                placeholder="50"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('description')}
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                placeholder={t('subjectDescriptionPlaceholder')}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate('/admin/subjects')}
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