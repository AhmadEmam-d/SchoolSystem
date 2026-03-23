import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Users, 
  UserCheck, 
  UserX, 
  GraduationCap,
  Download,
  Filter,
  Search,
  Calendar,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart as PieChartIcon
} from 'lucide-react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export function StudentsSummaryReport() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const [searchQuery, setSearchQuery] = useState('');
  const [filterClass, setFilterClass] = useState('all');
  const [filterGender, setFilterGender] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock Data
  const students = [
    { id: '1', name: 'Ahmed Ali', nameAr: 'أحمد علي', class: 'Grade 10A', gender: 'male', status: 'active', enrollmentDate: '2023-09-01', attendance: 95, performance: 88, age: 15 },
    { id: '2', name: 'Fatima Hassan', nameAr: 'فاطمة حسن', class: 'Grade 10A', gender: 'female', status: 'active', enrollmentDate: '2023-09-01', attendance: 98, performance: 92, age: 15 },
    { id: '3', name: 'Mohamed Salem', nameAr: 'محمد سالم', class: 'Grade 9B', gender: 'male', status: 'active', enrollmentDate: '2023-09-01', attendance: 85, performance: 78, age: 14 },
    { id: '4', name: 'Sara Ahmed', nameAr: 'سارة أحمد', class: 'Grade 11C', gender: 'female', status: 'active', enrollmentDate: '2022-09-01', attendance: 92, performance: 85, age: 16 },
    { id: '5', name: 'Omar Khaled', nameAr: 'عمر خالد', class: 'Grade 10B', gender: 'male', status: 'inactive', enrollmentDate: '2023-09-01', attendance: 65, performance: 60, age: 15 },
    { id: '6', name: 'Nour Ibrahim', nameAr: 'نور إبراهيم', class: 'Grade 12A', gender: 'female', status: 'active', enrollmentDate: '2021-09-01', attendance: 96, performance: 94, age: 17 },
    { id: '7', name: 'Youssef Mahmoud', nameAr: 'يوسف محمود', class: 'Grade 9A', gender: 'male', status: 'active', enrollmentDate: '2023-09-01', attendance: 88, performance: 82, age: 14 },
    { id: '8', name: 'Maryam Osama', nameAr: 'مريم أسامة', class: 'Grade 11B', gender: 'female', status: 'active', enrollmentDate: '2022-09-01', attendance: 94, performance: 89, age: 16 },
    { id: '9', name: 'Karim Tarek', nameAr: 'كريم طارق', class: 'Grade 10A', gender: 'male', status: 'active', enrollmentDate: '2023-09-01', attendance: 90, performance: 86, age: 15 },
    { id: '10', name: 'Layla Mohamed', nameAr: 'ليلى محمد', class: 'Grade 12B', gender: 'female', status: 'graduated', enrollmentDate: '2021-09-01', attendance: 99, performance: 96, age: 17 },
  ];

  // Filtered Students
  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      const matchesSearch = isRTL 
        ? student.nameAr.toLowerCase().includes(searchQuery.toLowerCase())
        : student.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesClass = filterClass === 'all' || student.class === filterClass;
      const matchesGender = filterGender === 'all' || student.gender === filterGender;
      const matchesStatus = filterStatus === 'all' || student.status === filterStatus;
      return matchesSearch && matchesClass && matchesGender && matchesStatus;
    });
  }, [students, searchQuery, filterClass, filterGender, filterStatus, isRTL]);

  // Statistics
  const stats = useMemo(() => {
    const total = students.length;
    const active = students.filter(s => s.status === 'active').length;
    const inactive = students.filter(s => s.status === 'inactive').length;
    const graduated = students.filter(s => s.status === 'graduated').length;
    const avgAttendance = students.reduce((sum, s) => sum + s.attendance, 0) / total;
    const avgPerformance = students.reduce((sum, s) => sum + s.performance, 0) / total;

    return {
      total,
      active,
      inactive,
      graduated,
      avgAttendance: avgAttendance.toFixed(1),
      avgPerformance: avgPerformance.toFixed(1)
    };
  }, [students]);

  // Chart Data - Gender Distribution
  const genderData = [
    { 
      name: isRTL ? 'ذكور' : 'Male', 
      value: students.filter(s => s.gender === 'male').length,
      color: '#8B5CF6'
    },
    { 
      name: isRTL ? 'إناث' : 'Female', 
      value: students.filter(s => s.gender === 'female').length,
      color: '#EC4899'
    },
  ];

  // Chart Data - Class Distribution
  const classData = Array.from(new Set(students.map(s => s.class))).map(className => ({
    name: className,
    students: students.filter(s => s.class === className).length
  }));

  // Chart Data - Status Distribution
  const statusData = [
    { 
      name: isRTL ? 'نشط' : 'Active', 
      value: stats.active,
      color: '#10B981'
    },
    { 
      name: isRTL ? 'غير نشط' : 'Inactive', 
      value: stats.inactive,
      color: '#EF4444'
    },
    { 
      name: isRTL ? 'متخرج' : 'Graduated', 
      value: stats.graduated,
      color: '#3B82F6'
    },
  ];

  const handleExport = (format) => {
    // Prepare CSV content
    const headers = ['Student ID', 'Name', 'Class', 'Gender', 'Status', 'Enrollment Date', 'Attendance %', 'Performance %', 'Age'];
    const csvContent = [
      headers.join(','),
      ...filteredStudents.map(student => [
        student.id,
        `\"${isRTL ? student.nameAr : student.name}\"`,
        student.class,
        student.gender,
        getStatusText(student.status),
        student.enrollmentDate,
        student.attendance,
        student.performance,
        student.age
      ].join(','))
    ].join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `students_summary_${format}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'inactive':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'graduated':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getStatusText = (status) => {
    if (isRTL) {
      switch (status) {
        case 'active': return 'نشط';
        case 'inactive': return 'غير نشط';
        case 'graduated': return 'متخرج';
        default: return status;
      }
    }
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {isRTL ? 'تقرير ملخص الطلاب' : 'Students Summary Report'}
          </h1>
          <p className="text-muted-foreground mt-1">
            {isRTL ? 'تقرير شامل عن جميع الطلاب في المدرسة' : 'Comprehensive overview of all students in the school'}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => handleExport('pdf')}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Download className="h-4 w-4" />
            {isRTL ? 'تصدير PDF' : 'Export PDF'}
          </button>
          <button
            onClick={() => handleExport('excel')}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="h-4 w-4" />
            {isRTL ? 'تصدير Excel' : 'Export Excel'}
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-card rounded-lg shadow-md p-6 border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                {isRTL ? 'إجمالي الطلاب' : 'Total Students'}
              </p>
              <p className="text-3xl font-bold text-foreground mt-2">{stats.total}</p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Users className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <div className="flex items-center gap-1 mt-4 text-sm">
            <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
            <span className="text-green-600 dark:text-green-400 font-medium">8%</span>
            <span className="text-muted-foreground">
              {isRTL ? 'عن العام الماضي' : 'vs last year'}
            </span>
          </div>
        </div>

        <div className="bg-card rounded-lg shadow-md p-6 border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                {isRTL ? 'الطلاب النشطون' : 'Active Students'}
              </p>
              <p className="text-3xl font-bold text-foreground mt-2">{stats.active}</p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <UserCheck className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <div className="flex items-center gap-1 mt-4 text-sm">
            <span className="text-muted-foreground">
              {((stats.active / stats.total) * 100).toFixed(1)}% {isRTL ? 'من الإجمالي' : 'of total'}
            </span>
          </div>
        </div>

        <div className="bg-card rounded-lg shadow-md p-6 border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                {isRTL ? 'متوسط الحضور' : 'Avg Attendance'}
              </p>
              <p className="text-3xl font-bold text-foreground mt-2">{stats.avgAttendance}%</p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Calendar className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="flex items-center gap-1 mt-4 text-sm">
            <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
            <span className="text-green-600 dark:text-green-400 font-medium">5%</span>
            <span className="text-muted-foreground">
              {isRTL ? 'عن الشهر الماضي' : 'vs last month'}
            </span>
          </div>
        </div>

        <div className="bg-card rounded-lg shadow-md p-6 border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                {isRTL ? 'متوسط الأداء' : 'Avg Performance'}
              </p>
              <p className="text-3xl font-bold text-foreground mt-2">{stats.avgPerformance}%</p>
            </div>
            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <GraduationCap className="h-8 w-8 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
          <div className="flex items-center gap-1 mt-4 text-sm">
            <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />
            <span className="text-red-600 dark:text-red-400 font-medium">2%</span>
            <span className="text-muted-foreground">
              {isRTL ? 'عن الشهر الماضي' : 'vs last month'}
            </span>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gender Distribution */}
        <div className="bg-card rounded-lg shadow-md p-6 border border-border">
          <div className="flex items-center gap-2 mb-6">
            <PieChartIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            <h2 className="text-xl font-bold text-foreground">
              {isRTL ? 'توزيع الطلاب حسب النوع' : 'Gender Distribution'}
            </h2>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={genderData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {genderData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--foreground)' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Status Distribution */}
        <div className="bg-card rounded-lg shadow-md p-6 border border-border">
          <div className="flex items-center gap-2 mb-6">
            <PieChartIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            <h2 className="text-xl font-bold text-foreground">
              {isRTL ? 'توزيع الطلاب حسب الحالة' : 'Status Distribution'}
            </h2>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--foreground)' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Class Distribution */}
        <div className="bg-card rounded-lg shadow-md p-6 border border-border lg:col-span-2">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            <h2 className="text-xl font-bold text-foreground">
              {isRTL ? 'توزيع الطلاب حسب الصف' : 'Class Distribution'}
            </h2>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={classData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="name" tick={{ fill: 'var(--muted-foreground)' }} />
              <YAxis tick={{ fill: 'var(--muted-foreground)' }} />
              <Tooltip contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--foreground)' }} />
              <Legend />
              <Bar 
                dataKey="students" 
                fill="var(--chart-4)" 
                name={isRTL ? 'الطلاب' : 'Students'}
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-card rounded-lg shadow-md p-6 border border-border">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          <h2 className="text-xl font-bold text-foreground">
            {isRTL ? 'تصفية البيانات' : 'Filter Data'}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground rtl:left-auto rtl:right-3" />
            <input
              type="text"
              placeholder={isRTL ? 'بحث عن طالب...' : 'Search student...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-input-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent rtl:pr-10 rtl:pl-4"
            />
          </div>

          {/* Class Filter */}
          <select
            value={filterClass}
            onChange={(e) => setFilterClass(e.target.value)}
            className="px-4 py-2 border border-border rounded-lg bg-input-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="all">{isRTL ? 'كل الصفوف' : 'All Classes'}</option>
            {Array.from(new Set(students.map(s => s.class))).map(className => (
              <option key={className} value={className}>{className}</option>
            ))}
          </select>

          {/* Gender Filter */}
          <select
            value={filterGender}
            onChange={(e) => setFilterGender(e.target.value)}
            className="px-4 py-2 border border-border rounded-lg bg-input-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="all">{isRTL ? 'كل الأنواع' : 'All Genders'}</option>
            <option value="male">{isRTL ? 'ذكور' : 'Male'}</option>
            <option value="female">{isRTL ? 'إناث' : 'Female'}</option>
          </select>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-border rounded-lg bg-input-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="all">{isRTL ? 'كل الحالات' : 'All Status'}</option>
            <option value="active">{isRTL ? 'نشط' : 'Active'}</option>
            <option value="inactive">{isRTL ? 'غير نشط' : 'Inactive'}</option>
            <option value="graduated">{isRTL ? 'متخرج' : 'Graduated'}</option>
          </select>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-card rounded-lg shadow-md border border-border overflow-hidden">
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-bold text-foreground">
            {isRTL ? 'قائمة الطلاب' : 'Students List'}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {isRTL ? `عرض ${filteredStudents.length} من أصل ${students.length} طالب` : `Showing ${filteredStudents.length} of ${students.length} students`}
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider rtl:text-right">
                  {isRTL ? 'الاسم' : 'Name'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider rtl:text-right">
                  {isRTL ? 'الصف' : 'Class'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider rtl:text-right">
                  {isRTL ? 'النوع' : 'Gender'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider rtl:text-right">
                  {isRTL ? 'الحالة' : 'Status'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider rtl:text-right">
                  {isRTL ? 'الحضور' : 'Attendance'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider rtl:text-right">
                  {isRTL ? 'الأداء' : 'Performance'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider rtl:text-right">
                  {isRTL ? 'تاريخ الالتحاق' : 'Enrollment Date'}
                </th>
              </tr>
            </thead>
            <tbody className="bg-card divide-y divide-border">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                          <span className="text-purple-600 dark:text-purple-400 font-medium">
                            {isRTL ? student.nameAr.charAt(0) : student.name.charAt(0)}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4 rtl:ml-0 rtl:mr-4">
                        <div className="text-sm font-medium text-foreground">
                          {isRTL ? student.nameAr : student.name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          ID: {student.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-foreground">{student.class}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-foreground">
                      {isRTL ? (student.gender === 'male' ? 'ذكر' : 'أنثى') : student.gender}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(student.status)}`}>
                      {getStatusText(student.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-muted rounded-full h-2 w-20">
                        <div
                          className={`h-2 rounded-full ${
                            student.attendance >= 90 
                              ? 'bg-green-500' 
                              : student.attendance >= 70 
                              ? 'bg-yellow-500' 
                              : 'bg-red-500'
                          }`}
                          style={{ width: `${student.attendance}%` }}
                        />
                      </div>
                      <span className="text-sm text-foreground">{student.attendance}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-muted rounded-full h-2 w-20">
                        <div
                          className={`h-2 rounded-full ${
                            student.performance >= 85 
                              ? 'bg-green-500' 
                              : student.performance >= 70 
                              ? 'bg-yellow-500' 
                              : 'bg-red-500'
                          }`}
                          style={{ width: `${student.performance}%` }}
                        />
                      </div>
                      <span className="text-sm text-foreground">{student.performance}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                    {new Date(student.enrollmentDate).toLocaleDateString(isRTL ? 'ar-EG' : 'en-US')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredStudents.length === 0 && (
          <div className="p-12 text-center">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              {isRTL ? 'لا توجد بيانات مطابقة للفلاتر المحددة' : 'No students found matching the selected filters'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}