import React from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Bot, TrendingUp, Users, MessageSquare, Clock, BarChart3 } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const getUsageData = (t) => [
  { month: t('january'), students: 245, teachers: 42, parents: 180 },
  { month: t('february'), students: 389, teachers: 48, parents: 256 },
  { month: t('march'), students: 512, teachers: 50, parents: 312 },
  { month: t('april'), students: 678, teachers: 50, parents: 425 },
  { month: t('may'), students: 834, teachers: 50, parents: 567 },
];

const getTopicsData = (t) => [
  { name: t('mathematics'), value: 450, color: '#8b5cf6' },
  { name: t('science'), value: 320, color: '#3b82f6' },
  { name: t('arabicLanguage'), value: 290, color: '#10b981' },
  { name: t('english'), value: 180, color: '#f59e0b' },
  { name: t('others'), value: 120, color: '#6b7280' },
];

export function AIAnalytics() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  
  const usageData = getUsageData(t);
  const topicsData = getTopicsData(t);
  const isRTL = i18n.language === 'ar';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/admin/dashboard')}
          className="p-2 hover:bg-muted rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-muted-foreground" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-purple-600 dark:text-purple-400 flex items-center gap-2">
            <Bot className="h-8 w-8" />
            {t('aiAnalytics')}
          </h1>
          <p className="text-muted-foreground mt-1">{t('aiAnalyticsDesc')}</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-card rounded-xl p-6 border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{t('totalConversations')}</p>
              <p className="text-3xl font-bold text-purple-600 dark:text-purple-400 mt-1">2,834</p>
              <p className="text-sm text-green-600 dark:text-green-400 mt-1">+12.5% {t('thisMonthGrowth')}</p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <MessageSquare className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl p-6 border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{t('activeUsers')}</p>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-1">834</p>
              <p className="text-sm text-green-600 dark:text-green-400 mt-1">+8.3% {t('thisWeekGrowth')}</p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl p-6 border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{t('avgSessionTime')}</p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-1">14 {t('minutes')}</p>
              <p className="text-sm text-green-600 dark:text-green-400 mt-1">+2 {t('minutes')}</p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <Clock className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl p-6 border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{t('satisfactionRate')}</p>
              <p className="text-3xl font-bold text-orange-600 dark:text-orange-400 mt-1">94%</p>
              <p className="text-sm text-green-600 dark:text-green-400 mt-1">+3% {t('thisMonthGrowth')}</p>
            </div>
            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <TrendingUp className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Usage Trend */}
        <div className="bg-card rounded-xl p-6 border border-border">
          <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            {t('monthlyUsageTrend')}
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={usageData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fill: 'var(--muted-foreground)' }} />
              <YAxis tick={{ fill: 'var(--muted-foreground)' }} />
              <Tooltip contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--foreground)' }} />
              <Legend />
              <Line type="monotone" dataKey="students" stroke="var(--chart-4)" name={t('students')} strokeWidth={2} />
              <Line type="monotone" dataKey="teachers" stroke="var(--chart-1)" name={t('teachers')} strokeWidth={2} />
              <Line type="monotone" dataKey="parents" stroke="var(--chart-2)" name={t('parents')} strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Topics Distribution */}
        <div className="bg-card rounded-xl p-6 border border-border">
          <h2 className="text-xl font-bold text-foreground mb-4">{t('mostRequestedTopics')}</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={topicsData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {topicsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--foreground)' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* User Type Comparison */}
        <div className="bg-card rounded-xl p-6 border border-border">
          <h2 className="text-xl font-bold text-foreground mb-4">{t('usageByUserType')}</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={usageData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fill: 'var(--muted-foreground)' }} />
              <YAxis tick={{ fill: 'var(--muted-foreground)' }} />
              <Tooltip contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--foreground)' }} />
              <Legend />
              <Bar dataKey="students" fill="var(--chart-4)" name={t('students')} />
              <Bar dataKey="teachers" fill="var(--chart-1)" name={t('teachers')} />
              <Bar dataKey="parents" fill="var(--chart-2)" name={t('parents')} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Questions */}
        <div className="bg-card rounded-xl p-6 border border-border">
          <h2 className="text-xl font-bold text-foreground mb-4">{t('mostCommonQuestions')}</h2>
          <div className="space-y-4">
            {[
              { key: 'q1', count: 156 },
              { key: 'q2', count: 142 },
              { key: 'q3', count: 128 },
              { key: 'q4', count: 115 },
              { key: 'q5', count: 98 },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <span className="text-sm text-foreground">
                  {t(item.key)}
                </span>
                <span className="text-sm font-semibold text-purple-600 dark:text-purple-400">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}