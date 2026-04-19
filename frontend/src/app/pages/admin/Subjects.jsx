import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Plus, Search, BookOpen, Users, Loader2 } from 'lucide-react';
import { toast } from "sonner";
import { api } from '../../../app/lib/api';

export function AdminSubjects() {
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // جلب البيانات بالتوازي لتحسين الأداء
        const [subjectsResponse, teachersResponse, classesResponse] = await Promise.all([
          api.subjects.getAll(),
          api.teachers.getAll(),
          api.classes.getAll()
        ]);
        
        // التأكد من استخراج المصفوفات بشكل صحيح حسب هيكلية الـ API
        const subjectsList = subjectsResponse.success ? subjectsResponse.data : (Array.isArray(subjectsResponse) ? subjectsResponse : []);
        const teachersList = teachersResponse.success ? teachersResponse.data : (Array.isArray(teachersResponse) ? teachersResponse : []);
        const classesList = classesResponse.success ? classesResponse.data : (Array.isArray(classesResponse) ? classesResponse : []);
        
        setSubjects(subjectsList);
        setTeachers(teachersList);
        setClasses(classesList);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error(t('errorFetchingData'));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [t]);

  // دالة لحساب عدد الصفوف التي تدرس هذه المادة
  const getClassCount = (subjectOid) => {
    if (!classes) return 0;
    return classes.filter(cls => 
      cls.subjects?.some(sub => sub.oid === subjectOid) || 
      cls.subjectIds?.includes(subjectOid) // حسب المسمى المتوفر في الـ API عندك
    ).length;
  };

  const filteredSubjects = subjects.filter(subject =>
    subject.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subject.code?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
        <p className="text-gray-500 animate-pulse">{t('loading')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('subjectsPage')}</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">{t('subjectsPageDesc')}</p>
        </div>
        <Button onClick={() => navigate('/admin/subjects/add')} className="bg-purple-600 hover:bg-purple-700">
          <Plus className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
          {t('addSubjectBtnLabel')}
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: t('totalSubjectsCard'), value: subjects.length, icon: <BookOpen className="h-5 w-5 text-purple-500" /> },
          { label: t('totalClasses'), value: classes.length, icon: <Users className="h-5 w-5 text-blue-500" /> },
          { label: t('teachersAssignedCard'), value: teachers.length, icon: <Users className="h-5 w-5 text-emerald-500" /> },
        ].map(({ label, value, icon }) => (
          <Card key={label} className="dark:border-gray-700 dark:bg-gray-800 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium dark:text-gray-300">{label}</CardTitle>
              {icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold dark:text-white">{value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Table Card */}
      <Card className="dark:border-gray-700 dark:bg-gray-800 shadow-sm">
        <CardHeader className="pb-3 border-b dark:border-gray-700 mb-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <CardTitle className="dark:text-white">
              {t('allSubjectsTitle')} <span className="text-sm font-normal text-muted-foreground">({filteredSubjects.length})</span>
            </CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400`} />
              <Input
                placeholder={t('searchSubjectsPlaceholder')}
                className={`${isRTL ? 'pr-10' : 'pl-10'} dark:bg-gray-700 dark:border-gray-600 dark:text-white focus-visible:ring-purple-500`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border dark:border-gray-700">
            <Table>
              <TableHeader className="bg-gray-50 dark:bg-gray-900/50">
                <TableRow className="dark:border-gray-700">
                  <TableHead className="dark:text-gray-400">{t('subjectNameCol')}</TableHead>
                  <TableHead className="dark:text-gray-400">{t('codeCol')}</TableHead>
                  <TableHead className="dark:text-gray-400">{t('teachersCount')}</TableHead>
                  <TableHead className="dark:text-gray-400">{t('activeClassesCol')}</TableHead>
                  <TableHead className={`${isRTL ? 'text-left' : 'text-right'} dark:text-gray-400`}>{t('actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubjects.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-32 text-center text-gray-500 dark:text-gray-400">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <BookOpen className="h-8 w-8 text-gray-300" />
                        <p>{t('noSubjectsFound')}</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSubjects.map((subject) => (
                    <TableRow key={subject.oid} className="dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <TableCell className="font-semibold text-gray-900 dark:text-white">
                        {subject.name}
                      </TableCell>
                      <TableCell className="text-gray-600 dark:text-gray-300">
                        <code className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-xs uppercase">
                          {subject.code || 'N/A'}
                        </code>
                      </TableCell>
                      <TableCell className="text-gray-600 dark:text-gray-300">
                        <div className="flex items-center gap-2">
                           <span className="font-medium">{subject.teachers?.length || 0}</span>
                           <span className="text-xs text-gray-400">{t('teachersLabel')}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300">
                          {getClassCount(subject.oid)} {t('classesLabel')}
                        </span>
                      </TableCell>
                      <TableCell className={isRTL ? 'text-left' : 'text-right'}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300"
                          onClick={() => navigate(`/admin/subjects/edit/${subject.oid}`)}
                        >
                          {t('edit')}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}