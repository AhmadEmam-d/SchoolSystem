import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Plus, Calendar, Clock, Edit, Trash2, Eye, Users, FileText, BarChart, Search, Filter, X, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '../../components/ui/dropdown-menu';
import { CLASSES } from '../../lib/mockData';
import { toast } from 'sonner';

export function TeacherExams() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [exams, setExams] = useState([
    { id: '1', title: 'Mathematics Mid-Term', classId: 'c1', date: '2026-03-15', time: '10:00 AM', duration: '2 hours', totalMarks: 100, status: 'upcoming', totalStudents: 30 },
    { id: '2', title: 'Science Quiz', classId: 'c1', date: '2026-03-05', time: '11:00 AM', duration: '1 hour', totalMarks: 50, status: 'completed', studentsCompleted: 28, totalStudents: 30 },
    { id: '3', title: 'History Essay', classId: 'c2', date: '2026-03-20', time: '2:00 PM', duration: '1.5 hours', totalMarks: 75, status: 'upcoming', totalStudents: 25 },
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'ongoing': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getClassName = (classId) => {
    return CLASSES.find(c => c.id === classId)?.name || 'Unknown';
  };

  // Extract unique classes and statuses
  const uniqueClasses = Array.from(new Set(exams.map(e => getClassName(e.classId))));
  const uniqueStatuses = ['upcoming', 'ongoing', 'completed'];

  const filteredExams = exams.filter(e => {
    const className = getClassName(e.classId);
    const matchesSearch = e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      className.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = !selectedClass || className === selectedClass;
    const matchesStatus = !selectedStatus || e.status === selectedStatus;
    
    return matchesSearch && matchesClass && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('examsAssessments')}</h1>
          <p className="text-gray-500 mt-1">{t('examsAssessmentsDesc')}</p>
        </div>
        <Button 
          onClick={() => navigate('/teacher/exam/add')}
          className="bg-indigo-600 hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          {t('createExam')}
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input 
            placeholder={t('searchExams')}
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="hidden sm:flex">
                <Filter className="h-4 w-4 mr-2" />
                {t('filterByClass')}
                {selectedClass && (
                  <Badge variant="secondary" className="ml-2 bg-blue-100 text-blue-700 border-0">
                    1
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuItem onClick={() => setSelectedClass(null)}>
                <X className="h-4 w-4 mr-2" />
                {t('clear')}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {uniqueClasses.map((cls) => (
                <DropdownMenuItem 
                  key={cls} 
                  onClick={() => setSelectedClass(cls)}
                  className={selectedClass === cls ? 'bg-blue-50' : ''}
                >
                  {cls}
                  {selectedClass === cls && <CheckCircle className="h-4 w-4 ml-auto text-blue-600" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="hidden sm:flex">
                <Filter className="h-4 w-4 mr-2" />
                {t('filterByStatus')}
                {selectedStatus && (
                  <Badge variant="secondary" className="ml-2 bg-blue-100 text-blue-700 border-0">
                    1
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuItem onClick={() => setSelectedStatus(null)}>
                <X className="h-4 w-4 mr-2" />
                {t('clear')}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {uniqueStatuses.map((status) => (
                <DropdownMenuItem 
                  key={status} 
                  onClick={() => setSelectedStatus(status)}
                  className={selectedStatus === status ? 'bg-blue-50' : ''}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                  {selectedStatus === status && <CheckCircle className="h-4 w-4 ml-auto text-blue-600" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Active Filters Display */}
      {(selectedClass || selectedStatus) && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">{t('activeFilters')}</span>
          {selectedClass && (
            <Badge 
              variant="secondary" 
              className="bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1"
            >
              {t('class')}: {selectedClass}
              <X 
                className="h-3 w-3 cursor-pointer hover:text-blue-900" 
                onClick={() => setSelectedClass(null)}
              />
            </Badge>
          )}
          {selectedStatus && (
            <Badge 
              variant="secondary" 
              className="bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1"
            >
              {t('status')}: {selectedStatus.charAt(0).toUpperCase() + selectedStatus.slice(1)}
              <X 
                className="h-3 w-3 cursor-pointer hover:text-blue-900" 
                onClick={() => setSelectedStatus(null)}
              />
            </Badge>
          )}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => {
              setSelectedClass(null);
              setSelectedStatus(null);
            }}
            className="h-7 text-xs text-blue-600 hover:text-blue-700"
          >
            {t('clearAll')}
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-none shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-500">{t('totalExamsCount')}</div>
                <div className="text-2xl font-bold text-gray-900 mt-1">{exams.length}</div>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-500">{t('upcomingExams')}</div>
                <div className="text-2xl font-bold text-blue-600 mt-1">
                  {exams.filter(e => e.status === 'upcoming').length}
                </div>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-500">{t('completed')}</div>
                <div className="text-2xl font-bold text-green-600 mt-1">
                  {exams.filter(e => e.status === 'completed').length}
                </div>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <Clock className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredExams.length === 0 ? (
          <div className="col-span-full">
            <Card>
              <CardContent className="p-12 text-center">
                <FileText className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('noExamsFound')}</h3>
                <p className="text-gray-500 mb-4">
                  {searchTerm || selectedClass || selectedStatus
                    ? t('tryAdjustingSearch')
                    : t('getStartedCreateExam')}
                </p>
                {!searchTerm && !selectedClass && !selectedStatus && (
                  <Button 
                    onClick={() => navigate('/teacher/exam/add')}
                    className="bg-indigo-600 hover:bg-indigo-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {t('createExam')}
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          filteredExams.map((exam) => (
            <Card key={exam.id} className="border-none shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="border-b bg-gray-50">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{exam.title}</CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-2">
                      <Badge variant="outline">{getClassName(exam.classId)}</Badge>
                      <Badge className={getStatusColor(exam.status)}>
                        {exam.status.charAt(0).toUpperCase() + exam.status.slice(1)}
                      </Badge>
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>{exam.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>{exam.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <FileText className="h-4 w-4" />
                    <span>{exam.totalMarks} {t('marks')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Users className="h-4 w-4" />
                    <span>{exam.totalStudents} {t('studentsLabel')}</span>
                  </div>
                </div>
                
                {exam.status === 'completed' && exam.studentsCompleted !== undefined && (
                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-600">{t('completion')}</span>
                      <span className="font-medium">
                        {exam.studentsCompleted}/{exam.totalStudents} {t('studentsLabel')}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: `${(exam.studentsCompleted / exam.totalStudents) * 100}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2 pt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => navigate(`/teacher/exams/${exam.id}`)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    {t('viewDetails')}
                  </Button>
                  {exam.status === 'completed' && (
                    <>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="flex-1"
                        onClick={() => navigate(`/teacher/exams/${exam.id}/submissions`)}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        {t('submissions')}
                      </Button>
                      <Button 
                        size="sm" 
                        className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                        onClick={() => navigate(`/teacher/exams/${exam.id}/grades`)}
                      >
                        <BarChart className="h-4 w-4 mr-2" />
                        {t('grades')}
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
