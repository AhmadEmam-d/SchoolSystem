import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  GraduationCap, 
  TrendingUp, 
  TrendingDown, 
  Award,
  Download,
  Filter,
  Search,
  BarChart3,
  Users
} from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export function GradesReport() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const [searchQuery, setSearchQuery] = useState('');
  const [filterClass, setFilterClass] = useState('all');
  const [filterSubject, setFilterSubject] = useState('all');

  // Mock Data - Grades by Subject
  const gradesData = [
    { subject: 'Mathematics', subjectAr: 'الرياضيات', average: 85, highest: 98, lowest: 65, students: 45 },
    { subject: 'Science', subjectAr: 'العلوم', average: 82, highest: 95, lowest: 60, students: 45 },
    { subject: 'English', subjectAr: 'الإنجليزية', average: 78, highest: 92, lowest: 58, students: 45 },
    { subject: 'Arabic', subjectAr: 'العربية', average: 88, highest: 99, lowest: 70, students: 45 },
    { subject: 'History', subjectAr: 'التاريخ', average: 80, highest: 94, lowest: 62, students: 45 },
    { subject: 'Geography', subjectAr: 'الجغرافيا', average: 79, highest: 90, lowest: 59, students: 45 },
  ];

  // Mock Data - Student Grades
  const studentGrades = [
    { id: '1', name: 'Ahmed Ali', nameAr: 'أحمد علي', class: 'Grade 10A', math: 92, science: 88, english: 85, arabic: 95, history: 87, geography: 83, average: 88.3 },
    { id: '2', name: 'Fatima Hassan', nameAr: 'فاطمة حسن', class: 'Grade 10A', math: 95, science: 92, english: 88, arabic: 97, history: 90, geography: 86, average: 91.3 },
    { id: '3', name: 'Mohamed Salem', nameAr: 'محمد سالم', class: 'Grade 9B', math: 78, science: 75, english: 72, arabic: 82, history: 76, geography: 74, average: 76.2 },
    { id: '4', name: 'Sara Ahmed', nameAr: 'سارة أحمد', class: 'Grade 11C', math: 85, science: 83, english: 80, arabic: 88, history: 84, geography: 81, average: 83.5 },
    { id: '5', name: 'Omar Khaled', nameAr: 'عمر خالد', class: 'Grade 10B', math: 68, science: 65, english: 62, arabic: 72, history: 66, geography: 64, average: 66.2 },
  ];

  // Statistics
  const statistics = {
    totalStudents: 150,
    averageGrade: 82.5,
    topPerformers: 25,
    needsSupport: 18,
  };

  // Chart Data
  const chartData = gradesData.map(item => ({
    name: isRTL ? item.subjectAr : item.subject,
    average: item.average,
    highest: item.highest,
  }));

  const handleExportReport = () => {
    // Create CSV data
    const csvData = [];
    
    csvData.push(`"${t('gradesReport')}"`);
    csvData.push(`"${t('generatedDate')}: ${new Date().toLocaleDateString(isRTL ? 'ar-EG' : 'en-US')}"`);
    csvData.push('');
    
    // Add statistics
    csvData.push(`"${t('totalStudents')}","${statistics.totalStudents}"`);
    csvData.push(`"${t('averageGrade')}","${statistics.averageGrade}%"`);
    csvData.push('');
    
    // Add subject averages
    csvData.push(`"${t('subject')}","${t('average')}","${t('highest')}","${t('lowest')}","${t('totalStudents')}"`);
    gradesData.forEach(item => {
      const subjectName = isRTL ? item.subjectAr : item.subject;
      csvData.push(`"${subjectName}","${item.average}%","${item.highest}%","${item.lowest}%","${item.students}"`);
    });
    
    // Create blob and download
    const csvContent = csvData.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `grades_report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t('gradesReport')}</h1>
          <p className="text-muted-foreground mt-1">{t('gradesReportDesc')}</p>
        </div>
        <button
          onClick={handleExportReport}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Download className="h-4 w-4" />
          {t('exportReport')}
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-card rounded-lg shadow-md p-6 border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{t('totalStudents')}</p>
              <p className="text-2xl font-bold text-foreground mt-1">{statistics.totalStudents}</p>
            </div>
            <Users className="h-10 w-10 text-blue-600 dark:text-blue-400" />
          </div>
        </div>

        <div className="bg-card rounded-lg shadow-md p-6 border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{t('averageGrade')}</p>
              <p className="text-2xl font-bold text-foreground mt-1">{statistics.averageGrade}%</p>
            </div>
            <BarChart3 className="h-10 w-10 text-green-600 dark:text-green-400" />
          </div>
        </div>

        <div className="bg-card rounded-lg shadow-md p-6 border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{t('topPerformers')}</p>
              <p className="text-2xl font-bold text-foreground mt-1">{statistics.topPerformers}</p>
            </div>
            <TrendingUp className="h-10 w-10 text-purple-600 dark:text-purple-400" />
          </div>
        </div>

        <div className="bg-card rounded-lg shadow-md p-6 border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{t('needsSupport')}</p>
              <p className="text-2xl font-bold text-foreground mt-1">{statistics.needsSupport}</p>
            </div>
            <TrendingDown className="h-10 w-10 text-red-600 dark:text-red-400" />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Average Grades by Subject */}
        <div className="bg-card rounded-lg shadow-md p-6 border border-border">
          <h2 className="text-xl font-semibold text-foreground mb-4">{t('averageGradesBySubject')}</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="name" tick={{ fill: 'var(--muted-foreground)' }} />
              <YAxis tick={{ fill: 'var(--muted-foreground)' }} />
              <Tooltip contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--foreground)' }} />
              <Legend />
              <Bar dataKey="average" fill="var(--chart-1)" name={t('average')} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Highest Grades by Subject */}
        <div className="bg-card rounded-lg shadow-md p-6 border border-border">
          <h2 className="text-xl font-semibold text-foreground mb-4">{t('highestGradesBySubject')}</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="name" tick={{ fill: 'var(--muted-foreground)' }} />
              <YAxis tick={{ fill: 'var(--muted-foreground)' }} />
              <Tooltip contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--foreground)' }} />
              <Legend />
              <Line type="monotone" dataKey="highest" stroke="var(--chart-2)" strokeWidth={2} name={t('highest')} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Subject Details Table */}
      <div className="bg-card rounded-lg shadow-md overflow-hidden border border-border">
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">{t('subjectPerformance')}</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {t('subject')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {t('average')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {t('highest')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {t('lowest')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {t('totalStudents')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {gradesData.map((item, index) => (
                <tr key={index} className="hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                    {isRTL ? item.subjectAr : item.subject}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      item.average >= 85 ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                      item.average >= 75 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                      'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {item.average}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                    {item.highest}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                    {item.lowest}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                    {item.students}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Students Table */}
      <div className="bg-card rounded-lg shadow-md overflow-hidden border border-border">
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
            <Award className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            {t('topStudents')}
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {t('studentName')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {t('class')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {t('average')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {studentGrades
                .sort((a, b) => b.average - a.average)
                .slice(0, 5)
                .map((student, index) => (
                  <tr key={student.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-primary font-semibold">
                            {index + 1}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-foreground">
                            {isRTL ? student.nameAr : student.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                      {student.class}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                        {student.average.toFixed(1)}%
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}