import React from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Clock, User, FileText, Bell, TrendingUp } from 'lucide-react';

const getActivities = (t) => [
  {
    id: 1,
    type: 'student_added',
    title: t('studentAdded'),
    description: 'Ahmed Mohamed - Grade 1 Primary',
    descriptionAr: 'أحمد محمد - الصف الأول الابتدائي',
    user: t('mainAdmin'),
    timestamp: '2024-02-28 10:30 AM',
    icon: User,
    color: 'text-blue-600',
    bg: 'bg-blue-100',
  },
  {
    id: 2,
    type: 'announcement',
    title: t('announcementPublished'),
    description: 'Mid-term vacation announcement',
    descriptionAr: 'إعلان إجازة منتصف الفصل الدراسي',
    user: t('mainAdmin'),
    timestamp: '2024-02-28 09:15 AM',
    icon: Bell,
    color: 'text-purple-600',
    bg: 'bg-purple-100',
  },
  {
    id: 3,
    type: 'teacher_updated',
    title: t('teacherUpdated'),
    description: 'Mr. Mohamed Ali - Teaching subjects updated',
    descriptionAr: 'أ. محمد علي - تم تحديث المواد التدريسية',
    user: t('mainAdmin'),
    timestamp: '2024-02-27 03:45 PM',
    icon: FileText,
    color: 'text-green-600',
    bg: 'bg-green-100',
  },
  {
    id: 4,
    type: 'class_created',
    title: t('classCreated'),
    description: 'Grade 3 Primary - Section D',
    descriptionAr: 'الصف الثالث الابتدائي - شعبة D',
    user: t('mainAdmin'),
    timestamp: '2024-02-27 02:20 PM',
    icon: User,
    color: 'text-indigo-600',
    bg: 'bg-indigo-100',
  },
  {
    id: 5,
    type: 'exam_scheduled',
    title: t('examScheduled'),
    description: 'Mathematics Exam - Grade 5',
    descriptionAr: 'امتحان الرياضيات - الصف الخامس',
    user: 'Mrs. Fatima Hassan',
    userAr: 'أ. فاطمة حسن',
    timestamp: '2024-02-27 11:00 AM',
    icon: FileText,
    color: 'text-orange-600',
    bg: 'bg-orange-100',
  },
  {
    id: 6,
    type: 'parent_registered',
    title: t('parentRegistered'),
    description: 'Mohamed Ahmed - Parent of 2 students',
    descriptionAr: 'محمد أحمد - ولي أمر طالبين',
    user: t('admissionsOffice'),
    timestamp: '2024-02-26 04:30 PM',
    icon: User,
    color: 'text-pink-600',
    bg: 'bg-pink-100',
  },
  {
    id: 7,
    type: 'attendance_marked',
    title: t('attendanceMarked'),
    description: '450 students present, 15 students absent',
    descriptionAr: '450 طالب حاضر، 15 طالب غائب',
    user: t('systemAuto'),
    timestamp: '2024-02-26 08:00 AM',
    icon: Clock,
    color: 'text-cyan-600',
    bg: 'bg-cyan-100',
  },
  {
    id: 8,
    type: 'grades_published',
    title: t('gradesPublished'),
    description: 'Mid-term exam - All grades',
    descriptionAr: 'امتحان منتصف الفصل - جميع المراحل',
    user: t('examsOffice'),
    timestamp: '2024-02-25 02:00 PM',
    icon: TrendingUp,
    color: 'text-emerald-600',
    bg: 'bg-emerald-100',
  },
];

export function RecentActivity() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  
  const activities = getActivities(t);
  const isRTL = i18n.language === 'ar';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/admin/dashboard')}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-300" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-purple-600 dark:text-purple-400">{t('recentActivity')}</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">{t('recentActivityDesc')}</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t('today')}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">24</p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Clock className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t('thisWeek')}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">156</p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t('thisMonth')}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">892</p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <FileText className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t('totalActivities')}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">4,567</p>
            </div>
            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <Bell className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t('activityLog')}</h2>
        </div>

        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {activities.map((activity) => (
            <div key={activity.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
              <div className="flex items-start gap-4">
                <div className={`p-3 ${activity.bg} rounded-lg shrink-0`}>
                  <activity.icon className={`h-5 w-5 ${activity.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    {activity.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {isRTL ? activity.descriptionAr : activity.description}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-500">
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {activity.userAr && isRTL ? activity.userAr : activity.user}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {activity.timestamp}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-6 border-t border-gray-200 dark:border-gray-700 text-center">
          <button className="text-purple-600 dark:text-purple-400 hover:underline font-medium">
            {t('loadMoreActivities')}
          </button>
        </div>
      </div>
    </div>
  );
}
