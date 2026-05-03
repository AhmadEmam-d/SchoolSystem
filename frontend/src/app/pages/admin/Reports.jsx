import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { api } from '../../../app/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Download, FileText, TrendingUp, Users, Loader2, Calendar, BookOpen, DollarSign, Activity } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';
import { toast } from 'sonner';

export function AdminReports() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  // State for data
  const [loading, setLoading] = useState(true);
  const [academicData, setAcademicData] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [gradesData, setGradesData] = useState([]);
  const [studentsSummary, setStudentsSummary] = useState(null);
  const [financialData, setFinancialData] = useState(null);
  const [teacherActivity, setTeacherActivity] = useState([]);
  
  // State for filters
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  
  // State for lists
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  
  // Dialog states
  const [showStudentReport, setShowStudentReport] = useState(false);
  const [showTeacherReport, setShowTeacherReport] = useState(false);
  const [showFinancialReport, setShowFinancialReport] = useState(false);
  const [generating, setGenerating] = useState(false);
  
  // Report form states
  const [studentReportForm, setStudentReportForm] = useState({
    studentOid: '',
    classOid: '',
    fromDate: '',
    toDate: '',
    includeGrades: true,
    includeAttendance: true
  });
  
  const [teacherReportForm, setTeacherReportForm] = useState({
    teacherOid: '',
    fromDate: '',
    toDate: '',
    includeActivity: true
  });
  
  const [financialReportForm, setFinancialReportForm] = useState({
    year: new Date().getFullYear(),
    includeFees: true,
    includeExpenses: true
  });

  // Fetch initial data
  useEffect(() => {
    fetchAllData();
  }, [selectedClass, selectedYear, selectedTeacher, dateRange]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      // Fetch classes for filters
      const classesData = await api.classes?.getAll() || [];
      setClasses(classesData);
      
      // Fetch teachers
      const teachersData = await api.teachers?.getAll() || [];
      setTeachers(teachersData);
      
      // Fetch all reports in parallel
      await Promise.all([
        fetchAcademicPerformance(),
        fetchAttendanceDistribution(),
        fetchGradesReport(),
        fetchStudentsSummary(),
        fetchFinancialSummary(),
        fetchTeacherActivity()
      ]);
      
    } catch (error) {
      console.error("Error fetching reports:", error);
      toast.error(t('errorFetchingReports'));
    } finally {
      setLoading(false);
    }
  };

  const fetchAcademicPerformance = async () => {
    try {
      const data = await api.reports.getAcademicPerformance(selectedClass || undefined);
      if (data && Array.isArray(data)) {
        const formatted = data.map(item => ({
          subject: item.subjectName || item.subject,
          avg: item.averageScore || item.avg || 0,
          pass: item.passRate || item.pass || 0,
          highest: item.highestScore || 0,
          lowest: item.lowestScore || 0
        }));
        setAcademicData(formatted);
      } else {
        setAcademicData([]);
      }
    } catch (error) {
      console.error("Error fetching academic performance:", error);
      setAcademicData([]);
    }
  };

  const fetchAttendanceDistribution = async () => {
    try {
      const data = await api.reports.getAttendanceDistribution(
        selectedClass || undefined,
        dateRange.from || undefined,
        dateRange.to || undefined
      );
      
      if (data) {
        setAttendanceData([
          { name: t('present'), value: data.presentPercentage || 0, color: '#22c55e' },
          { name: t('absent'), value: data.absentPercentage || 0, color: '#ef4444' },
          { name: t('late'), value: data.latePercentage || 0, color: '#eab308' }
        ]);
      } else {
        setAttendanceData([
          { name: t('present'), value: 0, color: '#22c55e' },
          { name: t('absent'), value: 0, color: '#ef4444' },
          { name: t('late'), value: 0, color: '#eab308' }
        ]);
      }
    } catch (error) {
      console.error("Error fetching attendance distribution:", error);
    }
  };

  const fetchGradesReport = async () => {
    try {
      const data = await api.reports.getGrades(selectedClass || undefined, selectedSubject || undefined);
      if (data && Array.isArray(data)) {
        setGradesData(data);
      } else {
        setGradesData([]);
      }
    } catch (error) {
      console.error("Error fetching grades report:", error);
      setGradesData([]);
    }
  };

  const fetchStudentsSummary = async () => {
    try {
      const data = await api.reports.getStudentsSummary(selectedClass || undefined);
      if (data) {
        setStudentsSummary(data);
      }
    } catch (error) {
      console.error("Error fetching students summary:", error);
    }
  };

  const fetchFinancialSummary = async () => {
    try {
      const data = await api.reports.getFinancial(selectedYear);
      if (data) {
        setFinancialData(data);
      }
    } catch (error) {
      console.error("Error fetching financial summary:", error);
    }
  };

  const fetchTeacherActivity = async () => {
    try {
      const data = await api.reports.getTeacherActivity(
        selectedTeacher || undefined,
        dateRange.from || undefined,
        dateRange.to || undefined
      );
      if (data && Array.isArray(data)) {
        setTeacherActivity(data);
      } else {
        setTeacherActivity([]);
      }
    } catch (error) {
      console.error("Error fetching teacher activity:", error);
      setTeacherActivity([]);
    }
  };

  const handleExportAll = () => {
    try {
      const academicHeaders = [t('subjectCol'), t('averageScore'), `${t('passRate')} (%)`, t('highest'), t('lowest')];
      const academicRows = academicData.map(item => 
        [item.subject, item.avg, item.pass, item.highest, item.lowest].join(',')
      );
      
      const attendanceHeaders = [t('status'), t('percentage')];
      const attendanceRows = attendanceData.map(item => [item.name, item.value].join(','));
      
      const csvContent = [
        t('academicPerformanceBySubject'),
        academicHeaders.join(','),
        ...academicRows,
        '',
        t('attendanceDistributionTitle'),
        attendanceHeaders.join(','),
        ...attendanceRows,
        '',
        t('generatedOn'),
        new Date().toLocaleString()
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.setAttribute('href', URL.createObjectURL(blob));
      link.setAttribute('download', `reports_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success(t('exportSuccess'));
    } catch (error) {
      console.error("Export error:", error);
      toast.error(t('exportFailed'));
    }
  };

  const handleGenerateStudentReport = async () => {
    if (!studentReportForm.studentOid && !studentReportForm.classOid) {
      toast.error(t('selectStudentOrClass'));
      return;
    }
    
    setGenerating(true);
    try {
      const result = await api.reports.generateStudent(studentReportForm);
      if (result.success) {
        toast.success(t('reportGenerated'));
        setShowStudentReport(false);
        // Handle PDF download or preview
        if (result.data && result.data.url) {
          window.open(result.data.url, '_blank');
        }
      } else {
        toast.error(result.message || t('generationFailed'));
      }
    } catch (error) {
      console.error("Error generating student report:", error);
      toast.error(t('generationFailed'));
    } finally {
      setGenerating(false);
    }
  };

  const handleGenerateTeacherReport = async () => {
    if (!teacherReportForm.teacherOid) {
      toast.error(t('selectTeacher'));
      return;
    }
    
    setGenerating(true);
    try {
      const result = await api.reports.generateTeacher(teacherReportForm);
      if (result.success) {
        toast.success(t('reportGenerated'));
        setShowTeacherReport(false);
        if (result.data && result.data.url) {
          window.open(result.data.url, '_blank');
        }
      } else {
        toast.error(result.message || t('generationFailed'));
      }
    } catch (error) {
      console.error("Error generating teacher report:", error);
      toast.error(t('generationFailed'));
    } finally {
      setGenerating(false);
    }
  };

  const handleGenerateFinancialReport = async () => {
    setGenerating(true);
    try {
      const result = await api.reports.generateFinancial(financialReportForm);
      if (result.success) {
        toast.success(t('reportGenerated'));
        setShowFinancialReport(false);
        if (result.data && result.data.url) {
          window.open(result.data.url, '_blank');
        }
      } else {
        toast.error(result.message || t('generationFailed'));
      }
    } catch (error) {
      console.error("Error generating financial report:", error);
      toast.error(t('generationFailed'));
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-gray-500">{t('loadingReports') || 'Loading reports...'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            {t('reportsPage') || 'Reports Dashboard'}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {t('reportsPageDesc') || 'Comprehensive analytics and reports'}
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportAll} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            {t('exportAll') || 'Export All'}
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label>{t('class') || 'Class'}</Label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full mt-1 p-2 border rounded-lg"
              >
                <option value="">{t('allClasses') || 'All Classes'}</option>
                {classes.map(cls => (
                  <option key={cls.oid} value={cls.oid}>{cls.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <Label>{t('year') || 'Year'}</Label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="w-full mt-1 p-2 border rounded-lg"
              >
                <option value={2024}>2024</option>
                <option value={2025}>2025</option>
                <option value={2026}>2026</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      {studentsSummary && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-blue-100">{t('totalStudents') || 'Total Students'}</p>
                  <p className="text-3xl font-bold">{studentsSummary.totalStudents || 0}</p>
                </div>
                <Users className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-green-100">{t('averageAttendance') || 'Average Attendance'}</p>
                  <p className="text-3xl font-bold">{studentsSummary.averageAttendance || 0}%</p>
                </div>
                <Activity className="h-8 w-8 text-green-200" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-purple-100">{t('passingRate') || 'Passing Rate'}</p>
                  <p className="text-3xl font-bold">{studentsSummary.passingRate || 0}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-orange-100">{t('totalRevenue') || 'Total Revenue'}</p>
                  <p className="text-3xl font-bold">${financialData?.totalRevenue || 0}</p>
                </div>
                <DollarSign className="h-8 w-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Academic Performance */}
        <Card>
          <CardHeader>
            <CardTitle>{t('academicPerformanceBySubject') || 'Academic Performance by Subject'}</CardTitle>
            <CardDescription>{t('averageScoresAndPassRates') || 'Average scores and pass rates'}</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px]">
            {academicData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={academicData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="subject" tick={{ fill: '#6b7280' }} />
                  <YAxis tick={{ fill: '#6b7280' }} />
                  <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
                  <Legend />
                  <Bar dataKey="avg" name={t('averageScore') || 'Average Score'} fill="#8884d8" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="pass" name={`${t('passRate') || 'Pass Rate'} (%)`} fill="#82ca9d" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                {t('noDataAvailable') || 'No data available'}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Attendance Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>{t('attendanceDistributionTitle') || 'Attendance Distribution'}</CardTitle>
            <CardDescription>{t('overallAttendanceStatus') || 'Overall attendance status'}</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px] flex items-center justify-center">
            {attendanceData.some(d => d.value > 0) ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={attendanceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {attendanceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-gray-500">
                {t('noAttendanceData') || 'No attendance data available'}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Grades Distribution */}
      {gradesData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>{t('gradesDistribution') || 'Grades Distribution'}</CardTitle>
            <CardDescription>{t('studentGradeDistribution') || 'Distribution of student grades'}</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={gradesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="grade" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="count" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Teacher Activity */}
      {teacherActivity.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>{t('teacherActivityLog') || 'Teacher Activity Log'}</CardTitle>
            <CardDescription>{t('teacherActivityDesc') || 'Teacher login and activity history'}</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={teacherActivity}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="logins" name={t('logins') || 'Logins'} stroke="#8884d8" />
                <Line type="monotone" dataKey="actions" name={t('actions') || 'Actions'} stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Report Generation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Student Progress Report */}
        <Dialog open={showStudentReport} onOpenChange={setShowStudentReport}>
          <DialogTrigger asChild>
            <Card className="cursor-pointer hover:shadow-lg transition-all border-l-4 border-l-blue-500">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/40 rounded-full">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold">{t('studentProgressReport') || 'Student Progress Report'}</h3>
                  <p className="text-sm text-gray-500">{t('generatePDFForAllStudents') || 'Generate detailed progress reports'}</p>
                </div>
              </CardContent>
            </Card>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('generateStudentReport') || 'Generate Student Report'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>{t('student') || 'Student'}</Label>
                <select
                  value={studentReportForm.studentOid}
                  onChange={(e) => setStudentReportForm({...studentReportForm, studentOid: e.target.value})}
                  className="w-full mt-1 p-2 border rounded-lg"
                >
                  <option value="">{t('selectStudent') || 'Select Student'}</option>
                  {/* Add students list here */}
                </select>
              </div>
              <div>
                <Label>{t('class') || 'Class'}</Label>
                <select
                  value={studentReportForm.classOid}
                  onChange={(e) => setStudentReportForm({...studentReportForm, classOid: e.target.value})}
                  className="w-full mt-1 p-2 border rounded-lg"
                >
                  <option value="">{t('selectClass') || 'Select Class'}</option>
                  {classes.map(cls => (
                    <option key={cls.oid} value={cls.oid}>{cls.name}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>{t('fromDate') || 'From Date'}</Label>
                  <Input type="date" onChange={(e) => setStudentReportForm({...studentReportForm, fromDate: e.target.value})} />
                </div>
                <div>
                  <Label>{t('toDate') || 'To Date'}</Label>
                  <Input type="date" onChange={(e) => setStudentReportForm({...studentReportForm, toDate: e.target.value})} />
                </div>
              </div>
              <Button onClick={handleGenerateStudentReport} disabled={generating} className="w-full">
                {generating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Download className="h-4 w-4 mr-2" />}
                {t('generateReport') || 'Generate Report'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Financial Summary */}
        <Dialog open={showFinancialReport} onOpenChange={setShowFinancialReport}>
          <DialogTrigger asChild>
            <Card className="cursor-pointer hover:shadow-lg transition-all border-l-4 border-l-green-500">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 bg-green-100 dark:bg-green-900/40 rounded-full">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold">{t('financialSummaryTitle') || 'Financial Summary'}</h3>
                  <p className="text-sm text-gray-500">{t('incomeExpensesAndFees') || 'Income, expenses, and fees overview'}</p>
                </div>
              </CardContent>
            </Card>
          </DialogTrigger>
          <DialogContent className="max-h-[80vh] overflow-y-auto">
            {financialData && (
              <>
                <DialogHeader>
                  <DialogTitle>{t('financialSummary') || 'Financial Summary'}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Card>
                      <CardContent className="pt-6">
                        <p className="text-sm text-gray-500">{t('totalRevenue') || 'Total Revenue'}</p>
                        <p className="text-2xl font-bold text-green-600">${financialData.totalRevenue?.toLocaleString() || 0}</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <p className="text-sm text-gray-500">{t('totalExpenses') || 'Total Expenses'}</p>
                        <p className="text-2xl font-bold text-red-600">${financialData.totalExpenses?.toLocaleString() || 0}</p>
                      </CardContent>
                    </Card>
                    <Card className="col-span-2">
                      <CardContent className="pt-6">
                        <p className="text-sm text-gray-500">{t('netProfit') || 'Net Profit'}</p>
                        <p className={`text-2xl font-bold ${financialData.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          ${financialData.netProfit?.toLocaleString() || 0}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                  <Button onClick={() => setShowFinancialReport(false)} className="w-full">
                    {t('close') || 'Close'}
                  </Button>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Teacher Activity */}
        <Dialog open={showTeacherReport} onOpenChange={setShowTeacherReport}>
          <DialogTrigger asChild>
            <Card className="cursor-pointer hover:shadow-lg transition-all border-l-4 border-l-purple-500">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/40 rounded-full">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold">{t('teacherActivityLog') || 'Teacher Activity Log'}</h3>
                  <p className="text-sm text-gray-500">{t('loginHistoryAndActions') || 'Login history and actions'}</p>
                </div>
              </CardContent>
            </Card>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('teacherActivityReport') || 'Teacher Activity Report'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>{t('teacher') || 'Teacher'}</Label>
                <select
                  value={teacherReportForm.teacherOid}
                  onChange={(e) => setTeacherReportForm({...teacherReportForm, teacherOid: e.target.value})}
                  className="w-full mt-1 p-2 border rounded-lg"
                >
                  <option value="">{t('selectTeacher') || 'Select Teacher'}</option>
                  {teachers.map(teacher => (
                    <option key={teacher.oid} value={teacher.oid}>{teacher.fullName}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>{t('fromDate') || 'From Date'}</Label>
                  <Input type="date" onChange={(e) => setTeacherReportForm({...teacherReportForm, fromDate: e.target.value})} />
                </div>
                <div>
                  <Label>{t('toDate') || 'To Date'}</Label>
                  <Input type="date" onChange={(e) => setTeacherReportForm({...teacherReportForm, toDate: e.target.value})} />
                </div>
              </div>
              <Button onClick={handleGenerateTeacherReport} disabled={generating} className="w-full">
                {generating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Download className="h-4 w-4 mr-2" />}
                {t('generateReport') || 'Generate Report'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}