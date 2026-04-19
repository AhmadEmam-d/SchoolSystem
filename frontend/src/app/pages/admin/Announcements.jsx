import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Megaphone, Calendar, User, Trash2, Edit } from 'lucide-react';
import { api } from '../../lib/api';

export function AdminAnnouncements() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const [announcements, setAnnouncements] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch Data
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [summaryRes, announcementsRes] = await Promise.all([
        api.announcements.getSummary(),
        api.announcements.getAll()
      ]);

      setSummary(summaryRes.data);
      setAnnouncements(announcementsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Delete
  const handleDelete = async (oid) => {
    try {
      await api.announcements.delete(oid);
      setAnnouncements(prev => prev.filter(a => a.oid !== oid));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="space-y-6">

      {/* ================= HEADER ================= */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t('announcementsPage')}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {t('announcementsPageDesc')}
          </p>
        </div>

        <Button onClick={() => navigate('/admin/announcements/add')}>
          <Megaphone className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
          {t('newAnnouncement')}
        </Button>
      </div>

      {/* ================= SUMMARY ================= */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-gray-500">{t('total')}</p>
              <h2 className="text-2xl font-bold">{summary.totalAnnouncements}</h2>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-gray-500">{t('published')}</p>
              <h2 className="text-2xl font-bold text-green-600">
                {summary.publishedCount}
              </h2>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-gray-500">{t('draft')}</p>
              <h2 className="text-2xl font-bold text-yellow-600">
                {summary.draftCount}
              </h2>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-gray-500">{t('urgent')}</p>
              <h2 className="text-2xl font-bold text-red-600">
                {summary.urgentCount}
              </h2>
            </CardContent>
          </Card>

        </div>
      )}

      {/* ================= LIST ================= */}
      <div className="grid grid-cols-1 gap-4">

        {announcements.length === 0 ? (
          <div className="text-center p-10 text-gray-500">
            No announcements found
          </div>
        ) : (
          announcements.map((announcement) => (
            <Card
              key={announcement.oid}
              className="hover:shadow-md transition-shadow dark:border-gray-700 dark:bg-gray-800"
            >
              <CardHeader className="flex flex-row items-start justify-between pb-2">
                <div className="space-y-1">

                  {/* Title */}
                  <CardTitle className="text-xl dark:text-white">
                    {announcement.title}
                  </CardTitle>

                  {/* Info */}
                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">

                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {announcement.authorName}
                    </span>

                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {announcement.publishDate?.split('T')[0]}
                    </span>

                    <span className="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-xs">
                      {announcement.target}
                    </span>

                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      announcement.priority === 'Urgent'
                        ? 'bg-red-100 text-red-600'
                        : announcement.priority === 'High'
                        ? 'bg-orange-100 text-orange-600'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {announcement.priority}
                    </span>

                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon">
                    <Edit className="h-4 w-4 text-gray-500" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(announcement.oid)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {isRTL ? announcement.contentAr : announcement.contentEn}
                </p>
              </CardContent>
            </Card>
          ))
        )}

      </div>
    </div>
  );
}