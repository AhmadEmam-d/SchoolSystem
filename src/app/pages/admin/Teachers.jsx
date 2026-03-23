import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useTranslation } from 'react-i18next';
import { useMockData } from "@/context/MockDataContext";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table";
import { Plus, Trash2, Search } from "lucide-react";
import { toast } from "sonner";

export function AdminTeachers() {
  const { users, subjects, deleteUser } = useMockData();
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const teachers = users.filter(u => u.role === 'teacher');
  const filteredTeachers = teachers.filter(teacher =>
    teacher.name.toLowerCase().includes(search.toLowerCase()) ||
    teacher.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id) => {
    if (confirm(t('confirmDeleteTeacherMsg'))) {
      deleteUser(id);
      toast.success(t('teacherDeletedMsg'));
    }
  };

  const getSubjectName = (id) => {
    return subjects.find(s => s.id === id)?.name || t('unassigned');
  };

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
              <TableHead className="dark:text-gray-400">{t('subjectCol')}</TableHead>
              <TableHead className={`${isRTL ? 'text-left' : 'text-right'} dark:text-gray-400`}>{t('actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTeachers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center text-gray-500 dark:text-gray-400">
                  {t('noTeachersFound')}
                </TableCell>
              </TableRow>
            ) : (
              filteredTeachers.map((teacher) => (
                <TableRow key={teacher.id} className="dark:border-gray-700">
                  <TableCell className="font-medium text-gray-900 dark:text-white">{teacher.name}</TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-300">{teacher.email}</TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-300">{getSubjectName(teacher.subjectId)}</TableCell>
                  <TableCell className={isRTL ? 'text-left' : 'text-right'}>
                    <div className={`flex ${isRTL ? 'justify-start' : 'justify-end'} gap-2`}>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(teacher.id)}>
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
