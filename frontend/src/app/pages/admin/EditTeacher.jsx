import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../../components/ui/select';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '../../lib/api';

export function EditTeacher() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    subjectOids: []
  });

  // ✅ 1. تحميل البيانات عند فتح الصفحة
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [teacher, subjectsData] = await Promise.all([
          api.teachers.getById(id),
          api.subjects.getAll()
        ]);

        setSubjects(subjectsData || []);

        if (teacher) {
          setFormData({
            fullName: teacher.fullName || '',
            email: teacher.email || '',
            phone: teacher.phone || '',
            subjectOids: teacher.subjects?.map(s => s.oid) || []
          });
        }
      } catch (err) {
        console.error("Fetch Error:", err);
        toast.error('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // ✅ 2. دالة الحفظ مع التنسيق الجديد للـ Payload
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // بناء الكائن بالشكل الذي يتوقعه السيرفر (Swagger Schema)
      const payload = {
        oid: id,
        teacher: {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          subjectOids: formData.subjectOids
        }
      };

      console.log('🚀 Sending Payload:', payload);

      const res = await api.teachers.update(id, payload);

      if (res && (res.success || !res.errors)) {
        toast.success(t('teacherUpdatedSuccess') || 'Teacher updated successfully');
        navigate('/admin/teachers');
      } else {
        console.error('❌ Validation Errors:', res.errors);
        toast.error('Update failed: Please check the data');
      }
    } catch (err) {
      console.error('❌ API Error:', err);
      // عرض تفاصيل الخطأ من السيرفر إذا وجدت
      const serverError = err.response?.data?.errors;
      const errorMsg = serverError ? Object.values(serverError).flat().join(', ') : 'Update failed';
      toast.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-10 flex flex-col items-center justify-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p>Loading teacher data...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto" dir={isRTL ? 'rtl' : 'ltr'}>
      
      {/* Header */}
      <div className="mb-6 flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/admin/teachers')}>
          <ArrowLeft className={isRTL ? 'rotate-180' : ''} />
        </Button>
        <h1 className="text-2xl font-bold">{t('editTeacher')}</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('personalInformation')}</CardTitle>
          </CardHeader>

          <CardContent className="grid gap-6">
            
            {/* Full Name */}
            <div className="grid gap-2">
              <label className="text-sm font-medium">{t('fullName')}</label>
              <Input
                required
                placeholder="Ex: John Doe"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              />
            </div>

            {/* Email */}
            <div className="grid gap-2">
              <label className="text-sm font-medium">{t('email')}</label>
              <Input
                required
                type="email"
                placeholder="email@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            {/* Phone */}
            <div className="grid gap-2">
              <label className="text-sm font-medium">{t('phone')}</label>
              <Input
                required
                placeholder="0123456789"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            {/* Subject Selection */}
            <div className="grid gap-2">
              <label className="text-sm font-medium">{t('subject')}</label>
              <Select
                value={formData.subjectOids[0] || ''}
                onValueChange={(value) => setFormData({ ...formData, subjectOids: [value] })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((sub) => (
                    <SelectItem key={sub.oid} value={sub.oid}>
                      {sub.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button type="submit" disabled={submitting} className="min-w-[120px]">
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                {t('saving')}
              </>
            ) : (
              <>
                <Save className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                {t('saveChanges')}
              </>
            )}
          </Button>
          
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate('/admin/teachers')}
            disabled={submitting}
          >
            {t('cancel')}
          </Button>
        </div>
      </form>
    </div>
  );
}