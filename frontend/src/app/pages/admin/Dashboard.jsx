import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import {
  Users,
  Briefcase,
  DollarSign,
  Bell,
  Calendar,
  TrendingUp,
  UserPlus,
  FileText,
  ArrowRight,
  ArrowLeft,
  Activity
} from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useLanguage } from '../../context/LanguageContext';
import { getChartColors } from '../../lib/uiConstants';
import { api } from '../../../app/lib/api';

// بيانات ثابتة للرسوم البيانية (يمكن جلبها من API لاحقاً)
const attendanceData = [
  { name: 'Jan', students: 400, attendance: 90 },
  { name: 'Feb', students: 410, attendance: 92 },
  { name: 'Mar', students: 415, attendance: 88 },
  { name: 'Apr', students: 420, attendance: 95 },
  { name: 'May', students: 425, attendance: 94 },
  { name: 'Jun', students: 430, attendance: 91 },
];

const financialData = [
  { name: 'Q1', income: 4000, expense: 2400 },
  { name: 'Q2', income: 3000, expense: 1398 },
  { name: 'Q3', income: 2000, expense: 9800 },
  { name: 'Q4', income: 2780, expense: 3908 },
];

export function AdminDashboard() {
  const [stats, setStats] = useState({
    students: { count: 0, change: 0 },
    teachers: { count: 0, change: 0 },
    parents: { count: 0, change: 0 },
    revenue: { amount: 0, change: 0 }
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();
  const isRTL = currentLanguage === 'ar';
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  // Get theme-aware colors
  const chartColors = getChartColors();

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const [studentsRes, teachersRes, parentsRes] = await Promise.all([
          api.students.getAll(),
          api.teachers.getAll(),
          api.parents.getAll()
        ]);

        const studentsCount = studentsRes.success ? studentsRes.data.length : (Array.isArray(studentsRes) ? studentsRes.length : 0);
        const teachersCount = teachersRes.success ? teachersRes.data.length : (Array.isArray(teachersRes) ? teachersRes.length : 0);
        const parentsCount = parentsRes.success ? parentsRes.data.length : (Array.isArray(parentsRes) ? parentsRes.length : 0);

        setStats({
          students: { count: studentsCount, change: 0 },
          teachers: { count: teachersCount, change: 0 },
          parents: { count: parentsCount, change: 0 },
          revenue: { amount: 0, change: 0 } // يمكن جلبها من API لاحقاً
        });

        // جلب النشاطات الأخيرة (يمكن جلبها من API لاحقاً)
        // مؤقتاً نستخدم بيانات وهمية
        setRecentActivity([
          { id: 1, user: 'System', action: 'student enrolled', target: 'New student', time: '2 hours ago' },
          { id: 2, user: 'Admin', action: 'updated', target: 'Class schedule', time: '3 hours ago' },
        ]);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const getTranslatedAction = (action) => {
    switch (action) {
      case 'submitted homework': return t('actionSubmittedHomework');
      case 'graded': return t('actionGraded');
      case 'scored 100%': return t('actionScored100');
      case 'paid fees': return t('actionPaidFees');
      case 'student enrolled': return t('actionStudentEnrolled');
      case 'updated': return t('actionUpdated');
      default: return action;
    }
  };

  const statsCards = [
    { 
      label: t('totalStudents'), 
      value: stats.students.count, 
      icon: Users, 
      color: 'text-blue-600', 
      bg: 'bg-blue-100 dark:bg-blue-900/30', 
      link: '/admin/students' 
    },
    { 
      label: t('totalTeachers'), 
      value: stats.teachers.count, 
      icon: Briefcase, 
      color: 'text-purple-600', 
      bg: 'bg-purple-100 dark:bg-purple-900/30', 
      link: '/admin/teachers' 
    },
    { 
      label: t('totalParents'), 
      value: stats.parents.count, 
      icon: Users, 
      color: 'text-green-600', 
      bg: 'bg-green-100 dark:bg-green-900/30', 
      link: '/admin/parents' 
    },
    { 
      label: t('revenue'), 
      value: `$${stats.revenue.amount.toLocaleString()}`, 
      icon: DollarSign, 
      color: 'text-yellow-600', 
      bg: 'bg-yellow-100 dark:bg-yellow-900/30', 
      link: '/admin/reports' 
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500 dark:text-gray-400">{t('loading')}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t('adminDashboard')}</h1>
          <p className="text-muted-foreground mt-1">{t('adminDashboardDesc')}</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <Link to="/admin/announcements">
            <Button variant="outline" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              {t('announcements')}
            </Button>
          </Link>
          <div className="flex items-center gap-2 text-sm text-muted-foreground bg-card px-4 py-2 rounded-lg border border-border">
            <Calendar className="h-4 w-4" />
            <span>{new Date().toLocaleDateString(isRTL ? 'ar-SA' : 'en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, i) => (
          <Link key={i} to={stat.link}>
            <Card className="border-none shadow-md hover:shadow-lg transition-shadow cursor-pointer dark:bg-gray-800">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                  <h3 className="text-2xl font-bold text-foreground mt-1">{stat.value}</h3>
                  {stat.value > 0 && stat.change !== 0 && (
                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      +{Math.abs(stat.change)}% {t('fromLastMonth')}
                    </p>
                  )}
                </div>
                <div className={`h-12 w-12 rounded-full flex items-center justify-center ${stat.bg} ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="border-none shadow-md dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="dark:text-white">{t('quickActions')}</CardTitle>
          <CardDescription className="dark:text-gray-400">{t('commonAdministrativeTasks')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link to="/admin/students/add">
              <Button variant="outline" className="w-full h-auto flex flex-col items-center gap-2 py-4 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700">
                <UserPlus className="h-6 w-6 text-blue-600" />
                <span className="text-sm font-medium">{t('addStudent')}</span>
              </Button>
            </Link>
            <Link to="/admin/teachers/add">
              <Button variant="outline" className="w-full h-auto flex flex-col items-center gap-2 py-4 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700">
                <Briefcase className="h-6 w-6 text-purple-600" />
                <span className="text-sm font-medium">{t('addTeacher')}</span>
              </Button>
            </Link>
            <Link to="/admin/announcements/add">
              <Button variant="outline" className="w-full h-auto flex flex-col items-center gap-2 py-4 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700">
                <Bell className="h-6 w-6 text-green-600" />
                <span className="text-sm font-medium">{t('newAnnouncement')}</span>
              </Button>
            </Link>
            <Link to="/admin/reports">
              <Button variant="outline" className="w-full h-auto flex flex-col items-center gap-2 py-4 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700">
                <FileText className="h-6 w-6 text-orange-600" />
                <span className="text-sm font-medium">{t('generateReport')}</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Chart */}
        <Card className="border-none shadow-md dark:bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="dark:text-white">{t('attendanceOverview')}</CardTitle>
              <CardDescription className="dark:text-gray-400">{t('monthlyStudentAttendance')}</CardDescription>
            </div>
            <Link to="/admin/attendance" className="text-sm text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 flex items-center gap-1">
              {t('viewDetails')} <ArrowIcon className="h-4 w-4" />
            </Link>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={attendanceData} key="attendance-chart">
                  <defs key="defs">
                    <linearGradient id="colorAttendance" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={chartColors.primary} stopOpacity={0.1}/>
                      <stop offset="95%" stopColor={chartColors.primary} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid key="grid" strokeDasharray="3 3" vertical={false} stroke={chartColors.grid} />
                  <XAxis key="xaxis" dataKey="name" axisLine={false} tickLine={false} tick={{fill: chartColors.axis}} />
                  <YAxis key="yaxis" axisLine={false} tickLine={false} tick={{fill: chartColors.axis}} />
                  <Tooltip key="tooltip" contentStyle={{ backgroundColor: chartColors.tooltip, border: `1px solid ${chartColors.tooltipBorder}` }} />
                  <Area key="area" type="monotone" dataKey="attendance" stroke={chartColors.primary} fillOpacity={1} fill="url(#colorAttendance)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Financial Chart */}
        <Card className="border-none shadow-md dark:bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="dark:text-white">{t('financialSummary')}</CardTitle>
              <CardDescription className="dark:text-gray-400">{t('incomeVsExpenses')}</CardDescription>
            </div>
            <Link to="/admin/reports" className="text-sm text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 flex items-center gap-1">
              {t('viewDetails')} <ArrowIcon className="h-4 w-4" />
            </Link>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={financialData} key="finance-chart">
                  <CartesianGrid key="grid" strokeDasharray="3 3" vertical={false} stroke={chartColors.grid} />
                  <XAxis key="xaxis" dataKey="name" axisLine={false} tickLine={false} tick={{fill: chartColors.axis}} />
                  <YAxis key="yaxis" axisLine={false} tickLine={false} tick={{fill: chartColors.axis}} />
                  <Tooltip key="tooltip" contentStyle={{ backgroundColor: chartColors.tooltip, border: `1px solid ${chartColors.tooltipBorder}` }} />
                  <Bar key="income" dataKey="income" fill={chartColors.secondary} radius={[4, 4, 0, 0]} />
                  <Bar key="expense" dataKey="expense" fill={chartColors.danger} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="col-span-1 lg:col-span-2 border-none shadow-md dark:bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="dark:text-white">{t('recentActivity')}</CardTitle>
              <CardDescription className="dark:text-gray-400">{t('latestUpdates')}</CardDescription>
            </div>
            <Button variant="outline" size="sm" className="dark:border-gray-600 dark:text-gray-200" asChild>
              <Link to="/admin/dashboard/activity">
                {t('viewAll')}
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-4">
                  <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mt-1 shrink-0">
                    <Activity className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">
                      <span className="font-bold">{activity.user}</span>{' '}
                      {getTranslatedAction(activity.action)}{' '}
                      <span className="text-indigo-600 dark:text-indigo-400">{activity.target}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* AI SmartTutor Card */}
        <Card className="col-span-1 border-none shadow-md bg-gradient-to-br from-indigo-600 to-purple-700 text-white">
          <CardHeader>
            <CardTitle className="text-white">{t('smartTutor')}</CardTitle>
            <CardDescription className="text-indigo-100">{t('aiUsageAnalytics')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-indigo-100">{t('dailyQueries')}</span>
                <span className="text-2xl font-bold">1,245</span>
              </div>
              <div className="h-2 bg-indigo-500/30 rounded-full overflow-hidden">
                <div className="h-full w-[75%] bg-white rounded-full"></div>
              </div>

              <div className="flex items-center justify-between mt-4">
                <span className="text-sm font-medium text-indigo-100">{t('activeStudents')}</span>
                <span className="text-2xl font-bold">85%</span>
              </div>
              <div className="h-2 bg-indigo-500/30 rounded-full overflow-hidden">
                <div className="h-full w-[85%] bg-green-400 rounded-full"></div>
              </div>

              <div className="flex items-center justify-between mt-4">
                <span className="text-sm font-medium text-indigo-100">{t('avgResponseTime')}</span>
                <span className="text-2xl font-bold">1.2s</span>
              </div>
              <div className="h-2 bg-indigo-500/30 rounded-full overflow-hidden">
                <div className="h-full w-[90%] bg-yellow-400 rounded-full"></div>
              </div>

              <div className="mt-6 pt-6 border-t border-indigo-500/30">
                <Link to="/admin/reports" className="block text-center w-full py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors">
                  {t('viewDetailedReport')}
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}