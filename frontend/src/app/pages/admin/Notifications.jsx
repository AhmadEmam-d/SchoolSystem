import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Bell, Check, Trash2, Clock, AlertCircle, Info, CheckCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { api } from '../../lib/api';

export function AdminNotifications() {
  const { t } = useTranslation();

  const [notifications, setNotifications] = useState([]);
  const [summary, setSummary] = useState(null);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  // 🔥 Fetch Data
  useEffect(() => {
    Promise.all([
      api.notifications.getAll(),
      api.notifications.getSummary()
    ])
      .then(([list, summary]) => {
        setNotifications(list || []);
        setSummary(summary);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const unreadCount = summary?.unreadCount || 0;
  const totalCount = summary?.totalCount || notifications.length;

  // 🔥 Filters
  const filteredNotifications =
    filter === 'unread'
      ? notifications.filter(n => !n.isRead)
      : notifications;

  // 🔥 Actions
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

  // 🔥 UI Helpers
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

  // 🔥 Loading
  if (loading) {
    return <div className="p-6 text-gray-500">Loading notifications...</div>;
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Notifications</h1>
          <p className="text-gray-500 mt-1">
            Manage system alerts and updates
          </p>
        </div>

        {unreadCount > 0 && (
          <Button variant="outline" onClick={markAllAsRead}>
            <Check className="h-4 w-4 mr-2" />
            Mark All as Read
          </Button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {totalCount}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Unread</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {unreadCount}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Read</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {totalCount - unreadCount}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          onClick={() => setFilter('all')}
        >
          All ({totalCount})
        </Button>

        <Button
          variant={filter === 'unread' ? 'default' : 'outline'}
          onClick={() => setFilter('unread')}
        >
          Unread ({unreadCount})
        </Button>
      </div>

      {/* Notifications */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center text-gray-500">
              <Bell className="h-10 w-10 mx-auto mb-2 opacity-40" />
              No notifications
            </CardContent>
          </Card>
        ) : (
          filteredNotifications.map((n) => (
            <Card
              key={n.oid}
              className={`transition hover:shadow-md ${getBg(n)}`}
            >
              <CardContent className="p-4 flex gap-4">

                {/* Icon */}
                <div>{getIcon(n.type)}</div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className={`font-semibold ${!n.isRead ? 'text-black' : 'text-gray-500'}`}>
                      {n.title}
                    </h3>

                    <Badge className={getPriorityColor(n.priority)}>
                      {n.priority}
                    </Badge>
                  </div>

                  <p className="text-sm text-gray-600 mb-2">
                    {n.message}
                  </p>

                  <div className="text-xs text-gray-500 flex gap-4">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {n.timeAgo}
                    </span>
                    <span>{n.targetRole}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  {!n.isRead && (
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => markAsRead(n.oid)}
                    >
                      <Check className="h-4 w-4 text-green-600" />
                    </Button>
                  )}

                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => deleteNotification(n.oid)}
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
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