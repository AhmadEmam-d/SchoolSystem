import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useTranslation } from 'react-i18next';
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table";
import { Plus, Trash2, Search, Edit, Eye } from "lucide-react";
import { toast } from "sonner";
import { api } from '../../../app/lib/api';

export function AdminTeachers() {
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const teachersResponse = await api.teachers.getAll();
        const subjectsResponse = await api.subjects.getAll();
        
        // استخراج البيانات من الاستجابة
        const teachersList = teachersResponse.success ? teachersResponse.data : (Array.isArray(teachersResponse) ? teachersResponse : []);
        const subjectsList = subjectsResponse.success ? subjectsResponse.data : (Array.isArray(subjectsResponse) ? subjectsResponse : []);
        
        setTeachers(teachersList);
        setSubjects(subjectsList);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error(t('errorFetchingData'));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredTeachers = teachers.filter(teacher =>
    teacher.fullName?.toLowerCase().includes(search.toLowerCase()) ||
    teacher.email?.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id) => {
    if (confirm(t('confirmDeleteTeacherMsg'))) {
      try {
        const result = await api.teachers.delete(id);
        if (result.success) {
          setTeachers(teachers.filter(t => t.oid !== id));
          toast.success(t('teacherDeletedMsg'));
        } else {
          toast.error(result.errors?.[0] || t('errorDeletingTeacher'));
        }
      } catch (error) {
        console.error('Error deleting teacher:', error);
        toast.error(t('errorDeletingTeacher'));
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500 dark:text-gray-400">{t('loading')}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">{t('teachersPage')}</h1>
          <p className="text-gray-500 dark:text-gray-400">{t('teachersPageDesc')}</p>
        </div>
        <Button className="gap-2" onClick={() => navigate('/admin/teachers/add')}>
          <Plus className="h-4 w-4" /> {t('addTeacherBtnLabel')}
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className={`absolute ${isRTL ? 'right-2.5' : 'left-2.5'} top-2.5 h-4 w-4 text-gray-400`} />
          <Input
            placeholder={t('searchTeachersPlaceholder')}
            className={`${isRTL ? 'pr-8' : 'pl-8'} dark:bg-gray-700 dark:border-gray-600 dark:text-white`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="dark:border-gray-700">
              <TableHead className="dark:text-gray-400">{t('nameCol')}</TableHead>
              <TableHead className="dark:text-gray-400">{t('emailCol')}</TableHead>
              <TableHead className="dark:text-gray-400">{t('phoneCol')}</TableHead>
              <TableHead className="dark:text-gray-400">{t('subjectCol')}</TableHead>
              <TableHead className={`${isRTL ? 'text-left' : 'text-right'} dark:text-gray-400`}>{t('actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTeachers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-gray-500 dark:text-gray-400">
                  {t('noTeachersFound')}
                </TableCell>
              </TableRow>
            ) : (
              filteredTeachers.map((teacher) => (
                <TableRow key={teacher.oid} className="dark:border-gray-700">
                  <TableCell className="font-medium text-gray-900 dark:text-white">{teacher.fullName}</TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-300">{teacher.email}</TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-300">{teacher.phone || '-'}</TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-300">
                    {teacher.subjects?.map(s => s.name).join(', ') || t('unassigned')}
                  </TableCell>
                  <TableCell className={isRTL ? 'text-left' : 'text-right'}>
                    <div className={`flex ${isRTL ? 'justify-start' : 'justify-end'} gap-2`}>
                      <Button variant="ghost" size="icon" onClick={() => navigate(`/admin/teachers/${teacher.oid}`)}>
                        <Eye className="h-4 w-4 text-blue-500" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => navigate(`/admin/teachers/edit/${teacher.oid}`)}>
                        <Edit className="h-4 w-4 text-yellow-500" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(teacher.oid)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}