import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Search, Send, Clock } from 'lucide-react';

const getSentMessages = (t) => [
  {
    id: 1,
    recipient: 'Mr. Mohamed Ali',
    recipientAr: 'أ. محمد علي',
    recipientType: t('teacher'),
    subject: 'Teaching Staff Meeting',
    subjectAr: 'اجتماع الهيئة التدريسية',
    preview: 'Please attend the teaching staff meeting next Sunday...',
    previewAr: 'يرجى الحضور لاجتماع الهيئة التدريسية يوم الأحد القادم...',
    sentDate: '2024-02-28 10:30 AM',
    status: t('read'),
  },
  {
    id: 2,
    recipient: 'Fatima Hassan (Parent)',
    recipientAr: 'فاطمة حسن (ولي أمر)',
    recipientType: t('parent'),
    subject: 'Regarding Student Attendance',
    subjectAr: 'بخصوص حضور الطالب',
    preview: 'We would like to inform you that your son Ahmed is absent today...',
    previewAr: 'نود إبلاغكم بأن ابنكم أحمد غائب اليوم...',
    sentDate: '2024-02-27 02:15 PM',
    status: t('read'),
  },
  {
    id: 3,
    recipient: 'All Teachers',
    recipientAr: 'جميع المعلمين',
    recipientType: t('group'),
    subject: 'Attendance System Update',
    subjectAr: 'تحديث نظام الحضور',
    preview: 'The electronic attendance system has been updated...',
    previewAr: 'تم تحديث نظام تسجيل الحضور الإلكتروني...',
    sentDate: '2024-02-26 09:00 AM',
    status: t('sent'),
  },
  {
    id: 4,
    recipient: 'Ahmed Said (Student)',
    recipientAr: 'أحمد سعيد (طالب)',
    recipientType: t('student'),
    subject: 'Congratulations on Excellence',
    subjectAr: 'تهنئة بالتفوق',
    preview: 'Congratulations! You scored the highest in the math exam...',
    previewAr: 'مبروك! لقد حصلت على أعلى الدرجات في امتحان الرياضيات...',
    sentDate: '2024-02-25 11:45 AM',
    status: t('read'),
  },
];

export function SentMessages() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');

  const sentMessages = getSentMessages(t);
  const isRTL = i18n.language === 'ar';

  const filteredMessages = sentMessages.filter(msg =>
    (isRTL ? msg.recipientAr : msg.recipient).toLowerCase().includes(searchTerm.toLowerCase()) ||
    (isRTL ? msg.subjectAr : msg.subject).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/messages')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-purple-600 dark:text-purple-400">{t('sentMessages')}</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">{t('sentMessagesDesc')}</p>
          </div>
        </div>
        <button
          onClick={() => navigate('/admin/messages')}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
        >
          <Send className="h-5 w-5" />
          {t('newMessage')}
        </button>
      </div>

      {/* Search */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
        <div className="relative">
          <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400`} />
          <input
            type="text"
            placeholder={t('searchSentMessages')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white`}
          />
        </div>
      </div>

      {/* Messages List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 divide-y divide-gray-200 dark:divide-gray-700">
        {filteredMessages.length === 0 ? (
          <div className="p-12 text-center">
            <Send className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">{t('noSentMessages')}</p>
          </div>
        ) : (
          filteredMessages.map((message) => (
            <div
              key={message.id}
              className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {isRTL ? message.recipientAr : message.recipient}
                    </h3>
                    <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full">
                      {message.recipientType}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      message.status === t('read')
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400'
                        : 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400'
                    }`}>
                      {message.status}
                    </span>
                  </div>
                  <p className="font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {isRTL ? message.subjectAr : message.subject}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                    {isRTL ? message.previewAr : message.preview}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 shrink-0">
                  <Clock className="h-4 w-4" />
                  {message.sentDate}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
