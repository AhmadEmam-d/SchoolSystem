import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../components/ui/dropdown-menu';
import { Plus, Search, MoreVertical, Eye, Edit, Trash2, Filter } from 'lucide-react';
import { api } from '../../lib/api';
import { toast } from 'sonner';

export function AdminStudents() {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [gradeFilter, setGradeFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const res = await api.students.getAll();
        const studentsArray = Array.isArray(res.data) ? res.data : [];
        setStudents(studentsArray);
      } catch (error) {
        console.error('Error fetching students:', error);
        toast.error("Failed to load students");
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const filteredStudents = Array.isArray(students)
    ? students.filter(student => {
      const matchesSearch =
        student.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesGrade = gradeFilter === 'all' || student.class?.level === gradeFilter;
      return matchesSearch && matchesGrade;
    })
    : [];

  const getParentName = (parentOid) => {
    return parentOid ? 'Parent ID: ' + parentOid.substring(0, 8) : t('unassigned');
  };

  const getAttendanceColor = (attendance) => {
    if (attendance >= 95) return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
    if (attendance >= 85) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
    return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
  };

  const getGPAColor = (gpa) => {
    if (gpa >= 3.5) return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
    if (gpa >= 2.5) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
    return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500 dark:text-gray-400">Loading students...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('studentsPage')}</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">{t('studentsPageDesc')}</p>
        </div>
        <Button
          className="bg-indigo-600 hover:bg-indigo-700"
          onClick={() => navigate('/admin/students/add')}
        >
          <Plus className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
          {t('addStudentBtnLabel')}
        </Button>
      </div>

      <Card className="border-none shadow-md dark:bg-gray-800">
        <CardHeader className="border-b bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <CardTitle className="dark:text-white">{t('allStudentsTitle')} ({filteredStudents.length})</CardTitle>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400`} />
                <Input
                  placeholder={t('searchStudentsPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`${isRTL ? 'pr-10' : 'pl-10'} w-64 dark:bg-gray-700 dark:border-gray-600 dark:text-white`}
                />
              </div>
              <Select value={gradeFilter} onValueChange={setGradeFilter}>
                <SelectTrigger className="w-48 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  <Filter className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                  <SelectValue placeholder={t('grade')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('allGrades')}</SelectItem>
                  <SelectItem value="6th">{t('grade6')}</SelectItem>
                  <SelectItem value="7th">{t('grade7')}</SelectItem>
                  <SelectItem value="8th">{t('grade8')}</SelectItem>
                  <SelectItem value="9th">{t('grade9')}</SelectItem>
                  <SelectItem value="10th">{t('grade10')}</SelectItem>
                  <SelectItem value="11th">{t('grade11')}</SelectItem>
                  <SelectItem value="12th">{t('grade12')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700 border-b dark:border-gray-600">
                <tr>
                  <th className={`px-6 py-3 ${isRTL ? 'text-right' : 'text-left'} text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider`}>{t('students')}</th>
                  <th className={`px-6 py-3 ${isRTL ? 'text-right' : 'text-left'} text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider`}>{t('grade')}</th>
                  <th className={`px-6 py-3 ${isRTL ? 'text-right' : 'text-left'} text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider`}>{t('parentCol')}</th>
                  <th className={`px-6 py-3 ${isRTL ? 'text-right' : 'text-left'} text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider`}>{t('attendance')}</th>
                  <th className={`px-6 py-3 ${isRTL ? 'text-right' : 'text-left'} text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider`}>{t('gpaCol')}</th>
                  <th className={`px-6 py-3 ${isRTL ? 'text-right' : 'text-left'} text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider`}>{t('actions')}</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredStudents.map((student) => (
                  <tr key={student.oid} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-semibold">
                          {student.fullName?.split(' ').map((n) => n[0]).join('') || 'S'}
                        </div>
                        <div className={isRTL ? 'mr-4' : 'ml-4'}>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{student.fullName}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{student.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant="outline" className="font-medium dark:border-gray-600 dark:text-gray-300">
                        {student.class?.name || student.class?.level || 'N/A'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                      {getParentName(student.parentOid)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={getAttendanceColor(85)}>85%</Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={getGPAColor(3.0)}>3.0</Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align={isRTL ? 'start' : 'end'}>
                          <DropdownMenuItem>
                            <Eye className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                            {t('viewDetailsBtn')}
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                            {t('edit')}
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                            {t('delete')}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}