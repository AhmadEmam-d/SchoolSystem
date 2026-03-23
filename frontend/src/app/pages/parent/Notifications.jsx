import React, { useState } from 'react';
import { Card, CardContent } from '../../components/ui/card';
import { Bell, AlertTriangle, Info, CheckCircle, Megaphone } from 'lucide-react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';

export function ParentNotifications() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('alerts');

  const alerts = [
    {
      id: 1,
      type: 'warning',
      title: 'Low Attendance Alert',
      message: "Bart Simpson's attendance has dropped below 85% this month",
      time: '2 hours ago',
      child: 'Bart Simpson',
    },
    {
      id: 2,
      type: 'success',
      title: 'Exam Score Improvement',
      message: 'Lisa Simpson scored 98% in Mathematics midterm exam',
      time: '5 hours ago',
      child: 'Lisa Simpson',
    },
    {
      id: 3,
      type: 'info',
      title: 'Homework Reminder',
      message: 'Science project submission due in 2 days',
      time: '1 day ago',
      child: 'Bart Simpson',
    },
    {
      id: 4,
      type: 'warning',
      title: 'Fee Payment Due',
      message: 'Term fee payment due date is approaching (March 15)',
      time: '2 days ago',
      child: 'All Children',
    },
  ];

  const announcements = [
    {
      id: 1,
      title: 'Parent-Teacher Meeting',
      message: 'Annual parent-teacher meeting scheduled for March 20, 2026. Please confirm your attendance.',
      date: 'March 15, 2026',
      priority: 'high',
    },
    {
      id: 2,
      title: 'School Sports Day',
      message: 'Annual sports day will be held on April 5, 2026. All students are encouraged to participate.',
      date: 'March 10, 2026',
      priority: 'medium',
    },
    {
      id: 3,
      title: 'Mid-Term Break',
      message: 'School will be closed from March 25–29 for mid-term break.',
      date: 'March 8, 2026',
      priority: 'low',
    },
    {
      id: 4,
      title: 'New Library Hours',
      message: 'The school library will now be open until 6 PM on weekdays.',
      date: 'March 5, 2026',
      priority: 'low',
    },
  ];

  const getAlertIcon = (type) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getPriorityLabel = (priority) => {
    switch (priority) {
      case 'high': return t('priorityHigh');
      case 'medium': return t('priorityMedium');
      default: return t('priorityLow');
    }
  };

  const getPriorityBadgeClass = (priority) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400';
      case 'medium':
        return 'text-amber-600 bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-foreground">{t('notificationsPageTitle')}</h1>
          <p className="text-muted-foreground">{t('notificationsDesc')}</p>
        </div>
        <Bell className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border">
        <button
          onClick={() => setActiveTab('alerts')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'alerts'
              ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          {t('alertsTab')}
        </button>
        <button
          onClick={() => setActiveTab('announcements')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'announcements'
              ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          {t('announcementsTab')}
        </button>
      </div>

      {/* Alerts Tab */}
      {activeTab === 'alerts' && (
        <div className="space-y-4">
          {alerts.map((alert, index) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="border-none shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="mt-0.5">{getAlertIcon(alert.type)}</div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between gap-4">
                        <h3 className="font-semibold text-foreground">{alert.title}</h3>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">{alert.time}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{alert.message}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs px-2 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
                          {alert.child}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Announcements Tab */}
      {activeTab === 'announcements' && (
        <div className="space-y-4">
          {announcements.map((announcement, index) => (
            <motion.div
              key={announcement.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="border-none shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Megaphone className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mt-0.5" />
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
          ))}
        </div>
      )}
    </div>
  );
}
