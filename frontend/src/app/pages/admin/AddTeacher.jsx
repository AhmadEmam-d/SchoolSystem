import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { 
  ArrowLeft, 
  Save, 
  Loader2, 
  User, 
  Mail, 
  Phone, 
  BookOpen
} from 'lucide-react';
import { toast } from 'sonner';
import { api } from '../../lib/api';

export function AddTeacher() {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
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

  // ✅ تحميل المواد
  useEffect(() => {
    api.subjects.getAll()
      .then(res => {
        setSubjects(Array.isArray(res) ? res : (res?.data || []));
      })
      .catch(() => {
        toast.error("فشل تحميل المواد");
      })
      .finally(() => setLoading(false));
  }, []);

  // ✅ submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.fullName || !formData.email || !formData.phone) {
      toast.error("اكمل البيانات");
      return;
    }

    if (formData.subjectOids.length === 0) {
      toast.error("اختار مادة واحدة على الأقل");
      return;
    }

    setSubmitting(true);

    try {
    const payload = {
  teacher: {
    fullName: formData.fullName,
    email: formData.email,
    phone: formData.phone,
    subjectOids: formData.subjectOids
  }
};

      console.log("🚀 Sending:", payload);

      const res = await api.teachers.create(payload);

      console.log("📥 Response:", res);

      if (res?.success) {
        toast.success("تم إضافة المدرس بنجاح");
        navigate('/admin/teachers');
      } else {
        toast.error(res?.messages?.EN || "فشل الإضافة");
      }

    } catch (err) {
      console.error(err);
      toast.error("خطأ في الاتصال بالسيرفر");
    } finally {
      setSubmitting(false);
    }
  };

  // loading
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin w-8 h-8 text-purple-600" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">

      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="icon" onClick={() => navigate('/admin/teachers')}>
          <ArrowLeft className={`h-5 w-5 ${isRTL ? 'rotate-180' : ''}`} />
        </Button>

        <div>
          <h1 className="text-2xl font-bold">Add Teacher</h1>
          <p className="text-gray-500">Create new teacher</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Personal Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex gap-2 items-center">
              <User className="h-5 w-5" />
              البيانات الشخصية
            </CardTitle>
          </CardHeader>

          <CardContent className="grid gap-4">

            <Input
              placeholder="الاسم"
              value={formData.fullName}
              onChange={e => setFormData({...formData, fullName: e.target.value})}
            />

            <Input
              placeholder="Email"
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
            />

            <Input
              placeholder="Phone"
              value={formData.phone}
              onChange={e => setFormData({...formData, phone: e.target.value})}
            />

          </CardContent>
        </Card>

        {/* Subjects */}
        <Card>
          <CardHeader>
            <CardTitle className="flex gap-2 items-center">
              <BookOpen className="h-5 w-5" />
              المواد
            </CardTitle>
          </CardHeader>

          <CardContent>
            <select
              multiple
              className="w-full border p-2 rounded h-40"
              value={formData.subjectOids}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  subjectOids: Array.from(e.target.selectedOptions, o => o.value)
                })
              }
            >
              {subjects.map(s => (
                <option key={s.oid} value={s.oid}>
                  {s.name}
                </option>
              ))}
            </select>
          </CardContent>
        </Card>

        {/* Buttons */}
        <div className="flex gap-4 justify-end">
          <Button type="button" variant="outline" onClick={() => navigate('/admin/teachers')}>
            Cancel
          </Button>

          <Button type="submit" disabled={submitting}>
            {submitting ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : <Save className="w-4 h-4 mr-2" />}
            Save
          </Button>
        </div>

      </form>
    </div>
  );
}