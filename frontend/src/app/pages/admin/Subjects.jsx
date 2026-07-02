import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Plus, Search, BookOpen, Users, Loader2, Pencil, Trash2, X } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '../../lib/api';

export function AdminSubjects() {
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [deletingOid, setDeletingOid] = useState(null);

  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  // ================= FETCH =================
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [subjectsResponse, teachersResponse, classesResponse] = await Promise.all([
          api.subjects.getAll(),
          api.teachers.getAll(),
          api.classes.getAll(),
        ]);

        const subjectsList = subjectsResponse?.success
          ? subjectsResponse.data
          : Array.isArray(subjectsResponse)
          ? subjectsResponse
          : [];
        const teachersList = teachersResponse?.success
          ? teachersResponse.data
          : Array.isArray(teachersResponse)
          ? teachersResponse
          : [];
        const classesList = classesResponse?.success
          ? classesResponse.data
          : Array.isArray(classesResponse)
          ? classesResponse
          : [];

        setSubjects(subjectsList);
        setTeachers(teachersList);
        setClasses(classesList);
      } catch (error) {
        toast.error(t('errorFetchingData') || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [t]);

  // ================= DELETE =================
  const handleDelete = async (subject) => {
    if (!confirm(t('confirmDeleteSubject') || `Delete "${subject.name}"?`)) return;
    setDeletingOid(subject.oid);
    try {
      const res = await api.subjects.delete(subject.oid);
      if (res?.success !== false) {
        setSubjects((prev) => prev.filter((s) => s.oid !== subject.oid));
        toast.success(t('subjectDeleted') || 'Subject deleted');
      } else {
        toast.error(res?.message || t('deleteFailed') || 'Delete failed');
      }
    } catch (error) {
      toast.error(t('deleteFailed') || 'Delete failed');
    } finally {
      setDeletingOid(null);
    }
  };

  // ================= CLASS COUNT =================
  // بيتأكد من كل الأشكال المحتملة اللي ممكن الـ API يرجع بيها ربط المادة بالفصل
  const getClassCount = (subjectOid) => {
    if (!classes?.length) return 0;
    return classes.filter((cls) => {
      return (
        cls.subjects?.some((sub) => sub.oid === subjectOid || sub === subjectOid) ||
        cls.subjectIds?.includes(subjectOid) ||
        cls.subjectOids?.includes(subjectOid) ||
        cls.subject?.oid === subjectOid ||
        cls.subjectOid === subjectOid
      );
    }).length;
  };

  const filteredSubjects = useMemo(() => {
    const q = searchTerm.toLowerCase();
    return subjects.filter(
      (subject) =>
        subject.name?.toLowerCase().includes(q) || subject.code?.toLowerCase().includes(q)
    );
  }, [subjects, searchTerm]);

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="flex h-64 flex-col items-center justify-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
        <p className="animate-pulse text-gray-500">{t('loading')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('subjectsPage')}</h1>
          <p className="mt-1 text-gray-500 dark:text-gray-400">{t('subjectsPageDesc')}</p>
        </div>
        <Button
          onClick={() => navigate('/admin/subjects/add')}
          className="bg-purple-600 hover:bg-purple-700"
        >
          <Plus className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
          {t('addSubjectBtnLabel')}
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {[
          {
            label: t('totalSubjectsCard'),
            value: subjects.length,
            icon: <BookOpen className="h-5 w-5 text-purple-500" />,
          },
          {
            label: t('totalClasses'),
            value: classes.length,
            icon: <Users className="h-5 w-5 text-blue-500" />,
          },
          {
            label: t('teachersAssignedCard'),
            value: teachers.length,
            icon: <Users className="h-5 w-5 text-emerald-500" />,
          },
        ].map(({ label, value, icon }) => (
          <Card key={label} className="shadow-sm dark:border-gray-700 dark:bg-gray-800">
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

      {/* Table Card */}
      <Card className="shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <CardHeader className="mb-4 border-b pb-3 dark:border-gray-700">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <CardTitle className="dark:text-white">
              {t('allSubjectsTitle')}{' '}
              <span className="text-sm font-normal text-muted-foreground">
                ({filteredSubjects.length})
              </span>
            </CardTitle>
            <div className="relative w-full sm:w-64">
              <Search
                className={`absolute ${
                  isRTL ? 'right-3' : 'left-3'
                } top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400`}
              />
              <Input
                placeholder={t('searchSubjectsPlaceholder')}
                className={`${isRTL ? 'pr-10' : 'pl-10'} dark:border-gray-600 dark:bg-gray-700 dark:text-white focus-visible:ring-purple-500`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className={`absolute top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 ${
                    isRTL ? 'left-3' : 'right-3'
                  }`}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
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
                 
                  <TableHead className={`${isRTL ? 'text-left' : 'text-right'} dark:text-gray-400`}>
                    {t('actions')}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubjects.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-32 text-center text-gray-500 dark:text-gray-400">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <BookOpen className="h-8 w-8 text-gray-300" />
                        <p>
                          {searchTerm
                            ? t('noMatchingSubjects') || 'No subjects match your search'
                            : t('noSubjectsFound')}
                        </p>
                        {searchTerm && (
                          <Button variant="outline" size="sm" onClick={() => setSearchTerm('')}>
                            {t('clearFilters') || 'Clear search'}
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSubjects.map((subject) => {
                    const classCount = getClassCount(subject.oid);
                    const isDeleting = deletingOid === subject.oid;
                    return (
                      <TableRow
                        key={subject.oid}
                        className={`dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                          isDeleting ? 'opacity-50' : ''
                        }`}
                      >
                        <TableCell className="font-semibold text-gray-900 dark:text-white">
                          {subject.name}
                        </TableCell>
                        <TableCell className="text-gray-600 dark:text-gray-300">
                          <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs uppercase dark:bg-gray-800">
                            {subject.code || 'N/A'}
                          </code>
                        </TableCell>
                        <TableCell className="text-gray-600 dark:text-gray-300">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{subject.teachers?.length || 0}</span>
                            <span className="text-xs text-gray-400">{t('teachersLabel')}</span>
                          </div>
                        </TableCell>
                       
                        <TableCell className={isRTL ? 'text-left' : 'text-right'}>
                          <div className={`flex items-center gap-1 ${isRTL ? 'justify-start' : 'justify-end'}`}>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-purple-600 hover:bg-purple-50 hover:text-purple-700 dark:text-purple-400 dark:hover:bg-purple-900/20 dark:hover:text-purple-300"
                              onClick={() => navigate(`/admin/subjects/edit/${subject.oid}`)}
                            >
                              <Pencil className={`h-4 w-4 ${isRTL ? 'ml-1.5' : 'mr-1.5'}`} />
                              {t('edit')}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              disabled={isDeleting}
                              className="text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-900/20 dark:hover:text-red-300"
                              onClick={() => handleDelete(subject)}
                            >
                              {isDeleting ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}