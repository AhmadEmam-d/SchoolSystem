import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Bell, Check, Trash2, Clock, AlertCircle, Info, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';

const mockNotifications = [
  {
    id: '1',
    title: 'New Student Enrollment',
    message: 'A new student "Ahmed Mohamed" has been enrolled in Grade 10-A',
    type: 'success',
    date: '2026-02-28',
    time: '10:30 AM',
    read: false,
    category: 'Students'
  },
  {
    id: '2',
    title: 'Exam Results Published',
    message: 'Mid-term examination results for Grade 11 have been published',
    type: 'info',
    date: '2026-02-28',
    time: '09:15 AM',
    read: false,
    category: 'Exams'
  },
  {
    id: '3',
    title: 'Attendance Alert',
    message: 'Low attendance rate detected in Grade 12-B for the past week',
    type: 'warning',
    date: '2026-02-27',
    time: '04:45 PM',
    read: true,
    category: 'Attendance'
  },
  {
    id: '4',
    title: 'Payment Overdue',
    message: '5 students have overdue fee payments for this semester',
    type: 'error',
    date: '2026-02-27',
    time: '02:20 PM',
    read: true,
    category: 'Finance'
  },
  {
    id: '5',
    title: 'Teacher Leave Request',
    message: 'Ms. Sarah Ahmed has requested leave for next week',
    type: 'info',
    date: '2026-02-27',
    time: '11:00 AM',
    read: true,
    category: 'Teachers'
  },
  {
    id: '6',
    title: 'New Announcement Posted',
    message: 'School maintenance update has been posted for all users',
    type: 'success',
    date: '2026-02-26',
    time: '03:30 PM',
    read: true,
    category: 'Announcements'
  }
];

export function AdminNotifications() {
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState(mockNotifications);
  const [filter, setFilter] = useState('all');

  const unreadCount = notifications.filter(n => !n.read).length;

  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(n => !n.read)
    : notifications;

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'info':
        return <Info className="h-5 w-5 text-blue-600" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-600" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Bell className="h-5 w-5 text-gray-600" />;
    }
  };

  const getNotificationBg = (type, read) => {
    if (read) return 'bg-white dark:bg-gray-800';
    switch (type) {
      case 'info':
        return 'bg-blue-50 dark:bg-blue-900/20';
      case 'warning':
        return 'bg-yellow-50 dark:bg-yellow-900/20';
      case 'success':
        return 'bg-green-50 dark:bg-green-900/20';
      case 'error':
        return 'bg-red-50 dark:bg-red-900/20';
      default:
        return 'bg-gray-50 dark:bg-gray-700';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Students':
        return 'bg-green-100 text-green-800';
      case 'Teachers':
        return 'bg-blue-100 text-blue-800';
      case 'Exams':
        return 'bg-purple-100 text-purple-800';
      case 'Attendance':
        return 'bg-yellow-100 text-yellow-800';
      case 'Finance':
        return 'bg-red-100 text-red-800';
      case 'Announcements':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('notificationsPage')}</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {t('notificationsPageDesc')}
          </p>
        </div>
        <div className="flex gap-3">
          {unreadCount > 0 && (
            <Button variant="outline" onClick={markAllAsRead}>
              <Check className="h-4 w-4 mr-2" />
              {t('markAllAsRead')}
            </Button>
          )}
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('totalNotifications')}</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{notifications.length}</div>
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
              {notifications.length - unreadCount}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          onClick={() => setFilter('all')}
          className={filter === 'all' ? 'bg-purple-600 hover:bg-purple-700' : ''}
        >
          {t('all')} ({notifications.length})
        </Button>
        <Button
          variant={filter === 'unread' ? 'default' : 'outline'}
          onClick={() => setFilter('unread')}
          className={filter === 'unread' ? 'bg-purple-600 hover:bg-purple-700' : ''}
        >
          {t('unread')} ({unreadCount})
        </Button>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">{t('noNotifications')}</p>
            </CardContent>
          </Card>
        ) : (
          filteredNotifications.map((notification) => (
            <Card
              key={notification.id}
              className={`transition-all hover:shadow-md ${getNotificationBg(notification.type, notification.read)}`}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className={`font-semibold ${!notification.read ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                        {notification.title}
                      </h3>
                      <Badge className={getCategoryColor(notification.category)}>
                        {notification.category}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {notification.message}
                    </p>
                    
                    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {notification.time}
                      </span>
                      <span>{new Date(notification.date).toLocaleDateString('ar-EG')}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {!notification.read && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => markAsRead(notification.id)}
                        title={t('markAsRead')}
                      >
                        <Check className="h-4 w-4 text-green-600" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteNotification(notification.id)}
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
