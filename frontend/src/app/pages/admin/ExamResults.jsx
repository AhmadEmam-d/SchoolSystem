import React, { useEffect, useState } from 'react';
import { Search, Download, FileText, RefreshCw, Eye, TrendingUp, Users, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '../../components/ui/table';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { api } from '../../../app/lib/api';

export function AdminExamResults() {
  const { t } = useTranslation();

  const [searchTerm, setSearchTerm] = useState('');
  const [exams, setExams] = useState([]);
  const [resultsData, setResultsData] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      console.log("🟢 Fetching exams data...");
      
      // Step 1: Fetch all exams
      const examsList = await api.exams.getAll();
      console.log("📚 Exams fetched:", examsList);
      
      if (!examsList || examsList.length === 0) {
        console.log("No exams found");
        setExams([]);
        setResultsData([]);
        setLoading(false);
        return;
      }
      
      setExams(examsList);
      
      // Step 2: Fetch summary data
      const summaryData = await api.exams.getSummary();
      console.log("📊 Summary data:", summaryData);
      setSummary(summaryData);
      
      // Step 3: Fetch results for each exam using GET: api/Exams/{oid}/results
      const enrichedResults = [];
      
      for (const exam of examsList) {
        try {
          const results = await api.exams.getResults(exam.oid);
          console.log(`📈 Results for exam "${exam.name}":`, results);
          
          // Calculate statistics from results
          let averageScore = 0;
          let highestScore = 0;
          let lowestScore = 0;
          let passCount = 0;
          let totalStudents = 0;
          
          if (results && Array.isArray(results) && results.length > 0) {
            const scores = results.map(r => r.score || r.marks || 0);
            averageScore = scores.reduce((a, b) => a + b, 0) / scores.length;
            highestScore = Math.max(...scores);
            lowestScore = Math.min(...scores);
            passCount = results.filter(r => (r.score || r.marks || 0) >= 50).length;
            totalStudents = results.length;
          } else {
            totalStudents = exam.studentsCount || exam.totalStudents || 0;
          }
          
          const passRate = totalStudents > 0 ? (passCount / totalStudents) * 100 : 0;
          
          enrichedResults.push({
            examOid: exam.oid,
            examName: exam.name || exam.examName,
            subject: exam.subjectName || exam.subject || exam.courseName || '-',
            className: exam.className || exam.class || exam.className || '-',
            date: exam.date || exam.examDate,
            totalStudents: totalStudents,
            averageScore: averageScore,
            highestScore: highestScore,
            lowestScore: lowestScore,
            passRate: passRate,
            status: exam.status || (results?.length > 0 ? 'Completed' : 'Pending'),
            resultsCount: results?.length || 0
          });
          
        } catch (error) {
          console.error(`Error fetching results for exam ${exam.name}:`, error);
          // Add exam without results
          enrichedResults.push({
            examOid: exam.oid,
            examName: exam.name || exam.examName,
            subject: exam.subjectName || exam.subject || exam.courseName || '-',
            className: exam.className || exam.class || '-',
            date: exam.date || exam.examDate,
            totalStudents: exam.studentsCount || exam.totalStudents || 0,
            averageScore: 0,
            highestScore: 0,
            lowestScore: 0,
            passRate: 0,
            status: exam.status || 'Pending',
            resultsCount: 0
          });
        }
      }
      
      setResultsData(enrichedResults);
      
    } catch (err) {
      console.error("❌ Error fetching exam data:", err);
      toast.error(t('errorFetchingData') || 'Failed to fetch exam results');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
    toast.success(t('dataRefreshed') || 'Data refreshed successfully');
  };

  const handleExport = () => {
    if (!resultsData || resultsData.length === 0) {
      toast.error(t('noDataToExport') || 'No data to export');
      return;
    }

    try {
      const headers = ['Exam Name', 'Subject', 'Class', 'Date', 'Students', 'Average Score', 'Highest Score', 'Lowest Score', 'Pass Rate', 'Status'];
      const rows = resultsData.map(r => [
        r.examName,
        r.subject,
        r.className,
        r.date ? new Date(r.date).toLocaleDateString() : '-',
        r.totalStudents,
        r.averageScore.toFixed(1),
        r.highestScore,
        r.lowestScore,
        `${r.passRate.toFixed(1)}%`,
        r.status
      ]);

      const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `exam_results_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success(t('exportSuccess') || 'Export successful');
    } catch (error) {
      console.error('Export error:', error);
      toast.error(t('exportFailed') || 'Failed to export data');
    }
  };

  const viewExamDetails = (exam) => {
    // Navigate to exam details or open modal
    toast.info(`Viewing details for ${exam.examName}`);
    // You can implement navigation or modal here
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredResults = resultsData.filter(r =>
    r.examName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.className?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status) => {
    const statusMap = {
      'Completed': { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      'Grading': { color: 'bg-yellow-100 text-yellow-800', icon: TrendingUp },
      'Pending': { color: 'bg-gray-100 text-gray-800', icon: FileText },
      'Published': { color: 'bg-blue-100 text-blue-800', icon: Eye }
    };
    
    const defaultStatus = { color: 'bg-gray-100 text-gray-800', icon: FileText };
    const statusInfo = statusMap[status] || defaultStatus;
    const Icon = statusInfo.icon;
    
    return (
      <Badge className={`${statusInfo.color} font-medium flex items-center gap-1 w-fit`}>
        <Icon className="h-3 w-3" />
        {status || t('unknown') || 'Unknown'}
      </Badge>
    );
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 65) return 'text-blue-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-500">{t('loading') || 'Loading exam results...'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            {t('examResults') || 'Exam Results'}
          </h1>
          <p className="text-gray-500 mt-1">
            {t('examResultsDesc') || 'Track and analyze student exam performance'}
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            {t('refresh') || 'Refresh'}
          </Button>
          
          <Button 
            onClick={handleExport}
            disabled={resultsData.length === 0}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
          >
            <Download className="h-4 w-4" />
            {t('export') || 'Export'}
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-purple-100">
                {t('totalExams') || 'Total Exams'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {summary.totalExams || exams.length || 0}
              </div>
              <p className="text-purple-100 text-sm mt-1">
                {t('examsConducted') || 'Exams conducted'}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-100">
                {t('completedExams') || 'Completed Exams'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {summary.completedExams || resultsData.filter(r => r.resultsCount > 0).length || 0}
              </div>
              <p className="text-green-100 text-sm mt-1">
                {t('readyForReview') || 'Ready for review'}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-blue-100">
                {t('totalStudents') || 'Total Students'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {summary.totalStudents || resultsData.reduce((sum, r) => sum + (r.totalStudents || 0), 0)}
              </div>
              <p className="text-blue-100 text-sm mt-1">
                {t('enrolledStudents') || 'Enrolled students'}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-indigo-100">
                {t('overallAverage') || 'Overall Average'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {summary.overallAverage?.toFixed(1) || 
                 (resultsData.filter(r => r.averageScore > 0).reduce((sum, r) => sum + r.averageScore, 0) / 
                  (resultsData.filter(r => r.averageScore > 0).length || 1)).toFixed(1)}%
              </div>
              <p className="text-indigo-100 text-sm mt-1">
                {t('averageScore') || 'Average score across all exams'}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Search Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder={t('searchExams') || 'Search by exam name, subject, or class...'}
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Results Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-purple-600" />
              {t('examResultsList') || 'Exam Results List'}
            </span>
            <Badge variant="outline" className="text-sm">
              {filteredResults.length} {t('exams') || 'exams'}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredResults.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                {t('noResultsFound') || 'No Results Found'}
              </h3>
              <p className="text-gray-500">
                {searchTerm 
                  ? (t('tryDifferentSearch') || 'Try a different search term')
                  : (t('noExamsAvailable') || 'No exams available')
                }
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold">{t('examName') || 'Exam'}</TableHead>
                    <TableHead className="font-semibold">{t('subject') || 'Subject'}</TableHead>
                    <TableHead className="font-semibold">{t('class') || 'Class'}</TableHead>
                    <TableHead className="font-semibold">{t('date') || 'Date'}</TableHead>
                    <TableHead className="font-semibold text-center">
                      <Users className="h-4 w-4 inline mr-1" />
                      {t('students') || 'Students'}
                    </TableHead>
                    <TableHead className="font-semibold text-center">{t('average') || 'Avg'}</TableHead>
                    <TableHead className="font-semibold text-center">{t('highest') || 'High'}</TableHead>
                    <TableHead className="font-semibold text-center">{t('lowest') || 'Low'}</TableHead>
                    <TableHead className="font-semibold text-center">{t('passRate') || 'Pass Rate'}</TableHead>
                    <TableHead className="font-semibold">{t('status') || 'Status'}</TableHead>
         
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {filteredResults.map((result, index) => (
                    <TableRow key={result.examOid || index} className="hover:bg-gray-50 transition-colors">
                      <TableCell className="font-medium">{result.examName}</TableCell>
                      <TableCell>{result.subject}</TableCell>
                      <TableCell>{result.className}</TableCell>
                      <TableCell>
                        {result.date ? new Date(result.date).toLocaleDateString() : '-'}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline">{result.totalStudents}</Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className={`font-semibold ${getScoreColor(result.averageScore)}`}>
                          {result.averageScore.toFixed(1)}
                        </span>
                      </TableCell>
                      <TableCell className="text-center font-semibold text-green-600">
                        {result.highestScore || 0}
                      </TableCell>
                      <TableCell className="text-center font-semibold text-red-600">
                        {result.lowestScore || 0}
                      </TableCell>
                      <TableCell className="text-center">
                        <span className={`font-semibold ${getScoreColor(result.passRate)}`}>
                          {result.passRate.toFixed(1)}%
                        </span>
                      </TableCell>
                      <TableCell>{getStatusBadge(result.status)}</TableCell>
                   
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Footer Stats */}
      {filteredResults.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center text-sm text-gray-600">
              <div>
                {t('showing') || 'Showing'} {filteredResults.length} {t('of') || 'of'} {resultsData.length} {t('exams') || 'exams'}
              </div>
              <div>
                {t('lastUpdated') || 'Last updated'}: {new Date().toLocaleString()}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}