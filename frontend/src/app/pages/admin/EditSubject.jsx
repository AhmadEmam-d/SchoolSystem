import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/app/lib/api'; // تأكد من صحة المسار لملف الـ api
import { Button } from "@/app/components/ui/button";

export function EditSubject() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
  });

  // ================= جلب بيانات المادة عند تحميل الصفحة =================
  useEffect(() => {
    const fetchSubjectData = async () => {
      try {
        setLoading(true);
        const response = await api.subjects.getById(id);
        
        // التعامل مع هيكلية الرد (Response Structure)
        const data = response.success ? response.data : response;
        
        if (data) {
          setFormData({
            name: data.name || '',
          });
        } else {
          toast.error(t('subjectNotFound'));
        }
      } catch (error) {
        console.error('Error fetching subject:', error);
        toast.error(t('errorFetchingData'));
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchSubjectData();
  }, [id, t]);

  // ================= إرسال التحديثات للـ API =================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      // إرسال البيانات بالهيكل المطلوب: { "name": "..." }
      const response = await api.subjects.update(id, {
        name: formData.name,
      });

      if (response.success || response.oid) {
        toast.success(t('subjectUpdatedSuccess') || 'Subject updated successfully!');
        navigate('/admin/subjects');
      }
    } catch (error) {
      console.error('Update error:', error);
      toast.error(t('updateFailed'));
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-purple-600" />
        <p className="text-muted-foreground">{t('loading')}</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex items-center gap-4">
        <button
          onClick={() => navigate('/admin/subjects')}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <ArrowLeft className={`h-5 w-5 text-gray-600 dark:text-gray-300 ${isRTL ? 'rotate-180' : ''}`} />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-purple-600 dark:text-purple-400">
            {t('editSubject')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {t('updateSubjectInfo') || 'Update subject information'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            {t('subjectInformation')}
          </h2>
          
          <div className="grid grid-cols-1 gap-6">
            {/* Subject Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('subjectName')} *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                placeholder="e.g. Mathematics"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/admin/subjects')}
            disabled={saving}
          >
            {t('cancel')}
          </Button>
          <Button
            type="submit"
            disabled={saving}
            className="bg-purple-600 hover:bg-purple-700 text-white min-w-[140px]"
          >
            {saving ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <Save className={`h-5 w-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                {t('saveChanges')}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}