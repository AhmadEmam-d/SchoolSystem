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
  BookOpen,
  CheckCircle2
} from 'lucide-react';
import { toast } from 'sonner';
import { api } from '../../lib/api';

export function AddTeacher() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const [subjects, setSubjects] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [fetching, setFetching] = useState(true);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    subjectOids: []
  });

  // جلب المواد الدراسية عند تحميل الصفحة
  useEffect(() => {
    api.subjects.getAll()
      .then(res => {
        setSubjects(Array.isArray(res) ? res : (res?.data || []));
      })
      .catch(err => {
        console.error("Error fetching subjects:", err);
        toast.error(isRTL ? "فشل تحميل المواد" : "Failed to load subjects");
      })
      .finally(() => setFetching(false));
  }, [isRTL]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.subjectOids.length === 0) {
      toast.error(isRTL ? 'يرجى اختيار مادة واحدة على الأقل' : 'Please select a subject');
      return;
    }

    setSubmitting(true);

    try {
      // ✅ الهيكلة الصحيحة بناءً على الـ Validation Error: { Teacher: [...] }
      const payload = {
        teacher: {
          fullName: formData.fullName.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          subjectOids: formData.subjectOids 
        }
      };

      console.log('🚀 Final Payload:', payload);

      const res = await api.teachers.create(payload);

      if (res && res.success) {
        toast.success(t('TeacherCreatedSuccessfully') || (isRTL ? "تمت إضافة المدرس بنجاح" : "Teacher added successfully"));
        navigate('/admin/teachers');
      } else {
        // التعامل مع أخطاء الـ Validation الراجعة من السيرفر
        const errorMsg = res?.messages?.EN || res?.message || (isRTL ? "فشلت العملية" : "Submission failed");
        toast.error(errorMsg);
        if (res?.errors) console.table(res.errors);
      }

    } catch (error) {
      console.error('❌ Error:', error);
      toast.error(isRTL ? "حدث خطأ في الاتصال بالسيرفر" : "Connection error");
    } finally {
      setSubmitting(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-purple-600" />
        <p className="text-lg font-medium text-gray-500 animate-pulse">
          {isRTL ? "جاري تحميل البيانات..." : "Loading data..."}
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto" dir={isRTL ? 'rtl' : 'ltr'}>
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-full hover:bg-purple-50"
            onClick={() => navigate('/admin/teachers')}
          >
            <ArrowLeft className={`h-5 w-5 ${isRTL ? 'rotate-180' : ''}`} />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              {isRTL ? "إضافة مدرس جديد" : "Add New Teacher"}
            </h1>
            <p className="text-muted-foreground">
              {isRTL ? "أدخل بيانات المدرس والمواد الموكلة إليه" : "Enter teacher details and assigned subjects"}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Form Fields */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-t-4 border-t-purple-600 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-purple-600" />
                {isRTL ? "المعلومات الشخصية" : "Personal Information"}
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6">
              
              {/* Full Name */}
              <div className="space-y-2">
                <label className="text-sm font-semibold">{t('fullName')} *</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input 
                    className={`${isRTL ? 'pr-3' : 'pl-10'} h-11`}
                    placeholder={isRTL ? "مثال: محمد علي" : "Ex: John Doe"} 
                    required
                    value={formData.fullName}
                    onChange={e => setFormData({...formData, fullName: e.target.value})}
                    disabled={submitting}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Email */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold">{t('email')} *</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input 
                      type="email"
                      className={`${isRTL ? 'pr-3' : 'pl-10'} h-11`}
                      placeholder="email@example.com" 
                      required
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      disabled={submitting}
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold">{t('phone')} *</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input 
                      className={`${isRTL ? 'pr-3' : 'pl-10'} h-11`}
                      placeholder="01xxxxxxxxx" 
                      required
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                      disabled={submitting}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Subject Selection & Actions */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <BookOpen className="h-5 w-5 text-purple-600" />
                {isRTL ? "المواد الدراسية" : "Subjects"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  {isRTL ? "اختر المواد (اضغط Ctrl للتعدد)" : "Select Subjects (Hold Ctrl)"}
                </label>
                <select
                  multiple
                  required
                  className="w-full p-2 border rounded-lg h-48 bg-background focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all"
                  value={formData.subjectOids}
                  onChange={e => setFormData({...formData, subjectOids: Array.from(e.target.selectedOptions, i => i.value)})}
                  disabled={submitting}
                >
                  {subjects.map(s => (
                    <option key={s.oid} value={s.oid} className="p-2 border-b last:border-0">
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="bg-purple-50 dark:bg-purple-950/20 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-purple-700 dark:text-purple-400 mb-2 font-medium">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>{isRTL ? "المواد المختارة" : "Selected"}</span>
                </div>
                <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                  {formData.subjectOids.length}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex flex-col gap-3">
            <Button 
              type="submit" 
              className="w-full h-12 bg-purple-600 hover:bg-purple-700 text-white font-bold shadow-lg shadow-purple-200 dark:shadow-none transition-all active:scale-95"
              disabled={submitting}
            >
              {submitting ? (
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
              ) : (
                <Save className={`h-5 w-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              )}
              {submitting ? t('saving') : (isRTL ? "حفظ المدرس" : "Save Teacher")}
            </Button>
            
            <Button 
              type="button" 
              variant="ghost" 
              className="w-full h-12 text-gray-500"
              onClick={() => navigate('/admin/teachers')}
              disabled={submitting}
            >
              {isRTL ? "إلغاء" : "Cancel"}
            </Button>
          </div>
        </div>

      </form>
    </div>
  );
}