import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Bell, Check, Trash2, Clock, AlertCircle, Info, CheckCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { api } from '../../lib/api';

export function StudentNotifications() {
  const { t } = useTranslation();

  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);

  // ================= FETCH =================
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // جلب الملخص (total, unread, read)
      const summaryData = await api.notifications.getSummary();
      setSummary(summaryData);

      // جلب كل الإشعارات (الـ API بيرجع للطالب اشعاراته بس)
      const list = await api.notifications.getAll();
      setNotifications(list || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  // ================= COUNTS =================
  const unreadCount = summary?.unreadCount || notifications.filter(n => !n.isRead).length;
  const totalCount = summary?.totalCount || notifications.length;
  const readCount = summary?.readCount || (totalCount - unreadCount);

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
        prev.map(n =>
          n.oid === oid ? { ...n, isRead: true } : n
        )
      );
      // تحديث الملخص
      const newSummary = await api.notifications.getSummary();
      setSummary(newSummary);
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.notifications.markAllAsRead();
      setNotifications(prev =>
        prev.map(n => ({ ...n, isRead: true }))
      );
      // تحديث الملخص
      const newSummary = await api.notifications.getSummary();
      setSummary(newSummary);
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const deleteNotification = async (oid) => {
    try {
      await api.notifications.delete(oid);
      setNotifications(prev =>
        prev.filter(n => n.oid !== oid)
      );
      // تحديث الملخص
      const newSummary = await api.notifications.getSummary();
      setSummary(newSummary);
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  // ================= UI HELPERS =================
  const getIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'info':
        return <Info className="h-5 w-5 text-blue-600" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-600" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const getBg = (n) => {
    if (n.isRead) return 'bg-white dark:bg-gray-800';
    return 'bg-blue-50 dark:bg-blue-900/20';
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'urgent':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'high':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
      case 'normal':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
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
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t('notificationsPage') || 'Notifications'}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {t('notificationsPageDesc') || 'Stay updated with your latest notifications'}
          </p>
        </div>

        {unreadCount > 0 && (
          <Button variant="outline" onClick={markAllAsRead} className="gap-2">
            <Check className="h-4 w-4" />
            {t('markAllAsRead') || 'Mark All as Read'}
          </Button>
        )}
      </div>

      {/* STATS - نفس ديزاين الادمن */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('totalNotifications') || 'Total'}
            </CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {totalCount}
            </div>
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
            <div className="text-2xl font-bold text-red-600">
              {unreadCount}
            </div>
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
            <div className="text-2xl font-bold text-green-600">
              {readCount}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* FILTERS - نفس ديزاين الادمن */}
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

      {/* LIST - نفس ديزاين الادمن */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-gray-500">
              <Bell className="h-12 w-12 mx-auto mb-3 opacity-40" />
              <p className="font-medium">{t('noNotifications') || 'No notifications'}</p>
              <p className="text-sm mt-1">
                {t('noNotificationsDesc') || 'You\'re all caught up!'}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredNotifications.map((n) => (
            <Card
              key={n.oid}
              className={`transition hover:shadow-md ${getBg(n)}`}
            >
              <CardContent className="p-5 flex gap-4">
                {/* ICON */}
                <div className="flex-shrink-0 mt-1">
                  {getIcon(n.type)}
                </div>

                {/* CONTENT */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-1">
                    <h3 className={`font-semibold ${!n.isRead ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                      {n.title}
                    </h3>

                    {n.priority && (
                      <Badge className={getPriorityColor(n.priority)}>
                        {n.priority}
                      </Badge>
                    )}
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {n.message}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 dark:text-gray-500">
                    {n.timeAgo && (
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {n.timeAgo}
                      </span>
                    )}
                    {n.createdAt && !n.timeAgo && (
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(n.createdAt).toLocaleString()}
                      </span>
                    )}
                    {n.type && (
                      <span className="capitalize">Type: {n.type}</span>
                    )}
                  </div>
                </div>

                {/* ACTIONS */}
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
          ))
        )}
      </div>
    </div>
  );
}