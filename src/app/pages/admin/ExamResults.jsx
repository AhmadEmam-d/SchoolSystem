import React, { useState } from 'react';
import { Search, Filter, Download, Eye, Edit, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '../../components/ui/table';
import { useTranslation } from 'react-i18next';

const mockExamResults = [
  {
    id: '1',
    examName: 'Mid-Term Mathematics',
    examNameAr: 'midTermMath',
    subject: 'Mathematics',
    class: 'Grade 10-A',
    date: '2026-02-15',
    totalMarks: 100,
    studentsCount: 30,
    averageScore: 78.5,
    highestScore: 98,
    lowestScore: 45,
    status: 'completed'
  },
  {
    id: '2',
    examName: 'Final English Literature',
    examNameAr: 'finalEnglish',
    subject: 'English',
    class: 'Grade 11-B',
    date: '2026-02-20',
    totalMarks: 100,
    studentsCount: 28,
    averageScore: 82.3,
    highestScore: 95,
    lowestScore: 58,
    status: 'completed'
  },
  {
    id: '3',
    examName: 'Physics Quiz',
    examNameAr: 'physicsQuiz',
    subject: 'Physics',
    class: 'Grade 12-A',
    date: '2026-02-25',
    totalMarks: 50,
    studentsCount: 25,
    averageScore: 38.7,
    highestScore: 48,
    lowestScore: 22,
    status: 'grading'
  },
  {
    id: '4',
    examName: 'Chemistry Lab Test',
    examNameAr: 'chemistryLab',
    subject: 'Chemistry',
    class: 'Grade 11-A',
    date: '2026-03-01',
    totalMarks: 50,
    studentsCount: 30,
    averageScore: 0,
    highestScore: 0,
    lowestScore: 0,
    status: 'pending'
  },
  {
    id: '5',
    examName: 'History Mid-Term',
    examNameAr: 'midTermHistory',
    subject: 'History',
    class: 'Grade 10-B',
    date: '2026-02-18',
    totalMarks: 100,
    studentsCount: 32,
    averageScore: 75.2,
    highestScore: 92,
    lowestScore: 51,
    status: 'completed'
  }
];

export function AdminExamResults() {
  const [searchTerm, setSearchTerm] = useState('');
  const [classFilter, setClassFilter] = useState('all');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const { t } = useTranslation();

  const filteredResults = mockExamResults.filter(result => {
    const matchesSearch = result.examName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         result.examNameAr.includes(searchTerm) ||
                         result.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = classFilter === 'all' || result.class === classFilter;
    const matchesSubject = subjectFilter === 'all' || result.subject === subjectFilter;
    const matchesStatus = statusFilter === 'all' || result.status === statusFilter;
    return matchesSearch && matchesClass && matchesSubject && matchesStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">{t('completed')}</Badge>;
      case 'grading':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">{t('grading')}</Badge>;
      case 'pending':
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">{t('pending')}</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getAverageColor = (average, total) => {
    const percentage = (average / total) * 100;
    if (percentage >= 85) return 'text-green-600 font-semibold';
    if (percentage >= 70) return 'text-blue-600 font-semibold';
    if (percentage >= 50) return 'text-yellow-600 font-semibold';
    return 'text-red-600 font-semibold';
  };

  const handleExportResults = () => {
    // Prepare CSV content
    const headers = ['Exam Name', 'Subject', 'Class', 'Date', 'Total Marks', 'Students Count', 'Average Score', 'Highest Score', 'Lowest Score', 'Status'];
    const csvContent = [
      headers.join(','),
      ...filteredResults.map(result => [
        `"${result.examName}"`,
        result.subject,
        result.class,
        result.date,
        result.totalMarks,
        result.studentsCount,
        result.status === 'completed' ? result.averageScore.toFixed(1) : 'N/A',
        result.status === 'completed' ? result.highestScore : 'N/A',
        result.status === 'completed' ? result.lowestScore : 'N/A',
        result.status
      ].join(','))
    ].join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `exam_results_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const completedExams = mockExamResults.filter(r => r.status === 'completed').length;
  const totalStudents = mockExamResults.reduce((sum, r) => sum + r.studentsCount, 0);
  const overallAverage = mockExamResults
    .filter(r => r.status === 'completed')
    .reduce((sum, r) => sum + r.averageScore, 0) / completedExams || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('examResultsPage')}</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">{t('examResultsPageDesc')}</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleExportResults}>
            <Download className="h-4 w-4 mr-2" />
            {t('exportResults')}
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('totalExams')}</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{mockExamResults.length}</div>
            <p className="text-xs text-muted-foreground mt-1">{t('examsRecorded')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('completedExams')}</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{completedExams}</div>
            <p className="text-xs text-muted-foreground mt-1">{t('graded')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('totalStudents')}</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{totalStudents}</div>
            <p className="text-xs text-muted-foreground mt-1">{t('studentsLabel')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('overallAverage')}</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{overallAverage.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground mt-1">{t('successRate')}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder={t('searchExam')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={classFilter} onValueChange={setClassFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={t('class')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('allClasses')}</SelectItem>
                <SelectItem value="Grade 10-A">Grade 10-A</SelectItem>
                <SelectItem value="Grade 10-B">Grade 10-B</SelectItem>
                <SelectItem value="Grade 11-A">Grade 11-A</SelectItem>
                <SelectItem value="Grade 11-B">Grade 11-B</SelectItem>
                <SelectItem value="Grade 12-A">Grade 12-A</SelectItem>
              </SelectContent>
            </Select>
            <Select value={subjectFilter} onValueChange={setSubjectFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={t('subject')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('allSubjects')}</SelectItem>
                <SelectItem value="Mathematics">Mathematics</SelectItem>
                <SelectItem value="English">English</SelectItem>
                <SelectItem value="Physics">Physics</SelectItem>
                <SelectItem value="Chemistry">Chemistry</SelectItem>
                <SelectItem value="History">History</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={t('status')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('allStatuses')}</SelectItem>
                <SelectItem value="completed">{t('completed')}</SelectItem>
                <SelectItem value="grading">{t('grading')}</SelectItem>
                <SelectItem value="pending">{t('pending')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results Table */}
      <Card>
        <CardHeader>
          <CardTitle>{t('examResultsPage')}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('examName')}</TableHead>
                <TableHead>{t('subject')}</TableHead>
                <TableHead>{t('class')}</TableHead>
                <TableHead>{t('date')}</TableHead>
                <TableHead>{t('studentsCount')}</TableHead>
                <TableHead>{t('average')}</TableHead>
                <TableHead>{t('highestScore')}</TableHead>
                <TableHead>{t('lowestScore')}</TableHead>
                <TableHead>{t('status')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredResults.map((result) => (
                <TableRow key={result.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{result.examName}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400" dir="rtl">{t(result.examNameAr)}</div>
                    </div>
                  </TableCell>
                  <TableCell>{result.subject}</TableCell>
                  <TableCell>{result.class}</TableCell>
                  <TableCell>{new Date(result.date).toLocaleDateString('ar-EG')}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{result.studentsCount} {t('studentsLabel')}</Badge>
                  </TableCell>
                  <TableCell>
                    {result.status === 'completed' ? (
                      <span className={getAverageColor(result.averageScore, result.totalMarks)}>
                        {result.averageScore.toFixed(1)}%
                      </span>
                    ) : (
                      <span className="text-gray-400 dark:text-gray-500">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {result.status === 'completed' ? (
                      <span className="text-green-600 dark:text-green-400 font-medium">{result.highestScore}</span>
                    ) : (
                      <span className="text-gray-400 dark:text-gray-500">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {result.status === 'completed' ? (
                      <span className="text-red-600 dark:text-red-400 font-medium">{result.lowestScore}</span>
                    ) : (
                      <span className="text-gray-400 dark:text-gray-500">-</span>
                    )}
                  </TableCell>
                  <TableCell>{getStatusBadge(result.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredResults.length === 0 && (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">{t('noMatchingResults')}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
