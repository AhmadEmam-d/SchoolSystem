import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Search, Plus, Calendar, FileText, CheckCircle, Clock, Filter, X } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '../../components/ui/dropdown-menu';

export function TeacherHomework() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);

  // Mock homework data
  const homework = [
    { id: 'h1', title: 'Calculus Worksheet', class: 'Class 10-A', dueDate: '2023-10-15', submitted: 18, total: 20, status: 'Active' },
    { id: 'h2', title: 'Algebra Quiz', class: 'Class 10-B', dueDate: '2023-10-12', submitted: 15, total: 15, status: 'Grading' },
    { id: 'h3', title: 'Geometry Project', class: 'Class 8-A', dueDate: '2023-10-20', submitted: 5, total: 22, status: 'Active' },
    { id: 'h4', title: 'Trigonometry Intro', class: 'Class 10-A', dueDate: '2023-10-05', submitted: 20, total: 20, status: 'Completed' },
  ];

  // Extract unique classes and statuses
  const uniqueClasses = Array.from(new Set(homework.map(h => h.class)));
  const uniqueStatuses = Array.from(new Set(homework.map(h => h.status)));

  const filteredHomework = homework.filter(h => {
    const matchesSearch = h.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.class.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = !selectedClass || h.class === selectedClass;
    const matchesStatus = !selectedStatus || h.status === selectedStatus;
    
    return matchesSearch && matchesClass && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('homeworkAssignments')}</h1>
          <p className="text-gray-500 mt-1">{t('homeworkAssignmentsDesc')}</p>
        </div>
        <Button onClick={() => navigate('/teacher/homework/add')}>
          <Plus className="h-4 w-4 mr-2" />
          {t('createAssignmentBtn')}
        </Button>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input 
            placeholder={t('searchAssignments')}
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
                  {status}
                  {selectedStatus === status && <CheckCircle className="h-4 w-4 ml-auto text-blue-600" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Active Filters Display */}
      {(selectedClass || selectedStatus) && (
        <div className="flex items-center gap-2 mb-4">
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
              {t('status')}: {selectedStatus}
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

      <div className="grid gap-4">
        {filteredHomework.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <FileText className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('noAssignmentsFound')}</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || selectedClass || selectedStatus
                  ? t('tryAdjustingFilters')
                  : t('getStartedCreateAssignment')}
              </p>
              {!searchTerm && !selectedClass && !selectedStatus && (
                <Button onClick={() => navigate('/teacher/homework/add')}>
                  <Plus className="h-4 w-4 mr-2" />
                  {t('createAssignmentBtn')}
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          filteredHomework.map((item) => (
            <Card key={item.id} className="hover:bg-gray-50 transition-colors">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4 cursor-pointer flex-1" onClick={() => navigate(`/teacher/homework/${item.id}`)}>
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                      item.status === 'Active' ? 'bg-blue-100 text-blue-600' :
                      item.status === 'Grading' ? 'bg-yellow-100 text-yellow-600' :
                      'bg-green-100 text-green-600'
                    }`}>
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{item.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span className="font-medium text-gray-700">{item.class}</span>
                        <span>•</span>
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {t('dueDate')} {new Date(item.dueDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-sm text-gray-500">{t('submissions')}</p>
                      <p className="font-bold text-lg">{item.submitted}/{item.total}</p>
                    </div>
                    <div className="text-right min-w-[100px]">
                      <Badge variant={item.status === 'Active' ? 'default' : item.status === 'Grading' ? 'secondary' : 'outline'} 
                        className={item.status === 'Completed' ? 'bg-green-50 text-green-700 border-green-200' : ''}>
                        {item.status}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between gap-3">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map((_, i) => (
                      <div key={i} className="h-8 w-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-medium text-gray-600">
                        S{i+1}
                      </div>
                    ))}
                    <div className="h-8 w-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs font-medium text-gray-500">
                      +{item.submitted - 3}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate(`/teacher/homework/${item.id}`)}
                    >
                      {t('viewDetails')}
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
                      onClick={() => navigate(`/teacher/homework/${item.id}/submissions`)}
                    >
                      {t('viewSubmissions')}
                    </Button>
                    <Button 
                      variant="default" 
                      size="sm" 
                      className="bg-indigo-600 hover:bg-indigo-700"
                      onClick={() => navigate(`/teacher/homework/${item.id}/grades`)}
                    >
                      {t('grades')}
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
