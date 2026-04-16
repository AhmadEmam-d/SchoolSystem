import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/app/lib/api'; // تأكد من صحة مسار ملف الـ api لديك
import { Button } from "@/app/components/ui/button";

export function AddSubject() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '', // الحقل المطلوب من الـ API
  });

  // ================= إرسال البيانات للـ API =================
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // التحقق من وجود بيانات
    if (!formData.name.trim()) {
      toast.error(t('nameRequired') || 'Subject name is required');
      return;
    }

    setIsSubmitting(true);
    try {
      // إرسال كائن يحتوي فقط على name كما هو مطلوب في الـ JSON
      const response = await api.subjects.create({
        name: formData.name,
      });

      if (response.success || response.oid) {
        toast.success(t('subjectAddedSuccess') || 'Subject added successfully!');
        navigate('/admin/subjects');
      }
    } catch (error) {
      console.error('Add Subject Error:', error);
      toast.error(t('errorAddingSubject') || 'Failed to add subject');
    } finally {
      setIsSubmitting(false);
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
          onClick={() => navigate('/admin/subjects')}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <ArrowLeft className={`h-5 w-5 text-gray-600 dark:text-gray-300 ${isRTL ? 'rotate-180' : ''}`} />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-purple-600 dark:text-purple-400">
            {t('addNewSubject')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {t('addNewSubjectDesc')}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            {t('subjectInformation')}
          </h2>
          
          <div className="grid grid-cols-1 gap-6">
            {/* Subject Name Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('subjectName')} *
              </label>
              <input
                type="text"
                name="name" // مطابقة للحقل المطلوب في الـ API
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white outline-none transition-all"
                placeholder={t('subjectPlaceholder') || "e.g. Mathematics"}
              />
              <p className="text-xs text-muted-foreground italic">
                {t('subjectNameHelp') || "Enter the official name of the academic subject."}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/admin/subjects')}
            disabled={isSubmitting}
          >
            {t('cancel')}
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-purple-600 hover:bg-purple-700 text-white min-w-[140px]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin ml-2 mr-2" />
                {t('saving') || 'Saving...'}
              </>
            ) : (
              <>
                <Save className={`h-5 w-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                {t('saveSubject')}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router';
// import { useTranslation } from 'react-i18next';
// import { ArrowLeft, Save } from 'lucide-react';
// import { toast } from 'sonner';

// export function AddSubject() {
//   const navigate = useNavigate();
//   const { t } = useTranslation();
//   const [formData, setFormData] = useState({
//     subjectName: '',
//     subjectNameAr: '',
//     description: '',
//     category: '',
//     passingGrade: '50',
//   });

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     toast.success(t('subjectAddedSuccess'));
//     navigate('/admin/subjects');
//   };

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   return (
//     <div className="p-6 max-w-4xl mx-auto">
//       <div className="mb-6 flex items-center gap-4">
//         <button
//           onClick={() => navigate('/admin/subjects')}
//           className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
//         >
//           <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-300" />
//         </button>
//         <div>
//           <h1 className="text-3xl font-bold text-purple-600 dark:text-purple-400">{t('addNewSubject')}</h1>
//           <p className="text-gray-600 dark:text-gray-400 mt-1">{t('addNewSubjectDesc')}</p>
//         </div>
//       </div>

//       <form onSubmit={handleSubmit} className="space-y-6">
//         <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
//           <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{t('subjectInformation')}</h2>
          
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                 {t('subjectName')} *
//               </label>
//               <input
//                 type="text"
//                 name="subjectName"
//                 value={formData.subjectName}
//                 onChange={handleChange}
//                 required
//                 className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
//                 placeholder={t('subjectPlaceholder')}
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                 {t('subjectNameAr')} *
//               </label>
//               <input
//                 type="text"
//                 name="subjectNameAr"
//                 value={formData.subjectNameAr}
//                 onChange={handleChange}
//                 required
//                 className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
//                 placeholder={t('subjectPlaceholder')}
//                 dir="rtl"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                 {t('category')} *
//               </label>
//               <select
//                 name="category"
//                 value={formData.category}
//                 onChange={handleChange}
//                 required
//                 className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
//               >
//                 <option value="">{t('selectCategory')}</option>
//                 <option value="science">{t('scienceCategory')}</option>
//                 <option value="math">{t('mathCategory')}</option>
//                 <option value="language">{t('languageCategory')}</option>
//                 <option value="social">{t('socialCategory')}</option>
//                 <option value="arts">{t('artsCategory')}</option>
//                 <option value="sports">{t('sportsCategory')}</option>
//                 <option value="technology">{t('technologyCategory')}</option>
//                 <option value="religion">{t('religionCategory')}</option>
//               </select>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                 {t('passingGrade')} *
//               </label>
//               <input
//                 type="number"
//                 name="passingGrade"
//                 value={formData.passingGrade}
//                 onChange={handleChange}
//                 required
//                 min="0"
//                 max="100"
//                 className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
//                 placeholder={t('placeholderPassingGrade')}
//               />
//             </div>

//             <div className="md:col-span-2">
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                 {t('description')}
//               </label>
//               <textarea
//                 name="description"
//                 value={formData.description}
//                 onChange={handleChange}
//                 rows={3}
//                 className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
//                 placeholder={t('subjectDescriptionPlaceholder')}
//               />
//             </div>
//           </div>
//         </div>

//         <div className="flex items-center justify-end gap-4">
//           <button
//             type="button"
//             onClick={() => navigate('/admin/subjects')}
//             className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
//           >
//             {t('cancel')}
//           </button>
//           <button
//             type="submit"
//             className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center gap-2"
//           >
//             <Save className="h-5 w-5" />
//             {t('saveSubject')}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }