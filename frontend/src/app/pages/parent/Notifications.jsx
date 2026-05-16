import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import {
  Bell, AlertTriangle, Info, CheckCircle, Megaphone,
  Check, Trash2, Clock, AlertCircle
} from 'lucide-react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { api } from '../../lib/api';

export  function ParentNotifications() {
  const { t } = useTranslation();

  const [activeTab, setActiveTab] = useState('alerts');
  const [filter, setFilter] = useState('all');
  const [notifications, setNotifications] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  // ================= FETCH =================
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const summaryData = await api.notifications.getSummary();
      setSummary(summaryData);

      const list = await api.notifications.getAll();
      setNotifications(list || []);

      // If your API has a separate announcements endpoint, use it here
      // const announcementList = await api.announcements.getAll();
      // setAnnouncements(announcementList || []);

      // Fallback static announcements if no API endpoint
      setAnnouncements([
        {
          oid: 1,
          title: 'Parent-Teacher Meeting',
          message: 'Annual parent-teacher meeting scheduled for March 20, 2026. Please confirm your attendance.',
          date: 'March 15, 2026',
          priority: 'high',
        },
        {
          oid: 2,
          title: 'School Sports Day',
          message: 'Annual sports day will be held on April 5, 2026. All students are encouraged to participate.',
          date: 'March 10, 2026',
          priority: 'medium',
        },
        {
          oid: 3,
          title: 'Mid-Term Break',
          message: 'School will be closed from March 25–29 for mid-term break.',
          date: 'March 8, 2026',
          priority: 'low',
        },
        {
          oid: 4,
          title: 'New Library Hours',
          message: 'The school library will now be open until 6 PM on weekdays.',
          date: 'March 5, 2026',
          priority: 'low',
        },
      ]);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  // ================= COUNTS =================
  const unreadCount = summary?.unreadCount ?? notifications.filter(n => !n.isRead).length;
  const totalCount = summary?.totalCount ?? notifications.length;
  const readCount = summary?.readCount ?? (totalCount - unreadCount);

  // ================= FILTER =================
  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.isRead;
    return true;
  });

  // ================= ACTIONS =================
  const markAsRead = async (oid) => {
    try {
      await api.notifications.markAsRead(oid);
      setNotifications(prev =>
        prev.map(n => n.oid === oid ? { ...n, isRead: true } : n)
      );
      const newSummary = await api.notifications.getSummary();
      setSummary(newSummary);
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.notifications.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      const newSummary = await api.notifications.getSummary();
      setSummary(newSummary);
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const deleteNotification = async (oid) => {
    try {
      await api.notifications.delete(oid);
      setNotifications(prev => prev.filter(n => n.oid !== oid));
      const newSummary = await api.notifications.getSummary();
      setSummary(newSummary);
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  // ================= UI HELPERS =================
  const getAlertIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const getPriorityLabel = (priority) => {
    switch (priority) {
      case 'high':
      case 'urgent':
        return t('priorityHigh');
      case 'medium':
      case 'normal':
        return t('priorityMedium');
      default:
        return t('priorityLow');
    }
  };

  const getPriorityBadgeClass = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'urgent':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'high':
        return 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400';
      case 'medium':
      case 'normal':
        return 'text-amber-600 bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  const getNotificationBg = (n) => {
    if (n.isRead) return 'bg-white dark:bg-gray-800';
    return 'bg-blue-50 dark:bg-blue-900/20';
  };

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-12rem)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-500">{t('loading') || 'Loading notifications...'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-foreground">{t('notificationsPageTitle') || 'Notifications'}</h1>
          <p className="text-muted-foreground">{t('notificationsDesc') || 'Stay updated with your latest notifications'}</p>
        </div>
        <div className="flex items-center gap-3">
          {activeTab === 'alerts' && unreadCount > 0 && (
            <Button variant="outline" onClick={markAllAsRead} className="gap-2">
              <Check className="h-4 w-4" />
              {t('markAllAsRead') || 'Mark All as Read'}
            </Button>
          )}
          <Bell className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('totalNotifications') || 'Total'}
            </CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{totalCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('unreadNotifications') || 'Unread'}
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{unreadCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('readNotifications') || 'Read'}
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{readCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* TABS */}
      <div className="flex gap-2 border-b border-border">
        <button
          onClick={() => setActiveTab('alerts')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'alerts'
              ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          {t('alertsTab') || 'Alerts'}
        </button>
        <button
          onClick={() => setActiveTab('announcements')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'announcements'
              ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          {t('announcementsTab') || 'Announcements'}
        </button>
      </div>

      {/* ALERTS TAB */}
      {activeTab === 'alerts' && (
        <div className="space-y-4">
          {/* Filter Buttons */}
          <div className="flex gap-2">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              onClick={() => setFilter('all')}
              className={filter === 'all' ? 'bg-indigo-600 hover:bg-indigo-700' : ''}
            >
              {t('all') || 'All'} ({totalCount})
            </Button>
            <Button
              variant={filter === 'unread' ? 'default' : 'outline'}
              onClick={() => setFilter('unread')}
              className={filter === 'unread' ? 'bg-indigo-600 hover:bg-indigo-700' : ''}
            >
              {t('unread') || 'Unread'} ({unreadCount})
            </Button>
          </div>

          {/* Notifications List */}
          <div className="space-y-3">
            {filteredNotifications.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-gray-500">
                  <Bell className="h-12 w-12 mx-auto mb-3 opacity-40" />
                  <p className="font-medium">{t('noNotifications') || 'No notifications'}</p>
                  <p className="text-sm mt-1">{t('noNotificationsDesc') || "You're all caught up!"}</p>
                </CardContent>
              </Card>
            ) : (
              filteredNotifications.map((n, index) => (
                <motion.div
                  key={n.oid}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className={`transition hover:shadow-md border-none shadow-md ${getNotificationBg(n)}`}>
                    <CardContent className="p-5 flex gap-4">
                      {/* Icon */}
                      <div className="flex-shrink-0 mt-1">
                        {getAlertIcon(n.type)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-start justify-between gap-2 mb-1">
                          <h3 className={`font-semibold ${!n.isRead ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                            {n.title}
                          </h3>
                          <div className="flex items-center gap-2">
                            {n.priority && (
                              <Badge className={getPriorityBadgeClass(n.priority)}>
                                {getPriorityLabel(n.priority)}
                              </Badge>
                            )}
                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                              {n.timeAgo || (n.createdAt ? new Date(n.createdAt).toLocaleString() : '')}
                            </span>
                          </div>
                        </div>

                        <p className="text-sm text-muted-foreground mb-2">{n.message}</p>

                        <div className="flex flex-wrap items-center gap-3">
                          {n.child && (
                            <span className="text-xs px-2 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
                              {n.child}
                            </span>
                          )}
                          {n.timeAgo && (
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {n.timeAgo}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {!n.isRead && (
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => markAsRead(n.oid)}
                            title={t('markAsRead') || 'Mark as read'}
                            className="text-green-600 hover:text-green-700 hover:bg-green-50"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => deleteNotification(n.oid)}
                          title={t('delete') || 'Delete'}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ANNOUNCEMENTS TAB */}
      {activeTab === 'announcements' && (
        <div className="space-y-4">
          {announcements.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-gray-500">
                <Megaphone className="h-12 w-12 mx-auto mb-3 opacity-40" />
                <p className="font-medium">{t('noAnnouncements') || 'No announcements'}</p>
              </CardContent>
            </Card>
          ) : (
            announcements.map((announcement, index) => (
              <motion.div
                key={announcement.oid}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="border-none shadow-md">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Megaphone className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between gap-4">
                          <h3 className="font-semibold text-foreground">{announcement.title}</h3>
                          <span className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${getPriorityBadgeClass(announcement.priority)}`}>
                            {getPriorityLabel(announcement.priority)}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{announcement.message}</p>
                        <span className="text-xs text-muted-foreground">{announcement.date}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      )}
    </div>
  );
}