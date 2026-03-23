import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Bell, Check, Trash2, Clock, AlertCircle, Info, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';

const mockNotifications = [
  {
    id: '1',
    title: 'New Assignment Submission',
    message: 'Ahmed Mohamed has submitted homework for Math - Chapter 5',
    type: 'success',
    date: '2026-03-01',
    time: '10:30 AM',
    read: false,
    category: 'Homework'
  },
  {
    id: '2',
    title: 'Class Schedule Update',
    message: 'Your Thursday 2nd period class has been moved to Room 205',
    type: 'warning',
    date: '2026-03-01',
    time: '09:15 AM',
    read: false,
    category: 'Schedule'
  },
  {
    id: '3',
    title: 'Exam Grading Reminder',
    message: 'Grade 10 Mid-term Math exam grading deadline is tomorrow',
    type: 'warning',
    date: '2026-02-28',
    time: '04:45 PM',
    read: true,
    category: 'Exams'
  },
  {
    id: '4',
    title: 'Low Attendance Alert',
    message: 'Student Sara Ahmed has been absent for 3 consecutive days',
    type: 'error',
    date: '2026-02-28',
    time: '02:20 PM',
    read: true,
    category: 'Attendance'
  },
  {
    id: '5',
    title: 'Parent Meeting Request',
    message: 'Mr. Mohamed Ali has requested a meeting regarding his son\'s progress',
    type: 'info',
    date: '2026-02-27',
    time: '11:00 AM',
    read: true,
    category: 'Messages'
  },
  {
    id: '6',
    title: 'New Lesson Materials',
    message: 'New teaching materials for Physics Chapter 8 have been uploaded',
    type: 'success',
    date: '2026-02-26',
    time: '03:30 PM',
    read: true,
    category: 'Materials'
  }
];

export function TeacherNotifications() {
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
    if (read) return '';
    switch (type) {
      case 'info':    return 'bg-blue-50 dark:bg-blue-900/20';
      case 'warning': return 'bg-yellow-50 dark:bg-yellow-900/20';
      case 'success': return 'bg-green-50 dark:bg-green-900/20';
      case 'error':   return 'bg-red-50 dark:bg-red-900/20';
      default:        return 'bg-muted/50';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Homework':   return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'Schedule':   return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      case 'Exams':      return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'Attendance': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'Messages':   return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'Materials':  return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300';
      default:           return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-foreground">{t('notificationsPage')}</h1>
          <p className="text-muted-foreground">
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
            <div className="text-2xl font-bold text-teal-600">{notifications.length}</div>
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
          className={filter === 'all' ? 'bg-teal-600 hover:bg-teal-700' : ''}
        >
          {t('all')} ({notifications.length})
        </Button>
        <Button
          variant={filter === 'unread' ? 'default' : 'outline'}
          onClick={() => setFilter('unread')}
          className={filter === 'unread' ? 'bg-teal-600 hover:bg-teal-700' : ''}
        >
          {t('unread')} ({unreadCount})
        </Button>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center space-y-3">
              <Bell className="h-12 w-12 text-muted-foreground/30 mx-auto" />
              <p className="text-muted-foreground">{t('noNotifications')}</p>
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
                      <h3 className={`font-semibold ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {notification.title}
                      </h3>
                      <Badge className={getCategoryColor(notification.category)}>
                        {notification.category}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-2">
                      {notification.message}
                    </p>
                    
                    <div className="flex items-center gap-4 text-xs text-muted-foreground/70">
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