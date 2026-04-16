import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '../../../app/lib/api'; // تأكد من استيراد ملف الـ api

export function EditParent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    fatherName: '',
    motherName: '',
    phone: '',
    email: ''
  });

  // ================= جلب بيانات ولي الأمر عند التحميل =================
  useEffect(() => {
    const fetchParentData = async () => {
      try {
        const data = await api.parents.getById(id);
        if (data) {
          setFormData({
            fatherName: data.fatherName || '',
            motherName: data.motherName || '',
            phone: data.phone || '',
            email: data.email || ''
          });
        } else {
          toast.error(t('noData'));
        }
      } catch (error) {
        console.error(error);
        toast.error(t('errorFetchingData'));
      } finally {
        setLoading(false);
      }
    };

    fetchParentData();
  }, [id, t]);

  // ================= تحديث البيانات =================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const response = await api.parents.update(id, formData);
      if (response.success) {
        toast.success(t('parentUpdatedSuccess'));
        navigate('/admin/parents');
      } else {
        toast.error(response.message || t('updateFailed'));
      }
    } catch (error) {
      toast.error(t('connectionError'));
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/parents')}
            className="p-2 hover:bg-accent rounded-lg transition-colors"
          >
            <ArrowLeft className={`h-5 w-5 text-foreground ${isRTL ? 'rotate-180' : ''}`} />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{t('editParent')}</h1>
            <p className="text-muted-foreground mt-1">{t('editParentDesc')}</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="border-border bg-card">
          <CardHeader className="border-b border-border">
            <CardTitle className="text-foreground">{t('personalInformation')}</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Father Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  {t('fatherName')} *
                </label>
                <Input
                  type="text"
                  name="fatherName"
                  value={formData.fatherName}
                  onChange={handleChange}
                  required
                  placeholder={t('fatherName')}
                />
              </div>

              {/* Mother Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  {t('motherName')} *
                </label>
                <Input
                  type="text"
                  name="motherName"
                  value={formData.motherName}
                  onChange={handleChange}
                  required
                  placeholder={t('motherName')}
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  {t('email')} *
                </label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="example@mail.com"
                />
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  {t('phone')} *
                </label>
                <Input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="01xxxxxxxxx"
                />
              </div>

            </div>
          </CardContent>
        </Card>

        {/* Submit Buttons */}
        <div className="flex items-center justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            disabled={saving}
            onClick={() => navigate('/admin/parents')}
          >
            {t('cancel')}
          </Button>
          <Button
            type="submit"
            disabled={saving}
            className="min-w-[120px]"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
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