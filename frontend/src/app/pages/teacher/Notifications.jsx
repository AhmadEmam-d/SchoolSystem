import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import {
  Bell, Check, Trash2, Plus, Clock, AlertCircle, Info, CheckCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { api } from '../../lib/api';

export function TeacherNotifications() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  // ================= FETCH =================
  useEffect(() => {
    api.notifications.getAll()
      .then((list) => {
        setNotifications(list || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // ================= COUNTS =================
  const unreadCount = notifications.filter(n => !n.isRead).length;
  const totalCount = notifications.length;

  // ================= FILTER =================
  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.isRead;
    return true;
  });

  // ================= ACTIONS =================

  const markAsRead = (oid) => {
    api.notifications.markAsRead(oid).then(() => {
      setNotifications(prev =>
        prev.map(n => n.oid === oid ? { ...n, isRead: true } : n)
      );
    });
  };

  const markAllAsRead = () => {
    api.notifications.markAllAsRead().then(() => {
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    });
  };

  const deleteNotification = (oid) => {
    api.notifications.delete(oid).then(() => {
      setNotifications(prev => prev.filter(n => n.oid !== oid));
    });
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
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const getBg = (n) => {
    if (n.isRead) return 'bg-white dark:bg-gray-800';
    return 'bg-blue-50 dark:bg-blue-900/20';
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Urgent':
        return 'bg-red-100 text-red-800';
      case 'High':
        return 'bg-orange-100 text-orange-800';
      case 'Normal':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // ================= LOADING =================
  if (loading) {
    return <div className="p-6 text-gray-500">Loading notifications...</div>;
  }

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-foreground">{t('notificationsPage')}</h1>
          <p className="text-muted-foreground">
            {t('notificationsPageDesc')}
          </p>
        </div>

        <div className="flex gap-3">
          <Button onClick={() => navigate('/teacher/notifications/add')}>
            <Plus className="h-4 w-4 mr-2" />
            {t('addNotification') || 'Add Notification'}
          </Button>

          {unreadCount > 0 && (
            <Button variant="outline" onClick={markAllAsRead}>
              <Check className="h-4 w-4 mr-2" />
              {t('markAllAsRead')}
            </Button>
          )}
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('totalNotifications')}</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-teal-600">{totalCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('unreadNotifications')}</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{unreadCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('readNotifications')}</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {totalCount - unreadCount}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* FILTERS */}
      <div className="flex gap-2">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          onClick={() => setFilter('all')}
          className={filter === 'all' ? 'bg-teal-600 hover:bg-teal-700' : ''}
        >
          {t('all')} ({totalCount})
        </Button>
        <Button
          variant={filter === 'unread' ? 'default' : 'outline'}
          onClick={() => setFilter('unread')}
          className={filter === 'unread' ? 'bg-teal-600 hover:bg-teal-700' : ''}
        >
          {t('unread')} ({unreadCount})
        </Button>
      </div>

      {/* LIST */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center space-y-3">
              <Bell className="h-12 w-12 text-muted-foreground/30 mx-auto" />
              <p className="text-muted-foreground">{t('noNotifications')}</p>
            </CardContent>
          </Card>
        ) : (
          filteredNotifications.map((n) => (
            <Card
              key={n.oid}
              className={`transition-all hover:shadow-md ${getBg(n)}`}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="mt-1">
                    {getIcon(n.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className={`font-semibold ${!n.isRead ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {n.title}
                      </h3>
                      <Badge className={getPriorityColor(n.priority)}>
                        {n.priority}
                      </Badge>
                    </div>

                    <p className="text-sm text-muted-foreground mb-2">
                      {n.message}
                    </p>

                    <div className="flex items-center gap-4 text-xs text-muted-foreground/70">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {n.timeAgo}
                      </span>
                      <span>{n.targetRole}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {!n.isRead && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => markAsRead(n.oid)}
                        title={t('markAsRead')}
                      >
                        <Check className="h-4 w-4 text-green-600" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteNotification(n.oid)}
                      title={t('delete')}
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}