import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { ANNOUNCEMENTS } from '../../lib/mockData';
import { Megaphone, Calendar, User, Trash2, Edit } from 'lucide-react';

export function AdminAnnouncements() {
  const [announcements, setAnnouncements] = useState(ANNOUNCEMENTS);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const handleCreate = (e) => {
    e.preventDefault();
    // Simulate creation
    const newAnnouncement = {
      id: `new-${Date.now()}`,
      title: 'New Announcement',
      content: 'This is a simulated new announcement.',
      date: new Date().toISOString().split('T')[0],
      author: 'Admin',
      role: 'all'
    };
    setAnnouncements([newAnnouncement, ...announcements]);
  };

  const handleDelete = (id) => {
    setAnnouncements(announcements.filter(a => a.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('announcementsPage')}</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">{t('announcementsPageDesc')}</p>
        </div>
        <Button onClick={() => navigate('/admin/announcements/add')}>
          <Megaphone className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
          {t('newAnnouncement')}
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {announcements.map((announcement) => (
          <Card key={announcement.id} className="hover:shadow-md transition-shadow dark:border-gray-700 dark:bg-gray-800">
            <CardHeader className="flex flex-row items-start justify-between pb-2">
              <div className="space-y-1">
                <CardTitle className="text-xl dark:text-white">{announcement.title}</CardTitle>
                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {announcement.author}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {announcement.date}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-xs font-medium uppercase dark:text-gray-300">
                    {Array.isArray(announcement.role) ? announcement.role.join(', ') : announcement.role}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Edit className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(announcement.id)}>
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{announcement.content}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
